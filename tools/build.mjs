// Builds burakuro-extra.js (the WHOLE burakuro channel script, loaded via External Javascript).
// Parts, in order:
//   1. burakuro's own channel JS as it was live on 2026-11-07 (clock, favicon, Ctrl+A / Ctrl+S keys, DesuTheMaid colours)
//   2. from F:/Projects/cytube/wideamari-js/wideamari-extra.js: "cytube times" playlist start times,
//      the "/" emote dropdown, the sound emotes block (renamed wideamari -> burakuro, own SOUNDS list)
// Run: node F:/Projects/cytube/burakuro-js/tools/build.mjs
import fs from 'node:fs';

const ROOT = 'F:/Projects/cytube/burakuro-js/';
const BASE = 'https://nostramadeus.github.io/burakuro-js/';
const wide = fs.readFileSync('F:/Projects/cytube/wideamari-js/wideamari-extra.js', 'utf8');
const own = fs.readFileSync(ROOT + 'backup/live-channel-js-2026-11-07.js', 'utf8');

const cut = (from, to) => {
    const a = wide.indexOf(from), b = wide.indexOf(to);
    if (a < 0 || b < 0 || b < a) throw new Error('marker not found: ' + from + ' / ' + to);
    return wide.slice(a, b + to.length);
};
const times = cut('//Yunose\'s playlist add-on', "document.head.append(s)");
const dropdown = cut('/*! "/" emote dropdown start', '/*! "/" emote dropdown end */');
const rename = s => s.replace(/wideamari/g, 'burakuro').replace(/Wideamari/g, 'Burakuro');
let sound = rename(cut('/*! sound emotes start */', '/*! sound emotes end */'));

// [sound name, picture emote, file, what is said (Japanese audio; English = the game's subtitle)]
const SOUNDS = [
    ['/doroclapsound', '/doroclap', 'doroclapsound.mp3', 'clapping (same sound as pinoko.moe and wideamari)'],
    ['/laughsound', '/laugh', 'laughsound.mp3', 'laugh (same sound as pinoko.moe)'],
    ['/yamibreaksound', '/yamibreak', 'yamibreaksound.mp3', 'Yami: "You look like you need a break"'],
    ['/yamilimitsound', '/yamilimit', 'yamilimitsound.mp3', 'Yami: "You\'ve gotta break past your limits, that\'s the only way!"'],
    ['/yamiwahahasound', '/yamiwahaha', 'yamiwahahasound.mp3', 'Yami: "Wahahaha! What a blast!"'],
    ['/astagiveupsound', '/astagiveup', 'astagiveupsound.mp3', 'Asta: "I\'ll never give up!"'],
    ['/yunodebtsound', '/yunodebt', 'yunodebtsound.mp3', 'Yuno: "I thought I\'d finally returned the favor"'],
    ['/luckfunsound', '/luckfun', 'luckfunsound.mp3', 'Luck: "Don\'t finish yet, I\'m having fun!"'],
    ['/charmyhungrysound', '/charmyhungry', 'charmyhungrysound.mp3', 'Charmy: "I... I\'m so hungry... Can\'t move..."'],
    ['/vanessadrinksound', '/vanessadrink', 'vanessadrinksound.mp3', 'Vanessa: "Let\'s have a drink!"'],
    ['/mereoleonasound', '/mereoleona', 'mereoleonasound.mp3', 'Mereoleona: "I will show you how a lion hunts!"'],
    ['/magnacoolsound', '/magnacool', 'magnacoolsound.mp3', 'Magna: "So cool!"'],
];
const list = SOUNDS.map(([n, l, f, what]) =>
    `        { name: '${n}', look: '${l}', url: '${BASE}sounds/${f}' }, // ${what}`).join('\n');
const listRe = /(    var SOUNDS = \[\n)[\s\S]*?(\n    \];)/;
if (!listRe.test(sound)) throw new Error('SOUNDS list not found');
sound = sound.replace(listRe, `$1${list}\n        // { emote: '/doroclap', url: 'https://files.catbox.moe/xxxxxx.mp3' },$2`);

const header = `/*! burakuro channel JavaScript: the WHOLE channel script lives in this one file.
 * cytu.be loads it from Channel settings → General settings → External Javascript:
 *   ${BASE}burakuro-extra.js
 * The Edit → JavaScript box only holds a short pointer comment (cytu.be cuts that box at 20,000 characters).
 * Readable source + history: https://github.com/Nostramadeus/burakuro-js
 * Undo: paste backup/live-channel-js-2026-11-07.js into Edit → JavaScript and clear External Javascript. */
`;

const out = header
    + '\n/*! burakuro channel JS (live 2026-11-07) start */\n' + own.trimEnd() + '\n/*! burakuro channel JS end */\n\n'
    + rename(times) + '\n\n'
    + rename(dropdown) + '\n\n'
    + sound + '\n';
fs.writeFileSync(ROOT + 'burakuro-extra.js', out);
console.log('burakuro-extra.js', out.length, 'chars;', SOUNDS.length, 'sounds');
