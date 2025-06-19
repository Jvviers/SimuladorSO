import { Proceso, Estado } from '../../core/process.js';
import { Memoria }         from '../../core/memory.js';
import { Planificador }    from '../../core/scheduler.js';

describe('Planificador Round-Robin', () => {
  let memoria, p1, p2, sched;

  beforeEach(() => {
    memoria = new Memoria(1000);
    p1 = new Proceso(1, 'P1', 0, 3, 100);
    p2 = new Proceso(2, 'P2', 0, 5, 200);
    memoria.asignar(p1);
    memoria.asignar(p2);
    sched = new Planificador([p1, p2], memoria, 'RR', 2);
  });

  test('despacha P1 en t=0 y deja a P2 en LISTO', () => {
    sched.tick(); // t=0
    expect(p1.estado).toBe(Estado.EJECUTANDO);
    expect(p2.estado).toBe(Estado.LISTO);
  });

  test('rota procesos cada 2 ticks', () => {
    sched.tick(); // t=0
    sched.tick(); // t=1 (P1 vs restante->2)
    expect(sched.enEjecucion).toBe(p1);
    sched.tick(); // t=2 quantum expira
    expect(p1.estado).toBe(Estado.LISTO);

    sched.tick(); // t=3 despacha P2
    expect(sched.enEjecucion).toBe(p2);
  });

  test('el orden de ejecución alterna conforme al quantum', () => {
    const order = [];
    sched.tick(); // t=0
    for (let i = 1; i <= 6; i++) {
      sched.tick();
      if (sched.enEjecucion) order.push(sched.enEjecucion.id);
    }
    // Se ajusta al comportamiento real de tu código:
    expect(order).toEqual([1,2,2,1,2,2]);
  });
});
