const SHEET_URL =
  "https://script.google.com/macros/s/AKfycbyvt2o4xH-ORSqxJtsSxQbg8pOZ2Vc7o2_HmS_JScM3Ny47QQymckKN2LRVYTZizEux/exec";

fetch(SHEET_URL)
  .then((res) => res.json())
  .then((tasks) => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth(); // 0-indexed
    renderCalendar(tasks, year, month);
  })
  .catch((err) => {
    console.error("โหลดข้อมูลล้มเหลว:", err);
  });

function renderCalendar(tasks, year, month) {
  const monthNames = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม",
    "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
  ];

  document.getElementById("month-label").textContent = `${monthNames[month]} ${year + 543}`;

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const grid = document.getElementById("calendar-grid");
  grid.innerHTML = "";

  // ช่องว่างก่อนวันเริ่ม
  for (let i = 0; i < firstDay; i++) {
    grid.innerHTML += `<div class="calendar-cell empty"></div>`;
  }

  // วันในเดือน
  for (let date = 1; date <= daysInMonth; date++) {
    const fullDate = new Date(year, month, date).toISOString().split("T")[0];
    const taskList = tasks.filter((t) => {
      const taskDate = new Date(t["วันที่เริ่มงาน"]);
      return (
        taskDate.getFullYear() === year &&
        taskDate.getMonth() === month &&
        taskDate.getDate() === date
      );
    });

    const htmlTasks = taskList
      .map((t) => `<div>• ${t["งานที่ต้องทำ"]}</div>`)
      .join("");

    grid.innerHTML += `
      <div class="calendar-cell">
        <strong>${date}</strong>
        ${htmlTasks}
      </div>
    `;
  }
}
