// Renders each page from content/site.json so all text/content is CMS-editable.
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
    ${a.paragraphs.map((p) => `<p class="about-overview">${esc(p)}</p>`).join('')}
    <div class="vm-grid">
      <div class="vm-card"><h3>Our Vision</h3><p>${esc(a.vision)}</p></div>
      <div class="vm-card"><h3>Our Mission</h3><p>${esc(a.mission)}</p></div>
    </div>
    <p class="section-tag center" style="margin-top:56px">Our Core Values</p>
    <div class="pill-grid">
      ${a.coreValues.map((v) => `<span>${esc(v)}</span>`).join('')}
    </div>
    <div class="motto">
      <p>&ldquo;${esc(a.mottoQuote)}&rdquo;</p>
      <span>${esc(a.mottoSub)}</span>
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
    ${f.paragraphs.map((p) => `<p>${esc(p)}</p>`).join('')}
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
        <a class="brochure-card" href="${esc(item.image)}" download>
          <img src="${esc(item.image)}" alt="${esc(item.alt)}">
          <span class="brochure-download">Download</span>
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
    <form class="full-form" id="contact-form" action="https://formspree.io/f/xvkpkwbp" method="POST">
      <input type="hidden" name="_subject" value="New message from the website">
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
      <p>${esc(s.body)}</p>
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
  const response = await fetch('content/site.json');
  const data = await response.json();

  renderBrandText(data);
  renderHero(data);
  renderHomeExplore(data);
  renderAbout(data);
  renderFounder(data);
  renderServices(data);
  renderMediation(data);
  renderTools(data);
  renderBrochures(data);
  renderFees(data);
  renderCommunity(data);
  renderContact(data);
  renderFooter(data);
  renderLegal(data);
  highlightActiveNav();

  document.dispatchEvent(new CustomEvent('content:rendered'));
}

renderSite().catch((err) => {
  console.error('Failed to render site content:', err);
});
