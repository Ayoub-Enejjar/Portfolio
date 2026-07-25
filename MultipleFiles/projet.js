document.addEventListener("DOMContentLoaded", () => {
    // Prevent automatic browser hash jump on load so GSAP ScrollTrigger measures from top (0,0)
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    if (window.location.hash) {
        window.scrollTo(0, 0);
    }

    // Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // ==========================================
    // EmailJS Initialization (Safeguarded)
    // ==========================================
    if (typeof emailjs !== "undefined") {
        emailjs.init("5LifZfCLdaCWv_HDg");
    } else {
        console.warn("EmailJS SDK is not loaded or has been blocked.");
    }

    // Calculate exact document scroll top Y position for any section (accurate with GSAP pin-spacers)
    function getSectionTop(el) {
        if (!el) return 0;
        
        const st = ScrollTrigger.getAll().find(s => s.trigger === el || s.pin === el);
        if (st && typeof st.start === 'number') {
            if (st.vars.pin || st.vars.start === "top top") {
                return st.start;
            }
            // Convert start trigger position (e.g. "top 80%") to exact top of viewport ("top top")
            return st.start + (window.innerHeight * 0.8);
        }
        
        let top = 0;
        let current = el;
        if (current.parentElement && current.parentElement.classList.contains('pin-spacer')) {
            current = current.parentElement;
        }
        while (current && current !== document.body) {
            top += current.offsetTop || 0;
            current = current.offsetParent;
        }
        return top;
    }

    // Helper: Scroll to exact top of section
    function scrollToSection(targetId, smooth = true) {
        const targetEl = document.querySelector(targetId);
        if (!targetEl) return;
        
        const targetY = getSectionTop(targetEl);

        window.scrollTo({
            top: targetY,
            behavior: smooth ? "smooth" : "auto"
        });
    }

    // Intercept clicks on internal section anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId && targetId !== "#" && document.querySelector(targetId)) {
                e.preventDefault();
                scrollToSection(targetId, true);
                history.pushState(null, "", targetId);
            }
        });
    });

    // ==========================================
    // 1. LOADER SYSTEM
    // ==========================================
    const loader = document.getElementById("loader");
    const loaderCounter = document.querySelector(".loader-counter");
    const loaderBarFill = document.querySelector(".loader-bar-fill");

    if (loader) {
        let count = 0;
        const counterInterval = setInterval(() => {
            count += Math.floor(Math.random() * 15) + 15;
            if (count >= 100) {
                count = 100;
                clearInterval(counterInterval);
                setTimeout(() => {
                    loader.classList.add("loaded");
                    initAnimations(); // Start animations once loader is gone
                }, 250);
            }
            if (loaderCounter) loaderCounter.textContent = count;
            if (loaderBarFill) loaderBarFill.style.width = count + "%";
        }, 30);
    } else {
        initAnimations();
    }

    // ==========================================
    // 2. MAGNETIC CUSTOM CURSOR & HOVER STATE
    // ==========================================
    const cursorDot = document.querySelector(".cursor-dot");
    const cursorOutline = document.querySelector(".cursor-outline");
    const cursorLabel = document.querySelector(".cursor-label");
    let mouse = { x: -100, y: -100 };

    if (cursorDot && cursorOutline) {
        window.addEventListener("mousemove", (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            
            cursorDot.style.left = `${mouse.x}px`;
            cursorDot.style.top = `${mouse.y}px`;
        });

        gsap.to({}, {
            duration: 0.016,
            repeat: -1,
            onRepeat: () => {
                const currentX = parseFloat(cursorOutline.style.left) || 0;
                const currentY = parseFloat(cursorOutline.style.top) || 0;
                const nextX = currentX + (mouse.x - currentX) * 0.15;
                const nextY = currentY + (mouse.y - currentY) * 0.15;
                cursorOutline.style.left = `${nextX}px`;
                cursorOutline.style.top = `${nextY}px`;
            }
        });
    }

    if (cursorLabel) {
        document.querySelectorAll("a, button, .tech-category-card, .service-card, .tl-card, .marquee-img").forEach((el) => {
            el.addEventListener("mouseenter", () => {
                document.body.classList.add("hovering");
                if (el.tagName === "A" && el.getAttribute("href") && el.getAttribute("href").includes(".html")) {
                    cursorLabel.textContent = "View";
                } else if (el.classList.contains("marquee-img")) {
                    cursorLabel.textContent = "Zoom";
                } else {
                    cursorLabel.textContent = "Click";
                }
            });
            el.addEventListener("mouseleave", () => {
                document.body.classList.remove("hovering");
            });
        });
    }

    // ==========================================
    // 3. NAVIGATION PILL SCROLL & MOBILE MENU
    // ==========================================
    const mainNav = document.getElementById("mainNav");
    const navBurger = document.getElementById("navBurger");
    const mobileMenu = document.getElementById("mobileMenu");
    const scrollProgress = document.querySelector(".scroll-progress");
    let lastScrollY = window.scrollY;

    window.addEventListener("scroll", () => {
        if (mainNav) {
            if (window.scrollY > lastScrollY && window.scrollY > 200) {
                mainNav.style.top = "-100px";
            } else {
                mainNav.style.top = "1.5rem";
            }
        }
        lastScrollY = window.scrollY;

        if (scrollProgress) {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
            scrollProgress.style.width = scrolled + "%";
        }
    });

    if (navBurger && mobileMenu) {
        navBurger.addEventListener("click", () => {
            navBurger.classList.toggle("open");
            mobileMenu.classList.toggle("open");
        });

        document.querySelectorAll(".mobile-link").forEach((link) => {
            link.addEventListener("click", () => {
                navBurger.classList.remove("open");
                mobileMenu.classList.remove("open");
            });
        });
    }

    // Active Section Tracker (Using GSAP section tops)
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link");

    if (sections.length > 0 && navLinks.length > 0) {
        window.addEventListener("scroll", () => {
            let current = "";
            const scrollY = window.scrollY;

            sections.forEach((section) => {
                const sectionTop = getSectionTop(section);
                if (scrollY >= sectionTop - 200) {
                    current = section.getAttribute("id");
                }
            });

            navLinks.forEach((link) => {
                link.classList.remove("active");
                if (link.getAttribute("data-section") === current) {
                    link.classList.add("active");
                }
            });
        });
    }

    // ==========================================
    // 4. TYPEWRITER EFFECT (HERO SUBTITLE)
    // ==========================================
    const roles = ["Fullstack Developer", "Creative Designer", "Business Strategist"];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const heroRoleEl = document.getElementById("heroRole");

    function typeRole() {
        if (!heroRoleEl) return;
        const currentRole = roles[roleIndex];
        if (isDeleting) {
            charIndex--;
        } else {
            charIndex++;
        }

        heroRoleEl.textContent = currentRole.substring(0, charIndex);

        let speed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentRole.length) {
            speed = 2000;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            speed = 500;
        }

        setTimeout(typeRole, speed);
    }
    if (heroRoleEl) {
        typeRole();
    }

    // ==========================================
    // 6. GSAP SCROLLTRIGGER ANIMATIONS
    // ==========================================
    let animationsInitialized = false;

    function initAnimations() {
        if (animationsInitialized) return;
        animationsInitialized = true;

        // Hero entrance
        if (document.querySelector(".hero-greeting")) {
            const tlHero = gsap.timeline();
            if (document.querySelector(".hero-greeting")) tlHero.from(".hero-greeting", { opacity: 0, y: 20, duration: 0.6 });
            if (document.querySelector(".name-line")) tlHero.from(".name-line", { opacity: 0, y: 50, stagger: 0.2, duration: 0.8, ease: "power4.out" }, "-=0.3");
            if (document.querySelector(".hero-role-wrapper")) tlHero.from(".hero-role-wrapper", { opacity: 0, x: -20, duration: 0.5 }, "-=0.4");
            if (document.querySelector(".hero-desc")) tlHero.from(".hero-desc", { opacity: 0, y: 15, duration: 0.6 }, "-=0.3");
            if (document.querySelector(".hero-cta")) tlHero.from(".hero-cta", { opacity: 0, y: 15, duration: 0.6 }, "-=0.3");
            if (document.querySelector(".scroll-hint")) tlHero.from(".scroll-hint", { opacity: 0, y: 10, duration: 0.5 }, "-=0.2");
        }

        // Staggered Sections fade-ins
        document.querySelectorAll(".section-pad").forEach((section) => {
            const heading = section.querySelector(".section-heading");
            const label = section.querySelector(".section-label");

            const sectionTimeline = gsap.timeline({
                scrollTrigger: {
                    trigger: section,
                    start: "top 80%",
                    toggleActions: "play none none none"
                }
            });

            if (label) sectionTimeline.from(label, { opacity: 0, y: 20, duration: 0.4 });
            if (heading) sectionTimeline.from(heading, { opacity: 0, y: 30, duration: 0.6, ease: "power3.out" }, "-=0.2");

            // About specifics
            if (section.id === "about") {
                if (section.querySelector(".about-photo-wrap")) sectionTimeline.from(".about-photo-wrap", { opacity: 0, scale: 0.95, duration: 0.8 }, "-=0.4");
                if (section.querySelector(".about-desc")) sectionTimeline.from(".about-desc", { opacity: 0, y: 20, duration: 0.6 }, "-=0.6");
                if (section.querySelector(".social-link")) sectionTimeline.from(".social-link", { opacity: 0, y: 15, stagger: 0.1, duration: 0.4 }, "-=0.4");
                if (section.querySelector(".tag")) sectionTimeline.from(".tag", { opacity: 0, scale: 0.8, stagger: 0.05, duration: 0.4 }, "-=0.3");
            }

            // Experience specifics
            if (section.id === "experience") {
                if (document.querySelector(".timeline-line-fill")) {
                    gsap.from(".timeline-line-fill", {
                        height: "0%",
                        scrollTrigger: {
                            trigger: ".timeline-v2",
                            start: "top 60%",
                            end: "bottom 60%",
                            scrub: true
                        }
                    });
                }

                document.querySelectorAll(".tl-item").forEach((item) => {
                    const card = item.querySelector(".tl-card");
                    if (card) {
                        gsap.from(card, {
                            opacity: 0,
                            x: 50,
                            duration: 0.8,
                            scrollTrigger: {
                                trigger: item,
                                start: "top 80%",
                                toggleActions: "play none none none",
                                onEnter: () => item.classList.add("active")
                            }
                        });
                    }
                });
            }

            // Tech specifics
            if (section.id === "tech") {
                if (document.querySelector(".tech-category-card")) {
                    gsap.from(".tech-category-card", {
                        opacity: 0,
                        y: 40,
                        stagger: 0.15,
                        duration: 0.8,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: ".tech-categories",
                            start: "top 80%"
                        }
                    });
                }
            }
        });

        // Projects specifics (yasio.dev Style Horizontal Scroll)
        const horizontalSection = document.getElementById("projects");
        if (horizontalSection) {
            const horizontalContent = horizontalSection.querySelector(".horizontal-content");
            const bgText = horizontalSection.querySelector(".horizontal-bg-text");

            if (horizontalContent) {
                ScrollTrigger.matchMedia({
                    // Desktop: >= 1024px
                    "(min-width: 1024px)": function() {
                        const getScrollAmount = () => {
                            let contentWidth = horizontalContent.scrollWidth;
                            let viewportWidth = window.innerWidth;
                            return -(contentWidth - viewportWidth);
                        };

                        gsap.to(horizontalContent, {
                            x: getScrollAmount,
                            ease: "none",
                            scrollTrigger: {
                                trigger: horizontalSection,
                                start: "top top",
                                end: () => `+=${horizontalContent.scrollWidth - window.innerWidth}`,
                                pin: true,
                                scrub: 1,
                                invalidateOnRefresh: true,
                                anticipatePin: 1
                            }
                        });

                        if (bgText) {
                            gsap.to(bgText, {
                                x: -200,
                                ease: "none",
                                scrollTrigger: {
                                    trigger: horizontalSection,
                                    start: "top top",
                                    end: () => `+=${horizontalContent.scrollWidth - window.innerWidth}`,
                                    scrub: 1
                                }
                            });
                        }

                        if (document.querySelector(".h-card")) {
                            gsap.from(".h-card", {
                                opacity: 0,
                                x: 100,
                                stagger: 0.1,
                                duration: 0.8,
                                ease: "power2.out",
                                scrollTrigger: {
                                    trigger: horizontalSection,
                                    start: "top 20%",
                                    end: "top top",
                                    scrub: true
                                }
                            });
                        }
                    },
                    
                    // Mobile & Tablet: < 1024px
                    "(max-width: 1023px)": function() {
                        document.querySelectorAll(".h-card").forEach((card) => {
                            gsap.from(card, {
                                opacity: 0,
                                y: 50,
                                duration: 0.8,
                                ease: "power2.out",
                                scrollTrigger: {
                                    trigger: card,
                                    start: "top 80%"
                                }
                            });
                        });
                    }
                });
            }
        }

        // Refresh ScrollTrigger to recalculate layout dimensions
        ScrollTrigger.refresh();

        // Handle target hash navigation after loader hides & animations init
        if (window.location.hash && document.querySelector(window.location.hash)) {
            setTimeout(() => {
                scrollToSection(window.location.hash, true);
            }, 150);
        }
    }

    // Refresh ScrollTrigger when images fully load
    window.addEventListener("load", () => {
        ScrollTrigger.refresh();
    });

    // ==========================================
    // 7. CONTACT FORM SUBMISSION (EmailJS)
    // ==========================================
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        const submitBtn = document.getElementById("submitBtn");
        const submitBtnText = document.getElementById("submitBtnText");
        const formToast = document.getElementById("formToast");

        function showToast(type, message) {
            if (formToast) {
                formToast.className = `form-toast ${type}`;
                formToast.textContent = message;
                setTimeout(() => {
                    formToast.className = "form-toast";
                }, 6000);
            }
        }

        contactForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const formTime = document.getElementById("formTime");
            if (formTime) {
                formTime.value = new Date().toLocaleString("en-GB", {
                    weekday: "long", year: "numeric", month: "long",
                    day: "numeric", hour: "2-digit", minute: "2-digit"
                });
            }

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.classList.add("sending");
                if (submitBtnText) submitBtnText.textContent = "Sending...";
            }

            try {
                if (typeof emailjs === "undefined") {
                    throw new Error("EmailJS SDK is not loaded/blocked.");
                }

                await emailjs.sendForm(
                    "service_b9gatkm",
                    "template_qzgavch",
                    contactForm
                );

                showToast("success", "✓ Message sent! I'll get back to you soon.");
                contactForm.reset();
            } catch (error) {
                console.error("EmailJS error:", error);
                showToast("error", "✗ Something went wrong. Please email me directly at a.enejjar2732@uca.ac.ma");
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.classList.remove("sending");
                    if (submitBtnText) submitBtnText.textContent = "Send Message";
                }
            }
        });
    }
});
