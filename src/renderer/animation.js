// src/renderer/animation.js

/**
 * Enhanced animation styles for process state transitions and swap operations
 */
export const enhancedAnimationStyles = `
  /* Process state transitions */
  .process-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .process-list li {
    padding: 8px 12px;
    margin: 4px 0;
    border-radius: 6px;
    border: 2px solid transparent;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    background: linear-gradient(135deg, #f5f5f5, #e8e8e8);
  }

  /* State-specific styles */
  .estado-nuevo {
    background: linear-gradient(135deg, #fff3e0, #ffe0b2);
    border-color: #ff9800;
    color: #e65100;
  }

  .estado-listo {
    background: linear-gradient(135deg, #e3f2fd, #bbdefb);
    border-color: #2196f3;
    color: #0d47a1;
  }

  .estado-ejecutando {
    background: linear-gradient(135deg, #e8f5e8, #c8e6c9);
    border-color: #4caf50;
    color: #1b5e20;
    box-shadow: 0 0 20px rgba(76, 175, 80, 0.3);
    animation: pulse 2s infinite;
  }

  .estado-terminado {
    background: linear-gradient(135deg, #f3e5f5, #e1bee7);
    border-color: #9c27b0;
    color: #4a148c;
    opacity: 0.8;
  }

  .estado-swapped {
    background: linear-gradient(135deg, #ffebee, #ffcdd2);
    border-color: #f44336;
    color: #b71c1c;
    animation: swapPulse 3s infinite;
  }

  /* State transition animation */
  .state-transition {
    transform: scale(1.05);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    z-index: 10;
  }

  /* Pulse animation for running processes */
  @keyframes pulse {
    0%, 100% { 
      box-shadow: 0 0 20px rgba(76, 175, 80, 0.3);
      transform: scale(1);
    }
    50% { 
      box-shadow: 0 0 30px rgba(76, 175, 80, 0.6);
      transform: scale(1.02);
    }
  }

  /* Swap pulse animation */
  @keyframes swapPulse {
    0%, 100% { 
      box-shadow: 0 0 15px rgba(244, 67, 54, 0.3);
    }
    50% { 
      box-shadow: 0 0 25px rgba(244, 67, 54, 0.6);
    }
  }

  /* Swap container styles */
  .swap-container {
    margin-top: 20px;
    padding: 15px;
    border: 2px solid #ff9800;
    border-radius: 8px;
    background: linear-gradient(135deg, #fff8e1, #ffecb3);
  }

  .swap-container h3 {
    margin: 0 0 10px 0;
    color: #e65100;
    font-size: 16px;
  }

  .swap-list {
    list-style: none;
    padding: 0;
    margin: 0 0 10px 0;
    min-height: 40px;
    background: #fff;
    border-radius: 4px;
    border: 1px solid #ffcc02;
  }

  .swap-item {
    padding: 8px 12px;
    margin: 2px;
    background: linear-gradient(135deg, #fff3e0, #ffe0b2);
    border: 1px solid #ff9800;
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.3s ease;
  }

  .swap-item:hover {
    background: linear-gradient(135deg, #ffe0b2, #ffcc02);
    transform: translateX(5px);
  }

  .swap-process-name {
    font-weight: bold;
    color: #e65100;
  }

  .swap-process-details {
    font-size: 12px;
    color: #f57c00;
  }

  .recover-single-btn {
    background: #4caf50;
    color: white;
    border: none;
    padding: 4px 8px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 11px;
    transition: all 0.2s ease;
  }

  .recover-single-btn:hover {
    background: #45a049;
    transform: scale(1.05);
  }

  /* Swap controls */
  .swap-controls {
    display: flex;
    gap: 10px;
    margin-bottom: 10px;
  }

  .swap-controls-advanced {
    display: flex;
    gap: 10px;
    align-items: center;
    flex-wrap: wrap;
  }

  .swap-stats {
    font-size: 14px;
    color: #e65100;
    padding: 5px 0;
  }

  /* Button styles */
  .btn {
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.3s ease;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .btn.secondary {
    background: #6c757d;
    color: white;
  }

  .btn.secondary:hover {
    background: #5a6268;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  .btn.danger {
    background: #dc3545;
    color: white;
  }

  .btn.danger:hover {
    background: #c82333;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
  }

  .btn.warning {
    background: #ffc107;
    color: #212529;
  }

  .btn.warning:hover {
    background: #e0a800;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 193, 7, 0.3);
  }

  .btn.active {
    background: #28a745;
    color: white;
  }

  /* Control panel styles */
  .control-panel {
    margin: 15px 0;
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background: #f8f9fa;
  }

  .control-panel h4 {
    margin: 0 0 10px 0;
    color: #495057;
    font-size: 16px;
  }

  /* Notification styles */
  .notification {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    border-radius: 6px;
    color: white;
    font-weight: 500;
    z-index: 1000;
    transform: translateX(100%);
    animation: slideIn 0.3s ease forwards;
    max-width: 300px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  }

  .notification.success {
    background: linear-gradient(135deg, #4caf50, #45a049);
  }

  .notification.error {
    background: linear-gradient(135deg, #f44336, #d32f2f);
  }

  .notification.warning {
    background: linear-gradient(135deg, #ff9800, #f57c00);
  }

  .notification.info {
    background: linear-gradient(135deg, #2196f3, #1976d2);
  }

  @keyframes slideIn {
    to {
      transform: translateX(0);
    }
  }

  /* Process details styling */
  .process-name {
    font-weight: bold;
    font-size: 14px;
  }

  .process-details {
    font-size: 12px;
    opacity: 0.8;
    margin-left: 10px;
  }

  /* Enhanced canvas animations */
  .canvas-container {
    position: relative;
    overflow: hidden;
  }

  .memory-block-highlight {
    position: absolute;
    border: 3px solid #ff9800;
    border-radius: 4px;
    background: rgba(255, 152, 0, 0.2);
    pointer-events: none;
    animation: highlight 1s ease-in-out;
  }

  @keyframes highlight {
    0%, 100% {
      opacity: 0;
      transform: scale(0.9);
    }
    50% {
      opacity: 1;
      transform: scale(1.05);
    }
  }

  /* Responsive design */
  @media (max-width: 768px) {
    .swap-controls,
    .swap-controls-advanced {
      flex-direction: column;
      align-items: stretch;
    }
    
    .btn {
      margin-bottom: 5px;
    }
    
    .notification {
      right: 10px;
      left: 10px;
      max-width: none;
    }
  }
`;

/**
 * Animation Manager for handling process state transitions and swap operations
 */
export class AnimationManager {
  constructor(canvas, processListElement, swapListElement) {
    this.canvas = canvas;
    this.processListElement = processListElement;
    this.swapListElement = swapListElement;
    this.animationQueue = [];
    this.isAnimating = false;
    this.animationCallbacks = new Map();
    
    this.startAnimationLoop();
  }

  /**
   * Start the animation processing loop
   */
  startAnimationLoop() {
    this.animationLoopId = setInterval(() => {
      this.processAnimationQueue();
    }, 16); // ~60fps
  }

  /**
   * Stop the animation loop
   */
  stopAnimationLoop() {
    if (this.animationLoopId) {
      clearInterval(this.animationLoopId);
      this.animationLoopId = null;
    }
  }

  /**
   * Process the animation queue
   */
  processAnimationQueue() {
    if (this.animationQueue.length === 0) {
      this.isAnimating = false;
      return;
    }

    this.isAnimating = true;
    const animation = this.animationQueue.shift();
    this.executeAnimation(animation);
  }

  /**
   * Execute a single animation
   */
  executeAnimation(animation) {
    switch (animation.type) {
      case 'stateChange':
        this.executeStateChangeAnimation(animation);
        break;
      case 'swap':
        this.executeSwapAnimation(animation);
        break;
      case 'memoryHighlight':
        this.executeMemoryHighlightAnimation(animation);
        break;
      default:
        console.warn('Unknown animation type:', animation.type);
    }
  }

  /**
   * Animate process state changes
   */
  animateStateChange(proceso, oldState, newState) {
    this.animationQueue.push({
      type: 'stateChange',
      proceso: proceso,
      oldState: oldState,
      newState: newState,
      timestamp: Date.now()
    });
  }

  /**
   * Execute state change animation
   */
  executeStateChangeAnimation(animation) {
    const { proceso, oldState, newState } = animation;
    
    // Find the process element in the UI
    const processElements = this.processListElement.querySelectorAll('li');
    let targetElement = null;
    
    processElements.forEach(el => {
      if (el.textContent.includes(`PID=${proceso.id}`) || 
          el.textContent.includes(proceso.nombre)) {
        targetElement = el;
      }
    });

    if (targetElement) {
      // Remove old state classes
      targetElement.classList.remove(
        'estado-nuevo', 'estado-listo', 'estado-ejecutando', 
        'estado-terminado', 'estado-swapped'
      );
      
      // Add transition class
      targetElement.classList.add('state-transition');
      
      // Add new state class after a brief delay
      setTimeout(() => {
        targetElement.classList.add(`estado-${newState.toLowerCase()}`);
        
        // Remove transition class
        setTimeout(() => {
          targetElement.classList.remove('state-transition');
        }, 300);
      }, 100);
    }

    // Trigger memory highlight if process is being allocated/deallocated
    if (newState === 'Listo' || newState === 'Terminado') {
      this.animateMemoryHighlight(proceso);
    }
  }

  /**
   * Animate swap operations
   */
  animateSwap(proceso, toSwap) {
    this.animationQueue.push({
      type: 'swap',
      proceso: proceso,
      toSwap: toSwap,
      timestamp: Date.now()
    });
  }

  /**
   * Execute swap animation
   */
  executeSwapAnimation(animation) {
    const { proceso, toSwap } = animation;
    
    if (toSwap) {
      // Process going TO swap
      this.animateProcessToSwap(proceso);
    } else {
      // Process coming FROM swap
      this.animateProcessFromSwap(proceso);
    }
  }

  /**
   * Animate process going to swap
   */
  animateProcessToSwap(proceso) {
    // Create temporary animation element
    const animElement = document.createElement('div');
    animElement.className = 'swap-animation-element';
    animElement.textContent = `💾 ${proceso.nombre}`;
    animElement.style.cssText = `
      position: fixed;
      background: #ff9800;
      color: white;
      padding: 8px 12px;
      border-radius: 4px;
      font-weight: bold;
      z-index: 1000;
      pointer-events: none;
      animation: swapToAnimation 1s ease-in-out forwards;
    `;

    // Add animation keyframes if not already present
    this.addSwapAnimationStyles();

    document.body.appendChild(animElement);

    // Position element at process location
    const processElement = this.findProcessElement(proceso);
    if (processElement) {
      const rect = processElement.getBoundingClientRect();
      animElement.style.left = rect.left + 'px';
      animElement.style.top = rect.top + 'px';
    }

    // Remove element after animation
    setTimeout(() => {
      if (animElement.parentNode) {
        animElement.parentNode.removeChild(animElement);
      }
    }, 1000);
  }

  /**
   * Animate process coming from swap
   */
  animateProcessFromSwap(proceso) {
    // Similar to toSwap but in reverse
    const animElement = document.createElement('div');
    animElement.className = 'swap-animation-element';
    animElement.textContent = `🔄 ${proceso.nombre}`;
    animElement.style.cssText = `
      position: fixed;
      background: #4caf50;
      color: white;
      padding: 8px 12px;
      border-radius: 4px;
      font-weight: bold;
      z-index: 1000;
      pointer-events: none;
      animation: swapFromAnimation 1s ease-in-out forwards;
    `;

    this.addSwapAnimationStyles();
    document.body.appendChild(animElement);

    // Position at swap area
    const swapContainer = document.querySelector('.swap-container');
    if (swapContainer) {
      const rect = swapContainer.getBoundingClientRect();
      animElement.style.left = rect.left + 'px';
      animElement.style.top = rect.top + 'px';
    }

    setTimeout(() => {
      if (animElement.parentNode) {
        animElement.parentNode.removeChild(animElement);
      }
    }, 1000);
  }

  /**
   * Add swap animation CSS styles
   */
  addSwapAnimationStyles() {
    if (document.getElementById('swap-animation-styles')) return;

    const style = document.createElement('style');
    style.id = 'swap-animation-styles';
    style.textContent = `
      @keyframes swapToAnimation {
        0% {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
        50% {
          opacity: 0.7;
          transform: scale(1.2) translateY(-20px);
        }
        100% {
          opacity: 0;
          transform: scale(0.8) translateY(100px);
        }
      }

      @keyframes swapFromAnimation {
        0% {
          opacity: 0;
          transform: scale(0.8) translateY(100px);
        }
        50% {
          opacity: 0.7;
          transform: scale(1.2) translateY(-20px);
        }
        100% {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Animate memory block highlighting
   */
  animateMemoryHighlight(proceso) {
    if (!this.canvas || !proceso.bloque) return;

    this.animationQueue.push({
      type: 'memoryHighlight',
      proceso: proceso,
      timestamp: Date.now()
    });
  }

  /**
   * Execute memory highlight animation
   */
  executeMemoryHighlightAnimation(animation) {
    const { proceso } = animation;
    
    if (!proceso.bloque) return;

    // Create highlight overlay
    const canvasRect = this.canvas.getBoundingClientRect();
    const canvasWidth = this.canvas.width;
    const totalMemory = window.simulator.memoria?.total || 1024;
    
    const blockStart = proceso.bloque.start;
    const blockSize = proceso.bloque.tamaño;
    
    const x = (blockStart / totalMemory) * canvasWidth;
    const width = (blockSize / totalMemory) * canvasWidth;
    
    const highlight = document.createElement('div');
    highlight.className = 'memory-block-highlight';
    highlight.style.cssText = `
      position: absolute;
      left: ${canvasRect.left + x}px;
      top: ${canvasRect.top}px;
      width: ${width}px;
      height: ${canvasRect.height - 40}px;
      pointer-events: none;
      z-index: 100;
    `;
    
    document.body.appendChild(highlight);
    
    // Remove after animation
    setTimeout(() => {
      if (highlight.parentNode) {
        highlight.parentNode.removeChild(highlight);
      }
    }, 1000);
  }

  /**
   * Find process element in the DOM
   */
  findProcessElement(proceso) {
    const elements = this.processListElement.querySelectorAll('li');
    for (const el of elements) {
      if (el.textContent.includes(`PID=${proceso.id}`) || 
          el.textContent.includes(proceso.nombre)) {
        return el;
      }
    }
    return null;
  }

  /**
   * Add animation callback
   */
  addAnimationCallback(eventType, callback) {
    if (!this.animationCallbacks.has(eventType)) {
      this.animationCallbacks.set(eventType, []);
    }
    this.animationCallbacks.get(eventType).push(callback);
  }

  /**
   * Remove animation callback
   */
  removeAnimationCallback(eventType, callback) {
    if (this.animationCallbacks.has(eventType)) {
      const callbacks = this.animationCallbacks.get(eventType);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  /**
   * Trigger animation callbacks
   */
  triggerAnimationCallbacks(eventType, data) {
    if (this.animationCallbacks.has(eventType)) {
      this.animationCallbacks.get(eventType).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Animation callback error:', error);
        }
      });
    }
  }

  /**
   * Clear all animations and reset state
   */
  clearAnimations() {
    this.animationQueue = [];
    this.isAnimating = false;
    
    // Remove any animation elements
    const animElements = document.querySelectorAll('.swap-animation-element, .memory-block-highlight');
    animElements.forEach(el => {
      if (el.parentNode) {
        el.parentNode.removeChild(el);
      }
    });
  }
}