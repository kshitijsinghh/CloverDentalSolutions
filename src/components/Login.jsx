import { useEffect, useRef } from 'react';
import { getClientId, isAllowed, storeUser } from '../auth';

export default function Login({ onAuth }) {
  const btnRef = useRef(null);
  const errorRef = useRef(null);

  useEffect(() => {
    const clientId = getClientId();
    if (!clientId) return;

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
      });
      window.google.accounts.id.renderButton(btnRef.current, {
        theme: 'outline',
        size: 'large',
        shape: 'pill',
        text: 'signin_with',
        width: 280,
      });
    };
    document.head.appendChild(script);
    return () => { document.head.removeChild(script); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function decodeJwt(token) {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  }

  function handleCredentialResponse(response) {
    try {
      const payload = decodeJwt(response.credential);
      const email = (payload.email || '').toLowerCase();
      if (!isAllowed(email)) {
        if (errorRef.current) errorRef.current.textContent = 'Access denied — ' + email + ' is not authorised.';
        return;
      }
      const user = { email, name: payload.name || email, picture: payload.picture || '' };
      storeUser(user);
      onAuth(user);
    } catch {
      if (errorRef.current) errorRef.current.textContent = 'Sign-in failed. Please try again.';
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#eef4f3',
    }}>
      <div style={{
        background: '#fff', borderRadius: 20, padding: '48px 36px', textAlign: 'center',
        boxShadow: '0 8px 40px rgba(14,59,57,.08)', maxWidth: 400, width: '90%',
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: 16, margin: '0 auto 18px',
          background: 'linear-gradient(135deg,#12a094,#0e756c)', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="4" width="14" height="17" rx="2.5" />
            <path d="M9 4a3 3 0 0 1 6 0" />
            <path d="M9 12h6M9 16h4" />
          </svg>
        </div>
        <h1 style={{
          fontFamily: "'Bricolage Grotesque'", fontWeight: 700, fontSize: 24,
          color: '#0e3b39', margin: '0 0 4px',
        }}>
          PatientPad
        </h1>
        <p style={{
          fontSize: 12, letterSpacing: '.15em', textTransform: 'uppercase',
          color: '#5c7a76', fontWeight: 600, margin: '0 0 28px',
        }}>
          Surmayee Dental Studio
        </p>
        <div ref={btnRef} style={{ display: 'flex', justifyContent: 'center', minHeight: 44 }} />
        <p ref={errorRef} style={{ color: '#c0392b', fontSize: 13, fontWeight: 600, marginTop: 16, minHeight: 20 }} />
      </div>
    </div>
  );
}
