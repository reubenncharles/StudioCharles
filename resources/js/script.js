/* ==========================================================================
   Studio Charles - Main JavaScript
   ========================================================================== */

   document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const header = document.querySelector('.header');
    const mobileToggle = document.querySelector('.mobile-toggle');
    const mainNav = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.nav-link');
    const backToTop = document.getElementById('back-to-top');
    const animatedElements = document.querySelectorAll('[data-animation]');
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.querySelector('.form-message');
    
    // Initialize the site
    initSite();
    
    function initSite() {
        // Initialize mobile menu
        initMobileMenu();
        
        // Initialize scroll events
        initScrollEvents();
        
        // Initialize animations
        initAnimations();
        
        // Initialize form
        initContactForm();
    }
    
    /* Mobile Menu
       ========================================================================== */
    function initMobileMenu() {
        // Toggle mobile menu
        mobileToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            mainNav.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
        
        // Close mobile menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileToggle.classList.remove('active');
                mainNav.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mainNav.contains(event.target) && !mobileToggle.contains(event.target) && mainNav.classList.contains('active')) {
                mobileToggle.classList.remove('active');
                mainNav.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    }
    
    /* Scroll Events
       ========================================================================== */
    function initScrollEvents() {
        // Header scroll effect
        window.addEventListener('scroll', throttle(function() {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
                backToTop.classList.add('visible');
            } else {
                header.classList.remove('scrolled');
                backToTop.classList.remove('visible');
            }
            
            // Update active navigation link based on scroll position
            updateActiveNavLink();
        }, 100));
        
        // Back to top button
        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // Smooth scrolling for anchor links
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerHeight = header.offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // Update active navigation link based on scroll position
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + header.offsetHeight + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    /* Scroll Animations
       ========================================================================== */
    function initAnimations() {
        // Set initial animation delay based on data-delay attribute
        animatedElements.forEach(element => {
            const delay = element.getAttribute('data-delay') || 0;
            element.style.setProperty('--delay', delay / 1000);
        });
        
        // Check if element is in viewport and trigger animation
        function checkAnimations() {
            animatedElements.forEach(element => {
                if (isElementInViewport(element) && !element.classList.contains('animated')) {
                    element.classList.add('animated');
                }
            });
        }
        
        // Initial check for animations
        checkAnimations();
        
        // Check animations on scroll
        window.addEventListener('scroll', throttle(checkAnimations, 100));
    }
    
    /* Contact Form
       ========================================================================== */
    function initContactForm() {
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Simple form validation
                const nameInput = this.querySelector('#name');
                const emailInput = this.querySelector('#email');
                const subjectInput = this.querySelector('#subject');
                const messageInput = this.querySelector('#message');
                
                let isValid = true;
                
                // Check required fields
                [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
                    if (!input.value.trim()) {
                        isValid = false;
                        input.classList.add('error');
                    } else {
                        input.classList.remove('error');
                    }
                });
                
                // Validate email format
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailInput.value.trim())) {
                    isValid = false;
                    emailInput.classList.add('error');
                }
                
                if (isValid) {
                    // Normally would submit the form data to a server here
                    // For demo purposes, just show a success message
                    formMessage.classList.add('success');
                    formMessage.textContent = 'Your message has been sent successfully!';
                    
                    // Reset form
                    this.reset();
                    
                    // Hide success message after 5 seconds
                    setTimeout(() => {
                        formMessage.textContent = '';
                        formMessage.classList.remove('success');
                    }, 5000);
                } else {
                    formMessage.classList.add('error');
                    formMessage.textContent = 'Please fill out all fields correctly.';
                    
                    // Hide error message after 5 seconds
                    setTimeout(() => {
                        formMessage.textContent = '';
                        formMessage.classList.remove('error');
                    }, 5000);
                }
            });
            
            // Reset validation styles on input
            const formInputs = contactForm.querySelectorAll('.form-input, .form-textarea');
            formInputs.forEach(input => {
                input.addEventListener('input', function() {
                    this.classList.remove('error');
                });
            });
        }
    }
    
    /* Utility Functions
       ========================================================================== */
    // Check if element is in viewport
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= window.innerHeight * 0.85 && 
            rect.bottom >= 0
        );
    }
    
    // Throttle function to limit function calls
    function throttle(func, delay) {
        let lastCall = 0;
        return function(...args) {
            const now = new Date().getTime();
            if (now - lastCall < delay) {
                return;
            }
            lastCall = now;
            return func(...args);
        };
    }
});
