// src/core/scheduler.js
import { Estado, Proceso } from './process.js';
import { Memoria }          from './memory.js';

export class Planificador {
  /**
   * @param {Proceso[]} procesos – lista de procesos creados
   * @param {Memoria} memoria     – instancia de gestión de memoria
   * @param {'SJF'|'RR'} algoritmo
   * @param {number|null} quantum – sólo para Round Robin
   */
  constructor(procesos, memoria, algoritmo = 'SJF', quantum = null) {
    this.procesos    = procesos;
    this.memoria     = memoria;
    this.algoritmo   = algoritmo;
    this.quantum     = quantum;
    this.tActual     = 0;
    this.enEjecucion = null;

    // Parámetros RR
    this.rrCola            = [];
    this.rrQuantumRestante = 0;
  }

  scheduleSJF() {
    const listos = this.procesos.filter(p => p.estado === Estado.LISTO);
    if (!listos.length) return null;
    listos.sort((a, b) => a.restante - b.restante);
    return listos[0];
  }

  tick() {
    // 1) Llegadas
    for (const p of this.procesos) {
      if (p.estado === Estado.NUEVO && p.llegada <= this.tActual) {
        if (this.memoria.asignar(p)) {
          p.estado = Estado.LISTO;
          if (this.algoritmo === 'RR') this.rrCola.push(p);
        }
      }
    }

    // 2) Ejecutar en CPU
    if (this.enEjecucion) {
      this.enEjecucion.tick(this.tActual);

      if (this.algoritmo === 'RR') {
        this.rrQuantumRestante--;
        if (this.rrQuantumRestante <= 0 && this.enEjecucion.estado === Estado.EJECUTANDO) {
          this.enEjecucion.estado = Estado.LISTO;
          this.rrCola.push(this.enEjecucion);
          this.enEjecucion = null;
        }
      }

      if (this.enEjecucion && this.enEjecucion.estado === Estado.TERMINADO) {
        this.memoria.liberar(this.enEjecucion);
        this.enEjecucion = null;
      }
    }

    // 3) Despacho
    if (!this.enEjecucion) {
      if (this.algoritmo === 'SJF') {
        const siguiente = this.scheduleSJF();
        if (siguiente) {
          this.enEjecucion = siguiente;
          this.enEjecucion.estado = Estado.EJECUTANDO;
        }
      } else {
        while (this.rrCola.length) {
          const candidato = this.rrCola.shift();
          if (candidato.estado === Estado.LISTO) {
            this.enEjecucion = candidato;
            this.enEjecucion.estado = Estado.EJECUTANDO;
            this.rrQuantumRestante = this.quantum;
            break;
          }
        }
      }
    }

    // 4) Contabilizar espera
    for (const p of this.procesos) {
      if (p.estado === Estado.LISTO) p.tEspera++;
    }

    this.tActual++;
  }

  /** @returns {boolean} */
  finalizado() {
    return this.procesos.every(p => p.estado === Estado.TERMINADO);
  }
}
