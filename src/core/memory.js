// src/core/memory.js
import { Estado } from './process.js';

export class Bloque {
  constructor(startKB, tamañoKB, proceso = null) {
    this.start   = startKB;
    this.tamaño  = tamañoKB;
    this.proceso = proceso;
  }
  get libre() {
    return this.proceso === null;
  }
}

export class Memoria {
  constructor(totalKB) {
    this.total   = totalKB;
    this.bloques = [ new Bloque(0, totalKB) ];
    this.swap    = [];               // ← procesos en disco virtual
  }

  /**
   * First-fit + partición exacta.
   * Si no encuentra hueco, manda el proceso a swap[].
   * @returns {boolean} true=entró en RAM, false=fue a swap
   */
  asignar(proceso) {
    for (let i = 0; i < this.bloques.length; i++) {
      const b = this.bloques[i];
      if (b.libre && b.tamaño >= proceso.memoria) {
        // si sobra, partimos el bloque
        if (b.tamaño > proceso.memoria) {
          const resto = new Bloque(
            b.start + proceso.memoria,
            b.tamaño - proceso.memoria
          );
          this.bloques.splice(i + 1, 0, resto);
          b.tamaño = proceso.memoria;
        }
        b.proceso      = proceso;
        proceso.bloque = b;
        proceso.estado = Estado.LISTO;
        return true;
      }
    }
    // no cupo: SWAP
    proceso.estado = Estado.SWAPPED;
    this.swap.push(proceso);
    return false;
  }

  /**
   * Libera el bloque en RAM, coalescencia y luego recupera de swap.
   */
  liberar(proceso) {
    const b = proceso.bloque;
    if (!b) return;
    b.proceso      = null;
    proceso.bloque = null;
    this._coalescer();
    this._intentarRecuperarDeSwap();
  }

  /** @private fuse bloques libres adyacentes */
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

  /** @private recorre swap[] y trata de reasignar lo que quepa */
  _intentarRecuperarDeSwap() {
    for (const p of [...this.swap]) {
      if (!this._recuperarUno(p)) break;
    }
  }

  /**
   * @private intenta reasignar un proceso de swap a RAM
   * @returns {boolean} true si lo reasignó, false si sigue en swap
   */
  _recuperarUno(proceso) {
    const idx = this.swap.indexOf(proceso);
    if (idx < 0) return false;

    for (let i = 0; i < this.bloques.length; i++) {
      const b = this.bloques[i];
      if (b.libre && b.tamaño >= proceso.memoria) {
        if (b.tamaño > proceso.memoria) {
          const resto = new Bloque(
            b.start + proceso.memoria,
            b.tamaño - proceso.memoria
          );
          this.bloques.splice(i + 1, 0, resto);
          b.tamaño = proceso.memoria;
        }
        b.proceso      = proceso;
        proceso.bloque = b;
        proceso.estado = Estado.LISTO;
        this.swap.splice(idx, 1);
        return true;
      }
    }
    return false;
  }

  /**
   * Método público para rescatar un proceso de swap.
   * @returns {boolean}
   */
  recuperar(proceso) {
    return this._recuperarUno(proceso);
  }
}
