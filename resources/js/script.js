document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // Initialize site
    initLoader();
    initCursorFollower();
    initNavigation();
    initHeroCanvas();
    initHeroWordRotation();
    initScrollAnimations();
    initFilterTabs();
    initCounterAnimation();
    initTestimonialSlider();
    initContactForm();
    initPortfolioDemos();
    initFixedCTA();
    
    /* Page Loader
       ========================================================================== */
    function initLoader() {
        const loader = document.querySelector('.page-loader');
        
        if (!loader) return;
        
        // Let animations complete
        setTimeout(() => {
            // Add hidden class
            loader.classList.add('hidden');
            document.body.classList.add('loaded');
            
            // Also add a backup timeout just in case
            setTimeout(() => {
                loader.style.display = 'none';
            }, 600);
        }, 2500);
    }
    
    /* Cursor Follower
       ========================================================================== */
    function initCursorFollower() {
        const cursor = document.querySelector('.cursor-follower');
        const cursorDot = document.querySelector('.cursor-dot');
        
        if (!cursor || !cursorDot || window.matchMedia('(max-width: 768px)').matches) return;
        
        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;
        let dotX = 0, dotY = 0;
        
        document.body.classList.add('cursor-active');
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        
        // Check if mouse is over a hoverable element
        document.addEventListener('mouseover', (e) => {
            if (
                e.target.tagName === 'A' || 
                e.target.tagName === 'BUTTON' || 
                e.target.closest('a') || 
                e.target.closest('button') ||
                e.target.classList.contains('project-item') ||
                e.target.closest('.project-item')
            ) {
                document.body.classList.add('cursor-hover');
            }
        });
        
        document.addEventListener('mouseout', (e) => {
            if (
                e.target.tagName === 'A' || 
                e.target.tagName === 'BUTTON' || 
                e.target.closest('a') || 
                e.target.closest('button') ||
                e.target.classList.contains('project-item') ||
                e.target.closest('.project-item')
            ) {
                document.body.classList.remove('cursor-hover');
            }
        });
        
        // Cursor animation
        function animate() {
            // Main cursor follows with delay
            let distX = mouseX - cursorX;
            let distY = mouseY - cursorY;
            
            cursorX = cursorX + (distX * 0.1);
            cursorY = cursorY + (distY * 0.1);
            
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
            
            // Dot follows cursor more closely
            dotX = mouseX;
            dotY = mouseY;
            
            cursorDot.style.left = dotX + 'px';
            cursorDot.style.top = dotY + 'px';
            
            requestAnimationFrame(animate);
        }
        
        animate();
    }
    
    /* Navigation
       ========================================================================== */
    function initNavigation() {
        const header = document.querySelector('.site-header');
        const menuToggle = document.querySelector('.menu-toggle');
        const mainNav = document.querySelector('.main-nav');
        const navLinks = document.querySelectorAll('.nav-link');
        
        if (!header || !menuToggle || !mainNav) return;
        
        // Toggle navigation
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mainNav.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
        
        // Close mobile menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                mainNav.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
        
        // Header scroll effect
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', throttle(() => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            lastScrollTop = scrollTop;
        }, 100));
        
        // Active nav link on scroll
        window.addEventListener('scroll', throttle(() => {
            updateActiveLink();
        }, 200));
        
        function updateActiveLink() {
            const sections = document.querySelectorAll('section[id]');
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === '#' + sectionId) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }
    }
    
    /* Hero Canvas Animation
       ========================================================================== */
    function initHeroCanvas() {
        const canvas = document.getElementById('hero-canvas');
        
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const particles = [];
        const particleCount = 100;
        
        // Resize canvas to full window size
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        
        // Particle class
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 3 + 1;
                this.speedX = Math.random() * 0.5 - 0.25;
                this.speedY = Math.random() * 0.5 - 0.25;
                this.color = `rgba(255, 0, 0, ${Math.random() * 0.05})`;
            }
            
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                
                // Bounce off edges
                if (this.x < 0 || this.x > canvas.width) {
                    this.speedX = -this.speedX;
                }
                
                if (this.y < 0 || this.y > canvas.height) {
                    this.speedY = -this.speedY;
                }
            }
            
            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        // Create particles
        function initParticles() {
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }
        
        // Draw connecting lines between particles
        function drawLines() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 150) {
                        ctx.strokeStyle = `rgba(255, 0, 0, ${0.02 * (1 - distance / 150)})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        }
        
        // Animation loop
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            
            drawLines();
            
            requestAnimationFrame(animate);
        }
        
        initParticles();
        animate();
    }
    
    /* Hero Word Rotation
       ========================================================================== */
    function initHeroWordRotation() {
        const rotateItems = document.querySelectorAll('.word-rotation .rotate-item');
        
        if (!rotateItems.length) return;
        
        let currentIndex = 0;
        
        function rotateWords() {
            // Hide current word
            rotateItems[currentIndex].classList.remove('active');
            
            // Update index
            currentIndex = (currentIndex + 1) % rotateItems.length;
            
            // Show next word
            rotateItems[currentIndex].classList.add('active');
        }
        
        // Initial state
        rotateItems[0].classList.add('active');
        
        // Rotate words every 3 seconds
        setInterval(rotateWords, 3000);
    }
    
    /* Scroll Animations
       ========================================================================== */
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('[data-animation]');
        
        if (!animatedElements.length) return;
        
        // Set delay based on data attribute
        animatedElements.forEach(el => {
            const delay = el.getAttribute('data-delay') || 0;
            el.style.setProperty('--delay', delay);
        });
        
        // Observe elements
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -10% 0px'
        });
        
        animatedElements.forEach(el => {
            observer.observe(el);
        });
        
        // Trigger initial animations (for elements already in viewport)
        setTimeout(() => {
            window.dispatchEvent(new Event('scroll'));
        }, 500);
    }
    
    /* Filter Tabs for Projects
       ========================================================================== */
    function initFilterTabs() {
        const filterTabs = document.querySelectorAll('.filter-tab');
        const projectItems = document.querySelectorAll('.project-item');
        
        if (!filterTabs.length || !projectItems.length) return;
        
        // Filter function
        function filterProjects(category) {
            projectItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                
                if (category === 'all' || itemCategory === category) {
                    item.style.display = '';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        }
        
        // Event listeners for tabs
        filterTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Active class
                filterTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Filter projects
                const category = tab.getAttribute('data-filter');
                filterProjects(category);
            });
        });
    }
    
    /* Counter Animation for Stats Section
       ========================================================================== */
    function initCounterAnimation() {
        const statItems = document.querySelectorAll('.stat-number');
        
        if (!statItems.length) return;
        
        let counted = false;
        
        function animateNumbers() {
            if (counted) return;
            
            statItems.forEach(item => {
                const target = parseInt(item.getAttribute('data-count'), 10);
                const duration = 2000; // ms
                const increment = target / (duration / 16); // 60fps
                
                let current = 0;
                const counter = setInterval(() => {
                    current += increment;
                    
                    // Update text
                    item.textContent = Math.round(current);
                    
                    // Check if target reached
                    if (current >= target) {
                        item.textContent = target;
                        clearInterval(counter);
                    }
                }, 16);
            });
            
            counted = true;
        }
        
        // Trigger counter when stats section is in view
        const statsSection = document.querySelector('.stats-section');
        
        if (statsSection) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateNumbers();
                    }
                });
            }, {
                threshold: 0.5
            });
            
            observer.observe(statsSection);
        }
    }
    
    /* Testimonial Slider
       ========================================================================== */
    function initTestimonialSlider() {
        const slides = document.querySelectorAll('.testimonial-slide');
        const dots = document.querySelectorAll('.testimonial-dots .dot');
        const prevBtn = document.querySelector('.testimonial-arrow.prev');
        const nextBtn = document.querySelector('.testimonial-arrow.next');
        
        if (!slides.length || !dots.length || !prevBtn || !nextBtn) return;
        
        let currentSlide = 0;
        
        // Show slide
        function showSlide(index) {
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            
            slides[index].classList.add('active');
            dots[index].classList.add('active');
            
            currentSlide = index;
        }
        
        // Next slide
        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }
        
        // Previous slide
        function prevSlide() {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(currentSlide);
        }
        
        // Event listeners
        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);
        
        // Dot navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
            });
        });
        
        // Auto slide (optional)
        let slideInterval = setInterval(nextSlide, 5000);
        
        // Pause auto slide on hover
        const sliderContainer = document.querySelector('.testimonials-slider');
        if (sliderContainer) {
            sliderContainer.addEventListener('mouseenter', () => {
                clearInterval(slideInterval);
            });
            
            sliderContainer.addEventListener('mouseleave', () => {
                slideInterval = setInterval(nextSlide, 5000);
            });
        }
    }
    
    /* Contact Form
       ========================================================================== */
    function initContactForm() {
        const form = document.getElementById('contactForm');
        const formMessage = document.querySelector('.form-message');
        
        if (!form || !formMessage) return;
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nameInput = this.querySelector('#name');
            const emailInput = this.querySelector('#email');
            const subjectInput = this.querySelector('#subject');
            const messageInput = this.querySelector('#message');
            
            let isValid = true;
            
            // Basic validation
            [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('error');
                } else {
                    input.classList.remove('error');
                }
            });
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value.trim())) {
                isValid = false;
                emailInput.classList.add('error');
            }
            
            if (isValid) {
                // Here you would normally send the form data to your server
                // For demo purposes, we'll just show a success message
                
                formMessage.textContent = 'Your message has been sent successfully!';
                formMessage.classList.add('success');
                
                // Reset form
                form.reset();
                
                // Hide message after 5 seconds
                setTimeout(() => {
                    formMessage.textContent = '';
                    formMessage.classList.remove('success');
                }, 5000);
            } else {
                formMessage.textContent = 'Please fill out all fields correctly.';
                formMessage.classList.add('error');
                
                // Hide message after 5 seconds
                setTimeout(() => {
                    formMessage.textContent = '';
                    formMessage.classList.remove('error');
                }, 5000);
            }
        });
        
        // Reset validation on input
        const formInputs = form.querySelectorAll('.form-input, .form-textarea');
        formInputs.forEach(input => {
            input.addEventListener('input', function() {
                this.classList.remove('error');
                formMessage.textContent = '';
                formMessage.classList.remove('error', 'success');
            });
        });
    }
    
    /* Portfolio Demos
       ========================================================================== */
    function initPortfolioDemos() {
        const modal = document.querySelector('.portfolio-modal');
        const modalTitle = document.querySelector('.modal-title');
        const demoFrame = document.querySelector('.demo-frame');
        const demoVisitBtn = document.querySelector('.demo-visit-btn');
        const modalClose = document.querySelector('.modal-close');
        const demoCloseBtn = document.querySelector('.demo-close-btn');
        const deviceBtns = document.querySelectorAll('.demo-device-btn');
        const frameContainer = document.querySelector('.demo-frame-container');
        
        // Make sure we have all necessary elements
        if (!modal || !demoFrame || !modalClose || !demoCloseBtn) return;
        
        // Get all project items with demo URLs
        const demoTriggers = document.querySelectorAll('.project-link.demo-trigger, .project-view-btn');
        
        // Add click event to each demo trigger
        demoTriggers.forEach(trigger => {
            trigger.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Get project data
                const projectItem = this.closest('.project-item') || this;
                const demoUrl = projectItem.getAttribute('data-demo-url');
                const liveUrl = projectItem.getAttribute('data-live-url') || demoUrl;
                let projectTitle = 'Project Demo';
                
                // Try to get title from different elements
                if (projectItem.querySelector('.project-title')) {
                    projectTitle = projectItem.querySelector('.project-title').textContent;
                } else if (document.querySelector('.featured-project-header .section-title')) {
                    projectTitle = document.querySelector('.featured-project-header .section-title').textContent;
                }
                
                // Set demo frame source
                demoFrame.src = demoUrl;
                
                // Set modal title
                modalTitle.textContent = projectTitle;
                
                // Set visit button URL
                demoVisitBtn.href = liveUrl;
                
                // Open modal
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });
        
        // Device buttons
        deviceBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                deviceBtns.forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Get device type
                const device = this.getAttribute('data-device');
                
                // Update frame container class
                frameContainer.className = 'demo-frame-container ' + device;
            });
        });
        
        // Close modal functions
        function closeModal() {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            
            // Clear iframe src after a delay to stop any audio/video
            setTimeout(() => {
                demoFrame.src = '';
            }, 300);
        }
        
        // Close modal event listeners
        modalClose.addEventListener('click', closeModal);
        demoCloseBtn.addEventListener('click', closeModal);
        
        // Close modal on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
        
        // Close modal when clicking outside
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
    
    /* Fixed CTA
       ========================================================================== */
    function initFixedCTA() {
        const fixedCTA = document.querySelector('.fixed-cta');
        const contactSection = document.getElementById('contact');
        
        if (!fixedCTA || !contactSection) return;
        
        // Show CTA after page loads
        setTimeout(() => {
            fixedCTA.classList.add('visible');
        }, 2500); // After loader animation
        
        // Hide CTA when contact section is in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    document.body.classList.add('contact-in-view');
                } else {
                    document.body.classList.remove('contact-in-view');
                }
            });
        }, {
            threshold: 0.3
        });
        
        observer.observe(contactSection);
        
        // Smooth scroll when clicking CTA
        fixedCTA.querySelector('a').addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    }
    
    /* Utility Functions
       ========================================================================== */
    // Throttle
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