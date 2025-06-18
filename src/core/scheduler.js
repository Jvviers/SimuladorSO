import { Estado } from './process.js';

export class Planificador {
  constructor(procesos, memoria, algoritmo = 'SJF', quantum = null) {
    this.procesos     = procesos;
    this.memoria      = memoria;
    this.algoritmo    = algoritmo;
    this.quantum      = quantum;
    this.tActual      = 0;
    this.enEjecucion  = null;
    this.rrCola       = [];
    this.rrQuantumRestante = 0;
  }

  tick() {
    // 1. Ingresar procesos nuevos a memoria
    for (const p of this.procesos) {
      if (p.estado === Estado.NUEVO && p.llegada <= this.tActual) {
        const asignado = this.memoria.asignar(p);
        if (asignado) {
          p.estado = Estado.LISTO;
          if (this.algoritmo === 'RR') {
            this.rrCola.push(p);
          }
        }
      }
    }

    // 2. Ejecutar proceso actual
    if (this.enEjecucion) {
      this.enEjecucion.tick(this.tActual);
      this.rrQuantumRestante--;

      if (this.enEjecucion.estado === Estado.TERMINADO) {
        this.memoria.liberar(this.enEjecucion);
        this.enEjecucion = null;
      } else if (this.algoritmo === 'RR' && this.rrQuantumRestante <= 0) {
        this.enEjecucion.estado = Estado.LISTO;
        this.rrCola.push(this.enEjecucion);
        this.enEjecucion = null;
      }
    }

    // 3. Seleccionar nuevo proceso si no hay uno en ejecución
    if (!this.enEjecucion) {
      let candidatos = this.procesos.filter(p => p.estado === Estado.LISTO);

      if (this.algoritmo === 'SJF') {
        candidatos.sort((a, b) => a.restante - b.restante);
        if (candidatos.length > 0) {
          this.enEjecucion = candidatos[0];
        }
      } else if (this.algoritmo === 'RR') {
        while (this.rrCola.length > 0) {
          const candidato = this.rrCola.shift();
          if (candidato.estado === Estado.LISTO) {
            this.enEjecucion = candidato;
            break;
          }
        }
        this.rrQuantumRestante = this.quantum;
      }

      if (this.enEjecucion) {
        this.enEjecucion.estado = Estado.EJECUTANDO;
      }
    }

    // 4. Avanzar tiempo de espera y respuesta
    for (const p of this.procesos) {
      if (p.estado !== Estado.TERMINADO) {
        p.tick(this.tActual);
      }
    }

    this.tActual++;
  }

  finalizado() {
    return this.procesos.every(p => p.estado === Estado.TERMINADO);
  }
}
