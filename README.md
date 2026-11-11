# optical-kit — merged into frame-kit

**This kit is no longer maintained on its own.** On 2026-11-12 its fountain code, its decoder
and its sender/receiver were folded into **[frame-kit](https://github.com/drsamonline/frame-kit)**
as version 2.0.0.

## Why

`frame-kit` wrapped bytes and `optical-kit` moved them, and both described "self-describing
frames" — two formats (22-byte and 17-byte), two CRCs, two decoders, used by the same three
apps: `helioprism`, `blinkcode-ai`, `BLINKTRANSFER`. Two definitions of one thing drift; this
one had, and `frame-kit`'s default decoder could only peel a stream whose sender used session
`1`.

## What to use instead

```js
const Frame = require("frame-kit.js");

const tx = Frame.Sender(bytes, { blockSize: 1400 });   // tx.next() → frame bytes
const rx = Frame.Receiver();                            // rx.add(frame) → { fresh, complete }
const out = rx.payload();                               // checksum verified
```

| Old | New |
|---|---|
| `Optical.Fountain.encode/symbol` | `Frame.Fountain.encode/symbol` |
| `Optical.Decoder(k, blockSize, session)` | `Frame.Decoder(k, blockSize, transferId)` |
| `Optical.Sender / Optical.Receiver` | `Frame.Sender / Frame.Receiver` |
| `Optical.Frame.pack/unpack` | `Frame.pack / Frame.parse` |
| `Optical.crc32` | `Frame.crc32` |

This repository stays readable so that anything vendoring it still resolves; the code here is
frozen at the last version before the merge.
