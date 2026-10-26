import Icon from './Icon.jsx';
import { consult, verifier } from '../utils/data.js';

export default function TrustStrip() {
  return (
    <ul className="trust">
      <li><Icon name="check" size={16} /><span><strong>যাচাই করেছেন {verifier.name}</strong>{verifier.team} · {verifier.when}</span></li>
      <li><Icon name="shield" size={16} /><span><strong>{consult.doctor}</strong>BMDC নিবন্ধন নং {consult.bmdc}</span></li>
      <li><Icon name="lock" size={16} /><span><strong>আপনার তথ্য বিক্রি হয় না</strong>কে কখন দেখেছে তা আপনি সবসময় দেখতে পারেন।</span></li>
    </ul>
  );
}
