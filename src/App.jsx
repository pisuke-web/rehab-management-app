import { useState } from 'react';

const emptyPatient = { number: '', name: '', gender: '', age: '', start: '', disease: '' };
const emptySoap = 'S:\n\nO:\n\nA:\n\nP:';
function readPatients() {
  try { const saved = JSON.parse(localStorage.getItem('patients') || '[]'); return Array.isArray(saved) ? saved : []; }
  catch { return []; }
}
function savePatients(patients) { localStorage.setItem('patients', JSON.stringify(patients)); }

function Header({ setView }) {
  return <header><h1>リハビリテーション部門診療管理システム</h1><nav>
    <button onClick={() => setView('register')}>患者登録／患者一覧</button>
    <button onClick={() => setView('search')}>患者検索</button>
    <a className="button" href="index.php">メニューに戻る</a>
    <a className="button" href="bbs1/bbs.php">申し送り</a>
    <a className="button" href="logout.php">退出</a>
  </nav></header>;
}
function PatientTable({ patients, onOpen, onDelete }) {
  if (!patients.length) return <p>登録された患者はいません。</p>;
  return <div className="table-wrap"><table><thead><tr><th>病歴番号</th><th>氏名</th><th>性別</th><th>生年月日</th><th>開始／転入日</th><th>傷病名</th><th>削除</th></tr></thead>
    <tbody>{patients.map(p => <tr key={p.number}><td><button className="text-button" onClick={() => onOpen(p)}>{p.number}</button></td><td>{p.name}</td><td>{p.gender}</td><td>{p.age}</td><td>{p.start}</td><td>{p.disease}</td><td><button className="danger" onClick={() => onDelete(p.number)}>削除</button></td></tr>)}</tbody></table></div>;
}

export default function App({ initialView = 'register', initialNumber = '' }) {
  const [view, setView] = useState(initialNumber ? 'record' : initialView);
  const [patients, setPatients] = useState(readPatients);
  const [form, setForm] = useState(emptyPatient);
  const [searchNumber, setSearchNumber] = useState('');
  const [searchName, setSearchName] = useState('');
  const [searched, setSearched] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState(initialNumber);
  const [date, setDate] = useState('');
  const [therapist, setTherapist] = useState('');
  const [soap, setSoap] = useState(emptySoap);
  const patient = patients.find(p => String(p.number) === String(selectedNumber));
  const results = patients.filter(p => (!searchNumber.trim() || String(p.number) === searchNumber.trim()) && (!searchName.trim() || String(p.name || '').includes(searchName.trim())));
  function updateForm(key, value) { setForm({ ...form, [key]: value }); }
  function addPatient(e) {
    e.preventDefault();
    if (!form.number.trim() || !form.name.trim()) { alert('病歴番号と患者氏名を入力してください。'); return; }
    if (patients.some(p => String(p.number) === form.number.trim())) { alert('同じ病歴番号の患者が登録されています。'); return; }
    const next = [...patients, { ...form, number: form.number.trim(), name: form.name.trim(), records: [] }];
    setPatients(next); savePatients(next); setForm(emptyPatient); alert('患者を登録しました。');
  }
  function deletePatient(number) {
    if (!confirm('この患者を削除しますか？')) return;
    const next = patients.filter(p => String(p.number) !== String(number)); setPatients(next); savePatients(next);
  }
  function openPatient(p) { setSelectedNumber(String(p.number)); setDate(''); setTherapist(''); setSoap(emptySoap); setView('record'); }
  function addRecord(e) {
    e.preventDefault();
    if (!patient) { alert('患者が見つかりません。患者一覧から開き直してください。'); return; }
    if (!date || !therapist.trim() || !soap.trim()) { alert('介入日・担当療法士・SOAP記録を入力してください。'); return; }
    const next = patients.map(p => String(p.number) === String(selectedNumber) ? { ...p, records: [...(Array.isArray(p.records) ? p.records : []), { date, therapist: therapist.trim(), soap }] } : p);
    setPatients(next); savePatients(next); setDate(''); setTherapist(''); setSoap(emptySoap); alert('記録を保存しました。');
  }
  return <main><Header setView={setView} />
    {view === 'register' && <section><h2>患者登録</h2><form className="patient-form" onSubmit={addPatient}>
      <label>病歴番号<input value={form.number} onChange={e => updateForm('number', e.target.value)} /></label>
      <label>患者氏名<input value={form.name} onChange={e => updateForm('name', e.target.value)} /></label>
      <fieldset><legend>性別</legend><label className="inline"><input type="radio" name="gender" value="男性" checked={form.gender === '男性'} onChange={e => updateForm('gender', e.target.value)} />男性</label><label className="inline"><input type="radio" name="gender" value="女性" checked={form.gender === '女性'} onChange={e => updateForm('gender', e.target.value)} />女性</label></fieldset>
      <label>生年月日<input type="date" value={form.age} onChange={e => updateForm('age', e.target.value)} /></label>
      <label>開始または転入日<input type="date" value={form.start} onChange={e => updateForm('start', e.target.value)} /></label>
      <label>主訴となる傷病名<input value={form.disease} onChange={e => updateForm('disease', e.target.value)} /></label><button type="submit">登録</button>
    </form><h2>患者一覧</h2><PatientTable patients={patients} onOpen={openPatient} onDelete={deletePatient} /></section>}
    {view === 'search' && <section><h2>患者検索</h2><form className="patient-form" onSubmit={e => { e.preventDefault(); setSearched(true); }}>
      <label>病歴番号<input value={searchNumber} onChange={e => setSearchNumber(e.target.value)} /></label><label>氏名<input value={searchName} onChange={e => setSearchName(e.target.value)} /></label><button type="submit">検索</button>
    </form><h2>検索結果</h2>{!searched ? <p>病歴番号または氏名を入力して検索してください。</p> : results.length === 0 ? <p>該当する患者が見つかりません。</p> : results.map(p => <article className="result" key={p.number}><p>病歴番号：{p.number}<br />氏名：{p.name}<br />性別：{p.gender || ''}<br />傷病名：{p.disease || ''}</p><button onClick={() => openPatient(p)}>この患者を開く</button></article>)}</section>}
    {view === 'record' && <section><h2>リハビリ介入記録　個人ページ</h2>{!patient ? <p>患者が見つかりません。患者一覧から患者を選んでください。</p> : <>
      <div className="patient-summary"><p><strong>病歴番号：</strong>{patient.number}</p><p><strong>患者氏名：</strong>{patient.name}</p><p><strong>傷病名：</strong>{patient.disease}</p></div>
      <h3>介入記録の追加</h3><form className="record-form" onSubmit={addRecord}><label>介入日<input type="date" value={date} onChange={e => setDate(e.target.value)} /></label><label>担当療法士<input value={therapist} onChange={e => setTherapist(e.target.value)} placeholder="療法士氏名" /></label><label>SOAP記録<textarea value={soap} onChange={e => setSoap(e.target.value)} rows="9" /></label><button type="submit">記録追加</button></form>
      <h3>介入記録一覧</h3>{!patient.records?.length ? <p>介入記録はまだありません。</p> : <div className="table-wrap"><table><thead><tr><th>介入日</th><th>担当療法士</th><th>SOAP</th></tr></thead><tbody>{patient.records.map((r, i) => <tr key={i}><td>{r.date}</td><td>{r.therapist}</td><td className="soap-text">{r.soap}</td></tr>)}</tbody></table></div>}
    </>}<div className="actions"><button onClick={() => setView('search')}>患者検索に戻る</button><button onClick={() => setView('register')}>患者一覧に戻る</button></div></section>}
    
  </main>;
}
