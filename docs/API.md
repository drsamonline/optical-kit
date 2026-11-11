# optical-kit — API reference

**Version 1.0.0.** **The shared optical-transfer core for drsamonline apps.** One file, no build step, no dependencies.

Generated from the source in this repository: every name, argument and
note below is read out of the kit file, so it cannot describe a function
that is not there.

```js
<script src="optical-kit.js"></script>
Kit.bytes(...)
// or: const Kit = require('./optical-kit.js')
```

## The surface (6 entries)

| Name | Arguments | What it does |
|---|---|---|
| `Kit.bytes` | `()` | — |
| `Kit.Fountain` | `()` | — |
| `Kit.Decoder` | `(k, blockSize, session)` | — |
| `Kit.Frame` | `()` | — |
| `Kit.Sender` | `(data, opts)` | — |
| `Kit.Receiver` | `(session, k, blockSize, totalLen)` | — |

## Notes

- Zero dependencies, one file, no build step: it works from `file://`, from a
  `<script>` tag and from Node.
- The version above is the `VERSION` file in this repository; a pinned copy is
  what an app vendors.
