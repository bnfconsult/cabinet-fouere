/* ========================================
   Cabinet Fouéré — JavaScript Principal
   ======================================== */

document.addEventListener('DOMContentLoaded', function () {

    // ========================================
    // HEADER — Transition au scroll
    // ========================================
    const header = document.getElementById('header');

    function handleHeaderScroll() {
        if (window.scrollY > 80) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleHeaderScroll);
    handleHeaderScroll();

    // ========================================
    // BOUTON RETOUR EN HAUT
    // ========================================
    var backToTop = document.getElementById('backToTop');

    if (backToTop) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 400) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        backToTop.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ========================================
    // MENU MOBILE
    // ========================================
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function () {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });

        // Fermer le menu en cliquant sur un lien (sauf le lien dropdown parent)
        navLinks.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                // Ne pas fermer si c'est le lien parent du dropdown (Expertise)
                var parentLi = this.parentElement;
                if (parentLi && parentLi.classList.contains('nav-dropdown')) return;
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
                // Fermer aussi le dropdown si ouvert
                if (navDropdown) navDropdown.classList.remove('open');
            });
        });
    }

    // ========================================
    // DROPDOWN EXPERTISE dans nav overlay
    // ========================================
    var navDropdown = document.getElementById('navDropdown');
    if (navDropdown) {
        var dropdownLink = navDropdown.querySelector(':scope > a');
        dropdownLink.addEventListener('click', function (e) {
            e.preventDefault();
            navDropdown.classList.toggle('open');
        });
    }

    // ========================================
    // FAQ ACCORDION
    // ========================================
    var faqQuestions = document.querySelectorAll('.faq-question');
    if (faqQuestions.length > 0) {
        faqQuestions.forEach(function (btn) {
            btn.addEventListener('click', function () {
                var item = this.parentElement;
                var isOpen = item.classList.contains('open');
                // Fermer tous les autres
                document.querySelectorAll('.faq-item.open').forEach(function (el) {
                    el.classList.remove('open');
                });
                if (!isOpen) {
                    item.classList.add('open');
                }
            });
        });
    }

    // ========================================
    // ANIMATIONS AU SCROLL (Intersection Observer)
    // ========================================
    const fadeElements = document.querySelectorAll('.fade-in');

    if ('IntersectionObserver' in window) {
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -60px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        fadeElements.forEach(function (el) {
            observer.observe(el);
        });
    } else {
        // Fallback pour anciens navigateurs
        fadeElements.forEach(function (el) {
            el.classList.add('visible');
        });
    }

    // ========================================
    // FILETS ANIMÉS (line-reveal)
    // ========================================
    const lineElements = document.querySelectorAll('.line-reveal');

    if (lineElements.length > 0 && 'IntersectionObserver' in window) {
        const lineObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    lineObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        lineElements.forEach(function (el) {
            lineObserver.observe(el);
        });
    }

    // ========================================
    // SMOOTH SCROLL pour ancres internes
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;

            var target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ========================================
    // SCROLL PROGRESS INDICATOR
    // ========================================
    var scrollDot = document.getElementById('scrollDot');

    if (scrollDot) {
        function updateScrollProgress() {
            var scrollTop = window.scrollY;
            var docHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (docHeight > 0) {
                var scrollPercent = (scrollTop / docHeight) * 100;
                scrollDot.style.top = scrollPercent + '%';
            }
        }

        window.addEventListener('scroll', updateScrollProgress);
        updateScrollProgress();
    }

    // ========================================
    // COMPTEUR ANIMÉ — Chiffres clés
    // ========================================
    var countElements = document.querySelectorAll('[data-count]');

    if (countElements.length > 0 && 'IntersectionObserver' in window) {
        function animateCount(el) {
            var target = parseInt(el.getAttribute('data-count'), 10);
            var suffix = el.getAttribute('data-suffix') || '';
            var duration = 2000;
            var start = 0;
            var startTime = null;

            function easeOut(t) {
                return 1 - Math.pow(1 - t, 3);
            }

            function step(timestamp) {
                if (!startTime) startTime = timestamp;
                var progress = Math.min((timestamp - startTime) / duration, 1);
                var current = Math.round(easeOut(progress) * target);
                el.textContent = current + suffix;
                if (progress < 1) {
                    requestAnimationFrame(step);
                }
            }

            requestAnimationFrame(step);
        }

        var countObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animateCount(entry.target);
                    countObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        countElements.forEach(function (el) {
            countObserver.observe(el);
        });
    }

    // ========================================
    // ROUE DE NAVIGATION FIXE (EXPERTISE)
    // ========================================
    var wheelTrack = document.getElementById('wheelTrack');
    var wheelEl = document.getElementById('prestaWheel');
    var prestaCats = document.querySelectorAll('.presta-category');
    var wheelItems = document.querySelectorAll('.presta-wheel-item');

    if (wheelTrack && wheelEl && prestaCats.length > 0) {

        function getItemHeight() {
            return window.innerWidth <= 1024 ? 52 : 62;
        }

        function updateWheel() {
            var currentId = '';
            prestaCats.forEach(function (cat) {
                var rect = cat.getBoundingClientRect();
                if (rect.top <= window.innerHeight / 2) currentId = cat.id;
            });
            if (!currentId && prestaCats.length) currentId = prestaCats[0].id;

            wheelItems.forEach(function (item) {
                item.classList.toggle('active', item.dataset.cat === currentId);
            });

            var idx = Array.from(wheelItems).findIndex(function (i) {
                return i.dataset.cat === currentId;
            });
            if (idx !== -1) {
                var itemH = getItemHeight();
                var windowH = wheelEl.offsetHeight;
                var offset = (windowH / 2) - (idx * itemH) - (itemH / 2);
                wheelTrack.style.transform = 'translateY(' + offset + 'px)';
            }
        }

        window.addEventListener('scroll', updateWheel);
        window.addEventListener('resize', updateWheel);
        updateWheel();
    }

});
