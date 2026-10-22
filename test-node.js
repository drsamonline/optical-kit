/* Node test for optical-kit: prove the fountain round-trips, with dropped frames. */
const path = require("path");
require(path.join(__dirname, "optical-kit.js"));
const Optical = global.Optical;

function rand(n) { const a = new Uint8Array(n); for (let i = 0; i < n; i++) a[i] = (i * 2654435761) % 256; return a; }

function run(bytes, blockSize, loss) {
  const data = rand(bytes);
  const sender = Optical.Sender(data, { blockSize: blockSize, session: 1234 });
  const rx = Optical.Receiver(sender.session, sender.k, sender.blockSize, data.length);
  let sent = 0, accepted = 0;
  while (rx.progress() < 1 && sent < sender.k * 6) {
    const frame = sender.next();
    sent++;
    if (loss && Math.random() < loss) continue; // dropped frame
    if (rx.add(frame) !== null) accepted++;
  }
  const out = rx.result();
  if (!out) return { ok: false, reason: "no result", sent, accepted, k: sender.k };
  let same = out.length === data.length;
  for (let i = 0; same && i < data.length; i++) if (out[i] !== data[i]) same = false;
  return { ok: same, sent, accepted, k: sender.k, overhead: (accepted / sender.k).toFixed(2) };
}

const cases = [
  [1024, 1400, 0], [50 * 1024, 1400, 0], [50 * 1024, 1400, 0.10], [50 * 1024, 1400, 0.30],
  [200 * 1024, 2000, 0.10], [512 * 1024, 2000, 0.20], [10 * 1024, 800, 0.15],
];
let pass = 0, fail = 0;
for (const [bytes, bs, loss] of cases) {
  const r = run(bytes, bs, loss);
  const label = `${bytes}B block=${bs} loss=${Math.round(loss*100)}%`;
  if (r.ok) { pass++; console.log(`PASS  ${label}  k=${r.k} frames=${r.sent} overhead=${r.overhead}x`); }
  else { fail++; console.log(`FAIL  ${label}  ${JSON.stringify(r)}`); }
}
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
