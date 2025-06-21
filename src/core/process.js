// src/core/process.js

// Define Estado enum here
export const Estado = {
  NUEVO: 'NUEVO',
  LISTO: 'LISTO',
  EJECUTANDO: 'EJECUTANDO',
  TERMINADO: 'TERMINADO',
  SWAPPED: 'SWAPPED'
};

export class Proceso {
  constructor(id, nombre, llegada, burst, memoria) {
    this.id         = id;
    this.nombre     = nombre;
    this.llegada    = llegada;
    this.burst      = burst;
    this.memoria    = memoria;
    this.estado     = Estado.NUEVO;
    this.restante   = burst;
    this.tEspera    = 0;
    this.tRespuesta = null;
    this.tRetorno   = null;
    this.bloque     = null;
  }

  tick(tActual) {
    if (this.estado === Estado.EJECUTANDO) {
      if (this.tRespuesta === null) {
        this.tRespuesta = tActual - this.llegada;
      }
      this.restante--;
      if (this.restante <= 0) {
        this.estado = Estado.TERMINADO;
        this.tRetorno = tActual - this.llegada + 1;
      }
    } else if (this.estado === Estado.LISTO) {
      this.tEspera++;
    }
  }
}

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
    
    // Animation callback for HU09
    this.onStateChange = null;
    this.onSwapOperation = null;
  }

  tick() {
    // 1) Cargar nuevos
    for (const p of this.procesos) {
      if (p.estado === Estado.NUEVO && p.llegada <= this.tActual) {
        const oldState = p.estado;
        const wasAssigned = this.memoria.asignar(p);
        
        if (wasAssigned) {
          p.estado = Estado.LISTO;
          if (this.algoritmo === 'RR') this.rrCola.push(p);
          // HU09: Trigger animation for state change
          this.triggerStateChange(p, oldState, Estado.LISTO);
        } else {
          // HU08: Process went to swap
          p.estado = Estado.SWAPPED;
          // HU09: Trigger swap animation
          this.triggerSwapOperation(p, true);
        }
      }
    }

    // 2) Ejecutar actual
    if (this.enEjecucion) {
      const oldState = this.enEjecucion.estado;
      this.enEjecucion.tick(this.tActual);
      
      if (this.algoritmo === 'RR') this.rrQuantumRest--;
      
      if (this.enEjecucion.estado === Estado.TERMINADO) {
        // HU09: Animate state change to terminated
        this.triggerStateChange(this.enEjecucion, oldState, Estado.TERMINADO);
        
        this.memoria.liberar(this.enEjecucion);
        this.enEjecucion = null;
        
        // HU08: Check if any swapped processes can be recovered
        this.checkSwapRecovery();
        
      } else if (this.algoritmo === 'RR' && this.rrQuantumRest <= 0) {
        // HU09: Animate context switch in RR
        this.enEjecucion.estado = Estado.LISTO;
        this.triggerStateChange(this.enEjecucion, Estado.EJECUTANDO, Estado.LISTO);
        this.rrCola.push(this.enEjecucion);
        this.enEjecucion = null;
      }
    }

    // 3) Despachar nuevo si hace falta
    if (!this.enEjecucion) {
      const listos = this.procesos.filter(p => p.estado === Estado.LISTO);
      let candidato = null;
      
      if (this.algoritmo === 'SJF') {
        listos.sort((a, b) => a.restante - b.restante);
        candidato = listos[0] || null;
      } else { // RR
        while (this.rrCola.length) {
          const c = this.rrCola.shift();
          if (c.estado === Estado.LISTO) {
            candidato = c;
            break;
          }
        }
        this.rrQuantumRest = this.quantum;
      }
      
      if (candidato) {
        this.enEjecucion = candidato;
        // HU09: Animate transition to executing
        this.triggerStateChange(candidato, Estado.LISTO, Estado.EJECUTANDO);
        candidato.estado = Estado.EJECUTANDO;
      }
    }

    // 4) Actualizar espera/respuesta
    for (const p of this.procesos) {
      if (p.estado !== Estado.TERMINADO) p.tick(this.tActual);
    }

    this.tActual++;
  }

  // HU08: Check and recover processes from swap
  checkSwapRecovery() {
    const recovered = [];
    for (const p of [...this.memoria.swap]) {
      if (this.memoria.recuperar(p)) {
        recovered.push(p);
        // HU09: Animate recovery from swap
        this.triggerSwapOperation(p, false);
        this.triggerStateChange(p, Estado.SWAPPED, Estado.LISTO);
      }
    }
    return recovered;
  }

  // HU09: Animation triggers
  triggerStateChange(proceso, oldState, newState) {
    if (this.onStateChange) {
      this.onStateChange(proceso, oldState, newState);
    }
  }

  triggerSwapOperation(proceso, toSwap) {
    if (this.onSwapOperation) {
      this.onSwapOperation(proceso, toSwap);
    }
  }

  finalizado() {
    return this.procesos.every(p => p.estado === Estado.TERMINADO);
  }
}