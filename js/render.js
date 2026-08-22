// Renders each page from the per-section JSON files in content/ so all text/content is CMS-editable.
// Structure (section wrappers, ids, classes) stays fixed; only inner content is data-driven.
// Every page includes this same script — each render*() function only acts if its
// target container exists on the current page, so one file serves every page.

function esc(str) {
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function waLink(phoneDigits, text) {
  return `https://wa.me/${phoneDigits}?text=${encodeURIComponent(text)}`;
}

function formLink(topic) {
  return `contact.html?topic=${encodeURIComponent(topic)}`;
}

function renderBrandText(data) {
  const b = data.brand;
  document.querySelectorAll('#brand-text').forEach((el) => {
    el.innerHTML = `<strong>${esc(b.name)}</strong> ${esc(b.suffix)}<small>${esc(b.tagline)}</small>`;
  });
}

function renderHero(data) {
  if (!document.getElementById('hero-copy')) return;
  const h = data.hero;
  document.getElementById('hero-copy').innerHTML = `
    <p class="eyebrow">${esc(h.eyebrow)}</p>
    <h1>${esc(h.headlineStart)} <span>${esc(h.headlineHighlight)}</span> ${esc(h.headlineEnd)}</h1>
    <p class="hero-lede">${esc(h.lede)}</p>
    <div class="hero-actions">
      <a href="fees.html" class="btn btn-gold">${esc(h.primaryCtaLabel)}</a>
      <a href="services.html" class="btn btn-outline">${esc(h.secondaryCtaLabel)}</a>
    </div>
    <ul class="hero-stats">
      ${h.stats.map((s) => `<li><strong>${esc(s.value)}</strong><span>${esc(s.label)}</span></li>`).join('')}
    </ul>
  `;
  const heroMedia = document.getElementById('hero-media');
  const images = (h.images && h.images.length) ? h.images : [];
  heroMedia.innerHTML = images.map((img, i) =>
    `<img src="${esc(img.src)}" alt="${esc(img.alt)}" class="hero-slide${i === 0 ? ' active' : ''}">`
  ).join('');

  if (images.length > 1) {
    const slides = heroMedia.querySelectorAll('.hero-slide');
    let idx = 0;
    setInterval(() => {
      slides[idx].classList.remove('active');
      idx = (idx + 1) % slides.length;
      slides[idx].classList.add('active');
    }, 4000);
  }
}

function renderHomeExplore(data) {
  const container = document.getElementById('explore-content');
  if (!container) return;
  const tiles = [
    { href: 'about.html', tag: data.about.tag, title: data.about.heading, blurb: data.about.lede },
    { href: 'services.html', tag: data.services.tag, title: data.services.heading, blurb: 'Legal, financial, mediation and business advisory services.' },
    { href: 'mediation.html', tag: data.mediation.tag, title: data.mediation.heading, blurb: data.mediation.lede },
    { href: 'tools.html', tag: data.tools.tag, title: data.tools.heading, blurb: data.tools.lede },
    { href: 'resources.html', tag: data.resources.tag, title: data.resources.heading, blurb: data.resources.lede },
    { href: 'events.html', tag: data.events.tag, title: data.events.heading, blurb: data.events.lede },
    { href: 'brochures.html', tag: data.brochures.tag, title: data.brochures.heading, blurb: data.brochures.lede },
    { href: 'fees.html', tag: data.fees.tag, title: data.fees.heading, blurb: data.fees.lede },
    { href: 'community.html', tag: data.community.tag, title: data.community.heading, blurb: data.community.text },
    { href: 'contact.html', tag: data.contact.tag, title: data.contact.heading, blurb: data.contact.text }
  ];
  const trim = (s) => (s && s.length > 110 ? s.slice(0, 110).trim() + '…' : s || '');
  container.innerHTML = `
    <p class="section-tag center">Explore</p>
    <h2 class="center">Find What You Need</h2>
    <div class="explore-grid">
      ${tiles.map((t) => `
        <a class="explore-tile" href="${t.href}">
          <span class="explore-tag">${esc(t.tag)}</span>
          <h3>${esc(t.title)}</h3>
          <p>${esc(trim(t.blurb))}</p>
          <span class="explore-arrow">Learn more &rarr;</span>
        </a>
      `).join('')}
    </div>
  `;
}

function renderAbout(data) {
  if (!document.getElementById('about-content')) return;
  const a = data.about;
  document.getElementById('about-content').innerHTML = `
    <p class="section-tag center">${esc(a.tag)}</p>
    <h2 class="center">${esc(a.heading)}</h2>
    <p class="section-lede center">${esc(a.lede)}</p>
    <p class="section-tag center" style="margin-top:40px">Company Background</p>
    ${a.paragraphs.map((p) => `<p class="about-overview">${esc(p)}</p>`).join('')}
    <p class="section-tag center" style="margin-top:56px">Mission, Vision &amp; Core Values</p>
    <div class="vm-grid">
      <div class="vm-card"><h3>Our Vision</h3><p>${esc(a.vision)}</p></div>
      <div class="vm-card"><h3>Our Mission</h3><p>${esc(a.mission)}</p></div>
    </div>
    <p class="section-tag center" style="margin-top:40px">Our Core Values</p>
    <div class="pill-grid">
      ${a.coreValues.map((v) => `<span>${esc(v)}</span>`).join('')}
    </div>
    <div class="motto">
      <p>&ldquo;${esc(a.mottoQuote)}&rdquo;</p>
      <span>${esc(a.mottoSub)}</span>
    </div>
  `;
}

function renderApproach(data) {
  const container = document.getElementById('approach-content');
  if (!container) return;
  const a = data.approach;
  container.innerHTML = `
    <p class="section-tag center">${esc(a.tag)}</p>
    <h2 class="center">${esc(a.heading)}</h2>
    <div class="approach-grid">
      ${a.items.map((item) => `
        <div class="approach-card">
          <h3>${esc(item.title)}</h3>
          <p>${esc(item.text)}</p>
        </div>
      `).join('')}
    </div>
  `;
}

function renderTeam(data) {
  const container = document.getElementById('team-content');
  if (!container) return;
  const t = data.team;
  const section = container.closest('section');
  if (!t.items || !t.items.length) {
    if (section) section.style.display = 'none';
    return;
  }
  container.innerHTML = `
    <p class="section-tag center">${esc(t.tag)}</p>
    <h2 class="center">${esc(t.heading)}</h2>
    <div class="team-grid">
      ${t.items.map((member) => `
        <div class="team-card">
          ${member.photo ? `<img src="${esc(member.photo)}" alt="${esc(member.name)}">` : ''}
          <h3>${esc(member.name)}</h3>
          <p class="team-role">${esc(member.role)}</p>
          <p>${esc(member.bio)}</p>
        </div>
      `).join('')}
    </div>
  `;
}

function renderFounder(data) {
  if (!document.getElementById('founder-media')) return;
  const f = data.founder;
  document.getElementById('founder-media').innerHTML = `<img src="${esc(f.image)}" alt="${esc(f.imageAlt)}">`;
  document.getElementById('founder-copy').innerHTML = `
    <p class="section-tag">${esc(f.tag)}</p>
    <h2>${esc(f.name)}</h2>
    <p class="about-role">${esc(f.role)}</p>
    ${f.paragraphs.map((p) => `<p class="founder-bio">${esc(p)}</p>`).join('')}
    <div class="expertise-pills">
      ${f.expertise.map((x) => `<span>${esc(x)}</span>`).join('')}
    </div>
    <blockquote class="philosophy">&ldquo;${esc(f.quote)}&rdquo;</blockquote>
    <a href="contact.html" class="btn btn-navy">${esc(f.ctaLabel)}</a>
  `;
}

function renderServices(data) {
  if (!document.getElementById('services-content')) return;
  const s = data.services;
  const phone = data.contactInfo.phoneDigits;
  const cards = s.items.map((item) => {
    const body = item.bullets && item.bullets.length
      ? `<ul>${item.bullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>`
      : `<p>${esc(item.description)}</p>`;
    const waHref = waLink(phone, `Hi AELFC, I'd like to request ${item.requestText}.`);
    return `
      <article class="card">
        <h3>${esc(item.title)}</h3>
        ${body}
        <div class="card-cta">
          <a class="card-request" href="${waHref}" target="_blank" rel="noopener">Chat on WhatsApp</a>
          <a class="card-request-alt" href="${formLink(item.title)}">or fill in a form</a>
        </div>
      </article>
    `;
  }).join('');
  document.getElementById('services-content').innerHTML = `
    <p class="section-tag center">${esc(s.tag)}</p>
    <h2 class="center">${esc(s.heading)}</h2>
    <div class="cards-grid">${cards}</div>
  `;
}

function renderMediation(data) {
  if (!document.getElementById('mediation-content')) return;
  const m = data.mediation;
  const waHref = waLink(data.contactInfo.phoneDigits, "Hi AELFC, I'd like to discuss a dispute that needs mediation.");
  document.getElementById('mediation-content').innerHTML = `
    <p class="section-tag center">${esc(m.tag)}</p>
    <h2 class="center">${esc(m.heading)}</h2>
    <p class="section-lede center">${esc(m.lede)}</p>
    <div class="pill-grid">${m.items.map((i) => `<span>${esc(i)}</span>`).join('')}</div>
    <p class="section-lede center" style="margin-top:32px">
      Ready to talk it through?
      <a class="card-request-alt" href="${waHref}" target="_blank" rel="noopener">Chat on WhatsApp</a>
      or <a class="card-request-alt" href="${formLink('Mediation Services')}">fill in a form</a>.
    </p>
  `;
}

function renderTools(data) {
  if (!document.getElementById('tools-content')) return;
  const t = data.tools;
  const waHref = waLink(data.contactInfo.phoneDigits, "Hi AELFC, I'd like early access to your resources (books / templates / calculators).");
  document.getElementById('tools-content').innerHTML = `
    <p class="section-tag light">${esc(t.tag)}</p>
    <h2 class="light">${esc(t.heading)}</h2>
    <p class="section-lede light">${esc(t.lede)}</p>
    <div class="calc-grid">
      <div class="calc-card">
        <h3>Compound Interest Calculator</h3>
        <label>Principal amount<input type="number" id="ci-principal" value="1000000" min="0"></label>
        <label>Annual interest rate (%)<input type="number" id="ci-rate" value="10" min="0" step="0.1"></label>
        <label>Number of years<input type="number" id="ci-years" value="5" min="0" step="1"></label>
        <label>Compounding frequency per year<input type="number" id="ci-freq" value="12" min="1" step="1"></label>
        <button type="button" class="btn btn-gold-small" id="ci-calc">Calculate</button>
        <p class="calc-result" id="ci-result"></p>
      </div>
      <div class="calc-card">
        <h3>Loan Repayment Calculator</h3>
        <label>Loan amount<input type="number" id="lr-amount" value="5000000" min="0"></label>
        <label>Annual interest rate (%)<input type="number" id="lr-rate" value="16" min="0" step="0.1"></label>
        <label>Loan term (months)<input type="number" id="lr-months" value="24" min="1" step="1"></label>
        <button type="button" class="btn btn-gold-small" id="lr-calc">Calculate</button>
        <p class="calc-result" id="lr-result"></p>
      </div>
    </div>
    <p class="section-tag light" style="margin-top:56px">${esc(t.comingSoonLabel)}</p>
    <div class="tools-list">${t.comingSoon.map((x) => `<span>${esc(x)}</span>`).join('')}</div>
    <p class="section-lede light" style="margin-top:24px">
      Want early access to a resource, or need one sent to you directly?
      <a class="card-request-alt light" href="${waHref}" target="_blank" rel="noopener">Chat on WhatsApp</a>
      or <a class="card-request-alt light" href="${formLink('Resources (books / templates / calculators)')}">fill in a form</a>.
    </p>
  `;
}

function renderBrochures(data) {
  if (!document.getElementById('brochures-content')) return;
  const b = data.brochures;
  document.getElementById('brochures-content').innerHTML = `
    <p class="section-tag center">${esc(b.tag)}</p>
    <h2 class="center">${esc(b.heading)}</h2>
    <p class="section-lede center">${esc(b.lede)}</p>
    <div class="brochure-grid">
      ${b.items.map((item) => `
        <div class="brochure-card">
          <img src="${esc(item.image)}" alt="${esc(item.alt)}">
          <a class="brochure-download" href="${esc(item.image)}" download>Download</a>
        </div>
      `).join('')}
    </div>
  `;
}

function renderCertifications(data) {
  const container = document.getElementById('certifications-content');
  if (!container) return;
  const c = data.certifications;
  const section = container.closest('section');
  if (!c.items || !c.items.length) {
    if (section) section.style.display = 'none';
    return;
  }
  container.innerHTML = `
    <p class="section-tag center">${esc(c.tag)}</p>
    <h2 class="center">${esc(c.heading)}</h2>
    <p class="section-lede center">${esc(c.lede)}</p>
    <div class="cert-grid">
      ${c.items.map((item) => `
        <a class="cert-card" href="${esc(item.file)}" target="_blank" rel="noopener">
          ${item.image ? `<img src="${esc(item.image)}" alt="${esc(item.title)}">` : ''}
          <h3>${esc(item.title)}</h3>
          ${item.description ? `<p>${esc(item.description)}</p>` : ''}
          <span class="cert-view">View Certificate &rarr;</span>
        </a>
      `).join('')}
    </div>
  `;
}

function renderFees(data) {
  if (!document.getElementById('fees-content')) return;
  const f = data.fees;
  const phone = data.contactInfo.phoneDigits;
  const cards = f.items.map((item) => {
    const waHref = waLink(phone, item.whatsappText);
    const featuredClass = item.featured ? ' featured' : '';
    const badge = item.featured && item.badge ? `<p class="badge">${esc(item.badge)}</p>` : '';
    const btnClass = item.featured ? 'btn-gold-small' : 'btn-outline-small';
    return `
      <div class="fee-card${featuredClass}">
        ${badge}
        <h3>${esc(item.title)}</h3>
        <p class="price">${esc(item.price)}</p>
        <a class="btn ${btnClass}" href="${waHref}" target="_blank" rel="noopener">Chat on WhatsApp</a>
        <a class="card-request-alt" href="${formLink(item.title)}">or fill in a form</a>
      </div>
    `;
  }).join('');

  document.getElementById('fees-content').innerHTML = `
    <p class="section-tag center">${esc(f.tag)}</p>
    <h2 class="center">${esc(f.heading)}</h2>
    <p class="section-lede center">${esc(f.lede)}</p>
    <div class="fees-grid">${cards}</div>
    <p class="section-lede center" style="margin-top:40px">Prefer one place for everything? <a href="contact.html">Use our contact form</a> — it covers every service and package.</p>
  `;
}

function renderResources(data) {
  if (!document.getElementById('resources-content')) return;
  const r = data.resources;
  const n = r.newsletter;
  document.getElementById('resources-content').innerHTML = `
    <p class="section-tag center">${esc(r.tag)}</p>
    <h2 class="center">${esc(r.heading)}</h2>
    <p class="section-lede center">${esc(r.lede)}</p>
    <div class="newsletter-card">
      <h3>${esc(n.heading)}</h3>
      <p>${esc(n.text)}</p>
      <form class="newsletter-form" id="newsletter-form" data-form-type="newsletter">
        <input type="text" name="company_website" class="hp-field" tabindex="-1" autocomplete="off">
        <input type="email" name="email" placeholder="you@example.com" required>
        <button type="submit" class="btn btn-gold">${esc(n.buttonLabel)}</button>
      </form>
      <p class="form-note" id="newsletter-note"></p>
    </div>
    <p class="section-lede center" style="margin-top:24px">Looking for our calculators? <a href="tools.html">Visit the Tools page</a>.</p>
  `;
}

function renderResourceBlog(data) {
  const container = document.getElementById('resources-blog-content');
  if (!container) return;
  const b = data.resources.blog;
  const section = container.closest('section');

  const nowIso = new Date().toISOString();
  const visible = (b.items || []).filter((post) => {
    if (post.published === false) return false;
    if (post.publishDate && post.publishDate > nowIso) return false;
    return true;
  });
  visible.sort((a, b2) => (b2.featured ? 1 : 0) - (a.featured ? 1 : 0));

  if (!visible.length) {
    if (section) section.style.display = 'none';
    return;
  }

  const categories = [...new Set(visible.map((p) => p.category).filter(Boolean))];

  container.innerHTML = `
    <p class="section-tag center">${esc(b.tag)}</p>
    <h2 class="center">${esc(b.heading)}</h2>
    <div class="blog-controls">
      <input type="search" id="blog-search" placeholder="Search articles...">
      ${categories.length ? `
        <div class="blog-filters" id="blog-filters">
          <button type="button" class="blog-filter active" data-category="">All</button>
          ${categories.map((c) => `<button type="button" class="blog-filter" data-category="${esc(c)}">${esc(c)}</button>`).join('')}
        </div>
      ` : ''}
    </div>
    <div class="blog-grid" id="blog-grid">
      ${visible.map((post) => `
        <a class="blog-card${post.featured ? ' featured' : ''}" href="${esc(post.link)}" target="_blank" rel="noopener"
           data-category="${esc(post.category || '')}"
           data-search="${esc(((post.title || '') + ' ' + (post.excerpt || '') + ' ' + (post.tags || []).join(' ')).toLowerCase())}">
          ${post.featured ? '<span class="blog-featured-badge">Featured</span>' : ''}
          ${post.image ? `<img src="${esc(post.image)}" alt="${esc(post.title)}">` : ''}
          <div class="blog-card-body">
            <div class="blog-card-meta">
              ${post.category ? `<span class="blog-category">${esc(post.category)}</span>` : ''}
              ${post.date ? `<span class="blog-date">${esc(post.date)}</span>` : ''}
            </div>
            <h3>${esc(post.title)}</h3>
            <p>${esc(post.excerpt)}</p>
            ${(post.tags && post.tags.length) ? `<div class="blog-tags">${post.tags.map((t) => `<span>#${esc(t)}</span>`).join('')}</div>` : ''}
          </div>
        </a>
      `).join('')}
    </div>
    <p class="blog-no-results" id="blog-no-results" style="display:none">No articles match your search.</p>
  `;
}

function renderResourceVideos(data) {
  const container = document.getElementById('resources-videos-content');
  if (!container) return;
  const v = data.resources.videos;
  const section = container.closest('section');
  if (!v.items || !v.items.length) {
    if (section) section.style.display = 'none';
    return;
  }
  container.innerHTML = `
    <p class="section-tag center">${esc(v.tag)}</p>
    <h2 class="center">${esc(v.heading)}</h2>
    <div class="video-grid">
      ${v.items.map((item) => `
        <div class="video-card">
          <div class="video-embed"><iframe src="${esc(item.embedUrl)}" title="${esc(item.title)}" frameborder="0" allowfullscreen loading="lazy"></iframe></div>
          <h3>${esc(item.title)}</h3>
        </div>
      `).join('')}
    </div>
  `;
}

function formatEventDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

function renderEventsIntro(data) {
  const container = document.getElementById('events-intro-content');
  if (!container) return;
  const e = data.events;
  container.innerHTML = `
    <p class="section-tag center">${esc(e.tag)}</p>
    <h2 class="center">${esc(e.heading)}</h2>
    <p class="section-lede center">${esc(e.lede)}</p>
  `;
}

function splitEvents(items) {
  const todayIso = new Date().toISOString().slice(0, 10);
  const upcoming = items.filter((ev) => ev.date >= todayIso).sort((a, b) => a.date.localeCompare(b.date));
  const past = items.filter((ev) => ev.date < todayIso).sort((a, b) => b.date.localeCompare(a.date));
  return { upcoming, past };
}

function renderEventsUpcoming(data) {
  const container = document.getElementById('events-upcoming-content');
  if (!container) return;
  const section = container.closest('section');
  const { upcoming } = splitEvents(data.events.items || []);
  if (!upcoming.length) {
    if (section) section.style.display = 'none';
    return;
  }
  container.innerHTML = `
    <p class="section-tag center">Upcoming</p>
    <h2 class="center">Upcoming Events</h2>
    <div class="event-grid">
      ${upcoming.map((ev) => `
        <div class="event-card">
          ${ev.image ? `<img src="${esc(ev.image)}" alt="${esc(ev.title)}">` : ''}
          <div class="event-card-body">
            <span class="event-date">${esc(formatEventDate(ev.date))}${ev.time ? ` &middot; ${esc(ev.time)}` : ''}</span>
            <h3>${esc(ev.title)}</h3>
            ${ev.venue ? `<p class="event-venue">${esc(ev.venue)}</p>` : ''}
            <p>${esc(ev.description)}</p>
            ${ev.registrationLink ? `<a class="btn btn-gold-small" href="${esc(ev.registrationLink)}" target="_blank" rel="noopener">Register</a>` : ''}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderEventsPast(data) {
  const container = document.getElementById('events-past-content');
  if (!container) return;
  const section = container.closest('section');
  const { past } = splitEvents(data.events.items || []);
  if (!past.length) {
    if (section) section.style.display = 'none';
    return;
  }
  container.innerHTML = `
    <p class="section-tag center">Past Events</p>
    <h2 class="center">What We've Hosted</h2>
    <div class="event-grid">
      ${past.map((ev) => `
        <div class="event-card">
          ${ev.image ? `<img src="${esc(ev.image)}" alt="${esc(ev.title)}">` : ''}
          <div class="event-card-body">
            <span class="event-date">${esc(formatEventDate(ev.date))}</span>
            <h3>${esc(ev.title)}</h3>
            ${ev.venue ? `<p class="event-venue">${esc(ev.venue)}</p>` : ''}
            <p>${esc(ev.recap || ev.description)}</p>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function classifyAnnouncements(items) {
  const todayIso = new Date().toISOString().slice(0, 10);
  const published = (items || []).filter((a) => a.status === 'Published' && a.publishDate && a.publishDate <= todayIso);
  const active = published.filter((a) => !a.expiryDate || a.expiryDate >= todayIso);
  const past = published.filter((a) => a.expiryDate && a.expiryDate < todayIso);
  active.sort((a, b) => b.publishDate.localeCompare(a.publishDate));
  past.sort((a, b) => b.expiryDate.localeCompare(a.expiryDate));
  return { active, past };
}

function renderAnnouncementBanner(data) {
  const el = document.getElementById('announcement-banner');
  if (!el || !data.announcements) return;
  const { active } = classifyAnnouncements(data.announcements.items || []);
  const urgent = active.find((a) => a.priority === 'Urgent');
  if (!urgent) return;
  const dismissKey = 'dismissed-announcement-' + urgent.title;
  if (sessionStorage.getItem(dismissKey)) return;

  el.innerHTML = `
    <div class="urgent-banner">
      <div class="container urgent-banner-inner">
        <span><strong>${esc(urgent.title)}:</strong> ${esc(urgent.shortDescription)}</span>
        <div class="urgent-banner-actions">
          ${urgent.ctaLink ? `<a href="${esc(urgent.ctaLink)}">${esc(urgent.ctaLabel || 'Learn more')}</a>` : `<a href="announcements.html">Learn more</a>`}
          <button type="button" class="urgent-banner-close" aria-label="Dismiss">&times;</button>
        </div>
      </div>
    </div>
  `;
  const closeBtn = el.querySelector('.urgent-banner-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      sessionStorage.setItem(dismissKey, '1');
      el.innerHTML = '';
    });
  }
}

function shareLinks(title, text) {
  const pageUrl = window.location.origin + window.location.pathname;
  const shareText = encodeURIComponent(`${title} — ${text}`);
  const url = encodeURIComponent(pageUrl);
  return {
    whatsapp: `https://wa.me/?text=${shareText}%20${url}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    twitter: `https://twitter.com/intent/tweet?text=${shareText}&url=${url}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    email: `mailto:?subject=${encodeURIComponent(title)}&body=${shareText}%20${url}`
  };
}

function announcementCard(a) {
  const share = shareLinks(a.title, a.shortDescription);
  return `
    <div class="announcement-card${a.priority === 'Urgent' ? ' urgent' : ''}">
      ${a.image ? `<img src="${esc(a.image)}" alt="${esc(a.title)}">` : ''}
      <div class="announcement-card-body">
        <span class="announcement-category">${esc(a.category)}</span>
        <h3>${esc(a.title)}</h3>
        <span class="event-date">${esc(formatEventDate(a.publishDate))}</span>
        <p>${esc(a.fullDescription || a.shortDescription)}</p>
        ${a.attachment ? `<a class="card-request-alt" href="${esc(a.attachment)}" target="_blank" rel="noopener">View attachment &rarr;</a>` : ''}
        ${a.ctaLink ? `<a class="btn btn-gold-small" href="${esc(a.ctaLink)}" target="_blank" rel="noopener">${esc(a.ctaLabel || 'Learn more')}</a>` : ''}
        ${a.author ? `<p class="announcement-author">${esc(a.author)}</p>` : ''}
        <div class="share-row">
          <span class="share-label">Share:</span>
          <a href="${share.whatsapp}" target="_blank" rel="noopener" aria-label="Share on WhatsApp">WA</a>
          <a href="${share.facebook}" target="_blank" rel="noopener" aria-label="Share on Facebook">FB</a>
          <a href="${share.twitter}" target="_blank" rel="noopener" aria-label="Share on X">X</a>
          <a href="${share.linkedin}" target="_blank" rel="noopener" aria-label="Share on LinkedIn">in</a>
          <a href="${share.email}" aria-label="Share by email">&#9993;</a>
        </div>
      </div>
    </div>
  `;
}

function renderAnnouncementsPage(data) {
  const latestContainer = document.getElementById('announcements-latest-content');
  if (!latestContainer) return;
  const ann = data.announcements;
  const { active, past } = classifyAnnouncements(ann.items || []);

  latestContainer.innerHTML = `
    <p class="section-tag center">${esc(ann.tag)}</p>
    <h2 class="center">${esc(ann.heading)}</h2>
    ${active.length
      ? `<div class="announcement-grid">${active.map(announcementCard).join('')}</div>`
      : `<p class="section-lede center">No active announcements right now — check back soon.</p>`}
  `;

  const pastContainer = document.getElementById('announcements-past-content');
  if (!pastContainer) return;
  const pastSection = pastContainer.closest('section');
  if (!past.length) {
    if (pastSection) pastSection.style.display = 'none';
    return;
  }
  pastContainer.innerHTML = `
    <p class="section-tag center">Past Announcements</p>
    <h2 class="center">Archive</h2>
    <div class="announcement-grid">${past.map(announcementCard).join('')}</div>
  `;
}

function renderTestimonials(data) {
  const container = document.getElementById('testimonials-content');
  if (!container) return;
  const t = data.testimonials;
  const cardsHtml = (t.items && t.items.length) ? `
    <p class="section-tag center">${esc(t.tag)}</p>
    <h2 class="center">${esc(t.heading)}</h2>
    ${t.lede ? `<p class="section-lede center">${esc(t.lede)}</p>` : ''}
    <div class="testimonial-grid">
      ${t.items.map((item) => `
        <div class="testimonial-card${item.testimonial ? '' : ' logo-only'}">
          ${item.logo ? `<img class="testimonial-logo" src="${esc(item.logo)}" alt="${esc(item.clientName)}">` : ''}
          ${item.testimonial ? `<p class="testimonial-quote">&ldquo;${esc(item.testimonial)}&rdquo;</p>` : ''}
          <p class="testimonial-client">${esc(item.clientName)}</p>
          ${item.serviceProvided ? `<p class="testimonial-meta">${esc(item.serviceProvided)}</p>` : ''}
          <p class="testimonial-meta-line">
            ${item.category ? `<span>${esc(item.category)}</span>` : ''}
            ${item.period ? `<span>${esc(item.period)}</span>` : ''}
          </p>
          ${item.fullStory ? `
            <details class="testimonial-story">
              <summary>Read full story</summary>
              <p>${esc(item.fullStory)}</p>
            </details>
          ` : ''}
          ${item.link ? `<a class="card-request-alt" href="${esc(item.link)}" target="_blank" rel="noopener">Visit website &rarr;</a>` : ''}
        </div>
      `).join('')}
    </div>
  ` : '';

  container.innerHTML = `
    ${cardsHtml}
    <div class="testimonial-submit-card">
      <h3>${esc(t.submitHeading)}</h3>
      <p>${esc(t.submitText)}</p>
      <form class="testimonial-form" id="testimonial-form" data-form-type="testimonial">
        <input type="text" name="company_website" class="hp-field" tabindex="-1" autocomplete="off">
        <label>Client / Company Name<input type="text" name="clientName" required></label>
        <label>Your Testimonial<textarea name="testimonial" rows="4" required></textarea></label>
        <label>Service Provided<input type="text" name="serviceProvided" required></label>
        <label>Period / Year Worked Together<input type="text" name="period"></label>
        <label>Category / Industry<input type="text" name="category"></label>
        <label>Website / Social Link <span class="optional-tag">optional</span><input type="text" name="link"></label>
        <button type="submit" class="btn btn-navy">Submit Testimonial</button>
        <p class="form-note" id="testimonial-note"></p>
      </form>
    </div>
  `;
}

function renderDonate(data) {
  const container = document.getElementById('donate-content');
  if (!container) return;
  const d = data.donate;
  const section = container.closest('section');
  if (!d || !d.buttonLink) {
    if (section) section.style.display = 'none';
    return;
  }
  container.innerHTML = `
    <div class="donate-card">
      <p class="section-tag center">${esc(d.tag)}</p>
      <h2 class="center">${esc(d.heading)}</h2>
      <p>${esc(d.text)}</p>
      <a class="btn btn-gold" href="${esc(d.buttonLink)}" target="_blank" rel="noopener">${esc(d.buttonLabel)}</a>
    </div>
  `;
}

function renderCommunity(data) {
  if (!document.getElementById('community-content')) return;
  const c = data.community;
  const waHref = waLink(data.contactInfo.phoneDigits, c.ctaWhatsappText);
  document.getElementById('community-content').innerHTML = `
    <p class="section-tag center">${esc(c.tag)}</p>
    <h2 class="center">${esc(c.heading)}</h2>
    <p class="section-lede center">${esc(c.text)}</p>
    <div class="center" style="margin-top:32px">
      <a class="btn btn-navy" href="${waHref}" target="_blank" rel="noopener">${esc(c.ctaLabel)}</a>
      <div style="margin-top:12px"><a class="card-request-alt" href="${formLink('Partner / Support Our Work')}">or fill in a form</a></div>
    </div>
  `;
}

function renderFAQ(data) {
  const container = document.getElementById('faq-content');
  if (!container) return;
  const f = data.faq;
  const section = container.closest('section');
  if (!f.items || !f.items.length) {
    if (section) section.style.display = 'none';
    return;
  }
  container.innerHTML = `
    <p class="section-tag center">${esc(f.tag)}</p>
    <h2 class="center">${esc(f.heading)}</h2>
    <div class="faq-list">
      ${f.items.map((item) => `
        <details class="faq-item">
          <summary>${esc(item.question)}</summary>
          <p>${esc(item.answer)}</p>
        </details>
      `).join('')}
    </div>
  `;
}

function renderContact(data) {
  if (!document.getElementById('contact-copy')) return;
  const c = data.contact;
  const info = data.contactInfo;
  const waHref = waLink(info.phoneDigits, "Hi AELFC, I'd like to get in touch.");

  document.getElementById('contact-copy').innerHTML = `
    <p class="section-tag">${esc(c.tag)}</p>
    <h2>${esc(c.heading)}</h2>
    <p>${esc(c.text)}</p>
    <ul class="contact-list">
      <li><span class="contact-label">Email</span><a href="mailto:${esc(info.email)}">${esc(info.email)}</a></li>
      <li><span class="contact-label">Phone</span><a href="tel:+${esc(info.phoneDigits)}">${esc(info.phoneDisplay)}</a></li>
      <li><span class="contact-label">WhatsApp</span><a href="${waHref}" target="_blank" rel="noopener">Chat with us</a></li>
      <li><span class="contact-label">Website</span><span>${esc(info.website)}</span></li>
      ${info.businessHours ? `<li><span class="contact-label">Hours</span><span>${esc(info.businessHours)}</span></li>` : ''}
    </ul>
    <a class="btn btn-gold" href="${waHref}" target="_blank" rel="noopener" style="margin-top:8px;display:inline-block">Chat on WhatsApp</a>
  `;

  const formWrap = document.getElementById('contact-form-wrap');
  if (!formWrap) return;

  const serviceOptions = data.services.items.map((i) => `<option value="${esc(i.title)}">${esc(i.title)}</option>`).join('');
  const feeOptions = data.fees.items.map((i) => `<option value="${esc(i.title)}">${esc(i.title)}</option>`).join('');

  formWrap.innerHTML = `
    <p class="section-tag center">Or Fill In This Form</p>
    <h3 class="center">One Form, Every Request</h3>
    <p class="section-lede center">Whatever you need — a service, a booking, a resource, or just a question — this one form reaches us directly.</p>
    <form class="full-form" id="contact-form" data-form-type="contact">
      <input type="text" name="company_website" class="hp-field" tabindex="-1" autocomplete="off">
      <label>Full name<input type="text" name="name" required></label>
      <label>Email<input type="email" name="email" required></label>
      <label>Phone number<input type="tel" name="phone" required></label>
      <label>What are you reaching out about?
        <select name="topic" id="contact-topic" required>
          <option value="">Select one&hellip;</option>
          <optgroup label="Services">${serviceOptions}</optgroup>
          <optgroup label="Fees &amp; Booking">${feeOptions}</optgroup>
          <option value="Resources (books / templates / calculators)">Resources (books / templates / calculators)</option>
          <option value="Partner / Support Our Work">Partner / Support Our Work</option>
          <option value="General Inquiry / Other">General Inquiry / Other</option>
        </select>
      </label>
      <label class="full-width">What do you do? (career / profession) <span class="optional-tag">optional</span><input type="text" name="profession"></label>
      <label class="full-width">Tell us more<textarea name="message" id="contact-message" rows="4" required></textarea></label>
      <button type="submit" class="btn btn-navy full-width">Send</button>
      <p class="form-note full-width" id="form-note"></p>
    </form>
  `;

  const params = new URLSearchParams(window.location.search);
  const topic = params.get('topic');
  if (topic) {
    const select = document.getElementById('contact-topic');
    const matched = Array.from(select.options).some((o) => o.value === topic);
    if (matched) {
      select.value = topic;
      document.getElementById('contact-message').value = `Hi, I'm interested in ${topic}. `;
    }
  }
}

function renderFooter(data) {
  const f = data.footer;
  const footerBrandEl = document.getElementById('footer-brand');
  if (footerBrandEl) {
    footerBrandEl.innerHTML = `
      <img src="assets/images/logo-mark.jpg" alt="Anaclet's Experts emblem">
      <div>
        <strong>${esc(f.companyName)}</strong>
        <p>${esc(f.tagline)}</p>
      </div>
    `;
  }
  const copyrightEl = document.getElementById('copyright-name');
  if (copyrightEl) copyrightEl.textContent = f.copyrightName;

  const socialEl = document.getElementById('footer-social');
  if (socialEl && data.socialLinks) {
    const s = data.socialLinks;
    const platforms = [
      { key: 'facebook', label: 'f', name: 'Facebook' },
      { key: 'instagram', label: 'IG', name: 'Instagram' },
      { key: 'linkedin', label: 'in', name: 'LinkedIn' },
      { key: 'twitter', label: 'X', name: 'X (Twitter)' },
      { key: 'youtube', label: '&#9654;', name: 'YouTube' }
    ];
    const active = platforms.filter((p) => s[p.key]);
    if (active.length) {
      socialEl.innerHTML = active.map((p) =>
        `<a class="social-icon" href="${esc(s[p.key])}" target="_blank" rel="noopener" aria-label="${p.name}">${p.label}</a>`
      ).join('');
    } else {
      socialEl.style.display = 'none';
    }
  }
}

function renderLegal(data) {
  const container = document.getElementById('legal-content');
  if (!container) return;
  const page = document.body.dataset.page; // "privacy" or "refund"
  const legal = data.legal[page];
  if (!legal) return;
  container.innerHTML = `
    <p class="section-tag">Legal</p>
    <h1>${esc(legal.title)}</h1>
    <p class="legal-updated">${esc(legal.updated)}</p>
    ${legal.sections.map((s) => `
      ${s.heading ? `<h2>${esc(s.heading)}</h2>` : ''}
      <p class="legal-body">${esc(s.body)}</p>
    `).join('')}
  `;
}

function highlightActiveNav() {
  const currentPage = document.body.dataset.page;
  if (!currentPage) return;
  document.querySelectorAll('a[data-nav]').forEach((link) => {
    if (link.dataset.nav === currentPage) link.classList.add('active');
  });
}

async function renderSite() {
  const files = [
    'brand', 'hero', 'about', 'founder', 'services', 'mediation', 'tools', 'faq',
    'brochures', 'certifications', 'fees', 'resources', 'testimonials', 'events',
    'announcements', 'donate', 'community', 'contact', 'footer', 'legal'
  ];
  const parts = await Promise.all(files.map(async (name) => {
    const response = await fetch(`content/${name}.json`);
    return response.json();
  }));
  const data = Object.assign({}, ...parts);

  renderBrandText(data);
  renderHero(data);
  renderHomeExplore(data);
  renderAbout(data);
  renderApproach(data);
  renderTeam(data);
  renderFounder(data);
  renderServices(data);
  renderMediation(data);
  renderTools(data);
  renderBrochures(data);
  renderCertifications(data);
  renderFees(data);
  renderResources(data);
  renderResourceBlog(data);
  renderResourceVideos(data);
  renderTestimonials(data);
  renderEventsIntro(data);
  renderEventsUpcoming(data);
  renderEventsPast(data);
  renderAnnouncementBanner(data);
  renderAnnouncementsPage(data);
  renderDonate(data);
  renderCommunity(data);
  renderContact(data);
  renderFAQ(data);
  renderFooter(data);
  renderLegal(data);
  highlightActiveNav();

  document.dispatchEvent(new CustomEvent('content:rendered'));
}

renderSite().catch((err) => {
  console.error('Failed to render site content:', err);
});
