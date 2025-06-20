export class AnimationManager {
  constructor(canvas, processListElement, swapListElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.processListElement = processListElement;
    this.swapListElement = swapListElement;
    this.animations = [];
    this.isRunning = false;
    
    // Start animation loop
    this.startAnimationLoop();
  }

  startAnimationLoop() {
    if (this.isRunning) return;
    this.isRunning = true;
    
    const animate = () => {
      if (this.isRunning) {
        this.update();
        requestAnimationFrame(animate);
      }
    };
    animate();
  }

  stopAnimationLoop() {
    this.isRunning = false;
  }

  // HU09: Enhanced state change animation
  animateStateChange(proceso, oldState, newState) {
    const animation = {
      type: 'state-change',
      proceso: proceso,
      oldState: oldState,
      newState: newState,
      startTime: Date.now(),
      duration: 600,
      phase: 'highlight'
    };
    
    this.animations.push(animation);
    this.updateProcessInList(proceso, newState);
    
    // Add special effects for critical transitions
    if (newState === 'Ejecutando') {
      this.addExecutionGlow(proceso);
    }
  }

  // HU08 & HU09: Enhanced swap animation
  animateSwap(proceso, toSwap = true) {
    const animation = {
      type: 'swap',
      proceso: proceso,
      toSwap: toSwap,
      startTime: Date.now(),
      duration: toSwap ? 1000 : 800,
      phase: 'moving'
    };
    
    this.animations.push(animation);
    
    // Update UI immediately for better UX
    if (toSwap) {
      this.showSwapTransition(proceso, 'out');
    } else {
      this.showSwapTransition(proceso, 'in');
    }
  }

  // HU09: Visual feedback for process transitions
  updateProcessInList(proceso, state) {
    const listItems = this.processListElement.querySelectorAll('li');
    listItems.forEach(li => {
      if (li.textContent.includes(`PID=${proceso.id}`)) {
        // Remove all state classes
        li.classList.remove('estado-nuevo', 'estado-listo', 'estado-ejecutando', 
                           'estado-terminado', 'estado-swapped');
        
        // Add new state class
        li.classList.add(`estado-${state.toLowerCase()}`);
        
        // Add transition effect
        li.classList.add('state-transition');
        setTimeout(() => li.classList.remove('state-transition'), 600);
        
        // Update text content with current state
        this.updateProcessText(li, proceso, state);
      }
    });
  }

  updateProcessText(li, proceso, state) {
    li.textContent = `${proceso.nombre} (PID=${proceso.id}): estado=${state}, ` +
                    `llegada=${proceso.llegada}ms, burst=${proceso.burst}ms, ` +
                    `restante=${proceso.restante}ms, mem=${proceso.memoria}KB`;
  }

  // HU09: Special glow effect for executing processes
  addExecutionGlow(proceso) {
    const glowAnimation = {
      type: 'execution-glow',
      proceso: proceso,
      startTime: Date.now(),
      duration: 2000,
      intensity: 0
    };
    this.animations.push(glowAnimation);
  }

  // HU08 & HU09: Swap transition visual effects
  showSwapTransition(proceso, direction) {
    const swapItems = this.swapListElement.querySelectorAll('li');
    const processItems = this.processListElement.querySelectorAll('li');
    
    if (direction === 'out') {
      // Find process in main list and add fade-out effect
      processItems.forEach(li => {
        if (li.textContent.includes(`PID=${proceso.id}`)) {
          li.classList.add('swapping-out');
          setTimeout(() => li.classList.remove('swapping-out'), 1000);
        }
      });
    } else {
      // Find process in swap list and add fade-in effect to main list
      swapItems.forEach(li => {
        if (li.textContent.includes(`PID=${proceso.id}`)) {
          li.classList.add('recovering-from-swap');
          setTimeout(() => li.classList.remove('recovering-from-swap'), 800);
        }
      });
    }
  }

  // Animation update loop
  update() {
    const now = Date.now();
    this.animations = this.animations.filter(anim => {
      const elapsed = now - anim.startTime;
      const progress = Math.min(elapsed / anim.duration, 1);
      
      switch (anim.type) {
        case 'swap':
          this.renderSwapAnimation(anim, progress);
          break;
        case 'state-change':
          this.renderStateChangeAnimation(anim, progress);
          break;
        case 'execution-glow':
          this.renderExecutionGlow(anim, progress);
          break;
      }
      
      return progress < 1;
    });
  }

  renderSwapAnimation(animation, progress) {
    // Visual feedback is handled by CSS classes
    // This could be extended for canvas-based animations
  }

  renderStateChangeAnimation(animation, progress) {
    // Enhanced state change effects handled by CSS
  }

  renderExecutionGlow(animation, progress) {
    // Pulsing effect for executing processes
    const intensity = Math.sin(progress * Math.PI * 4) * 0.5 + 0.5;
    // Apply glow effect via CSS classes
  }
}   