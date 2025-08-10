// SkillHire Development Guide - Interactive Features (Fixed)

class SkillHireGuide {
  constructor() {
    this.currentSection = 'overview';
    this.init();
  }

  init() {
    this.setupNavigation();
    this.setupTabs();
    this.setupMobileMenu();
    this.setupSmoothScrolling();
    this.setupCodeHighlighting();
    this.setupAnimations();
    this.handleInitialLoad();
  }

  setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const targetSection = item.getAttribute('data-section');
        if (targetSection) {
          this.navigateToSection(targetSection);
        }
      });
    });

    // Handle hash changes for direct navigation
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.slice(1);
      if (hash && document.getElementById(hash)) {
        this.navigateToSection(hash);
      }
    });
  }

  navigateToSection(sectionId) {
    console.log('Navigating to section:', sectionId);
    
    // Update current section
    this.currentSection = sectionId;

    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
      section.classList.remove('active');
      section.style.display = 'none';
    });

    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
      targetSection.classList.add('active');
      targetSection.style.display = 'block';
      console.log('Section found and displayed:', sectionId);
    } else {
      console.error('Section not found:', sectionId);
    }

    // Update navigation active state
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.classList.remove('active');
    });

    const activeNavItem = document.querySelector(`[data-section="${sectionId}"]`);
    if (activeNavItem) {
      activeNavItem.classList.add('active');
      console.log('Nav item activated:', sectionId);
    } else {
      console.error('Nav item not found for section:', sectionId);
    }

    // Update URL hash without triggering hashchange
    if (window.location.hash !== `#${sectionId}`) {
      window.history.pushState({}, '', `#${sectionId}`);
    }

    // Scroll to top of main content
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      mainContent.scrollTop = 0;
    }

    // Close mobile menu if open
    this.closeMobileMenu();

    // Trigger section change animation
    this.animateSectionChange(targetSection);
  }

  setupTabs() {
    const tabContainers = document.querySelectorAll('.tech-tabs, .code-tabs');
    
    tabContainers.forEach(container => {
      const tabButtons = container.querySelectorAll('.tab-button');
      
      tabButtons.forEach(button => {
        button.addEventListener('click', (e) => {
          e.preventDefault();
          const targetTab = button.getAttribute('data-tab');
          console.log('Tab clicked:', targetTab, 'in container:', container);
          
          if (targetTab) {
            this.switchTab(container, targetTab);
          }
        });
      });
    });
  }

  switchTab(container, tabId) {
    console.log('Switching to tab:', tabId);
    
    // Update button states within this container
    const tabButtons = container.querySelectorAll('.tab-button');
    tabButtons.forEach(btn => {
      btn.classList.remove('active');
    });
    
    const activeButton = container.querySelector(`[data-tab="${tabId}"]`);
    if (activeButton) {
      activeButton.classList.add('active');
      console.log('Tab button activated:', tabId);
    } else {
      console.error('Tab button not found:', tabId);
    }

    // Update content visibility within this container
    const tabContents = container.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
      content.classList.remove('active');
      content.style.display = 'none';
    });

    const activeContent = container.querySelector(`#${tabId}-tab`);
    if (activeContent) {
      activeContent.classList.add('active');
      activeContent.style.display = 'block';
      console.log('Tab content displayed:', tabId);
      this.animateTabChange(activeContent);
    } else {
      console.error('Tab content not found:', `#${tabId}-tab`);
      // Fallback: try to find content by data attribute
      const fallbackContent = container.querySelector(`[data-tab-content="${tabId}"]`);
      if (fallbackContent) {
        fallbackContent.classList.add('active');
        fallbackContent.style.display = 'block';
        console.log('Fallback tab content displayed:', tabId);
      }
    }
  }

  setupMobileMenu() {
    // Create mobile menu button if it doesn't exist
    let mobileButton = document.querySelector('.mobile-menu-button');
    if (!mobileButton) {
      mobileButton = document.createElement('button');
      mobileButton.className = 'mobile-menu-button';
      mobileButton.innerHTML = '☰';
      mobileButton.setAttribute('aria-label', 'Toggle navigation menu');
      document.body.appendChild(mobileButton);

      mobileButton.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleMobileMenu();
      });
    }

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      const sidebar = document.querySelector('.sidebar');
      const mobileButton = document.querySelector('.mobile-menu-button');
      
      if (sidebar && !sidebar.contains(e.target) && !mobileButton.contains(e.target)) {
        this.closeMobileMenu();
      }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeMobileMenu();
      }
    });
  }

  toggleMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      sidebar.classList.toggle('open');
    }
  }

  closeMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      sidebar.classList.remove('open');
    }
  }

  setupSmoothScrolling() {
    // Add smooth scrolling behavior
    document.documentElement.style.scrollBehavior = 'smooth';

    // Handle internal links
    document.addEventListener('click', (e) => {
      if (e.target.matches('a[href^="#"]')) {
        const href = e.target.getAttribute('href');
        if (href !== '#') {
          e.preventDefault();
          const targetId = href.slice(1);
          const targetElement = document.getElementById(targetId);
          
          if (targetElement) {
            targetElement.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        }
      }
    });
  }

  setupCodeHighlighting() {
    // Simple syntax highlighting for code blocks
    const codeBlocks = document.querySelectorAll('pre code');
    
    codeBlocks.forEach(block => {
      this.highlightCode(block);
    });
  }

  highlightCode(codeBlock) {
    let html = codeBlock.innerHTML;
    
    // Escape HTML first to prevent issues
    const tempDiv = document.createElement('div');
    tempDiv.textContent = codeBlock.textContent;
    html = tempDiv.innerHTML;
    
    // JavaScript highlighting patterns
    const patterns = {
      // Keywords
      '\\b(const|let|var|function|class|if|else|for|while|return|import|export|from|async|await|try|catch|finally|throw|new|this|super|extends|implements|interface|type|enum|require|module)\\b': '<span style="color: #ff6b9d; font-weight: 500;">$1</span>',
      // Strings
      '(["\'])((?:\\\\.|(?!\\1)[^\\\\])*)\\1': '<span style="color: #c3e88d;">$&</span>',
      // Comments
      '//.*$': '<span style="color: #546e7a; font-style: italic;">$&</span>',
      '(/\\*[\\s\\S]*?\\*/)': '<span style="color: #546e7a; font-style: italic;">$1</span>',
      // Numbers
      '\\b\\d+\\.?\\d*\\b': '<span style="color: #f78c6c;">$&</span>'
    };

    // Apply patterns
    Object.keys(patterns).forEach(pattern => {
      const regex = new RegExp(pattern, 'gm');
      html = html.replace(regex, patterns[pattern]);
    });

    codeBlock.innerHTML = html;
  }

  setupAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    // Observe cards and timeline items
    const animatedElements = document.querySelectorAll(
      '.overview-card, .tech-item, .practice-card, .timeline-item, .deployment-card'
    );

    animatedElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });
  }

  animateSectionChange(section) {
    if (section) {
      section.style.opacity = '0';
      section.style.transform = 'translateX(20px)';
      
      // Animate in
      requestAnimationFrame(() => {
        section.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        section.style.opacity = '1';
        section.style.transform = 'translateX(0)';
      });
    }
  }

  animateTabChange(tabContent) {
    if (tabContent) {
      tabContent.style.opacity = '0';
      tabContent.style.transform = 'translateY(10px)';
      
      requestAnimationFrame(() => {
        tabContent.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
        tabContent.style.opacity = '1';
        tabContent.style.transform = 'translateY(0)';
      });
    }
  }

  handleInitialLoad() {
    // Initialize all sections as hidden first
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
      section.classList.remove('active');
      section.style.display = 'none';
    });

    // Initialize all tab contents as hidden
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
      content.classList.remove('active');
      content.style.display = 'none';
    });

    // Show first tab in each tab container
    const tabContainers = document.querySelectorAll('.tech-tabs, .code-tabs');
    tabContainers.forEach(container => {
      const firstTabButton = container.querySelector('.tab-button');
      if (firstTabButton) {
        const firstTabId = firstTabButton.getAttribute('data-tab');
        if (firstTabId) {
          firstTabButton.classList.add('active');
          const firstTabContent = container.querySelector(`#${firstTabId}-tab`);
          if (firstTabContent) {
            firstTabContent.classList.add('active');
            firstTabContent.style.display = 'block';
          }
        }
      }
    });

    // Check for hash in URL on initial load
    const hash = window.location.hash.slice(1);
    if (hash && document.getElementById(hash)) {
      setTimeout(() => {
        this.navigateToSection(hash);
      }, 100);
    } else {
      // Default to overview section
      setTimeout(() => {
        this.navigateToSection('overview');
      }, 100);
    }

    // Add loading animation
    document.body.style.opacity = '0';
    window.addEventListener('load', () => {
      setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
      }, 100);
    });
  }

  // Public methods for external use
  getCurrentSection() {
    return this.currentSection;
  }

  goToNextSection() {
    const sections = ['overview', 'techstack', 'structure', 'implementation', 'code', 'deployment'];
    const currentIndex = sections.indexOf(this.currentSection);
    const nextIndex = (currentIndex + 1) % sections.length;
    this.navigateToSection(sections[nextIndex]);
  }

  goToPreviousSection() {
    const sections = ['overview', 'techstack', 'structure', 'implementation', 'code', 'deployment'];
    const currentIndex = sections.indexOf(this.currentSection);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : sections.length - 1;
    this.navigateToSection(sections[prevIndex]);
  }
}

// Global utility functions
function navigateToSection(sectionId) {
  if (window.skillHireGuide) {
    window.skillHireGuide.navigateToSection(sectionId);
  }
}

function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text).then(() => {
      showNotification('Code copied to clipboard!', 'success');
    }).catch(err => {
      console.error('Failed to copy: ', err);
      fallbackCopyTextToClipboard(text);
    });
  } else {
    fallbackCopyTextToClipboard(text);
  }
}

function fallbackCopyTextToClipboard(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand('copy');
    if (successful) {
      showNotification('Code copied to clipboard!', 'success');
    } else {
      showNotification('Failed to copy code', 'error');
    }
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
    showNotification('Failed to copy code', 'error');
  }

  document.body.removeChild(textArea);
}

function showNotification(message, type = 'info') {
  // Remove existing notifications
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }

  const notification = document.createElement('div');
  notification.className = `notification notification--${type}`;
  notification.textContent = message;
  
  // Add styles
  Object.assign(notification.style, {
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '12px 20px',
    borderRadius: '8px',
    color: 'white',
    fontWeight: '500',
    fontSize: '14px',
    zIndex: '10000',
    opacity: '0',
    transform: 'translateY(-20px)',
    transition: 'all 0.3s ease',
    backgroundColor: type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6b7280'
  });

  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.style.opacity = '1';
    notification.style.transform = 'translateY(0)';
  }, 100);

  // Auto remove after 3 seconds
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(-20px)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// Add copy buttons to code blocks
function addCopyButtonsToCodeBlocks() {
  const codeBlocks = document.querySelectorAll('pre');
  
  codeBlocks.forEach(block => {
    // Skip if already has a copy button
    if (block.parentElement.querySelector('.copy-button')) {
      return;
    }

    const container = document.createElement('div');
    container.style.position = 'relative';
    
    const copyButton = document.createElement('button');
    copyButton.textContent = 'Copy';
    copyButton.className = 'copy-button';
    
    Object.assign(copyButton.style, {
      position: 'absolute',
      top: '8px',
      right: '8px',
      background: 'rgba(255, 255, 255, 0.1)',
      color: 'white',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '4px',
      padding: '4px 8px',
      fontSize: '12px',
      cursor: 'pointer',
      opacity: '0',
      transition: 'opacity 0.2s ease',
      zIndex: '10'
    });

    copyButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const code = block.querySelector('code');
      if (code) {
        copyToClipboard(code.textContent);
      } else {
        copyToClipboard(block.textContent);
      }
    });

    // Show button on hover
    container.addEventListener('mouseenter', () => {
      copyButton.style.opacity = '1';
    });

    container.addEventListener('mouseleave', () => {
      copyButton.style.opacity = '0';
    });

    // Wrap the pre element
    if (block.parentNode) {
      block.parentNode.insertBefore(container, block);
      container.appendChild(block);
      container.appendChild(copyButton);
    }
  });
}

// Keyboard navigation
function setupKeyboardNavigation() {
  document.addEventListener('keydown', (e) => {
    if (!window.skillHireGuide) return;

    // Don't interfere with form inputs
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      return;
    }

    // Arrow key navigation
    if (e.altKey) {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          window.skillHireGuide.goToPreviousSection();
          break;
        case 'ArrowRight':
          e.preventDefault();
          window.skillHireGuide.goToNextSection();
          break;
      }
    }

    // Number key navigation (1-6)
    if (e.key >= '1' && e.key <= '6' && !e.ctrlKey && !e.metaKey && !e.altKey) {
      const sections = ['overview', 'techstack', 'structure', 'implementation', 'code', 'deployment'];
      const sectionIndex = parseInt(e.key) - 1;
      if (sections[sectionIndex]) {
        e.preventDefault();
        window.skillHireGuide.navigateToSection(sections[sectionIndex]);
      }
    }
  });
}

// Progress tracking
function setupProgressTracking() {
  const sections = ['overview', 'techstack', 'structure', 'implementation', 'code', 'deployment'];
  let visitedSections = [];
  
  try {
    visitedSections = JSON.parse(localStorage.getItem('skillhire-visited') || '[]');
  } catch (e) {
    console.warn('Failed to load progress from localStorage:', e);
    visitedSections = [];
  }

  function markSectionVisited(sectionId) {
    if (!visitedSections.includes(sectionId)) {
      visitedSections.push(sectionId);
      try {
        localStorage.setItem('skillhire-visited', JSON.stringify(visitedSections));
      } catch (e) {
        console.warn('Failed to save progress to localStorage:', e);
      }
      updateProgressIndicator();
    }
  }

  function updateProgressIndicator() {
    const progress = (visitedSections.length / sections.length) * 100;
    
    // Create or update progress bar
    let progressBar = document.querySelector('.progress-bar');
    if (!progressBar) {
      progressBar = document.createElement('div');
      progressBar.className = 'progress-bar';
      Object.assign(progressBar.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '3px',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        zIndex: '9999'
      });

      const progressFill = document.createElement('div');
      progressFill.className = 'progress-fill';
      Object.assign(progressFill.style, {
        height: '100%',
        backgroundColor: 'var(--color-primary)',
        width: '0%',
        transition: 'width 0.5s ease'
      });

      progressBar.appendChild(progressFill);
      document.body.appendChild(progressBar);
    }

    const progressFill = progressBar.querySelector('.progress-fill');
    if (progressFill) {
      progressFill.style.width = `${progress}%`;
    }
  }

  // Hook into navigation to track visits
  const originalNavigateToSection = window.skillHireGuide ? window.skillHireGuide.navigateToSection.bind(window.skillHireGuide) : null;
  if (originalNavigateToSection && window.skillHireGuide) {
    window.skillHireGuide.navigateToSection = function(sectionId) {
      originalNavigateToSection(sectionId);
      markSectionVisited(sectionId);
    };
  }

  // Initialize progress
  updateProgressIndicator();
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Initializing SkillHire Development Guide...');
  
  // Initialize main application
  window.skillHireGuide = new SkillHireGuide();
  
  // Setup additional features
  setupKeyboardNavigation();
  
  // Add copy buttons and progress tracking after DOM is ready
  setTimeout(() => {
    addCopyButtonsToCodeBlocks();
    setupProgressTracking();
  }, 1000);

  // Add helpful keyboard shortcuts info
  const shortcutsInfo = document.createElement('div');
  shortcutsInfo.className = 'keyboard-shortcuts';
  shortcutsInfo.innerHTML = `
    <div style="position: fixed; bottom: 20px; right: 20px; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: 8px; padding: 12px; font-size: 12px; color: var(--color-text-secondary); max-width: 250px; z-index: 1000; opacity: 0.9;">
      <div style="font-weight: 600; margin-bottom: 8px; color: var(--color-text);">💡 Keyboard Shortcuts:</div>
      <div>1-6: Navigate to sections</div>
      <div>Alt + ←/→: Previous/Next section</div>
      <div>Esc: Close mobile menu</div>
    </div>
  `;

  // Show shortcuts info for a few seconds on load
  document.body.appendChild(shortcutsInfo);
  setTimeout(() => {
    if (shortcutsInfo) {
      shortcutsInfo.style.opacity = '0';
      shortcutsInfo.style.transition = 'opacity 0.5s ease';
      setTimeout(() => {
        if (shortcutsInfo.parentNode) {
          shortcutsInfo.parentNode.removeChild(shortcutsInfo);
        }
      }, 500);
    }
  }, 5000);

  console.log('✅ SkillHire Development Guide loaded successfully!');
  console.log('💡 Use keyboard shortcuts: 1-6 for sections, Alt+←/→ for navigation');
});