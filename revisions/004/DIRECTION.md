# 004 — “API keys — sticker story”

Portrait 1080×1920, 57 s, 30 fps, nine narration beats.

## Why it exists

Owner's feedback on 003: the key icon was ugly, everything felt too small, stale UI was visible whenever the camera returned, scenes repeated themselves and nothing was tightly synced to the voice. This revision is the answer:

- **Sticker art style** instead of stroke icons — a coherent die-cut set (`STICKER_STYLE.md`), big hero sizes (470 px hero, 260 px flow stickers, 190 px rule stickers).
- **One-way camera**: four viewports A→B→C→D travelled as right, down, right — the camera never returns, and every scene retires while the camera moves away, so stale UI can physically not reappear.
- **Beat-level sync**: nine short narration clips; each sticker/pill pops at the exact start of the sentence that introduces it (measured with ffprobe, then corrected to the Hyperframes runtime lengths). Pulses land on specific words (“one tiny string”, “the door opens”, “Verify”, “Protect”).
- **No repetition**: every screen state is new content — identity → request flow → safety rules → leak/recovery → cycle + rocket.

## Beat map (start = audio in, pop lands the same frame)

| Beat | Start | Sentence | Visual event |
| --- | --- | --- | --- |
| 1 | 0.90 | Meet the API key… | key sticker pops (hero), underline at 5.2 |
| 2 | 7.07 | It carries two facts… | pulse; “who is asking” 8.2, “what it may do” 9.8 |
| 3 | 12.75 | When your app calls… | camera A→B 12.55; app pops 13.6; header pill 15.5; request line draws 16.2 |
| 4 | 18.27 | The server checks it… | server pops 19.2; check badge 21.3 |
| 5 | 24.15 | Approved — door opens… | pulse 25.4; response line + database 25.45/27.3 |
| 6 | 29.71 | Keep it safe… | camera B→C 29.0; rule 1 slides 31.0, pulse 33.4 |
| 7 | 35.11 | Smallest scope… | rule 2 at 36.3, rule 3 at 38.7 |
| 8 | 40.85 | If a key leaks? | camera C→D 40.3; broken key 41.85; revoke 43.0, fresh key 44.0, update 45.3 |
| 9 | 46.36 | Identify. Verify. Protect. | cycle pill 46.4 + word pulses; rocket launch 50.55–51.8, hover to end |

Film ends 57.0 (≈4.5 s tail after the last word).

## Validation

Lint 0/0 · browser tests 6/6 · Hyperframes check PASS (runtime/layout/motion 300 samples/contrast, zero warnings) · rendered + artifact-verified (see `qa/`).
