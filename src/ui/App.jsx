import { useState } from 'react';
import {
  ArrowDownLeft, ArrowLeft, ArrowRight, AudioLines, BookOpen, Check,
  ChevronDown, Clock3, FileText, Fingerprint, LockKeyhole, MessageSquare,
  Search, Shield, Sparkles, UserRound, X,
} from 'lucide-react';

const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
const apiUrl = (path) => `${API_BASE_URL}${path}`;

const sampleScenario = 'A celebrated radio host disappears from a locked broadcast booth during the final live show of the season. The station claims it was a publicity stunt, but a producer finds the host’s marked-up script and a recording that never made it to air.';

export default function App() {
  const [screen, setScreen] = useState('setup');
  const [scenario, setScenario] = useState('');
  const [caseFile, setCaseFile] = useState(null);
  const [activeTab, setActiveTab] = useState('evidence');
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [selectedSuspect, setSelectedSuspect] = useState('');
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [showBrief, setShowBrief] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  function startNewCase() {
    setScreen('setup');
    setScenario('');
    setCaseFile(null);
    setActiveTab('evidence');
    setSelectedEvidence(null);
    setSelectedSuspect('');
    setResult(null);
    setShowResult(false);
    setShowBrief(true);
    setBusy(false);
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function createCase(event) {
    event?.preventDefault();
    const cleanScenario = scenario.trim();
    if (cleanScenario.length < 20 || cleanScenario.length > 1200) {
      setError('Enter a scenario between 20 and 1,200 characters.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const response = await fetch(apiUrl('/api/cases'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario: cleanScenario }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not create a case.');
      if (!data.id || !Array.isArray(data.suspects) || !Array.isArray(data.evidence)) {
        throw new Error('The case response was incomplete. Please try again.');
      }
      setCaseFile(data);
      setActiveTab('evidence');
      setSelectedEvidence(null);
      setSelectedSuspect('');
      setResult(null);
      setShowResult(false);
      setShowBrief(true);
      setScreen('investigation');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (cause) {
      setError(cause.message || 'Could not reach the case room. Check that the development server is running.');
    } finally {
      setBusy(false);
    }
  }

  async function submitGuess() {
    if (!caseFile || !selectedSuspect || busy) return;
    setBusy(true);
    setError('');
    try {
      const response = await fetch(apiUrl(`/api/cases/${encodeURIComponent(caseFile.id)}/submit`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ suspectId: selectedSuspect }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not submit your theory.');
      if (typeof data.correct !== 'boolean' || !data.culprit?.name || !data.explanation) {
        throw new Error('The case result was incomplete. Please try submitting again.');
      }
      setResult(data);
      setShowResult(true);
    } catch (cause) {
      setError(cause.message || 'Could not submit your theory. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  function openSetupFromBrand(event) {
    event.preventDefault();
    startNewCase();
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" onClick={openSetupFromBrand}>
          <span className="brand-mark"><Fingerprint size={19} /></span>
          <span>CASEFILE<span className="brand-dot">.</span></span>
        </a>
        <div className="topbar-right">
          <span className="status-dot" /> FICTIONAL INVESTIGATION PLATFORM
          <span className="top-sep">/</span>
          <button className="text-button" onClick={startNewCase}>NEW CASE <ArrowRight size={14} /></button>
        </div>
      </header>

      {screen === 'setup' ? (
        <SetupScreen
          scenario={scenario}
          setScenario={setScenario}
          error={error}
          busy={busy}
          onCreate={createCase}
          onSample={() => { setScenario(sampleScenario); setError(''); }}
        />
      ) : caseFile ? (
        <InvestigationScreen
          caseFile={caseFile}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedSuspect={selectedSuspect}
          setSelectedSuspect={setSelectedSuspect}
          selectedEvidence={selectedEvidence}
          setSelectedEvidence={setSelectedEvidence}
          result={result}
          error={error}
          busy={busy}
          showBrief={showBrief}
          setShowBrief={setShowBrief}
          onSubmit={submitGuess}
          onNewCase={startNewCase}
        />
      ) : (
        <SetupScreen scenario={scenario} setScenario={setScenario} error="The case is unavailable. Start a new case." busy={false} onCreate={createCase} onSample={() => setScenario(sampleScenario)} />
      )}

      <footer className="footer">
        <span>CASEFILE © 2025</span>
        <span>EVERY DETAIL IS A CLUE <span className="bottom-sep">·</span> EVERY CASE IS FICTION</span>
        <span>BUILT FOR THE CURIOUS <span className="footer-spark">✳</span></span>
      </footer>

      {selectedEvidence && screen === 'investigation' && (
        <EvidenceModal item={selectedEvidence} caseId={caseFile?.id} onClose={() => setSelectedEvidence(null)} />
      )}
      {result && showResult && screen === 'investigation' && (
        <ResultModal result={result} onClose={() => setShowResult(false)} onNewCase={startNewCase} />
      )}
    </div>
  );
}

function SetupScreen({ scenario, setScenario, error, busy, onCreate, onSample }) {
  return (
    <main className="landing" id="top">
      <div className="hero-copy">
        <div className="eyebrow"><span className="eyebrow-line" /> YOUR NEXT CASE STARTS HERE</div>
        <h1>Every story<br />hides a <em>secret.</em></h1>
        <p className="hero-intro">Build a mystery from a few lines. Follow the evidence. Find out what really happened.</p>
        <div className="feature-row">
          <div><Shield size={16} /><span>ONE TRUE CULPRIT</span></div>
          <div><LockKeyhole size={15} /><span>SEALED ANSWER KEY</span></div>
          <div><Sparkles size={15} /><span>AI-GENERATED CASES</span></div>
        </div>
      </div>
      <form className="create-card" onSubmit={onCreate}>
        <div className="card-topline"><span>01 / CASE SETUP</span><span className="fiction-tag"><span /> FICTION ONLY</span></div>
        <h2>Give us the beginning.</h2>
        <p className="card-description">A strange incident, a missing person, an impossible alibi. Start anywhere.</p>
        <label htmlFor="scenario">YOUR SCENARIO <span>20–1,200 CHARACTERS</span></label>
        <div className="textarea-wrap">
          <textarea id="scenario" maxLength={1200} minLength={20} placeholder="At 9:17 PM, every clock in the old hotel stopped at once. By morning, one guest had vanished…" value={scenario} onChange={(event) => setScenario(event.target.value)} />
          <div className="input-footer"><span>All case material is fictional and simulated.</span><span>{scenario.length.toString().padStart(3, '0')} / 1200</span></div>
        </div>
        {error && <div className="error-message" role="alert">{error}</div>}
        <button className="primary-button" type="submit" disabled={busy || scenario.trim().length < 20}>
          {busy ? <><span className="spinner" /> ASSEMBLING YOUR CASE…</> : <>GENERATE INVESTIGATION <ArrowRight size={16} /></>}
        </button>
        <button className="sample-button" type="button" onClick={onSample}><BookOpen size={14} /> TRY A SAMPLE SCENARIO</button>
      </form>
      <div className="landing-bottom"><span>VOL. 001 <span className="bottom-sep">/</span> STORIES WITH TEETH</span><span>MADE FOR THE CURIOUS <ArrowDownLeft size={13} /></span></div>
    </main>
  );
}

function InvestigationScreen({ caseFile, activeTab, setActiveTab, selectedSuspect, setSelectedSuspect, setSelectedEvidence, result, error, busy, showBrief, setShowBrief, onSubmit, onNewCase }) {
  const tabs = [
    { id: 'evidence', label: 'Evidence', Icon: FileText, count: caseFile.evidence.length },
    { id: 'suspects', label: 'Suspects', Icon: UserRound, count: caseFile.suspects.length },
    { id: 'timeline', label: 'Timeline', Icon: Clock3, count: '↗' },
  ];
  const timeline = caseFile.evidence.find((item) => item.type.toLowerCase().includes('timeline'));
  const items = activeTab === 'timeline' && timeline
    ? [timeline, ...caseFile.evidence.filter((item) => item.id !== timeline.id)]
    : caseFile.evidence;

  return (
    <main className="investigation">
      <div className="case-heading">
        <button className="back-button" onClick={onNewCase}><ArrowLeft size={14} /> CASE GENERATOR</button>
        <div className="case-title-row">
          <div>
            <div className="eyebrow"><span className="eyebrow-line" /> ACTIVE INVESTIGATION <span className="case-badge">{caseFile.difficulty || 'OPEN CASE'}</span></div>
            <h1>{caseFile.title}</h1>
            <p>{caseFile.location} <span className="bottom-sep">·</span> Case #{caseFile.id.slice(0, 8).toUpperCase()}</p>
          </div>
          <div className="case-seal"><Fingerprint size={27} /><span>FILE<br />SEALED</span></div>
        </div>
      </div>

      <div className="case-summary">
        <div className="brief-label"><BookOpen size={15} /> CASE BRIEF</div>
        {showBrief ? <p>{caseFile.summary}</p> : <span className="brief-collapsed">Brief collapsed</span>}
        <button onClick={() => setShowBrief((visible) => !visible)} aria-label="Toggle case brief"><ChevronDown className={showBrief ? '' : 'rotated'} size={17} /></button>
      </div>

      <div className="investigation-grid">
        <section className="evidence-panel">
          <div className="panel-header"><div><div className="eyebrow"><span className="eyebrow-line" /> INVESTIGATION DESK</div><h2>Follow the trail.</h2></div><span className="count-pill">{activeTab === 'suspects' ? caseFile.suspects.length : caseFile.evidence.length} FILES</span></div>
          <nav className="tabs" aria-label="Case file sections">
            {tabs.map(({ id, label, Icon, count }) => <button type="button" key={id} className={activeTab === id ? 'active' : ''} aria-current={activeTab === id ? 'page' : undefined} onClick={() => setActiveTab(id)}><Icon size={15} />{label}<span>{count}</span></button>)}
          </nav>
          {activeTab === 'suspects' ? (
            <div className="suspect-grid">{caseFile.suspects.map((suspect, index) => <SuspectCard key={suspect.id} suspect={suspect} index={index} />)}</div>
          ) : (
            <div className="evidence-list">{items.map((item, index) => <button type="button" className="evidence-row" key={item.id} onClick={() => setSelectedEvidence(item)}><span className="evidence-icon">{evidenceIcon(item.type)}</span><span className="evidence-main"><span className="evidence-kicker">EXHIBIT {String(index + 1).padStart(2, '0')} <span>·</span> {item.type}</span><strong>{item.title}</strong><small>{item.source}</small></span><span className="evidence-time">{item.time}</span><ArrowRight className="row-arrow" size={16} /></button>)}</div>
          )}
          <div className="panel-note"><LockKeyhole size={13} /> Evidence is simulated and generated for this fictional case.</div>
        </section>

        <aside className="theory-panel">
          <div className="theory-top"><div className="eyebrow"><span className="eyebrow-line" /> YOUR THEORY</div><span className="theory-glyph"><Fingerprint size={21} /></span></div>
          <h2>Who did it?</h2>
          <p>Study the evidence. When you’re ready, name your suspect.</p>
          <div className="choice-list">{caseFile.suspects.map((suspect, index) => <button type="button" key={suspect.id} className={`choice ${selectedSuspect === suspect.id ? 'chosen' : ''}`} onClick={() => !result && setSelectedSuspect(suspect.id)} disabled={!!result}><span className="choice-index">0{index + 1}</span><span>{suspect.name}</span>{selectedSuspect === suspect.id ? <span className="choice-radio checked"><Check size={12} /></span> : <span className="choice-radio" />}</button>)}</div>
          {error && <div className="error-message" role="alert">{error}</div>}
          {result ? (
            <div className={`result-card ${result.correct ? 'correct' : 'incorrect'}`} role="status" aria-live="polite"><div className="result-heading">{result.correct ? 'CASE SOLVED' : 'NOT SO FAST'}</div><p>{result.correct ? 'You found the truth.' : `The culprit was ${result.culprit.name}.`}</p><div className="result-explanation">{result.explanation}</div></div>
          ) : (
            <><button className="primary-button submit-button" disabled={!selectedSuspect || busy} onClick={onSubmit}>{busy ? <><span className="spinner" /> CHECKING YOUR THEORY…</> : <>SUBMIT YOUR THEORY <ArrowRight size={15} /></>}</button><div className="sealed-note"><LockKeyhole size={13} /><span>The answer key stays sealed<br />until you submit your theory.</span></div></>
          )}
        </aside>
      </div>
      <div className="case-footer"><span><MessageSquare size={13} /> NEED A FRESH PERSPECTIVE? TRACE EACH CLAIM BACK TO ITS SOURCE.</span><span>INVESTIGATION IN PROGRESS <span className="status-dot" /></span></div>
    </main>
  );
}

function SuspectCard({ suspect, index }) {
  return <article className="suspect-card" style={{ '--suspect-color': suspect.color || '#bb9b6c' }}>
    <div className="suspect-card-top"><span className="suspect-number">SUSPECT 0{index + 1}</span><span className="suspect-avatar"><UserRound size={20} /></span></div>
    <h3>{suspect.name}</h3><div className="suspect-role">{suspect.role}{suspect.age ? ` · ${suspect.age}` : ''}</div>
    <div className="suspect-detail"><b>MOTIVE ON RECORD</b><p>{suspect.motive}</p></div>
    <div className="suspect-detail"><b>STATED ALIBI</b><p>{suspect.alibi}</p></div>
    <div className="suspect-bio">{suspect.bio}</div>
  </article>;
}

function EvidenceModal({ item, caseId, onClose }) {
  return <div className="modal-backdrop" onClick={onClose}><section className="evidence-modal" role="dialog" aria-modal="true" aria-labelledby="evidence-title" onClick={(event) => event.stopPropagation()}>
    <button className="modal-close" onClick={onClose} aria-label="Close evidence"><X size={18} /></button>
    <div className="eyebrow"><span className="eyebrow-line" /> EXHIBIT {item.id.toUpperCase()}</div><div className="evidence-type">{item.type}</div><h2 id="evidence-title">{item.title}</h2>
    <div className="modal-meta"><span><Clock3 size={14} />{item.time}</span><span><FileText size={14} />{item.source}</span></div>
    <div className="evidence-transcript">{item.text}</div><div className="modal-stamp">FICTIONAL EVIDENCE <span>·</span> CASE {caseId?.slice(0, 8).toUpperCase()}</div>
  </section></div>;
}

function ResultModal({ result, onClose, onNewCase }) {
  return <div className="modal-backdrop" onClick={onClose}><section className={`evidence-modal reveal-modal ${result.correct ? 'correct' : 'incorrect'}`} role="dialog" aria-modal="true" aria-labelledby="reveal-title" onClick={(event) => event.stopPropagation()}>
    <button className="modal-close" onClick={onClose} aria-label="Close result"><X size={18} /></button>
    <div className="eyebrow"><span className="eyebrow-line" /> INVESTIGATION REVEALED</div><div className="evidence-type">{result.correct ? 'CASE SOLVED' : 'INCORRECT THEORY'}</div>
    <h2 id="reveal-title">{result.correct ? 'You found the truth.' : `The culprit was ${result.culprit.name}.`}</h2>
    <div className="reveal-explanation">{result.explanation}</div>
    <div className="reveal-actions"><button className="primary-button reveal-button" onClick={onNewCase}>START A NEW CASE <ArrowRight size={15} /></button><button className="reveal-return" onClick={onClose}>RETURN TO THIS CASE</button></div>
  </section></div>;
}

function evidenceIcon(type = '') {
  const value = type.toLowerCase();
  if (value.includes('chat') || value.includes('message')) return <MessageSquare size={17} />;
  if (value.includes('audio') || value.includes('recording')) return <AudioLines size={17} />;
  if (value.includes('call')) return <ArrowDownLeft size={17} />;
  if (value.includes('witness') || value.includes('statement')) return <UserRound size={17} />;
  if (value.includes('timeline')) return <Clock3 size={17} />;
  if (value.includes('document') || value.includes('note')) return <FileText size={17} />;
  return <Search size={17} />;
}
