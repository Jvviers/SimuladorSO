// src/ui/controls.js
import { Proceso, Estado }    from '../core/process.js';
import { drawMemory }         from '../renderer/canvas.js';
import { Planificador }       from '../core/scheduler.js';
import { Memoria }            from '../core/memory.js';

window.simulator = window.simulator || {};
window.simulator.procesos = window.simulator.procesos || [];
window.simulator.memoria  = window.simulator.memoria  || null;
window.simulator.config   = window.simulator.config   || {
  algoritmo: 'SJF',
  quantum:   null
};

const TOTAL_KB        = 2 * 1024 * 1024;
const DEFAULT_QUANTUM = 5;
let nextPID          = 1;

document.addEventListener('DOMContentLoaded', () => {
  // 1) Inicializar memoria
  if (!window.simulator.memoria) {
    window.simulator.memoria = new Memoria(TOTAL_KB);
  }

  // 2) Crear contenedor de swap ANTES de cualquier renderSwapList()
  const swapContainer = document.createElement('div');
  swapContainer.id = 'swap-list';
  swapContainer.innerHTML = `
    <h3>Swap (en disco)</h3>
    <ul id="swap-ul"></ul>
    <button id="recover-btn">Recuperar de Swap</button>
  `;
  document.getElementById('controls').appendChild(swapContainer);

  // 2a) Listener de recuperación manual
  document.getElementById('recover-btn').addEventListener('click', () => {
    for (const p of [...window.simulator.memoria.swap]) {
      window.simulator.memoria.recuperar(p);
    }
    renderProcessList();
    drawMemory(window.simulator.memoria);
    renderSwapList();
  });

  // renderSwapList debe existir siempre que se llame
  function renderSwapList() {
    const ul = document.getElementById('swap-ul');
    ul.innerHTML = '';
    for (const p of window.simulator.memoria.swap) {
      const li = document.createElement('li');
      li.textContent =
        `${p.nombre} (PID=${p.id}): estado=${Estado.SWAPPED}, mem=${p.memoria}KB`;
      ul.appendChild(li);
    }
  }

  // 3) Mock‐up inicial (HU05)
  const pA = new Proceso(nextPID++, 'TestA', 0, 0, 512 * 1024);
  const pB = new Proceso(nextPID++, 'TestB', 0, 0, 256 * 1024);
  window.simulator.procesos.push(pA, pB);
  window.simulator.memoria.asignar(pA);
  window.simulator.memoria.asignar(pB);

  drawMemory(window.simulator.memoria);
  renderProcessList();
  renderSwapList();  // ← ya existe el UL, así que pinta swap correctamente

  // 4) Formulario de nuevos procesos
  const form = document.getElementById('process-form');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const nombre  = document.getElementById('name').value.trim();
    const arrival = +document.getElementById('arrival').value;
    const burst   = +document.getElementById('burst').value;
    const memory  = +document.getElementById('memory').value;

    if (!nombre || [arrival, burst, memory].some(v => isNaN(v) || v < 0)) {
      return alert('Completa todos los campos con valores válidos.');
    }

    const proceso = new Proceso(nextPID++, nombre, arrival, burst, memory);
    window.simulator.procesos.push(proceso);

    const ok = window.simulator.memoria.asignar(proceso);
    if (!ok) {
      // Si no cabe, ya está en swap. No hacer .pop()
      proceso.estado = Estado.SWAPPED;
      renderProcessList();
      drawMemory(window.simulator.memoria);
      renderSwapList();
      return;
    }

    proceso.estado = Estado.LISTO;
    renderProcessList();
    drawMemory(window.simulator.memoria);
    renderSwapList();

    form.reset();
  });

  // 5) Algoritmo / quantum (HU06)
  const selectAlgo   = document.getElementById('algo');
  const inputQuantum = document.getElementById('quantum');
  const labelQuantum = document.getElementById('label-quantum');

  selectAlgo.addEventListener('change', () => {
    const isRR = selectAlgo.value === 'RR';
    labelQuantum.style.display = isRR ? 'inline-block' : 'none';
    inputQuantum.style.display = isRR ? 'inline-block' : 'none';
    inputQuantum.disabled      = !isRR;
    if (isRR) {
      window.simulator.config.quantum ||= DEFAULT_QUANTUM;
      inputQuantum.value = window.simulator.config.quantum;
    } else {
      window.simulator.config.quantum = null;
      inputQuantum.value = '';
    }
    window.simulator.config.algoritmo = selectAlgo.value;
  });
  selectAlgo.dispatchEvent(new Event('change'));

  // 6) Iniciar / Detener simulación
  document.getElementById('start-btn').addEventListener('click', () => {
    const alg = window.simulator.config.algoritmo;
    const q   = parseInt(inputQuantum.value, 10);
    if (alg === 'RR' && (isNaN(q) || q < 1)) {
      return alert('Ingresa un quantum válido (>0).');
    }
    window.simulator.config.quantum = q;

    if (!window.simulator.memoria) {
      window.simulator.memoria = new Memoria(TOTAL_KB);
    }
    window.simulator.planificador = new Planificador(
      window.simulator.procesos,
      window.simulator.memoria,
      alg,
      q
    );

    drawMemory(window.simulator.memoria);
    renderProcessList();
    renderSwapList();
  });

  document.getElementById('stop-btn').addEventListener('click', () => {
    console.log('Deteniendo simulación');
  });
});

// Helper para pintar lista de procesos
function renderProcessList() {
  let ul = document.getElementById('process-list');
  if (!ul) {
    ul = document.createElement('ul');
    ul.id = 'process-list';
    document.getElementById('controls').appendChild(ul);
  }
  ul.innerHTML = '';
  for (const p of window.simulator.procesos) {
    const li = document.createElement('li');
    li.textContent =
      `${p.nombre} (PID=${p.id}): estado=${p.estado}, llegada=${p.llegada}ms, burst=${p.burst}ms, mem=${p.memoria}KB`;
    ul.appendChild(li);
  }
}
