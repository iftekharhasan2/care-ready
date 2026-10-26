import { useState } from 'react';
import PageHeader from '../../components/PageHeader.jsx';
import Panel from '../../components/Panel.jsx';
import StepTrack from '../../components/StepTrack.jsx';
import UploadZone from '../../components/UploadZone.jsx';
import DocumentCard from '../../components/DocumentCard.jsx';
import ExtractionTable from '../../components/ExtractionTable.jsx';
import Checklist from '../../components/Checklist.jsx';
import PacketSheet from '../../components/PacketSheet.jsx';
import CameraGuide from '../../components/CameraGuide.jsx';
import PrintSummary from '../../components/PrintSummary.jsx';
import TrustStrip from '../../components/TrustStrip.jsx';
import StatusPill from '../../components/StatusPill.jsx';
import Icon from '../../components/Icon.jsx';
import { bn, taka } from '../../utils/bn.js';
import { consult, contextChecklist, documents, extractedFields, packetSteps } from '../../utils/data.js';

export default function PacketPage({ notify, lowData }) {
  const [selectedDoc, setSelectedDoc] = useState('d1');
  const [fields, setFields] = useState(extractedFields);
  const [checklist, setChecklist] = useState(contextChecklist);
  const [docs, setDocs] = useState(documents);
  const [camera, setCamera] = useState(false);
  const [printing, setPrinting] = useState(false);

  const pendingFields = fields.filter((f) => f.state !== 'verified').length;
  const pendingContext = checklist.filter((c) => !c.done).length;
  const allDone = pendingFields === 0 && pendingContext === 0;

  const verify = (id) => {
    setFields((list) => list.map((f) => (f.id === id ? { ...f, state: 'verified', confidence: 100, note: undefined, by: 'আপনি (ডেমো)' } : f)));
    notify('তথ্যটি উৎস পৃষ্ঠার সাথে মিলিয়ে যাচাই করা হয়েছে।');
  };
  const toggle = (id) => setChecklist((list) => list.map((c) => (c.id === id ? { ...c, done: !c.done } : c)));
  const answerByVoice = (id) => {
    setChecklist((list) => list.map((c) => (c.id === id ? { ...c, done: true, spoken: true, answer: c.voice } : c)));
    notify('আপনার কথা লেখা হয়েছে। ভুল থাকলে ঠিক করে নিন। (ডেমোতে নমুনা উত্তর)');
  };
  const addPhoto = () => {
    setDocs((list) => [...list, { id: `d${Date.now()}`, thumb: 'lab', title: 'ইসিজি রিপোর্ট', kind: 'ক্যামেরায় তোলা', pages: '১', source: 'নির্দেশনা মেনে তোলা ছবি', date: '১০ অক্টোবর ২০২৬', tone: 'good', quality: 'পরিষ্কার পড়া যাচ্ছে' }]);
    notify('ছবি যোগ হয়েছে। প্রথম চেষ্টাতেই পড়া গেছে।');
  };

  return (
    <>
      <PageHeader eyebrow="রেকর্ড ফাইল" title="নেফ্রোলজি পরামর্শের রেকর্ড ফাইল" lead={`${consult.doctor} · ${consult.place} · ${consult.when}`}>
        <button type="button" className="btn btn--ghost" onClick={() => setPrinting(true)}><Icon name="print" size={16} /> এক পাতার সারাংশ</button>
        <button type="button" className="btn btn--primary" onClick={() => notify(allDone ? 'ডা. ফারহানা ইসলামের সাথে ৭ দিনের জন্য শেয়ার হয়েছে (ডেমো)।' : 'যাচাই বাকি থাকা তথ্য চিহ্নিত করে শেয়ার হয়েছে (ডেমো)।')}>
          <Icon name="send" size={16} /> ডাক্তারকে পাঠান
        </button>
      </PageHeader>

      <StepTrack steps={packetSteps} current={allDone ? 5 : 3} />

      <div className="desk">
        <div className="desk__work">
          <Panel title="কাগজপত্র" hint={`${bn(docs.length)}টি ফাইল। একটি বেছে নিলে তার তথ্য নিচে চিহ্নিত হবে।`}>
            <UploadZone notify={notify} onCamera={() => setCamera(true)} />
            <div className="doc-grid">
              {docs.map((doc, i) => (
                <DocumentCard key={doc.id} doc={doc} index={i} lowData={lowData} selected={selectedDoc === doc.id} onSelect={setSelectedDoc} />
              ))}
            </div>
          </Panel>

          <Panel title="রিপোর্ট থেকে পাওয়া তথ্য" hint="প্রতিটি মানের পাশে উৎস পৃষ্ঠার লিংক আছে। কম নিশ্চয়তার তথ্য একজন মানুষ মিলিয়ে দেখেন।" action={<StatusPill tone={pendingFields ? 'stamp' : 'good'}>{pendingFields ? `${bn(pendingFields)}টি যাচাই বাকি` : 'সব যাচাইকৃত'}</StatusPill>}>
            <ExtractionTable fields={fields} docs={docs} selectedDoc={selectedDoc} onSource={setSelectedDoc} onVerify={verify} />
          </Panel>

          <Panel title="ডাক্তার যা জানতে চাইবেন" hint="রিপোর্টে নেই এমন তথ্য। লিখতে না চাইলে মুখে বলুন।" action={<StatusPill tone={pendingContext ? 'warn' : 'good'}>{pendingContext ? `${bn(pendingContext)}টি বাকি` : 'সম্পূর্ণ'}</StatusPill>}>
            <Checklist items={checklist} onToggle={toggle} onVoice={answerByVoice} />
          </Panel>
        </div>

        <div className="desk__side">
          <PacketSheet fields={fields} docs={docs} pendingContext={pendingContext} />
          <TrustStrip />
          <div className="price">
            <div className="price__row"><span>প্রথম রেকর্ড ফাইল</span><strong>বিনামূল্যে</strong></div>
            <div className="price__row"><span>পরের প্রতিটি রেকর্ড ফাইল</span><strong className="num">{taka(150)}</strong></div>
            <ul className="tags"><li>বিকাশ</li><li>নগদ</li><li>কার্ড</li></ul>
            <p>ফাইল প্রক্রিয়া শুরুর আগেই মোট খরচ দেখানো হয়। মাসিক সাবস্ক্রিপশন লাগে না। মূল্যটি নমুনা, এখনো নির্ধারিত নয়।</p>
          </div>
        </div>
      </div>

      <CameraGuide open={camera} onClose={() => setCamera(false)} onAdd={addPhoto} />
      <PrintSummary open={printing} onClose={() => setPrinting(false)} fields={fields} pending={pendingFields + pendingContext} />
    </>
  );
}
