const body = document.body;
const nav = document.getElementById('navLinks');
const navToggle = document.getElementById('navToggle');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const progressLine = document.getElementById('progressLine');
const topButton = document.getElementById('backTop');

const savedTheme = localStorage.getItem('estefanny-theme');
if (savedTheme === 'dark') {
  body.classList.add('dark-theme');
  if (themeIcon) themeIcon.textContent = '☀️';
}

if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    nav.classList.toggle('open');
  });
}

document.querySelectorAll('.nav-links a').forEach((link) => {
  link.addEventListener('click', () => {
    if (nav) nav.classList.remove('open');
  });
});

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    if (body.classList.contains('dark-theme')) {
      body.classList.remove('dark-theme');
      localStorage.setItem('estefanny-theme', 'light');
      if (themeIcon) themeIcon.textContent = '🌙';
    } else {
      body.classList.add('dark-theme');
      localStorage.setItem('estefanny-theme', 'dark');
      if (themeIcon) themeIcon.textContent = '☀️';
    }
  });
}

function updateProgress() {
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrolled = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
  const progress = Math.min(100, Math.max(0, scrolled));
  if (progressLine) progressLine.style.width = progress + '%';

  if (topButton) {
    if (window.scrollY > 520) {
      topButton.classList.add('visible');
    } else {
      topButton.classList.remove('visible');
    }
  }
}

window.addEventListener('scroll', updateProgress);
updateProgress();

if (topButton) {
  topButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

const sections = Array.from(document.querySelectorAll('main section[id]'));
const navLinks = Array.from(document.querySelectorAll('.nav-links a'));

function setActiveSection() {
  const scrollY = window.scrollY + 160;
  let current = sections[0] ? sections[0].id : '';

  sections.forEach((section) => {
    if (section.offsetTop <= scrollY) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach((link) => {
    const target = link.getAttribute('href');
    if (target === '#' + current) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

window.addEventListener('scroll', setActiveSection);
setActiveSection();

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.reveal').forEach((item) => observer.observe(item));

const skills = [
  { name: 'Responsabilidad', value: 95 },
  { name: 'Disciplina', value: 92 },
  { name: 'Trabajo en equipo', value: 90 },
  { name: 'Comunicación', value: 85 },
  { name: 'Adaptabilidad', value: 88 },
  { name: 'Organización', value: 86 },
  { name: 'Liderazgo', value: 82 },
  { name: 'Vocación de servicio', value: 96 }
];

const skillGrid = document.getElementById('skillGrid');

if (skillGrid) {
  skills.forEach((skill) => {
    const card = document.createElement('article');
    card.className = 'skill-card reveal';

    card.innerHTML = `
      <div class="skill-bar-wrap">
        <span class="skill-name">${skill.name}</span>
        <span class="percent">${skill.value}%</span>
      </div>
      <div class="skill-bar" style="--value:${skill.value}%">
        <span></span>
      </div>
    `;

    skillGrid.appendChild(card);
  });
}

const statNumbers = document.querySelectorAll('[data-stat]');

function animateCounter(element) {
  const target = Number(element.dataset.stat);
  const duration = 1600;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const stat = entry.target;
      animateCounter(stat);
      statsObserver.unobserve(stat);
    }
  });
}, { threshold: 0.7 });

statNumbers.forEach((stat) => statsObserver.observe(stat));

const downloadButton = document.getElementById('downloadCv');
const downloadMsg = document.getElementById('downloadMsg');

if (downloadButton) {
  downloadButton.addEventListener('click', (event) => {
    const pdfPath = 'assets/documents/hoja-de-vida-estefanny-vargas.pdf';

    fetch(pdfPath, { method: 'HEAD' })
      .then((response) => {
        if (!response.ok) {
          event.preventDefault();
          if (downloadMsg) {
            downloadMsg.textContent = 'El archivo PDF aún no está disponible. Puede colocarlo en la carpeta de documentos.';
            downloadMsg.classList.add('visible');
          }
        }
      })
      .catch(() => {
        event.preventDefault();
        if (downloadMsg) {
          downloadMsg.textContent = 'El archivo PDF aún no está disponible. Puede colocarlo en la carpeta de documentos.';
          downloadMsg.classList.add('visible');
        }
      });
  });
}

const form = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

if (form && formMessage) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const phone = String(formData.get('phone') || '').trim();
    const message = String(formData.get('message') || '').trim();

    if (!name || !email || !phone || !message) {
      formMessage.textContent = 'Por favor complete todos los campos.';
      formMessage.classList.add('error');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      formMessage.textContent = 'Ingrese un correo electrónico válido.';
      formMessage.classList.add('error');
      return;
    }

    if (phone.length < 8) {
      formMessage.textContent = 'Ingrese un teléfono válido.';
      formMessage.classList.add('error');
      return;
    }

    formMessage.textContent = 'Mensaje preparado correctamente. Gracias por contactarme.';
    formMessage.classList.remove('error');
    form.reset();
  });
}
