// src/core/memory.js

/**
 * @typedef {Object} Proceso
 * @property {number} memoria - Memoria requerida por el proceso en KB
 * @property {any} [bloque] - Referencia al bloque asignado (opcional)
 */

/**
 * Representa un bloque contiguo de memoria (RAM o swap).
 */
class Bloque {
  /**
   * @param {number} startKB dirección inicial en KB
   * @param {number} tamañoKB tamaño del bloque en KB
   * @param {Proceso|null} proceso el proceso asignado, o null si libre
   */
  constructor(startKB, tamañoKB, proceso = null) {
    this.start   = startKB;
    this.tamaño  = tamañoKB;
    this.proceso = proceso;
  }

  /** @returns {boolean} true si el bloque está libre */
  get libre() {
    return this.proceso === null;
  }
}

/**
 * Gestión dinámica de memoria con first-fit + coalescencia.
 */
class Memoria {
  /**
   * @param {number} totalKB tamaño total de RAM en KB
   */
  constructor(totalKB) {
    this.total   = totalKB;
    this.bloques = [ new Bloque(0, totalKB) ];
    this.swap    = [];  // procesos en disco
  }

  /**
   * Intenta asignar un bloque de al menos proceso.memoria KB
   * @param {Proceso} proceso 
   * @returns {boolean} true si cupo, false si no hay espacio
   */
  asignar(proceso) {
    for (let i = 0; i < this.bloques.length; i++) {
      const b = this.bloques[i];
      if (b.libre && b.tamaño >= proceso.memoria) {
        // dividir si sobra espacio
        if (b.tamaño > proceso.memoria) {
          const resto = new Bloque(
            b.start + proceso.memoria,
            b.tamaño - proceso.memoria
          );
          this.bloques.splice(i + 1, 0, resto);
          b.tamaño = proceso.memoria;
        }
        b.proceso = proceso;
        proceso.bloque = b;
        return true;
      }
    }
    return false;
  }

  /**
   * Libera el bloque ocupado por el proceso y hace coalescencia.
   * @param {Proceso} proceso 
   */
  liberar(proceso) {
    const b = proceso.bloque;
    if (!b) return;
    b.proceso = null;
    proceso.bloque = null;
    this._coalescer();
  }

  /**
   * Elimina procesos de RAM cuando no cabe y los mueve a swap[]
   * @param {Proceso} proceso 
   */
  swapping(proceso) {
    if (proceso.bloque) this.liberar(proceso);
    this.swap.push(proceso);
  }

  /** Fusiona bloques libres adyacentes para reducir fragmentación externa */
  _coalescer() {
    this.bloques = this.bloques.reduce((acc, curr) => {
      const last = acc[acc.length - 1];
      if (last && last.libre && curr.libre && last.start + last.tamaño === curr.start) {
        last.tamaño += curr.tamaño;
      } else {
        acc.push(curr);
      }
      return acc;
    }, []);
  }
}

export { Bloque, Memoria };
