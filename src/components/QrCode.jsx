import { useMemo } from 'react';
import qrcode from 'qrcode-generator';

/** Real, scannable QR. Always black on white so scanners can read it in either theme. */
export default function QrCode({ value, size = 116, label }) {
  const { count, path } = useMemo(() => {
    const qr = qrcode(0, 'M');
    qr.addData(value);
    qr.make();
    const n = qr.getModuleCount();
    let d = '';
    for (let r = 0; r < n; r += 1) for (let c = 0; c < n; c += 1) if (qr.isDark(r, c)) d += `M${c} ${r}h1v1h-1z`;
    return { count: n, path: d };
  }, [value]);

  return (
    <svg className="qr" width={size} height={size} viewBox={`-2 -2 ${count + 4} ${count + 4}`} role="img" aria-label={label} shapeRendering="crispEdges">
      <rect x="-2" y="-2" width={count + 4} height={count + 4} fill="#ffffff" />
      <path d={path} fill="#000000" />
    </svg>
  );
}
