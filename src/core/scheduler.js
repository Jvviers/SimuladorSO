// src/core/scheduler.js
import { Estado } from './process.js';

export class Planificador {
  constructor(procesos, memoria, algoritmo = 'SJF', quantum = null) {
    this.procesos      = procesos;
    this.memoria       = memoria;
    this.algoritmo     = algoritmo;
    this.quantum       = quantum;
    this.tActual       = 0;
    this.enEjecucion   = null;
    this.rrCola        = [];
    this.rrQuantumRest = 0;
  }

  tick() {
    // 1) Cargar nuevos
    for (const p of this.procesos) {
      if (p.estado === Estado.NUEVO && p.llegada <= this.tActual) {
        if (this.memoria.asignar(p)) {
          p.estado = Estado.LISTO;
          if (this.algoritmo === 'RR') this.rrCola.push(p);
        }
      }
    }

    // 2) Ejecutar actual
    if (this.enEjecucion) {
      this.enEjecucion.tick(this.tActual);
      if (this.algoritmo === 'RR') this.rrQuantumRest--;
      if (this.enEjecucion.estado === Estado.TERMINADO) {
        this.memoria.liberar(this.enEjecucion);
        this.enEjecucion = null;
      } else if (this.algoritmo === 'RR' && this.rrQuantumRest <= 0) {
        this.enEjecucion.estado = Estado.LISTO;
        this.rrCola.push(this.enEjecucion);
        this.enEjecucion = null;
      }
    }

    // 3) Despachar nuevo si hace falta
    if (!this.enEjecucion) {
      const listos = this.procesos.filter(p => p.estado === Estado.LISTO);
      if (this.algoritmo === 'SJF') {
        listos.sort((a, b) => a.restante - b.restante);
        if (listos[0]) this.enEjecucion = listos[0];
      } else { // RR
        while (this.rrCola.length) {
          const c = this.rrCola.shift();
          if (c.estado === Estado.LISTO) {
            this.enEjecucion = c;
            break;
          }
        }
        this.rrQuantumRest = this.quantum;
      }
      if (this.enEjecucion) this.enEjecucion.estado = Estado.EJECUTANDO;
    }

    // 4) Actualizar espera/respuesta
    for (const p of this.procesos) {
      if (p.estado !== Estado.TERMINADO) p.tick(this.tActual);
    }

    this.tActual++;
  }

  finalizado() {
    return this.procesos.every(p => p.estado === Estado.TERMINADO);
  }
}
