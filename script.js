/* ============================================================
   SCRIPT.JS — Shruthi S M Portfolio
   ============================================================ */

/* ──────────────────────────────────────────
   UTILITY: safely query DOM elements
   ────────────────────────────────────────── */
const q  = (s, ctx = document) => ctx.querySelector(s);
const qa = (s, ctx = document) => [...ctx.querySelectorAll(s)];

/* ──────────────────────────────────────────
   1. HEADER SCROLL EFFECT
   ────────────────────────────────────────── */
const header = q('#main-header');
let lastY = 0;
window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 80) {
        header.style.boxShadow = '0 2px 30px rgba(0,0,0,0.4)';
    } else {
        header.style.boxShadow = 'none';
    }
    lastY = y;
}, { passive: true });

/* ──────────────────────────────────────────
   2. THEME TOGGLE
   ────────────────────────────────────────── */
const themeToggle = q('#themeToggle');
const moonIcon    = q('#moon-icon');
const sunIcon     = q('#sun-icon');
const savedTheme  = localStorage.getItem('pf-theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);
applyThemeIcons(savedTheme);

themeToggle.addEventListener('click', () => {
    const curr = document.documentElement.getAttribute('data-theme');
    const next = curr === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('pf-theme', next);
    applyThemeIcons(next);
});

function applyThemeIcons(theme) {
    if (theme === 'dark') {
        moonIcon.style.display = 'inline'; sunIcon.style.display = 'none';
    } else {
        moonIcon.style.display = 'none'; sunIcon.style.display = 'inline';
    }
}

/* ──────────────────────────────────────────
   3. MOBILE HAMBURGER + DRAWER
   ────────────────────────────────────────── */
const hamburger   = q('#hamburger');
const mobileDrawer = q('#mobileDrawer');

hamburger.addEventListener('click', () => {
    const isOpen = mobileDrawer.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
});

qa('.mob-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        hamburger.classList.remove('open');
        document.body.style.overflow = '';
    });
});

/* Close drawer on outside click */
document.addEventListener('click', e => {
    if (!mobileDrawer.contains(e.target) && !hamburger.contains(e.target)) {
        mobileDrawer.classList.remove('open');
        hamburger.classList.remove('open');
        document.body.style.overflow = '';
    }
});

/* ──────────────────────────────────────────
   4. SMOOTH ACTIVE NAV LINK (IntersectionObserver)
   ────────────────────────────────────────── */
const navLinks = qa('.nav-link');
const sections = qa('section[id]');
const obsOpts  = { root: null, rootMargin: '-45% 0px -45% 0px', threshold: 0 };

const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinks.forEach(a => a.classList.remove('nav-active'));
            const active = q(`.nav-link[href="#${entry.target.id}"]`);
            if (active) active.classList.add('nav-active');
        }
    });
}, obsOpts);
sections.forEach(s => navObserver.observe(s));

/* ──────────────────────────────────────────
   5. SCROLL REVEAL
   ────────────────────────────────────────── */
const revealEls = qa('.reveal');
const revObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in-view'); revObs.unobserve(e.target); }
    });
}, { threshold: 0.08 });
revealEls.forEach(el => revObs.observe(el));

/* ──────────────────────────────────────────
   6. COUNTER ANIMATION (hero metrics)
   ────────────────────────────────────────── */
function animateCount(el) {
    const target  = parseFloat(el.dataset.count);
    const dec     = parseInt(el.dataset.dec, 10);
    const dur     = 1800;
    const start   = performance.now();
    function step(now) {
        const progress = Math.min((now - start) / dur, 1);
        // ease out cubic
        const ease = 1 - Math.pow(1 - progress, 3);
        const val  = target * ease;
        el.textContent = dec > 0 ? val.toFixed(dec) : Math.round(val).toString();
        if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}

const counterEls = qa('.mpill-val');
const counterObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) { animateCount(e.target); counterObs.unobserve(e.target); }
    });
}, { threshold: 0.3 });
counterEls.forEach(el => counterObs.observe(el));

/* ──────────────────────────────────────────
   7. BACK TO TOP
   ────────────────────────────────────────── */
const backToTop = q('#backToTop');
window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 500);
}, { passive: true });
backToTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ──────────────────────────────────────────
   8. PROJECT MODAL
   ────────────────────────────────────────── */
const modalOverlay = q('#projModal');
const modalContent = q('#modalContent');
const modalClose   = q('#modalClose');

const projData = {
    'ibm-payroll': {
        category: 'IBM Internship · MERN Stack',
        title: 'Payroll Management System',
        img: 'assets/project5.png',
        overview: 'An enterprise-grade payroll automation platform built during the IBM internship under the Naan Mudhalvan program. Designed to manage employee records, compute salaries, handle deductions, and enforce role-based access control.',
        impact: ['Full JWT-secured authentication for HR admin, Manager, and Employee roles', 'Automated salary computation with configurable deduction rules', 'Real-time payroll ledger with monthly and annual report generation', 'RESTful API design following OpenAPI conventions'],
        stack: 'React.js · Node.js · Express.js · MongoDB · JWT · Bcrypt',
        github: 'https://github.com/Shruthisivaraman/Payroll-authentication-organization-setup',
    },
    'aqua-pure': {
        category: 'MERN Stack · Business Platform',
        title: 'Aqua Pure Business Website',
        img: 'assets/project1.png',
        overview: 'A commercially deployed MERN stack platform for a water purification business. Offers customers a seamless portal for browsing products, raising enquiries, and reading reviews — while administrators manage inventory and leads through a dedicated console.',
        impact: ['Full-featured admin console with CRUD operations for products and enquiries', 'Customer review system with star ratings and moderation', 'Service catalogue with category filtering and search functionality', 'Responsive mobile-first design with contact form email integration'],
        stack: 'React.js · Node.js · Express.js · MongoDB · REST API',
        github: 'https://github.com/Shruthisivaraman/aqua-pure-system-business-website',
    },
    'habit-tracker': {
        category: 'AI + MERN · Productivity',
        title: 'AI-Powered Habit Tracker',
        img: 'assets/project2.png',
        overview: 'A smart productivity dashboard with a built-in rule-based AI engine that learns from user-logged stress levels, sleep hours, and task completion rates to dynamically adjust daily habit goals — making the system genuinely adaptive.',
        impact: ['JWT-secured multi-user authentication with persistent sessions', 'Rule-based AI heuristics recalibrate targets based on user wellness inputs', 'Visual progress streaks and habit analytics charts', 'Dark/light theme, mobile-responsive UI built in React'],
        stack: 'React.js · Node.js · MongoDB · JWT · AI Heuristics · CSS Grid',
        github: 'https://github.com/Shruthisivaraman/HABIT-TRACKERAI',
    },
    'accident': {
        category: 'AI Safety System · Real-Time',
        title: 'Road Accident Prevention System',
        img: 'assets/project3.png',
        overview: 'A real-time AI-powered road safety dashboard that ingests live vehicle speed sensor data, detects dangerous velocity thresholds, and triggers multi-modal alerts — visual warnings on the dashboard and audio signals — to prevent accidents before they happen.',
        impact: ['Real-time speed ingestion via RESTful sensor APIs', 'AI threshold detection engine with configurable zone-based speed limits', 'Visual + audio alert system with alert log history in MongoDB', 'Responsive traffic monitoring UI with live update intervals'],
        stack: 'Node.js · Express.js · MongoDB · REST APIs · JavaScript AI Logic',
        github: 'https://github.com/Shruthisivaraman/AI-Road-Accident-Prevention-System',
    },
    'grocery': {
        category: 'Frontend Engineering',
        title: 'Grocery Store Frontend',
        img: 'assets/project4.png',
        overview: 'A zero-dependency, lightning-fast grocery e-commerce frontend built entirely in vanilla HTML, CSS, and JavaScript. Demonstrates advanced CSS Grid and Flexbox layouts alongside a custom-built animated cart panel.',
        impact: ['Live product filter by category and price range', 'Animated slide-in cart panel with real-time item count badge', 'Mobile-first responsive grid layout using CSS Grid', 'Optimized performance: no libraries, sub-1s load time'],
        stack: 'HTML5 · CSS3 · CSS Grid · Vanilla JavaScript · Responsive Design',
        github: 'https://github.com/Shruthisivaraman/Grocery-website---Frontend',
    },
};

function openModal(projId) {
    const data = projData[projId];
    if (!data) return;
    modalContent.innerHTML = `
        <img src="${data.img}" alt="${data.title}" class="modal-hero-img" onerror="this.style.display='none'">
        <div class="modal-category">${data.category}</div>
        <h2 class="modal-title">${data.title}</h2>
        <div class="modal-section">Project Overview</div>
        <p class="modal-text">${data.overview}</p>
        <div class="modal-section">Key Deliverables</div>
        <ul class="modal-list">
            ${data.impact.map(i => `<li>${i}</li>`).join('')}
        </ul>
        <div class="modal-section">Technology Stack</div>
        <p class="modal-text" style="font-family:var(--font-mono);font-size:0.82rem;color:var(--accent)">${data.stack}</p>
        <div class="modal-actions">
            <a href="${data.github}" target="_blank" class="cta-primary" style="display:inline-flex">
                <i class="fa-brands fa-github"></i> View Source Code
            </a>
        </div>
    `;
    modalOverlay.classList.add('open');
    modalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modalOverlay.classList.remove('open');
    modalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

qa('.detail-trigger').forEach(btn => {
    btn.addEventListener('click', () => openModal(btn.dataset.proj));
});

/* Open modal when clicking the visual image overlay in sticky panel */
qa('.pf-img-overlay').forEach(overlay => {
    overlay.addEventListener('click', () => {
        const visual = overlay.closest('.project-visual');
        if (visual) {
            const projId = visual.dataset.visual;
            if (projId) openModal(projId);
        }
    });
});

/* Sticky Scroll Visual Tracker */
const scrollCards = qa('.project-scroll-card');
if (scrollCards.length > 0) {
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Deactivate all cards and visuals
                qa('.project-scroll-card').forEach(c => c.classList.remove('active-card'));
                qa('.project-visual').forEach(v => v.classList.remove('active'));

                // Activate current card
                entry.target.classList.add('active-card');

                // Activate corresponding visual
                const projId = entry.target.dataset.proj;
                const targetVisual = q(`.project-visual[data-visual="${projId}"]`);
                if (targetVisual) {
                    targetVisual.classList.add('active');
                }
            }
        });
    }, {
        root: null,
        rootMargin: '-30% 0px -30% 0px', // Triggers when card enters middle 40% of viewport
        threshold: 0.15
    });

    scrollCards.forEach(card => cardObserver.observe(card));
}

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

/* ──────────────────────────────────────────
   9. CONTACT FORM (EmailJS + Gmail Fallback)
   ────────────────────────────────────────── */
const contactForm = q('#contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', e => {
        e.preventDefault();
        const name    = q('#fname').value.trim();
        const email   = q('#femail').value.trim();
        const subject = q('#fsubject').value.trim();
        const msg     = q('#fmsg').value.trim();
        if (!name || !email || !subject || !msg) return;

        // Check if EmailJS has been configured with a user key
        const isEmailJSConfigured = typeof emailjs !== 'undefined' && 
                                   emailjs._init && 
                                   emailjs._init.publicKey && 
                                   emailjs._init.publicKey !== 'YOUR_PUBLIC_KEY';

        if (isEmailJSConfigured) {
            showFormToast('Sending message via EmailJS...');
            
            // Map parameters to email template variables
            const templateParams = {
                from_name: name,
                from_email: email,
                subject: subject,
                message: msg,
                to_name: "Shruthi S M"
            };

            const serviceID = "default_service"; 
            const templateID = "template_contact"; // Change to custom EmailJS Template ID if created

            emailjs.send(serviceID, templateID, templateParams)
                .then(() => {
                    contactForm.reset();
                    showFormToast('Message sent to Shruthi\'s inbox!');
                })
                .catch((err) => {
                    console.error('EmailJS Error:', err);
                    showFormToast('Direct send failed. Opening Gmail...');
                    openGmailCompose(name, email, subject, msg);
                    contactForm.reset();
                });
        } else {
            // Default Fallback: Open prefilled Gmail tab
            openGmailCompose(name, email, subject, msg);
            contactForm.reset();
        }
    });
}

function openGmailCompose(name, email, subject, msg) {
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=shruthisivaraman25@gmail.com&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Hi Shruthi,\n\n${msg}\n\nBest regards,\n${name}\n${email}`)}`;
    window.open(gmailUrl, '_blank');
    showFormToast('Gmail compose opened in a new tab!');
}

function showFormToast(msg) {
    const t = document.createElement('div');
    t.textContent = msg;
    Object.assign(t.style, {
        position: 'fixed', bottom: '90px', right: '28px', zIndex: '3000',
        background: 'linear-gradient(135deg,#39d0f0,#7c6bff)', color: '#fff',
        padding: '12px 22px', borderRadius: '50px', fontSize: '0.88rem',
        fontWeight: '600', boxShadow: '0 8px 24px rgba(57,208,240,0.35)',
        opacity: '0', transform: 'translateY(10px)',
        transition: 'all 0.35s ease'
    });
    document.body.appendChild(t);
    requestAnimationFrame(() => { t.style.opacity = '1'; t.style.transform = 'translateY(0)'; });
    setTimeout(() => {
        t.style.opacity = '0'; t.style.transform = 'translateY(10px)';
        setTimeout(() => t.remove(), 400);
    }, 3500);
}

/* ──────────────────────────────────────────
   10. 3D BUSINESS CARD INTERACTION
   ────────────────────────────────────────── */
const bizCard = q('#bizCard');
if (bizCard) {
    bizCard.addEventListener('mousemove', e => {
        const rect = bizCard.getBoundingClientRect();
        
        // Calculate mouse position relative to card
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Set glow coordinates
        bizCard.style.setProperty('--mx', `${x}px`);
        bizCard.style.setProperty('--my', `${y}px`);
        
        // Calculate rotation angles (max 15 degrees tilt)
        const rotX = -((y - rect.height / 2) / (rect.height / 2)) * 12;
        const rotY = ((x - rect.width / 2) / (rect.width / 2)) * 12;
        
        // Apply transform
        bizCard.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    });
    
    bizCard.addEventListener('mouseleave', () => {
        // Reset tilt and center glow smoothly
        bizCard.style.transform = 'rotateX(0deg) rotateY(0deg)';
    });
}

/* Copy card details to clipboard */
const copyBtn = q('#copyCardDetails');
if (copyBtn) {
    copyBtn.addEventListener('click', () => {
        const textToCopy = `Email: shruthisivaraman25@gmail.com\nWhatsApp: +91 9345718701`;
        
        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                copyBtn.classList.add('copied');
                const btnSpan = copyBtn.querySelector('span');
                const btnIcon = copyBtn.querySelector('i');
                
                // Change icons & text
                btnSpan.textContent = 'Copied!';
                btnIcon.className = 'fa-solid fa-check';
                
                showFormToast('Contact info copied to clipboard!');
                
                // Reset back to original state
                setTimeout(() => {
                    copyBtn.classList.remove('copied');
                    btnSpan.textContent = 'Copy Details';
                    btnIcon.className = 'fa-regular fa-copy';
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy text: ', err);
                showFormToast('Copy failed. Please manually select the email.');
            });
    });
}

/* ──────────────────────────────────────────
   11. NEURAL EXPERIENCE NETWORK SWITCHER
   ────────────────────────────────────────── */
const inputNeurons = qa('.neuron-input');
const outputNeurons = qa('.neuron-output');
const neuralPaths = qa('.neural-path');
const neuralCards = qa('.neural-card');

const networkMappings = {
    'edu': {
        paths: '.path-edu',
        skills: ['.tag-java', '.tag-api', '.tag-ai']
    },
    'intern': {
        paths: '.path-intern',
        skills: ['.tag-mern', '.tag-api', '.tag-soft']
    },
    'sih': {
        paths: '.path-sih',
        skills: ['.tag-mern', '.tag-api', '.tag-soft']
    }
};

inputNeurons.forEach(node => {
    node.addEventListener('click', () => {
        const type = node.dataset.neuron;
        const config = networkMappings[type];
        if (!config) return;

        // 1. Deactivate all input nodes, activate current
        inputNeurons.forEach(n => n.classList.remove('active'));
        node.classList.add('active');

        // 2. Deactivate all paths, activate current paths
        neuralPaths.forEach(p => p.classList.remove('active'));
        qa(config.paths).forEach(p => p.classList.add('active'));

        // 3. Deactivate all output skill nodes, activate current
        outputNeurons.forEach(o => o.classList.remove('active'));
        config.skills.forEach(selector => {
            const el = q(selector);
            if (el) el.classList.add('active');
        });

        // 4. Toggle details cards
        neuralCards.forEach(c => c.classList.remove('active'));
        const targetCard = q(`#card-${type}`);
        if (targetCard) targetCard.classList.add('active');
    });
});

/* ──────────────────────────────────────────
   12. HONEYCOMB SKILL HIVE INTERACTIVITY
   ────────────────────────────────────────── */
const hexCells = qa('.hex-cell');
const hcConsoleText = q('.hc-console-text');

hexCells.forEach(cell => {
    cell.addEventListener('mouseenter', () => {
        const desc = cell.dataset.desc;
        if (hcConsoleText && desc) {
            hcConsoleText.textContent = desc;
        }
    });

    cell.addEventListener('mouseleave', () => {
        if (hcConsoleText) {
            hcConsoleText.textContent = 'Hover over any node in the hive matrix above to initialize telemetry description...';
        }
    });
});

/* ──────────────────────────────────────────
   13. GLASS MEDAL CABINET SWITCHER
   ────────────────────────────────────────── */
const medalNodes = qa('.medal-node');
const medalDescPanels = qa('.medal-desc-panel');

medalNodes.forEach(node => {
    node.addEventListener('click', () => {
        const medalId = node.dataset.medal;
        const targetPanel = q(`#desc-${medalId}`);
        if (!targetPanel) return;

        // 1. Deactivate all nodes, activate current
        medalNodes.forEach(n => n.classList.remove('active'));
        node.classList.add('active');

        // 2. Deactivate all description panels, activate current
        medalDescPanels.forEach(p => p.classList.remove('active'));
        targetPanel.classList.add('active');
    });
});

/* ──────────────────────────────────────────
   14. ACTIVE NAV STYLE (CSS injection)
   ────────────────────────────────────────── */
const style = document.createElement('style');
style.textContent = `.nav-active { color: var(--accent) !important; background: rgba(57,208,240,0.06) !important; }`;
document.head.appendChild(style);
