// Loads the WHOLE burakuro-extra.js in jsdom with a stubbed CyTube page and checks that every part starts.
// Run: node F:/Projects/cytube/burakuro-js/tests/load-smoke.test.mjs
import fs from 'node:fs';
import { createRequire } from 'node:module';
const { JSDOM } = createRequire(import.meta.url)('F:/Projects/4chanxt-you-scanner/wt-hasj/node_modules/jsdom');

const code = fs.readFileSync(new URL('../burakuro-extra.js', import.meta.url), 'utf8');
let pass = 0, fail = 0;
const check = (name, ok, detail) => { ok ? pass++ : fail++; console.log((ok ? 'PASS ' : 'FAIL ') + name + (ok ? '' : ' :: ' + JSON.stringify(detail))); };

const dom = new JSDOM(`<!DOCTYPE html><html><head></head><body>
  <div id="chatheader"><span id="usercount">3 connected users</span></div>
  <div id="leftcontrols"><button id="emotelistbtn" class="btn btn-sm btn-default">Emote List</button></div>
  <div id="messagebuffer"></div><input id="chatline"><ul id="queue"></ul>
  </body></html>`, { runScripts: 'outside-only', url: 'https://cytu.be/r/burakuro', pretendToBeVisual: true });
const w = dom.window;
const errors = [];
w.addEventListener('error', e => errors.push(String(e.message)));
w.Audio = class { constructor(s) { this.src = s; } play() { return Promise.resolve(); } pause() {} addEventListener() {} cloneNode() { return new w.Audio(this.src); } };
const handlers = {};
w.socket = { on(ev, f) { (handlers[ev] = handlers[ev] || []).push(f); }, off() {}, emit() {} };
// jQuery: only what the channel JS calls ($(window).bind, $.get).
w.eval(`var $ = function (x) { return { bind: function (ev, f) { (x.addEventListener ? x : window).addEventListener(ev, f); return this; }, on: function () { return this; } }; };
  $.get = function () {};`);
const emotes = ['/doroclap', '/laugh', '/yamitakeabreak', '/yamimad', '/noellepout'].map(n => ({ name: n, image: 'https://example.invalid' + n + '.png', source: '(^|\\s)' + n + '(?!\\S)' }));
w.CHANNEL = { name: 'burakuro', emotes, emoteMap: Object.fromEntries(emotes.map(e => [e.name, e])), badEmotes: [] };
w.USEROPTS = { no_emotes: false }; w.IGNORED = []; w.CLIENT = { name: 'tester', rank: 1 };
w.Callbacks = { newPoll() {}, updatePoll() {}, chatMsg() {} };
w.eval('function execEmotes(m){return m} var playlist = document.getElementById("queue");');
try { w.eval(code); } catch (err) { errors.push(String(err && err.stack || err)); }

check('whole script runs without errors', errors.length === 0, errors);
check('clock above chat', !!w.document.getElementById('chatClock'));
check('favicon set', !!w.document.getElementById('favicon'));
check('sound button added', !!w.document.getElementById('burakuro-sound-btn'));
const api = w.__burakuroSound;
check('sound api exposed', !!api && typeof api.soundOnlyEmotes === 'function');
const names = api ? api.soundOnlyEmotes().map(e => e.name) : [];
check('14 sound-only names listed', names.length === 14, names);
check('/yamitakeabreaksound borrows /yamitakeabreak', names.includes('/yamitakeabreaksound'));
const live = code.slice(code.indexOf('var SOUNDS'), code.indexOf('];', code.indexOf('var SOUNDS'))).split('\n').filter(l => /^\s*\{/.test(l));
check('14 live SOUNDS lines, all on GitHub Pages', live.length === 14 && live.every(l => l.includes("url: 'https://nostramadeus.github.io/burakuro-js/sounds/")), live);
check('chat listener registered', (handlers.chatMsg || []).length >= 1);
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
