// Main script to render the team members grid & projects dynamically based on the browser's language.
// Relies on global MEMBERS and PROJECTS data.

document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('members-grid');
  const filterBar = document.getElementById('filter-bar');
  const projectsGrid = document.getElementById('projects-grid');

  // ── DICCIONARIO DE TRADUCCIONES ──
  const TRANSLATIONS = {
    es: {
      docTitle: "Kuskat Labs",
      metaDesc: "Equipo de desarrollo. Habilidades reales, código en producción, gente que entrega.",
      navTeam: "equipo",
      navProjects: "proyectos",
      navGithub: "github",
      githubAria: "Organización de GitHub de Kuskat Labs",
      heroEyebrow: "Colectivo de ingeniería",
      heroTitleText: "construimos",
      heroSubtitle: "Un colectivo de desarrolladores que construye software con intención. Sin humo, sin palabras de moda — solo código limpio que escala.",
      statMembers: "miembros",
      statSkills: "habilidades",
      statProjects: "proyectos",
      scrollText: "desplazar",
      teamHeading: "el equipo",
      projectsHeading: "proyectos destacados",
      skillsLabel: "Habilidades:",
      allFilter: "Todo",
      codeLink: "Código",
      demoLink: "Demo",
      footerTagline: "construido con intención & cafeína",
      githubLabel: "GitHub",
      linkedinLabel: "LinkedIn",
      emailLabel: "Correo"
    },
    en: {
      docTitle: "Kuskat Labs",
      metaDesc: "Development team. Real skills, code in production, people who deliver.",
      navTeam: "team",
      navProjects: "projects",
      navGithub: "github",
      githubAria: "Kuskat Labs GitHub Organization",
      heroEyebrow: "Engineering collective",
      heroTitleText: "we build",
      heroSubtitle: "An engineering collective building software with intention. No fluff, no buzzwords — just clean code that scales.",
      statMembers: "members",
      statSkills: "skills",
      statProjects: "projects",
      scrollText: "scroll",
      teamHeading: "the team",
      projectsHeading: "featured projects",
      skillsLabel: "Skills:",
      allFilter: "All",
      codeLink: "Code",
      demoLink: "Demo",
      footerTagline: "built with intention & caffeine",
      githubLabel: "GitHub",
      linkedinLabel: "LinkedIn",
      emailLabel: "Email"
    }
  };

  // Mapeo de colores neutros premium para la escala de grises
  const NEUTRAL_COLORS = [
    '#ffffff', // Blanco puro
    '#e4e4e7', // Gris zinc claro
    '#a1a1aa', // Gris medio
    '#71717a', // Gris oscuro
    '#e4e4e7',
    '#ffffff'
  ];

  // ── DETECTAR IDIOMA DEL NAVEGADOR ──
  const browserLang = navigator.language || navigator.userLanguage || 'es';
  const lang = browserLang.toLowerCase().startsWith('en') ? 'en' : 'es';
  const t = TRANSLATIONS[lang];

  // ── TRADUCIR CONTENIDO ESTÁTICO DE LA INTERFAZ ──
  function translateStaticUI() {
    // Título y meta descripción
    document.title = t.docTitle;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) metaDescription.setAttribute('content', t.metaDesc);

    // Navbar
    const navLinks = document.querySelectorAll('.nav-links a');
    if (navLinks.length >= 3) {
      navLinks[0].textContent = t.navTeam;
      navLinks[1].textContent = t.navProjects;
      navLinks[2].textContent = t.navGithub;
      navLinks[2].setAttribute('aria-label', t.githubAria);
    }

    // Hero
    const heroEyebrow = document.querySelector('.hero-eyebrow');
    if (heroEyebrow) heroEyebrow.textContent = t.heroEyebrow;

    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
      heroTitle.innerHTML = `
        ${t.heroTitleText}
        <span class="line-accent">kuskat labs</span>
      `;
    }

    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) heroSubtitle.textContent = t.heroSubtitle;

    // Hero Stats Labels
    const statLabels = document.querySelectorAll('.stat-label');
    if (statLabels.length >= 3) {
      statLabels[0].textContent = t.statMembers;
      statLabels[1].textContent = t.statSkills;
      statLabels[2].textContent = t.statProjects;
    }

    // Scroll button
    const scrollText = document.querySelector('.scroll-text');
    if (scrollText) scrollText.textContent = t.scrollText;

    // Sección Cabeceras
    const teamHeading = document.getElementById('team-heading');
    if (teamHeading) teamHeading.textContent = t.teamHeading;

    const projectsHeading = document.getElementById('projects-heading');
    if (projectsHeading) projectsHeading.textContent = t.projectsHeading;

    // Footer
    const footerTagline = document.querySelector('.footer-tagline');
    if (footerTagline) footerTagline.innerHTML = t.footerTagline;
  }

  /**
   * Render member cards based on the selected language and filter.
   * @param {string} filter - optional search term to filter members.
   */
  function renderMembers(filter = '') {
    grid.innerHTML = '';

    const term = filter.trim().toLowerCase();
    const filtered = MEMBERS.filter(m => {
      if (!term) return true;
      const inName = m.name.toLowerCase().includes(term);
      const inRole = m.role[lang].toLowerCase().includes(term);
      const inSkills = m.skills.some(s => s.toLowerCase().includes(term));
      return inName || inRole || inSkills;
    });

    filtered.forEach((m, index) => {
      const card = document.createElement('div');
      card.className = 'card fade-in';
      
      const neutralColor = NEUTRAL_COLORS[index % NEUTRAL_COLORS.length];
      card.style.setProperty('--member-color', neutralColor);

      // Top part: avatar + name/role
      const top = document.createElement('div');
      top.className = 'card-top';
      const isImg = m.avatar && (m.avatar.includes('.') || m.avatar.includes('/'));
      const avatarContent = isImg 
        ? `<img src="${m.avatar}" alt="${m.name}">` 
        : m.avatar;
      top.innerHTML = `
        <div class="avatar">${avatarContent}</div>
        <div>
          <h3 class="card-name">
            ${m.name}
            <span class="cursor-blink" aria-hidden="true"></span>
          </h3>
          <p class="card-role">${m.role[lang]}</p>
        </div>
      `;
      card.appendChild(top);

      // Bio
      const bio = document.createElement('p');
      bio.className = 'card-bio';
      bio.textContent = m.bio[lang];
      card.appendChild(bio);

      // Skills block
      const skillsBlock = document.createElement('div');
      skillsBlock.className = 'skills-block';
      skillsBlock.innerHTML = `
        <div class="skills-prompt">${t.skillsLabel}</div>
        <div class="skills-list">
          ${m.skills.map(s => `<span class="skill-tag">${s}</span>`).join('')}
        </div>
      `;
      card.appendChild(skillsBlock);

      // Contact row
      const contact = document.createElement('div');
      contact.className = 'contact-row';
      contact.innerHTML = `
        <a href="${m.contact.github}" target="_blank" rel="noopener" aria-label="GitHub ${m.name}" class="contact-link">${t.githubLabel}</a>
        <a href="${m.contact.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn ${m.name}" class="contact-link">${t.linkedinLabel}</a>
        <a href="mailto:${m.contact.email}" aria-label="Email ${m.name}" class="contact-link">${t.emailLabel}</a>
      `;
      card.appendChild(contact);

      grid.appendChild(card);
    });

    // Update member count in hero stats
    const memberCountEl = document.getElementById('member-count');
    if (memberCountEl) memberCountEl.textContent = MEMBERS.length;
  }

  /**
   * Render projects based on the selected language.
   */
  function renderProjects() {
    if (!projectsGrid || typeof PROJECTS === 'undefined') return;
    projectsGrid.innerHTML = '';

    PROJECTS.forEach(p => {
      const pCard = document.createElement('div');
      pCard.className = 'project-card';
      
      pCard.innerHTML = `
        <div class="project-header">
          <span class="project-year">${p.year}</span>
          <h3 class="project-title">${p.title}</h3>
        </div>
        <p class="project-desc">${p.description[lang]}</p>
        <div class="project-tech">
          ${p.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
        </div>
        <div class="project-links">
          <a href="${p.links.github}" target="_blank" rel="noopener" aria-label="${t.codeLink} ${p.title}" class="project-link">
            ${t.codeLink}
          </a>
          <a href="${p.links.live}" target="_blank" rel="noopener" aria-label="${t.demoLink} ${p.title}" class="project-link">
            ${t.demoLink}
          </a>
        </div>
      `;
      projectsGrid.appendChild(pCard);
    });

    // Update project count in hero stats
    const projectCountEl = document.getElementById('project-count');
    if (projectCountEl) projectCountEl.textContent = PROJECTS.length;
  }

  // ── INICIALIZACIÓN ──
  translateStaticUI();
  renderMembers();
  renderProjects();

  // Update skill counter in hero stats
  const skillCountEl = document.getElementById('skill-count');
  if (skillCountEl) {
    const uniq = new Set();
    MEMBERS.forEach(m => m.skills.forEach(s => uniq.add(s)));
    skillCountEl.textContent = uniq.size;
  }

  // Generate filter buttons dynamically
  if (filterBar) {
    filterBar.innerHTML = '';

    const makeBtn = (label, filterValue) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'filter-btn';
      if (filterValue === '') btn.classList.add('active');
      btn.textContent = label;
      
      btn.addEventListener('click', () => {
        filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderMembers(filterValue);
      });
      return btn;
    };

    // Add translated "All" button
    filterBar.appendChild(makeBtn(t.allFilter, ''));

    // Gather and sort skills alphabetically
    const skillSet = new Set();
    MEMBERS.forEach(m => m.skills.forEach(s => skillSet.add(s)));
    const skills = Array.from(skillSet).sort((a, b) => a.localeCompare(b));
    
    skills.forEach(skill => {
      filterBar.appendChild(makeBtn(skill, skill));
    });
  }

  // Smooth scroll logic for nav logo
  const logo = document.getElementById('nav-logo');
  if (logo) {
    logo.style.cursor = 'pointer';
    logo.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
