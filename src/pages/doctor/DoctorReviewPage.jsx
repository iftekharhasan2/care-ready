import { useState } from 'react';
import PageHeader from '../../components/PageHeader.jsx';
import Panel from '../../components/Panel.jsx';
import ExtractionTable from '../../components/ExtractionTable.jsx';
import SourceViewer from '../../components/SourceViewer.jsx';
import TrendChart from '../../components/TrendChart.jsx';
import PrintSummary from '../../components/PrintSummary.jsx';
import Avatar from '../../components/Avatar.jsx';
import StatusPill from '../../components/StatusPill.jsx';
import Icon from '../../components/Icon.jsx';
import { contextChecklist, doctorNote, documents, extractedFields, labSeries, patient } from '../../utils/data.js';

export default function DoctorReviewPage({ notify, goTo }) {
  const [picked, setPicked] = useState('f1');
  const [note, setNote] = useState(doctorNote);
  const [printing, setPrinting] = useState(false);

  const field = extractedFields.find((f) => f.id === picked);
  const doc = documents.find((d) => d.id === field.docId);
  const siblings = extractedFields.filter((f) => f.docId === field.docId);
  const lines = siblings.map((f) => `${f.label}   ${f.value} ${f.unit}`);
  const pending = extractedFields.filter((f) => f.state !== 'verified').length;
  const set = (key) => (e) => setNote((n) => ({ ...n, [key]: e.target.value }));

  return (
    <>
      <PageHeader eyebrow="রেকর্ড রিভিউ · সকাল ১০:৩০" title={`${patient.name}, ${patient.age}`} lead={`${patient.id} · ${patient.sex} · রক্তের গ্রুপ ${patient.blood} · ${patient.area} · সাথে আসবেন ${patient.caregiver}`}>
        <button type="button" className="btn btn--ghost" onClick={() => goTo('tests')}><Icon name="flask" size={16} /> পরীক্ষার পরামর্শ</button>
        <button type="button" className="btn btn--ghost" onClick={() => goTo('passport')}><Icon name="passport" size={16} /> পুরো ইতিহাস</button>
        <button type="button" className="btn btn--ghost" onClick={() => setPrinting(true)}><Icon name="print" size={16} /> এক পাতার সারাংশ</button>
        <button type="button" className="btn btn--primary" onClick={() => notify('রিভিউ শেষ হিসেবে চিহ্নিত হয়েছে এবং অডিট তালিকায় লেখা হয়েছে (ডেমো)।')}><Icon name="check" size={16} /> রিভিউ শেষ</button>
      </PageHeader>

      <div className="person person--strip">
        <Avatar kind="patient" size="lg" />
        <ul className="tags tags--plain">{patient.conditions.map((c) => (<li key={c}>{c}</li>))}<li>সালফা জাতীয় ওষুধে অ্যালার্জি</li></ul>
      </div>

      <div className="desk">
        <div className="desk__work">
          <Panel title="রিপোর্টের তথ্য" hint="উৎসের বোতামে চাপ দিলে ডান পাশে মূল পৃষ্ঠার সারিটি দেখাবে।" action={<StatusPill tone={pending ? 'stamp' : 'good'}>{pending ? 'যাচাই বাকি থাকা মান আলাদা চিহ্নিত' : 'সব যাচাইকৃত'}</StatusPill>}>
            <ExtractionTable fields={extractedFields} docs={documents} selectedField={picked} onSource={(_, f) => setPicked(f.id)} readOnly />
          </Panel>

          <Panel title="ক্রিয়েটিনিনের ধারা" hint="৬ মাস, তিনটি ল্যাব। প্রতিটি বিন্দুর নিচে ল্যাবের নাম।">
            <TrendChart series={labSeries.creatinine} />
          </Panel>

          <Panel title="রোগী যা জানিয়েছেন">
            <ul className="rows">
              {contextChecklist.map((c) => (
                <li key={c.id}>
                  <Icon name={c.done ? 'check' : 'clock'} size={17} />
                  <div><strong>{c.text}</strong><span className="muted">{c.done ? c.answer : 'রোগীর উত্তরের অপেক্ষায়'}</span></div>
                  {!c.done && <StatusPill tone="warn" dot={false}>বাকি</StatusPill>}
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        <div className="desk__side">
          <Panel title="উৎস পৃষ্ঠা" hint={`${field.label} · নিশ্চয়তা ও যাচাইকারী টেবিলে`}>
            <SourceViewer title={`${doc.title} · ${doc.source} · পৃ. ${field.page}`} lines={lines} hit={siblings.indexOf(field)} hand={doc.thumb === 'rx'} />
          </Panel>

          <Panel title="আপনার নোট">
            <label className="field" htmlFor="note-assessment"><span>মূল্যায়ন</span><textarea id="note-assessment" rows="4" value={note.assessment} onChange={set('assessment')} /></label>
            <label className="field" htmlFor="note-plan"><span>পরিকল্পনা</span><textarea id="note-plan" rows="4" value={note.plan} onChange={set('plan')} /></label>
            <button type="button" className="btn btn--primary btn--block" onClick={() => notify('নোট সংরক্ষিত। কেয়ার প্ল্যানের খসড়া রোগীর ফলো-আপ তালিকায় গেছে (ডেমো)।')}><Icon name="send" size={16} /> সংরক্ষণ করে কেয়ার প্ল্যান পাঠান</button>
          </Panel>
        </div>
      </div>

      <PrintSummary open={printing} onClose={() => setPrinting(false)} fields={extractedFields} pending={pending} />
    </>
  );
}
