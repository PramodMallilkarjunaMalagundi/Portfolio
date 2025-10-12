document.addEventListener('DOMContentLoaded', function () {

    // --- NEW THEME CHANGER LOGIC ---
    const themeToggles = document.querySelectorAll('.theme-toggle-button');
    const doc = document.documentElement;
    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';

    // Set initial theme from localStorage
    doc.setAttribute('data-theme', savedTheme);

    const toggleTheme = () => {
        const currentTheme = doc.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        doc.setAttribute('data-theme', newTheme);
        localStorage.setItem('portfolio-theme', newTheme);
    };

    // Add click event to all toggle buttons
    themeToggles.forEach(toggle => {
        toggle.addEventListener('click', toggleTheme);
    });
    // --- END NEW THEME CHANGER LOGIC ---

    // --- STARFIELD CANVAS ---
    const canvas = document.getElementById('background-canvas');
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const numStars = 200;
    const stars = [];
    for (let i = 0; i < numStars; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 1.2,
            alpha: Math.random(),
            twinkle: Math.random() < 0.5
        });
    }

    function drawStars() {
        if (doc.getAttribute('data-theme') !== 'dark') {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            animationFrameId = requestAnimationFrame(drawStars);
            return;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        stars.forEach(star => {
            if (star.twinkle) {
                star.alpha += (Math.random() - 0.5) * 0.05;
                star.alpha = Math.max(0.1, Math.min(1, star.alpha));
            }
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, 2 * Math.PI);
            ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
            ctx.fill();
        });
        animationFrameId = requestAnimationFrame(drawStars);
    }

    drawStars();

    // --- TYPED.JS ---
    if (document.querySelector('.typed')) {
        new Typed('.typed', {
            strings: ["Full Stack Developer", "Web Designer", "Tech Enthusiast"],
            typeSpeed: 70,
            backSpeed: 50,
            loop: true
        });
    }

    // --- MOBILE NAVIGATION ---
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileNavClose = document.querySelector('.mobile-nav-close');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');

    hamburger.addEventListener('click', () => mobileNav.classList.add('active'));
    mobileNavClose.addEventListener('click', () => mobileNav.classList.remove('active'));
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => mobileNav.classList.remove('active'));
    });

    // --- SCROLL OBSERVER FOR ACTIVE NAV LINKS ---
    const sections = document.querySelectorAll('main section');
    const navLinks = document.querySelectorAll('.nav-links a');

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (`#${entry.target.id}` === link.getAttribute('href')) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { rootMargin: "-40% 0px -40% 0px" });

    sections.forEach(section => {
        if (section.id) navObserver.observe(section);
    });

    // --- EMAILJS INTEGRATION & NOTIFICATION ---
    const notificationToast = document.getElementById('notification-toast');

    const showToast = (message) => {
        notificationToast.innerText = message;
        notificationToast.classList.add('show');
        setTimeout(() => {
            notificationToast.classList.remove('show');
        }, 3000); // Hide after 3 seconds
    };

    (function() {
        emailjs.init('TcS3eBiJiYZEpZxW2'); 
    })();

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const serviceID = 'service_vb861mx';
            const templateID = 'template_6n42u3r';

            emailjs.sendForm(serviceID, templateID, this)
                .then(() => {
                    showToast('Message sent successfully!');
                    contactForm.reset();
                }, (err) => {
                    showToast('Failed to send message.');
                    console.error('EmailJS Error:', JSON.stringify(err));
                });
        });
    }

});