// src/renderer/controls.js - Enhanced integration
import { AnimationManager } from './animations.js';
import { swapAnimationIntegrator } from '../integration/hu08_hu09.js';

/**
 * Initialize the complete animation and swap system
 * Call this function when the DOM is loaded and simulator is ready
 */
export function initializeEnhancedSystem() {
  console.log('🚀 Initializing Enhanced Swap & Animation System...');

  // 1. Initialize the swap animation integrator
  swapAnimationIntegrator.initialize();

  // 2. Setup enhanced memory rendering
  setupEnhancedMemoryRendering();

  // 3. Setup enhanced controls
  setupEnhancedControls();

  // 4. Setup simulation event listeners
  setupSimulationEventListeners();

  // 5. Initialize CSS animations
  injectEnhancedCSS();

  console.log('✅ Enhanced system initialized successfully');
}

/**
 * Setup enhanced memory rendering with swap visualization
 */
function setupEnhancedMemoryRendering() {
  // Override the global drawMemory function
  window.drawMemoryEnhanced = (memoria) => {
    drawMemoryWithSwap(memoria);
  };

  // Replace existing drawMemory calls
  if (window.drawMemory) {
    window.drawMemoryOriginal = window.drawMemory;
  }
  window.drawMemory = window.drawMemoryEnhanced;
}

/**
 * Enhanced memory drawing with swap visualization
 */
export function drawMemoryWithSwap(memoria) {
  const canvas = document.getElementById('canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height - 40; // Reserve space for swap indicator

  ctx.clearRect(0, 0, W, canvas.height);

  // Draw memory blocks
  let x = 0;
  for (const bloque of memoria.bloques) {
    const w = (bloque.tamaño / memoria.total) * W;

    // Enhanced coloring
    if (bloque.libre) {
      ctx.fillStyle = '#e8f5e8';
      ctx.strokeStyle = '#c8e6c9';
    } else {
      // Color based on process state
      const proceso = bloque.proceso;
      switch (proceso.estado) {
        case 'Ejecutando':
          ctx.fillStyle = '#4caf50';
          ctx.strokeStyle = '#388e3c';
          break;
        case 'Listo':
          ctx.fillStyle = '#2196f3';
          ctx.strokeStyle = '#1976d2';
          break;
        default:
          ctx.fillStyle = '#9e9e9e';
          ctx.strokeStyle = '#757575';
      }
    }

    ctx.fillRect(x, 0, w, H);
    ctx.strokeRect(x, 0, w, H);

    // Enhanced labeling
    ctx.fillStyle = bloque.libre ? '#2e7d32' : '#fff';
    ctx.font = 'bold 11px sans-serif';

    if (bloque.proceso) {
      ctx.fillText(`${bloque.proceso.nombre}`, x + 3, 15);
      ctx.font = '9px sans-serif';
      ctx.fillText(`${bloque.tamaño}KB`, x + 3, 27);
      ctx.fillText(`PID:${bloque.proceso.id}`, x + 3, 37);
      ctx.fillText(`Estado:${bloque.proceso.estado}`, x + 3, 47);
    } else {
      ctx.fillText(`LIBRE`, x + 3, 20);
      ctx.font = '9px sans-serif';
      ctx.fillText(`${bloque.tamaño}KB`, x + 3, 32);
    }

    x += w;
  }

  // Draw swap indicator
  drawSwapIndicator(ctx, memoria.swap, W, H);
}

/**
 * Draw swap area visualization
 */
function drawSwapIndicator(ctx, swapList, canvasWidth, memoryHeight) {
  const swapY = memoryHeight + 5;
  const swapHeight = 30;

  // Swap area background with gradient
  const gradient = ctx.createLinearGradient(0, swapY, 0, swapY + swapHeight);
  if (swapList.length > 0) {
    gradient.addColorStop(0, '#fff3e0');
    gradient.addColorStop(1, '#ffcc02');
  } else {
    gradient.addColorStop(0, '#f5f5f5');
    gradient.addColorStop(1, '#eeeeee');
  }

  ctx.fillStyle = gradient;
  ctx.fillRect(0, swapY, canvasWidth, swapHeight);
  ctx.strokeStyle = swapList.length > 0 ? '#ff9800' : '#ddd';
  ctx.lineWidth = 2;
  ctx.strokeRect(0, swapY, canvasWidth, swapHeight);

  // Swap label and count with icon
  ctx.fillStyle = swapList.length > 0 ? '#e65100' : '#999';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText(`💾 SWAP`, 8, swapY + 20);

  ctx.font = '12px sans-serif';
  ctx.fillText(`(${swapList.length} procesos)`, 70, swapY + 20);

  // Draw swapped processes as individual blocks
  let swapX = 150;
  const blockWidth = 50;
  const blockHeight = 20;
  const maxVisible = Math.floor((canvasWidth - 160) / (blockWidth + 5));
  const visibleProcesses = swapList.slice(0, maxVisible);

  visibleProcesses.forEach((proceso, index) => {
    // Process block with gradient
    const processGradient = ctx.createLinearGradient(swapX, swapY + 5, swapX, swapY + 25);
    processGradient.addColorStop(0, '#ff9800');
    processGradient.addColorStop(1, '#f57c00');

    ctx.fillStyle = processGradient;
    ctx.fillRect(swapX, swapY + 5, blockWidth, blockHeight);
    ctx.strokeStyle = '#e65100';
    ctx.lineWidth = 1;
    ctx.strokeRect(swapX, swapY + 5, blockWidth, blockHeight);

    // Process info
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 9px sans-serif';
    const displayName = proceso.nombre.length > 6 ?
      proceso.nombre.substring(0, 5) + '.' :
      proceso.nombre;
    ctx.fillText(displayName, swapX + 2, swapY + 16);

    ctx.font = '7px sans-serif';
    ctx.fillText(`${proceso.memoria}KB`, swapX + 2, swapY + 23);

    swapX += blockWidth + 5;
  });

  // Show overflow indicator
  if (swapList.length > maxVisible) {
    ctx.fillStyle = '#e65100';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText(`+${swapList.length - maxVisible} más`, swapX, swapY + 18);
  }

  // Memory usage stats
  if (swapList.length > 0) {
    const totalSwapMemory = swapList.reduce((sum, p) => sum + p.memoria, 0);
    ctx.fillStyle = '#bf360c';
    ctx.font = '10px sans-serif';
    ctx.fillText(`Total en swap: ${totalSwapMemory}KB`, canvasWidth - 120, swapY + 12);
  }
}

/**
 * Setup enhanced controls and UI elements
 */
function setupEnhancedControls() {
  // Add process control buttons
  addProcessControlButtons();

  // Add memory management controls
  addMemoryManagementControls();

  // Add simulation speed controls
  addSimulationSpeedControls();

  // Add export/import functionality
  addDataManagementControls();

  // Add visual theme controls
  addThemeControls();

  // Enhance existing buttons
  enhanceExistingButtons();
}

/**
 * Add process-specific control buttons
 */
function addProcessControlButtons() {
  const processControlsContainer = document.createElement('div');
  processControlsContainer.className = 'process-controls-panel';
  processControlsContainer.innerHTML = `
    <h4>🎛️ Control de Procesos</h4>
    <div class="control-group">
      <button id="add-process-btn" class="btn primary">➕ Agregar Proceso</button>
      <button id="remove-process-btn" class="btn danger">❌ Eliminar Proceso</button>
      <button id="pause-process-btn" class="btn warning">⏸️ Pausar Actual</button>
      <button id="priority-boost-btn" class="btn secondary">⚡ Boost Prioridad</button>
    </div>
  `;

  const controlsContainer = document.getElementById('controls');
  controlsContainer.appendChild(processControlsContainer);

  // Setup event listeners for process controls
  setupProcessControlListeners();
}

/**
 * Setup process control event listeners
 */
function setupProcessControlListeners() {
  const addProcessBtn = document.getElementById('add-process-btn');
  const removeProcessBtn = document.getElementById('remove-process-btn');
  const pauseProcessBtn = document.getElementById('pause-process-btn');
  const priorityBoostBtn = document.getElementById('priority-boost-btn');

  if (addProcessBtn) {
    addProcessBtn.addEventListener('click', () => {
      showAddProcessDialog();
    });
  }

  if (removeProcessBtn) {
    removeProcessBtn.addEventListener('click', () => {
      showRemoveProcessDialog();
    });
  }

  if (pauseProcessBtn) {
    pauseProcessBtn.addEventListener('click', () => {
      pauseCurrentProcess();
    });
  }

  if (priorityBoostBtn) {
    priorityBoostBtn.addEventListener('click', () => {
      boostProcessPriority();
    });
  }
}

/**
 * Add memory management specific controls
 */
function addMemoryManagementControls() {
  const memoryControlsContainer = document.createElement('div');
  memoryControlsContainer.className = 'memory-controls-panel';
  memoryControlsContainer.innerHTML = `
    <h4>💾 Gestión de Memoria</h4>
    <div class="control-group">
      <button id="defrag-btn" class="btn secondary">🔧 Desfragmentar</button>
      <button id="garbage-collect-btn" class="btn secondary">🗑️ Garbage Collect</button>
      <button id="memory-stats-btn" class="btn info">📊 Estadísticas</button>
    </div>
    <div class="memory-info">
      <span>Memoria libre: <strong id="free-memory">0KB</strong></span>
      <span>Fragmentación: <strong id="fragmentation">0%</strong></span>
    </div>
  `;

  const controlsContainer = document.getElementById('controls');
  controlsContainer.appendChild(memoryControlsContainer);

  setupMemoryControlListeners();
}

/**
 * Setup memory control event listeners
 */
function setupMemoryControlListeners() {
  const defragBtn = document.getElementById('defrag-btn');
  const garbageCollectBtn = document.getElementById('garbage-collect-btn');
  const memoryStatsBtn = document.getElementById('memory-stats-btn');

  if (defragBtn) {
    defragBtn.addEventListener('click', () => {
      performDefragmentation();
    });
  }

  if (garbageCollectBtn) {
    garbageCollectBtn.addEventListener('click', () => {
      performGarbageCollection();
    });
  }

  if (memoryStatsBtn) {
    memoryStatsBtn.addEventListener('click', () => {
      showMemoryStatistics();
    });
  }
}

/**
 * Add simulation speed controls
 */
function addSimulationSpeedControls() {
  const speedControlsContainer = document.createElement('div');
  speedControlsContainer.className = 'speed-controls-panel';
  speedControlsContainer.innerHTML = `
    <h4>⏱️ Control de Velocidad</h4>
    <div class="speed-controls">
      <label for="speed-slider">Velocidad: <span id="speed-value">1x</span></label>
      <input type="range" id="speed-slider" min="0.1" max="5" step="0.1" value="1">
      <div class="speed-presets">
        <button class="speed-btn" data-speed="0.25">0.25x</button>
        <button class="speed-btn" data-speed="0.5">0.5x</button>
        <button class="speed-btn" data-speed="1">1x</button>
        <button class="speed-btn active" data-speed="2">2x</button>
        <button class="speed-btn" data-speed="5">5x</button>
      </div>
    </div>
  `;

  const controlsContainer = document.getElementById('controls');
  controlsContainer.appendChild(speedControlsContainer);

  setupSpeedControlListeners();
}

/**
 * Setup simulation speed control listeners
 */
function setupSpeedControlListeners() {
  const speedSlider = document.getElementById('speed-slider');
  const speedValue = document.getElementById('speed-value');
  const speedBtns = document.querySelectorAll('.speed-btn');

  if (speedSlider && speedValue) {
    speedSlider.addEventListener('input', (e) => {
      const speed = parseFloat(e.target.value);
      speedValue.textContent = `${speed}x`;
      updateSimulationSpeed(speed);
      updateSpeedButtonStates(speed);
    });
  }

  speedBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const speed = parseFloat(btn.dataset.speed);
      speedSlider.value = speed;
      speedValue.textContent = `${speed}x`;
      updateSimulationSpeed(speed);
      updateSpeedButtonStates(speed);
    });
  });
}

/**
 * Add data management controls (export/import)
 */
function addDataManagementControls() {
  const dataControlsContainer = document.createElement('div');
  dataControlsContainer.className = 'data-controls-panel';
  dataControlsContainer.innerHTML = `
    <h4>📁 Gestión de Datos</h4>
    <div class="control-group">
      <button id="export-config-btn" class="btn secondary">📤 Exportar Config</button>
      <button id="import-config-btn" class="btn secondary">📥 Importar Config</button>
      <button id="export-results-btn" class="btn info">📊 Exportar Resultados</button>
      <button id="reset-simulation-btn" class="btn danger">🔄 Reiniciar Todo</button>
    </div>
    <input type="file" id="import-file" accept=".json" style="display: none;">
  `;

  const controlsContainer = document.getElementById('controls');
  controlsContainer.appendChild(dataControlsContainer);

  setupDataManagementListeners();
}

/**
 * Setup data management event listeners
 */
function setupDataManagementListeners() {
  const exportConfigBtn = document.getElementById('export-config-btn');
  const importConfigBtn = document.getElementById('import-config-btn');
  const exportResultsBtn = document.getElementById('export-results-btn');
  const resetSimulationBtn = document.getElementById('reset-simulation-btn');
  const importFile = document.getElementById('import-file');

  if (exportConfigBtn) {
    exportConfigBtn.addEventListener('click', exportConfiguration);
  }

  if (importConfigBtn) {
    importConfigBtn.addEventListener('click', () => {
      importFile.click();
    });
  }

  if (exportResultsBtn) {
    exportResultsBtn.addEventListener('click', exportSimulationResults);
  }

  if (resetSimulationBtn) {
    resetSimulationBtn.addEventListener('click', () => {
      if (confirm('¿Estás seguro de que quieres reiniciar toda la simulación?')) {
        resetSimulation();
      }
    });
  }

  if (importFile) {
    importFile.addEventListener('change', handleConfigImport);
  }
}

/**
 * Add visual theme controls
 */
function addThemeControls() {
  const themeControlsContainer = document.createElement('div');
  themeControlsContainer.className = 'theme-controls-panel';
  themeControlsContainer.innerHTML = `
    <h4>🎨 Tema Visual</h4>
    <div class="theme-controls">
      <label>
        <input type="radio" name="theme" value="light" checked> ☀️ Claro
      </label>
      <label>
        <input type="radio" name="theme" value="dark"> 🌙 Oscuro
      </label>
      <label>
        <input type="radio" name="theme" value="high-contrast"> 🔲 Alto Contraste
      </label>
      <label>
        <input type="checkbox" id="animations-enabled" checked> ✨ Animaciones
      </label>
    </div>
  `;

  const controlsContainer = document.getElementById('controls');
  controlsContainer.appendChild(themeControlsContainer);

  setupThemeControlListeners();
}

/**
 * Setup theme control listeners
 */
function setupThemeControlListeners() {
  const themeRadios = document.querySelectorAll('input[name="theme"]');
  const animationsCheckbox = document.getElementById('animations-enabled');

  themeRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      if (e.target.checked) {
        applyTheme(e.target.value);
      }
    });
  });

  if (animationsCheckbox) {
    animationsCheckbox.addEventListener('change', (e) => {
      toggleAnimations(e.target.checked);
    });
  }
}

/**
 * Enhance existing simulation buttons
 */
function enhanceExistingButtons() {
  const startBtn = document.getElementById('start-btn');
  const pauseBtn = document.getElementById('pause-btn');
  const stopBtn = document.getElementById('stop-btn');

  if (startBtn) {
    startBtn.addEventListener('click', onSimulationStart);
  }

  if (pauseBtn) {
    pauseBtn.addEventListener('click', onSimulationPause);
  }

  if (stopBtn) {
    stopBtn.addEventListener('click', onSimulationStop);
  }
}

/**
 * Setup simulation event listeners for animations and updates
 */
function setupSimulationEventListeners() {
  // Listen for process state changes
  document.addEventListener('processStateChanged', (e) => {
    const { proceso, oldState, newState } = e.detail;
    if (window.simulator.animationManager) {
      window.simulator.animationManager.animateStateChange(proceso, oldState, newState);
    }
  });

  // Listen for memory changes
  document.addEventListener('memoryUpdated', (e) => {
    updateMemoryDisplay();
    updateMemoryStats();
  });

  // Listen for swap operations
  document.addEventListener('swapOperation', (e) => {
    const { proceso, toSwap } = e.detail;
    if (window.simulator.animationManager) {
      window.simulator.animationManager.animateSwap(proceso, toSwap);
    }
  });
}

/**
 * Inject enhanced CSS for animations and styling
 */
function injectEnhancedCSS() {
  const css = `
    /* Enhanced Controls Styling */
    .process-controls-panel,
    .memory-controls-panel,
    .speed-controls-panel,
    .data-controls-panel,
    .theme-controls-panel {
      margin: 10px 0;
      padding: 15px;
      border: 1px solid #ddd;
      border-radius: 8px;
      background: #f9f9f9;
    }
    
    .control-group {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      margin-top: 10px;
    }
    
    .btn {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
      transition: all 0.3s ease;
    }
    
    .btn.primary { background: #2196f3; color: white; }
    .btn.secondary { background: #757575; color: white; }
    .btn.danger { background: #f44336; color: white; }
    .btn.warning { background: #ff9800; color: white; }
    .btn.info { background: #00bcd4; color: white; }
    
    .btn:hover { transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0,0,0,0.2); }
    .btn:active { transform: translateY(0); }
    
    /* Speed Controls */
    .speed-controls {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    
    .speed-presets {
      display: flex;
      gap: 5px;
    }
    
    .speed-btn {
      padding: 5px 10px;
      border: 2px solid #ddd;
      background: white;
      border-radius: 4px;
      cursor: pointer;
    }
    
    .speed-btn.active {
      border-color: #2196f3;
      background: #2196f3;
      color: white;
    }
    
    /* Memory Info */
    .memory-info {
      display: flex;
      gap: 20px;
      margin-top: 10px;
      font-size: 12px;
    }
    
    /* Theme Controls */
    .theme-controls {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .theme-controls label {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
    }
    
    /* Process State Animations */
    .estado-nuevo { background: #e3f2fd !important; }
    .estado-listo { background: #e8f5e8 !important; }
    .estado-ejecutando { background: #c8e6c9 !important; animation: pulse 1s infinite; }
    .estado-terminado { background: #ffecb3 !important; }
    .estado-swapped { background: #ffcdd2 !important; }
    
    .state-transition {
      animation: stateChange 0.6s ease;
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }
    
    @keyframes stateChange {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); background: #ffeb3b; }
      100% { transform: scale(1); }
    }
    
    /* Swap Animations */
    .swapping-out {
      animation: swapOut 1s ease-out;
    }
    
    .recovering-from-swap {
      animation: swapIn 0.8s ease-in;
    }
    
    @keyframes swapOut {
      0% { opacity: 1; transform: translateX(0); }
      100% { opacity: 0.3; transform: translateX(100px); }
    }
    
    @keyframes swapIn {
      0% { opacity: 0.3; transform: translateX(-100px); }
      100% { opacity: 1; transform: translateX(0); }
    }
    
    /* Notifications */
    .notification {
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 20px;
      border-radius: 4px;
      color: white;
      font-weight: bold;
      z-index: 1000;
      animation: slideIn 0.3s ease;
      transition: opacity 0.3s ease;
    }
    
    .notification.success { background: #4caf50; }
    .notification.warning { background: #ff9800; }
    .notification.error { background: #f44336; }
    .notification.info { background: #2196f3; }
    
    @keyframes slideIn {
      from { transform: translateX(100%); }
      to { transform: translateX(0); }
    }
    
    /* Dark Theme */
    [data-theme="dark"] {
      background: #121212;
      color: #ffffff;
    }
    
    [data-theme="dark"] .process-controls-panel,
    [data-theme="dark"] .memory-controls-panel,
    [data-theme="dark"] .speed-controls-panel,
    [data-theme="dark"] .data-controls-panel,
    [data-theme="dark"] .theme-controls-panel {
      background: #1e1e1e;
      border-color: #333;
      color: #ffffff;
    }
    
    /* High Contrast Theme */
    [data-theme="high-contrast"] {
      background: #000000;
      color: #ffffff;
    }
    
    [data-theme="high-contrast"] .btn {
      border: 2px solid #ffffff;
    }
  `;

  const styleSheet = document.createElement('style');
  styleSheet.textContent = css;
  document.head.appendChild(styleSheet);
}

// Implementation of control functions
function showAddProcessDialog() {
  // Implementation for adding new processes dynamically
  console.log('Add process dialog');
}

function showRemoveProcessDialog() {
  // Implementation for removing processes
  console.log('Remove process dialog');
}

function pauseCurrentProcess() {
  if (window.simulator.planificador && window.simulator.planificador.enEjecucion) {
    const proceso = window.simulator.planificador.enEjecucion;
    console.log(`Pausing process: ${proceso.nombre}`);
    // Implement pause logic
  }
}

function boostProcessPriority() {
  // Implementation for boosting process priority
  console.log('Boost process priority');
}

function performDefragmentation() {
  if (window.simulator.memoria) {
    console.log('Performing memory defragmentation');
    // Implement defragmentation logic
  }
}

function performGarbageCollection() {
  if (window.simulator.memoria) {
    console.log('Performing garbage collection');
    // Implement garbage collection logic
  }
}

function showMemoryStatistics() {
  if (window.simulator.memoria) {
    const stats = calculateMemoryStats();
    alert(`Memory Statistics:\nTotal: ${stats.total}KB\nUsed: ${stats.used}KB\nFree: ${stats.free}KB\nFragmentation: ${stats.fragmentation}%`);
  }
}

function calculateMemoryStats() {
  const memoria = window.simulator.memoria;
  const total = memoria.total;
  const freeBlocks = memoria.bloques.filter(b => b.libre);
  const free = freeBlocks.reduce((sum, b) => sum + b.tamaño, 0);
  const used = total - free;
  const fragmentation = ((freeBlocks.length - 1) / memoria.bloques.length * 100).toFixed(1);

  return { total, used, free, fragmentation };
}

function updateSimulationSpeed(speed) {
  if (window.simulator) {
    window.simulator.speed = speed;
    console.log(`Simulation speed set to: ${speed}x`);
  }
}

function updateSpeedButtonStates(currentSpeed) {
  const speedBtns = document.querySelectorAll('.speed-btn');
  speedBtns.forEach(btn => {
    const isActive = Math.abs(parseFloat(btn.dataset.speed) - currentSpeed) < 0.01;
    btn.classList.toggle('active', isActive);
  });
}

function exportConfiguration() {
  const config = {
    processes: window.simulator.procesos || [],
    memory: { total: window.simulator.memoria?.total || 1024 },
    algorithm: window.simulator.algoritmo || 'SJF',
    quantum: window.simulator.quantum || 5
  };

  const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'simulation-config.json';
  a.click();
  URL.revokeObjectURL(url);
}

function exportSimulationResults() {
  const results = {
    metrics: window.simulator.metrics?.exportData() || {},
    processes: window.simulator.procesos || [],
    timestamp: new Date().toISOString()
  };

  const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'simulation-results.json';
  a.click();
  URL.revokeObjectURL(url);
}

function handleConfigImport(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const config = JSON.parse(e.target.result);
      // Apply imported configuration
      console.log('Imported configuration:', config);
    } catch (error) {
      alert('Error al importar configuración: ' + error.message);
    }
  };
  reader.readAsText(file);
}

function resetSimulation() {
  cleanupIntervals();
  // Reset all simulation state
  if (window.simulator) {
    window.simulator.procesos = [];
    window.simulator.memoria = null;
    window.simulator.planificador = null;
    console.log('Simulation reset');
  }

}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('preferred-theme', theme); // Si está disponible
  console.log(`Applied theme: ${theme}`);
}

function toggleAnimations(enabled) {
  if (window.simulator.animationManager) {
    if (enabled) {
      window.simulator.animationManager.enableAnimations();
    } else {
      window.simulator.animationManager.disableAnimations();
    }
  }

  // Toggle CSS animation classes
  const body = document.body;
  if (enabled) {
    body.classList.remove('no-animations');
  } else {
    body.classList.add('no-animations');
  }

  console.log(`Animations ${enabled ? 'enabled' : 'disabled'}`);
}

function onSimulationStart() {
  console.log('Simulation started');
  updateMemoryDisplay();
  showNotification('Simulación iniciada', 'success');

  // Enable real-time updates
  startRealTimeUpdates();
}

function onSimulationPause() {
  console.log('Simulation paused');
  showNotification('Simulación pausada', 'warning');

  // Pause real-time updates
  pauseRealTimeUpdates();
}

function onSimulationStop() {
  console.log('Simulation stopped');
  showNotification('Simulación detenida', 'info');

  // Stop real-time updates
  stopRealTimeUpdates();

  // Reset visual states
  resetVisualStates();
}

/**
 * Start real-time memory and process updates
 */
function startRealTimeUpdates() {
  if (window.simulator.updateInterval) {
    clearInterval(window.simulator.updateInterval);
  }

  window.simulator.updateInterval = setInterval(() => {
    updateMemoryDisplay();
    updateMemoryStats();
    updateProcessStates();
  }, 100);
}

/**
 * Pause real-time updates
 */
function pauseRealTimeUpdates() {
  if (window.simulator.updateInterval) {
    clearInterval(window.simulator.updateInterval);
    window.simulator.updateInterval = null;
  }
}

/**
 * Stop real-time updates
 */
function stopRealTimeUpdates() {
  pauseRealTimeUpdates();
}

/**
 * Update memory display with current state
 */
function updateMemoryDisplay() {
  try {
    if (window.simulator.memoria && window.drawMemory) {
      window.drawMemory(window.simulator.memoria);
    }
  } catch (error) {
    console.error('Error updating memory display:', error);
    showNotification('Error actualizando visualización', 'error');
  }
}

/**
 * Update memory statistics in the UI
 */
function updateMemoryStats() {
  const freeMemoryEl = document.getElementById('free-memory');
  const fragmentationEl = document.getElementById('fragmentation');

  if (window.simulator.memoria && freeMemoryEl && fragmentationEl) {
    const stats = calculateMemoryStats();
    freeMemoryEl.textContent = `${stats.free}KB`;
    fragmentationEl.textContent = `${stats.fragmentation}%`;
  }
}

/**
 * Update process states in the UI
 */
function updateProcessStates() {
  const processes = window.simulator.procesos || [];

  processes.forEach(proceso => {
    // Update process visual states based on current status
    const processElement = document.querySelector(`[data-process-id="${proceso.id}"]`);
    if (processElement) {
      // Remove all state classes
      processElement.classList.remove('estado-nuevo', 'estado-listo', 'estado-ejecutando', 'estado-terminado', 'estado-swapped');

      // Add current state class
      const stateClass = `estado-${proceso.estado.toLowerCase().replace(' ', '-')}`;
      processElement.classList.add(stateClass);
    }
  });
}

/**
 * Reset all visual states
 */
function resetVisualStates() {
  // Remove all state classes from process elements
  const processElements = document.querySelectorAll('[data-process-id]');
  processElements.forEach(el => {
    el.classList.remove('estado-nuevo', 'estado-listo', 'estado-ejecutando', 'estado-terminado', 'estado-swapped');
    el.classList.remove('state-transition', 'swapping-out', 'recovering-from-swap');
  });

  // Clear memory display
  const canvas = document.getElementById('canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}

/**
 * Show notification to user
 */
function showNotification(message, type = 'info', duration = 3000) {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;

  document.body.appendChild(notification);

  // Auto-remove notification
  setTimeout(() => {
    notification.style.opacity = '0';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, duration);
}

/**
 * Advanced process management functions
 */
function createAdvancedProcessDialog() {
  const dialog = document.createElement('div');
  dialog.className = 'modal-overlay';
  dialog.innerHTML = `
    <div class="modal-content">
      <h3>➕ Agregar Proceso Avanzado</h3>
      <form id="advanced-process-form">
        <div class="form-group">
          <label for="process-name">Nombre del Proceso:</label>
          <input type="text" id="process-name" placeholder="Ej: Editor de Texto" required>
        </div>
        
        <div class="form-group">
          <label for="process-memory">Memoria (KB):</label>
          <input type="number" id="process-memory" min="1" max="1024" value="64" required>
        </div>
        
        <div class="form-group">
          <label for="process-cpu-time">Tiempo CPU:</label>
          <input type="number" id="process-cpu-time" min="1" max="100" value="10" required>
        </div>
        
        <div class="form-group">
          <label for="process-priority">Prioridad:</label>
          <select id="process-priority">
            <option value="1">Alta (1)</option>
            <option value="2">Media-Alta (2)</option>
            <option value="3" selected>Media (3)</option>
            <option value="4">Media-Baja (4)</option>
            <option value="5">Baja (5)</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="process-arrival">Tiempo de Llegada:</label>
          <input type="number" id="process-arrival" min="0" value="0" required>
        </div>
        
        <div class="form-group">
          <label>
            <input type="checkbox" id="process-io-intensive"> Proceso I/O Intensivo
          </label>
        </div>
        
        <div class="form-actions">
          <button type="submit" class="btn primary">Crear Proceso</button>
          <button type="button" class="btn secondary" onclick="closeModal()">Cancelar</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(dialog);

  // Setup form handler
  const form = document.getElementById('advanced-process-form');
  form.addEventListener('submit', handleAdvancedProcessCreation);

  return dialog;
}

function handleAdvancedProcessCreation(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const processData = {
    nombre: formData.get('process-name') || `Proceso-${Date.now()}`,
    memoria: parseInt(formData.get('process-memory')) || 64,
    tiempoCPU: parseInt(formData.get('process-cpu-time')) || 10,
    prioridad: parseInt(formData.get('process-priority')) || 3,
    tiempoLlegada: parseInt(formData.get('process-arrival')) || 0,
    ioIntensive: formData.has('process-io-intensive')
  };

  // Create and add process to simulator
  if (window.simulator && window.simulator.addProcess) {
    const newProcess = window.simulator.addProcess(processData);
    showNotification(`Proceso "${newProcess.nombre}" creado exitosamente`, 'success');
  } else {
    console.log('Created process data:', processData);
    showNotification('Proceso creado (modo demo)', 'info');
  }

  closeModal();
}

function closeModal() {
  const modal = document.querySelector('.modal-overlay');
  if (modal) {
    modal.remove();
  }
}

/**
 * Memory management utilities
 */
function performAdvancedDefragmentation() {
  if (!window.simulator.memoria) {
    showNotification('No hay memoria para desfragmentar', 'warning');
    return;
  }

  console.log('Starting advanced defragmentation...');
  showNotification('Iniciando desfragmentación avanzada...', 'info');

  // Animate defragmentation process
  const blocks = window.simulator.memoria.bloques;
  let step = 0;
  const totalSteps = blocks.length;

  const defragStep = () => {
    if (step < totalSteps) {
      // Visual feedback for defragmentation progress
      updateMemoryDisplay();
      showNotification(`Desfragmentación: ${Math.round((step / totalSteps) * 100)}%`, 'info', 500);
      step++;
      setTimeout(defragStep, 100);
    } else {
      showNotification('Desfragmentación completada', 'success');
      updateMemoryStats();
    }
  };

  defragStep();
}

/**
 * Performance monitoring and metrics
 */
function startPerformanceMonitoring() {
  if (window.simulator.performanceMonitor) {
    clearInterval(window.simulator.performanceMonitor);
  }

  window.simulator.performanceData = {
    cpuUtilization: [],
    memoryUtilization: [],
    swapActivity: [],
    contextSwitches: 0,
    timestamps: []
  };

  window.simulator.performanceMonitor = setInterval(() => {
    collectPerformanceMetrics();
  }, 1000);
}

function collectPerformanceMetrics() {
  const now = new Date();
  const simulator = window.simulator;

  if (!simulator.performanceData) return;

  // Calculate CPU utilization
  const runningProcesses = (simulator.procesos || []).filter(p => p.estado === 'Ejecutando').length;
  const totalProcesses = (simulator.procesos || []).length;
  const cpuUtil = totalProcesses > 0 ? (runningProcesses / totalProcesses) * 100 : 0;

  // Calculate memory utilization
  let memoryUtil = 0;
  if (simulator.memoria) {
    const stats = calculateMemoryStats();
    memoryUtil = (stats.used / stats.total) * 100;
  }

  // Calculate swap activity
  const swapProcesses = (simulator.memoria?.swap || []).length;

  // Store metrics
  simulator.performanceData.cpuUtilization.push(cpuUtil);
  simulator.performanceData.memoryUtilization.push(memoryUtil);
  simulator.performanceData.swapActivity.push(swapProcesses);
  simulator.performanceData.timestamps.push(now);

  // Keep only last 60 data points (1 minute)
  const maxPoints = 60;
  if (simulator.performanceData.timestamps.length > maxPoints) {
    simulator.performanceData.cpuUtilization.shift();
    simulator.performanceData.memoryUtilization.shift();
    simulator.performanceData.swapActivity.shift();
    simulator.performanceData.timestamps.shift();
  }
}

/**
 * Export enhanced CSS for modal dialogs
 */
function injectModalCSS() {
  const modalCSS = `
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      animation: fadeIn 0.3s ease;
    }
    
    .modal-content {
      background: white;
      padding: 30px;
      border-radius: 12px;
      max-width: 500px;
      width: 90%;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      animation: slideUp 0.3s ease;
    }
    
    .form-group {
      margin-bottom: 20px;
    }
    
    .form-group label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
      color: #333;
    }
    
    .form-group input,
    .form-group select {
      width: 100%;
      padding: 10px;
      border: 2px solid #ddd;
      border-radius: 6px;
      font-size: 14px;
      transition: border-color 0.3s ease;
    }
    
    .form-group input:focus,
    .form-group select:focus {
      outline: none;
      border-color: #2196f3;
      box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
    }
    
    .form-actions {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
      margin-top: 30px;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes slideUp {
      from { transform: translateY(30px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    
    /* Disable animations class */
    .no-animations * {
      animation: none !important;
      transition: none !important;
    }
  `;

  const styleSheet = document.createElement('style');
  styleSheet.textContent = modalCSS;
  document.head.appendChild(styleSheet);
}

// Initialize modal CSS when the module loads
injectModalCSS();

// Override the original showAddProcessDialog function
function showAddProcessDialog() {
  createAdvancedProcessDialog();
}

function cleanupIntervals() {
  if (window.simulator.updateInterval) {
    clearInterval(window.simulator.updateInterval);
  }
  if (window.simulator.performanceMonitor) {
    clearInterval(window.simulator.performanceMonitor);
  }
}

/**
 * Initialize keyboard shortcuts
 */
function initializeKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Only trigger shortcuts when not typing in input fields
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      return;
    }

    // Ctrl/Cmd + key combinations
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 's':
          e.preventDefault();
          onSimulationStart();
          break;
        case 'p':
          e.preventDefault();
          onSimulationPause();
          break;
        case 'r':
          e.preventDefault();
          if (confirm('¿Reiniciar simulación?')) {
            resetSimulation();
          }
          break;
        case 'e':
          e.preventDefault();
          exportConfiguration();
          break;
        case 'n':
          e.preventDefault();
          showAddProcessDialog();
          break;
      }
    }

    // Escape key to close modals
    if (e.key === 'Escape') {
      closeModal();
    }
  });

  console.log('Keyboard shortcuts initialized');
  showNotification('Atajos de teclado activos: Ctrl+S (start), Ctrl+P (pause), Ctrl+R (reset), Ctrl+E (export), Ctrl+N (new process)', 'info', 5000);
}

// Add keyboard shortcuts initialization to the main init function
const originalInitialize = window.initializeEnhancedSystem || initializeEnhancedSystem;
window.initializeEnhancedSystem = function () {
  originalInitialize();
  initializeKeyboardShortcuts();
};

// Export all functions for external use
export {
  initializeEnhancedSystem,
  drawMemoryWithSwap,
  showNotification,
  startPerformanceMonitoring,
  performAdvancedDefragmentation,
  createAdvancedProcessDialog
};