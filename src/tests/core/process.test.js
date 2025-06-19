import { Proceso } from '../../core/process.js';
import { Estado } from '../../core/process.js';

test('Proceso inicial en estado NUEVO', () => {
  const p = new Proceso(1, 'X', 0, 5, 100);
  expect(p.estado).toBe(Estado.NUEVO);
});
