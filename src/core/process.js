// src/core/process.js

const Estado = {
  NUEVO:      'Nuevo',
  LISTO:      'Listo',
  EJECUTANDO: 'Ejecutando',
  ESPERANDO:  'Esperando',
  TERMINADO:  'Terminado'
};

class Proceso {
  /**
   * @param {number} id 
   * @param {string} nombre 
   * @param {number} llegada   // en ms
   * @param {number} burst     // CPU burst en ms
   * @param {number} memoriaKB // tamaño en KB
   */
  constructor(id, nombre, llegada, burst, memoriaKB) {
    this.id         = id;
    this.nombre     = nombre;
    this.llegada    = llegada;
    this.burst      = burst;
    this.restante   = burst;
    this.memoria    = memoriaKB;
    this.estado     = Estado.NUEVO;
    this.bloque     = null;    // se setea al asignar memoria
    // Métricas
    this.tEspera    = 0;
    this.tRespuesta = null;
    this.tRetorno   = null;
  }

  /**
   * Avanza un tick de simulación (1 ms)
   * - Incrementa espera si está en LISTO
   * - En estado EJECUTANDO decrementa restante y registra respuesta/retorno
   * @param {number} tActual tiempo global en ms
   */
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
        this.estado = Estado.TERMINADO;
        this.tRetorno = tActual + 1 - this.llegada;
      }
    }
  }
}

export { Proceso, Estado };
