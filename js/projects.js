// Projects page functionality
document.addEventListener('DOMContentLoaded', function() {
  // Project filtering
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      // Add active class to clicked button
      btn.classList.add('active');

      const filterValue = btn.dataset.filter;

      projectCards.forEach(card => {
        if (filterValue === 'all' || card.dataset.category === filterValue) {
          card.style.display = 'block';
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 100);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // Project card hover effects
  projectCards.forEach(card => {
    const overlay = card.querySelector('.project-overlay');
    const image = card.querySelector('.project-image img');

    card.addEventListener('mouseenter', () => {
      overlay.style.opacity = '1';
      if (image) {
        image.style.transform = 'scale(1.1)';
      }
    });

    card.addEventListener('mouseleave', () => {
      overlay.style.opacity = '0';
      if (image) {
        image.style.transform = 'scale(1)';
      }
    });
  });

  // Animate project cards on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const projectObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, index * 100);
      }
    });
  }, observerOptions);

  // Initially hide cards for animation
  projectCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s ease';
    projectObserver.observe(card);
  });

  // Search functionality
  const searchInput = document.querySelector('.project-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      
      projectCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const location = card.querySelector('p').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || location.includes(searchTerm)) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }

  // Load more projects functionality
  const loadMoreBtn = document.querySelector('.load-more-btn');
  if (loadMoreBtn) {
    let currentPage = 1;
    const projectsPerPage = 6;

    loadMoreBtn.addEventListener('click', () => {
      // Simulate loading more projects
      loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
      
      setTimeout(() => {
        // Here you would typically fetch more projects from an API
        // For demo purposes, we'll just show a message
        loadMoreBtn.innerHTML = 'Load More Projects';
        currentPage++;
        
        if (currentPage >= 3) {
          loadMoreBtn.style.display = 'none';
        }
      }, 1000);
    });
  }

  // Project statistics counter
  const stats = document.querySelectorAll('.project-stat-number');
  
  const animateStats = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.dataset.target);
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateStat = () => {
          if (current < target) {
            current += increment;
            entry.target.textContent = Math.floor(current);
            requestAnimationFrame(updateStat);
          } else {
            entry.target.textContent = target;
          }
        };

        updateStat();
        statsObserver.unobserve(entry.target);
      }
    });
  };

  const statsObserver = new IntersectionObserver(animateStats, {
    threshold: 0.5
  });

  stats.forEach(stat => {
    statsObserver.observe(stat);
  });
});

// Project data management
class ProjectManager {
  constructor() {
    this.projects = [];
    this.filteredProjects = [];
    this.currentFilter = 'all';
    this.currentPage = 1;
    this.projectsPerPage = 6;
  }

  async loadProjects() {
    // In a real application, this would fetch from an API
    this.projects = [
      {
        id: 1,
        title: 'Corporate Tower Complex',
        category: 'commercial',
        location: 'Mumbai, Maharashtra',
        image: 'assets/project-commercial-1.jpg',
        status: 'completed',
        year: 2023
      },
      {
        id: 2,
        title: 'Luxury Apartments',
        category: 'residential',
        location: 'Delhi, NCR',
        image: 'assets/project-residential-1.jpg',
        status: 'completed',
        year: 2023
      },
      // Add more projects as needed
    ];

    this.filteredProjects = [...this.projects];
    this.renderProjects();
  }

  filterProjects(category) {
    this.currentFilter = category;
    this.currentPage = 1;

    if (category === 'all') {
      this.filteredProjects = [...this.projects];
    } else {
      this.filteredProjects = this.projects.filter(project => 
        project.category === category
      );
    }

    this.renderProjects();
  }

  searchProjects(searchTerm) {
    const term = searchTerm.toLowerCase();
    this.filteredProjects = this.projects.filter(project =>
      project.title.toLowerCase().includes(term) ||
      project.location.toLowerCase().includes(term)
    );

    this.renderProjects();
  }

  renderProjects() {
    const container = document.querySelector('.projects-grid');
    if (!container) return;

    const startIndex = (this.currentPage - 1) * this.projectsPerPage;
    const endIndex = startIndex + this.projectsPerPage;
    const projectsToShow = this.filteredProjects.slice(0, endIndex);

    container.innerHTML = '';

    projectsToShow.forEach((project, index) => {
      const projectCard = this.createProjectCard(project);
      container.appendChild(projectCard);

      // Animate card appearance
      setTimeout(() => {
        projectCard.style.opacity = '1';
        projectCard.style.transform = 'translateY(0)';
      }, index * 100);
    });

    // Update load more button visibility
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (loadMoreBtn) {
      if (endIndex >= this.filteredProjects.length) {
        loadMoreBtn.style.display = 'none';
      } else {
        loadMoreBtn.style.display = 'block';
      }
    }
  }

  createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.dataset.category = project.category;
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s ease';

    card.innerHTML = `
      <div class="project-image">
        <img src="${project.image}" alt="${project.title}">
        <div class="project-overlay">
          <div class="project-info">
            <h3>${project.title}</h3>
            <p>${project.location}</p>
            <a href="project-details.html?id=${project.id}" class="view-details-btn">View Details</a>
          </div>
        </div>
      </div>
    `;

    return card;
  }

  loadMoreProjects() {
    this.currentPage++;
    this.renderProjects();
  }
}

// Initialize project manager
const projectManager = new ProjectManager();
