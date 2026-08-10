import { TOUCH_BTN } from '../styles';

export default function Header({ view, onGoDash, onGoAppts, user, onLogout }) {
  return (
    <header style={{ background: '#0e3b39', color: '#fff', position: 'sticky', top: 0, zIndex: 40 }}>
      <div
        style={{
          maxWidth: 1180, margin: '0 auto', padding: '14px 22px', display: 'flex',
          alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span
            style={{
              width: 40, height: 40, borderRadius: 12,
              background: 'linear-gradient(135deg,#12a094,#0e756c)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', color: '#fff',
            }}
          >
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <rect x="5" y="4" width="14" height="17" rx="2.5" />
              <path d="M9 4a3 3 0 0 1 6 0" />
              <path d="M9 12h6M9 16h4" />
            </svg>
          </span>
          <span style={{ lineHeight: 1.05 }}>
            <span style={{ display: 'block', fontFamily: "'Bricolage Grotesque'", fontWeight: 700, fontSize: 18 }}>
              PatientPad
            </span>
            <span style={{ fontSize: 11, letterSpacing: '.2em', textTransform: 'uppercase', color: '#7fd4c9', fontWeight: 600 }}>
              Nishant Dental Clinic
            </span>
          </span>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <nav style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
              onClick={onGoDash}
              style={{
                ...TOUCH_BTN, padding: '10px 16px', borderRadius: 10, border: 0, cursor: 'pointer',
                fontWeight: 700, fontSize: 14.5, background: view === 'dashboard' ? '#12a094' : 'rgba(255,255,255,.12)',
                color: '#fff',
              }}
            >
              Dashboard
            </button>
            <button
              onClick={onGoAppts}
              style={{
                ...TOUCH_BTN, padding: '10px 16px', borderRadius: 10, border: 0, cursor: 'pointer',
                fontWeight: 700, fontSize: 14.5, background: view === 'appointments' ? '#12a094' : 'rgba(255,255,255,.12)',
                color: '#fff',
              }}
            >
              Appointments
            </button>
          </nav>
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 8 }}>
              {user.picture ? (
                <img
                  src={user.picture} alt="" referrerPolicy="no-referrer"
                  style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid rgba(255,255,255,.25)' }}
                />
              ) : (
                <span style={{
                  width: 32, height: 32, borderRadius: '50%', background: '#12a094',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, fontWeight: 700, color: '#fff',
                }}>
                  {(user.name || user.email || '?')[0].toUpperCase()}
                </span>
              )}
              <button
                onClick={onLogout}
                title="Sign out"
                style={{
                  ...TOUCH_BTN, padding: '6px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,.2)',
                  background: 'transparent', color: 'rgba(255,255,255,.7)', fontSize: 12.5,
                  fontWeight: 600, cursor: 'pointer',
                }}
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
