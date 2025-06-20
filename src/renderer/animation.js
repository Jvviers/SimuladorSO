// src/renderer/animations.js
export class AnimationManager {
  constructor(canvas, processListElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.processListElement = processListElement;
    this.animations = [];
  }

  // Animate state transitions
  animateStateChange(proceso, oldState, newState) {
    const animation = {
      type: 'state-change',
      proceso: proceso,
      oldState: oldState,
      newState: newState,
      startTime: Date.now(),
      duration: 500 // 500ms animation
    };
    
    this.animations.push(animation);
    this.highlightProcessInList(proceso, newState);
  }

  // Animate swap operations
  animateSwap(proceso, toSwap = true) {
    const animation = {
      type: 'swap',
      proceso: proceso,
      toSwap: toSwap,
      startTime: Date.now(),
      duration: 800
    };
    
    this.animations.push(animation);
  }

  // Highlight process in the UI list
  highlightProcessInList(proceso, state) {
    const listItems = this.processListElement.querySelectorAll('li');
    listItems.forEach(li => {
      if (li.textContent.includes(`PID=${proceso.id}`)) {
        li.classList.remove('estado-nuevo', 'estado-listo', 'estado-ejecutando', 'estado-terminado', 'estado-swapped');
        li.classList.add(`estado-${state.toLowerCase()}`);
        
        // Add pulse effect for state changes
        li.classList.add('pulse-animation');
        setTimeout(() => li.classList.remove('pulse-animation'), 500);
      }
    });
  }

  // Update animations each frame
  update() {
    const now = Date.now();
    this.animations = this.animations.filter(anim => {
      const elapsed = now - anim.startTime;
      const progress = Math.min(elapsed / anim.duration, 1);
      
      if (anim.type === 'swap') {
        this.renderSwapAnimation(anim, progress);
      }
      
      return progress < 1; // Keep animation if not finished
    });
  }

  renderSwapAnimation(animation, progress) {
    const { proceso, toSwap } = animation;
    
    // Create visual feedback for swap operations
    if (toSwap) {
      // Animate process moving to swap area
      const opacity = 1 - progress;
      this.ctx.save();
      this.ctx.globalAlpha = opacity;
      // Draw fading process block
      this.ctx.restore();
    } else {
      // Animate process returning from swap
      const opacity = progress;
      this.ctx.save();
      this.ctx.globalAlpha = opacity;
      // Draw appearing process block
      this.ctx.restore();
    }
  }
}

// Enhanced CSS for animations (add to your stylesheet)
export const animationStyles = `
.pulse-animation {
  animation: pulse 0.5s ease-in-out;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.estado-nuevo { border-left: 4px solid #9e9e9e; }
.estado-listo { border-left: 4px solid #2196f3; }
.estado-ejecutando { border-left: 4px solid #4caf50; }
.estado-terminado { border-left: 4px solid #f44336; }
.estado-swapped { border-left: 4px solid #ff9800; }

li {
  transition: all 0.3s ease;
  margin: 2px 0;
  padding: 8px;
  border-radius: 4px;
}
`;