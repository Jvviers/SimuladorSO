// src/renderer/charts.js - Chart.js integration
export class ChartRenderer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.chart = null;
  }

  renderComparativeChart(metrics) {
    const algoritmos = Object.keys(metrics);
    const datasets = [
      {
        label: 'Tiempo Promedio de Espera (ms)',
        data: algoritmos.map(alg => metrics[alg].promedioEspera),
        backgroundColor: 'rgba(33, 150, 243, 0.6)',
        borderColor: 'rgba(33, 150, 243, 1)',
        borderWidth: 1
      },
      {
        label: 'Tiempo Promedio de Respuesta (ms)',
        data: algoritmos.map(alg => metrics[alg].promedioRespuesta),
        backgroundColor: 'rgba(76, 175, 80, 0.6)',
        borderColor: 'rgba(76, 175, 80, 1)',
        borderWidth: 1
      },
      {
        label: 'Tiempo Promedio de Retorno (ms)',
        data: algoritmos.map(alg => metrics[alg].promedioRetorno),
        backgroundColor: 'rgba(255, 193, 7, 0.6)',
        borderColor: 'rgba(255, 193, 7, 1)',
        borderWidth: 1
      }
    ];

    const config = {
      type: 'bar',
      data: {
        labels: algoritmos,
        datasets: datasets
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Comparación de Algoritmos de Planificación'
          },
          legend: {
            position: 'top'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Tiempo (ms)'
            }
          }
        }
      }
    };

    if (this.chart) {
      this.chart.destroy();
    }

    // Assuming Chart.js is loaded
    this.chart = new Chart(this.canvas, config);
  }

  renderTimelineChart(procesos) {
    // Gantt chart style timeline showing process execution
    const datasets = procesos.map((proceso, index) => ({
      label: `${proceso.nombre} (PID: ${proceso.id})`,
      data: [{
        x: proceso.tRespuesta,
        y: index,
        width: proceso.burst
      }],
      backgroundColor: `hsl(${(index * 137.5) % 360}, 70%, 70%)`
    }));

    const config = {
      type: 'scatter',
      data: {
        datasets: datasets
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Timeline de Ejecución de Procesos'
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Tiempo (ms)'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Procesos'
            }
          }
        }
      }
    };

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(this.canvas, config);
  }
}

// Integration example for your main controls
export function integrateMetrics() {
  window.simulator.metrics = new MetricsCollector();
  
  // Add this to your start button event listener
  const originalStart = document.getElementById('start-btn').onclick;
  document.getElementById('start-btn').addEventListener('click', () => {
    window.simulator.metrics.startRun(
      window.simulator.config.algoritmo,
      window.simulator.config.quantum
    );
  });

  // Add metrics display after simulation ends
  const showMetricsBtn = document.createElement('button');
  showMetricsBtn.textContent = 'Mostrar Métricas';
  showMetricsBtn.onclick = () => {
    const metrics = window.simulator.metrics.getComparativeMetrics();
    const chartRenderer = new ChartRenderer('metrics-chart');
    chartRenderer.renderComparativeChart(metrics);
  };
  
  document.getElementById('controls').appendChild(showMetricsBtn);
}