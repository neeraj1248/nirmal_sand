// Project Details page functionality
document.addEventListener('DOMContentLoaded', function() {
  // Get project ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get('id');

  // Load project details
  loadProjectDetails(projectId);

  // Image gallery functionality
  setupImageGallery();

  // More projects carousel
  setupMoreProjectsCarousel();

  // Initialize map
  initializeMap();
});

function loadProjectDetails(projectId) {
  // In a real application, this would fetch from an API
  const projectData = {
    1: {
      title: 'Corporate Tower Complex',
      category: 'Commercial',
      location: 'Bandra Kurla Complex, Mumbai',
      completionDate: 'December 2023',
      client: 'Mumbai Development Corporation',
      description: 'The Corporate Tower Complex stands as a testament to modern architectural excellence and sustainable construction practices. This 40-story commercial building features state-of-the-art facilities, energy-efficient systems, and premium amenities designed to meet the needs of today\'s businesses.',
      features: [
        '40 floors of premium office space',
        'LEED Gold certified green building',
        'Advanced HVAC and lighting systems',
        'High-speed elevators and modern infrastructure',
        'Rooftop garden and recreational facilities',
        '24/7 security and building management'
      ],
      specifications: {
        'Total Area': '2.5 Million sq ft',
        'Construction Period': '36 months',
        'Investment': '₹500 Crores',
        'Parking Capacity': '1200 vehicles'
      },
      images: [
        'assets/project-detail-main.jpg',
        'assets/project-detail-1.jpg',
        'assets/project-detail-2.jpg',
        'assets/project-detail-3.jpg',
        'assets/project-detail-4.jpg'
      ],
      coordinates: [19.0633, 72.8681]
    }
    // Add more project data as needed
  };

  const project = projectData[projectId];
  if (project) {
    updateProjectDetails(project);
  }
}

function updateProjectDetails(project) {
  // Update page title and meta information
  document.title = `${project.title} - Nirmal Sand and Infra`;
  
  // Update project header
  const titleElement = document.querySelector('.project-title');
  if (titleElement) {
    titleElement.textContent = project.title;
  }

  // Update tags
  const tagsContainer = document.querySelector('.project-tags');
  if (tagsContainer) {
    tagsContainer.innerHTML = `
      <span class="tag">${project.category}</span>
      <span class="tag">${project.location}</span>
      <span class="tag">Completed ${project.completionDate.split(' ')[1]}</span>
    `;
  }

  // Update description
  const descriptionElement = document.querySelector('.project-description p');
  if (descriptionElement) {
    descriptionElement.textContent = project.description;
  }

  // Update features list
  const featuresList = document.querySelector('.feature-list');
  if (featuresList && project.features) {
    featuresList.innerHTML = project.features.map(feature => 
      `<li>${feature}</li>`
    ).join('');
  }

  // Update specifications
  const specsGrid = document.querySelector('.specs-grid');
  if (specsGrid && project.specifications) {
    specsGrid.innerHTML = Object.entries(project.specifications).map(([key, value]) =>
      `<div class="spec-item">
        <strong>${key}:</strong>
        <span>${value}</span>
      </div>`
    ).join('');
  }

  // Update project info card
  updateProjectInfoCard(project);

  // Update gallery images
  if (project.images) {
    updateGalleryImages(project.images);
  }
}

function updateProjectInfoCard(project) {
  const infoItems = document.querySelectorAll('.info-item');
  
  const infoData = [
    { icon: 'fas fa-calendar', label: 'Completion Date', value: project.completionDate },
    { icon: 'fas fa-map-marker-alt', label: 'Location', value: project.location },
    { icon: 'fas fa-building', label: 'Type', value: project.category },
    { icon: 'fas fa-user-tie', label: 'Client', value: project.client }
  ];

  infoItems.forEach((item, index) => {
    if (infoData[index]) {
      const iconElement = item.querySelector('i');
      const labelElement = item.querySelector('strong');
      const valueElement = item.querySelector('span');

      if (iconElement) iconElement.className = infoData[index].icon;
      if (labelElement) labelElement.textContent = infoData[index].label;
      if (valueElement) valueElement.textContent = infoData[index].value;
    }
  });
}

function updateGalleryImages(images) {
  const mainImage = document.getElementById('mainImage');
  const thumbnailGallery = document.querySelector('.thumbnail-gallery');

  if (mainImage && images.length > 0) {
    mainImage.src = images[0];
  }

  if (thumbnailGallery) {
    thumbnailGallery.innerHTML = images.map((image, index) =>
      `<img src="${image}" alt="Project Image ${index + 1}" 
            class="thumbnail ${index === 0 ? 'active' : ''}" 
            onclick="changeMainImage(this)">`
    ).join('');
  }
}

function setupImageGallery() {
  // Thumbnail click handler is defined globally
  window.changeMainImage = function(thumbnail) {
    const mainImage = document.getElementById('mainImage');
    const thumbnails = document.querySelectorAll('.thumbnail');

    if (mainImage) {
      mainImage.src = thumbnail.src;
    }

    thumbnails.forEach(thumb => thumb.classList.remove('active'));
    thumbnail.classList.add('active');
  };

  // Add lightbox functionality
  const mainImage = document.getElementById('mainImage');
  if (mainImage) {
    mainImage.addEventListener('click', () => {
      openImageLightbox(mainImage.src);
    });
  }
}

function openImageLightbox(imageSrc) {
  const lightbox = document.createElement('div');
  lightbox.className = 'image-lightbox';
  lightbox.innerHTML = `
    <div class="lightbox-overlay">
      <div class="lightbox-content">
        <img src="${imageSrc}" alt="Project Image">
        <button class="lightbox-close">&times;</button>
      </div>
    </div>
  `;

  // Add styles
  lightbox.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
  `;

  const content = lightbox.querySelector('.lightbox-content');
  content.style.cssText = `
    position: relative;
    max-width: 90%;
    max-height: 90%;
  `;

  const img = lightbox.querySelector('img');
  img.style.cssText = `
    width: 100%;
    height: 100%;
    object-fit: contain;
  `;

  const closeBtn = lightbox.querySelector('.lightbox-close');
  closeBtn.style.cssText = `
    position: absolute;
    top: -40px;
    right: 0;
    background: none;
    border: none;
    color: white;
    font-size: 2rem;
    cursor: pointer;
  `;

  document.body.appendChild(lightbox);

  // Close handlers
  closeBtn.addEventListener('click', () => {
    document.body.removeChild(lightbox);
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      document.body.removeChild(lightbox);
    }
  });

  // ESC key handler
  const escHandler = (e) => {
    if (e.key === 'Escape') {
      document.body.removeChild(lightbox);
      document.removeEventListener('keydown', escHandler);
    }
  };
  document.addEventListener('keydown', escHandler);
}

function setupMoreProjectsCarousel() {
  const container = document.querySelector('.more-projects-container');
  const prevBtn = document.querySelector('.more-projects .prev-btn');
  const nextBtn = document.querySelector('.more-projects .next-btn');

  if (!container || !prevBtn || !nextBtn) return;

  let scrollAmount = 0;
  const scrollStep = 320; // Width of project card + margin

  prevBtn.addEventListener('click', () => {
    scrollAmount = Math.max(scrollAmount - scrollStep, 0);
    container.style.transform = `translateX(-${scrollAmount}px)`;
  });

  nextBtn.addEventListener('click', () => {
    const maxScroll = container.scrollWidth - container.parentElement.clientWidth;
    scrollAmount = Math.min(scrollAmount + scrollStep, maxScroll);
    container.style.transform = `translateX(-${scrollAmount}px)`;
  });

  // Auto-scroll functionality
  let autoScrollInterval;

  const startAutoScroll = () => {
    autoScrollInterval = setInterval(() => {
      const maxScroll = container.scrollWidth - container.parentElement.clientWidth;
      if (scrollAmount >= maxScroll) {
        scrollAmount = 0;
      } else {
        scrollAmount += scrollStep;
      }
      container.style.transform = `translateX(-${scrollAmount}px)`;
    }, 3000);
  };

  const stopAutoScroll = () => {
    clearInterval(autoScrollInterval);
  };

  // Start auto-scroll
  startAutoScroll();

  // Pause on hover
  container.parentElement.addEventListener('mouseenter', stopAutoScroll);
  container.parentElement.addEventListener('mouseleave', startAutoScroll);
}

function initializeMap() {
  // This would typically use Google Maps API or similar
  // For demo purposes, we'll just add some interactive features to the iframe
  const mapContainer = document.querySelector('.map-container');
  if (mapContainer) {
    const iframe = mapContainer.querySelector('iframe');
    if (iframe) {
      // Add loading indicator
      const loadingIndicator = document.createElement('div');
      loadingIndicator.className = 'map-loading';
      loadingIndicator.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading Map...';
      loadingIndicator.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 20px;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      `;

      mapContainer.style.position = 'relative';
      mapContainer.appendChild(loadingIndicator);

      iframe.addEventListener('load', () => {
        setTimeout(() => {
          if (loadingIndicator.parentNode) {
            loadingIndicator.parentNode.removeChild(loadingIndicator);
          }
        }, 1000);
      });
    }
  }
}

// Project comparison functionality
class ProjectComparison {
  constructor() {
    this.comparedProjects = [];
    this.maxComparisons = 3;
  }

  addToComparison(projectId) {
    if (this.comparedProjects.length < this.maxComparisons && 
        !this.comparedProjects.includes(projectId)) {
      this.comparedProjects.push(projectId);
      this.updateComparisonUI();
    }
  }

  removeFromComparison(projectId) {
    this.comparedProjects = this.comparedProjects.filter(id => id !== projectId);
    this.updateComparisonUI();
  }

  updateComparisonUI() {
    const compareBtn = document.querySelector('.compare-projects-btn');
    if (compareBtn) {
      if (this.comparedProjects.length > 1) {
        compareBtn.style.display = 'block';
        compareBtn.textContent = `Compare Projects (${this.comparedProjects.length})`;
      } else {
        compareBtn.style.display = 'none';
      }
    }
  }

  showComparison() {
    // Implementation for showing project comparison modal
    console.log('Comparing projects:', this.comparedProjects);
  }
}

// Initialize project comparison
const projectComparison = new ProjectComparison();

// Social sharing functionality
function shareProject(platform) {
  const url = window.location.href;
  const title = document.querySelector('.project-title').textContent;
  const description = document.querySelector('.project-description p').textContent.substring(0, 100) + '...';

  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(title + ' - ' + url)}`
  };

  if (shareUrls[platform]) {
    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  }
}

// Print project details
function printProject() {
  window.print();
}

// Download project brochure (placeholder)
function downloadBrochure() {
  // In a real application, this would download a PDF brochure
  alert('Project brochure download would start here.');
}
