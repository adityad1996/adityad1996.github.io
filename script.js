let rowCount = 0;

function toggleTheme() {
  const current = document.body.getAttribute("data-theme");
  const newTheme = current === "dark" ? "light" : "dark";
  document.body.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
}

function calculateRate(ctc, hike, margin) {
  const updated = ctc * (1 + hike / 100);
  const monthly = updated / 12;
  const withMargin = monthly * (1 + margin / 100);
  return withMargin.toFixed(2);
}

function calculateRateCard() {
  const skills = document.getElementById("skills").value;
  const experience = document.getElementById("experience").value;
  const lowerCTC = parseFloat(document.getElementById("lowerCTC").value);
  const upperCTC = parseFloat(document.getElementById("upperCTC").value);
  const hike = parseFloat(document.getElementById("expectedHike").value);
  const margin = parseFloat(document.getElementById("margin").value);

  const lowerRate = calculateRate(lowerCTC, hike, margin);
  const upperRate = calculateRate(upperCTC, hike, margin);
  const range = `${lowerRate} - ${upperRate}`;

  const row = `<tr>
    <td>${++rowCount}</td>
    <td>${skills}</td>
    <td>${experience}</td>
    <td>${range}</td>
  </tr>`;
  document.querySelector("#standard-table tbody").insertAdjacentHTML('beforeend', row);
}

function copyTable(id) {
  const table = document.getElementById(id);
  navigator.clipboard.writeText(table.innerText).then(() => {
    const msgId = id.includes("bulk") ? "copy-msg-bulk" : "copy-msg-standard";
    const msg = document.getElementById(msgId);
    msg.classList.add("show");
    setTimeout(() => msg.classList.remove("show"), 1500);
  });
}

function processCSV() {
  const file = document.getElementById("csv-file").files[0];
  const hike = parseFloat(document.getElementById("bulk-hike").value);
  const margin = parseFloat(document.getElementById("bulk-margin").value);

  const reader = new FileReader();
  reader.onload = function(e) {
    const lines = e.target.result.split("\n").filter(line => line.trim());
    let bulkRows = "";
    for (let i = 1; i < lines.length; i++) {
      const [num, skills, exp, ctc] = lines[i].split(",");
      const rate = calculateRate(parseFloat(ctc), hike, margin);
      bulkRows += `<tr><td>${i}</td><td>${skills}</td><td>${exp}</td><td>${rate}</td></tr>`;
    }
    document.querySelector("#bulk-table tbody").innerHTML = bulkRows;
  };
  reader.readAsText(file);
}

function resetStandard() {
  document.querySelectorAll("#standard-tab input").forEach(el => el.value = "");
  document.querySelector("#standard-table tbody").innerHTML = "";
  rowCount = 0;
}

function resetBulk() {
  document.getElementById("csv-file").value = "";
  document.getElementById("bulk-hike").value = "";
  document.getElementById("bulk-margin").value = "";
  document.querySelector("#bulk-table tbody").innerHTML = "";
}

window.onload = () => {
  const theme = localStorage.getItem("theme") || "light";
  document.body.setAttribute("data-theme", theme);

  document.querySelectorAll("nav ul li").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll("nav ul li").forEach(t => t.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById(`${tab.dataset.tab}-tab`).classList.add("active");
    });
  });

  document.getElementById("hamburger").addEventListener("click", () => {
    document.getElementById("nav-menu").classList.toggle("hidden");
  });
};
