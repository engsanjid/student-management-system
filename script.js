let students = JSON.parse(localStorage.getItem('students')) || [];
const MAX = 100;

document.addEventListener('DOMContentLoaded', () => {
  // Page-specific logic to attach event listeners
  const currentPath = window.location.pathname.split('/').pop();
  if (currentPath === 'add.html') {
    const addForm = document.getElementById('addForm');
    if (addForm) {
      addForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addStudent();
      });
    }
  } else if (currentPath === 'find.html') {
    const fRoll = document.getElementById('findRollForm');
    const fName = document.getElementById('findNameForm');
    if (fRoll) fRoll.addEventListener('submit', findByRoll);
    if (fName) fName.addEventListener('submit', findByName);
  } else if (currentPath === 'delete.html') {
    const delForm = document.getElementById('deleteForm');
    if (delForm) delForm.addEventListener('submit', deleteStudent);
  } else if (currentPath === 'display.html') {
    displayStudents();
  } else if (currentPath === 'profile.html') {
    displayProfile();
  }
});

function isUniqueRoll(roll) {
  return !students.some(student => student.roll === roll);
}

function addStudent() {
  const firstNameInput = document.getElementById("firstName");
  const rollInput = document.getElementById("roll");
  const cgpaInput = document.getElementById("cgpa");

  const firstName = firstNameInput.value.trim();
  const roll = rollInput.value.trim();
  const cgpa = parseFloat(cgpaInput.value);

  if (!firstName || !roll || isNaN(cgpa)) {
    alert("Please fill all fields.");
    return;
  }

  if (!isUniqueRoll(roll)) {
    alert("Roll number already exists!");
    return;
  }

  if (students.length >= MAX) {
    alert("Student limit reached!");
    return;
  }

  students.push({ firstName, roll, cgpa });
  localStorage.setItem('students', JSON.stringify(students));
  alert("Student added successfully.");
  firstNameInput.value = "";
  rollInput.value = "";
  cgpaInput.value = "";
}

function findByRoll(event) {
  event.preventDefault();
  const roll = document.getElementById("findRoll").value.trim();
  const student = students.find(s => s.roll === roll);
  const findResult = document.getElementById("findResult");

  if (student) {
    findResult.innerHTML = `
      <div class="card">
        <h4>Student Found!</h4>
        <p><strong>Name:</strong> ${student.firstName}</p>
        <p><strong>Roll:</strong> ${student.roll}</p>
        <p><strong>CGPA:</strong> ${student.cgpa.toFixed(2)}</p>
      </div>
    `;
  } else {
    findResult.innerHTML = `<p>Student with roll number "${roll}" not found.</p>`;
  }
}

function findByName(event) {
  event.preventDefault();
  const name = document.getElementById("findName").value.trim();
  const found = students.filter(s => s.firstName.toLowerCase() === name.toLowerCase());
  const findResult = document.getElementById("findResult");

  if (found.length > 0) {
    findResult.innerHTML = `<h4>Found ${found.length} Student(s)</h4>`;
    found.forEach(student => {
      findResult.innerHTML += `
        <div class="card">
          <p><strong>Name:</strong> ${student.firstName}</p>
          <p><strong>Roll:</strong> ${student.roll}</p>
          <p><strong>CGPA:</strong> ${student.cgpa.toFixed(2)}</p>
        </div>
      `;
    });
  } else {
    findResult.innerHTML = `<p>No student found with the name "${name}".</p>`;
  }
}

function deleteStudent(event) {
  event.preventDefault();
  const rollInput = document.getElementById("deleteRoll");
  const roll = rollInput.value.trim();
  const initialLength = students.length;

  students = students.filter(s => s.roll !== roll);

  if (students.length < initialLength) {
    localStorage.setItem('students', JSON.stringify(students));
    alert("Student deleted successfully.");
    rollInput.value = "";
  } else {
    alert("Student with that roll number not found.");
  }
}

function displayStudents() {
  const studentList = document.getElementById("studentList");
  if (!studentList) return;

  studentList.innerHTML = ''; // Clear previous content

  if (students.length === 0) {
    studentList.innerHTML = '<li style="text-align: center; color: #666; padding: 20px;">No students added yet.</li>';
    return;
  }

  const sortedStudents = [...students].sort((a, b) => a.firstName.localeCompare(b.firstName));

  sortedStudents.forEach(student => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${student.firstName}</strong> (${student.roll}) - CGPA: ${student.cgpa.toFixed(2)}`;
    li.style.cursor = 'pointer';
    li.addEventListener('click', () => {
      localStorage.setItem('currentProfileRoll', student.roll);
      window.location.href = 'profile.html';
    });
    studentList.appendChild(li);
  });
}

function displayProfile() {
  const roll = localStorage.getItem('currentProfileRoll');
  const profileData = document.getElementById('profileData');

  if (!roll || !profileData) {
    profileData.innerHTML = `<h3>Error: Student not found.</h3>`;
    return;
  }

  const student = students.find(s => s.roll === roll);

  if (student) {
    profileData.innerHTML = `
      <h3>Student Profile</h3>
      <p><strong>First Name:</strong> ${student.firstName}</p>
      <p><strong>Roll Number:</strong> ${student.roll}</p>
      <p><strong>CGPA:</strong> ${student.cgpa.toFixed(2)}</p>
    `;
  } else {
    profileData.innerHTML = `<h3>Student with roll number "${roll}" not found.</h3>`;
  }
}