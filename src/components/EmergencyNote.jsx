import Icon from './Icon.jsx';

export default function EmergencyNote() {
  return (
    <aside className="emergency-note">
      <Icon name="alert" size={20} />
      <p><strong>বুকে ব্যথা, তীব্র শ্বাসকষ্ট বা অজ্ঞান হলে এখনই ৯৯৯ এ ফোন করুন</strong> অথবা কাছের হাসপাতালের জরুরি বিভাগে যান। এই বার্তা ও রেকর্ড সহায়ক জরুরি সেবার বিকল্প নয়।</p>
    </aside>
  );
}
