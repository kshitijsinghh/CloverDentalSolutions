const ALLOWED_EMAILS = [
  'kshitijsinghh99@gmail.com',
  'teamdocmind@gmail.com',
  'surmayeedental@gmail.com',
  'docnishant29@gmail.com',
];

const SESSION_KEY = 'clinic_auth';

export function isAllowed(email) {
  return ALLOWED_EMAILS.includes(email.toLowerCase());
}

export function getStoredUser() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const user = JSON.parse(raw);
    if (user && user.email && isAllowed(user.email)) return user;
    sessionStorage.removeItem(SESSION_KEY);
    return null;
  } catch {
    return null;
  }
}

export function storeUser(user) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function clearUser() {
  sessionStorage.removeItem(SESSION_KEY);
}

export function getClientId() {
  return import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
}
