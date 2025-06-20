// src/core/metrics.js
export class MetricsCollector {
  constructor() {
    this.runs = []; // Store results from different algorithm runs
    this.currentRun = null;
  }

  startRun(algoritmo, quantum = null) {
    this.currentRun = {
      algoritmo: algoritmo,
      quantum: quantum,
      procesos: [],
      startTime: Date.now(),
      endTime: null
    };
  }

  finishRun(procesos) {
    if (!this.currentRun) return;
    
    this.currentRun.endTime = Date.now();
    this.currentRun.procesos = procesos.map(p => ({
      id: p.id,
      nombre: p.nombre,
      tEspera: p.tEspera,
      tRespuesta: p.tRespuesta,
      tRetorno: p.tRetorno,
      burst: p.burst
    }));
    
    this.runs.push(this.currentRun);
    this.currentRun = null;
  }

  getComparativeMetrics() {
    const metrics = {};
    
    this.runs.forEach(run => {
      const key = run.algoritmo + (run.quantum ? `_Q${run.quantum}` : '');
      
      metrics[key] = {
        algoritmo: run.algoritmo,
        quantum: run.quantum,
        promedioEspera: this.calcularPromedio(run.procesos, 'tEspera'),
        promedioRespuesta: this.calcularPromedio(run.procesos, 'tRespuesta'),
        promedioRetorno: this.calcularPromedio(run.procesos, 'tRetorno'),
        throughput: run.procesos.length / ((run.endTime - run.startTime) / 1000)
      };
    });
    
    return metrics;
  }

  calcularPromedio(procesos, campo) {
    const valores = procesos.map(p => p[campo]).filter(v => v !== null);
    return valores.length > 0 ? valores.reduce((a, b) => a + b, 0) / valores.length : 0;
  }

  exportData() {
    return {
      runs: this.runs,
      comparative: this.getComparativeMetrics(),
      timestamp: new Date().toISOString()
    };
  }
}