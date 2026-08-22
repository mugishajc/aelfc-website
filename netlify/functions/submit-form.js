// Receives form submissions from the site (contact/booking, newsletter, testimonial
// submissions) and emails them via ZeptoMail. The ZeptoMail token lives only in the
// ZEPTOMAIL_TOKEN Netlify environment variable — never in this repo.

const ZEPTOMAIL_URL = 'https://api.zeptomail.com/v1.1/email';
const TO_ADDRESS = 'info@anacletsexpert.com';
const CC_ADDRESS = 'anacletmugisha@gmail.com';

const FORM_LABELS = {
  contact: 'Contact / Booking Form',
  newsletter: 'Newsletter Signup',
  testimonial: 'Testimonial Submission',
};

const FIELD_LABELS = {
  name: 'Full name',
  email: 'Email',
  phone: 'Phone number',
  topic: 'Reaching out about',
  profession: 'Profession',
  message: 'Message',
  clientName: 'Client / company name',
  testimonial: 'Testimonial',
  serviceProvided: 'Service provided',
  period: 'Period / year worked together',
  category: 'Client category / industry',
  link: 'Website / social link',
};

function esc(str) {
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ ok: false, error: 'Method not allowed' }) };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch (err) {
    return { statusCode: 400, body: JSON.stringify({ ok: false, error: 'Invalid JSON' }) };
  }

  const { formType, fields } = payload;

  // Honeypot: a hidden field real visitors never fill in. Bots that fill every
  // field trip this — pretend success so they don't retry, but send nothing.
  if (fields && fields.company_website) {
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  }

  if (!fields || typeof fields !== 'object' || !Object.keys(fields).length) {
    return { statusCode: 400, body: JSON.stringify({ ok: false, error: 'No form data received' }) };
  }

  const token = process.env.ZEPTOMAIL_TOKEN;
  if (!token) {
    console.error('ZEPTOMAIL_TOKEN environment variable is not set');
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: 'Email is not configured on the server' }) };
  }

  const formLabel = FORM_LABELS[formType] || 'Website Form';
  const rows = Object.entries(fields)
    .filter(([key, value]) => key !== 'company_website' && String(value || '').trim() !== '')
    .map(([key, value]) => {
      const label = FIELD_LABELS[key] || key;
      return `<tr><td style="padding:6px 12px;font-weight:600;vertical-align:top;white-space:nowrap">${esc(label)}</td><td style="padding:6px 12px">${esc(value).replace(/\n/g, '<br>')}</td></tr>`;
    })
    .join('');

  const htmlbody = `
    <div style="font-family:Arial,sans-serif;color:#16323d">
      <h2 style="margin-bottom:4px">New ${esc(formLabel)}</h2>
      <p style="color:#5b6472;margin-top:0">Submitted from anacletsexpert.com</p>
      <table style="border-collapse:collapse">${rows}</table>
    </div>
  `;

  try {
    const response = await fetch(ZEPTOMAIL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Zoho-enczapikey ${token}`,
      },
      body: JSON.stringify({
        from: { address: 'noreply@anacletsexpert.com', name: 'AELFC Website' },
        to: [{ email_address: { address: TO_ADDRESS, name: 'AELFC Info' } }],
        cc: [{ email_address: { address: CC_ADDRESS, name: 'Anaclet Mugisha' } }],
        subject: `New ${formLabel} — AELFC Website`,
        htmlbody,
      }),
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      console.error('ZeptoMail error:', response.status, errText);
      return { statusCode: 502, body: JSON.stringify({ ok: false, error: 'Email delivery failed' }) };
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error('ZeptoMail request failed:', err);
    return { statusCode: 502, body: JSON.stringify({ ok: false, error: 'Email delivery failed' }) };
  }
};
