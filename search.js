const searchButton = document.getElementById("searchButton");

searchButton.addEventListener("click", () => {
    const searchNumber = document.getElementById("searchNumber").value.trim();
    const searchName = document.getElementById("searchName").value.trim();

    let patients;
    try {
        const raw = localStorage.getItem("patients");
        patients = raw ? JSON.parse(raw) : [];
        if (!Array.isArray(patients)) patients = [];
    } catch (error) {
        console.error("患者データの読み込みに失敗:", error);
        alert("患者データを読み込めませんでした。");
        return;
    }

    const results = patients.filter(patient => {
        const numberMatch = searchNumber === "" || String(patient.number) === searchNumber;
        const nameMatch = searchName === "" || String(patient.name || "").includes(searchName);
        return numberMatch && nameMatch;
    });

    const result = document.getElementById("result");
    result.replaceChildren();

    if (results.length === 0) {
        const message = document.createElement("p");
        message.textContent = "該当する患者が見つかりません。";
        result.appendChild(message);
        return;
    }

    results.forEach(patient => {
        const div = document.createElement("div");
        const details = document.createElement("p");
        details.textContent = `病歴番号：${patient.number}
氏名：${patient.name}
性別：${patient.gender || ""}
傷病名：${patient.disease || ""}`;
        details.style.whiteSpace = "pre-line";
        div.appendChild(details);

        const button = document.createElement("button");
        button.type = "button";
        button.textContent = "この患者を開く";
        button.addEventListener("click", () => {
            const query = new URLSearchParams({ number: String(patient.number) });
            window.location.href = `record.html?${query.toString()}`;
        });
        div.appendChild(button);
        div.appendChild(document.createElement("hr"));
        result.appendChild(div);
    });
});

document.getElementById("backToHome").addEventListener("click", () => {
    window.location.href = "index.php";
});
