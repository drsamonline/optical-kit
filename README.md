# optical-kit

[![live](https://img.shields.io/badge/live-online-22c55e)](https://drsamonline.github.io/optical-kit/)
[![license](https://img.shields.io/badge/license-MIT-blue)](LICENSE)


**The shared optical-transfer core for drsamonline apps.** One file, no build
step, no dependencies.

This is the transport logic behind the transfer apps (`helioprism`,
`blinkcode-ai`, `BLINKTRANSFER`), extracted once so it isn't re-implemented three
times:

- a **systematic LT fountain code** — the receiver needs *any* ~k frames, so a
  dropped frame costs time, never correctness (there is no back-channel to ask
  for a resend);
- **self-describing frames** — session, sequence, block count, block size, total
  length, and a CRC, so a receiver can lock onto a stream mid-flight;
- a **sender** and a **receiver** with progress;
- a **pluggable codec** — the app supplies the QR or colour-matrix renderer.

## Why a fountain code

A screen-to-camera (or speaker-to-mic) link has no way to ask for a retransmit,
and a camera *will* drop frames. Numbered frames then need the receiver to catch
every one — a coupon-collector problem. A fountain code needs only *enough*
frames, in any order, so a loss costs a little time and nothing else.

## API

```js
// send
const sender = Optical.Sender(dataBytes, { blockSize: 1400 });
sender.session; sender.k;                 // tell the receiver these first
const frame = sender.next();              // a Uint8Array; render it as a QR / matrix

// receive
const rx = Optical.Receiver(session, k, blockSize, totalLen);
rx.add(frameBytes);                       // returns progress 0..1
rx.progress();                            // 0..1
rx.result();                              // Uint8Array, or null until complete
```

Lower-level pieces: `Optical.Fountain` (encode/symbol), `Optical.Decoder`
(peeling), `Optical.Frame` (pack/unpack), `Optical.crc32`, `Optical.bytes`
(text/base64).

## Verified

`test-node.js` proves the round-trip, including dropped frames:

```
node test-node.js
PASS  1024B block=1400 loss=0%   k=1   overhead=1.00x
PASS  51200B block=1400 loss=0%  k=37  overhead=1.00x
PASS  51200B block=1400 loss=10% k=37  overhead=1.11x
PASS  51200B block=1400 loss=30% k=37  overhead=1.46x
PASS  204800B block=2000 loss=10% k=103 overhead=1.20x
PASS  524288B block=2000 loss=20% k=263 overhead=1.47x
PASS  10240B block=800 loss=15%  k=13  overhead=1.00x
7 passed, 0 failed
```

The browser demo (`demo/index.html`) runs the same round-trip in-page.

## Pluggable codec

`optical-kit` moves bytes; it does not draw them. The app renders each frame with
its own codec:

- **QR** — e.g. `zxing-wasm` / `jsQR`, one frame per code;
- **colour matrix** — a dense grid of colour cells;
- **multi-code grid** — several codes per displayed frame.

## Licence

MIT. (c) 2026 Dr Sohil Momin.

Part of the Forge system. Kits are open; the orchestrator is licensed.
