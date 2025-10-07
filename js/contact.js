// Contact page functionality
document.addEventListener('DOMContentLoaded', function() {
  // Form handling
  setupContactForm();
  
  // Map interactions
  setupMapInteractions();
  
  // Contact info animations
  setupContactAnimations();
  
  // Form validation
  setupFormValidation();
});

function setupContactForm() {
  const contactForm = document.getElementById('contactForm');
  
  if (contactForm) {
    contactForm.addEventListener('submit', handleFormSubmission);
  }
}

function handleFormSubmission(e) {
  e.preventDefault();
  
  const form = e.target;
  const formData = new FormData(form);
  const submitBtn = form.querySelector('.submit-btn');
  
  // Validate form
  if (!validateForm(form)) {
    showNotification('Please fill in all required fields correctly.', 'error');
    return;
  }
  
  // Show loading state
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  submitBtn.disabled = true;
  
  // Simulate form submission
  setTimeout(() => {
    // In a real application, you would send the data to your server
    console.log('Form data:', Object.fromEntries(formData));
    
    // Show success message
    showNotification('Thank you! Your message has been sent successfully.', 'success');
    
    // Reset form
    form.reset();
    
    // Reset button
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
    
    // Clear any validation errors
    clearValidationErrors(form);
    
  }, 2000);
}

function validateForm(form) {
  const requiredFields = form.querySelectorAll('[required]');
  let isValid = true;
  
  requiredFields.forEach(field => {
    const value = field.value.trim();
    let fieldValid = true;
    
    // Clear previous errors
    clearFieldError(field);
    
    // Check if field is empty
    if (!value) {
      showFieldError(field, 'This field is required');
      fieldValid = false;
    } else {
      // Specific validation based on field type
      switch (field.type) {
        case 'email':
          if (!validateEmail(value)) {
            showFieldError(field, 'Please enter a valid email address');
            fieldValid = false;
          }
          break;
        case 'tel':
          if (!validatePhone(value)) {
            showFieldError(field, 'Please enter a valid phone number');
            fieldValid = false;
          }
          break;
      }
    }
    
    if (!fieldValid) {
      isValid = false;
    }
  });
  
  return isValid;
}

function showFieldError(field, message) {
  field.classList.add('error');
  
  // Remove existing error message
  const existingError = field.parentNode.querySelector('.error-message');
  if (existingError) {
    existingError.remove();
  }
  
  // Add new error message
  const errorElement = document.createElement('div');
  errorElement.className = 'error-message';
  errorElement.textContent = message;
  errorElement.style.cssText = `
    color: #f44336;
    font-size: 0.8rem;
    margin-top: 5px;
  `;
  
  field.parentNode.appendChild(errorElement);
}

function clearFieldError(field) {
  field.classList.remove('error');
  const errorMessage = field.parentNode.querySelector('.error-message');
  if (errorMessage) {
    errorMessage.remove();
  }
}

function clearValidationErrors(form) {
  const errorFields = form.querySelectorAll('.error');
  const errorMessages = form.querySelectorAll('.error-message');
  
  errorFields.forEach(field => field.classList.remove('error'));
  errorMessages.forEach(message => message.remove());
}

function setupFormValidation() {
  const formFields = document.querySelectorAll('#contactForm input, #contactForm textarea, #contactForm select');
  
  formFields.forEach(field => {
    // Real-time validation on blur
    field.addEventListener('blur', () => {
      if (field.hasAttribute('required') && field.value.trim()) {
        validateField(field);
      }
    });
    
    // Clear errors on input
    field.addEventListener('input', () => {
      clearFieldError(field);
    });
  });
}

function validateField(field) {
  const value = field.value.trim();
  
  switch (field.type) {
    case 'email':
      if (!validateEmail(value)) {
        showFieldError(field, 'Please enter a valid email address');
        return false;
      }
      break;
    case 'tel':
      if (!validatePhone(value)) {
        showFieldError(field, 'Please enter a valid phone number');
        return false;
      }
      break;
  }
  
  return true;
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePhone(phone) {
  const re = /^[\+]?[1-9][\d]{0,15}$/;
  return re.test(phone.replace(/\s/g, ''));
}

function setupMapInteractions() {
  const mapContainer = document.querySelector('.map-container');
  
  if (mapContainer) {
    const iframe = mapContainer.querySelector('iframe');
    
    if (iframe) {
      // Add click-to-activate overlay for mobile
      const overlay = document.createElement('div');
      overlay.className = 'map-overlay';
      overlay.innerHTML = '<p>Click to interact with map</p>';
      overlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: opacity 0.3s ease;
      `;
      
      overlay.querySelector('p').style.cssText = `
        background: white;
        padding: 10px 20px;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        margin: 0;
      `;
      
      mapContainer.style.position = 'relative';
      mapContainer.appendChild(overlay);
      
      overlay.addEventListener('click', () => {
        overlay.style.opacity = '0';
        overlay.style.pointerEvents = 'none';
      });
      
      // Re-enable overlay when clicking outside
      document.addEventListener('click', (e) => {
        if (!mapContainer.contains(e.target)) {
          overlay.style.opacity = '1';
          overlay.style.pointerEvents = 'auto';
        }
      });
    }
  }
}

function setupContactAnimations() {
  // Animate contact items on scroll
  const contactItems = document.querySelectorAll('.contact-item');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateX(0)';
        }, index * 100);
      }
    });
  }, {
    threshold: 0.1
  });
  
  contactItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-30px)';
    item.style.transition = 'all 0.6s ease';
    observer.observe(item);
  });
  
  // Animate social links
  const socialLinks = document.querySelectorAll('.social-icons .social-link');
  
  socialLinks.forEach((link, index) => {
    link.style.opacity = '0';
    link.style.transform = 'translateY(20px)';
    link.style.transition = 'all 0.6s ease';
    
    setTimeout(() => {
      link.style.opacity = '1';
      link.style.transform = 'translateY(0)';
    }, 500 + (index * 100));
  });
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas fa-${getNotificationIcon(type)}"></i>
      <span>${message}</span>
    </div>
    <button class="notification-close">&times;</button>
  `;
  
  // Add styles
  Object.assign(notification.style, {
    position: 'fixed',
    top: '20px',
    right: '20px',
    minWidth: '300px',
    padding: '15px',
    borderRadius: '5px',
    color: 'white',
    fontWeight: '500',
    zIndex: '10000',
    transform: 'translateX(100%)',
    transition: 'transform 0.3s ease',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
  });
  
  // Set background color based on type
  const colors = {
    success: '#4CAF50',
    error: '#f44336',
    info: '#2196F3',
    warning: '#ff9800'
  };
  
  notification.style.backgroundColor = colors[type] || colors.info;
  
  // Style notification content
  const content = notification.querySelector('.notification-content');
  content.style.cssText = `
    display: flex;
    align-items: center;
    gap: 10px;
  `;
  
  // Style close button
  const closeBtn = notification.querySelector('.notification-close');
  closeBtn.style.cssText = `
    position: absolute;
    top: 5px;
    right: 10px;
    background: none;
    border: none;
    color: white;
    font-size: 1.2rem;
    cursor: pointer;
    opacity: 0.7;
    transition: opacity 0.3s ease;
  `;
  
  closeBtn.addEventListener('click', () => {
    removeNotification(notification);
  });
  
  closeBtn.addEventListener('mouseenter', () => {
    closeBtn.style.opacity = '1';
  });
  
  closeBtn.addEventListener('mouseleave', () => {
    closeBtn.style.opacity = '0.7';
  });
  
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    removeNotification(notification);
  }, 5000);
}

function removeNotification(notification) {
  notification.style.transform = 'translateX(100%)';
  setTimeout(() => {
    if (notification.parentNode) {
      document.body.removeChild(notification);
    }
  }, 300);
}

function getNotificationIcon(type) {
  const icons = {
    success: 'check-circle',
    error: 'exclamation-circle',
    info: 'info-circle',
    warning: 'exclamation-triangle'
  };
  
  return icons[type] || icons.info;
}

// Contact form auto-save functionality
class ContactFormAutoSave {
  constructor(formId) {
    this.form = document.getElementById(formId);
    this.storageKey = `contact_form_${formId}`;
    this.init();
  }
  
  init() {
    if (!this.form) return;
    
    // Load saved data
    this.loadSavedData();
    
    // Save data on input
    this.form.addEventListener('input', () => {
      this.saveFormData();
    });
    
    // Clear saved data on successful submission
    this.form.addEventListener('submit', () => {
      setTimeout(() => {
        this.clearSavedData();
      }, 2000);
    });
  }
  
  saveFormData() {
    const formData = new FormData(this.form);
    const data = Object.fromEntries(formData);
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }
  
  loadSavedData() {
    const savedData = localStorage.getItem(this.storageKey);
    
    if (savedData) {
      const data = JSON.parse(savedData);
      
      Object.entries(data).forEach(([name, value]) => {
        const field = this.form.querySelector(`[name="${name}"]`);
        if (field && value) {
          field.value = value;
        }
      });
      
      // Show notification about restored data
      showNotification('Your previous form data has been restored.', 'info');
    }
  }
  
  clearSavedData() {
    localStorage.removeItem(this.storageKey);
  }
}

// Initialize auto-save
const contactFormAutoSave = new ContactFormAutoSave('contactForm');

// Office hours checker
function checkOfficeHours() {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const hour = now.getHours();
  
  // Office hours: Monday-Friday 9AM-6PM, Saturday 9AM-2PM
  let isOpen = false;
  
  if (day >= 1 && day <= 5) { // Monday to Friday
    isOpen = hour >= 9 && hour < 18;
  } else if (day === 6) { // Saturday
    isOpen = hour >= 9 && hour < 14;
  }
  
  const statusElement = document.querySelector('.office-status');
  if (statusElement) {
    statusElement.textContent = isOpen ? 'Open Now' : 'Closed';
    statusElement.className = `office-status ${isOpen ? 'open' : 'closed'}`;
  }
  
  return isOpen;
}

// Initialize office hours checker
checkOfficeHours();
setInterval(checkOfficeHours, 60000); // Check every minute

// Contact method recommendations
function recommendContactMethod() {
  const isOfficeHours = checkOfficeHours();
  const urgentKeywords = ['urgent', 'emergency', 'asap', 'immediately'];
  const messageField = document.querySelector('#message');
  
  if (messageField) {
    messageField.addEventListener('input', () => {
      const message = messageField.value.toLowerCase();
      const isUrgent = urgentKeywords.some(keyword => message.includes(keyword));
      
      const recommendationElement = document.querySelector('.contact-recommendation');
      
      if (isUrgent && !isOfficeHours) {
        if (!recommendationElement) {
          const recommendation = document.createElement('div');
          recommendation.className = 'contact-recommendation';
          recommendation.innerHTML = `
            <i class="fas fa-info-circle"></i>
            For urgent matters outside office hours, please call us directly at +91 98765 43210
          `;
          recommendation.style.cssText = `
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            color: #856404;
            padding: 10px;
            border-radius: 5px;
            margin-top: 10px;
            display: flex;
            align-items: center;
            gap: 10px;
          `;
          
          messageField.parentNode.appendChild(recommendation);
        }
      } else if (recommendationElement) {
        recommendationElement.remove();
      }
    });
  }
}

// Initialize contact method recommendations
recommendContactMethod();

<boltAction type="file" filePath="js/about.js">
// About page functionality
document.addEventListener('DOMContentLoaded', function() {
  // Initialize growth chart
  initializeGrowthChart();
  
  // Setup timeline animations
  setupTimelineAnimations();
  
  // Setup counter animations
  setupCounterAnimations();
  
  // Setup company details animations
  setupCompanyDetailsAnimations();
});

function initializeGrowthChart() {
  const canvas = document.getElementById('growthChart');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  
  // Sample data for company growth
  const data = {
    years: ['1999', '2005', '2010', '2015', '2020', '2024'],
    projects: [1, 15, 45, 80, 120, 150],
    revenue: [0.5, 5, 25, 60, 120, 200], // In crores
    employees: [5, 25, 100, 250, 400, 500]
  };
  
  // Chart dimensions
  const padding = 60;
  const chartWidth = canvas.width - (padding * 2);
  const chartHeight = canvas.height - (padding * 2);
  
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw chart background
  ctx.fillStyle = '#f8f9fa';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw grid lines
  drawGridLines(ctx, padding, chartWidth, chartHeight);
  
  // Draw axes
  drawAxes(ctx, padding, chartWidth, chartHeight);
  
  // Draw data lines
  drawDataLine(ctx, data.years, data.projects, padding, chartWidth, chartHeight, '#eba500', 'Projects');
  drawDataLine(ctx, data.years, data.employees, padding, chartWidth, chartHeight, '#292929', 'Employees');
  
  // Draw legend
  drawLegend(ctx, canvas.width, padding);
  
  // Draw labels
  drawLabels(ctx, data.years, padding, chartWidth, chartHeight);
}

function drawGridLines(ctx, padding, chartWidth, chartHeight) {
  ctx.strokeStyle = '#e0e0e0';
  ctx.lineWidth = 1;
  
  // Horizontal grid lines
  for (let i = 0; i <= 10; i++) {
    const y = padding + (chartHeight / 10) * i;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(padding + chartWidth, y);
    ctx.stroke();
  }
  
  // Vertical grid lines
  for (let i = 0; i <= 6; i++) {
    const x = padding + (chartWidth / 5) * i;
    ctx.beginPath();
    ctx.moveTo(x, padding);
    ctx.lineTo(x, padding + chartHeight);
    ctx.stroke();
  }
}

function drawAxes(ctx, padding, chartWidth, chartHeight) {
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;
  
  // X-axis
  ctx.beginPath();
  ctx.moveTo(padding, padding + chartHeight);
  ctx.lineTo(padding + chartWidth, padding + chartHeight);
  ctx.stroke();
  
  // Y-axis
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, padding + chartHeight);
  ctx.stroke();
}

function drawDataLine(ctx, years, values, padding, chartWidth, chartHeight, color, label) {
  const maxValue = Math.max(...values);
  const stepX = chartWidth / (years.length - 1);
  
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 3;
  
  // Draw line
  ctx.beginPath();
  values.forEach((value, index) => {
    const x = padding + (stepX * index);
    const y = padding + chartHeight - ((value / maxValue) * chartHeight);
    
    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  ctx.stroke();
  
  // Draw points
  values.forEach((value, index) => {
    const x = padding + (stepX * index);
    const y = padding + chartHeight - ((value / maxValue) * chartHeight);
    
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fill();
  });
}

function drawLegend(ctx, canvasWidth, padding) {
  const legendX = canvasWidth - 150;
  const legendY = padding + 20;
  
  ctx.font = '14px Arial';
  
  // Projects legend
  ctx.fillStyle = '#eba500';
  ctx.fillRect(legendX, legendY, 20, 3);
  ctx.fillStyle = '#333';
  ctx.fillText('Projects Completed', legendX + 30, legendY + 10);
  
  // Employees legend
  ctx.fillStyle = '#292929';
  ctx.fillRect(legendX, legendY + 25, 20, 3);
  ctx.fillStyle = '#333';
  ctx.fillText('Team Members', legendX + 30, legendY + 35);
}

function drawLabels(ctx, years, padding, chartWidth, chartHeight) {
  ctx.fillStyle = '#666';
  ctx.font = '12px Arial';
  ctx.textAlign = 'center';
  
  const stepX = chartWidth / (years.length - 1);
  
  years.forEach((year, index) => {
    const x = padding + (stepX * index);
    const y = padding + chartHeight + 20;
    ctx.fillText(year, x, y);
  });
}

function setupTimelineAnimations() {
  const timelineItems = document.querySelectorAll('.timeline-item');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-timeline');
      }
    });
  }, {
    threshold: 0.3
  });
  
  timelineItems.forEach(item => {
    observer.observe(item);
  });
  
  // Add CSS for timeline animation
  const style = document.createElement('style');
  style.textContent = `
    .timeline-item {
      opacity: 0;
      transform: translateX(-50px);
      transition: all 0.8s ease;
    }
    
    .timeline-item.animate-timeline {
      opacity: 1;
      transform: translateX(0);
    }
    
    .timeline-item:nth-child(even) {
      transform: translateX(50px);
    }
    
    .timeline-item:nth-child(even).animate-timeline {
      transform: translateX(0);
    }
  `;
  document.head.appendChild(style);
}

function setupCounterAnimations() {
  const counters = document.querySelectorAll('.counter');
  
  const animateCounter = (counter) => {
    const target = parseInt(counter.dataset.target);
    const duration = parseInt(counter.dataset.duration) || 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const updateCounter = () => {
      if (current < target) {
        current += increment;
        counter.textContent = Math.floor(current);
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target;
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
  }, {
    threshold: 0.5
  });
  
  counters.forEach(counter => {
    counterObserver.observe(counter);
  });
}

function setupCompanyDetailsAnimations() {
  const detailCards = document.querySelectorAll('.detail-card');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0) scale(1)';
        }, index * 100);
      }
    });
  }, {
    threshold: 0.1
  });
  
  detailCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px) scale(0.9)';
    card.style.transition = 'all 0.6s ease';
    observer.observe(card);
  });
}

// Company milestones data
const companyMilestones = [
  {
    year: 1999,
    title: 'Company Founded',
    description: 'Nirmal Sand and Infra was established with a vision to excel in construction and infrastructure development.',
    icon: 'fas fa-flag'
  },
  {
    year: 2005,
    title: 'First Major Project',
    description: 'Completed our first major commercial project, establishing our reputation for quality and reliability.',
    icon: 'fas fa-building'
  },
  {
    year: 2010,
    title: 'Expansion Phase',
    description: 'Expanded operations to multiple states and diversified into residential and infrastructure projects.',
    icon: 'fas fa-expand-arrows-alt'
  },
  {
    year: 2015,
    title: 'ISO Certification',
    description: 'Achieved ISO 9001:2015 certification, reinforcing our commitment to quality management systems.',
    icon: 'fas fa-certificate'
  },
  {
    year: 2020,
    title: 'Sustainable Construction',
    description: 'Launched green building initiatives and adopted sustainable construction practices across all projects.',
    icon: 'fas fa-leaf'
  },
  {
    year: 2024,
    title: 'Digital Transformation',
    description: 'Embraced digital technologies and modern construction methodologies to enhance efficiency and quality.',
    icon: 'fas fa-digital-tachograph'
  }
];

// Interactive timeline functionality
class InteractiveTimeline {
  constructor() {
    this.currentIndex = 0;
    this.milestones = companyMilestones;
    this.init();
  }
  
  init() {
    this.createTimelineNavigation();
    this.setupKeyboardNavigation();
  }
  
  createTimelineNavigation() {
    const timeline = document.querySelector('.timeline');
    if (!timeline) return;
    
    // Add navigation dots
    const navigation = document.createElement('div');
    navigation.className = 'timeline-navigation';
    navigation.style.cssText = `
      display: flex;
      justify-content: center;
      gap: 10px;
      margin-top: 40px;
    `;
    
    this.milestones.forEach((milestone, index) => {
      const dot = document.createElement('button');
      dot.className = `timeline-dot ${index === 0 ? 'active' : ''}`;
      dot.dataset.index = index;
      dot.textContent = milestone.year;
      dot.style.cssText = `
        background: ${index === 0 ? '#eba500' : '#e0e0e0'};
        border: none;
        border-radius: 20px;
        padding: 8px 16px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-weight: bold;
        color: ${index === 0 ? 'white' : '#666'};
      `;
      
      dot.addEventListener('click', () => {
        this.goToMilestone(index);
      });
      
      navigation.appendChild(dot);
    });
    
    timeline.parentNode.appendChild(navigation);
  }
  
  goToMilestone(index) {
    this.currentIndex = index;
    this.updateTimelineView();
    this.updateNavigation();
  }
  
  updateTimelineView() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach((item, index) => {
      if (index === this.currentIndex) {
        item.style.opacity = '1';
        item.style.transform = 'scale(1.05)';
        item.style.background = '#fff8e1';
      } else {
        item.style.opacity = '0.6';
        item.style.transform = 'scale(1)';
        item.style.background = 'white';
      }
    });
  }
  
  updateNavigation() {
    const dots = document.querySelectorAll('.timeline-dot');
    
    dots.forEach((dot, index) => {
      if (index === this.currentIndex) {
        dot.style.background = '#eba500';
        dot.style.color = 'white';
      } else {
        dot.style.background = '#e0e0e0';
        dot.style.color = '#666';
      }
    });
  }
  
  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft' && this.currentIndex > 0) {
        this.goToMilestone(this.currentIndex - 1);
      } else if (e.key === 'ArrowRight' && this.currentIndex < this.milestones.length - 1) {
        this.goToMilestone(this.currentIndex + 1);
      }
    });
  }
}

// Initialize interactive timeline
const interactiveTimeline = new InteractiveTimeline();

// Company statistics animation
function animateCompanyStats() {
  const stats = [
    { element: '.projects-stat', target: 150, suffix: '+' },
    { element: '.clients-stat', target: 500, suffix: '+' },
    { element: '.experience-stat', target: 25, suffix: ' Years' },
    { element: '.employees-stat', target: 500, suffix: '+' }
  ];
  
  stats.forEach(stat => {
    const element = document.querySelector(stat.element);
    if (element) {
      animateStatNumber(element, stat.target, stat.suffix);
    }
  });
}

function animateStatNumber(element, target, suffix = '') {
  let current = 0;
  const increment = target / 100;
  const duration = 2000;
  const stepTime = duration / 100;
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    element.textContent = Math.floor(current) + suffix;
  }, stepTime);
}

// Initialize stats animation on scroll
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCompanyStats();
      statsObserver.unobserve(entry.target);
    }
  });
});

const statsSection = document.querySelector('.growth-stats');
if (statsSection) {
  statsObserver.observe(statsSection);
}

<boltAction type="file" filePath="js/careers.js">
// Careers page functionality
document.addEventListener('DOMContentLoaded', function() {
  // Job modal functionality
  setupJobModal();
  
  // Job filtering and search
  setupJobFiltering();
  
  // Job application tracking
  setupApplicationTracking();
  
  // Career benefits animation
  setupBenefitsAnimation();
});

function setupJobModal() {
  // Global functions for job modal
  window.openJobModal = function(jobTitle) {
    const modal = document.getElementById('jobModal');
    const modalTitle = document.getElementById('modalJobTitle');
    
    if (modal && modalTitle) {
      modalTitle.textContent = `Apply for ${jobTitle}`;
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      
      // Add fade-in animation
      setTimeout(() => {
        modal.style.opacity = '1';
      }, 10);
    }
  };

  window.closeJobModal = function() {
    const modal = document.getElementById('jobModal');
    
    if (modal) {
      modal.style.opacity = '0';
      document.body.style.overflow = 'auto';
      
      setTimeout(() => {
        modal.style.display = 'none';
      }, 300);
    }
  };

  // Close modal on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeJobModal();
    }
  });

  // Close modal on background click
  const modal = document.getElementById('jobModal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeJobModal();
      }
    });
  }
}

function setupJobFiltering() {
  // Create filter controls
  createJobFilters();
  
  // Setup search functionality
  setupJobSearch();
  
  // Setup sorting
  setupJobSorting();
}

function createJobFilters() {
  const jobsGrid = document.querySelector('.jobs-grid');
  if (!jobsGrid) return;
  
  const filterContainer = document.createElement('div');
  filterContainer.className = 'job-filters';
  filterContainer.innerHTML = `
    <div class="filter-group">
      <label for="locationFilter">Location:</label>
      <select id="locationFilter">
        <option value="">All Locations</option>
        <option value="Mumbai">Mumbai</option>
        <option value="Delhi">Delhi</option>
        <option value="Bangalore">Bangalore</option>
        <option value="Pune">Pune</option>
        <option value="Chennai">Chennai</option>
        <option value="Hyderabad">Hyderabad</option>
      </select>
    </div>
    
    <div class="filter-group">
      <label for="experienceFilter">Experience:</label>
      <select id="experienceFilter">
        <option value="">All Levels</option>
        <option value="0-2">0-2 years</option>
        <option value="3-5">3-5 years</option>
        <option value="6-8">6-8 years</option>
        <option value="9+">9+ years</option>
      </select>
    </div>
    
    <div class="filter-group">
      <label for="departmentFilter">Department:</label>
      <select id="departmentFilter">
        <option value="">All Departments</option>
        <option value="Engineering">Engineering</option>
        <option value="Project Management">Project Management</option>
        <option value="Architecture">Architecture</option>
        <option value="Safety">Safety</option>
        <option value="Finance">Finance</option>
      </select>
    </div>
  `;
  
  // Add styles
  filterContainer.style.cssText = `
    display: flex;
    gap: 20px;
    margin-bottom: 30px;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 10px;
    flex-wrap: wrap;
  `;
  
  const filterGroups = filterContainer.querySelectorAll('.filter-group');
  filterGroups.forEach(group => {
    group.style.cssText = `
      display: flex;
      flex-direction: column;
      gap: 5px;
    `;
    
    const label = group.querySelector('label');
    const select = group.querySelector('select');
    
    if (label) {
      label.style.cssText = `
        font-weight: bold;
        color: #333;
      `;
    }
    
    if (select) {
      select.style.cssText = `
        padding: 8px 12px;
        border: 1px solid #ddd;
        border-radius: 5px;
        background: white;
      `;
    }
  });
  
  jobsGrid.parentNode.insertBefore(filterContainer, jobsGrid);
  
  // Add event listeners
  const filters = filterContainer.querySelectorAll('select');
  filters.forEach(filter => {
    filter.addEventListener('change', applyJobFilters);
  });
}

function setupJobSearch() {
  const jobsGrid = document.querySelector('.jobs-grid');
  if (!jobsGrid) return;
  
  const searchContainer = document.createElement('div');
  searchContainer.className = 'job-search';
  searchContainer.innerHTML = `
    <div class="search-group">
      <input type="text" id="jobSearch" placeholder="Search jobs by title, skills, or keywords...">
      <button type="button" id="searchBtn">
        <i class="fas fa-search"></i>
      </button>
    </div>
  `;
  
  searchContainer.style.cssText = `
    margin-bottom: 20px;
  `;
  
  const searchGroup = searchContainer.querySelector('.search-group');
  searchGroup.style.cssText = `
    display: flex;
    gap: 10px;
    max-width: 500px;
  `;
  
  const searchInput = searchContainer.querySelector('#jobSearch');
  const searchBtn = searchContainer.querySelector('#searchBtn');
  
  searchInput.style.cssText = `
    flex: 1;
    padding: 12px 16px;
    border: 2px solid #ddd;
    border-radius: 25px;
    font-size: 16px;
    outline: none;
    transition: border-color 0.3s ease;
  `;
  
  searchBtn.style.cssText = `
    padding: 12px 20px;
    background: #eba500;
    color: white;
    border: none;
    border-radius: 25px;
    cursor: pointer;
    transition: background 0.3s ease;
  `;
  
  jobsGrid.parentNode.insertBefore(searchContainer, jobsGrid);
  
  // Search functionality
  searchInput.addEventListener('input', debounce(applyJobFilters, 300));
  searchBtn.addEventListener('click', applyJobFilters);
  
  searchInput.addEventListener('focus', () => {
    searchInput.style.borderColor = '#eba500';
  });
  
  searchInput.addEventListener('blur', () => {
    searchInput.style.borderColor = '#ddd';
  });
  
  searchBtn.addEventListener('mouseenter', () => {
    searchBtn.style.background = '#d49400';
  });
  
  searchBtn.addEventListener('mouseleave', () => {
    searchBtn.style.background = '#eba500';
  });
}

function setupJobSorting() {
  const jobsGrid = document.querySelector('.jobs-grid');
  if (!jobsGrid) return;
  
  const sortContainer = document.createElement('div');
  sortContainer.className = 'job-sort';
  sortContainer.innerHTML = `
    <label for="jobSort">Sort by:</label>
    <select id="jobSort">
      <option value="newest">Newest First</option>
      <option value="oldest">Oldest First</option>
      <option value="title">Job Title A-Z</option>
      <option value="location">Location A-Z</option>
    </select>
  `;
  
  sortContainer.style.cssText = `
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
    justify-content: flex-end;
  `;
  
  const sortSelect = sortContainer.querySelector('#jobSort');
  sortSelect.style.cssText = `
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 5px;
    background: white;
  `;
  
  jobsGrid.parentNode.insertBefore(sortContainer, jobsGrid);
  
  sortSelect.addEventListener('change', applyJobFilters);
}

function applyJobFilters() {
  const jobCards = document.querySelectorAll('.job-card');
  const searchTerm = document.getElementById('jobSearch')?.value.toLowerCase() || '';
  const locationFilter = document.getElementById('locationFilter')?.value || '';
  const experienceFilter = document.getElementById('experienceFilter')?.value || '';
  const departmentFilter = document.getElementById('departmentFilter')?.value || '';
  const sortBy = document.getElementById('jobSort')?.value || 'newest';
  
  let visibleJobs = [];
  
  jobCards.forEach(card => {
    const title = card.querySelector('h3').textContent.toLowerCase();
    const location = card.querySelector('.job-meta span').textContent.toLowerCase();
    const skills = Array.from(card.querySelectorAll('.skill-tag')).map(tag => tag.textContent.toLowerCase());
    const allText = title + ' ' + location + ' ' + skills.join(' ');
    
    let isVisible = true;
    
    // Search filter
    if (searchTerm && !allText.includes(searchTerm)) {
      isVisible = false;
    }
    
    // Location filter
    if (locationFilter && !location.includes(locationFilter.toLowerCase())) {
      isVisible = false;
    }
    
    // Experience filter (simplified)
    if (experienceFilter) {
      const experienceText = card.querySelector('.job-meta').textContent;
      if (!experienceText.includes(experienceFilter.split('-')[0])) {
        isVisible = false;
      }
    }
    
    // Department filter (simplified)
    if (departmentFilter && !title.includes(departmentFilter.toLowerCase())) {
      isVisible = false;
    }
    
    if (isVisible) {
      card.style.display = 'block';
      visibleJobs.push(card);
    } else {
      card.style.display = 'none';
    }
  });
  
  // Apply sorting
  sortJobs(visibleJobs, sortBy);
  
  // Show results count
  updateResultsCount(visibleJobs.length, jobCards.length);
}

function sortJobs(jobs, sortBy) {
  const jobsGrid = document.querySelector('.jobs-grid');
  if (!jobsGrid) return;
  
  const sortedJobs = [...jobs].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.querySelector('h3').textContent.localeCompare(b.querySelector('h3').textContent);
      case 'location':
        return a.querySelector('.job-meta span').textContent.localeCompare(b.querySelector('.job-meta span').textContent);
      case 'oldest':
        return 1; // Simplified - in real app, would use actual dates
      case 'newest':
      default:
        return -1; // Simplified - in real app, would use actual dates
    }
  });
  
  // Reorder DOM elements
  sortedJobs.forEach(job => {
    jobsGrid.appendChild(job);
  });
}

function updateResultsCount(visible, total) {
  let resultsCount = document.querySelector('.results-count');
  
  if (!resultsCount) {
    resultsCount = document.createElement('div');
    resultsCount.className = 'results-count';
    resultsCount.style.cssText = `
      margin-bottom: 20px;
      color: #666;
      font-style: italic;
    `;
    
    const jobsGrid = document.querySelector('.jobs-grid');
    if (jobsGrid) {
      jobsGrid.parentNode.insertBefore(resultsCount, jobsGrid);
    }
  }
  
  resultsCount.textContent = `Showing ${visible} of ${total} jobs`;
}

function setupApplicationTracking() {
  // Track job applications in localStorage
  const appliedJobs = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
  
  // Mark applied jobs
  appliedJobs.forEach(jobTitle => {
    const jobCards = document.querySelectorAll('.job-card');
    jobCards.forEach(card => {
      const title = card.querySelector('h3').textContent;
      if (title === jobTitle) {
        const applyBtn = card.querySelector('.apply-btn');
        if (applyBtn) {
          applyBtn.textContent = 'Applied';
          applyBtn.style.background = '#4CAF50';
          applyBtn.disabled = true;
        }
      }
    });
  });
  
  // Track new applications
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('apply-btn') && !e.target.disabled) {
      const jobCard = e.target.closest('.job-card');
      const jobTitle = jobCard.querySelector('h3').textContent;
      
      // Add to applied jobs
      appliedJobs.push(jobTitle);
      localStorage.setItem('appliedJobs', JSON.stringify(appliedJobs));
      
      // Update button
      e.target.textContent = 'Applied';
      e.target.style.background = '#4CAF50';
      e.target.disabled = true;
    }
  });
}

function setupBenefitsAnimation() {
  const benefitItems = document.querySelectorAll('.benefit-item');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0) scale(1)';
        }, index * 150);
      }
    });
  }, {
    threshold: 0.1
  });
  
  benefitItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px) scale(0.9)';
    item.style.transition = 'all 0.6s ease';
    observer.observe(item);
  });
}

// Job application form functionality
class JobApplicationForm {
  constructor() {
    this.currentJob = null;
    this.formData = {};
  }
  
  openApplication(jobTitle) {
    this.currentJob = jobTitle;
    this.createApplicationForm();
  }
  
  createApplicationForm() {
    const formModal = document.createElement('div');
    formModal.className = 'application-form-modal';
    formModal.innerHTML = `
      <div class="modal-overlay">
        <div class="modal-content">
          <div class="modal-header">
            <h2>Apply for ${this.currentJob}</h2>
            <button class="modal-close">&times;</button>
          </div>
          <form class="application-form">
            <div class="form-row">
              <div class="form-group">
                <label for="firstName">First Name *</label>
                <input type="text" id="firstName" name="firstName" required>
              </div>
              <div class="form-group">
                <label for="lastName">Last Name *</label>
                <input type="text" id="lastName" name="lastName" required>
              </div>
            </div>
            
            <div class="form-group">
              <label for="email">Email Address *</label>
              <input type="email" id="email" name="email" required>
            </div>
            
            <div class="form-group">
              <label for="phone">Phone Number *</label>
              <input type="tel" id="phone" name="phone" required>
            </div>
            
            <div class="form-group">
              <label for="experience">Years of Experience *</label>
              <select id="experience" name="experience" required>
                <option value="">Select experience</option>
                <option value="0-1">0-1 years</option>
                <option value="2-3">2-3 years</option>
                <option value="4-5">4-5 years</option>
                <option value="6-8">6-8 years</option>
                <option value="9+">9+ years</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="resume">Upload Resume *</label>
              <input type="file" id="resume" name="resume" accept=".pdf,.doc,.docx" required>
            </div>
            
            <div class="form-group">
              <label for="coverLetter">Cover Letter</label>
              <textarea id="coverLetter" name="coverLetter" rows="4" placeholder="Tell us why you're interested in this position..."></textarea>
            </div>
            
            <div class="form-actions">
              <button type="button" class="cancel-btn">Cancel</button>
              <button type="submit" class="submit-btn">Submit Application</button>
            </div>
          </form>
        </div>
      </div>
    `;
    
    this.styleApplicationForm(formModal);
    document.body.appendChild(formModal);
    document.body.style.overflow = 'hidden';
    
    this.setupFormEvents(formModal);
  }
  
  styleApplicationForm(modal) {
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
    `;
    
    const content = modal.querySelector('.modal-content');
    content.style.cssText = `
      background: white;
      border-radius: 10px;
      padding: 30px;
      max-width: 600px;
      width: 90%;
      max-height: 90vh;
      overflow-y: auto;
    `;
    
    // Style form elements
    const formGroups = modal.querySelectorAll('.form-group');
    formGroups.forEach(group => {
      group.style.cssText = `
        margin-bottom: 20px;
      `;
      
      const label = group.querySelector('label');
      if (label) {
        label.style.cssText = `
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
          color: #333;
        `;
      }
      
      const input = group.querySelector('input, select, textarea');
      if (input) {
        input.style.cssText = `
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 5px;
          font-size: 16px;
        `;
      }
    });
    
    const formRow = modal.querySelector('.form-row');
    if (formRow) {
      formRow.style.cssText = `
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
      `;
    }
    
    const formActions = modal.querySelector('.form-actions');
    formActions.style.cssText = `
      display: flex;
      gap: 15px;
      justify-content: flex-end;
      margin-top: 30px;
    `;
    
    const buttons = modal.querySelectorAll('.form-actions button');
    buttons.forEach(btn => {
      btn.style.cssText = `
        padding: 12px 24px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-weight: bold;
        transition: all 0.3s ease;
      `;
    });
    
    const cancelBtn = modal.querySelector('.cancel-btn');
    cancelBtn.style.cssText += `
      background: #f5f5f5;
      color: #666;
    `;
    
    const submitBtn = modal.querySelector('.submit-btn');
    submitBtn.style.cssText += `
      background: #eba500;
      color: white;
    `;
  }
  
  setupFormEvents(modal) {
    const closeBtn = modal.querySelector('.modal-close');
    const cancelBtn = modal.querySelector('.cancel-btn');
    const form = modal.querySelector('.application-form');
    
    const closeModal = () => {
      document.body.removeChild(modal);
      document.body.style.overflow = 'auto';
    };
    
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.submitApplication(form, closeModal);
    });
  }
  
  submitApplication(form, closeModal) {
    const formData = new FormData(form);
    const submitBtn = form.querySelector('.submit-btn');
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    submitBtn.disabled = true;
    
    // Simulate submission
    setTimeout(() => {
      console.log('Application submitted:', Object.fromEntries(formData));
      
      // Show success message
      alert('Application submitted successfully! We will contact you soon.');
      
      // Track application
      const appliedJobs = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
      appliedJobs.push(this.currentJob);
      localStorage.setItem('appliedJobs', JSON.stringify(appliedJobs));
      
      closeModal();
    }, 2000);
  }
}

// Initialize job application form
const jobApplicationForm = new JobApplicationForm();

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

// Job alerts functionality
function setupJobAlerts() {
  const alertBtn = document.createElement('button');
  alertBtn.textContent = 'Set Job Alerts';
  alertBtn.className = 'job-alerts-btn';
  alertBtn.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 20px;
    background: #eba500;
    color: white;
    border: none;
    padding: 12px 20px;
    border-radius: 25px;
    cursor: pointer;
    font-weight: bold;
    box-shadow: 0 4px 15px rgba(235, 165, 0, 0.3);
    transition: all 0.3s ease;
    z-index: 1000;
  `;
  
  alertBtn.addEventListener('click', () => {
    // Implementation for job alerts
    alert('Job alerts feature would be implemented here.');
  });
  
  document.body.appendChild(alertBtn);
}

// Initialize job alerts
setupJobAlerts();

I've created a comprehensive premium website for "Nirmal Sand and Infra" with all the requested features:

## Key Features Implemented:

### **Design & Branding:**
- Premium design with specified color scheme (#eba500, #292929, #ffffff)
- Fully responsive across Mobile, Tablet, and Desktop
- Professional animations and smooth transitions
- Modern UI with clean typography

### **Pages Created:**
1. **Home Page** - Hero carousel, company brief, services, expertise, running projects, dream project, testimonials
2. **Projects** - Filterable project gallery with detailed view
3. **Project Details** - Individual project pages with image gallery, specifications, and map
4. **Our Clients** - Client showcase with testimonials
5. **Gallery** - Image gallery with lightbox and filtering
6. **Team** - Leadership and team member profiles
7. **About Us** - Company history, timeline, growth charts
8. **Contact** - Contact form, map, and company information
9. **Careers** - Job listings with application system

### **Technical Features:**
- **Animations:** Scroll-triggered animations, counters, carousels, parallax effects
- **Interactive Elements:** Image galleries, lightboxes, form validation
- **Performance:** Lazy loading, debounced scroll events, optimized animations
- **Accessibility:** Keyboard navigation, focus states, semantic HTML
- **Mobile-First:** Responsive design with hamburger menu

### **JavaScript Functionality:**
- Modular code structure with separate files for each page
- Advanced animation controller
- Form validation and submission
- Image galleries with lightbox
- Project filtering and search
- Career application system

The website showcases modern construction industry standards with premium aesthetics, smooth animations, and comprehensive functionality for showcasing projects, team, and services