async function api(path, method = 'GET', body) {
  const res = await fetch(path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  return res.json();
}

const form = document.getElementById('student-form');
const tableBody = document.querySelector('#students-table tbody');
const cancelBtn = document.getElementById('cancel');

function resetForm() {
  form.reset();
  document.getElementById('student-id').value = '';
}

async function load() {
  const students = await api('/api/students');
  tableBody.innerHTML = '';
  students.forEach(s => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${s.id}</td>
      <td>${s.name}</td>
      <td>${s.age ?? ''}</td>
      <td>${s.major ?? ''}</td>
      <td>
        <button data-id="${s.id}" class="edit">Edit</button>
        <button data-id="${s.id}" class="delete">Delete</button>
      </td>`;
    tableBody.appendChild(tr);
  });
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('student-id').value;
  const payload = {
    name: document.getElementById('name').value.trim(),
    age: parseInt(document.getElementById('age').value) || null,
    major: document.getElementById('major').value.trim() || null,
  };
  if (!payload.name) return alert('Name is required');
  if (id) {
    await api(`/api/students/${id}`, 'PUT', payload);
  } else {
    await api('/api/students', 'POST', payload);
  }
  resetForm();
  load();
});

cancelBtn.addEventListener('click', (e) => { resetForm(); });

tableBody.addEventListener('click', async (e) => {
  const id = e.target.dataset.id;
  if (!id) return;
  if (e.target.classList.contains('delete')) {
    if (!confirm('Delete this student?')) return;
    await api(`/api/students/${id}`, 'DELETE');
    load();
  } else if (e.target.classList.contains('edit')) {
    const student = await api(`/api/students/${id}`);
    document.getElementById('student-id').value = student.id;
    document.getElementById('name').value = student.name;
    document.getElementById('age').value = student.age ?? '';
    document.getElementById('major').value = student.major ?? '';
  }
});

load();
