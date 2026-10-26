const addBtn = document.getElementById("addBtn");
const patientList = document.getElementById("patientList");

let patients = [];

// 保存データ読み込み
const savedPatients = localStorage.getItem("patients");

if (savedPatients) {
patients = JSON.parse(savedPatients);
renderPatients();
}

addBtn.addEventListener("click", () => {

const number = document.getElementById("number").value;
const name = document.getElementById("name").value;
const gender = document.querySelector('input[name="gender"]:checked')?.value;
const age = document.getElementById("age").value;
const start = document.getElementById("start").value;
const disease = document.getElementById("disease").value;

const patient = {
number,
name,
gender,
age,
start,
disease,
records:[]//リハ記録追加の箱
};

patients.push(patient);

// localStorage保存
localStorage.setItem("patients", JSON.stringify(patients));

renderPatients();
});

function renderPatients() {

patientList.innerHTML = "";

patients.forEach((patient) => {

const tr = document.createElement("tr");

tr.innerHTML =`
<td>${patient.number}</td>
<td>${patient.name}</td>
<td>${patient.gender}</td>
<td>${patient.age}</td>
<td>${patient.start}</td>
<td>${patient.disease}</td>
`; 

tr.style.cursor = "pointer";

tr.addEventListener("click", () => {
window.location.href = "record.html?name=" + patient.name + "&number=" + patient.number;
});

const deleteBtn = document.createElement("button");
deleteBtn.textContent = "削除";

const tdDelete = document.createElement("td");
tdDelete.appendChild(deleteBtn);

tr.appendChild(tdDelete);


patientList.appendChild(tr);

deleteBtn.addEventListener("click", (event) => {

event.stopPropagation();

const index = patients.indexOf(patient);

patients.splice(index, 1);

localStorage.setItem("patients", JSON.stringify(patients));

renderPatients();

});

});

}