import { Memoria } from '../../core/memory.js';
import { Proceso, Estado } from '../../core/process.js';

describe('Gestión de Memoria (first-fit + coalescencia)', () => {
  test('asigna y divide bloques correctamente', () => {
    const mem = new Memoria(1000);
    const p1  = new Proceso(1, 'P1', 0, 10, 200);
    expect(mem.asignar(p1)).toBe(true);
    expect(mem.bloques.length).toBe(2);
    expect(mem.bloques[0].tamaño).toBe(200);
    expect(mem.bloques[1].tamaño).toBe(800);
  });

  test('coalescencia fusiona al liberar', () => {
    const mem = new Memoria(500);
    const p1  = new Proceso(1, 'P1', 0, 5, 200);
    const p2  = new Proceso(2, 'P2', 0, 5, 300);
    mem.asignar(p1);
    mem.asignar(p2);
    mem.liberar(p1);
    mem.liberar(p2);
    expect(mem.bloques.length).toBe(1);
    expect(mem.bloques[0].tamaño).toBe(500);
  });
});
