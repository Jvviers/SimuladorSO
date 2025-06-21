// src/integration/hu08_hu09.js
import { AnimationManager, enhancedAnimationStyles } from '../renderer/animation.js';
import { Planificador } from '../core/process.js'; // Fixed import path

/**
 * HU08 & HU09 Integration
 * Integrates swapping functionality with visual animations
 */
export class SwapAnimationIntegrator {
  constructor() {
    this.animationManager = null;
    this.isInitialized = false;
    this.autoRecoveryInterval = null;
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
    if (window.simulator) {
      window.simulator.animationManager = this.animationManager;
    }
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
                       document.getElementById('controls') ||
                       document.body;
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
                          document.getElementById('controls') ||
                          document.body;
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
    if (!window.simulator?.memoria) return;

    const recovered = [];
    for (const proceso of [...window.simulator.memoria.swap]) {
      if (window.simulator.memoria.recuperar(proceso)) {
        recovered.push(proceso);
        
        // Trigger recovery animation
        if (this.animationManager) {
          this.animationManager.animateSwap(proceso, false);
          this.animationManager.animateStateChange(proceso, 'Swapped', 'Listo');
        }
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
      if (window.simulator?.memoria && window.simulator.memoria.swap.length > 0) {
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
    // Check if window.simulator exists, if not create it
    if (!window.simulator) {
      window.simulator = {};
    }

    // Store original scheduler creation if it exists
    const originalCreateScheduler = window.simulator.createScheduler;
    
    window.simulator.createScheduler = (procesos, memoria, algoritmo, quantum) => {
      // Create scheduler using original method or direct instantiation
      const scheduler = originalCreateScheduler ? 
                       originalCreateScheduler(procesos, memoria, algoritmo, quantum) :
                       new Planificador(procesos, memoria, algoritmo, quantum);
      
      // Add animation callbacks
      scheduler.onStateChange = (proceso, oldState, newState) => {
        if (this.animationManager) {
          this.animationManager.animateStateChange(proceso, oldState, newState);
        }
        this.updateProcessInUI(proceso, newState);
      };
      
      scheduler.onSwapOperation = (proceso, toSwap) => {
        if (this.animationManager) {
          this.animationManager.animateSwap(proceso, toSwap);
        }
        this.updateSwapUI();
      };

      // Enhance scheduler step method to include animations
      const originalStep = scheduler.step.bind(scheduler);
      scheduler.step = () => {
        const result = originalStep();
        
        // Update all visualizations after each step
        this.updateAllVisualization();
        
        return result;
      };

      return scheduler;
    };
  }

  /**
   * Update process in UI with state-specific styling
   */
  updateProcessInUI(proceso, newState) {
    const processElement = this.findProcessElement(proceso);
    if (processElement) {
      // Remove all state classes
      processElement.classList.remove(
        'estado-nuevo', 'estado-listo', 'estado-ejecutando', 
        'estado-terminado', 'estado-swapped'
      );
      
      // Add new state class
      processElement.classList.add(`estado-${newState.toLowerCase()}`);
      
      // Update process text content
      const processInfo = this.formatProcessInfo(proceso);
      processElement.innerHTML = `
        <div class="process-name">${proceso.nombre}</div>
        <div class="process-details">${processInfo}</div>
      `;
    }
  }

  /**
   * Format process information for display
   */
  formatProcessInfo(proceso) {
    let info = `PID=${proceso.id}, T=${proceso.tiempoEjecucion}`;
    
    if (proceso.tiempoRestante !== undefined) {
      info += `, R=${proceso.tiempoRestante}`;
    }
    
    if (proceso.tamaño) {
      info += `, Mem=${proceso.tamaño}KB`;
    }
    
    if (proceso.bloque) {
      info += `, Pos=${proceso.bloque.start}-${proceso.bloque.start + proceso.bloque.tamaño}`;
    }
    
    return info;
  }

  /**
   * Find process element in DOM by process object
   */
  findProcessElement(proceso) {
    const processListElement = document.getElementById('process-list');
    if (!processListElement) return null;

    const elements = processListElement.querySelectorAll('li');
    for (const el of elements) {
      if (el.textContent.includes(`PID=${proceso.id}`) || 
          el.textContent.includes(proceso.nombre)) {
        return el;
      }
    }
    return null;
  }

  /**
   * Update swap UI display
   */
  updateSwapUI() {
    const swapList = document.getElementById('swap-ul');
    const swapCount = document.getElementById('swap-count');
    
    if (!swapList || !window.simulator?.memoria) return;

    // Clear current swap list
    swapList.innerHTML = '';
    
    // Update swap count
    const swappedProcesses = window.simulator.memoria.swap || [];
    if (swapCount) {
      swapCount.textContent = swappedProcesses.length;
    }

    // Add each swapped process to the list
    swappedProcesses.forEach(proceso => {
      const li = document.createElement('li');
      li.className = 'swap-item';
      li.innerHTML = `
        <div>
          <span class="swap-process-name">${proceso.nombre}</span>
          <span class="swap-process-details">PID=${proceso.id}, ${proceso.tamaño}KB</span>
        </div>
        <button class="recover-single-btn" onclick="window.swapIntegrator.recoverSingleProcess('${proceso.id}')">
          Recuperar
        </button>
      `;
      swapList.appendChild(li);
    });
  }

  /**
   * Recover a single process from swap
   */
  recoverSingleProcess(processId) {
    if (!window.simulator?.memoria) return;

    const proceso = window.simulator.memoria.swap.find(p => p.id === processId);
    if (!proceso) return;

    if (window.simulator.memoria.recuperar(proceso)) {
      // Trigger recovery animation
      if (this.animationManager) {
        this.animationManager.animateSwap(proceso, false);
        this.animationManager.animateStateChange(proceso, 'Swapped', 'Listo');
      }
      
      this.updateAllVisualization();
      this.showNotification(`✅ Proceso ${proceso.nombre} recuperado de swap`, 'success');
    } else {
      this.showNotification(`❌ No se pudo recuperar ${proceso.nombre}`, 'error');
    }
  }

  /**
   * Enhance memory visualization with swap indicators
   */
  enhanceMemoryVisualization() {
    // Store original memory render function if it exists
    if (window.simulator && window.simulator.renderMemory) {
      const originalRenderMemory = window.simulator.renderMemory.bind(window.simulator);
      
      window.simulator.renderMemory = () => {
        // Call original render
        originalRenderMemory();
        
        // Add swap visualization enhancements
        this.addSwapVisualizationEffects();
      };
    }
  }

  /**
   * Add visual effects to indicate swapped processes
   */
  addSwapVisualizationEffects() {
    const canvas = document.getElementById('canvas');
    if (!canvas || !window.simulator?.memoria) return;

    const ctx = canvas.getContext('2d');
    const swappedProcesses = window.simulator.memoria.swap || [];
    
    if (swappedProcesses.length > 0) {
      // Add swap indicator on canvas
      ctx.save();
      ctx.fillStyle = 'rgba(255, 152, 0, 0.8)';
      ctx.font = '12px Arial';
      ctx.fillText(`💾 ${swappedProcesses.length} en swap`, 10, canvas.height - 10);
      ctx.restore();
    }
  }

  /**
   * Enhance swap controls with advanced features
   */
  enhanceSwapControls() {
    const swapContainer = document.querySelector('.swap-container');
    if (!swapContainer) return;

    // Add advanced controls
    const advancedControls = document.createElement('div');
    advancedControls.className = 'swap-controls-advanced';
    advancedControls.innerHTML = `
      <label>
        <input type="checkbox" id="auto-swap-checkbox"> Auto-swap cuando memoria llena
      </label>
      <label>
        Prioridad de swap:
        <select id="swap-priority-select">
          <option value="fifo">FIFO (Primero en entrar)</option>
          <option value="lru">LRU (Menos usado recientemente)</option>
          <option value="largest">Proceso más grande</option>
          <option value="smallest">Proceso más pequeño</option>
        </select>
      </label>
    `;
    
    swapContainer.appendChild(advancedControls);
    this.setupAdvancedSwapControls();
  }

  /**
   * Setup advanced swap control functionality
   */
  setupAdvancedSwapControls() {
    const autoSwapCheckbox = document.getElementById('auto-swap-checkbox');
    const swapPrioritySelect = document.getElementById('swap-priority-select');
    
    if (autoSwapCheckbox) {
      autoSwapCheckbox.addEventListener('change', (e) => {
        if (window.simulator?.memoria) {
          window.simulator.memoria.autoSwapEnabled = e.target.checked;
          this.showNotification(
            `Auto-swap ${e.target.checked ? 'activado' : 'desactivado'}`,
            'info'
          );
        }
      });
    }

    if (swapPrioritySelect) {
      swapPrioritySelect.addEventListener('change', (e) => {
        if (window.simulator?.memoria) {
          window.simulator.memoria.swapStrategy = e.target.value;
          this.showNotification(
            `Estrategia de swap cambiada a: ${e.target.value.toUpperCase()}`,
            'info'
          );
        }
      });
    }
  }

  /**
   * Update all visualizations (processes, memory, swap)
   */
  updateAllVisualization() {
    // Update process lists
    if (window.simulator?.renderProcesses) {
      window.simulator.renderProcesses();
    }
    
    // Update memory visualization
    if (window.simulator?.renderMemory) {
      window.simulator.renderMemory();
    }
    
    // Update swap UI
    this.updateSwapUI();
    
    // Update statistics
    this.updateSwapStatistics();
  }

  /**
   * Update swap-related statistics
   */
  updateSwapStatistics() {
    if (!window.simulator?.memoria) return;

    const stats = {
      totalSwapped: window.simulator.memoria.swap?.length || 0,
      totalSwapOperations: window.simulator.memoria.swapOperations || 0,
      totalRecoveryOperations: window.simulator.memoria.recoveryOperations || 0
    };

    // Update stats display if element exists
    const statsElement = document.getElementById('swap-stats');
    if (statsElement) {
      statsElement.innerHTML = `
        <span>Procesos en swap: <strong>${stats.totalSwapped}</strong></span> |
        <span>Operaciones de swap: <strong>${stats.totalSwapOperations}</strong></span> |
        <span>Recuperaciones: <strong>${stats.totalRecoveryOperations}</strong></span>
      `;
    }
  }

  /**
   * Cleanup and destroy the integration
   */
  destroy() {
    if (this.animationManager) {
      this.animationManager.stopAnimationLoop();
      this.animationManager.clearAnimations();
    }
    
    if (this.autoRecoveryInterval) {
      clearInterval(this.autoRecoveryInterval);
    }
    
    // Remove notification elements
    const notifications = document.querySelectorAll('.notification');
    notifications.forEach(n => n.remove());
    
    this.isInitialized = false;
    console.log('🔄 HU08 & HU09 Integration destroyed');
  }
}

// Create global instance and expose recovery function
const integrator = new SwapAnimationIntegrator();
window.swapIntegrator = integrator;

// Export for module use
export default integrator;