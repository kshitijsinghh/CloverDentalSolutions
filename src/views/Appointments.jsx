import { TOUCH_BTN } from '../styles';

export default function Appointments({ appts, hasAppts, noAppts }) {
  return (
    <div>
      <h2 style={{ fontFamily: "'Bricolage Grotesque'", fontWeight: 700, fontSize: 22, color: '#0e3b39', marginBottom: 4 }}>
        Upcoming appointments
      </h2>
      <p style={{ color: '#5c7a76', fontSize: 14.5, marginBottom: 16 }}>
        Future follow-ups scheduled from the doctor form, soonest first.
      </p>
      <div style={{ background: '#fff', border: '1px solid #dfece9', borderRadius: 18, overflow: 'hidden' }}>
        {hasAppts && (
          <>
            <div className="table-view" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, minWidth: 720 }}>
                <thead>
                  <tr style={{ textAlign: 'left', color: '#7a9994', fontSize: 12, letterSpacing: '.05em', textTransform: 'uppercase' }}>
                    <th style={{ padding: '12px 20px', fontWeight: 700 }}>Appointment date</th>
                    <th style={{ padding: '12px 12px', fontWeight: 700 }}>Patient</th>
                    <th style={{ padding: '12px 12px', fontWeight: 700 }}>Mobile</th>
                    <th style={{ padding: '12px 12px', fontWeight: 700 }}>Treatment</th>
                    <th style={{ padding: '12px 12px', fontWeight: 700 }}>Stage</th>
                    <th style={{ padding: '12px 20px', fontWeight: 700 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {appts.map((a) => (
                    <tr key={a.visitId} style={{ borderTop: '1px solid #eef4f3' }}>
                      <td style={{ padding: '13px 20px', fontWeight: 700, color: '#0e3b39' }}>{a.dateLabel}</td>
                      <td style={{ padding: '13px 12px', color: '#33534f' }}>{a.name}</td>
                      <td style={{ padding: '13px 12px', color: '#5c7a76' }}>{a.mobile}</td>
                      <td style={{ padding: '13px 12px', color: '#5c7a76' }}>{a.treatmentLabel}</td>
                      <td style={{ padding: '13px 12px', color: '#5c7a76' }}>{a.stage}</td>
                      <td style={{ padding: '13px 20px', textAlign: 'right' }}>
                        <button
                          onClick={a.open}
                          style={{ ...TOUCH_BTN, padding: '8px 14px', borderRadius: 9, border: '1px solid #cfe3df', background: '#f2f9f8', color: '#0e756c', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
                        >
                          Open visit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="card-view">
              {appts.map((a) => (
                <div key={a.visitId} style={{ padding: '14px 18px', borderTop: '1px solid #eef4f3', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                    <span style={{ fontWeight: 700, fontSize: 15, color: '#0e3b39' }}>{a.dateLabel}</span>
                    <span style={{ fontSize: 13, color: '#5c7a76' }}>{a.stage}</span>
                  </div>
                  <div style={{ fontSize: 14, color: '#33534f' }}>{a.name}</div>
                  <div style={{ fontSize: 13.5, color: '#5c7a76' }}>{a.mobile}</div>
                  <div style={{ fontSize: 13.5, color: '#5c7a76' }}>{a.treatmentLabel}</div>
                  <button
                    onClick={a.open}
                    style={{ ...TOUCH_BTN, marginTop: 6, alignSelf: 'stretch', padding: '10px 14px', borderRadius: 9, border: '1px solid #cfe3df', background: '#f2f9f8', color: '#0e756c', fontWeight: 700, fontSize: 13.5, cursor: 'pointer' }}
                  >
                    Open visit
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
        {noAppts && (
          <div style={{ padding: '54px 20px', textAlign: 'center', color: '#8aa8a3' }}>
            <p style={{ fontSize: 16, fontWeight: 600, color: '#5c7a76' }}>No upcoming appointments.</p>
            <p style={{ fontSize: 14, marginTop: 6 }}>
              Set a "Next appointment date" in a doctor form to schedule one.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
