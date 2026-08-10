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

// Contact form -> opens a pre-filled email (no backend on this static site)
const contactForm = document.getElementById('contact-form');
const formNote = document.getElementById('form-note');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = contactForm.name.value.trim();
  const email = contactForm.email.value.trim();
  const message = contactForm.message.value.trim();

  const subject = encodeURIComponent(`Website inquiry from ${name}`);
  const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
  window.location.href = `mailto:anacletmugisha@gmail.com?subject=${subject}&body=${body}`;

  formNote.textContent = 'Opening your email client to send this message…';
});

// Booking request form -> opens a pre-filled email with all booking details
const bookingForm = document.getElementById('booking-form');
const bookingNote = document.getElementById('booking-note');

if (bookingForm) {
  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const f = bookingForm;
    const lines = [
      `Name: ${f.name.value.trim()}`,
      `Email: ${f.email.value.trim()}`,
      `Phone: ${f.phone.value.trim()}`,
      `Service requested: ${f.service.value}`,
      `Profession / career: ${f.profession.value.trim()}`,
      `What they hope to gain from the session: ${f.goal.value.trim()}`
    ];
    const subject = encodeURIComponent(`Booking request from ${f.name.value.trim()}`);
    const body = encodeURIComponent(lines.join('\n'));
    window.location.href = `mailto:anacletmugisha@gmail.com?subject=${subject}&body=${body}`;
    bookingNote.textContent = 'Opening your email client to send this booking request…';
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
