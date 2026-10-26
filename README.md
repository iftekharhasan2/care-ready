# কেয়াররেডি হেলথ (CareReady Health) — প্রোটোটাইপ

React + Vite prototype of the CareReady Health product blueprint, with Bangla dummy data.
All names, reports, prices and targets are fictional placeholders.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## Three portals

The landing page asks who you are and opens a separate portal for each role. Every screen has a link of the form `#role.page`.

| Portal | Screens |
| --- | --- |
| রোগী ও পরিবার (`#patient.home`) | home, record, access, passport, specialist, family, followup |
| ক্লিনিক ডেস্ক (`#clinic.home`) | home (today's queue), verify (verification queue), agent (agent desk) |
| ডাক্তার (`#doctor.home`) | home (today's patients), review (record review with source page), passport (a patient's full history: timeline, conditions, prescriptions, treating doctors; opens only with the patient's consent), approvals |

All three portals also have a `messages` screen (`pages/shared/MessagesPage.jsx`). Patient, doctor and clinic share one conversation per patient. A message marked private (`private: true`) is shown only to the patient and the doctor; the clinic view filters it out, including from previews. In this prototype the filter runs in the browser; a real build must enforce it on the server.

Telemedicine (`tele` screen in each portal) is video-first:

1. The patient records a video of at most 2 minutes (`VIDEO_LIMIT`) and sends it.
2. The clinic approves the video's technical quality, or asks for a re-recording with a reason.
3. The doctor watches approved videos and either sends written advice or asks for a live appointment (online is enough, or the patient must come to the chamber).
4. The patient is asked to agree. Only then can the clinic schedule.
5. The clinic assigns an open slot from the doctor's schedule: Google Meet for online, the chamber address for physical. With no open slot the patient goes on a waiting list.

State is shared in `App.jsx` (`teleActions`). The recorder, video player, Meet link and SMS are simulated; a real build needs camera capture, video storage and the Google Calendar API.

Test orders (`tests` screen in each portal):

1. The doctor picks tests for a patient and marks each one required or optional.
2. The clinic arranges each test: lab, time and how the sample is collected.
3. The patient (or the clinic, for a lab report) marks the test done and uploads the report.
4. The second appointment unlocks only when every required test has a report (`utils/tests.js`, `testsReady`). The patient applies, then the clinic assigns a slot from the same doctor schedule telemedicine uses (`slotOwner` in `App.jsx`).

The doctor can make a test optional at any time, which is the clinical override for the gate. Report upload is simulated.

Emergency appointments: the clinic can book one for any patient at any time, outside the video, consent and test-report steps (`EmergencyDialog`, opened from the clinic home, the test desk and the telemedicine desk). A reason and a tick that the doctor was told by phone are required. Each entry records who booked it, when, and which rule was skipped. The doctor sees it on the home screen and acknowledges it; the patient sees it on the home and tests screens. It does not unlock the normal second appointment.

Every patient, doctor and clinic has a unique ID (`CR-P-…`, `CR-D-…`, `CR-C-…`) held in `directory` in `utils/data.js` and shown in the top bar, lists, messages and the patient's ID card. The clinic queue can be searched by name or ID.

Each portal has its own accent colour (green, blue, plum) set in `styles/tokens.css` via `[data-role]`.

## Bangladesh-specific features

| Feature | Where | Demo behaviour |
| --- | --- | --- |
| Bangla voice | Packet checklist ("বলে উত্তর দিন"), packet sheet and explainer ("শুনুন") | Voice input is simulated with a sample answer. Read-aloud uses the browser's speech synthesis and needs a Bangla voice on the device. |
| WhatsApp / IMO / SMS entry, OTP login | সহজ প্রবেশ | Sample chat thread; OTP demo code is 1234 |
| Agent-assisted mode | সহজ প্রবেশ | Phone number, OTP consent, scan, receipt |
| Guided camera | Packet, "ছবি তুলুন" | Simulated viewfinder with live hints; no real camera |
| Offline-first queue | Packet upload area | Demo network switch; shows MB cost before sending |
| Family account from abroad | পরিবারের অনুমতি | One-OTP approval by the parent |
| Plain-Bangla explainer | কেয়ার পাসপোর্ট | What each test measures, range bar, questions for the doctor |
| Brand to generic | কেয়ার পাসপোর্ট, medicines | `brandMap` in `utils/data.js` is a sample list; verify against a registered drug list |
| One-page summary with QR | Packet, "এক পাতার সারাংশ" | Real QR to a placeholder link; print button appears when run locally |
| Medical-travel pack | বিশেষজ্ঞ মতামত | Checklist per destination plus English packet sample |
| Trust signals | Packet side column, sidebar, specialist cards | Verifier name, BMDC number (sample), no-data-sale line |
| Ramadan, prayer-time quiet, large text | ফলো-আপ সঙ্গী, top bar | Medicine timing changes only show as clinician-approved |

## Structure

```
src/
  components/  reusable UI (Sidebar, TopBar, HeroBanner, Avatar, Panel, PacketSheet, SourceViewer, TrendChart ...)
  pages/
    LandingPage.jsx
    patient/   PatientHome, PacketPage, AccessPage, PassportPage, SpecialistPage, FamilyPage, FollowUpPage, TelePage, TestsPage
    clinic/    ClinicPage, VerifyPage, AgentDeskPage, TeleDeskPage, TestDeskPage
    doctor/    DoctorHome, DoctorReviewPage, DoctorPassportPage, DoctorApprovalsPage, TeleSchedulePage, TestOrdersPage
    shared/    MessagesPage (communication dashboard used by all three roles)
  hooks/       useToast, useHashRoute, useSpeech
  utils/       data.js (all dummy data and role config), bn.js
  styles/      tokens, base, layout, components, pages, landing
  assets/      logo, hero, role illustrations, avatars (SVG)
```

## Assets

- Fonts: Tiro Bangla and Hind Siliguri from Google Fonts (SIL Open Font License).
- Illustrations and avatars in `src/assets` are original SVGs made for this project (no external image host, so they load on slow connections and offline). Icons are drawn in code.
- Animation: Framer Motion. QR codes: qrcode-generator.
