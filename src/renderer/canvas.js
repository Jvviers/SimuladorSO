// src/renderer/canvas.js
export function drawMemory(memoria) {
  const canvas = document.getElementById('canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W   = canvas.width;
  const H   = canvas.height;
  ctx.clearRect(0, 0, W, H);

  let x = 0;
  for (const bloque of memoria.bloques) {
    const w = (bloque.tamaño / memoria.total) * W;
    // colorea según libre u ocupado
    ctx.fillStyle = bloque.libre ? '#e0e0e0' : '#4caf50';
    ctx.fillRect(x, 0, w, H);
    ctx.strokeStyle = '#333';
    ctx.strokeRect(x, 0, w, H);

    // etiqueta de tamaño (opcional)
    ctx.fillStyle = '#000';
    ctx.font = '12px sans-serif';
    ctx.fillText(`${bloque.tamaño}KB`, x + 4, 16);

    x += w;
  }
}

// Llama a esta función desde tu init o tick, p.ej.:
// import { drawMemory } from '../renderer/canvas.js';
// drawMemory(window.simulator.memoria);
