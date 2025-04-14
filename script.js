let log = JSON.parse(localStorage.getItem("logNabung")) || [];

function tambahTabungan() {
  const today = new Date().toLocaleDateString("id-ID");
  const sudahNabung = log.some(entry => entry.tanggal === today);

  if (sudahNabung) {
    alert("Kamu sudah nabung hari ini!");
    return;
  }

  log.push({ tanggal: today, jumlah: 20000 });
  localStorage.setItem("logNabung", JSON.stringify(log));
  updateUI();
}

function exportData() {
  const data = log.map(entry => `${entry.tanggal}: Rp ${entry.jumlah.toLocaleString("id-ID")}`).join("\n");
  const blob = new Blob([data], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "riwayat-tabungan.txt";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function updateUI() {
  const total = log.reduce((sum, entry) => sum + entry.jumlah, 0);
  document.getElementById("total").innerText = `Rp ${total.toLocaleString("id-ID")}`;

  const logEl = document.getElementById("logNabung");
  logEl.innerHTML = "";
  log.slice().reverse().forEach(entry => {
    const li = document.createElement("li");
    li.textContent = `${entry.tanggal}: Rp ${entry.jumlah.toLocaleString("id-ID")}`;
    logEl.appendChild(li);
  });

  updateChart();
}

function updateChart() {
  const ctx = document.getElementById("chart").getContext("2d");
  const dates = log.map(e => e.tanggal);
  const values = log.map(e => e.jumlah);

  if (window.myChart) window.myChart.destroy();

  window.myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: dates,
      datasets: [{
        label: "Tabungan Harian (Rp)",
        data: values,
        borderColor: "#4caf50",
        backgroundColor: "rgba(76, 175, 80, 0.1)",
        fill: true,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: "Grafik Tabungan Harian"
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

updateUI();
