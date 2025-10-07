// Advanced Animation Controller
class AnimationController {
  constructor() {
    this.observers = new Map();
    this.animatedElements = new Set();
    this.init();
  }

  init() {
    this.setupIntersectionObserver();
    this.setupScrollAnimations();
    this.setupHoverAnimations();
    this.setupCounterAnimations();
    this.setupTypewriterEffect();
    this.setupParticleSystem();
  }

  setupIntersectionObserver() {
    const options = {
      threshold: [0.1, 0.3, 0.5, 0.7, 0.9],
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
          this.triggerAnimation(entry.target);
          this.animatedElements.add(entry.target);
        }
      });
    }, options);

    // Observe all animation elements
    document.querySelectorAll('[data-animate]').forEach(el => {
      observer.observe(el);
    });

    this.observers.set('intersection', observer);
  }

  triggerAnimation(element) {
    const animationType = element.dataset.animate;
    const delay = element.dataset.delay || 0;
    const duration = element.dataset.duration || 600;

    setTimeout(() => {
      switch (animationType) {
        case 'fadeInUp':
          this.fadeInUp(element, duration);
          break;
        case 'fadeInLeft':
          this.fadeInLeft(element, duration);
          break;
        case 'fadeInRight':
          this.fadeInRight(element, duration);
          break;
        case 'scaleIn':
          this.scaleIn(element, duration);
          break;
        case 'rotateIn':
          this.rotateIn(element, duration);
          break;
        case 'slideInUp':
          this.slideInUp(element, duration);
          break;
        case 'bounceIn':
          this.bounceIn(element, duration);
          break;
        case 'flipIn':
          this.flipIn(element, duration);
          break;
        default:
          this.fadeInUp(element, duration);
      }
    }, delay);
  }

  fadeInUp(element, duration) {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = `all ${duration}ms ease`;
    
    requestAnimationFrame(() => {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    });
  }

  fadeInLeft(element, duration) {
    element.style.opacity = '0';
    element.style.transform = 'translateX(-30px)';
    element.style.transition = `all ${duration}ms ease`;
    
    requestAnimationFrame(() => {
      element.style.opacity = '1';
      element.style.transform = 'translateX(0)';
    });
  }

  fadeInRight(element, duration) {
    element.style.opacity = '0';
    element.style.transform = 'translateX(30px)';
    element.style.transition = `all ${duration}ms ease`;
    
    requestAnimationFrame(() => {
      element.style.opacity = '1';
      element.style.transform = 'translateX(0)';
    });
  }

  scaleIn(element, duration) {
    element.style.opacity = '0';
    element.style.transform = 'scale(0.8)';
    element.style.transition = `all ${duration}ms ease`;
    
    requestAnimationFrame(() => {
      element.style.opacity = '1';
      element.style.transform = 'scale(1)';
    });
  }

  rotateIn(element, duration) {
    element.style.opacity = '0';
    element.style.transform = 'rotate(-180deg)';
    element.style.transition = `all ${duration}ms ease`;
    
    requestAnimationFrame(() => {
      element.style.opacity = '1';
      element.style.transform = 'rotate(0deg)';
    });
  }

  slideInUp(element, duration) {
    element.style.transform = 'translateY(100%)';
    element.style.transition = `transform ${duration}ms ease`;
    
    requestAnimationFrame(() => {
      element.style.transform = 'translateY(0)';
    });
  }

  bounceIn(element, duration) {
    element.style.opacity = '0';
    element.style.transform = 'scale(0.3)';
    element.style.transition = `all ${duration}ms cubic-bezier(0.68, -0.55, 0.265, 1.55)`;
    
    requestAnimationFrame(() => {
      element.style.opacity = '1';
      element.style.transform = 'scale(1)';
    });
  }

  flipIn(element, duration) {
    element.style.opacity = '0';
    element.style.transform = 'perspective(400px) rotateY(90deg)';
    element.style.transition = `all ${duration}ms ease`;
    
    requestAnimationFrame(() => {
      element.style.opacity = '1';
      element.style.transform = 'perspective(400px) rotateY(0deg)';
    });
  }

  setupScrollAnimations() {
    let ticking = false;

    const updateScrollAnimations = () => {
      const scrollTop = window.pageYOffset;
      const windowHeight = window.innerHeight;

      // Parallax elements
      document.querySelectorAll('[data-parallax]').forEach(element => {
        const speed = parseFloat(element.dataset.parallax) || 0.5;
        const yPos = -(scrollTop * speed);
        element.style.transform = `translateY(${yPos}px)`;
      });

      // Progress bars
      document.querySelectorAll('.progress-bar').forEach(bar => {
        const rect = bar.getBoundingClientRect();
        if (rect.top < windowHeight && rect.bottom > 0) {
          const progress = bar.querySelector('.progress-fill');
          if (progress && !progress.classList.contains('animated')) {
            const width = progress.style.width;
            progress.style.width = '0%';
            progress.classList.add('animated');
            
            setTimeout(() => {
              progress.style.width = width;
            }, 100);
          }
        }
      });

      ticking = false;
    };

    const requestScrollUpdate = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollAnimations);
        ticking = true;
      }
    };

    window.addEventListener('scroll', requestScrollUpdate);
  }

  setupHoverAnimations() {
    // Magnetic effect for buttons
    document.querySelectorAll('.magnetic').forEach(element => {
      element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        element.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
      });

      element.addEventListener('mouseleave', () => {
        element.style.transform = 'translate(0px, 0px)';
      });
    });

    // Tilt effect for cards
    document.querySelectorAll('.tilt').forEach(element => {
      element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });

      element.addEventListener('mouseleave', () => {
        element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
      });
    });
  }

  setupCounterAnimations() {
    const animateCounter = (element) => {
      const target = parseInt(element.dataset.target);
      const duration = parseInt(element.dataset.duration) || 2000;
      const increment = target / (duration / 16);
      let current = 0;

      const updateCounter = () => {
        if (current < target) {
          current += increment;
          element.textContent = Math.floor(current);
          requestAnimationFrame(updateCounter);
        } else {
          element.textContent = target;
        }
      };

      updateCounter();
    };

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
          entry.target.classList.add('counted');
          animateCounter(entry.target);
        }
      });
    });

    document.querySelectorAll('.counter').forEach(counter => {
      counterObserver.observe(counter);
    });
  }

  setupTypewriterEffect() {
    document.querySelectorAll('.typewriter').forEach(element => {
      const text = element.textContent;
      const speed = parseInt(element.dataset.speed) || 50;
      
      element.textContent = '';
      element.style.borderRight = '2px solid var(--primary-color)';
      
      let i = 0;
      const typeWriter = () => {
        if (i < text.length) {
          element.textContent += text.charAt(i);
          i++;
          setTimeout(typeWriter, speed);
        } else {
          // Blinking cursor effect
          setInterval(() => {
            element.style.borderRight = element.style.borderRight === 'none' 
              ? '2px solid var(--primary-color)' 
              : 'none';
          }, 500);
        }
      };

      // Start typewriter when element is visible
      const typewriterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            typeWriter();
            typewriterObserver.unobserve(entry.target);
          }
        });
      });

      typewriterObserver.observe(element);
    });
  }

  setupParticleSystem() {
    const createParticle = (container) => {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      const size = Math.random() * 4 + 2;
      const left = Math.random() * 100;
      const animationDuration = Math.random() * 3 + 2;
      
      particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: var(--primary-color);
        border-radius: 50%;
        left: ${left}%;
        bottom: -10px;
        opacity: ${Math.random() * 0.5 + 0.5};
        animation: floatUp ${animationDuration}s linear infinite;
      `;
      
      container.appendChild(particle);
      
      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, animationDuration * 1000);
    };

    document.querySelectorAll('.particles').forEach(container => {
      setInterval(() => {
        createParticle(container);
      }, 300);
    });
  }

  // Stagger animation for multiple elements
  staggerAnimation(elements, animationType, delay = 100) {
    elements.forEach((element, index) => {
      setTimeout(() => {
        element.dataset.animate = animationType;
        this.triggerAnimation(element);
      }, index * delay);
    });
  }

  // Chain animations
  chainAnimations(element, animations) {
    let currentIndex = 0;
    
    const runNextAnimation = () => {
      if (currentIndex < animations.length) {
        const animation = animations[currentIndex];
        this[animation.type](element, animation.duration || 600);
        
        setTimeout(() => {
          currentIndex++;
          runNextAnimation();
        }, animation.duration || 600);
      }
    };
    
    runNextAnimation();
  }

  // Cleanup method
  destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
    this.animatedElements.clear();
  }
}

// Initialize animation controller when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.animationController = new AnimationController();
});

// CSS keyframes for animations
const animationStyles = `
  @keyframes floatUp {
    0% {
      transform: translateY(0) rotate(0deg);
      opacity: 1;
    }
    100% {
      transform: translateY(-100vh) rotate(360deg);
      opacity: 0;
    }
  }

  @keyframes shimmer {
    0% {
      background-position: -200px 0;
    }
    100% {
      background-position: calc(200px + 100%) 0;
    }
  }

  @keyframes wave {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  @keyframes glow {
    0%, 100% {
      box-shadow: 0 0 5px var(--primary-color);
    }
    50% {
      box-shadow: 0 0 20px var(--primary-color), 0 0 30px var(--primary-color);
    }
  }

  .shimmer {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200px 100%;
    animation: shimmer 1.5s infinite;
  }

  .wave {
    animation: wave 2s ease-in-out infinite;
  }

  .glow {
    animation: glow 2s ease-in-out infinite;
  }

  .magnetic {
    transition: transform 0.3s ease;
  }

  .tilt {
    transition: transform 0.3s ease;
  }
`;

// Inject animation styles
const styleSheet = document.createElement('style');
styleSheet.textContent = animationStyles;
document.head.appendChild(styleSheet);
