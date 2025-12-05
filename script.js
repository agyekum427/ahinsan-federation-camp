// ================= ADMIN BUTTON PASSWORD CHECK ==================
const adminBtn = document.getElementById("adminBtn");

if (adminBtn) {
  adminBtn.addEventListener("click", function () {
    const password = prompt("Enter admin password:");

    if (password === "youth camp 2025") {
      window.location.href = "admin.html";
    } else {
      alert("Incorrect password!");
    }
  });
}


// ======================= REGISTRATION PAGE ==========================

const form = document.getElementById("regForm");

if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const entry = {
      name: document.getElementById("name").value,
      sex: document.getElementById("sex").value,
      allergies: document.getElementById("allergies").value,
      phone: document.getElementById("phone").value,
      emergency: document.getElementById("emergency").value,
      nhis: document.getElementById("nhis").value,
      church: document.getElementById("church").value,
      district: document.getElementById("district").value
    };

    let allData = JSON.parse(localStorage.getItem("campData")) || [];
    allData.push(entry);
    localStorage.setItem("campData", JSON.stringify(allData));

    alert("Registration submitted successfully!");
    form.reset();
  });
}



// ======================= ADMIN FUNCTIONS ============================

// LOAD TABLE
function loadTable() {
  if (!document.getElementById("users-table-body")) return;

  const users = JSON.parse(localStorage.getItem("campData")) || [];
  const tableBody = document.getElementById("users-table-body");
  tableBody.innerHTML = "";

  users.forEach((u, i) => {
    tableBody.innerHTML += `
      <tr>
        <td>${i + 1}</td>
        <td>${u.name}</td>
        <td>${u.sex}</td>
        <td>${u.allergies}</td>
        <td>${u.phone}</td>
        <td>${u.emergency}</td>
        <td>${u.nhis}</td>
        <td>${u.church}</td>
        <td>${u.district}</td>
        <td>
          <button class="action-btn edit-btn" onclick="editUser(${i})">Edit</button>
          <button class="action-btn delete-btn" onclick="deleteUser(${i})">Delete</button>
        </td>
      </tr>
    `;
  });

  updateStats();
}



// UPDATE STATS
function updateStats() {
  let users = JSON.parse(localStorage.getItem("campData")) || [];

  let total = users.length;
  let males = users.filter(u => u.sex.toLowerCase() === "male").length;
  let females = users.filter(u => u.sex.toLowerCase() === "female").length;

  document.getElementById("totalCount").textContent = total;
  document.getElementById("maleCount").textContent = males;
  document.getElementById("femaleCount").textContent = females;
}



// DELETE USER
function deleteUser(index) {
  let users = JSON.parse(localStorage.getItem("campData")) || [];

  if (!confirm("Are you sure you want to delete this entry?")) return;

  users.splice(index, 1);
  localStorage.setItem("campData", JSON.stringify(users));

  loadTable();
}



// EDIT USER
function editUser(index) {
  let users = JSON.parse(localStorage.getItem("campData")) || [];
  let u = users[index];

  let newName = prompt("Edit Name:", u.name);
  if (newName === null) return;

  let newSex = prompt("Edit Sex:", u.sex);
  let newAllergies = prompt("Edit Allergies:", u.allergies);
  let newPhone = prompt("Edit Phone:", u.phone);
  let newEmergency = prompt("Edit Emergency:", u.emergency);
  let newNhis = prompt("Edit NHIS:", u.nhis);
  let newChurch = prompt("Edit Church:", u.church);
  let newDistrict = prompt("Edit District:", u.district);

  users[index] = {
    name: newName,
    sex: newSex,
    allergies: newAllergies,
    phone: newPhone,
    emergency: newEmergency,
    nhis: newNhis,
    church: newChurch,
    district: newDistrict
  };

  localStorage.setItem("campData", JSON.stringify(users));
  loadTable();
}



// ======================= SORTING ===========================

function sortByNameAZ() {
  let users = JSON.parse(localStorage.getItem("campData")) || [];
  users.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
  localStorage.setItem("campData", JSON.stringify(users));
  loadTable();
}

function sortByNameZA() {
  let users = JSON.parse(localStorage.getItem("campData")) || [];
  users.sort((a, b) => b.name.toLowerCase().localeCompare(a.name.toLowerCase()));
  localStorage.setItem("campData", JSON.stringify(users));
  loadTable();
}



// ======================= SEARCH FILTER =====================

const searchBox = document.getElementById("searchBox");
if (searchBox) {
  searchBox.addEventListener("keyup", searchFilter);
}

function searchFilter() {
  let filter = searchBox.value.toLowerCase();
  let rows = document.querySelectorAll("#dataTable tbody tr");

  rows.forEach(row => {
    let text = row.innerText.toLowerCase();
    row.style.display = text.includes(filter) ? "" : "none";
  });
}



// ======================= PDF DOWNLOAD ======================

function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();

  pdf.text("Registered Members", 10, 10);

  const rows = [];
  const tableRows = document.querySelectorAll("#dataTable tbody tr");

  tableRows.forEach(tr => {
    if (tr.style.display !== "none") {
      const cells = [...tr.children].slice(0, 9).map(td => td.innerText);
      rows.push(cells);
    }
  });

  pdf.autoTable({
    head: [["#", "Name", "Sex", "Allergies", "Phone", "Emergency", "NHIS", "Church", "District"]],
    body: rows,
    startY: 20
  });

  pdf.save("Registered_Members.pdf");
}



// AUTO LOAD
window.onload = loadTable;