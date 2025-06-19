export class Bloque {
  constructor(startKB, tamañoKB, proceso = null) {
    this.start = startKB;
    this.tamaño = tamañoKB;
    this.proceso = proceso;
  }
  get libre() {
    return this.proceso === null;
  }
}

export class Memoria {
  constructor(totalKB) {
    this.total = totalKB;
    this.bloques = [new Bloque(0, totalKB)];
    this.swap = [];
  }

  asignar(proceso) {
    for (let i = 0; i < this.bloques.length; i++) {
      const b = this.bloques[i];
      if (b.libre && b.tamaño >= proceso.memoria) {
        if (b.tamaño > proceso.memoria) {
          const resto = new Bloque(b.start + proceso.memoria, b.tamaño - proceso.memoria);
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

  liberar(proceso) {
    const b = proceso.bloque;
    if (b) {
      b.proceso = null;
      proceso.bloque = null;
      this._coalescer();
    }
  }

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
