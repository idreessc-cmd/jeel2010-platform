/**
 * منصة جيل 2010 التعليمية - Phase 1 JavaScript
 * Interactive Features: Hamburger Menu, FAQ Accordion, Scroll animations
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Mobile Navigation Menu Toggle ---
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Prevent background scrolling when menu is active
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'auto';
            }
        });

        // Close mobile menu when clicking a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
    }

    // --- FAQ Accordion Toggle ---
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const trigger = item.querySelector('.faq-trigger');
        const content = item.querySelector('.faq-content');

        if (trigger && content) {
            trigger.addEventListener('click', () => {
                const isActive = item.classList.contains('active');

                // Close all other FAQ items (Optional, for accordion behavior)
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        const otherContent = otherItem.querySelector('.faq-content');
                        if (otherContent) otherContent.style.maxHeight = null;
                    }
                });

                // Toggle current FAQ item
                if (isActive) {
                    item.classList.remove('active');
                    content.style.maxHeight = null;
                } else {
                    item.classList.add('active');
                    // Set max-height dynamically to enable smooth CSS transitions
                    content.style.maxHeight = content.scrollHeight + 'px';
                }
            });
        }
    });

    // --- Header Scroll Effect ---
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.style.padding = '5px 0';
                header.style.boxShadow = '0 10px 30px rgba(0,0,0,0.08)';
            } else {
                header.style.padding = '0';
                header.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.02)';
            }
        });
    }
});
