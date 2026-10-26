const params = new URLSearchParams(window.location.search);
const patientNumber = params.get("number");

const patientNumberElement = document.getElementById("patientNumber");
const patientNameElement = document.getElementById("patientName");
const recordList = document.getElementById("recordList");
const addRecordBtn = document.getElementById("addRecordBtn");

function loadPatients() {
    try {
        const raw = localStorage.getItem("patients");
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        console.error("患者データの読み込みに失敗:", error);
        alert("患者データを読み込めませんでした。");
        return [];
    }
}

let patients = loadPatients();
const patient = patients.find(p => String(p.number) === String(patientNumber));

if (!patientNumber || !patient) {
    patientNumberElement.textContent = patientNumber || "未指定";
    patientNameElement.textContent = "患者が見つかりません";
    addRecordBtn.disabled = true;
} else {
    patientNumberElement.textContent = patient.number;
    patientNameElement.textContent = patient.name || "";
    if (!Array.isArray(patient.records)) patient.records = [];
}

addRecordBtn.addEventListener("click", () => {
    if (!patient) {
        alert("患者が見つかりません。患者一覧または検索画面から患者を開き直してください。");
        return;
    }

    const date = document.getElementById("date").value;
    const therapist = document.getElementById("therapist").value.trim();
    const soap = document.getElementById("soap").value.trim();

    if (!date || !therapist || !soap) {
        alert("介入日・担当療法士・SOAP記録を入力してください。");
        return;
    }

    if (!Array.isArray(patient.records)) patient.records = [];
    const record = { date, therapist, soap };
    patient.records.push(record);

    try {
        localStorage.setItem("patients", JSON.stringify(patients));
        // 保存直後に読み戻し、保存できたことを確認する
        const check = JSON.parse(localStorage.getItem("patients") || "[]");
        const savedPatient = check.find(p => String(p.number) === String(patientNumber));
        if (!savedPatient || !Array.isArray(savedPatient.records) ||
            !savedPatient.records.some(r => r.date === date && r.therapist === therapist && r.soap === soap)) {
            patient.records.pop();
            alert("保存を確認できませんでした。入力内容は消さずに残します。");
            return;
        }
    } catch (error) {
        patient.records.pop();
        console.error("記録の保存に失敗:", error);
        alert("記録を保存できませんでした。入力内容は消さずに残します。");
        return;
    }

    renderRecords();
    document.getElementById("date").value = "";
    document.getElementById("therapist").value = "";
    document.getElementById("soap").value = `S:

O:

A:

P:`;
    alert("記録を保存しました。");
});

function renderRecords() {
    recordList.replaceChildren();
    if (!patient || !Array.isArray(patient.records)) return;

    patient.records.forEach(record => {
        const tr = document.createElement("tr");
        const dateTd = document.createElement("td");
        dateTd.textContent = record.date || "";
        const therapistTd = document.createElement("td");
        therapistTd.textContent = record.therapist || "";
        const soapTd = document.createElement("td");
        soapTd.textContent = record.soap || "";
        soapTd.style.whiteSpace = "pre-wrap";
        tr.append(dateTd, therapistTd, soapTd);
        recordList.appendChild(tr);
    });
}

document.getElementById("backToSearch").addEventListener("click", () => {
    window.location.href = "search.html";
});
document.getElementById("backToPatients").addEventListener("click", () => {
    window.location.href = "register.html";
});

renderRecords();
