//src/core/process.js
export const Estado = {
  NUEVO:      'Nuevo',
  LISTO:      'Listo',
  EJECUTANDO: 'Ejecutando',
  ESPERANDO:  'Esperando',
  TERMINADO:  'Terminado',
  SWAPPED:  'Swapped',
};

export class Proceso {
  constructor(id, nombre, llegada, burst, memoriaKB) {
    this.id         = id;
    this.nombre     = nombre;
    this.llegada    = llegada;
    this.burst      = burst;
    this.restante   = burst;
    this.memoria    = memoriaKB;
    this.estado     = Estado.NUEVO;
    this.bloque     = null;
    this.tEspera    = 0;
    this.tRespuesta = null;
    this.tRetorno   = null;
  }

  tick(tActual) {
    if (this.estado === Estado.LISTO) {
      this.tEspera++;
    }
    if (this.estado === Estado.EJECUTANDO) {
      if (this.tRespuesta === null) {
        this.tRespuesta = tActual - this.llegada;
      }
      this.restante--;
      if (this.restante === 0) {
        this.estado   = Estado.TERMINADO;
        this.tRetorno = tActual + 1 - this.llegada;
      }
    }
  }
}
