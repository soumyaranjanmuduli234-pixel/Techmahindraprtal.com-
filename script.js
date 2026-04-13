// LOAD DATA
let employees = JSON.parse(localStorage.getItem("employees")) || [];

// ADMIN LOGIN
const ADMIN_ID = "TECH4145004001";
const ADMIN_PASS = "Soumya@7890";


// ================= LOGIN =================
function login() {
  let id = document.getElementById("loginId").value.trim();
  let pass = document.getElementById("loginPass").value.trim();

  // ADMIN LOGIN
  if (id === ADMIN_ID && pass === ADMIN_PASS) {
    success("Admin Login ✅");
    openDashboard();
    return;
  }

  // EMPLOYEE LOGIN
  let user = employees.find(e => e.id === id && e.pass === pass);

  if (user) {
    success("Login Successful 🎉");
    openDashboard();
  } else {
    document.getElementById("loginMsg").innerText = "❌ Invalid ID or Password";
  }
}


// ================= ADMIN CHECK =================
function checkAdmin() {
  let id = document.getElementById("loginId").value.trim();
  let pass = document.getElementById("loginPass").value.trim();

  if (id === ADMIN_ID && pass === ADMIN_PASS) {
    showRegister();
  } else {
    alert("❌ Only Admin Allowed");
  }
}


// ================= SHOW REGISTER =================
function showRegister() {
  document.getElementById("loginPage").classList.add("hidden");
  document.getElementById("registerPage").classList.remove("hidden");
}

function backLogin() {
  document.getElementById("registerPage").classList.add("hidden");
  document.getElementById("loginPage").classList.remove("hidden");
}


// ================= REGISTER EMPLOYEE =================
function registerEmp() {
  let name = document.getElementById("regName").value.trim();
  let role = document.getElementById("regRole").value.trim();
  let phone = document.getElementById("regPhone").value.trim();
  let dob = document.getElementById("regDob").value;
  let pass = document.getElementById("regPass").value.trim();

  if (!name || !role || !phone || !dob || !pass) {
    alert("⚠️ Fill all fields");
    return;
  }

  let birth = new Date(dob);
  let today = new Date();
  let age = today.getFullYear() - birth.getFullYear();

  if (age < 18) {
    alert("❌ Employee must be 18+");
    return;
  }

  let id = "TECHF" + Math.floor(100000000000 + Math.random() * 900000000000);

  employees.push({
    id: id,
    pass: pass,
    name: name,
    role: role,
    phone: phone,
    dob: dob,
    age: age,
    present: false,
    inTime: "",
    outTime: "",
    date: ""
  });

  localStorage.setItem("employees", JSON.stringify(employees));

  document.getElementById("genResult").innerHTML =
    `✅ Created<br>ID: ${id}<br>Password: ${pass}<br>Age: ${age}`;
}


// ================= DASHBOARD =================
function openDashboard() {
  document.getElementById("loginPage").classList.add("hidden");
  document.getElementById("dashboard").classList.remove("hidden");

  showPage("home");
  updateHome();
}


// ================= HOME =================
function updateHome() {
  document.getElementById("homePage").innerHTML = `
    <div class="card">
      <h2 id="time"></h2>
      <p>🕘 Join: 9:00 - 10:00 AM</p>
      <p>🍴 Lunch: 12:30 - 2:30 PM</p>
      <p>🚪 Exit: 7:00 - 7:30 PM</p>
    </div>
  `;
}


// ================= CLOCK =================
setInterval(() => {
  let now = new Date();
  let t = document.getElementById("time");

  if (t) t.innerText = now.toLocaleTimeString();

  if (now.getHours() === 12 && now.getMinutes() === 30) {
    alert("🍴 Lunch Time Started!");
  }
}, 1000);


// ================= PAGE SWITCH =================
function showPage(page, event) {
  document.querySelectorAll(".main > div").forEach(d => d.classList.add("hidden"));
  document.getElementById(page + "Page").classList.remove("hidden");

  if (event) {
    document.querySelectorAll(".sidebar button").forEach(btn => btn.classList.remove("active"));
    event.target.classList.add("active");
  }

  if (page === "employees") renderEmployees();
  if (page === "attendance") renderAttendance();
}


// ================= EMPLOYEE LIST =================
function renderEmployees() {
  let list = document.getElementById("empList");
  list.innerHTML = "";

  employees.forEach(emp => {
    list.innerHTML += `
      <div class="card">
        <b>${emp.name}</b><br>
        ID: ${emp.id}<br>
        Role: ${emp.role}<br>
        📱 ${emp.phone}<br>
        🎂 ${emp.dob} (Age: ${emp.age})<br><br>

        <button onclick="deleteEmp('${emp.id}')">🗑 Delete</button>
      </div>
    `;
  });
}


// ================= DELETE =================
function deleteEmp(id) {
  let confirmDelete = confirm("Delete this employee?");

  if (confirmDelete) {
    employees = employees.filter(emp => emp.id !== id);

    localStorage.setItem("employees", JSON.stringify(employees));

    renderEmployees();

    success("Employee Deleted ❌");
  }
}


// ================= ATTENDANCE =================
function renderAttendance() {
  let div = document.getElementById("attendanceList");
  div.innerHTML = "";

  employees.forEach(emp => {
    div.innerHTML += `
      <div class="card">
        <b>${emp.name}</b><br>
        Status: ${emp.present ? "Present" : "Absent"}<br>
        In: ${emp.inTime || "-"}<br>
        Out: ${emp.outTime || "-"}<br><br>

        <button onclick="markIn('${emp.id}')">IN</button>
        <button onclick="markOut('${emp.id}')">OUT</button>
      </div>
    `;
  });
}


// ================= MARK IN =================
function markIn(id) {
  let emp = employees.find(e => e.id === id);
  let now = new Date();

  emp.present = true;
  emp.inTime = now.toLocaleTimeString();
  emp.date = now.toLocaleDateString();

  save();
}


// ================= MARK OUT =================
function markOut(id) {
  let emp = employees.find(e => e.id === id);

  emp.outTime = new Date().toLocaleTimeString();

  save();
}


// ================= SAVE =================
function save() {
  localStorage.setItem("employees", JSON.stringify(employees));
  renderAttendance();
}


// ================= PDF REPORT =================
function downloadReport() {

  const { jsPDF } = window.jspdf;
  let doc = new jsPDF();

  let y = 20;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("TECH MAHINDRA", 70, y);

  y += 10;

  doc.setFontSize(12);
  doc.text("Employee Monthly Report", 70, y);

  y += 15;

  doc.setFontSize(11);
  doc.text("Dear Team Leader Soumya Sir,", 10, y);

  y += 10;
  doc.text("Here is the employee attendance report:", 10, y);

  y += 10;

  employees.forEach((emp, index) => {

    doc.setFont("helvetica", "bold");
    doc.text(`Employee ${index + 1}`, 10, y);
    y += 7;

    doc.setFont("helvetica", "normal");

    doc.text(`Name: ${emp.name}`, 10, y); y += 6;
    doc.text(`ID: ${emp.id}`, 10, y); y += 6;
    doc.text(`Role: ${emp.role}`, 10, y); y += 6;
    doc.text(`Status: ${emp.present ? "Present" : "Absent"}`, 10, y); y += 6;
    doc.text(`In Time: ${emp.inTime || "N/A"}`, 10, y); y += 6;
    doc.text(`Out Time: ${emp.outTime || "N/A"}`, 10, y); y += 10;

    if (y > 270) {
      doc.addPage();
      y = 20;
    }
  });

  y += 10;
  doc.text("Thank You,", 10, y);
  y += 6;
  doc.text("Tech Mahindra Management", 10, y);

  doc.save("Tech_Mahindra_Report.pdf");
}


// ================= THEME =================
function toggleTheme() {
  document.body.classList.toggle("light");
}


// ================= LOGOUT =================
function logout() {
  location.reload();
}


// ================= POPUP =================
function success(msg) {
  let div = document.createElement("div");
  div.className = "glass-popup";
  div.innerText = msg;

  document.body.appendChild(div);

  setTimeout(() => div.remove(), 2000);
}