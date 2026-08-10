// Mobile nav toggle
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

// Forms submit to Formspree via AJAX so visitors stay on the page
async function handleFormspreeSubmit(form, noteEl, successMessage) {
  noteEl.textContent = 'Sending…';
  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    });
    if (response.ok) {
      form.reset();
      noteEl.textContent = successMessage;
    } else {
      const data = await response.json().catch(() => null);
      const errorMsg = data && data.errors
        ? data.errors.map((e) => e.message).join(', ')
        : 'Something went wrong. Please try again or reach out via WhatsApp.';
      noteEl.textContent = errorMsg;
    }
  } catch (err) {
    noteEl.textContent = 'Could not send right now. Please try again or reach out via WhatsApp.';
  }
}

const contactForm = document.getElementById('contact-form');
const formNote = document.getElementById('form-note');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  handleFormspreeSubmit(contactForm, formNote, "Thanks — your message is on its way. We'll get back to you soon.");
});

const bookingForm = document.getElementById('booking-form');
const bookingNote = document.getElementById('booking-note');

if (bookingForm) {
  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    handleFormspreeSubmit(bookingForm, bookingNote, "Thanks — your booking request is on its way. We'll follow up shortly.");
  });
}

// Financial calculators (client-side only, no data leaves the browser)
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
