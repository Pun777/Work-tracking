const SHEET_URL = 'https://script.google.com/macros/s/AKfycbyvt2o4xH-ORSqxJtsSxQbg8pOZ2Vc7o2_HmS_JScM3Ny47QQymckKN2LRVYTZizEux/exec';


fetch(SHEET_URL)
  .then((res) => res.json())
  .then((tasks) => {
    const tbody = document.getElementById("task-detail-body");
    tbody.innerHTML = "";

    tasks.forEach((t, i) => {
      const start = parseDate(t["วันที่เริ่มงาน"]);
      const expected = parseDate(t["วันที่คาดว่าจะเสร็จ"]);
      const actual = parseDate(t["วันที่เสร็จงานจริง"]);
      const status = t["สถานะ"] || "-";

      const today = new Date();
      let diff = "";
      let colorClass = "";

      if (status === "เสร็จแล้ว" && actual) {
        const delay = dayDiff(expected, actual);
        diff = delay === 0 ? "ตรงเวลา" : delay > 0 ? `ช้า ${delay} วัน` : `เร็ว ${-delay} วัน`;
        colorClass = delay > 0 ? "late" : "done";
      } else if (status !== "เสร็จแล้ว" && expected) {
        const remain = dayDiff(today, expected);
        diff = remain >= 0 ? `เหลือ ${remain} วัน` : `เกิน ${-remain} วัน`;
        colorClass = remain >= 3 ? "in-time" : remain >= 0 ? "warning" : "late";
      }

      tbody.innerHTML += `
        <tr class="${colorClass}">
          <td>${i + 1}</td>
          <td>${t["ชื่อโปรเจค"]}</td>
          <td>${t["งานที่ต้องทำ"]}</td>
          <td>${t["% ความคืบหน้า"] || "-"}</td>
          <td>${t["ผู้รับผิดชอบ"]}</td>
          <td>${t["วันที่เริ่มงาน"]}</td>
          <td>${t["วันที่คาดว่าจะเสร็จ"]}</td>
          <td>${t["วันที่เสร็จงานจริง"] || "-"}</td>
          <td>${status}</td>
          <td>${diff}</td>
        </tr>
      `;
    });
  })
  .catch((err) => {
    console.error("โหลดข้อมูลล้มเหลว:", err);
  });

function parseDate(dateStr) {
  if (!dateStr || typeof dateStr !== "string") return null;
  const parts = dateStr.split("/");
  if (parts.length === 3) {
    const day = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1;
    const year = parseInt(parts[2]) + 2000 - 543;
    return new Date(year, month, day);
  }
  return null;
}

function dayDiff(a, b) {
  const diffTime = b - a;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
