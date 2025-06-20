// src/integration/hu08_hu09.js
import { AnimationManager, enhancedAnimationStyles } from '../renderer/animations.js';
import { Planificador } from '../core/scheduler.js';

/**
 * HU08 & HU09 Integration
 * Integrates swapping functionality with visual animations
 */
export class SwapAnimationIntegrator {
  constructor() {
    this.animationManager = null;
    this.isInitialized = false;
  }

  /**
   * Initialize the integration system
   */
  initialize() {
    if (this.isInitialized) return;

    // 1. Inject enhanced CSS styles
    this.injectStyles();

    // 2. Initialize animation manager
    this.initializeAnimationManager();

    // 3. Enhance scheduler with animation callbacks
    this.enhanceScheduler();

    // 4. Enhance memory rendering
    this.enhanceMemoryVisualization();

    // 5. Add enhanced swap controls
    this.enhanceSwapControls();

    this.isInitialized = true;
    console.log('✅ HU08 & HU09 Integration initialized');
  }

  /**
   * Inject enhanced CSS styles for animations
   */
  injectStyles() {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = enhancedAnimationStyles;
    document.head.appendChild(styleSheet);
  }

  /**
   * Initialize the animation manager
   */
  initializeAnimationManager() {
    const canvas = document.getElementById('canvas');
    const processListElement = document.getElementById('process-list') || 
                              this.createProcessListElement();
    const swapListElement = document.getElementById('swap-ul') || 
                           this.createSwapListElement();

    this.animationManager = new AnimationManager(
      canvas,
      processListElement,
      swapListElement
    );

    // Store reference globally
    window.simulator.animationManager = this.animationManager;
  }

  /**
   * Create process list element if it doesn't exist
   */
  createProcessListElement() {
    let ul = document.getElementById('process-list');
    if (!ul) {
      ul = document.createElement('ul');
      ul.id = 'process-list';
      ul.className = 'process-list';
      const container = document.querySelector('.process-list-container') || 
                       document.getElementById('controls');
      container.appendChild(ul);
    }
    return ul;
  }

  /**
   * Create swap list element if it doesn't exist
   */
  createSwapListElement() {
    let ul = document.getElementById('swap-ul');
    if (!ul) {
      const swapContainer = document.createElement('div');
      swapContainer.className = 'swap-container';
      swapContainer.innerHTML = `
        <h3>💾 Swap (Disco Virtual)</h3>
        <ul id="swap-ul" class="swap-list"></ul>
        <div class="swap-controls">
          <button id="recover-btn" class="btn secondary">Recuperar de Swap</button>
          <button id="auto-recover-btn" class="btn secondary">Auto-recuperar</button>
        </div>
        <div id="swap-stats" class="swap-stats">
          <span>Procesos en swap: <strong id="swap-count">0</strong></span>
        </div>
      `;
      
      const processLists = document.querySelector('.process-lists') || 
                          document.getElementById('controls');
      processLists.appendChild(swapContainer);

      ul = document.getElementById('swap-ul');
      this.setupRecoveryButtons();
    }
    return ul;
  }

  /**
   * Setup manual and auto recovery button functionality
   */
  setupRecoveryButtons() {
    const recoverBtn = document.getElementById('recover-btn');
    const autoRecoverBtn = document.getElementById('auto-recover-btn');
    
    if (recoverBtn) {
      recoverBtn.addEventListener('click', () => {
        this.performManualRecovery();
      });
    }

    if (autoRecoverBtn) {
      let autoRecovery = false;
      autoRecoverBtn.addEventListener('click', () => {
        autoRecovery = !autoRecovery;
        autoRecoverBtn.textContent = autoRecovery ? 'Detener Auto-recuperar' : 'Auto-recuperar';
        autoRecoverBtn.classList.toggle('active', autoRecovery);
        
        if (autoRecovery) {
          this.startAutoRecovery();
        } else {
          this.stopAutoRecovery();
        }
      });
    }
  }

  /**
   * Perform manual recovery from swap with animations
   */
  performManualRecovery() {
    if (!window.simulator.memoria) return;

    const recovered = [];
    for (const proceso of [...window.simulator.memoria.swap]) {
      if (window.simulator.memoria.recuperar(proceso)) {
        recovered.push(proceso);
        
        // Trigger recovery animation
        this.animationManager.animateSwap(proceso, false);
        this.animationManager.animateStateChange(proceso, 'Swapped', 'Listo');
      }
    }

    if (recovered.length > 0) {
      this.updateAllVisualization();
      this.showRecoveryNotification(recovered.length);
    } else {
      this.showNoRecoveryNotification();
    }
  }

  /**
   * Start automatic recovery process
   */
  startAutoRecovery() {
    this.autoRecoveryInterval = setInterval(() => {
      if (window.simulator.memoria && window.simulator.memoria.swap.length > 0) {
        this.performManualRecovery();
      }
    }, 2000); // Try every 2 seconds
  }

  /**
   * Stop automatic recovery process
   */
  stopAutoRecovery() {
    if (this.autoRecoveryInterval) {
      clearInterval(this.autoRecoveryInterval);
      this.autoRecoveryInterval = null;
    }
  }

  /**
   * Show recovery success notification
   */
  showRecoveryNotification(count) {
    this.showNotification(
      `✅ ${count} proceso(s) recuperado(s) de swap`,
      'success'
    );
  }

  /**
   * Show no recovery notification
   */
  showNoRecoveryNotification() {
    this.showNotification(
      '⚠️ No hay procesos que puedan ser recuperados en este momento',
      'warning'
    );
  }

  /**
   * Show notification system
   */
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }

  /**
   * Enhance scheduler with animation callbacks
   */
  enhanceScheduler() {
    // Store original scheduler creation
    const originalCreateScheduler = window.simulator.createScheduler;
    
    window.simulator.createScheduler = (procesos, memoria, algoritmo, quantum) => {
      // Create scheduler using original method or direct instantiation
      const scheduler = originalCreateScheduler ? 
                       originalCreateScheduler(procesos, memoria, algoritmo, quantum) :
                       new Planificador(procesos, memoria, algoritmo, quantum);
      
      // Add animation callbacks
      scheduler.onStateChange = (proceso, oldState, newState) => {
        this.animationManager.animateStateChange(proceso, oldState, newState);
        this.updateProcessInUI(proceso, newState);
      };
      
      scheduler.onSwapOperation = (proceso, toSwap) => {
        this.animationManager.animateSwap(proceso, toSwap);
        this.updateSwapUI();
        this.updateSwapStats();
      };

      return scheduler;
    };

    // Also enhance existing scheduler if it exists
    if (window.simulator.planificador) {
      window.simulator.planificador.onStateChange = (proceso, oldState, newState) => {
        this.animationManager.animateStateChange(proceso, oldState, newState);
        this.updateProcessInUI(proceso, newState);
      };
      
      window.simulator.planificador.onSwapOperation = (proceso, toSwap) => {
        this.animationManager.animateSwap(proceso, toSwap);
        this.updateSwapUI();
        this.updateSwapStats();
      };
    }
  }

  /**
   * Update process in UI with state changes
   */
  updateProcessInUI(proceso, newState) {
    const processListElement = document.getElementById('process-list');
    if (!processListElement) return;

    const listItems = processListElement.querySelectorAll('li');
    listItems.forEach(li => {
      if (li.textContent.includes(`PID=${proceso.id}`) || 
          li.textContent.includes(`${proceso.nombre}`)) {
        
        // Remove all state classes
        li.classList.remove('estado-nuevo', 'estado-listo', 'estado-ejecutando', 
                           'estado-terminado', 'estado-swapped');
        
        // Add new state class
        li.classList.add(`estado-${newState.toLowerCase()}`);
        
        // Add transition effect
        li.classList.add('state-transition');
        setTimeout(() => li.classList.remove('state-transition'), 600);
        
        // Update text content
        this.updateProcessText(li, proceso, newState);
      }
    });
  }

  /**
   * Update process text display
   */
  updateProcessText(li, proceso, state) {
    li.innerHTML = `
      <span class="process-name">${proceso.nombre}</span>
      <span class="process-details">
        PID=${proceso.id}, Estado=${state}, 
        Llegada=${proceso.llegada}ms, Burst=${proceso.burst}ms, 
        Restante=${proceso.restante}ms, Mem=${proceso.memoria}KB
      </span>
    `;
  }

  /**
   * Update swap UI display
   */
  updateSwapUI() {
    const swapListElement = document.getElementById('swap-ul');
    if (!swapListElement || !window.simulator.memoria) return;

    // Clear existing swap list
    swapListElement.innerHTML = '';

    // Add swapped processes
    window.simulator.memoria.swap.forEach(proceso => {
      const li = document.createElement('li');
      li.className = 'swap-item';
      li.innerHTML = `
        <span class="swap-process-name">💾 ${proceso.nombre}</span>
        <span class="swap-process-details">
          PID=${proceso.id}, Mem=${proceso.memoria}KB, 
          Burst=${proceso.restante}ms restante
        </span>
        <button class="recover-single-btn" data-process-id="${proceso.id}">
          Recuperar
        </button>
      `;
      
      // Add click handler for individual recovery
      const recoverBtn = li.querySelector('.recover-single-btn');
      recoverBtn.addEventListener('click', () => {
        this.recoverSingleProcess(proceso);
      });
      
      swapListElement.appendChild(li);
    });
  }

  /**
   * Recover a single process from swap
   */
  recoverSingleProcess(proceso) {
    if (!window.simulator.memoria) return;

    if (window.simulator.memoria.recuperar(proceso)) {
      this.animationManager.animateSwap(proceso, false);
      this.animationManager.animateStateChange(proceso, 'Swapped', 'Listo');
      this.updateAllVisualization();
      this.showRecoveryNotification(1);
    } else {
      this.showNotification(
        `❌ No se puede recuperar ${proceso.nombre} - memoria insuficiente`,
        'error'
      );
    }
  }

  /**
   * Update swap statistics
   */
  updateSwapStats() {
    const swapCountElement = document.getElementById('swap-count');
    if (swapCountElement && window.simulator.memoria) {
      swapCountElement.textContent = window.simulator.memoria.swap.length;
    }
  }

  /**
   * Enhance memory visualization with swap indicators
   */
  enhanceMemoryVisualization() {
    // Override the drawMemory function
    const originalDrawMemory = window.drawMemory;
    
    window.drawMemory = (memoria) => {
      this.drawMemoryWithSwap(memoria);
    };

    // Store original for fallback
    window.drawMemoryOriginal = originalDrawMemory;
  }

  /**
   * Enhanced memory drawing with swap visualization
   */
  drawMemoryWithSwap(memoria) {
    const canvas = document.getElementById('canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height - 40; // Reserve space for swap area
    
    ctx.clearRect(0, 0, W, canvas.height);

    // Draw memory blocks
    let x = 0;
    for (const bloque of memoria.bloques) {
      const w = (bloque.tamaño / memoria.total) * W;
      
      // Enhanced coloring based on process state
      if (bloque.libre) {
        ctx.fillStyle = '#f0f0f0';
        ctx.strokeStyle = '#ddd';
      } else {
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
      ctx.fillStyle = bloque.libre ? '#666' : '#fff';
      ctx.font = 'bold 11px sans-serif';
      
      if (bloque.proceso) {
        ctx.fillText(bloque.proceso.nombre, x + 3, 15);
        ctx.font = '9px sans-serif';
        ctx.fillText(`${bloque.tamaño}KB`, x + 3, 27);
        ctx.fillText(`PID:${bloque.proceso.id}`, x + 3, 37);
      } else {
        ctx.fillText('LIBRE', x + 3, 20);
        ctx.font = '9px sans-serif';
        ctx.fillText(`${bloque.tamaño}KB`, x + 3, 32);
      }

      x += w;
    }

    // Draw swap area
    this.drawSwapArea(ctx, memoria.swap, W, H);
  }

  /**
   * Draw swap area visualization
   */
  drawSwapArea(ctx, swapList, canvasWidth, memoryHeight) {
    const swapY = memoryHeight + 5;
    const swapHeight = 30;
    
    // Swap area background
    ctx.fillStyle = swapList.length > 0 ? '#fff3e0' : '#f5f5f5';
    ctx.fillRect(0, swapY, canvasWidth, swapHeight);
    ctx.strokeStyle = swapList.length > 0 ? '#ff9800' : '#ddd';
    ctx.strokeRect(0, swapY, canvasWidth, swapHeight);
    
    // Swap label and count
    ctx.fillStyle = swapList.length > 0 ? '#e65100' : '#999';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText(`💾 SWAP (${swapList.length})`, 8, swapY + 18);
    
    // Draw swapped processes indicators
    let swapX = 120;
    const maxVisible = Math.floor((canvasWidth - 130) / 50);
    const visibleProcesses = swapList.slice(0, maxVisible);
    
    visibleProcesses.forEach((proceso, index) => {
      // Process indicator
      ctx.fillStyle = '#ff9800';
      ctx.fillRect(swapX, swapY + 5, 45, 20);
      ctx.strokeStyle = '#f57c00';
      ctx.strokeRect(swapX, swapY + 5, 45, 20);
      
      // Process name
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 9px sans-serif';
      const displayName = proceso.nombre.length > 6 ? 
                         proceso.nombre.substring(0, 5) + '.' : 
                         proceso.nombre;
      ctx.fillText(displayName, swapX + 2, swapY + 16);
      
      // Memory info
      ctx.font = '7px sans-serif';
      ctx.fillText(`${proceso.memoria}KB`, swapX + 2, swapY + 22);
      
      swapX += 50;
    });
    
    // Show overflow indicator if there are more processes
    if (swapList.length > maxVisible) {
      ctx.fillStyle = '#e65100';
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText(`+${swapList.length - maxVisible}`, swapX, swapY + 18);
    }
  }

  /**
   * Update all visualizations
   */
  updateAllVisualization() {
    if (window.simulator.memoria) {
      this.drawMemoryWithSwap(window.simulator.memoria);
      this.updateSwapUI();
      this.updateSwapStats();
    }
  }

  /**
   * Enhanced swap controls
   */
  enhanceSwapControls() {
    // Add swap control panel if it doesn't exist
    let swapControlPanel = document.getElementById('swap-control-panel');
    if (!swapControlPanel) {
      swapControlPanel = document.createElement('div');
      swapControlPanel.id = 'swap-control-panel';
      swapControlPanel.className = 'control-panel';
      swapControlPanel.innerHTML = `
        <h4>🔄 Control de Swap</h4>
        <div class="swap-controls-advanced">
          <button id="clear-swap-btn" class="btn danger">Limpiar Swap</button>
          <button id="force-swap-btn" class="btn warning">Forzar Swap</button>
          <label>
            <input type="checkbox" id="auto-swap-checkbox"> Auto-swap activo
          </label>
        </div>
      `;
      
      const controlsContainer = document.getElementById('controls');
      controlsContainer.appendChild(swapControlPanel);
      
      this.setupAdvancedSwapControls();
    }
  }

  /**
   * Setup advanced swap controls
   */
  setupAdvancedSwapControls() {
    const clearSwapBtn = document.getElementById('clear-swap-btn');
    const forceSwapBtn = document.getElementById('force-swap-btn');
    const autoSwapCheckbox = document.getElementById('auto-swap-checkbox');
    
    if (clearSwapBtn) {
      clearSwapBtn.addEventListener('click', () => {
        if (confirm('¿Estás seguro de que quieres limpiar todos los procesos del swap?')) {
          this.clearAllSwap();
        }
      });
    }
    
    if (forceSwapBtn) {
      forceSwapBtn.addEventListener('click', () => {
        this.forceSwapProcess();
      });
    }
    
    if (autoSwapCheckbox) {
      autoSwapCheckbox.addEventListener('change', (e) => {
        window.simulator.autoSwapEnabled = e.target.checked;
        this.showNotification(
          `Auto-swap ${e.target.checked ? 'activado' : 'desactivado'}`,
          'info'
        );
      });
    }
  }

  /**
   * Clear all processes from swap
   */
  clearAllSwap() {
    if (!window.simulator.memoria) return;
    
    const swappedCount = window.simulator.memoria.swap.length;
    window.simulator.memoria.swap = [];
    
    this.updateAllVisualization();
    this.showNotification(`🗑️ ${swappedCount} proceso(s) eliminado(s) del swap`, 'warning');
  }

  /**
   * Force swap a running process
   */
  forceSwapProcess() {
    if (!window.simulator.memoria || !window.simulator.planificador) return;
    
    const runningProcess = window.simulator.planificador.enEjecucion;
    if (runningProcess) {
      // Force the process to swap
      window.simulator.memoria.liberar(runningProcess);
      runningProcess.estado = 'Swapped';
      window.simulator.memoria.swap.push(runningProcess);
      window.simulator.planificador.enEjecucion = null;
      
      this.animationManager.animateSwap(runningProcess, true);
      this.updateAllVisualization();
      this.showNotification(`⚡ ${runningProcess.nombre} forzado al swap`, 'warning');
    } else {
      this.showNotification('❌ No hay procesos en ejecución para forzar al swap', 'error');
    }
  }

  /**
   * Cleanup resources
   */
  cleanup() {
    if (this.autoRecoveryInterval) {
      clearInterval(this.autoRecoveryInterval);
    }
    
    if (this.animationManager) {
      this.animationManager.stopAnimationLoop();
    }
    
    this.isInitialized = false;
  }
}

// Create and export the global integrator instance
export const swapAnimationIntegrator = new SwapAnimationIntegrator();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    swapAnimationIntegrator.initialize();
  });
} else {
  swapAnimationIntegrator.initialize();
}