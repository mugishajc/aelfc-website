// Renders the entire page from content/site.json so all text/content is CMS-editable.
// Structure (section wrappers, ids, classes) stays fixed; only inner content is data-driven.

function esc(str) {
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function waLink(phoneDigits, text) {
  return `https://wa.me/${phoneDigits}?text=${encodeURIComponent(text)}`;
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
      <a href="#fees" class="btn btn-gold">${esc(h.primaryCtaLabel)}</a>
      <a href="#services" class="btn btn-outline">${esc(h.secondaryCtaLabel)}</a>
    </div>
    <ul class="hero-stats">
      ${h.stats.map((s) => `<li><strong>${esc(s.value)}</strong><span>${esc(s.label)}</span></li>`).join('')}
    </ul>
  `;
  document.getElementById('hero-media').innerHTML = `<img src="${esc(h.image)}" alt="${esc(h.imageAlt)}">`;
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
    <a href="#contact" class="btn btn-navy">${esc(f.ctaLabel)}</a>
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
    const link = waLink(phone, `Hi AELFC, I'd like to request ${item.requestText}.`);
    return `
      <article class="card">
        <h3>${esc(item.title)}</h3>
        ${body}
        <a class="card-request" href="${link}" target="_blank" rel="noopener">Request this service &rarr;</a>
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
  document.getElementById('mediation-content').innerHTML = `
    <p class="section-tag center">${esc(m.tag)}</p>
    <h2 class="center">${esc(m.heading)}</h2>
    <p class="section-lede center">${esc(m.lede)}</p>
    <div class="pill-grid">${m.items.map((i) => `<span>${esc(i)}</span>`).join('')}</div>
  `;
}

function renderTools(data) {
  if (!document.getElementById('tools-content')) return;
  const t = data.tools;
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
    const link = waLink(phone, item.whatsappText);
    const featuredClass = item.featured ? ' featured' : '';
    const badge = item.featured && item.badge ? `<p class="badge">${esc(item.badge)}</p>` : '';
    const btnClass = item.featured ? 'btn-gold-small' : 'btn-outline-small';
    return `
      <div class="fee-card${featuredClass}">
        ${badge}
        <h3>${esc(item.title)}</h3>
        <p class="price">${esc(item.price)}</p>
        <a class="btn ${btnClass}" href="${link}" target="_blank" rel="noopener">Book via WhatsApp</a>
      </div>
    `;
  }).join('');

  const serviceOptions = f.items.map((item) => `<option value="${esc(item.title)}">${esc(item.title)}</option>`).join('')
    + '<option value="Other / not sure yet">Other / not sure yet</option>';

  document.getElementById('fees-content').innerHTML = `
    <p class="section-tag center">${esc(f.tag)}</p>
    <h2 class="center">${esc(f.heading)}</h2>
    <p class="section-lede center">${esc(f.lede)}</p>
    <div class="fees-grid">${cards}</div>
    <div class="booking-form-wrap">
      <p class="section-tag center">${esc(f.formTag)}</p>
      <h3 class="center">${esc(f.formHeading)}</h3>
      <p class="section-lede center">${esc(f.formLede)}</p>
      <form class="booking-form" id="booking-form" action="https://formspree.io/f/xvkpkwbp" method="POST">
        <input type="hidden" name="_subject" value="New booking request from the website">
        <label>Full name<input type="text" name="name" required></label>
        <label>Email<input type="email" name="email" required></label>
        <label>Phone number<input type="tel" name="phone" required></label>
        <label>Service you'd like to book<select name="service" required>${serviceOptions}</select></label>
        <label>What do you do? (career / profession)<input type="text" name="profession" required></label>
        <label class="full-width">What do you hope to gain from this session?<textarea name="goal" rows="3" required></textarea></label>
        <button type="submit" class="btn btn-navy full-width">Submit Booking Request</button>
        <p class="form-note full-width" id="booking-note"></p>
      </form>
    </div>
  `;
}

function renderCommunity(data) {
  if (!document.getElementById('community-content')) return;
  const c = data.community;
  const link = waLink(data.contactInfo.phoneDigits, c.ctaWhatsappText);
  document.getElementById('community-content').innerHTML = `
    <p class="section-tag center">${esc(c.tag)}</p>
    <h2 class="center">${esc(c.heading)}</h2>
    <p class="section-lede center">${esc(c.text)}</p>
    <div class="center" style="margin-top:32px">
      <a class="btn btn-navy" href="${link}" target="_blank" rel="noopener">${esc(c.ctaLabel)}</a>
    </div>
  `;
}

function renderContact(data) {
  if (!document.getElementById('contact-copy')) return;
  const c = data.contact;
  const info = data.contactInfo;
  document.getElementById('contact-copy').innerHTML = `
    <p class="section-tag">${esc(c.tag)}</p>
    <h2>${esc(c.heading)}</h2>
    <p>${esc(c.text)}</p>
    <ul class="contact-list">
      <li><span class="contact-label">Email</span><a href="mailto:${esc(info.email)}">${esc(info.email)}</a></li>
      <li><span class="contact-label">Phone</span><a href="tel:+${esc(info.phoneDigits)}">${esc(info.phoneDisplay)}</a></li>
      <li><span class="contact-label">WhatsApp</span><a href="https://wa.me/${esc(info.phoneDigits)}" target="_blank" rel="noopener">Chat with us</a></li>
      <li><span class="contact-label">Website</span><span>${esc(info.website)}</span></li>
    </ul>
  `;
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

async function renderSite() {
  const response = await fetch('content/site.json');
  const data = await response.json();

  renderBrandText(data);
  renderHero(data);
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

  document.dispatchEvent(new CustomEvent('content:rendered'));
}

renderSite().catch((err) => {
  console.error('Failed to render site content:', err);
});
