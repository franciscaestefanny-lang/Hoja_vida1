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
    const expanded = nav.classList.contains('open');
    navToggle.setAttribute('aria-expanded', String(expanded));
  });
}

document.querySelectorAll('.nav-links a').forEach((link) => {
  link.addEventListener('click', () => {
    if (nav) nav.classList.remove('open');
    if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
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

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.reveal').forEach((item) => observer.observe(item));
} else {
  document.querySelectorAll('.reveal').forEach((item) => item.classList.add('visible'));
}

const statNumbers = document.querySelectorAll('[data-stat]');

function animateCounter(element) {
  if (!element || !element.dataset || !element.dataset.stat) return;
  const target = Number(element.dataset.stat);
  const duration = 1600;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = String(Math.round(eased * target));
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

if ('IntersectionObserver' in window) {
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
} else {
  statNumbers.forEach((stat) => {
    stat.textContent = stat.dataset.stat;
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

const galleryImages = [
  { src: 'assets/images/gallery-1.svg', alt: 'Servicio institucional', caption: 'Servicio institucional' },
  { src: 'assets/images/gallery-2.svg', alt: 'Trabajo en equipo', caption: 'Trabajo en equipo' },
  { src: 'assets/images/gallery-3.svg', alt: 'Disciplina y servicio', caption: 'Disciplina y servicio' },
  { src: 'assets/images/gallery-4.svg', alt: 'Capacitación', caption: 'Capacitación' }
];

const galleries = Array.from(document.querySelectorAll('.gallery-open'));
const modal = document.getElementById('galleryModal');
const modalImage = document.getElementById('modalImage');
const modalCaption = document.getElementById('modalCaption');
const modalClose = document.getElementById('modalClose');
const modalPrev = document.getElementById('modalPrev');
const modalNext = document.getElementById('modalNext');
let galleryIndex = 0;

function openGallery(index) {
  if (!modal || !modalImage || !modalCaption) return;
  galleryIndex = index;
  modalImage.src = galleryImages[index].src;
  modalImage.alt = galleryImages[index].alt;
  modalCaption.textContent = galleryImages[index].caption;
  modal.classList.add('visible');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeGallery() {
  if (!modal) return;
  modal.classList.remove('visible');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

if (galleries.length > 0) {
  galleries.forEach((button) => {
    button.addEventListener('click', () => {
      openGallery(Number(button.dataset.index));
    });
  });
}

if (modalClose) modalClose.addEventListener('click', closeGallery);
if (modalPrev) {
  modalPrev.addEventListener('click', () => {
    const nextIndex = (galleryIndex - 1 + galleryImages.length) % galleryImages.length;
    openGallery(nextIndex);
  });
}
if (modalNext) {
  modalNext.addEventListener('click', () => {
    const nextIndex = (galleryIndex + 1) % galleryImages.length;
    openGallery(nextIndex);
  });
}

document.addEventListener('keydown', (event) => {
  if (!modal || modal.getAttribute('aria-hidden') === 'true') return;
  if (event.key === 'Escape') closeGallery();
  if (event.key === 'ArrowLeft') {
    const nextIndex = (galleryIndex - 1 + galleryImages.length) % galleryImages.length;
    openGallery(nextIndex);
  }
  if (event.key === 'ArrowRight') {
    const nextIndex = (galleryIndex + 1) % galleryImages.length;
    openGallery(nextIndex);
  }
});

const printCv = document.getElementById('printCv');
if (printCv) {
  printCv.addEventListener('click', () => {
    window.print();
  });
}

const printCv = document.getElementById('printCv');
if (printCv) {
  printCv.addEventListener('click', () => {
    window.print();
  });
}

const downloadButtons = [
  document.getElementById('downloadCv'),
  document.getElementById('downloadCv2')
];

let messageDownload = null;

function checkPdfDownload(button, targetMsg) {
  if (!button) return;

  button.addEventListener('click', (event) => {
    const pdfPath = 'assets/documents/hoja-de-vida-estefanny-vargas.pdf';

    fetch(pdfPath, { method: 'HEAD' })
      .then((response) => {
        if (!response.ok) {
          event.preventDefault();
          if (targetMsg) {
            targetMsg.textContent = 'El archivo PDF aún no está disponible. Puede colocarlo en la carpeta de documentos.';
            targetMsg.classList.add('visible');
          }
        }
      })
      .catch(() => {
        event.preventDefault();
        if (targetMsg) {
          targetMsg.textContent = 'El archivo PDF aún no está disponible. Puede colocarlo en la carpeta de documentos.';
          targetMsg.classList.add('visible');
        }
      });
  });
}

const downloadMsg = document.getElementById('downloadMsg');
const downloadMsg2 = document.getElementById('downloadMsg2');
checkPdfDownload(downloadButtons[0], downloadMsg);
checkPdfDownload(downloadButtons[1], downloadMsg2);
