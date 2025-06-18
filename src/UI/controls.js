// src/ui/controls.js
import { Proceso } from '../core/process.js';
import { drawMemory } from '../renderer/canvas.js';   // ← importamos drawMemory

//
// Configuración inicial del simulador
//
window.simulator = window.simulator || {};
window.simulator.procesos = window.simulator.procesos || [];
window.simulator.memoria   = window.simulator.memoria   || null;  // la inyectarás desde el init
window.simulator.config = window.simulator.config || {
  algoritmo: 'SJF',
  quantum:   null
};

let nextPID = 1;
const DEFAULT_QUANTUM = 5;

document.addEventListener('DOMContentLoaded', () => {
  //
  // 1) Formulario de creación de procesos
  //
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

    renderProcessList();
    if (window.simulator.memoria) {
      drawMemory(window.simulator.memoria);
    }
    form.reset();
  });

  //
  // 2) Selector de algoritmo y campo de quantum
  //
  const selectAlgo   = document.getElementById('algo');
  const inputQuantum = document.getElementById('quantum');
  const labelQuantum = document.getElementById('label-quantum');

  selectAlgo.addEventListener('change', () => {
    const isRR = selectAlgo.value === 'RR';

    labelQuantum.style.display = isRR ? 'inline-block' : 'none';
    inputQuantum.style.display = isRR ? 'inline-block' : 'none';
    inputQuantum.disabled      = !isRR;

    if (isRR) {
      if (!window.simulator.config.quantum) {
        window.simulator.config.quantum = DEFAULT_QUANTUM;
      }
      inputQuantum.value = window.simulator.config.quantum;
    } else {
      window.simulator.config.quantum = null;
      inputQuantum.value = '';
    }
    window.simulator.config.algoritmo = selectAlgo.value;
  });
  selectAlgo.dispatchEvent(new Event('change'));

  //
  // 3) Botones Iniciar / Detener simulación
  //
  const startBtn = document.getElementById('start-btn');
  const stopBtn  = document.getElementById('stop-btn');

  startBtn.addEventListener('click', () => {
    const alg = window.simulator.config.algoritmo;
    const q   = parseInt(inputQuantum.value, 10);
    if (alg === 'RR' && (isNaN(q) || q < 1)) {
      return alert('Ingresa un quantum válido (>0).');
    }
    window.simulator.config.quantum = q;
    console.log(`Iniciando simulación con algoritmo=${alg}, quantum=${q}`);
    // Por ejemplo, crear planificador e inyectar la memoria:
    // window.simulator.planificador = new Planificador(window.simulator.procesos, window.simulator.memoria, alg, q);
    // drawMemory(window.simulator.memoria);
    // renderProcessList();
  });

  stopBtn.addEventListener('click', () => {
    console.log('Deteniendo simulación');
    // window.simulator.planificador = null;
  });
});

//
// Función para mostrar la lista de procesos en la UI
//
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
    li.textContent = `${p.nombre} (PID=${p.id}): estado=${p.estado}, llegada=${p.llegada}ms, burst=${p.burst}ms, mem=${p.memoria}KB`;
    ul.appendChild(li);
  }
}
