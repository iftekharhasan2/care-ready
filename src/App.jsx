import { useEffect, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import Sidebar from './components/Sidebar.jsx';
import TopBar from './components/TopBar.jsx';
import Toast from './components/Toast.jsx';
import LandingPage from './pages/LandingPage.jsx';
import PatientHome from './pages/patient/PatientHome.jsx';
import PacketPage from './pages/patient/PacketPage.jsx';
import AccessPage from './pages/patient/AccessPage.jsx';
import PassportPage from './pages/patient/PassportPage.jsx';
import SpecialistPage from './pages/patient/SpecialistPage.jsx';
import FamilyPage from './pages/patient/FamilyPage.jsx';
import FollowUpPage from './pages/patient/FollowUpPage.jsx';
import ClinicPage from './pages/clinic/ClinicPage.jsx';
import VerifyPage from './pages/clinic/VerifyPage.jsx';
import AgentDeskPage from './pages/clinic/AgentDeskPage.jsx';
import DoctorHome from './pages/doctor/DoctorHome.jsx';
import DoctorReviewPage from './pages/doctor/DoctorReviewPage.jsx';
import DoctorApprovalsPage from './pages/doctor/DoctorApprovalsPage.jsx';
import DoctorPassportPage from './pages/doctor/DoctorPassportPage.jsx';
import TelePage from './pages/patient/TelePage.jsx';
import TeleDeskPage from './pages/clinic/TeleDeskPage.jsx';
import TeleSchedulePage from './pages/doctor/TeleSchedulePage.jsx';
import TestsPage from './pages/patient/TestsPage.jsx';
import TestDeskPage from './pages/clinic/TestDeskPage.jsx';
import TestOrdersPage from './pages/doctor/TestOrdersPage.jsx';
import MessagesPage from './pages/shared/MessagesPage.jsx';
import useToast from './hooks/useToast.js';
import { emergenciesSeed, ordersSeed, teleSeed, threadsSeed } from './utils/data.js';
import { testsReady } from './utils/tests.js';
import useHashRoute from './hooks/useHashRoute.js';

// Three separate portals. Each role sees only its own screens.
const PAGES = {
  patient: { home: PatientHome, record: PacketPage, access: AccessPage, passport: PassportPage, specialist: SpecialistPage, family: FamilyPage, followup: FollowUpPage, tele: TelePage, tests: TestsPage, messages: MessagesPage },
  clinic: { home: ClinicPage, verify: VerifyPage, agent: AgentDeskPage, tele: TeleDeskPage, tests: TestDeskPage, messages: MessagesPage },
  doctor: { home: DoctorHome, review: DoctorReviewPage, passport: DoctorPassportPage, approvals: DoctorApprovalsPage, tele: TeleSchedulePage, tests: TestOrdersPage, messages: MessagesPage },
};

export default function App() {
  const { role, page, go } = useHashRoute(PAGES);
  const [lowData, setLowData] = useState(false);
  const [bigText, setBigText] = useState(false);
  const { toast, notify } = useToast();
  // Messages live above the portals so a message sent in one is seen in the others.
  const [threads, setThreads] = useState(threadsSeed);
  const sendMessage = (threadId, message) => setThreads((list) => list.map((t) => (t.id === threadId ? { ...t, messages: [...t.messages, message] } : t)));

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('big-text', bigText);
    if (role) root.dataset.role = role; else delete root.dataset.role;
  }, [bigText, role]);

  // Telemedicine requests and the doctor's online slots are shared by all three portals.
  const [tele, setTele] = useState(teleSeed);
  const teleActions = {
    apply: (request) => setTele((t) => ({ ...t, requests: [...t.requests, { ...request, id: `t${Date.now()}`, status: 'video_review', asked: 'এইমাত্র' }] })),
    update: (id, changes) => setTele((t) => ({ ...t, requests: t.requests.map((r) => (r.id === id ? { ...r, ...changes } : r)) })),
    cancel: (id) => setTele((t) => ({ ...t, requests: t.requests.filter((r) => r.id !== id) })),
    toggleSlot: (slotId) => setTele((t) => ({ ...t, slots: t.slots.map((s) => (s.id === slotId ? { ...s, open: !s.open } : s)) })),
  };

  // Test orders: the doctor suggests, the clinic arranges, reports unlock the second appointment.
  const [orders, setOrders] = useState(ordersSeed);
  const orderActions = {
    create: (patient, items, note) => setOrders((list) => {
      const fresh = items.map((it, i) => ({ ...it, id: `i${Date.now()}${i}`, status: 'ordered' }));
      return list.some((o) => o.patient === patient)
        ? list.map((o) => (o.patient === patient ? { ...o, items: [...o.items, ...fresh], note: note || o.note } : o))
        : [...list, { id: `o${Date.now()}`, patient, doctor: 'ডা. ফারহানা ইসলাম', date: 'আজ', note, followup: null, items: fresh }];
    }),
    item: (orderId, itemId, changes) => setOrders((list) => list.map((o) => (o.id === orderId ? { ...o, items: o.items.map((it) => (it.id === itemId ? { ...it, ...changes } : it)) } : o))),
    followup: (orderId, followup) => setOrders((list) => list.map((o) => (o.id === orderId ? { ...o, followup } : o))),
  };
  // One schedule for everything: a slot is taken by a telemedicine visit or by a second appointment.
  const slotOwner = (slotId) => tele.requests.find((r) => r.slotId === slotId && r.status === 'confirmed')
    || orders.filter((o) => o.followup?.slotId === slotId).map((o) => ({ patient: o.patient, reason: 'পরীক্ষার রিপোর্টের পর দ্বিতীয় সাক্ষাৎ' }))[0];
  const myOrder = orders.find((o) => o.patient === 'রহিমা বেগম');
  const testsTodo = {
    patient: myOrder ? myOrder.items.filter((it) => ['scheduled', 'done'].includes(it.status)).length + (testsReady(myOrder) && !myOrder.followup ? 1 : 0) : 0,
    clinic: orders.reduce((n, o) => n + o.items.filter((it) => it.status === 'ordered').length + (o.followup?.status === 'requested' ? 1 : 0), 0),
    doctor: 0,
  };

  // Emergency appointments: the clinic can book one at any time, outside the normal steps.
  const [emergencies, setEmergencies] = useState(emergenciesSeed);
  const emergencyActions = {
    create: (entry) => setEmergencies((list) => [{ ...entry, id: `e${Date.now()}`, by: 'তাসলিমা খাতুন', at: 'এইমাত্র', ack: false }, ...list]),
    ack: (id) => setEmergencies((list) => list.map((e) => (e.id === id ? { ...e, ack: true } : e))),
    cancel: (id) => setEmergencies((list) => list.filter((e) => e.id !== id)),
  };
  const urgentTodo = { patient: emergencies.filter((e) => e.patient === 'রহিমা বেগম').length, clinic: 0, doctor: emergencies.filter((e) => !e.ack).length };

  // How many telemedicine items are waiting on each role, shown as a menu badge.
  const count = (statuses, own) => tele.requests.filter((r) => statuses.includes(r.status) && (!own || r.patient === 'রহিমা বেগম')).length;
  const teleTodo = { patient: count(['video_redo', 'consent'], true), clinic: count(['video_review', 'scheduling', 'waitlist']), doctor: count(['doctor_review']) };

  const Page = role ? PAGES[role][page] : null;

  return (
    <MotionConfig reducedMotion={lowData ? 'always' : 'user'}>
      {role ? (
        <div className="shell">
          <Sidebar role={role} active={page} badges={{ home: urgentTodo[role], tele: teleTodo[role], tests: testsTodo[role] }} onSelect={(id) => go(role, id)} onSwitchRole={() => go(null)} />
          <div className="main">
            <TopBar role={role} page={page} lowData={lowData} onToggleLowData={() => setLowData((v) => !v)} bigText={bigText} onToggleBigText={() => setBigText((v) => !v)} />
            <AnimatePresence mode="wait">
              <motion.main key={`${role}.${page}`} className="page" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
                <Page role={role} notify={notify} lowData={lowData} goTo={(id) => go(role, id)} threads={threads} onSend={sendMessage} tele={tele} teleActions={teleActions} orders={orders} orderActions={orderActions} slotOwner={slotOwner} emergencies={emergencies} emergencyActions={emergencyActions} />
              </motion.main>
            </AnimatePresence>
          </div>
        </div>
      ) : (
        <LandingPage onEnter={(r) => go(r)} />
      )}
      <Toast toast={toast} />
    </MotionConfig>
  );
}
