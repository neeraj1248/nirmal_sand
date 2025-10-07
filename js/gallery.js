// Gallery page functionality
document.addEventListener('DOMContentLoaded', function() {
  // Gallery filtering
  setupGalleryFiltering();
  
  // Lightbox functionality
  setupLightbox();
  
  // Masonry layout
  setupMasonryLayout();
  
  // Lazy loading
  setupLazyLoading();
  
  // Image hover effects
  setupImageHoverEffects();
});

function setupGalleryFiltering() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      // Add active class to clicked button
      btn.classList.add('active');

      const filterValue = btn.dataset.filter;

      galleryItems.forEach((item, index) => {
        if (filterValue === 'all' || item.dataset.category === filterValue) {
          item.style.display = 'block';
          item.style.opacity = '0';
          item.style.transform = 'scale(0.8)';
          
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, index * 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.8)';
          
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

function setupLightbox() {
  // Global functions for lightbox
  window.openLightbox = function(imageSrc) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    
    if (lightbox && lightboxImage) {
      lightboxImage.src = imageSrc;
      lightbox.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      
      // Add fade-in animation
      setTimeout(() => {
        lightbox.style.opacity = '1';
      }, 10);
    }
  };

  window.closeLightbox = function() {
    const lightbox = document.getElementById('lightbox');
    
    if (lightbox) {
      lightbox.style.opacity = '0';
      document.body.style.overflow = 'auto';
      
      setTimeout(() => {
        lightbox.style.display = 'none';
      }, 300);
    }
  };

  // Close lightbox on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
    }
  });

  // Close lightbox on background click
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }
}

function setupMasonryLayout() {
  // Simple masonry-like layout
  const galleryGrid = document.querySelector('.gallery-grid');
  if (!galleryGrid) return;

  function arrangeMasonry() {
    const items = Array.from(galleryGrid.children);
    const columnCount = getComputedStyle(galleryGrid).gridTemplateColumns.split(' ').length;
    const columnHeights = new Array(columnCount).fill(0);
    
    items.forEach((item, index) => {
      const columnIndex = index % columnCount;
      const itemHeight = item.offsetHeight;
      
      item.style.gridRowStart = Math.floor(columnHeights[columnIndex]) + 1;
      columnHeights[columnIndex] += itemHeight / 10; // Approximate grid units
    });
  }

  // Arrange on load and resize
  window.addEventListener('load', arrangeMasonry);
  window.addEventListener('resize', debounce(arrangeMasonry, 250));
}

function setupLazyLoading() {
  const images = document.querySelectorAll('.gallery-item img');
  
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        
        // Add loading animation
        img.style.opacity = '0';
        img.style.transform = 'scale(1.1)';
        
        // Simulate loading delay
        setTimeout(() => {
          img.style.opacity = '1';
          img.style.transform = 'scale(1)';
          img.style.transition = 'all 0.5s ease';
        }, Math.random() * 500 + 200);
        
        imageObserver.unobserve(img);
      }
    });
  }, {
    rootMargin: '50px'
  });

  images.forEach(img => {
    imageObserver.observe(img);
  });
}

function setupImageHoverEffects() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  galleryItems.forEach(item => {
    const img = item.querySelector('img');
    const overlay = item.querySelector('.gallery-overlay');
    
    item.addEventListener('mouseenter', () => {
      if (img) {
        img.style.transform = 'scale(1.1)';
        img.style.filter = 'brightness(0.7)';
      }
      
      if (overlay) {
        overlay.style.opacity = '1';
        overlay.style.transform = 'translateY(0)';
      }
    });
    
    item.addEventListener('mouseleave', () => {
      if (img) {
        img.style.transform = 'scale(1)';
        img.style.filter = 'brightness(1)';
      }
      
      if (overlay) {
        overlay.style.opacity = '0';
        overlay.style.transform = 'translateY(20px)';
      }
    });
  });
}

// Gallery slideshow functionality
class GallerySlideshow {
  constructor() {
    this.currentIndex = 0;
    this.images = [];
    this.isOpen = false;
  }

  open(images, startIndex = 0) {
    this.images = images;
    this.currentIndex = startIndex;
    this.isOpen = true;
    this.createSlideshow();
  }

  createSlideshow() {
    const slideshow = document.createElement('div');
    slideshow.className = 'gallery-slideshow';
    slideshow.innerHTML = `
      <div class="slideshow-overlay">
        <div class="slideshow-container">
          <button class="slideshow-close">&times;</button>
          <button class="slideshow-prev">&#10094;</button>
          <button class="slideshow-next">&#10095;</button>
          <div class="slideshow-image-container">
            <img src="${this.images[this.currentIndex]}" alt="Gallery Image">
          </div>
          <div class="slideshow-counter">
            ${this.currentIndex + 1} / ${this.images.length}
          </div>
        </div>
      </div>
    `;

    // Add styles
    this.addSlideshowStyles(slideshow);
    
    document.body.appendChild(slideshow);
    document.body.style.overflow = 'hidden';

    // Event listeners
    this.setupSlideshowEvents(slideshow);
  }

  addSlideshowStyles(slideshow) {
    slideshow.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.95);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
    `;

    const container = slideshow.querySelector('.slideshow-container');
    container.style.cssText = `
      position: relative;
      width: 90%;
      height: 90%;
      display: flex;
      align-items: center;
      justify-content: center;
    `;

    const img = slideshow.querySelector('img');
    img.style.cssText = `
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    `;

    // Style buttons
    const buttons = slideshow.querySelectorAll('button');
    buttons.forEach(btn => {
      btn.style.cssText = `
        position: absolute;
        background: rgba(255, 255, 255, 0.2);
        border: none;
        color: white;
        font-size: 2rem;
        cursor: pointer;
        padding: 10px 15px;
        border-radius: 5px;
        transition: background 0.3s ease;
      `;
    });

    const closeBtn = slideshow.querySelector('.slideshow-close');
    closeBtn.style.cssText += 'top: 20px; right: 20px;';

    const prevBtn = slideshow.querySelector('.slideshow-prev');
    prevBtn.style.cssText += 'left: 20px; top: 50%; transform: translateY(-50%);';

    const nextBtn = slideshow.querySelector('.slideshow-next');
    nextBtn.style.cssText += 'right: 20px; top: 50%; transform: translateY(-50%);';

    const counter = slideshow.querySelector('.slideshow-counter');
    counter.style.cssText = `
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      color: white;
      background: rgba(0, 0, 0, 0.5);
      padding: 10px 20px;
      border-radius: 20px;
    `;
  }

  setupSlideshowEvents(slideshow) {
    const closeBtn = slideshow.querySelector('.slideshow-close');
    const prevBtn = slideshow.querySelector('.slideshow-prev');
    const nextBtn = slideshow.querySelector('.slideshow-next');
    const img = slideshow.querySelector('img');
    const counter = slideshow.querySelector('.slideshow-counter');

    closeBtn.addEventListener('click', () => this.close(slideshow));
    prevBtn.addEventListener('click', () => this.previousImage(img, counter));
    nextBtn.addEventListener('click', () => this.nextImage(img, counter));

    // Keyboard navigation
    const keyHandler = (e) => {
      switch(e.key) {
        case 'Escape':
          this.close(slideshow);
          break;
        case 'ArrowLeft':
          this.previousImage(img, counter);
          break;
        case 'ArrowRight':
          this.nextImage(img, counter);
          break;
      }
    };

    document.addEventListener('keydown', keyHandler);
    slideshow.keyHandler = keyHandler; // Store for cleanup

    // Close on background click
    slideshow.addEventListener('click', (e) => {
      if (e.target === slideshow) {
        this.close(slideshow);
      }
    });
  }

  previousImage(img, counter) {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.updateImage(img, counter);
  }

  nextImage(img, counter) {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.updateImage(img, counter);
  }

  updateImage(img, counter) {
    img.style.opacity = '0';
    
    setTimeout(() => {
      img.src = this.images[this.currentIndex];
      counter.textContent = `${this.currentIndex + 1} / ${this.images.length}`;
      img.style.opacity = '1';
    }, 150);
  }

  close(slideshow) {
    document.removeEventListener('keydown', slideshow.keyHandler);
    document.body.removeChild(slideshow);
    document.body.style.overflow = 'auto';
    this.isOpen = false;
  }
}

// Initialize gallery slideshow
const gallerySlideshow = new GallerySlideshow();

// Utility function for debouncing
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Image download functionality
function downloadImage(imageSrc, filename) {
  const link = document.createElement('a');
  link.href = imageSrc;
  link.download = filename || 'gallery-image.jpg';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Gallery statistics
function updateGalleryStats() {
  const totalImages = document.querySelectorAll('.gallery-item').length;
  const categories = new Set();
  
  document.querySelectorAll('.gallery-item').forEach(item => {
    categories.add(item.dataset.category);
  });

  console.log(`Gallery Statistics:
    Total Images: ${totalImages}
    Categories: ${categories.size}
    Categories List: ${Array.from(categories).join(', ')}`);
}

// Initialize gallery statistics
updateGalleryStats();
