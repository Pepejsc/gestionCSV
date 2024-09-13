const csvDisplay = document.getElementById("csv-display");
const showDashboardButton = document.getElementById("show-dashboard-button");
const dashboard = document.getElementById("dashboard");
const backButton = document.getElementById("back-button");
//const fileUploadSection = document.getElementById("file-upload-section"); // Asegúrate de definir esta variable
let csvData;
let previousCsvData = ""; // Declarar e inicializar la variable previousCsvData

// Revisar si hay un archivo en localStorage
const csvUrl = localStorage.getItem('filePath') || "../../data/clientes.csv"; // Usar la ruta desde localStorage si está presente

fetch(csvUrl)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Error al cargar el archivo CSV");
    }
    return response.text();
  })
  .then((data) => {
    csvData = data; // Asignar datos del CSV a la variable csvData
    displayCSV(csvData);
    showDashboardButton.style.display = "block"; // Mostrar botón después de cargar CSV
    localStorage.removeItem('filePath'); // Limpiar localStorage después de cargar el archivo
  })
  .catch((error) => {
    showAlert(error.message, "alert-danger");
  });

showDashboardButton.addEventListener("click", () => {
  if (csvData) {
    fileUploadSection.style.display = "none"; // Ocultar la sección de carga de archivos
    csvDisplay.style.display = "none"; // Ocultar la tabla
    generateDashboard(csvData);
    dashboard.style.display = "block";
    showDashboardButton.style.display = "none"; // Ocultar el botón después de mostrar el dashboard
  } else {
    showAlert(
      "No hay datos cargados para mostrar en el Dashboard.",
      "alert-danger"
    );
  }
});

function loadAndCheckCSV() {
    fetch(csvUrl)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Error al cargar el archivo CSV");
            }
            return response.text();
        })
        .then((data) => {
            if (data !== previousCsvData) {
                // Solo actualiza si el archivo ha cambiado
                previousCsvData = data;
                csvData = data;
                displayCSV(csvData);
                showDashboardButton.style.display = "block"; // Mostrar botón si se carga el CSV
            }
        })
        .catch((error) => {
            showAlert(error.message, "alert-danger");
        });
}

// Llamar a loadAndCheckCSV cada 5 segundos para verificar si hay cambios
setInterval(loadAndCheckCSV, 5000);

// Cargar CSV inicialmente
loadAndCheckCSV();

function displayCSV(csvData) {
    const rows = csvData.split("\n");
    const table = document.createElement("table");
    table.classList.add("table", "table-striped");

    rows.forEach((row, index) => {
        const cols = row.split(",");
        const tr = document.createElement("tr");

        cols.forEach((col) => {
            const th = document.createElement(index === 0 ? "th" : "td");
            th.textContent = col.trim();
            tr.appendChild(th);
        });

        table.appendChild(tr);
    });

    csvDisplay.innerHTML = "";
    csvDisplay.appendChild(table);

    csvDisplay.style.display = "block"; // Mostrar la tabla
    dashboard.style.display = "none"; // Ocultar el dashboard
}

function showAlert(message, className) {
  // Crear un nuevo elemento de alerta
  const alert = document.createElement("div");
  alert.className = `alert ${className} alert-dismissible fade show`;
  alert.role = "alert";
  alert.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

  // Añadir la alerta al contenedor de alertas
  const alertContainer = document.getElementById("alert-container");
  alertContainer.innerHTML = ""; // Limpiar alertas previas
  alertContainer.appendChild(alert);
}

showDashboardButton.addEventListener("click", () => {
  csvDisplay.style.display = "none"; // Ocultar la tabla
  generateDashboard(csvData);
  dashboard.style.display = "block";
  showDashboardButton.style.display = "none"; // Ocultar el botón después de mostrar el dashboard
});

function generateDashboard(csvData) {
  const chartContainer = document.getElementById("chart-container");
  chartContainer.innerHTML = "";

  const rows = csvData.split("\n");
  const headers = rows[0].split(","); // Primera fila como encabezado
  const labels = [];
  const datasets = [];

  for (let i = 1; i < headers.length; i++) {
    datasets.push({
      label: headers[i],
      data: [],
      fill: false,
      borderColor: getRandomColor(),
      tension: 0.1,
    });
  }

  rows.slice(1).forEach((row) => {
    const cols = row.split(",");
    labels.push(cols[0]);

    for (let i = 1; i < cols.length; i++) {
      datasets[i - 1].data.push(parseFloat(cols[i]));
    }
  });

  // Crear el gráfico de líneas
  const lineChartCanvas = document.createElement("canvas");
  chartContainer.appendChild(lineChartCanvas);

  new Chart(lineChartCanvas, {
    type: "line",
    data: {
      labels: labels,
      datasets: datasets,
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });

  // Crear el gráfico de pastel
  const pieChartCanvas = document.createElement("canvas");
  chartContainer.appendChild(pieChartCanvas);

  // Para el gráfico de pastel, usaré la suma de los valores de cada columna
  const pieData = datasets.map((dataset) => {
    return dataset.data.reduce((a, b) => a + b, 0);
  });

  new Chart(pieChartCanvas, {
    type: "pie",
    data: {
      labels: headers.slice(1), // Usar encabezados como etiquetas
      datasets: [
        {
          data: pieData,
          backgroundColor: datasets.map(() => getRandomColor()), // Colores aleatorios para cada sección
        },
      ],
    },
  });
}

backButton.addEventListener("click", () => {
  csvDisplay.style.display = "block";
  dashboard.style.display = "none";
  showDashboardButton.style.display = "block";
});

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
