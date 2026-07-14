lucide.createIcons();

const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
  navMenu.classList.toggle('active');
  const icon = hamburger.querySelector('i');
  if (navMenu.classList.contains('active')) {
    icon.setAttribute('data-lucide', 'x');
  } else {
    icon.setAttribute('data-lucide', 'menu');
  }
  lucide.createIcons();
});

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('active');
    const icon = hamburger.querySelector('i');
    icon.setAttribute('data-lucide', 'menu');
    lucide.createIcons();
  });
});

const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

revealElements.forEach(el => revealObserver.observe(el));

async function handleSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button[type="submit"]');
  const originalHTML = btn.innerHTML;
  const successMsg = document.getElementById('contactSuccess');

  let isValid = true;
  form.querySelectorAll('.form-control').forEach(input => {
    input.classList.remove('input-error', 'input-success');
    if (!input.value.trim()) {
      input.classList.add('input-error');
      isValid = false;
    } else {
      input.classList.add('input-success');
    }
  });

  if (!isValid) return;

  const formspreeUrl = 'https://formspree.io/f/mgogvlze';

  btn.innerHTML = '<i data-lucide="loader" width="16" height="16"></i> Sending...';
  btn.disabled = true;
  lucide.createIcons();

  try {
    const response = await fetch(formspreeUrl, {
      method: 'POST',
      body: new FormData(form),
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      btn.innerHTML = '<i data-lucide="check" width="16" height="16"></i> Sent!';
      btn.style.background = '#10B981';
      successMsg.style.display = 'block';
      lucide.createIcons();
      form.reset();
      form.querySelectorAll('.form-control').forEach(input => input.classList.remove('input-success'));
    } else {
      throw new Error('Network response was not ok.');
    }
  } catch (error) {
    btn.innerHTML = '<i data-lucide="x" width="16" height="16"></i> Error';
    btn.style.background = '#EF4444';
    lucide.createIcons();
    console.error("Form error:", error);
  }

  setTimeout(() => {
    btn.innerHTML = originalHTML;
    btn.style.background = '';
    btn.disabled = false;
    successMsg.style.display = 'none';
    lucide.createIcons();
  }, 4000);
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const offset = 80;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    }
  });
});

// --- MODAL LOGIC ---
const modal = document.getElementById('infoModal');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const modalIcon = document.getElementById('modalIcon');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');

const detailsData = {
  'Frontend': `I specialize in building responsive and accessible user interfaces using modern frameworks. My focus is on creating pixel-perfect, high-performance web applications that deliver an exceptional user experience across all devices.`,
  'Backend': `I build robust, scalable, and secure server-side applications and APIs. From designing complex database schemas to implementing microservices architectures, I ensure your application's foundation is solid and performs well under heavy load.`,
  'Database': `Experienced in designing optimized database schemas, writing complex queries, and ensuring data integrity. Proficient in both relational (PostgreSQL, MySQL) and NoSQL databases to suit specific project requirements.`,
  'Tools': `I utilize modern DevOps tools and practices to streamline development workflows. Proficient in version control (Git), containerization with Docker, and CI/CD pipelines to ensure smooth and reliable deployments.`,
  'Web Development': `Full-cycle web application development from planning to deployment. I use modern frameworks to build fast, secure, and SEO-friendly websites tailored to your specific business requirements.`,
  'Backend Development': `Design and implementation of robust APIs, microservices, and enterprise-grade backend systems. Focused on security, performance optimization, and scalable architectures.`,
  'UI Implementation': `Translating high-fidelity Figma/Adobe XD designs into fully functional, pixel-perfect frontend code. Ensuring cross-browser compatibility, responsive design, and smooth animations.`,
  'Website Optimization': `Comprehensive performance audits and optimizations to improve load times, Core Web Vitals, and overall user experience. Implementation of best practices for caching, asset delivery, and code splitting.`,
  
  // Processes
  'Planning': `I collaborate closely with you to understand your requirements, target audience, and business goals. This phase involves defining the project scope, creating wireframes, and setting a clear roadmap for success.`,
  'Design': `I create visually stunning and highly intuitive user interfaces. Using Figma and modern design principles, I ensure the product not only looks beautiful but also provides a seamless user experience.`,
  'Development': `This is where the magic happens. I write clean, modular, and performant code using the latest technologies. I follow best practices for version control, testing, and continuous integration.`,
  'Deployment': `I handle the entire deployment process, ensuring your application goes live smoothly. From configuring servers to setting up domains and SSL certificates, your project will be ready for the world.`,

  // Projects
  'NexusCRM': `An enterprise-grade Customer Relationship Management platform built with Java, Spring Boot, and PostgreSQL. It features a modern dashboard, real-time analytics, and secure role-based access control to streamline business operations.`,
  'DevFlow': `A sleek, SaaS-inspired project management tool created with HTML, CSS, and vanilla JavaScript. It includes a drag-and-drop Kanban board, task tracking, and smooth animations for a fluid user experience.`,
  'POS System - Doña Fany': `A custom Point of Sale (POS) system designed specifically for a local restaurant and cocktail bar. It handles order processing, inventory management, and daily sales reporting, built with a robust Java backend.`,
  'Sabor Nica Landing': `A vibrant and modern landing page for a Nicaraguan cuisine restaurant. It features a responsive image gallery, menu highlights, and a reservation form, optimized for fast loading and SEO.`,
  'Andy Barber': `An exclusive barbershop website that combines a dark, premium aesthetic with intuitive navigation. It allows clients to explore services, view barber portfolios, and easily book appointments online.`,
  
  // Policies
  'Privacy Policy': `<div style="text-align: left; font-size: 14px; max-height: 400px; overflow-y: auto; padding-right: 15px;">
    <h4 style="color: white; margin-bottom: 10px;">1. Introduction</h4>
    <p style="margin-bottom: 15px;">Welcome to my professional portfolio. I am committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice, or my practices with regards to your personal information, please contact me.</p>
    <h4 style="color: white; margin-bottom: 10px;">2. Information Collection</h4>
    <p style="margin-bottom: 15px;">I collect personal information that you voluntarily provide to me when you express an interest in obtaining information about my services or otherwise contacting me. The personal information that I collect depends on the context of your interactions with the website.</p>
    <h4 style="color: white; margin-bottom: 10px;">3. Use of Your Information</h4>
    <p style="margin-bottom: 15px;">I use personal information collected via my website for a variety of business purposes described below. I process your personal information for these purposes in reliance on legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with legal obligations.</p>
    <h4 style="color: white; margin-bottom: 10px;">4. Information Sharing</h4>
    <p style="margin-bottom: 15px;">I only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations. I do not sell, rent, or trade any of your information with third parties.</p>
    <h4 style="color: white; margin-bottom: 10px;">5. Data Retention & Security</h4>
    <p style="margin-bottom: 15px;">I will only keep your personal information for as long as it is necessary for the purposes set out in this privacy notice, unless a longer retention period is required or permitted by law. I have implemented appropriate technical and organizational security measures designed to protect the security of any personal information I process.</p>
    <p style="font-size: 12px; color: var(--primary); margin-top: 20px;">Last Updated: July 2026</p>
  </div>`,
  'Terms & Conditions': `<div style="text-align: left; font-size: 14px; max-height: 400px; overflow-y: auto; padding-right: 15px;">
    <h4 style="color: white; margin-bottom: 10px;">1. Agreement to Terms</h4>
    <p style="margin-bottom: 15px;">These Terms and Conditions constitute a legally binding agreement made between you, whether personally or on behalf of an entity, and this website operator, concerning your access to and use of this portfolio website as well as any other media form related, linked, or otherwise connected thereto.</p>
    <h4 style="color: white; margin-bottom: 10px;">2. Intellectual Property Rights</h4>
    <p style="margin-bottom: 15px;">Unless otherwise indicated, the website is my proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the website are owned or controlled by me or licensed to me, and are protected by copyright and trademark laws.</p>
    <h4 style="color: white; margin-bottom: 10px;">3. User Representations</h4>
    <p style="margin-bottom: 15px;">By using the website, you represent and warrant that: (1) all registration information you submit will be true, accurate, current, and complete; (2) you will maintain the accuracy of such information; (3) you have the legal capacity and you agree to comply with these Terms and Conditions.</p>
    <h4 style="color: white; margin-bottom: 10px;">4. Prohibited Activities</h4>
    <p style="margin-bottom: 15px;">You may not access or use the website for any purpose other than that for which I make the website available. The website may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by me.</p>
    <h4 style="color: white; margin-bottom: 10px;">5. Modifications and Interruptions</h4>
    <p style="margin-bottom: 15px;">I reserve the right to change, modify, or remove the contents of the website at any time or for any reason at my sole discretion without notice. However, I have no obligation to update any information on my website.</p>
    <p style="font-size: 12px; color: var(--primary); margin-top: 20px;">Last Updated: July 2026</p>
  </div>`
};

const modalImage = document.getElementById('modalImage');

function openModal(title, iconHtml, imageUrl = null) {
  modalTitle.textContent = title;
  
  if (imageUrl) {
    modalImage.src = imageUrl;
    modalImage.style.display = 'block';
    modalIcon.style.display = 'none';
    modal.classList.add('modal-large');
  } else {
    modalImage.style.display = 'none';
    modalIcon.style.display = 'block';
    modalIcon.innerHTML = iconHtml;
    modal.classList.remove('modal-large');
  }
  
  modalBody.innerHTML = detailsData[title] || 'More information coming soon.';
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('active');
  modal.classList.remove('modal-large');
  document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', closeModal);

document.querySelectorAll('.skill-category, .service-card, .process-step').forEach(card => {
  card.addEventListener('click', () => {
    const titleEl = card.querySelector('h3');
    const iconEl = card.querySelector('.skill-icon, .service-icon, .process-num');
    if (titleEl && iconEl) {
      openModal(titleEl.textContent, iconEl.innerHTML);
    }
  });
});

document.querySelectorAll('.project-image').forEach(imageContainer => {
  imageContainer.addEventListener('click', () => {
    const card = imageContainer.closest('.project-card');
    const titleEl = card.querySelector('h3');
    const imgEl = imageContainer.querySelector('img');
    if (titleEl && imgEl) {
      openModal(titleEl.textContent, '', imgEl.src);
    }
  });
});

document.querySelectorAll('.policy-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    openModal(link.textContent, '<i data-lucide="shield" width="24" height="24"></i>');
    lucide.createIcons();
  });
});

// --- EASTER EGG (PONG) ---
let logoClicks = 0;
const navLogo = document.querySelector('.navbar .logo');
if (navLogo) {
  navLogo.addEventListener('click', () => {
    logoClicks++;
    if (logoClicks >= 10) {
      logoClicks = 0;
      startPong();
    }
  });
}

function startPong() {
  if (document.getElementById('pongContainer')) return; // Already running

  const container = document.createElement('div');
  container.id = 'pongContainer';
  container.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
    background: rgba(15, 23, 42, 0.95); backdrop-filter: blur(10px);
    z-index: 100000; display: flex; align-items: center; justify-content: center;
    overflow: hidden; cursor: none;
  `;

  // Close button
  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = 'Quit (ESC)';
  closeBtn.style.cssText = `
    position: absolute; top: 20px; right: 20px; z-index: 100001;
    background: transparent; color: white; border: 1px solid white;
    padding: 8px 16px; border-radius: 4px; cursor: pointer;
  `;
  closeBtn.onclick = endPong;
  
  // Game elements
  const paddleStyle = 'position: absolute; width: 12px; height: 100px; background: #38bdf8; border-radius: 6px; box-shadow: 0 0 10px #38bdf8;';
  const playerPaddle = document.createElement('div');
  playerPaddle.style.cssText = paddleStyle + 'left: 40px; top: calc(50% - 50px);';
  
  const aiPaddle = document.createElement('div');
  aiPaddle.style.cssText = paddleStyle + 'right: 40px; top: calc(50% - 50px);';

  const ball = document.createElement('div');
  ball.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="32" height="32" style="filter: drop-shadow(0 0 8px #818cf8);">
      <defs>
        <linearGradient id="pongGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#38bdf8" />
          <stop offset="100%" stop-color="#818cf8" />
        </linearGradient>
      </defs>
      <polygon points="20,2 38,11 38,29 20,38 2,29 2,11" fill="none" stroke="url(#pongGrad)" stroke-width="2.5" />
      <path d="M14,28 L14,12 L22,12 C25,12 26,14 26,16 C26,18 25,20 22,20 L14,20 M20,20 L26,28" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  `;
  ball.style.cssText = 'position: absolute; width: 32px; height: 32px; top: 0; left: 0; display: flex; align-items: center; justify-content: center;';

  const scoreBoard = document.createElement('div');
  scoreBoard.style.cssText = 'position: absolute; top: 40px; width: 100%; text-align: center; color: rgba(255,255,255,0.2); font-size: 64px; font-weight: 800; font-family: sans-serif; pointer-events: none; letter-spacing: 20px;';
  
  container.appendChild(closeBtn);
  container.appendChild(scoreBoard);
  container.appendChild(playerPaddle);
  container.appendChild(aiPaddle);
  container.appendChild(ball);
  document.body.appendChild(container);

  // Game state
  let state = {
    pY: window.innerHeight / 2 - 50,
    aY: window.innerHeight / 2 - 50,
    bX: window.innerWidth / 2 - 16,
    bY: window.innerHeight / 2 - 16,
    bVX: -6,
    bVY: 4,
    scoreP: 0,
    scoreA: 0,
    running: true
  };

  function updateScore() {
    scoreBoard.textContent = `${state.scoreP} - ${state.scoreA}`;
  }
  updateScore();

  // Controls
  const moveHandler = (e) => {
    state.pY = e.clientY - 50;
    if (state.pY < 0) state.pY = 0;
    if (state.pY > window.innerHeight - 100) state.pY = window.innerHeight - 100;
  };
  window.addEventListener('mousemove', moveHandler);
  
  const keyHandler = (e) => {
    if (e.key === 'Escape') endPong();
  };
  window.addEventListener('keydown', keyHandler);

  function endPong() {
    state.running = false;
    window.removeEventListener('mousemove', moveHandler);
    window.removeEventListener('keydown', keyHandler);
    if (container.parentNode) container.parentNode.removeChild(container);
  }

  // Loop
  function loop() {
    if (!state.running) return;

    // AI movement
    const aiCenter = state.aY + 50;
    const ballCenter = state.bY + 16;
    if (aiCenter < ballCenter - 10) state.aY += 5;
    if (aiCenter > ballCenter + 10) state.aY -= 5;
    if (state.aY < 0) state.aY = 0;
    if (state.aY > window.innerHeight - 100) state.aY = window.innerHeight - 100;

    // Ball movement
    state.bX += state.bVX;
    state.bY += state.bVY;

    // Wall collision (top/bottom)
    if (state.bY <= 0 || state.bY >= window.innerHeight - 32) {
      state.bVY *= -1;
    }

    // Paddle collision
    const hitPlayer = state.bX <= 52 && state.bY + 32 >= state.pY && state.bY <= state.pY + 100;
    const hitAI = state.bX >= window.innerWidth - 84 && state.bY + 32 >= state.aY && state.bY <= state.aY + 100;

    if (hitPlayer && state.bVX < 0) {
      state.bVX = Math.abs(state.bVX) + 0.5;
      state.bVY += (state.bY + 16 - (state.pY + 50)) * 0.1;
    }
    
    if (hitAI && state.bVX > 0) {
      state.bVX = -Math.abs(state.bVX) - 0.5;
      state.bVY += (state.bY + 16 - (state.aY + 50)) * 0.1;
    }

    // Scoring
    if (state.bX < 0) {
      state.scoreA++;
      resetBall(1);
    } else if (state.bX > window.innerWidth) {
      state.scoreP++;
      resetBall(-1);
    }

    // Render
    playerPaddle.style.top = state.pY + 'px';
    aiPaddle.style.top = state.aY + 'px';
    ball.style.transform = `translate(${state.bX}px, ${state.bY}px) rotate(${state.bX}deg)`;

    requestAnimationFrame(loop);
  }

  function resetBall(direction) {
    state.bX = window.innerWidth / 2 - 16;
    state.bY = window.innerHeight / 2 - 16;
    state.bVX = 6 * direction;
    state.bVY = (Math.random() * 4 - 2);
    updateScore();
  }

  requestAnimationFrame(loop);
}