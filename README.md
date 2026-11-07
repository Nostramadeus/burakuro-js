# burakuro-js

Extra JavaScript for the cytu.be channel **burakuro**.

| File | What it is |
|---|---|
| `burakuro-extra.js` | The WHOLE channel script. cytu.be loads it from Channel settings → General settings → **External Javascript**: `https://nostramadeus.github.io/burakuro-js/burakuro-extra.js`. Built by `tools/build.mjs`. |
| `channel-js.js` | What goes in Channel settings → Edit → **JavaScript**: only a pointer comment. |
| `sounds/` | Sound files for the sound emotes (Japanese voice clips, 1 to 4 s each). |
| `emotes/` | Pictures for the 10 Black Clover emotes the sound names borrow. |
| `backup/` | The channel JavaScript and CSS as they were live on 2026-11-07. Paste the JS back into Edit → JavaScript (and clear External Javascript) to undo. |

## What the script does

- Clock above the chat (local time and UTC), favicon, Ctrl+A (select chat line), Ctrl+S (wrap in a spoiler).
- Playlist start times: every queued video shows the clock time it will start.
- "/" emote dropdown: typing `/no` opens a picture list of matching emotes; arrow keys + Enter pick one.
- Sound emotes: posting a sound name (for example `/yamibreaksound`) shows the borrowed emote picture with a gold border and plays the clip for everyone. The 🔊 button next to the emote button turns sounds on or off and sets the volume (saved per browser).

## Sounds

| Type in chat | Picture | Sound |
|---|---|---|
| `/doroclapsound` | `/doroclap` | clapping |
| `/laughsound` | `/laugh` | laugh |
| `/yamibreaksound` | `/yamibreak` | Yami: "You look like you need a break" |
| `/yamilimitsound` | `/yamilimit` | Yami: "You've gotta break past your limits, that's the only way!" |
| `/yamiwahahasound` | `/yamiwahaha` | Yami: "Wahahaha! What a blast!" |
| `/astagiveupsound` | `/astagiveup` | Asta: "I'll never give up!" |
| `/yunodebtsound` | `/yunodebt` | Yuno: "I thought I'd finally returned the favor" |
| `/luckfunsound` | `/luckfun` | Luck: "Don't finish yet, I'm having fun!" |
| `/charmyhungrysound` | `/charmyhungry` | Charmy: "I... I'm so hungry... Can't move..." |
| `/vanessadrinksound` | `/vanessadrink` | Vanessa: "Let's have a drink!" |
| `/mereoleonasound` | `/mereoleona` | Mereoleona: "I will show you how a lion hunts!" |
| `/magnacoolsound` | `/magnacool` | Magna: "So cool!" |

## Adding a sound

1. Put the mp3 in `sounds/`.
2. Add one entry to the `SOUNDS` list in `tools/build.mjs`, run `node tools/build.mjs`, commit, push.

## Tests

`node tests/load-smoke.test.mjs` (whole script loads, every part starts) and `node tests/sound-play.test.mjs` (sound play rules). Both use jsdom.

The "/" dropdown and sound emotes code comes from the wideamari channel script (https://github.com/Nostramadeus/wideamari-js); the playlist start times are "cytube times" by nuui and others.
