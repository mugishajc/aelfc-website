// Mobile nav toggle (static elements, safe to wire immediately)
const navToggle = document.getElementById('nav-toggle');
const mainNav = document.getElementById('main-nav');

navToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

mainNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Forms submit to our Netlify function (which emails via ZeptoMail) via AJAX
// so visitors stay on the page.
async function handleFormSubmit(form, noteEl, successMessage) {
  noteEl.textContent = 'Sending…';
  const fields = Object.fromEntries(new FormData(form).entries());
  try {
    const response = await fetch('/.netlify/functions/submit-form', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ formType: form.dataset.formType, fields })
    });
    const data = await response.json().catch(() => null);
    if (response.ok && data && data.ok) {
      form.reset();
      noteEl.textContent = successMessage;
    } else {
      noteEl.textContent = 'Something went wrong. Please try again or reach out via WhatsApp.';
    }
  } catch (err) {
    noteEl.textContent = 'Could not send right now. Please try again or reach out via WhatsApp.';
  }
}

// The contact form and calculators only exist once render.js has built the
// page's content, so wire them up when it signals completion.
document.addEventListener('content:rendered', () => {
  const contactForm = document.getElementById('contact-form');
  const formNote = document.getElementById('form-note');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleFormSubmit(contactForm, formNote, "Thanks — your message is on its way. We'll get back to you soon.");
    });
  }

  const newsletterForm = document.getElementById('newsletter-form');
  const newsletterNote = document.getElementById('newsletter-note');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleFormSubmit(newsletterForm, newsletterNote, "Thanks — you're subscribed!");
    });
  }

  const testimonialForm = document.getElementById('testimonial-form');
  const testimonialNote = document.getElementById('testimonial-note');
  if (testimonialForm) {
    testimonialForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleFormSubmit(testimonialForm, testimonialNote, "Thanks for sharing! We'll review it before it goes live.");
    });
  }

  const blogGrid = document.getElementById('blog-grid');
  if (blogGrid) {
    const searchInput = document.getElementById('blog-search');
    const filterButtons = document.querySelectorAll('.blog-filter');
    const noResults = document.getElementById('blog-no-results');
    let activeCategory = '';

    const applyBlogFilter = () => {
      const query = (searchInput ? searchInput.value : '').trim().toLowerCase();
      let visibleCount = 0;
      blogGrid.querySelectorAll('.blog-card').forEach((card) => {
        const matchesCategory = !activeCategory || card.dataset.category === activeCategory;
        const matchesSearch = !query || card.dataset.search.includes(query);
        const show = matchesCategory && matchesSearch;
        card.style.display = show ? '' : 'none';
        if (show) visibleCount += 1;
      });
      if (noResults) noResults.style.display = visibleCount ? 'none' : '';
    };

    if (searchInput) searchInput.addEventListener('input', applyBlogFilter);
    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        activeCategory = btn.dataset.category;
        applyBlogFilter();
      });
    });
  }

  const rwf = (n) => new Intl.NumberFormat('en-RW', { maximumFractionDigits: 0 }).format(Math.round(n));

  const ciCalc = document.getElementById('ci-calc');
  if (ciCalc) {
    ciCalc.addEventListener('click', () => {
      const p = parseFloat(document.getElementById('ci-principal').value) || 0;
      const rate = parseFloat(document.getElementById('ci-rate').value) || 0;
      const years = parseFloat(document.getElementById('ci-years').value) || 0;
      const freq = parseFloat(document.getElementById('ci-freq').value) || 1;
      const futureValue = p * Math.pow(1 + (rate / 100) / freq, freq * years);
      const interest = futureValue - p;
      document.getElementById('ci-result').innerHTML =
        `Future value: <strong>${rwf(futureValue)}</strong><br>Interest earned: <strong>${rwf(interest)}</strong>`;
    });
  }

  const lrCalc = document.getElementById('lr-calc');
  if (lrCalc) {
    lrCalc.addEventListener('click', () => {
      const amount = parseFloat(document.getElementById('lr-amount').value) || 0;
      const annualRate = parseFloat(document.getElementById('lr-rate').value) || 0;
      const months = parseFloat(document.getElementById('lr-months').value) || 1;
      const monthlyRate = (annualRate / 100) / 12;
      const payment = monthlyRate === 0
        ? amount / months
        : (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
      const total = payment * months;
      document.getElementById('lr-result').innerHTML =
        `Monthly payment: <strong>${rwf(payment)}</strong><br>Total repayment: <strong>${rwf(total)}</strong>`;
    });
  }
});
