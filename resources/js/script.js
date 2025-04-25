/* ==========================================================================
   Studio Charles - Main JavaScript
   ========================================================================== */

   document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // Initialize site
    initLoader();
    initCursorFollower();
    initNavigation();
    initScrollAnimations();
    initTestimonialSlider();
    initContactForm();
    
    /* Page Loader
       ========================================================================== */
    function initLoader() {
        const loader = document.querySelector('.page-loader');
        
        if (!loader) return;
        
        // Let the typewriter effect complete first (about 2.5s for typing animation)
        setTimeout(() => {
            // Add hidden class
            loader.classList.add('hidden');
            document.body.classList.add('loaded');
            
            // Also add a backup timeout just in case
            setTimeout(() => {
                loader.style.display = 'none';
            }, 1000);
        }, 3000); // Wait for typewriter to finish + a small pause
    }
    
    /* Cursor Follower
       ========================================================================== */
    function initCursorFollower() {
        const cursor = document.querySelector('.cursor-follower');
        
        if (!cursor || window.matchMedia('(max-width: 768px)').matches) return;
        
        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;
        
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
            let distX = mouseX - cursorX;
            let distY = mouseY - cursorY;
            
            cursorX = cursorX + (distX * 0.1);
            cursorY = cursorY + (distY * 0.1);
            
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
            
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
            threshold: 0.15
        });
        
        animatedElements.forEach(el => {
            observer.observe(el);
        });
        
        // Trigger initial animations (for elements already in viewport)
        setTimeout(() => {
            window.dispatchEvent(new Event('scroll'));
        }, 500);
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