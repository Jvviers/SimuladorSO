import { drawMemory } from '../../renderer/canvas.js';
import { Bloque, Memoria } from '../../core/memory.js';

describe('drawMemory en Canvas', () => {
  let calls;

  beforeEach(() => {
    // Colocamos en DOM un <canvas> con id="canvas"
    document.body.innerHTML = '<canvas id="canvas" width="200" height="50"></canvas>';
    calls = [];
    // Hacemos un stub de getContext para capturar fillRect
    HTMLCanvasElement.prototype.getContext = () => ({
      clearRect: () => {},
      fillRect: (x, y, w, h) => calls.push({ x, y, w, h }),
      strokeRect: () => {},
      fillText: () => {}
    });
  });

  test('dibuja bloques proporcionales al tamaño', () => {
    const mem = new Memoria(200);
    // Sobrescribimos bloques para forzar 2 particiones: 50 y 150
    mem.bloques = [
      new Bloque(0, 50, null),
      new Bloque(50, 150, { id: 1 })
    ];

    drawMemory(mem);

    // Debe llamar a fillRect dos veces
    expect(calls.length).toBe(2);

    // El ancho del primer bloque = 50/200 * 200 = 50px
    expect(calls[0].w).toBeCloseTo(50);
    // El ancho del segundo = 150/200 * 200 = 150px
    expect(calls[1].w).toBeCloseTo(150);
  });
});
