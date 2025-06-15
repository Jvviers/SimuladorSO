// src/ui/controls.js
import { Proceso } from '../core/process.js';

window.simulator = window.simulator || {};
window.simulator.procesos = window.simulator.procesos || [];

let nextPID = 1;

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('process-form');

  form.addEventListener('submit', e => {
    e.preventDefault();

    const nombre  = document.getElementById('name').value.trim();
    const arrival = parseInt(document.getElementById('arrival').value, 10);
    const burst   = parseInt(document.getElementById('burst').value, 10);
    const memory  = parseInt(document.getElementById('memory').value, 10);

    if (!nombre || [arrival, burst, memory].some(v => isNaN(v) || v < 0)) {
      return alert('Completa todos los campos con valores válidos.');
    }

    // Crear y almacenar el proceso
    const proceso = new Proceso(nextPID++, nombre, arrival, burst, memory);
    window.simulator.procesos.push(proceso);

    // Actualizar la UI
    renderProcessList();

    form.reset();
  });
});

/** Función muy simple para mostrar la lista en pantalla */
function renderProcessList() {
  let container = document.getElementById('process-list');
  if (!container) {
    container = document.createElement('ul');
    container.id = 'process-list';
    document.getElementById('controls').appendChild(container);
  }
  container.innerHTML = '';  
  window.simulator.procesos.forEach(p => {
    const li = document.createElement('li');
    li.textContent = `${p.nombre} (PID=${p.id}): llegada=${p.llegada}, burst=${p.burst}, mem=${p.memoria}`;
    container.appendChild(li);
  });
}
