// Talks to the Google Apps Script Web App (see apps-script/README.md) that
// reads/writes the clinic's Google Sheet. This is the only source of data —
// nothing is cached in localStorage.

const BASE_URL = import.meta.env.VITE_SHEETS_API_URL;

function assertConfigured() {
  if (!BASE_URL) {
    throw new Error(
      'VITE_SHEETS_API_URL is not set. Copy .env.example to .env, deploy the ' +
      'Apps Script backend (see apps-script/README.md), and paste its Web App URL in.'
    );
  }
}

async function handle(res) {
  if (!res.ok) throw new Error('Request failed: HTTP ' + res.status);
  const json = await res.json();
  if (!json.ok) throw new Error(json.error || 'Request failed.');
  return json;
}

export async function fetchList() {
  assertConfigured();
  const res = await fetch(BASE_URL + '?action=list');
  return handle(res);
}

// POST bodies are sent as text/plain (not application/json) so the browser
// treats this as a CORS "simple request" and skips a preflight OPTIONS call,
// which Apps Script Web Apps don't handle.
async function post(payload) {
  assertConfigured();
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
  });
  return handle(res);
}

export function saveIntake({ mobile, name, age, gender, date }) {
  return post({ action: 'saveIntake', mobile, name, age, gender, date });
}

export function saveClinical({ patientId, visitId, cform }) {
  return post({ action: 'saveClinical', patientId, visitId, cform });
}

export function uploadQr({ dataUrl, filename }) {
  return post({ action: 'uploadQr', dataUrl, filename });
}
