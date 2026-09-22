/* ╔══════════════════════════════════════════════════════════╗
   ║  CIRCUIT BLOSSOM — Interactive Engine                    ║
   ║  Typewriter, 3D tilt, scroll reveals, lightbox, etc.    ║
   ╚══════════════════════════════════════════════════════════╝ */

document.addEventListener('DOMContentLoaded', () => {

  // ═══════════ PRELOADER ═══════════
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
    }, 800);
  });
  // Fallback: hide after 3s regardless
  setTimeout(() => preloader.classList.add('hidden'), 3000);

  // ═══════════ FOOTER YEAR ═══════════
  const footerYear = document.getElementById('footerYear');
  if (footerYear) footerYear.textContent = new Date().getFullYear();

  // ═══════════ SCROLL PROGRESS BAR ═══════════
  const scrollProgress = document.getElementById('scroll-progress');
  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = progress + '%';
  }

  // ═══════════ NAVIGATION ═══════════
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const navItems = navLinks.querySelectorAll('a');

  // Hamburger toggle
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close menu on link click
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
    }
  });

  // ═══════════ DARK MODE TOGGLE ═══════════
  const darkToggle = document.getElementById('darkToggle');
  const darkIcon = darkToggle.querySelector('i');

  // Restore saved preference
  if (localStorage.getItem('darkMode') === 'on') {
    document.body.classList.add('dark-mode');
    darkIcon.classList.replace('fa-lightbulb', 'fa-moon');
  }

  darkToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    if (isDark) {
      darkIcon.classList.replace('fa-lightbulb', 'fa-moon');
      localStorage.setItem('darkMode', 'on');
    } else {
      darkIcon.classList.replace('fa-moon', 'fa-lightbulb');
      localStorage.setItem('darkMode', 'off');
    }
  });

  // ═══════════ PUBLICATION CATEGORY FILTER ═══════════
  document.querySelectorAll('.pub-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.dataset.cat;
      document.querySelectorAll('.pub-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.pub-category').forEach(sec => {
        sec.classList.toggle('active', sec.dataset.cat === cat);
      });
    });
  });

  // Shrink on scroll + active section highlighting
  const sections = document.querySelectorAll('section[id]');
  function updateNavOnScroll() {
    const scrollY = window.scrollY;

    // Navbar shrink
    if (scrollY > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active section
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      if (scrollY >= top) {
        current = section.getAttribute('id');
      }
    });
    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('data-section') === current) {
        item.classList.add('active');
      }
    });
  }

  // ═══════════ BACK TO TOP ═══════════
  const backToTop = document.getElementById('backToTop');
  function updateBackToTop() {
    if (window.scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Combined scroll handler
  function onScroll() {
    updateScrollProgress();
    updateNavOnScroll();
    updateBackToTop();
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Initial call

  // ═══════════ TYPEWRITER EFFECT ═══════════
  const typedEl = document.getElementById('typedSubtitle');
  const phrases = [
    'PhD Candidate @ Purdue',
    'Health AI',
    'AI for circuit design',
    'Low-Power Wearable AI'
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 80;

  function typeWriter() {
    const current = phrases[phraseIndex];

    if (isDeleting) {
      typedEl.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 40;
    } else {
      typedEl.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 80;
    }

    if (!isDeleting && charIndex === current.length) {
      typeSpeed = 2000; // Pause at end
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typeSpeed = 300; // Brief pause before next phrase
    }

    setTimeout(typeWriter, typeSpeed);
  }
  setTimeout(typeWriter, 1000);

  // ═══════════ SCROLL REVEAL (IntersectionObserver) ═══════════
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.getAttribute('data-delay') || 0;
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, parseInt(delay));
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ═══════════ TIMELINE ANIMATION ═══════════
  const timeline = document.querySelector('.timeline');
  if (timeline) {
    const timelineObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          timeline.classList.add('animated');
          timelineObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    timelineObserver.observe(timeline);
  }

  // ═══════════ EDUCATION PATH ANIMATION ═══════════
  const eduPath = document.querySelector('.edu-path');
  if (eduPath) {
    const eduObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          eduPath.classList.add('animated');
          eduObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    eduObserver.observe(eduPath);
  }

  // ═══════════ 3D TILT EFFECT ON PROJECT CARDS ═══════════
  const tiltCards = document.querySelectorAll('.tilt-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale(1.02)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateY(0) rotateX(0) scale(1)';
    });
  });

  // ═══════════ EDUCATION NODE CLICK-TO-TOGGLE ═══════════
  const eduNodes = document.querySelectorAll('.edu-node');
  eduNodes.forEach(node => {
    node.addEventListener('click', (e) => {
      e.stopPropagation();
      const wasActive = node.classList.contains('active');
      eduNodes.forEach(n => n.classList.remove('active'));
      if (!wasActive) node.classList.add('active');
    });
    node.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        node.click();
      }
    });
  });
  // Close on outside click
  document.addEventListener('click', () => {
    eduNodes.forEach(n => n.classList.remove('active'));
  });

});

// ═══════════ EXPERIENCE MODAL ═══════════
const experienceData = [
  {
    logo: 'images/Qualcomm.png',
    role: 'ML Intern',
    company: 'Qualcomm',
    date: 'Summer 2025 and 2026',
    location: 'Santa Clara, CA',
    accent: 'accent-purple',
    summary: 'Machine learning for analog/RF circuit optimization. Two novel in-house architectures outperforming SOTA. Co-inventor on filed patent.',
    details: [
      'Developed ML formulations for analog/RF circuit optimization under Manager Kamal Aggarwal',
      'Two in-house architectures that outperform state-of-the-art approaches',
      'Built end-to-end training and evaluation pipeline',
      'Collaborated with Global ML Research and RF-Analog design teams',
      'Co-inventor on filed patent'
    ],
    tags: ['Python', 'PyTorch', 'Scikit-learn']
  },
  {
    logo: 'images/sparc.png',
    role: 'Graduate Research Assistant',
    company: 'SPARC Lab, Purdue University',
    date: 'Aug 2021 – Present',
    location: 'West Lafayette, IN',
    accent: 'accent-teal',
    summary: 'Applied ML for healthcare, circuits, and wearable systems, along with low-power hardware and signal processing — under Prof. Shreyas Sen.',
    details: [
      '<em class="detail-category">ML Projects</em>',
      '<strong>Distributed Neural Networks for Wearables:</strong> Designing energy-efficient ML frameworks that split inference across low-power devices for scalable edge AI',
      '<strong>EEG Sensing & Processing:</strong> Improving signal quality in noisy EEG data using signal processing, ML, and self-supervised learning',
      '<strong>Mental Health & Digital Well-being:</strong> Building interpretable ML models for mental health prediction with smart feature reduction',
      '<strong>Frequency Emanation Analysis:</strong> Using ML and CNNs to detect rogue emanations from unintended electronic sources',
      '<em class="detail-category">Systems & Hardware Projects</em>',
      '<strong>Human Body Communication for ECG:</strong> Developing low-power ECG sensing systems that transmit biopotential signals through the human body',
      '<strong>EEG Dry Electrode Noise Analysis:</strong> Studying noise in dry EEG systems, showing stability advantages over wet electrodes'
    ],
    tags: ['PSoC', 'Energy Harvesting', 'SDR', 'GNU Radio', 'MATLAB', 'Python']
  },
  {
    logo: 'images/tcs_logo.jpg',
    role: 'Systems Engineer (R&I, Analytics & Insights)',
    company: 'Tata Consultancy Services',
    date: 'Aug 2020 – Aug 2021',
    location: 'Mumbai, India',
    accent: 'accent-pink',
    summary: 'Built end-to-end automated ML systems and NLP-based solutions for structured and unstructured data.',
    details: [
      '<strong>Analytics in a Box:</strong> End-to-end automated prediction system — handles data augmentation, model selection, and adapts to changing data trends using GANs and AutoML',
      '<strong>Cogni Extract:</strong> ML-based solution for extracting information from unstructured data, automating what used to be a fully manual process using NLP (spaCy) and CRF models'
    ],
    tags: ['GAN', 'AutoML', 'Python', 'HTML/CSS', 'MLOps', 'Airflow', 'NLP', 'Scikit-learn']
  },
  {
    logo: 'images/yuan.jpg',
    role: 'Research Intern',
    company: 'Yuan Ze University, Taiwan',
    date: 'May 2020 – Jul 2020',
    location: 'Taiwan',
    accent: 'accent-amber',
    summary: 'Depth of Anesthesia prediction using ECG and PPG signals with deep learning. Achieved 82% accuracy.',
    details: [
      'Advisor: Prof. Jiann-Shin Shieh',
      'Predicted surgical anesthesia depth using Deep Learning on ECG/PPG signals',
      'Published in Biomedical Signal Processing and Control (BSPC) journal'
    ],
    tags: ['Python', 'TensorFlow', 'Keras', 'MATLAB']
  },
  {
    logo: 'images/tcs_logo.jpg',
    role: 'Machine Learning Intern',
    company: 'Tata Consultancy Services',
    date: 'Jan 2020 – Apr 2020',
    location: 'Mumbai, India',
    accent: 'accent-blue',
    summary: 'IoT in Transportation & Logistics — predicting EV battery life, drivable range, and charging time using ML.',
    details: [
      'Predicted remaining cycle life of Li-ion batteries in Electric Vehicles',
      'Built models to estimate drivable range and charging time for different terrains',
      'Compared Random Forest, Decision Tree, KNN, Neural Networks, and Linear Regression — Random Forest came out on top',
      'Feature extraction and evaluation across average vs. exact condition inputs'
    ],
    tags: ['Python', 'Scikit-learn', 'IoT']
  },
  {
    logo: 'images/iitkgp.png',
    role: 'Research Intern',
    company: 'IIT Kharagpur (SEAL Lab, CSE)',
    date: 'May 2019 – Jun 2019',
    location: 'Kharagpur, India',
    accent: 'accent-purple',
    summary: 'Hardware security on Xilinx FPGA — built a True Random Number Generator using Ring Oscillators under Prof. Rajat Subhra Chakraborty.',
    details: [
      'Implemented a TRNG on Nexys 4 DDR (Artix-7) using Ring Oscillators as noise source and clock',
      'Used Carry4 primitive, bit extractor, BRAM, and UART for the full pipeline',
      'Validated randomness with NIST statistical test suite',
      'Visualized randomness on on-board LEDs with a 4s sampling window'
    ],
    tags: ['Verilog', 'Vivado', 'FPGA', 'Xilinx Nexys4 DDR']
  },
  {
    logo: 'images/iitb.png',
    role: 'Summer Intern',
    company: 'IIT Bombay (EE Department)',
    date: 'May 2018 – Jul 2018',
    location: 'India',
    accent: 'accent-teal',
    summary: 'IoT-based Weigh Scale using AT89C51A microcontroller with sensor interfacing and cloud connectivity.',
    details: [
      'Guidance: Prof. Virendra Singh',
      'Built IoT-based weigh scale with microcontroller and sensor interfacing',
      'Cloud connectivity via ThingSpeak'
    ],
    tags: ['Embedded C', 'Keil µVision', 'ThingSpeak']
  }
];

function openExpModal(index) {
  const exp = experienceData[index];
  const overlay = document.getElementById('expModalOverlay');

  document.getElementById('expModalAccent').className = 'exp-modal-accent ' + exp.accent;
  document.getElementById('expModalLogo').src = exp.logo;
  document.getElementById('expModalRole').textContent = exp.role;
  document.getElementById('expModalCompany').textContent = exp.company;
  document.getElementById('expModalMeta').innerHTML =
    '<i class="fa-solid fa-calendar"></i> ' + exp.date +
    ' &middot; <i class="fa-solid fa-location-dot"></i> ' + exp.location;
  document.getElementById('expModalSummary').textContent = exp.summary;

  document.getElementById('expModalDetails').innerHTML =
    exp.details.map(d => '<li>' + d + '</li>').join('');

  document.getElementById('expModalTags').innerHTML =
    exp.tags.map(t => '<span class="tag">' + t + '</span>').join('');

  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeExpModal() {
  document.getElementById('expModalOverlay').classList.remove('active');
  document.body.style.overflow = '';
}

document.getElementById('expModalOverlay').addEventListener('click', function(e) {
  if (e.target === this) closeExpModal();
});

// ═══════════ PROJECT MODALS ═══════════
// Open modal via "Learn More" buttons
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn-learn-more');
  if (btn) {
    const modalId = btn.getAttribute('data-modal');
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.removeAttribute('hidden');
      document.body.style.overflow = 'hidden';
    }
  }
});

function closeModal(btn) {
  const overlay = btn.closest('.modal-overlay');
  if (overlay) {
    overlay.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }
}

// Close modal on overlay click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.setAttribute('hidden', '');
      document.body.style.overflow = '';
    }
  });
});

// Close modal on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay:not([hidden])').forEach(m => {
      m.setAttribute('hidden', '');
      document.body.style.overflow = '';
    });
  }
});

// ═══════════ TOGGLE MORE PROJECTS ═══════════
function toggleMoreProjects() {
  const more = document.getElementById('moreProjects');
  const btn = document.getElementById('btnMoreProjects');
  const isHidden = more.hasAttribute('hidden');

  if (isHidden) {
    more.removeAttribute('hidden');
    btn.classList.add('expanded');
    btn.innerHTML = 'Show Fewer Projects <i class="fa-solid fa-chevron-down"></i>';
  } else {
    more.setAttribute('hidden', '');
    btn.classList.remove('expanded');
    btn.innerHTML = 'Show More Projects <i class="fa-solid fa-chevron-down"></i>';
  }
}

// ═══════════ PUBLICATION SHOW MORE ═══════════
function togglePubMore(id, btn) {
  const more = document.getElementById(id);
  const isHidden = more.hasAttribute('hidden');
  if (isHidden) {
    more.removeAttribute('hidden');
    btn.classList.add('expanded');
    btn.innerHTML = 'Show Less <i class="fa-solid fa-chevron-down"></i>';
  } else {
    more.setAttribute('hidden', '');
    btn.classList.remove('expanded');
    btn.innerHTML = 'Show More <i class="fa-solid fa-chevron-down"></i>';
  }
}

// ═══════════ GALLERY DATA ═══════════
const galleryData = {
  lens: {
    title: 'Glimpses Through My Lens',
    link: { href: 'https://www.instagram.com/clumsy_clicker/', label: 'check out my insta' },
    photos: [
      { src: 'images/pic/0.jpg', caption: 'A perfect heart!' },
      { src: 'images/pic/1.jpg', caption: 'This seagull seems to like Kurkure...' },
      { src: 'images/pic/5.jpg', caption: 'Eid Moon' },
      { src: 'images/pic/6.jpg', caption: 'Flamingos' },
      { src: 'images/pic/10.jpg', caption: 'Myna' },
      { src: 'images/pic/11.jpg', caption: 'Painted Stork' },
      { src: 'images/pic/12.jpg', caption: 'Fragile with finesse... Touch me not!' },
      { src: 'images/pic/13.jpg', caption: 'Holi Moon' },
      { src: 'images/pic/14.jpg', caption: 'Can you spot me?' },
      { src: 'images/pic/15.jpg', caption: 'Fully Bloomed' },
      { src: 'images/pic/16.jpg', caption: 'Bulbul' },
      { src: 'images/pic/17.jpg', caption: 'Fly high' },
      { src: 'images/pic/19.jpg', caption: 'Bright and beautiful' }
    ]
  },
  travel: {
    title: 'Travel',
    photos: [
      { src: 'images/pic/2.jpg', caption: 'Sunset hour' },
      { src: 'images/pic/3.jpg', caption: 'Still or motion?' },
      { src: 'images/pic/4.jpg', caption: 'Navi Mumbai Skyline' },
      { src: 'images/pic/7.jpg', caption: 'Street sights' },
      { src: 'images/pic/8.jpg', caption: 'Howrah Bridge' },
      { src: 'images/pic/9.jpg', caption: 'Landscape' },
      { src: 'images/pic/18.jpg', caption: 'A day out' }
    ]
  },
  bouldering: {
    title: 'Bouldering',
    photos: []
  }
};

let currentCategory = 'lens';
let currentPhotoIndex = 0;

// ═══════════ GALLERY MODAL ═══════════
function openGalleryModal(cat) {
  currentCategory = cat;
  const data = galleryData[cat];
  if (!data) return;

  const title = document.getElementById('galleryModalTitle');
  title.textContent = data.title;
  if (data.link) {
    const link = document.createElement('a');
    link.className = 'gallery-modal-link';
    link.href = data.link.href;
    link.target = '_blank';
    link.rel = 'noopener';
    link.innerHTML = `<i class="fa-brands fa-instagram"></i> (${data.link.label})`;
    title.appendChild(link);
  }
  const grid = document.getElementById('galleryModalGrid');
  grid.innerHTML = '';

  if (data.photos.length === 0) {
    grid.innerHTML = '<p class="gallery-placeholder">Photos coming soon! Stay tuned.</p>';
  } else {
    data.photos.forEach((photo, i) => {
      const thumb = document.createElement('div');
      thumb.className = 'gallery-thumb';
      thumb.onclick = () => openLightbox(cat, i);
      thumb.innerHTML = `<img src="${photo.src}" alt="${photo.caption}" loading="lazy"><div class="gallery-thumb-caption">${photo.caption}</div>`;
      grid.appendChild(thumb);
    });
  }

  document.getElementById('galleryModal').removeAttribute('hidden');
  document.body.style.overflow = 'hidden';
}

function closeGalleryModal() {
  document.getElementById('galleryModal').setAttribute('hidden', '');
  document.body.style.overflow = '';
}

// Close gallery modal on overlay click
document.getElementById('galleryModal')?.addEventListener('click', (e) => {
  if (e.target === e.currentTarget) closeGalleryModal();
});

// ═══════════ LIGHTBOX ═══════════
function openLightbox(cat, index) {
  currentCategory = cat;
  currentPhotoIndex = index;
  updateLightbox();
  document.getElementById('lightbox').removeAttribute('hidden');
}

function updateLightbox() {
  const photos = galleryData[currentCategory]?.photos || [];
  if (photos.length === 0) return;
  const photo = photos[currentPhotoIndex];
  document.getElementById('lightboxImg').src = photo.src;
  document.getElementById('lightboxCaption').textContent = photo.caption;
}

function closeLightbox() {
  document.getElementById('lightbox').setAttribute('hidden', '');
}

function nextPhoto() {
  const photos = galleryData[currentCategory]?.photos || [];
  if (photos.length === 0) return;
  currentPhotoIndex = (currentPhotoIndex + 1) % photos.length;
  updateLightbox();
}

function prevPhoto() {
  const photos = galleryData[currentCategory]?.photos || [];
  if (photos.length === 0) return;
  currentPhotoIndex = (currentPhotoIndex - 1 + photos.length) % photos.length;
  updateLightbox();
}

// Close modals on escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    // Experience modal
    const expOverlay = document.getElementById('expModalOverlay');
    if (expOverlay && expOverlay.classList.contains('active')) {
      closeExpModal();
      return;
    }
    // Lightbox & gallery modal
    const lightbox = document.getElementById('lightbox');
    const galleryModal = document.getElementById('galleryModal');
    if (lightbox && !lightbox.hasAttribute('hidden')) {
      closeLightbox();
    } else if (galleryModal && !galleryModal.hasAttribute('hidden')) {
      closeGalleryModal();
    }
  }
  const lightbox = document.getElementById('lightbox');
  if (lightbox && !lightbox.hasAttribute('hidden')) {
    if (e.key === 'ArrowRight') nextPhoto();
    if (e.key === 'ArrowLeft') prevPhoto();
  }
});

document.getElementById('lightbox')?.addEventListener('click', (e) => {
  if (e.target === e.currentTarget) closeLightbox();
});
