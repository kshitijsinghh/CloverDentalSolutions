import { useEffect, useState } from 'react';
import Header from './components/Header';
import Dashboard from './views/Dashboard';
import Intake from './views/Intake';
import Clinical from './views/Clinical';
import Appointments from './views/Appointments';
import { fetchList, saveIntake, saveClinical, uploadQr } from './api';

function today() {
  return new Date().toISOString().slice(0, 10);
}
function firstOfMonth() {
  return new Date().toISOString().slice(0, 8) + '01';
}
function normMobile(m) {
  return (m || '').replace(/\D/g, '');
}
function fmtDate(d) {
  if (!d) return '—';
  try {
    return new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return d;
  }
}
function num(x) {
  const n = parseFloat(x);
  return isNaN(n) ? 0 : n;
}
function inr(n) {
  return '₹' + Math.round(n).toLocaleString('en-IN');
}
function blankClinical() {
  return {
    problem: '', chiefComplaint: '', treatmentGroup: '', treatment: '', treatmentOther: '',
    treatingDoctor: '', treatmentCost: '', amountPaid: '', balanceDue: '', paymentMode: '',
    treatmentStage: '', googleReviewTaken: '', nextAppointment: '', comments: '',
  };
}
function findByMobile(db, mobile) {
  const mm = normMobile(mobile);
  if (!mm || !db) return null;
  for (const id of db.order) {
    if (db.patients[id].mobile === mm) return db.patients[id];
  }
  return null;
}

export default function App() {
  const [view, setView] = useState('dashboard');
  const [db, setDbState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState('');

  const [q, setQ] = useState('');
  const [dateFrom, setDateFrom] = useState(firstOfMonth());
  const [dateTo, setDateTo] = useState(today());
  const [payFilter, setPayFilter] = useState('All');

  const [form, setForm] = useState({ mobile: '', name: '', age: '', gender: '', date: today() });
  const [lookupState, setLookupState] = useState('');
  const [existingPatientId, setExistingPatientId] = useState('');
  const [intakeError, setIntakeError] = useState('');
  const [savingIntake, setSavingIntake] = useState(false);

  const [curPatientId, setCurPatientId] = useState('');
  const [curVisitId, setCurVisitId] = useState('');
  const [cform, setCform] = useState(blankClinical());
  const [savedFlash, setSavedFlash] = useState(false);
  const [savingClinical, setSavingClinical] = useState(false);
  const [clinicalError, setClinicalError] = useState('');
  const [showQr, setShowQr] = useState(false);

  function applySnapshot(res) {
    setDbState({ patients: res.patients, order: res.order, seq: res.seq, upiQr: res.upiQr });
  }

  async function loadList(isRefresh) {
    if (isRefresh) setRefreshing(true); else setLoading(true);
    try {
      const res = await fetchList();
      applySnapshot(res);
      setLoadError('');
    } catch (e) {
      setLoadError(e.message);
    } finally {
      if (isRefresh) setRefreshing(false); else setLoading(false);
    }
  }

  useEffect(() => {
    loadList(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function goDash() {
    setView('dashboard');
    loadList(true);
  }
  function goAppts() {
    setView('appointments');
    loadList(true);
  }
  function goIntake() {
    setView('intake');
    setForm({ mobile: '', name: '', age: '', gender: '', date: today() });
    setLookupState('');
    setExistingPatientId('');
    setIntakeError('');
  }

  function onLookup() {
    const p = findByMobile(db, form.mobile);
    if (p) {
      setLookupState('existing');
      setExistingPatientId(p.patientId);
      setIntakeError('');
      setForm((f) => ({ ...f, name: p.name, age: p.age, gender: p.gender }));
    } else if (normMobile(form.mobile)) {
      setLookupState('new');
      setExistingPatientId('');
      setIntakeError('');
    }
  }

  async function onSaveIntake() {
    const mm = normMobile(form.mobile);
    if (!mm) return setIntakeError('Please enter a mobile number.');
    if (!form.name.trim() || !String(form.age).trim() || !form.gender || !form.date) {
      return setIntakeError('Name, age, gender and date are required.');
    }
    setSavingIntake(true);
    setIntakeError('');
    try {
      const res = await saveIntake({ mobile: form.mobile, name: form.name.trim(), age: form.age, gender: form.gender, date: form.date });
      applySnapshot(res);
      setCurPatientId(res.patientId);
      setCurVisitId(res.visitId);
      setCform(blankClinical());
      setSavedFlash(false);
      setClinicalError('');
      setForm({ mobile: '', name: '', age: '', gender: '', date: today() });
      setLookupState('');
      setExistingPatientId('');
      setView('clinical');
    } catch (e) {
      setIntakeError(e.message);
    } finally {
      setSavingIntake(false);
    }
  }

  function openVisit(pid, visitId) {
    const p = db.patients[pid];
    const v = p && p.visits.find((x) => x.visitId === visitId);
    setCurPatientId(pid);
    setCurVisitId(visitId);
    setCform(v && v.clinical ? { ...blankClinical(), ...v.clinical } : blankClinical());
    setSavedFlash(false);
    setClinicalError('');
    setView('clinical');
  }

  async function onSaveClinical() {
    setSavingClinical(true);
    setClinicalError('');
    try {
      const res = await saveClinical({ patientId: curPatientId, visitId: curVisitId, cform });
      applySnapshot(res);
      setSavedFlash(true);
      setTimeout(() => {
        setSavedFlash(false);
        setView('dashboard');
        loadList(true);
      }, 900);
    } catch (e) {
      setClinicalError(e.message);
    } finally {
      setSavingClinical(false);
    }
  }

  function onUploadQr(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const res = await uploadQr({ dataUrl: reader.result, filename: file.name });
        applySnapshot(res);
      } catch (err) {
        setClinicalError(err.message);
      }
    };
    reader.readAsDataURL(file);
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5c7a76', fontSize: 15 }}>
        Loading clinic records…
      </div>
    );
  }
  if (loadError && !db) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ maxWidth: 480, background: '#fff', border: '1px solid #f6d3c8', borderRadius: 16, padding: 24, textAlign: 'center' }}>
          <p style={{ color: '#c0392b', fontWeight: 700, fontSize: 16 }}>Couldn't load clinic data</p>
          <p style={{ color: '#5c7a76', fontSize: 14, marginTop: 8 }}>{loadError}</p>
          <button
            onClick={() => loadList(false)}
            style={{ marginTop: 16, padding: '11px 20px', borderRadius: 10, border: 0, background: '#0e3b39', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const inRange = (d) => {
    if (dateFrom && d < dateFrom) return false;
    if (dateTo && d > dateTo) return false;
    return true;
  };

  const rows = [];
  for (const pid of db.order) {
    const p = db.patients[pid];
    for (const v of p.visits) {
      const ps = (v.clinical && v.clinical.paymentStatus) || '';
      const tr = v.clinical ? (/Other/.test(v.clinical.treatment) && v.clinical.treatmentOther ? v.clinical.treatmentOther : v.clinical.treatment) : '';
      const payMap = { 'Fully Paid': ['#e3f5ec', '#12805a'], 'Partially paid': ['#fdf0dc', '#a9741a'], 'Not paid': ['#fdecea', '#c0392b'] };
      const pm = payMap[ps] || ['#eef4f3', '#8aa8a3'];
      rows.push({
        pid, visitId: v.visitId, no: v.no, ts: Date.parse(v.createdAt) || 0, date: v.date,
        dateLabel: fmtDate(v.date), name: p.name, ageGender: (p.age || '?') + ' · ' + (p.gender || '—'),
        mobile: p.mobile, treatmentLabel: tr || '—', done: v.done,
        payLabel: ps || 'Pending', payBg: pm[0], payInk: pm[1],
        actionLabel: v.done ? 'View / Edit' : 'Doctor form',
        open: () => openVisit(pid, v.visitId),
      });
    }
  }
  rows.sort((a, b) => b.ts - a.ts);
  const rangeRows = rows.filter((r) => inRange(r.date));
  const qq = q.trim().toLowerCase();
  let visitRows = qq ? rangeRows.filter((r) => (r.name + ' ' + r.mobile + ' ' + r.visitId + ' ' + r.pid).toLowerCase().includes(qq)) : rangeRows;
  if (payFilter !== 'All') visitRows = visitRows.filter((r) => (r.payLabel || 'Pending') === payFilter);

  const rangePatientIds = Array.from(new Set(rangeRows.map((r) => r.pid)));
  let pendingAmount = 0;
  let pendingPatients = 0;
  rangePatientIds.forEach((pid) => {
    let bal = 0;
    db.patients[pid].visits.forEach((v) => { bal += num(v.clinical && v.clinical.balanceDue); });
    if (bal > 0) pendingPatients++;
    pendingAmount += bal;
  });
  const stats = [
    { label: 'Patients (range)', value: rangePatientIds.length, color: '#0e756c' },
    { label: 'Visits (range)', value: rangeRows.length, color: '#0e756c' },
    { label: 'Pending patients', value: pendingPatients, color: '#12a094' },
    { label: 'Pending amount', value: inr(pendingAmount), color: '#ef5a3c' },
  ];

  // Appointments: future follow-ups
  const todayStr = today();
  const appts = [];
  for (const pid of db.order) {
    const p = db.patients[pid];
    for (const v of p.visits) {
      const na = v.clinical && v.clinical.nextAppointment;
      if (na && na >= todayStr) {
        const trr = v.clinical ? (/Other/.test(v.clinical.treatment) && v.clinical.treatmentOther ? v.clinical.treatmentOther : v.clinical.treatment) : '';
        appts.push({
          date: na, dateLabel: fmtDate(na), name: p.name, mobile: p.mobile,
          patientId: pid, visitId: v.visitId, treatmentLabel: trr || '—',
          stage: (v.clinical.treatmentStage || '—'),
          open: () => openVisit(pid, v.visitId),
        });
      }
    }
  }
  appts.sort((a, b) => a.date < b.date ? -1 : a.date > b.date ? 1 : 0);

  const existing = findByMobile(db, form.mobile);
  const previewPatientId = existing ? existing.patientId : 'P' + String(db.seq + 1).padStart(4, '0');
  const nextVisitNo = existing ? existing.visits.length + 1 : 1;
  const previewVisitId = previewPatientId + '_' + nextVisitNo;

  const curP = db.patients[curPatientId];
  const curV = curP && curP.visits.find((x) => x.visitId === curVisitId);
  const cur = {
    name: curP ? curP.name : '', patientId: curPatientId, visitId: curVisitId,
    mobile: curP ? curP.mobile : '', ageGender: curP ? (curP.age || '?') + ' yrs · ' + (curP.gender || '—') : '',
    dateLabel: curV ? fmtDate(curV.date) : '',
  };
  const history = [];
  const pendingList = [];
  let pendingTotal = 0;
  if (curP) {
    curP.visits.slice().sort((a, b) => (a.no || 0) - (b.no || 0)).forEach((v) => {
      const bal = num(v.clinical && v.clinical.balanceDue);
      const cost = num(v.clinical && v.clinical.treatmentCost);
      const trr = v.clinical ? (/Other/.test(v.clinical.treatment) && v.clinical.treatmentOther ? v.clinical.treatmentOther : v.clinical.treatment) : '';
      const isCur = v.visitId === curVisitId;
      if (bal > 0) {
        pendingTotal += bal;
        pendingList.push({ visitId: v.visitId, dateLabel: fmtDate(v.date), amount: inr(bal), current: isCur });
      }
      history.push({
        visitId: v.visitId, dateLabel: fmtDate(v.date), treatmentLabel: trr || '—',
        cost: cost ? inr(cost) : '—', balance: bal ? inr(bal) : '—',
        status: (v.clinical && v.clinical.paymentStatus) || '—', current: isCur, rowBg: isCur ? '#eef7f6' : '#fff',
      });
    });
  }
  cur.history = history;
  let prevPending = 0;
  if (curP) curP.visits.forEach((v) => { if (v.visitId !== curVisitId) prevPending += num(v.clinical && v.clinical.balanceDue); });
  const computedBalance = num(cform.treatmentCost) + prevPending - num(cform.amountPaid);

  // Appointment count for the selected next date in clinical form
  let apptCount = 0;
  if (cform.nextAppointment) {
    for (const pid of db.order) {
      for (const v of db.patients[pid].visits) {
        if (v.visitId === curVisitId) continue;
        if (v.clinical && v.clinical.nextAppointment === cform.nextAppointment) apptCount++;
      }
    }
  }
  const apptCountText = apptCount === 0
    ? 'No other appointments booked on this day.'
    : apptCount === 1
      ? '1 appointment already booked on this day.'
      : apptCount + ' appointments already booked on this day.';

  return (
    <div style={{ minHeight: '100vh' }}>
      <Header view={view} onGoDash={goDash} onGoAppts={goAppts} />
      <main style={{ maxWidth: 1180, margin: '0 auto', padding: '26px 22px 60px' }}>
        {loadError && (
          <p style={{ color: '#c0392b', fontSize: 13, fontWeight: 600, marginBottom: 12 }}>{loadError}</p>
        )}

        {view === 'dashboard' && (
          <Dashboard
            dateFrom={dateFrom} dateTo={dateTo}
            onSetRange={(from, to) => { setDateFrom(from); setDateTo(to); }}
            onRefresh={() => loadList(true)} refreshing={refreshing}
            stats={stats} q={q} onSetQ={setQ}
            visitRows={visitRows} hasVisits={visitRows.length > 0} noVisits={rows.length === 0}
            payFilter={payFilter} onSetPayFilter={setPayFilter}
          />
        )}

        {view === 'appointments' && (
          <Appointments
            appts={appts} hasAppts={appts.length > 0} noAppts={appts.length === 0}
          />
        )}

        {view === 'intake' && (
          <Intake
            form={form} onSetField={(k, v) => setForm((f) => ({ ...f, [k]: v }))}
            onLookup={onLookup} lookupState={lookupState} existingPatientId={existingPatientId} nextVisitNo={nextVisitNo}
            previewPatientId={previewPatientId} previewVisitId={previewVisitId}
            intakeError={intakeError} onGoDash={goDash} onSaveIntake={onSaveIntake} saving={savingIntake}
          />
        )}

        {view === 'clinical' && curP && (
          <Clinical
            cur={cur} hasHistory={history.length > 0}
            cform={cform} onSetField={(k, v) => setCform((f) => ({ ...f, [k]: v }))}
            showTreatmentOther={/Other/.test(cform.treatment)}
            prevPendingLabel={inr(prevPending)} computedBalance={computedBalance}
            computedBalanceLabel={inr(computedBalance)}
            balanceColor={computedBalance > 0 ? '#c0392b' : '#12805a'}
            hasPending={pendingList.length > 0} noPending={pendingList.length === 0}
            pendingTotalLabel={inr(pendingTotal)} pendingList={pendingList}
            hasQr={!!db.upiQr} noQr={!db.upiQr} qrUrl={db.upiQr}
            qrUploadLabel={db.upiQr ? 'Replace scanner' : 'Upload scanner'} onUploadQr={onUploadQr}
            showQr={showQr} onOpenQr={() => setShowQr(true)} onCloseQr={() => setShowQr(false)}
            savedFlash={savedFlash} onGoDash={goDash} onSaveClinical={onSaveClinical} saving={savingClinical}
            error={clinicalError}
            apptCountText={apptCountText} showApptCount={!!cform.nextAppointment}
            db={db} curPatientId={curPatientId}
          />
        )}
      </main>

      {/* Floating Action Button */}
      <button
        onClick={goIntake}
        title="New visit"
        aria-label="New visit"
        style={{
          position: 'fixed', right: 22, bottom: 22, zIndex: 70, height: 58, padding: '0 24px',
          border: 0, borderRadius: 100, background: '#ef5a3c', color: '#fff', fontWeight: 700,
          fontSize: 15.5, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 9,
          boxShadow: '0 14px 30px -8px rgba(239,90,60,.55)',
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
        New Visit
      </button>
    </div>
  );
}
