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
    ['/yamitakeabreaksound', '/yamitakeabreak', 'yamitakeabreaksound.mp3', 'Yami: "You look like you need a break"'],
    ['/yamisurpassyourlimitssound', '/yamisurpassyourlimits', 'yamisurpassyourlimitssound.mp3', 'Yami: "You\'ve gotta break past your limits, that\'s the only way!"'],
    ['/yamilaughwahahasound', '/yamilaughwahaha', 'yamilaughwahahasound.mp3', 'Yami: "Wahahaha! What a blast!"'],
    ['/astanevergivingupismymagicsound', '/astanevergivingupismymagic', 'astanevergivingupismymagicsound.mp3', 'Asta: "I\'ll never give up!"'],
    ['/yunorepaidmydebtsound', '/yunorepaidmydebt', 'yunorepaidmydebtsound.mp3', 'Yuno: "I thought I\'d finally returned the favor"'],
    ['/lucklooksfunsound', '/lucklooksfun', 'lucklooksfunsound.mp3', 'Luck: "Don\'t finish yet, I\'m having fun!"'],
    ['/charmyimhungrysound', '/charmyimhungry', 'charmyimhungrysound.mp3', 'Charmy: "I... I\'m so hungry... Can\'t move..."'],
    ['/vanessaletsgodrinkingsound', '/vanessaletsgodrinking', 'vanessaletsgodrinkingsound.mp3', 'Vanessa: "Let\'s have a drink!"'],
    ['/mereoleonaleaveittomesound', '/mereoleonaleaveittome', 'mereoleonaleaveittomesound.mp3', 'Mereoleona: "Leave it to me, Wizard King!"'],
    ['/magnanotbadsound', '/magnanotbad', 'magnanotbadsound.mp3', 'Magna: "So cool!"'],
    ['/charlottebadumpheartbeatsound', '/charlottescreaming', 'charlottebadumpheartbeatsound.mp3', 'Charlotte: "*Ba-dump*" (heartbeat)'],
    ['/charlotteyyyamisound', '/charlotteyamiwallpin', 'charlotteyyyamisound.mp3', 'Charlotte: "Y-Y-Yami?!"'],
];
const list = SOUNDS.map(([n, l, f, what]) =>
    `        { name: '${n}', look: '${l}', url: '${BASE}sounds/${f}' }, // ${what}`).join('\n');
const listRe = /(    var SOUNDS = \[\n)[\s\S]*?(\n    \];)/;
if (!listRe.test(sound)) throw new Error('SOUNDS list not found');
sound = sound.replace(listRe, `$1${list}\n        // { emote: '/doroclap', url: 'https://files.catbox.moe/xxxxxx.mp3' },$2`);

// burakuro additions to the sound block: "🔊 Sounds" button label + a clickable list of every sound emote in the panel.
const patch = (from, to) => {
    if (!sound.includes(from)) throw new Error('patch target not found: ' + from.slice(0, 60));
    sound = sound.replace(from, to);
};
patch("button.textContent = settings.on ? ICON_ON : ICON_OFF;",
    "button.textContent = (settings.on ? ICON_ON : ICON_OFF) + ' Sounds';");
patch("'#burakuro-sound-panel{position:fixed;z-index:10000;width:200px;",
    "'#burakuro-sound-panel{position:fixed;z-index:10000;width:300px;");
patch("        '#burakuro-sound-panel .burakuro-sound-value{width:3em;text-align:right;}'",
    "        '#burakuro-sound-panel .burakuro-sound-value{width:3em;text-align:right;}',\n" +
    "        '#burakuro-sound-panel .burakuro-sound-list{margin-top:8px;border-top:1px solid #333;padding-top:6px;max-height:300px;overflow-y:auto;}',\n" +
    "        '#burakuro-sound-panel .burakuro-sound-list-title{font-size:12px;color:#aaa;margin-bottom:4px;}',\n" +
    "        '#burakuro-sound-panel .burakuro-sound-row{display:flex;align-items:center;gap:6px;padding:2px 0;}',\n" +
    "        '#burakuro-sound-panel .burakuro-sound-row img{width:32px;height:32px;object-fit:contain;flex:none;}',\n" +
    "        '#burakuro-sound-panel .burakuro-sound-name{flex:1;min-width:0;text-align:left;background:none;border:0;color:#e6b422;font-size:12px;word-break:break-all;cursor:pointer;padding:0;}',\n" +
    "        '#burakuro-sound-panel .burakuro-sound-name:hover{text-decoration:underline;}',\n" +
    "        '#burakuro-sound-panel .burakuro-sound-try{flex:none;background:none;border:1px solid #555;border-radius:3px;color:#eee;font-size:11px;padding:1px 6px;cursor:pointer;}'");
patch("panel.setAttribute('aria-label', 'Sound emote settings');", "panel.setAttribute('aria-label', 'Sound emotes');");
patch("    panel.appendChild(volumeRow);\n",
    "    panel.appendChild(volumeRow);\n\n" +
    "    // List of every sound emote: click the name = put it in the chat line; ▶ = hear it yourself only.\n" +
    "    var listBox = document.createElement('div');\n" +
    "    listBox.className = 'burakuro-sound-list';\n" +
    "    panel.appendChild(listBox);\n" +
    "    var previewAudio = null;\n" +
    "    function renderList() {\n" +
    "        listBox.textContent = '';\n" +
    "        var title = document.createElement('div');\n" +
    "        title.className = 'burakuro-sound-list-title';\n" +
    "        title.textContent = 'Click a name to put it in chat. \\u25B6 = hear it yourself.';\n" +
    "        listBox.appendChild(title);\n" +
    "        usableSounds.forEach(function (entry) {\n" +
    "            var name = entryKey(entry);\n" +
    "            var row = document.createElement('div');\n" +
    "            row.className = 'burakuro-sound-row';\n" +
    "            var img = document.createElement('img');\n" +
    "            var src = entry.name ? lookImage(entry.look) : lookImage(entry.emote);\n" +
    "            if (src) img.src = src;\n" +
    "            img.alt = '';\n" +
    "            var nameBtn = document.createElement('button');\n" +
    "            nameBtn.type = 'button';\n" +
    "            nameBtn.className = 'burakuro-sound-name';\n" +
    "            nameBtn.textContent = name;\n" +
    "            nameBtn.title = 'Put ' + name + ' in the chat line';\n" +
    "            nameBtn.addEventListener('click', function () {\n" +
    "                var line = document.getElementById('chatline');\n" +
    "                if (!line) return;\n" +
    "                var v = line.value;\n" +
    "                line.value = v + (v && !/\\s$/.test(v) ? ' ' : '') + name + ' ';\n" +
    "                closePanel();\n" +
    "                line.focus();\n" +
    "            });\n" +
    "            var tryBtn = document.createElement('button');\n" +
    "            tryBtn.type = 'button';\n" +
    "            tryBtn.className = 'burakuro-sound-try';\n" +
    "            tryBtn.textContent = '\\u25B6';\n" +
    "            tryBtn.title = 'Hear ' + name + ' (only you)';\n" +
    "            tryBtn.addEventListener('click', function () {\n" +
    "                if (previewAudio) previewAudio.pause();\n" +
    "                previewAudio = new Audio(entry.url);\n" +
    "                previewAudio.volume = Math.max(0.05, settings.volume / 100);\n" +
    "                var p = previewAudio.play();\n" +
    "                if (p && p.catch) p.catch(function () {});\n" +
    "            });\n" +
    "            row.appendChild(img);\n" +
    "            row.appendChild(nameBtn);\n" +
    "            row.appendChild(tryBtn);\n" +
    "            listBox.appendChild(row);\n" +
    "        });\n" +
    "    }\n");
patch("    function openPanel() {\n        panel.hidden = false;",
    "    function openPanel() {\n        renderList();\n        panel.hidden = false;");

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
