document.addEventListener("DOMContentLoaded", () => {
    // Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // ==========================================
    // 1. LOADER SYSTEM
    // ==========================================
    const loader = document.getElementById("loader");
    const loaderCounter = document.querySelector(".loader-counter");
    const loaderBarFill = document.querySelector(".loader-bar-fill");
    let count = 0;

    const counterInterval = setInterval(() => {
        count += Math.floor(Math.random() * 15) + 5;
        if (count >= 100) {
            count = 100;
            clearInterval(counterInterval);
            setTimeout(() => {
                loader.classList.add("loaded");
                initAnimations(); // Start animations once loader is gone
            }, 500);
        }
        loaderCounter.textContent = count;
        loaderBarFill.style.width = count + "%";
    }, 80);

    // ==========================================
    // 2. MAGNETIC CUSTOM CURSOR & HOVER STATE
    // ==========================================
    const cursorDot = document.querySelector(".cursor-dot");
    const cursorOutline = document.querySelector(".cursor-outline");
    const cursorLabel = document.querySelector(".cursor-label");
    let mouse = { x: -100, y: -100 };

    window.addEventListener("mousemove", (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        
        // Instant update for dot
        cursorDot.style.left = `${mouse.x}px`;
        cursorDot.style.top = `${mouse.y}px`;
    });

    // Outline follows with delay
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

    // Custom cursor labels and hover scaling
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

    // ==========================================
    // 3. NAVIGATION PILL SCROLL & MOBILE MENU
    // ==========================================
    const mainNav = document.getElementById("mainNav");
    const navBurger = document.getElementById("navBurger");
    const mobileMenu = document.getElementById("mobileMenu");
    let lastScrollY = window.scrollY;

    // Show/hide nav pill on scroll
    window.addEventListener("scroll", () => {
        if (window.scrollY > lastScrollY && window.scrollY > 200) {
            mainNav.style.top = "-100px"; // Hide on scroll down
        } else {
            mainNav.style.top = "1.5rem"; // Show on scroll up
        }
        lastScrollY = window.scrollY;

        // Scroll Progress Bar
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        document.querySelector(".scroll-progress").style.width = scrolled + "%";
    });

    // Mobile menu toggle
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

    // Active Section Tracker
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-link");

    window.addEventListener("scroll", () => {
        let current = "";
        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - 300) {
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
            speed = 2000; // Pause at end of text
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            speed = 500; // Pause before typing next
        }

        setTimeout(typeRole, speed);
    }
    if (heroRoleEl) {
        typeRole();
    }

    // ==========================================
    // 5. 3D PARTICLE HERO CANVAS
    // ==========================================
    const canvas = document.getElementById("particleCanvas");
    if (canvas) {
        const ctx = canvas.getContext("2d");
        let particlesArray = [];
        const maxParticles = 60;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        window.addEventListener("resize", () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1;
                this.speedX = Math.random() * 0.4 - 0.2;
                this.speedY = Math.random() * 0.4 - 0.2;
                this.baseX = this.x;
                this.baseY = this.y;
                this.density = Math.random() * 20 + 5;
            }
            update() {
                // Distance from mouse
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                
                // Push away from mouse
                if (distance < 120) {
                    let forceDirectionX = dx / distance;
                    let forceDirectionY = dy / distance;
                    let force = (120 - distance) / 120;
                    let directionX = forceDirectionX * force * this.density;
                    let directionY = forceDirectionY * force * this.density;
                    this.x -= directionX;
                    this.y -= directionY;
                } else {
                    if (this.x !== this.baseX) {
                        this.x -= (this.x - this.baseX) * 0.05;
                    }
                    if (this.y !== this.baseY) {
                        this.y -= (this.y - this.baseY) * 0.05;
                    }
                }

                this.x += this.speedX;
                this.y += this.speedY;

                // Boundary wrap
                if (this.x < 0 || this.x > canvas.width) this.speedX = -this.speedX;
                if (this.y < 0 || this.y > canvas.height) this.speedY = -this.speedY;
            }
            draw() {
                ctx.fillStyle = "rgba(212, 175, 55, 0.4)";
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fill();
            }
        }

        function initParticles() {
            particlesArray = [];
            for (let i = 0; i < maxParticles; i++) {
                particlesArray.push(new Particle());
            }
        }
        initParticles();

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
                particlesArray[i].draw();
            }
            // Connect particles
            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a; b < particlesArray.length; b++) {
                    let dx = particlesArray[a].x - particlesArray[b].x;
                    let dy = particlesArray[a].y - particlesArray[b].y;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 150) {
                        ctx.strokeStyle = `rgba(212, 175, 55, ${0.1 - (distance / 150) * 0.1})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }

    // ==========================================
    // 6. GSAP SCROLLTRIGGER ANIMATIONS
    // ==========================================
    function initAnimations() {
        // Hero entrance
        if (document.querySelector(".hero-greeting")) {
            const tlHero = gsap.timeline();
            tlHero.from(".hero-greeting", { opacity: 0, y: 20, duration: 0.6 })
                  .from(".name-line", { opacity: 0, y: 50, stagger: 0.2, duration: 0.8, ease: "power4.out" }, "-=0.3")
                  .from(".hero-role-wrapper", { opacity: 0, x: -20, duration: 0.5 }, "-=0.4")
                  .from(".hero-desc", { opacity: 0, y: 15, duration: 0.6 }, "-=0.3")
                  .from(".hero-cta", { opacity: 0, y: 15, duration: 0.6 }, "-=0.3")
                  .from(".scroll-hint", { opacity: 0, y: 10, duration: 0.5 }, "-=0.2");
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
                sectionTimeline.from(".about-photo-wrap", { opacity: 0, scale: 0.95, duration: 0.8 }, "-=0.4")
                               .from(".about-desc", { opacity: 0, y: 20, duration: 0.6 }, "-=0.6")
                               .from(".social-link", { opacity: 0, y: 15, stagger: 0.1, duration: 0.4 }, "-=0.4")
                               .from(".tag", { opacity: 0, scale: 0.8, stagger: 0.05, duration: 0.4 }, "-=0.3");
            }

            // Experience specifics
            if (section.id === "experience") {
                // Line growth animation
                gsap.from(".timeline-line-fill", {
                    height: "0%",
                    scrollTrigger: {
                        trigger: ".timeline-v2",
                        start: "top 60%",
                        end: "bottom 60%",
                        scrub: true
                    }
                });

                // Items entrance
                document.querySelectorAll(".tl-item").forEach((item) => {
                    gsap.from(item.querySelector(".tl-card"), {
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
                });
            }

            // Tech specifics
            if (section.id === "tech") {
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

            // Projects specifics
            if (section.id === "projects") {
                document.querySelectorAll(".proj-card").forEach((proj) => {
                    const img = proj.querySelector(".proj-image");
                    const info = proj.querySelector(".proj-info");
                    
                    gsap.from(img, {
                        opacity: 0,
                        scale: 0.95,
                        duration: 0.8,
                        scrollTrigger: {
                            trigger: proj,
                            start: "top 75%"
                        }
                    });
                    
                    gsap.from(info, {
                        opacity: 0,
                        y: 30,
                        duration: 0.8,
                        scrollTrigger: {
                            trigger: proj,
                            start: "top 75%"
                        }
                    });
                });
            }
        });
    }

    // ==========================================
    // 7. CONTACT FORM SUBMISSION
    // ==========================================
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const message = document.getElementById("message").value.trim();

            if (!name || !email || !message) {
                alert("Please fill out all required fields.");
                return;
            }

            console.log("Form Submitted Successfully:", { name, email, message });
            alert(`Thank you, ${name}! Your message has been received.`);
            contactForm.reset();
        });
    }
});
