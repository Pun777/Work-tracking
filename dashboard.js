const SHEET_URL =
  "https://script.google.com/macros/s/AKfycbyvt2o4xH-ORSqxJtsSxQbg8pOZ2Vc7o2_HmS_JScM3Ny47QQymckKN2LRVYTZizEux/exec";

let allTasks = [];
let chart;

fetch(SHEET_URL)
  .then((res) => res.json())
  .then((data) => {
    allTasks = data;
    const projectNames = [...new Set(data.map((t) => t["ชื่อโปรเจค"]))];

    const select = document.getElementById("project-select");
    projectNames.forEach((name) => {
      const opt = document.createElement("option");
      opt.value = name;
      opt.textContent = name;
      select.appendChild(opt);
    });

    select.addEventListener("change", () => {
      renderDashboard(select.value);
    });

    // โหลดครั้งแรก
    renderDashboard(projectNames[0]);
  })
  .catch((err) => {
    console.error("โหลดข้อมูลล้มเหลว:", err);
  });

function renderDashboard(project) {
  const tasks = allTasks.filter((t) => t["ชื่อโปรเจค"] === project);
  const summary = { total: 0, inTime: 0, late: 0, done: 0 };
  const responsibleMap = {};
  const tbody = document.getElementById("task-table-body");
  tbody.innerHTML = "";

  tasks.forEach((t) => {
    summary.total++;
    const status = t["สถานะ"];
    if (status === "เสร็จแล้ว") summary.done++;
    else if (status === "อยู่ในกำหนด") summary.inTime++;
    else if (status === "เกินกำหนด") summary.late++;

    const owner = t["ผู้รับผิดชอบ"];
    if (!responsibleMap[owner]) responsibleMap[owner] = 0;
    responsibleMap[owner]++;

    tbody.innerHTML += `
      <tr>
        <td>${t["ชื่อโปรเจค"]}</td>
        <td>${t["งานที่ต้องทำ"]}</td>
        <td>${t["ผู้รับผิดชอบ"]}</td>
        <td>${t["% ความคืบหน้า"] || "-"}</td>
        <td>${t["วันที่เริ่มงาน"]}</td>
        <td>${t["วันที่สิ้นสุด"]}</td>
        <td>${t["สถานะ"]}</td>
      </tr>
    `;
  });

  document.getElementById("total").textContent = summary.total;
  document.getElementById("in-time").textContent = summary.inTime;
  document.getElementById("late").textContent = summary.late;
  document.getElementById("done").textContent = summary.done;

  updateChart(responsibleMap);
}

function updateChart(dataMap) {
  const ctx = document.getElementById("responsible-chart").getContext("2d");
  const labels = Object.keys(dataMap);
  const values = Object.values(dataMap);

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "จำนวนงาน",
          data: values,
          backgroundColor: "#42a5f5",
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: { display: true, text: "งานแยกตามผู้รับผิดชอบ" },
      },
      scales: {
        y: { beginAtZero: true },
      },
    },
  });
}
