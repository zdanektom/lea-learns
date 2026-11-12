/* Lea Learns 1.0.1 — generated from src/ by build.mjs. Made for Lea by Tomasz Zdankowski. */
(() => {
'use strict';
const APP_VERSION = '1.0.1';

/* ===== src/00-store.js ===== */
/* Lea Learns — progress and settings, kept only in this device's localStorage. */
const Store = (() => {
  const KEY = 'lea-learns:v1';
  const fresh = () => ({ apples: 0, stars: 0, rounds: 0, seenWords: {}, seenLetters: {}, played: {}, settings: { player: null, sound: true, voice: true, lang: 'pl', range: 20 } });
  let d;
  try { d = Object.assign(fresh(), JSON.parse(localStorage.getItem(KEY) || '{}')); d.settings = Object.assign(fresh().settings, d.settings || {}); } catch (e) { d = fresh(); }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {} };
  return {
    get data() { return d; },
    get settings() { return d.settings; },
    set(k, v) { d.settings[k] = v; save(); },
    addApple(n = 1) { d.apples += n; save(); },
    addStars(n) { d.stars += n; d.rounds += 1; save(); },
    seeWord(k) { d.seenWords[k] = 1; save(); },
    seeLetter(l) { d.seenLetters[l] = 1; save(); },
    played(id) { d.played[id] = (d.played[id] || 0) + 1; save(); },
    reset() { const s = d.settings; d = fresh(); d.settings = s; save(); },
  };
})();


/* ===== src/10-data.js ===== */
/* Lea Learns: learning content. */
const APP_NAME = 'Lea Learns';
/* Playable characters (illustrated only). `say` is how the device voice should pronounce the name. */
const CHARACTERS = { lea: {}, ines: {} };
const CATEGORIES = [
  { id: 'food', icon: 'apple', colour: '#e53935', items: ['apple', 'banana', 'orange', 'strawberry', 'grapes', 'carrot', 'egg', 'cake', 'watermelon', 'icecream'] },
  { id: 'animals', icon: 'cat', colour: '#f59e0b', items: ['cat', 'dog', 'duck', 'fish', 'cow', 'pig', 'frog', 'lion', 'zebra'] },
  { id: 'colours', icon: 'rainbow', colour: '#8e5bd6', items: ['colour:red', 'colour:blue', 'colour:yellow', 'colour:green', 'colour:orange', 'colour:purple', 'colour:pink', 'colour:brown'] },
  { id: 'home', icon: 'house', colour: '#ef6c57', items: ['house', 'bed', 'chair', 'cup', 'book', 'ball', 'key', 'umbrella'] },
  { id: 'nature', icon: 'sun', colour: '#43a047', items: ['sun', 'moon', 'star', 'tree', 'flower', 'cloud', 'rainbow', 'leaf'] },
  { id: 'body', icon: 'hand', colour: '#ec6aa0', items: ['head', 'eye', 'ear', 'nose', 'mouth', 'hand', 'foot', 'tooth'] },
];
/* Display word and (optionally) a different spoken form. */
const WORDS = {
  apple: 'apple', banana: 'banana', orange: 'orange', strawberry: 'strawberry', grapes: 'grapes', carrot: 'carrot', egg: 'egg', cake: 'cake', watermelon: 'watermelon', icecream: 'ice cream', juice: 'juice',
  cat: 'cat', dog: 'dog', duck: 'duck', fish: 'fish', cow: 'cow', pig: 'pig', frog: 'frog', lion: 'lion', zebra: 'zebra',
  'colour:red': 'red', 'colour:blue': 'blue', 'colour:yellow': 'yellow', 'colour:green': 'green', 'colour:orange': 'orange', 'colour:purple': 'purple', 'colour:pink': 'pink', 'colour:brown': 'brown',
  house: 'house', bed: 'bed', chair: 'chair', cup: 'cup', book: 'book', ball: 'ball', key: 'key', umbrella: 'umbrella',
  sun: 'sun', moon: 'moon', star: 'star', tree: 'tree', flower: 'flower', cloud: 'cloud', rainbow: 'rainbow', leaf: 'leaf',
  head: 'head', eye: 'eye', ear: 'ear', nose: 'nose', mouth: 'mouth', hand: 'hand', foot: 'foot', tooth: 'tooth',
  van: 'van', xylophone: 'xylophone', yoyo: 'yo-yo', queen: 'queen', igloo: 'igloo',
  ant: 'ant', gift: 'gift', jam: 'jam', kite: 'kite', nest: 'nest', octopus: 'octopus', pear: 'pear', vase: 'vase', whale: 'whale', zero: 'zero', insect: 'insect',
};
const SPOKEN = { yoyo: 'yo yo', 'colour:red': 'red', icecream: 'ice cream' };
const word = (k) => WORDS[k] || k;
const spoken = (k) => SPOKEN[k] || word(k);
const article = (k) => (k.startsWith('colour:') ? '' : /^[aeiou]/.test(word(k)) ? 'an ' : 'a ');

/* A–Z: letter, spoken letter name (en-GB), a simple phonic sound the device voice can say, and a picture word. */
/* Several picture words per letter (all start with the letter's usual sound). */
const LETTER_WORDS = {
  A: ['apple', 'ant'], B: ['ball', 'banana', 'bed', 'book'], C: ['cat', 'cake', 'cow', 'cup'], D: ['dog', 'duck'], E: ['egg', 'ear'],
  F: ['fish', 'frog', 'flower', 'foot'], G: ['grapes', 'gift'], H: ['house', 'hand', 'head'], I: ['igloo', 'insect'], J: ['juice', 'jam'],
  K: ['key', 'kite'], L: ['lion', 'leaf'], M: ['moon', 'mouth'], N: ['nose', 'nest'], O: ['orange', 'octopus'], P: ['pig', 'pear'],
  Q: ['queen'], R: ['rainbow'], S: ['sun', 'star', 'strawberry'], T: ['tree', 'tooth'], U: ['umbrella'], V: ['van', 'vase'],
  W: ['watermelon', 'whale'], X: ['xylophone'], Y: ['yoyo', 'colour:yellow'], Z: ['zebra', 'zero'],
};
const ALPHABET = [
  ['A', 'ay', 'a', 'apple'], ['B', 'bee', 'buh', 'ball'], ['C', 'see', 'kuh', 'cat'], ['D', 'dee', 'duh', 'dog'],
  ['E', 'ee', 'eh', 'egg'], ['F', 'eff', 'fuh', 'fish'], ['G', 'jee', 'guh', 'grapes'], ['H', 'aitch', 'huh', 'house'],
  ['I', 'eye', 'ih', 'igloo'], ['J', 'jay', 'juh', 'juice'], ['K', 'kay', 'kuh', 'key'], ['L', 'el', 'luh', 'lion'],
  ['M', 'em', 'muh', 'moon'], ['N', 'en', 'nuh', 'nose'], ['O', 'oh', 'o', 'orange'], ['P', 'pee', 'puh', 'pig'],
  ['Q', 'queue', 'kwuh', 'queen'], ['R', 'ar', 'ruh', 'rainbow'], ['S', 'ess', 'suh', 'sun'], ['T', 'tee', 'tuh', 'tree'],
  ['U', 'you', 'uh', 'umbrella'], ['V', 'vee', 'vuh', 'van'], ['W', 'double you', 'wuh', 'watermelon'], ['X', 'ex', 'ks', 'xylophone'],
  ['Y', 'why', 'yuh', 'yoyo'], ['Z', 'zed', 'zuh', 'zebra'],
].map(([l, name, sound, pic]) => ({ l, name, sound, pic }));
/* Device voices cannot say a bare short vowel (or "ks") reliably, so for those the picture word carries the sound. */
const SOUND_VIA_WORD = new Set(['a', 'e', 'i', 'o', 'u', 'ks']);
const LETTER_COLOURS = ['#e53935', '#fb8c00', '#f4b400', '#43a047', '#1e88e5', '#8e44ad', '#ec407a'];

const NUMBER_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];
for (let n = 21; n <= 30; n++) NUMBER_WORDS[n] = n === 30 ? 'thirty' : 'twenty ' + NUMBER_WORDS[n - 20];
const COUNT_THINGS = [
  { k: 'apple', one: 'apple', many: 'apples' }, { k: 'strawberry', one: 'strawberry', many: 'strawberries' },
  { k: 'duck', one: 'duck', many: 'ducks' }, { k: 'star', one: 'star', many: 'stars' }, { k: 'ball', one: 'ball', many: 'balls' },
  { k: 'flower', one: 'flower', many: 'flowers' }, { k: 'fish', one: 'fish', many: 'fish' }, { k: 'orange', one: 'orange', many: 'oranges' },
];


/* ===== src/15-i18n.js ===== */
/* Lea Learns — interface and guide language (pl / en / ru). The English words being taught are never translated. */
const LANGS = { pl: { label: 'Polski', voice: 'pl' }, en: { label: 'English', voice: 'en' }, ru: { label: 'Русский', voice: 'ru' } };
const STR = {
  en: {
    words: 'Words', abc: 'ABC', numbers: 'Numbers', whosPlaying: 'Who’s playing?',
    food: 'Food', animals: 'Animals', colours: 'Colours', home: 'Home', nature: 'Nature', body: 'Body',
    look: 'Look', find: 'Find', sayIt: 'Say', trace: 'Trace', count: 'Count', howMany: 'How many?', sums: '+  −',
    thisIs: 'This is', showMe: 'Show me', whatIs: 'What is this?', thatIs: 'That is', theLetter: 'the letter', thisLetter: 'This is the letter',
    sayThenTap: 'Say it, then tap to hear!', tapPicture: 'Tap a picture!', pickOne: 'Pick one!', tapLetter: 'Tap a letter!',
    traceHint: 'Trace the letter with your finger!', keepGoing: 'Keep going!', letsCount: 'Let’s count!', tapCount: 'Tap each one to count!',
    altogether: 'How many altogether?', left: 'How many are left?', lookListen: 'Look and listen!',
    praise: ['Yes!', 'Well done!', 'Brilliant!', 'Super!', 'Hooray!', 'Great job!', 'You did it!'],
    encourage: ['Try again!', 'Nearly! Try again.', 'Have another go!'],
    wellDone: (n) => `Well done, ${n}!`, stars5: 'You got five stars!', hi: (n) => `Hi! I’m ${n}!`, whatPlay: 'What shall we play?',
    loveApples: 'I love apples!', hello: 'Hello!', letsPlay: 'Let’s play!', woof: 'Woof woof!', achoo: 'A-choo!', countTogether: 'Let’s count together!', hereDog: 'Here’s Bacon!',
  },
  pl: {
    words: 'Słowa', abc: 'ABC', numbers: 'Liczby', whosPlaying: 'Kto gra?',
    food: 'Jedzenie', animals: 'Zwierzęta', colours: 'Kolory', home: 'Dom', nature: 'Przyroda', body: 'Ciało',
    look: 'Patrz', find: 'Pokaż', sayIt: 'Powiedz', trace: 'Rysuj', count: 'Liczenie', howMany: 'Ile?', sums: '+  −',
    thisIs: 'To jest', showMe: 'Pokaż', whatIs: 'Co to jest?', thatIs: 'To jest', theLetter: 'literę', thisLetter: 'To jest litera',
    sayThenTap: 'Powiedz, a potem dotknij i posłuchaj!', tapPicture: 'Dotknij obrazka!', pickOne: 'Wybierz!', tapLetter: 'Dotknij litery!',
    traceHint: 'Narysuj literę palcem!', keepGoing: 'Jeszcze trochę!', letsCount: 'Policzmy!', tapCount: 'Dotknij każdego i policz!',
    altogether: 'Ile razem?', left: 'Ile zostało?', lookListen: 'Patrz i słuchaj!',
    praise: ['Tak!', 'Brawo!', 'Super!', 'Świetnie!', 'Hurra!', 'Udało się!', 'Wspaniale!'],
    encourage: ['Spróbuj jeszcze raz!', 'Prawie! Spróbuj jeszcze.', 'Jeszcze raz!'],
    wellDone: (n) => `Brawo, ${n}!`, stars5: 'Masz pięć gwiazdek!', hi: (n) => `Cześć! Jestem ${n}!`, whatPlay: 'W co się pobawimy?',
    loveApples: 'Kocham jabłka!', hello: 'Cześć!', letsPlay: 'Bawimy się!', woof: 'Hau hau!', achoo: 'A-psik!', countTogether: 'Policzmy razem!', hereDog: 'To Bacon!',
  },
  ru: {
    words: 'Слова', abc: 'ABC', numbers: 'Числа', whosPlaying: 'Кто играет?',
    food: 'Еда', animals: 'Животные', colours: 'Цвета', home: 'Дом', nature: 'Природа', body: 'Тело',
    look: 'Смотри', find: 'Покажи', sayIt: 'Скажи', trace: 'Обведи', count: 'Счёт', howMany: 'Сколько?', sums: '+  −',
    thisIs: 'Это', showMe: 'Покажи', whatIs: 'Что это?', thatIs: 'Это', theLetter: 'букву', thisLetter: 'Это буква',
    sayThenTap: 'Скажи, а потом нажми и послушай!', tapPicture: 'Нажми на картинку!', pickOne: 'Выбери!', tapLetter: 'Нажми на букву!',
    traceHint: 'Обведи букву пальчиком!', keepGoing: 'Ещё чуть-чуть!', letsCount: 'Давай считать!', tapCount: 'Нажимай и считай!',
    altogether: 'Сколько всего?', left: 'Сколько осталось?', lookListen: 'Смотри и слушай!',
    praise: ['Да!', 'Молодец!', 'Супер!', 'Отлично!', 'Ура!', 'Получилось!', 'Здорово!'],
    encourage: ['Попробуй ещё раз!', 'Почти! Попробуй ещё.', 'Ещё разок!'],
    wellDone: (n) => `Молодец, ${n}!`, stars5: 'У тебя пять звёздочек!', hi: (n) => `Привет! Я ${n}!`, whatPlay: 'Во что поиграем?',
    loveApples: 'Я люблю яблоки!', hello: 'Привет!', letsPlay: 'Давай играть!', woof: 'Гав-гав!', achoo: 'Апчхи!', countTogether: 'Посчитаем вместе!', hereDog: 'Это Bacon!',
  },
};
const DOG_NAME = 'Bacon';
/* Character names as shown/spoken per interface language. */
const NAMES = { lea: { en: 'Lea', pl: 'Lea', ru: 'Лея', sayEn: 'Lea' }, ines: { en: 'Ines', pl: 'Ines', ru: 'Инес', sayEn: 'Eeness' } };
const lang = () => (STR[Store.settings.lang] ? Store.settings.lang : 'pl');
const T = (k, ...a) => { const v = STR[lang()][k] ?? STR.en[k]; return typeof v === 'function' ? v(...a) : v; };
const tPick = (k) => pick(T(k));
/* Mark a piece of speech as English target vocabulary (always spoken with an English voice). */
const EN = (t) => ({ en: t });


/* ===== src/20-art.js ===== */
/* Original SVG illustrations for Lea Learns. Every picture is drawn here in code (viewBox 0 0 100 100). */
const INK = '#4a2f27';
let _uid = 0;
const ln = `stroke="${INK}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"`;
const thin = `stroke="${INK}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"`;
const shine = (x, y, rx, ry, rot = -25) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#fff" opacity=".55" transform="rotate(${rot} ${x} ${y})"/>`;
const eyes = (x1, x2, y, r = 4) => `<circle cx="${x1}" cy="${y}" r="${r}" fill="${INK}"/><circle cx="${x2}" cy="${y}" r="${r}" fill="${INK}"/><circle cx="${x1 + r * .35}" cy="${y - r * .4}" r="${r * .38}" fill="#fff"/><circle cx="${x2 + r * .35}" cy="${y - r * .4}" r="${r * .38}" fill="#fff"/>`;
const cheeks = (x1, x2, y, r = 4.5) => `<ellipse cx="${x1}" cy="${y}" rx="${r}" ry="${r * .7}" fill="#ff8a80" opacity=".7"/><ellipse cx="${x2}" cy="${y}" rx="${r}" ry="${r * .7}" fill="#ff8a80" opacity=".7"/>`;
const smile = (x, y, w = 8) => `<path d="M${x - w} ${y} Q${x} ${y + w * .9} ${x + w} ${y}" fill="none" ${ln}/>`;

const ART = {
  apple: () => `
    <path d="M50 31 C40 22 15 23 15 50 C15 74 31 92 43 91 C47 90.5 53 90.5 57 91 C69 92 85 74 85 50 C85 23 60 22 50 31 Z" fill="#e53935" ${ln}/>
    <path d="M50 31 C49 23 51 16 56 10" fill="none" stroke="#7a4a2a" stroke-width="4.5" stroke-linecap="round"/>
    <path d="M53 21 C58 11 72 9 79 13 C74 22 62 26 53 21 Z" fill="#7cc35a" ${ln}/>
    <path d="M57 19 C64 16 70 14 75 14" fill="none" stroke="#4e9a3a" stroke-width="2" stroke-linecap="round"/>
    ${shine(31, 47, 6, 11)}`,
  banana: () => `
    <path d="M22 26 C18 56 40 86 82 74 C87 72 88 67 84 66 C56 70 34 54 31 26 Z" fill="#ffd54f" ${ln}/>
    <path d="M31 30 C34 54 52 66 78 68" fill="none" stroke="#e0a800" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M21 27 L19 18 L29 17 L31 26 Z" fill="#8d6e3f" ${ln}/>
    <path d="M84 66 L90 68 L86 73 Z" fill="#6d4c2f" ${thin}/>
    ${shine(27, 50, 3, 10, -15)}`,
  orange: () => `
    <circle cx="50" cy="56" r="34" fill="#ff9800" ${ln}/>
    <g fill="#e67e00"><circle cx="38" cy="64" r="1.6"/><circle cx="60" cy="70" r="1.6"/><circle cx="66" cy="52" r="1.6"/><circle cx="48" cy="78" r="1.6"/><circle cx="72" cy="66" r="1.4"/><circle cx="30" cy="54" r="1.4"/></g>
    <path d="M50 23 C52 16 60 11 70 12 C67 20 59 24 50 23 Z" fill="#7cc35a" ${ln}/>
    <circle cx="49" cy="24" r="3" fill="#6d4c2f"/>
    ${shine(35, 43, 6, 10)}`,
  strawberry: () => `
    <path d="M50 90 C30 80 15 58 19 42 C22 30 38 29 50 33 C62 29 78 30 81 42 C85 58 70 80 50 90 Z" fill="#ef3b4a" ${ln}/>
    <g fill="#ffe082">${[[35, 48], [50, 46], [65, 48], [42, 60], [58, 60], [50, 73], [32, 62], [68, 62], [44, 80 - 6], [56, 74]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="1.6" ry="2.4"/>`).join('')}</g>
    <path d="M28 35 L38 27 L44 33 L50 20 L56 33 L62 27 L72 35 C62 40 38 40 28 35 Z" fill="#5cb85c" ${ln}/>
    ${shine(32, 50, 4, 8)}`,
  grapes: () => `
    <path d="M50 22 C50 16 53 11 58 8" fill="none" stroke="#7a4a2a" stroke-width="4" stroke-linecap="round"/>
    <path d="M52 18 C58 10 70 10 76 14 C70 22 60 23 52 18 Z" fill="#7cc35a" ${ln}/>
    ${[[34, 32], [50, 30], [66, 32], [42, 47], [58, 47], [28, 46], [72, 46], [35, 62], [50, 62], [65, 62], [42, 76], [58, 76], [50, 89]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9.5" fill="#9b59b6" ${ln}/><circle cx="${x - 3}" cy="${y - 3}" r="2.5" fill="#fff" opacity=".5"/>`).join('')}`,
  carrot: () => `
    <path d="M44 30 C36 22 34 12 38 6 C44 12 48 20 48 28 Z" fill="#66bb6a" ${ln}/>
    <path d="M56 30 C64 22 68 13 64 7 C58 13 53 21 52 28 Z" fill="#66bb6a" ${ln}/>
    <path d="M50 30 C47 20 48 10 51 4 C55 10 55 20 52 30 Z" fill="#81c784" ${ln}/>
    <path d="M33 34 C33 28 67 28 67 34 C67 50 56 80 50 94 C44 80 33 50 33 34 Z" fill="#ff8f1f" ${ln}/>
    <path d="M38 46 L46 47 M54 58 L62 57 M42 68 L49 69" fill="none" stroke="#d96a00" stroke-width="2.5" stroke-linecap="round"/>
    ${shine(41, 40, 3, 7, -10)}`,
  egg: () => `
    <path d="M50 10 C70 10 82 44 81 62 C80 80 66 91 50 91 C34 91 20 80 19 62 C18 44 30 10 50 10 Z" fill="#fff4e0" ${ln}/>
    <path d="M70 46 C74 56 74 70 66 80" fill="none" stroke="#f0d9b5" stroke-width="5" stroke-linecap="round"/>
    ${shine(36, 36, 5, 10, -20)}`,
  cake: () => `
    <ellipse cx="50" cy="86" rx="40" ry="7" fill="#e3f2fd" ${ln}/>
    <rect x="18" y="48" width="64" height="36" rx="7" fill="#f48fb1" ${ln}/>
    <path d="M18 62 L82 62" stroke="#fff" stroke-width="4"/>
    <path d="M18 56 C18 46 82 46 82 56 L82 58 C78 64 74 58 70 62 C66 66 62 58 58 62 C54 66 48 58 44 63 C40 67 36 58 32 62 C28 66 22 60 18 60 Z" fill="#fffaf2" ${ln}/>
    <rect x="45" y="28" width="10" height="20" rx="3" fill="#64b5f6" ${ln}/>
    <path d="M50 10 C56 18 56 24 50 26 C44 24 44 18 50 10 Z" fill="#ffca28" ${ln}/>
    <g fill="#ef5350"><circle cx="30" cy="72" r="3"/><circle cx="50" cy="74" r="3"/><circle cx="70" cy="72" r="3"/></g>`,
  watermelon: () => `
    <path d="M10 38 A40 40 0 0 0 90 38 Z" fill="#43a047" ${ln}/>
    <path d="M17 38 A33 33 0 0 0 83 38 Z" fill="#e8f5c8"/>
    <path d="M21 38 A29 29 0 0 0 79 38 Z" fill="#ff5a6e"/>
    <path d="M10 38 L90 38" ${ln}/>
    <g fill="${INK}">${[[36, 48], [50, 52], [64, 48], [43, 60], [57, 60]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="2" ry="3.2"/>`).join('')}</g>`,
  icecream: () => `
    <path d="M30 50 L50 94 L70 50 Z" fill="#f2b56b" ${ln}/>
    <path d="M36 56 L60 80 M44 52 L66 68 M64 56 L44 80 M56 52 L36 68" stroke="#c98a3e" stroke-width="2.2" stroke-linecap="round"/>
    <circle cx="50" cy="38" r="20" fill="#f8a5c2" ${ln}/>
    <path d="M28 46 C34 54 40 48 44 54 C48 58 54 50 58 54 C62 58 68 50 72 46" fill="#f8a5c2" ${ln}/>
    <circle cx="52" cy="15" r="6" fill="#e53935" ${ln}/>
    <path d="M53 9 C55 4 58 3 61 3" fill="none" ${thin}/>
    ${shine(42, 30, 4, 7)}`,
  juice: () => `
    <path d="M62 8 L52 34" stroke="#ef5350" stroke-width="5" stroke-linecap="round"/>
    <path d="M26 28 L74 28 L68 90 L32 90 Z" fill="#e3f2fd" ${ln}/>
    <path d="M28.5 44 L71.5 44 L68 90 L32 90 Z" fill="#ffa726"/>
    <path d="M26 28 L74 28 L68 90 L32 90 Z" fill="none" ${ln}/>
    <circle cx="70" cy="30" r="10" fill="#ffb74d" ${ln}/><circle cx="70" cy="30" r="5" fill="#ffe0b2"/>
    ${shine(36, 58, 3, 12, 0)}`,

  cat: () => `
    <path d="M20 44 L22 14 L42 30 Z" fill="#ffb74d" ${ln}/><path d="M80 44 L78 14 L58 30 Z" fill="#ffb74d" ${ln}/>
    <path d="M25 34 L26 22 L35 30 Z M75 34 L74 22 L65 30 Z" fill="#ffccbc"/>
    <ellipse cx="50" cy="56" rx="34" ry="30" fill="#ffb74d" ${ln}/>
    <path d="M44 28 L46 38 M50 27 L50 37 M56 28 L54 38" stroke="#e08a2a" stroke-width="3" stroke-linecap="round"/>
    ${eyes(38, 62, 52, 5)}
    <path d="M46 62 L54 62 L50 67 Z" fill="#f48fb1" ${thin}/>
    <path d="M50 67 Q46 73 41 70 M50 67 Q54 73 59 70" fill="none" ${thin}/>
    <path d="M12 58 L32 62 M12 68 L32 66 M88 58 L68 62 M88 68 L68 66" stroke="${INK}" stroke-width="1.8" stroke-linecap="round"/>
    ${cheeks(30, 70, 64)}`,
  dog: () => `
    <ellipse cx="50" cy="54" rx="30" ry="30" fill="#d9a066" ${ln}/>
    <path d="M24 34 C12 34 8 58 14 68 C20 74 28 66 28 54 Z" fill="#8d5a34" ${ln}/>
    <path d="M76 34 C88 34 92 58 86 68 C80 74 72 66 72 54 Z" fill="#8d5a34" ${ln}/>
    <ellipse cx="50" cy="68" rx="17" ry="13" fill="#fff3e0" ${ln}/>
    ${eyes(39, 61, 50, 4.5)}
    <ellipse cx="50" cy="61" rx="6" ry="4.5" fill="${INK}"/>
    <path d="M50 65 L50 70 M44 71 Q50 75 56 71" fill="none" ${thin}/>
    <path d="M47 73 C47 80 53 80 53 73 Z" fill="#ff8a80" ${thin}/>
    <ellipse cx="62" cy="40" rx="7" ry="5" fill="#b07a4a" opacity=".6"/>`,
  duck: () => `
    <ellipse cx="54" cy="66" rx="32" ry="20" fill="#ffd54f" ${ln}/>
    <path d="M84 60 L94 52 L88 68 Z" fill="#ffd54f" ${ln}/>
    <circle cx="36" cy="38" r="17" fill="#ffd54f" ${ln}/>
    <path d="M20 40 C12 38 8 42 10 46 C14 48 20 46 22 45 Z" fill="#ff9800" ${ln}/>
    <circle cx="32" cy="34" r="3.8" fill="${INK}"/><circle cx="33.3" cy="32.6" r="1.4" fill="#fff"/>
    <path d="M48 64 C56 56 70 58 74 66 C66 74 54 72 48 64 Z" fill="#ffca28" ${ln}/>
    ${cheeks(42, 42, 44, 3)}
    <path d="M14 88 C30 84 70 84 90 88" fill="none" stroke="#64b5f6" stroke-width="4" stroke-linecap="round"/>`,
  fish: () => `
    <path d="M70 50 L92 32 L90 68 Z" fill="#4fc3f7" ${ln}/>
    <path d="M10 50 C22 26 52 20 72 50 C52 80 22 74 10 50 Z" fill="#29b6f6" ${ln}/>
    <path d="M38 30 C44 22 54 24 58 32" fill="#81d4fa" ${ln}/>
    <path d="M44 42 C48 46 48 54 44 58 M52 42 C56 46 56 54 52 58" fill="none" stroke="#0288d1" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="26" cy="46" r="4.5" fill="${INK}"/><circle cx="27.5" cy="44.5" r="1.6" fill="#fff"/>
    <path d="M16 56 Q19 58 22 56" fill="none" ${thin}/>
    <circle cx="20" cy="22" r="4" fill="#e1f5fe" ${thin}/><circle cx="12" cy="12" r="2.5" fill="#e1f5fe" ${thin}/>`,
  cow: () => `
    <path d="M28 30 C20 20 18 14 22 12 C28 14 32 22 34 28 Z M72 30 C80 20 82 14 78 12 C72 14 68 22 66 28 Z" fill="#f5e6c8" ${ln}/>
    <path d="M24 38 C12 34 8 42 12 46 C16 50 24 46 28 44 Z M76 38 C88 34 92 42 88 46 C84 50 76 46 72 44 Z" fill="#fff" ${ln}/>
    <path d="M26 40 C26 24 74 24 74 40 L72 64 L28 64 Z" fill="#fff" ${ln}/>
    <path d="M30 32 C38 30 44 36 40 44 C34 48 28 44 30 32 Z M62 30 C70 30 72 38 68 42 C62 42 58 36 62 30 Z" fill="${INK}"/>
    ${eyes(40, 60, 46, 4)}
    <ellipse cx="50" cy="70" rx="24" ry="16" fill="#f8bbd0" ${ln}/>
    <ellipse cx="41" cy="70" rx="3.5" ry="4.5" fill="#c2185b" opacity=".7"/><ellipse cx="59" cy="70" rx="3.5" ry="4.5" fill="#c2185b" opacity=".7"/>
    <path d="M42 79 Q50 84 58 79" fill="none" ${thin}/>`,
  pig: () => `
    <path d="M22 36 L20 14 L40 26 Z M78 36 L80 14 L60 26 Z" fill="#f8a5c2" ${ln}/>
    <circle cx="50" cy="54" r="34" fill="#f8bbd0" ${ln}/>
    ${eyes(37, 63, 46, 4.5)}
    <ellipse cx="50" cy="64" rx="15" ry="11" fill="#f48fb1" ${ln}/>
    <ellipse cx="45" cy="64" rx="2.8" ry="4" fill="#ad1457"/><ellipse cx="55" cy="64" rx="2.8" ry="4" fill="#ad1457"/>
    <path d="M42 79 Q50 84 58 79" fill="none" ${thin}/>
    ${cheeks(27, 73, 62, 5)}`,
  frog: () => `
    <circle cx="32" cy="30" r="14" fill="#66bb6a" ${ln}/><circle cx="68" cy="30" r="14" fill="#66bb6a" ${ln}/>
    <path d="M14 58 C14 34 86 34 86 58 C86 78 70 88 50 88 C30 88 14 78 14 58 Z" fill="#66bb6a" ${ln}/>
    <circle cx="32" cy="30" r="8" fill="#fff" ${thin}/><circle cx="68" cy="30" r="8" fill="#fff" ${thin}/>
    <circle cx="34" cy="31" r="4.5" fill="${INK}"/><circle cx="66" cy="31" r="4.5" fill="${INK}"/>
    <circle cx="35.5" cy="29.5" r="1.6" fill="#fff"/><circle cx="67.5" cy="29.5" r="1.6" fill="#fff"/>
    <path d="M28 62 Q50 82 72 62" fill="#e57373" ${ln}/>
    ${cheeks(24, 76, 58, 5)}
    <circle cx="45" cy="50" r="1.5" fill="${INK}"/><circle cx="55" cy="50" r="1.5" fill="${INK}"/>`,
  lion: () => `
    ${Array.from({ length: 14 }, (_, i) => { const a = i / 14 * Math.PI * 2; return `<circle cx="${(50 + Math.cos(a) * 31).toFixed(1)}" cy="${(52 + Math.sin(a) * 31).toFixed(1)}" r="12" fill="#c76b1f" ${ln}/>`; }).join('')}
    <circle cx="50" cy="52" r="31" fill="#c76b1f"/>
    <circle cx="30" cy="32" r="7" fill="#ffca6e" ${ln}/><circle cx="70" cy="32" r="7" fill="#ffca6e" ${ln}/>
    <circle cx="50" cy="54" r="25" fill="#ffca6e" ${ln}/>
    ${eyes(41, 59, 48, 4)}
    <ellipse cx="50" cy="64" rx="12" ry="9" fill="#fff3d6"/>
    <path d="M45 58 L55 58 L50 63 Z" fill="#8d4a2a" ${thin}/>
    <path d="M50 63 Q46 69 42 67 M50 63 Q54 69 58 67" fill="none" ${thin}/>
    ${cheeks(34, 66, 60, 3.5)}`,
  zebra: (u) => `
    <path d="M30 26 L26 8 L40 18 Z M70 26 L74 8 L60 18 Z" fill="#fff" ${ln}/>
    <path d="M38 14 C42 4 58 4 62 14 L58 26 L42 26 Z" fill="${INK}"/>
    <defs><clipPath id="zh${u}"><path d="M28 30 C28 14 72 14 72 30 L68 70 C66 90 34 90 32 70 Z"/></clipPath></defs>
    <path d="M28 30 C28 14 72 14 72 30 L68 70 C66 90 34 90 32 70 Z" fill="#fff"/>
    <g clip-path="url(#zh${u})" fill="${INK}">
      <path d="M20 30 L44 34 L20 40 Z M80 30 L56 34 L80 40 Z M20 48 L42 50 L20 56 Z M80 48 L58 50 L80 56 Z M46 18 L50 30 L54 18 Z"/>
    </g>
    <path d="M28 30 C28 14 72 14 72 30 L68 70 C66 90 34 90 32 70 Z" fill="none" ${ln}/>
    <ellipse cx="50" cy="76" rx="17" ry="12" fill="#b0a7a3" ${ln}/>
    <ellipse cx="44" cy="76" rx="2.5" ry="3.5" fill="${INK}"/><ellipse cx="56" cy="76" rx="2.5" ry="3.5" fill="${INK}"/>
    ${eyes(40, 60, 44, 4)}`,

  house: () => `
    <rect x="66" y="16" width="10" height="20" fill="#a1887f" ${ln}/>
    <rect x="20" y="44" width="60" height="44" fill="#ffe0b2" ${ln}/>
    <path d="M10 48 L50 14 L90 48 Z" fill="#e53935" ${ln}/>
    <rect x="42" y="62" width="16" height="26" rx="7" fill="#8d5a34" ${ln}/>
    <circle cx="54" cy="76" r="1.8" fill="#ffd54f"/>
    <rect x="26" y="54" width="12" height="12" rx="2" fill="#81d4fa" ${thin}/><rect x="62" y="54" width="12" height="12" rx="2" fill="#81d4fa" ${thin}/>
    <path d="M32 54 L32 66 M26 60 L38 60 M68 54 L68 66 M62 60 L74 60" stroke="${INK}" stroke-width="1.6"/>
    <path d="M8 90 L92 90" stroke="#66bb6a" stroke-width="5" stroke-linecap="round"/>`,
  bed: () => `
    <rect x="10" y="28" width="12" height="60" rx="4" fill="#a0673a" ${ln}/>
    <rect x="78" y="48" width="12" height="40" rx="4" fill="#a0673a" ${ln}/>
    <rect x="16" y="56" width="70" height="18" rx="4" fill="#fff" ${ln}/>
    <path d="M38 50 L84 50 C88 50 88 56 86 60 L86 70 L38 70 Z" fill="#64b5f6" ${ln}/>
    <path d="M46 56 L46 66 M58 56 L58 66 M70 56 L70 66" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity=".8"/>
    <path d="M22 46 C22 40 38 40 38 46 L38 56 C38 60 22 60 22 56 Z" fill="#fff8e1" ${ln}/>
    <rect x="14" y="74" width="72" height="8" rx="3" fill="#c48a5a" ${ln}/>`,
  chair: () => `
    <rect x="26" y="10" width="48" height="40" rx="6" fill="#c48a5a" ${ln}/>
    <rect x="33" y="18" width="34" height="24" rx="3" fill="#ffcc80" ${thin}/>
    <rect x="20" y="50" width="60" height="12" rx="4" fill="#a0673a" ${ln}/>
    <path d="M26 62 L24 92 M74 62 L76 92 M38 62 L38 84 M62 62 L62 84" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>
    <path d="M26 62 L24 92 M74 62 L76 92 M38 62 L38 84 M62 62 L62 84" stroke="#a0673a" stroke-width="3.5" stroke-linecap="round"/>`,
  cup: () => `
    <path d="M38 10 C34 16 42 18 38 24 M50 8 C46 14 54 16 50 22 M62 10 C58 16 66 18 62 24" fill="none" stroke="#b0bec5" stroke-width="3" stroke-linecap="round"/>
    <path d="M72 44 C92 42 92 72 70 70" fill="none" stroke="${INK}" stroke-width="10" stroke-linecap="round"/>
    <path d="M72 44 C92 42 92 72 70 70" fill="none" stroke="#ef5350" stroke-width="5" stroke-linecap="round"/>
    <path d="M20 32 L80 32 L74 82 C73 88 68 90 62 90 L38 90 C32 90 27 88 26 82 Z" fill="#ef5350" ${ln}/>
    <ellipse cx="50" cy="32" rx="30" ry="5" fill="#8d5a34" ${ln}/>
    <g fill="#fff"><circle cx="36" cy="50" r="4"/><circle cx="56" cy="46" r="3.5"/><circle cx="48" cy="66" r="4"/><circle cx="66" cy="62" r="3"/><circle cx="34" cy="76" r="3"/></g>`,
  book: () => `
    <path d="M50 26 C40 18 22 18 10 22 L10 80 C22 76 40 76 50 84 Z" fill="#fffaf0" ${ln}/>
    <path d="M50 26 C60 18 78 18 90 22 L90 80 C78 76 60 76 50 84 Z" fill="#fffaf0" ${ln}/>
    <path d="M10 80 C22 76 40 76 50 84 C60 76 78 76 90 80 L90 86 C78 82 60 82 50 90 C40 82 22 82 10 86 Z" fill="#e53935" ${ln}/>
    <path d="M18 34 L42 34 M18 44 L42 44 M18 54 L38 54 M58 34 L82 34 M58 44 L82 44 M58 54 L78 54" stroke="#90a4ae" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="70" cy="66" r="6" fill="#ffd54f"/><path d="M22 70 L30 60 L38 70 Z" fill="#81c784"/>`,
  ball: (u) => `
    <defs><clipPath id="bc${u}"><circle cx="50" cy="50" r="38"/></clipPath></defs>
    <g clip-path="url(#bc${u})">
      <rect x="0" y="0" width="100" height="100" fill="#fff"/>
      <path d="M50 50 L10 0 L50 0 Z M50 50 L90 0 L100 40 Z" fill="#e53935"/>
      <path d="M50 50 L100 40 L100 100 Z M50 50 L0 40 L0 0 L10 0 Z" fill="#ffd54f"/>
      <path d="M50 50 L100 100 L40 100 Z M50 50 L0 100 L0 40 Z" fill="#42a5f5"/>
    </g>
    <circle cx="50" cy="50" r="38" fill="none" ${ln}/>
    <circle cx="50" cy="50" r="7" fill="#fff" ${thin}/>
    ${shine(34, 32, 6, 10, -40)}`,
  key: () => `
    <circle cx="30" cy="50" r="18" fill="#ffca28" ${ln}/>
    <circle cx="30" cy="50" r="7" fill="#fff6e5" ${ln}/>
    <path d="M46 44 L88 44 L88 56 L82 56 L82 66 L74 66 L74 56 L68 56 L68 62 L60 62 L60 56 L46 56 Z" fill="#ffca28" ${ln}/>
    ${shine(22, 42, 3, 6)}`,
  umbrella: () => `
    <path d="M50 52 L50 80 C50 92 34 92 34 82" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>
    <path d="M50 52 L50 80 C50 92 34 92 34 82" fill="none" stroke="#8d5a34" stroke-width="3" stroke-linecap="round"/>
    <path d="M8 52 C8 24 30 12 50 12 C70 12 92 24 92 52 C86 46 78 46 71 52 C64 46 56 46 50 52 C44 46 36 46 29 52 C22 46 14 46 8 52 Z" fill="#e53935" ${ln}/>
    <path d="M50 12 C42 22 38 36 29 52 M50 12 C58 22 62 36 71 52" fill="none" ${thin}/>
    <path d="M50 12 C46 24 46 40 50 52" fill="#ffd54f" ${thin}/>
    <path d="M50 12 L50 6" ${ln}/>`,
  van: () => `
    <path d="M8 66 L8 38 C8 30 14 26 22 26 L66 26 C72 26 76 30 80 36 L92 52 L92 66 C92 70 90 72 86 72 L14 72 C10 72 8 70 8 66 Z" fill="#42a5f5" ${ln}/>
    <path d="M60 32 L70 32 C72 32 74 34 76 36 L84 50 L60 50 Z" fill="#e1f5fe" ${ln}/>
    <rect x="16" y="32" width="16" height="16" rx="3" fill="#e1f5fe" ${ln}/><rect x="38" y="32" width="16" height="16" rx="3" fill="#e1f5fe" ${ln}/>
    <path d="M8 58 L92 58" stroke="#fff" stroke-width="4"/>
    <circle cx="28" cy="72" r="10" fill="#455a64" ${ln}/><circle cx="72" cy="72" r="10" fill="#455a64" ${ln}/>
    <circle cx="28" cy="72" r="4" fill="#cfd8dc"/><circle cx="72" cy="72" r="4" fill="#cfd8dc"/>
    <circle cx="89" cy="60" r="3" fill="#ffd54f" ${thin}/>`,
  xylophone: () => `
    <path d="M8 34 L88 52 M8 87 L88 69" stroke="#8d5a34" stroke-width="5" stroke-linecap="round"/>
    ${[['#e53935', 14, 60], ['#ff9800', 26, 54], ['#ffd54f', 38, 48], ['#66bb6a', 50, 42], ['#42a5f5', 62, 36], ['#9b59b6', 74, 30]].map(([c, x, h]) => `<rect x="${x}" y="${50 - h / 2 + 10}" width="10" height="${h}" rx="3" fill="${c}" ${thin}/><circle cx="${x + 5}" cy="${50 - h / 2 + 15}" r="1.5" fill="#fff"/><circle cx="${x + 5}" cy="${50 + h / 2 + 5}" r="1.5" fill="#fff"/>`).join('')}
    <path d="M36 92 L60 70 M56 94 L76 74" stroke="#8d5a34" stroke-width="4" stroke-linecap="round"/>
    <circle cx="62" cy="68" r="6" fill="#ef5350" ${thin}/><circle cx="78" cy="72" r="6" fill="#ef5350" ${thin}/>`,
  yoyo: () => `
    <path d="M50 4 C50 20 52 28 52 34" fill="none" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>
    <circle cx="50" cy="4" r="3" fill="#fff" ${thin}/>
    <circle cx="52" cy="62" r="30" fill="#e53935" ${ln}/>
    <circle cx="52" cy="62" r="20" fill="#ff8a80" ${thin}/>
    <circle cx="52" cy="62" r="7" fill="#ffd54f" ${ln}/>
    <path d="M52 34 L52 55" stroke="${INK}" stroke-width="2.4"/>
    ${shine(38, 48, 4, 8, -40)}`,
  queen: () => `
    <path d="M24 56 C14 70 18 90 30 92 L70 92 C82 90 86 70 76 56 Z" fill="#ffd27a" ${ln}/>
    <circle cx="50" cy="56" r="24" fill="#ffd9b8" ${ln}/>
    <path d="M26 52 C28 34 72 34 74 52 C66 44 34 44 26 52 Z" fill="#ffd27a" ${ln}/>
    <path d="M30 36 L30 16 L40 26 L50 12 L60 26 L70 16 L70 36 Z" fill="#ffca28" ${ln}/>
    <circle cx="50" cy="26" r="3.5" fill="#e53935"/><circle cx="37" cy="30" r="2.5" fill="#9b59b6"/><circle cx="63" cy="30" r="2.5" fill="#42a5f5"/>
    ${eyes(41, 59, 56, 3.5)}${cheeks(35, 65, 64, 4)}${smile(50, 66, 6)}`,
  igloo: () => `
    <path d="M10 82 C10 38 90 38 90 82 Z" fill="#e3f2fd" ${ln}/>
    <path d="M14 70 L86 70 M20 58 L80 58 M30 48 L70 48 M30 70 L30 82 M50 58 L50 70 M70 70 L70 82 M38 48 L38 58 M62 48 L62 58" fill="none" stroke="#90caf9" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M38 82 L38 70 C38 58 62 58 62 70 L62 82 Z" fill="#1e3a5f" ${ln}/>
    <path d="M4 84 L96 84" stroke="#bbdefb" stroke-width="6" stroke-linecap="round"/>
    <path d="M78 18 L80 24 L86 26 L80 28 L78 34 L76 28 L70 26 L76 24 Z" fill="#ffd54f"/>`,

  ant: () => `
    <path d="M30 40 L22 26 M40 40 L44 24" fill="none" ${ln}/>
    <path d="M38 62 L28 82 M50 62 L50 84 M62 62 L74 82 M44 60 L30 52 M58 60 L72 52" fill="none" ${ln}/>
    <circle cx="30" cy="50" r="12" fill="#6d3b2a" ${ln}/><ellipse cx="52" cy="58" rx="9" ry="8" fill="#6d3b2a" ${ln}/><ellipse cx="74" cy="60" rx="15" ry="12" fill="#6d3b2a" ${ln}/>
    <circle cx="26" cy="47" r="3.5" fill="#fff"/><circle cx="26" cy="47" r="1.8" fill="${INK}"/>
    <path d="M24 56 Q30 60 34 55" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
    <circle cx="22" cy="26" r="3" fill="#6d3b2a"/><circle cx="44" cy="24" r="3" fill="#6d3b2a"/>`,
  gift: () => `
    <rect x="16" y="44" width="68" height="46" rx="5" fill="#9b6dd6" ${ln}/>
    <rect x="12" y="32" width="76" height="16" rx="4" fill="#b388ff" ${ln}/>
    <rect x="44" y="32" width="12" height="58" fill="#ffd54f" ${thin}/>
    <path d="M50 32 C38 14 22 18 30 30 C34 34 44 33 50 32 Z M50 32 C62 14 78 18 70 30 C66 34 56 33 50 32 Z" fill="#ffd54f" ${ln}/>`,
  jam: () => `
    <rect x="24" y="30" width="52" height="60" rx="10" fill="#e53950" ${ln}/>
    <rect x="22" y="16" width="56" height="16" rx="4" fill="#fff" ${ln}/>
    <path d="M22 24 L78 24" stroke="#e53935" stroke-width="4" stroke-dasharray="6 6"/>
    <rect x="32" y="50" width="36" height="24" rx="5" fill="#fff8e1" ${thin}/>
    <path d="M44 62 C44 56 50 56 50 60 C50 56 56 56 56 62 C56 66 50 70 50 70 C50 70 44 66 44 62 Z" fill="#e53935"/>
    ${shine(32, 44, 3, 8, 0)}`,
  kite: () => `
    <path d="M50 8 L78 38 L50 76 L22 38 Z" fill="#42a5f5" ${ln}/>
    <path d="M50 8 L50 76 M22 38 L78 38" stroke="${INK}" stroke-width="2"/>
    <path d="M50 8 L78 38 L50 38 Z M22 38 L50 76 L50 38 Z" fill="#ef5350"/>
    <path d="M50 8 L78 38 L50 76 L22 38 Z" fill="none" ${ln}/>
    <path d="M50 76 C42 84 58 88 48 96" fill="none" ${thin}/>
    <path d="M46 84 L40 80 L42 88 Z M52 90 L58 86 L58 94 Z" fill="#ffd54f" ${thin}/>`,
  nest: () => `
    <ellipse cx="36" cy="48" rx="10" ry="13" fill="#e3f2fd" ${ln}/><ellipse cx="52" cy="44" rx="10" ry="13" fill="#b3e5fc" ${ln}/><ellipse cx="66" cy="49" rx="10" ry="13" fill="#e3f2fd" ${ln}/>
    <path d="M12 54 C14 84 86 84 88 54 Z" fill="#b07a4a" ${ln}/>
    <path d="M18 60 C34 70 66 70 82 60 M22 70 C40 78 60 78 78 70 M30 58 L40 76 M56 60 L48 78 M70 60 L64 74" fill="none" stroke="#7a4a2a" stroke-width="2.4" stroke-linecap="round"/>`,
  octopus: () => `
    ${[18, 30, 42, 58, 70, 82].map((x, i) => `<path d="M${x + (x < 50 ? 8 : -8)} 58 C${x} 70 ${x - 6 + i * 2} 80 ${x} 90" fill="none" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="M${x + (x < 50 ? 8 : -8)} 58 C${x} 70 ${x - 6 + i * 2} 80 ${x} 90" fill="none" stroke="#f48fb1" stroke-width="5.5" stroke-linecap="round"/>`).join('')}
    <path d="M18 56 C14 14 86 14 82 56 C82 66 18 66 18 56 Z" fill="#f48fb1" ${ln}/>
    ${eyes(39, 61, 42, 5)}${cheeks(32, 68, 52, 4)}${smile(50, 50, 6)}`,
  pear: () => `
    <path d="M50 22 C40 22 40 36 36 46 C28 58 22 66 26 78 C30 92 70 92 74 78 C78 66 72 58 64 46 C60 36 60 22 50 22 Z" fill="#c5e163" ${ln}/>
    <path d="M50 22 C50 16 52 12 56 8" fill="none" stroke="#7a4a2a" stroke-width="4" stroke-linecap="round"/>
    <path d="M53 16 C60 8 70 10 72 14 C66 20 58 20 53 16 Z" fill="#7cc35a" ${ln}/>
    ${shine(38, 62, 4, 9)}`,
  vase: () => `
    ${[[38, 22, '#e53935'], [50, 14, '#ffd54f'], [62, 22, '#9b6dd6']].map(([x, y, c]) => `<path d="M50 44 L${x} ${y + 6}" stroke="#43a047" stroke-width="3"/><circle cx="${x}" cy="${y}" r="8" fill="${c}" ${thin}/><circle cx="${x}" cy="${y}" r="3" fill="#fff8e1"/>`).join('')}
    <path d="M38 40 L62 40 C62 50 76 56 76 72 C76 86 66 92 50 92 C34 92 24 86 24 72 C24 56 38 50 38 40 Z" fill="#4fc3f7" ${ln}/>
    <path d="M30 70 C40 64 60 64 70 70" fill="none" stroke="#fff" stroke-width="3" opacity=".7"/>`,
  whale: () => `
    <path d="M44 22 C40 14 46 10 50 16 C54 10 60 14 56 22" fill="none" stroke="#4fc3f7" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M8 58 C8 34 30 28 50 28 C72 28 82 44 82 56 L92 42 C96 40 98 44 96 48 L90 66 C86 78 70 84 50 84 C26 84 8 76 8 58 Z" fill="#42a5f5" ${ln}/>
    <path d="M14 64 C24 78 60 80 76 70 C64 82 24 82 14 64 Z" fill="#e3f2fd"/>
    ${eyes(26, 26, 50, 4).split('<circle').slice(0, 2).join('<circle').replace(/^/, '')}<circle cx="27.4" cy="48.4" r="1.5" fill="#fff"/>
    ${cheeks(32, 32, 60, 4)}<path d="M18 62 Q26 68 34 64" fill="none" ${thin}/>`,
  zero: () => `
    <ellipse cx="50" cy="52" rx="30" ry="38" fill="#ffd54f" ${ln}/>
    <ellipse cx="50" cy="52" rx="14" ry="22" fill="#fff6e5" ${ln}/>
    ${shine(32, 36, 4, 10, -10)}`,
  insect: () => `
    <path d="M40 22 L32 10 M60 22 L68 10" fill="none" ${ln}/>
    <path d="M24 50 L10 44 M22 64 L8 66 M26 78 L14 86 M76 50 L90 44 M78 64 L92 66 M74 78 L86 86" fill="none" ${ln}/>
    <circle cx="50" cy="60" r="30" fill="#e53935" ${ln}/>
    <path d="M50 30 L50 90" ${ln}/>
    <path d="M30 32 C34 20 66 20 70 32 C62 38 38 38 30 32 Z" fill="${INK}"/>
    <g fill="${INK}"><circle cx="36" cy="52" r="5"/><circle cx="64" cy="52" r="5"/><circle cx="34" cy="72" r="4.5"/><circle cx="66" cy="72" r="4.5"/></g>
    <circle cx="42" cy="28" r="2.4" fill="#fff"/><circle cx="58" cy="28" r="2.4" fill="#fff"/>`,

  sun: () => `
    ${Array.from({ length: 10 }, (_, i) => { const a = i / 10 * Math.PI * 2; const p = (r, d = 0) => `${(50 + Math.cos(a + d) * r).toFixed(1)} ${(50 + Math.sin(a + d) * r).toFixed(1)}`; return `<path d="M${p(30, -.2)} L${p(46)} L${p(30, .2)} Z" fill="#ffb300" ${ln}/>`; }).join('')}
    <circle cx="50" cy="50" r="28" fill="#ffd54f" ${ln}/>
    ${eyes(41, 59, 46, 3.5)}${cheeks(36, 64, 56, 4)}${smile(50, 56, 8)}`,
  moon: () => `
    <path d="M58 10 C34 12 18 32 18 54 C18 76 36 92 60 90 C74 89 84 82 88 74 C60 80 42 62 44 40 C45 26 50 16 58 10 Z" fill="#fff59d" ${ln}/>
    <path d="M30 52 Q34 56 38 52" fill="none" ${thin}/>${cheeks(30, 30, 62, 3.5)}
    <path d="M74 22 L76 28 L82 30 L76 32 L74 38 L72 32 L66 30 L72 28 Z" fill="#ffd54f" ${thin}/>
    <circle cx="84" cy="50" r="2.5" fill="#ffd54f"/>`,
  star: () => `
    <path d="M50 8 L61 36 L91 38 L68 57 L76 88 L50 71 L24 88 L32 57 L9 38 L39 36 Z" fill="#ffd54f" ${ln}/>
    ${eyes(42, 58, 48, 3.2)}${smile(50, 56, 5)}${shine(40, 30, 3, 6, 20)}`,
  tree: () => `
    <path d="M42 92 L44 58 L56 58 L58 92 Z" fill="#a0673a" ${ln}/>
    <circle cx="50" cy="36" r="24" fill="#66bb6a" ${ln}/><circle cx="28" cy="52" r="18" fill="#66bb6a" ${ln}/><circle cx="72" cy="52" r="18" fill="#66bb6a" ${ln}/>
    <path d="M28 52 C40 66 60 66 72 52" fill="#66bb6a"/><circle cx="50" cy="48" r="20" fill="#66bb6a"/>
    <g fill="#e53935" ${thin}><circle cx="40" cy="30" r="4.5"/><circle cx="62" cy="40" r="4.5"/><circle cx="26" cy="54" r="4.5"/><circle cx="74" cy="56" r="4.5"/><circle cx="50" cy="56" r="4.5"/></g>
    <path d="M30 92 L70 92" stroke="#81c784" stroke-width="5" stroke-linecap="round"/>`,
  flower: () => `
    <path d="M50 54 L50 94" stroke="#43a047" stroke-width="5" stroke-linecap="round"/>
    <path d="M50 80 C38 66 24 70 22 76 C30 84 44 84 50 80 Z M50 72 C62 60 76 64 78 70 C70 78 56 78 50 72 Z" fill="#66bb6a" ${ln}/>
    ${Array.from({ length: 6 }, (_, i) => { const a = i / 6 * Math.PI * 2 - Math.PI / 2; return `<circle cx="${(50 + Math.cos(a) * 16).toFixed(1)}" cy="${(36 + Math.sin(a) * 16).toFixed(1)}" r="12" fill="#9b6dd6" ${ln}/>`; }).join('')}
    <circle cx="50" cy="36" r="10" fill="#ffd54f" ${ln}/>
    <circle cx="47" cy="33" r="2.5" fill="#fff" opacity=".7"/>`,
  cloud: () => `
    <path d="M24 74 C10 74 8 54 22 52 C20 36 40 30 48 42 C54 26 78 28 78 48 C92 48 94 74 78 74 Z" fill="#fff" stroke="#64b5f6" stroke-width="3.5" stroke-linejoin="round"/>
    ${eyes(42, 60, 56, 3)}${cheeks(36, 66, 63, 3.5)}${smile(51, 62, 5)}
    <path d="M30 86 L28 92 M50 86 L48 92 M70 86 L68 92" stroke="#42a5f5" stroke-width="3.5" stroke-linecap="round"/>`,
  rainbow: () => `
    ${[['#e53935', 42], ['#ff9800', 36], ['#ffd54f', 30], ['#66bb6a', 24], ['#42a5f5', 18], ['#9b59b6', 12]].map(([c, r]) => `<path d="M${50 - r} 72 A${r} ${r} 0 0 1 ${50 + r} 72" fill="none" stroke="${c}" stroke-width="6.5"/>`).join('')}
    <path d="M4 78 C2 68 12 64 16 68 C18 60 30 60 30 70 C36 70 36 80 30 80 L8 80 C5 80 4 79 4 78 Z M70 80 C64 80 64 70 70 70 C70 60 82 60 84 68 C88 64 98 68 96 78 C96 79 95 80 92 80 Z" fill="#fff" stroke="#90caf9" stroke-width="3" stroke-linejoin="round"/>`,
  leaf: () => `
    <path d="M18 84 C14 46 40 16 86 14 C86 58 62 86 18 84 Z" fill="#7cc35a" ${ln}/>
    <path d="M18 84 C38 64 56 44 78 22 M40 62 L36 44 M40 62 L58 64 M54 46 L52 32 M54 46 L70 46" fill="none" stroke="#4e9a3a" stroke-width="2.6" stroke-linecap="round"/>
    <path d="M18 84 L10 92" ${ln}/>`,

  head: () => `
    <path d="M18 50 C14 24 34 10 50 10 C66 10 86 24 82 50" fill="#f2c063" ${ln}/>
    <circle cx="50" cy="54" r="30" fill="#ffd9b8" ${ln}/>
    <path d="M22 44 C30 24 70 24 78 44 C66 34 50 32 36 40 Z" fill="#f2c063" ${ln}/>
    <path d="M20 42 C26 26 74 26 80 42" fill="none" stroke="#e53935" stroke-width="4" stroke-linecap="round"/>
    ${eyes(40, 60, 54, 4)}${cheeks(34, 66, 64, 4.5)}${smile(50, 66, 7)}`,
  eye: () => `
    <path d="M8 52 C24 26 76 26 92 52 C76 78 24 78 8 52 Z" fill="#fff" ${ln}/>
    <circle cx="50" cy="52" r="17" fill="#8d5a34" ${ln}/>
    <circle cx="50" cy="52" r="8" fill="${INK}"/><circle cx="55" cy="46" r="4" fill="#fff"/>
    <path d="M22 36 L16 26 M36 30 L33 19 M50 28 L50 16 M64 30 L67 19 M78 36 L84 26" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`,
  ear: () => `
    <path d="M34 22 C40 8 72 6 76 32 C79 50 66 56 62 66 C58 78 54 92 40 88 C28 84 30 70 34 64" fill="#ffd2ad" ${ln}/>
    <path d="M34 64 C22 52 26 34 34 22" fill="#ffd2ad" ${ln}/>
    <path d="M44 32 C52 22 66 28 64 40 C62 50 52 52 52 62" fill="none" stroke="#d99a77" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M48 46 C52 44 56 46 54 50" fill="none" stroke="#d99a77" stroke-width="3" stroke-linecap="round"/>`,
  nose: () => `
    <path d="M44 14 C44 30 34 48 26 60 C18 72 26 84 38 82 C44 88 56 88 62 82 C74 84 82 72 74 60 C66 48 56 30 56 14 Z" fill="#ffd2ad" ${ln}/>
    <ellipse cx="40" cy="72" rx="5" ry="3.5" fill="#b9785a"/><ellipse cx="60" cy="72" rx="5" ry="3.5" fill="#b9785a"/>
    <path d="M56 22 C58 36 64 46 68 54" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".6"/>`,
  mouth: () => `
    <path d="M10 46 C24 34 40 38 50 42 C60 38 76 34 90 46 C80 72 64 82 50 82 C36 82 20 72 10 46 Z" fill="#e85c6b" ${ln}/>
    <path d="M18 48 C30 50 70 50 82 48 C76 60 64 64 50 64 C36 64 24 60 18 48 Z" fill="#fff" ${thin}/>
    <path d="M36 50 L36 62 M50 51 L50 64 M64 50 L64 62" stroke="#e0d6d0" stroke-width="2"/>
    ${shine(36, 74, 6, 2.5, 0)}`,
  hand: () => `
    <path d="M30 90 C24 80 22 66 22 56 L22 36 C22 30 30 30 31 36 L32 52 L32 22 C32 15 41 15 41 22 L42 48 L42 16 C42 9 52 9 52 16 L52 48 L53 22 C53 15 62 15 62 22 L62 56 C66 50 70 44 76 44 C82 44 84 50 80 56 C72 68 70 80 64 90 Z" fill="#ffd2ad" ${ln}/>
    <path d="M38 76 C44 80 52 80 58 76" fill="none" stroke="#d99a77" stroke-width="2.5" stroke-linecap="round"/>`,
  foot: () => `
    <path d="M36 92 C22 92 20 76 24 62 C28 48 26 42 32 36 C40 28 66 30 70 42 C74 54 66 64 62 74 C58 86 52 92 36 92 Z" fill="#ffd2ad" ${ln}/>
    <circle cx="34" cy="22" r="8" fill="#ffd2ad" ${ln}/><circle cx="49" cy="16" r="6.5" fill="#ffd2ad" ${ln}/><circle cx="61" cy="18" r="5.5" fill="#ffd2ad" ${ln}/><circle cx="70" cy="24" r="4.8" fill="#ffd2ad" ${ln}/><circle cx="76" cy="32" r="4" fill="#ffd2ad" ${ln}/>
    <g fill="#ff8a80" opacity=".8"><circle cx="34" cy="21" r="3.5"/><circle cx="49" cy="15" r="2.6"/><circle cx="61" cy="17" r="2.2"/></g>`,
  tooth: () => `
    <path d="M26 20 C36 10 44 18 50 18 C56 18 64 10 74 20 C84 32 76 52 72 66 C68 80 66 92 60 92 C54 92 54 74 50 74 C46 74 46 92 40 92 C34 92 32 80 28 66 C24 52 16 32 26 20 Z" fill="#fff" ${ln}/>
    ${eyes(41, 59, 44, 3.5)}${cheeks(35, 65, 52, 4)}${smile(50, 52, 6)}
    <path d="M82 10 L84 16 L90 18 L84 20 L82 26 L80 20 L74 18 L80 16 Z" fill="#81d4fa"/>`,
};

const COLOURS = { red: '#e53935', blue: '#1e88e5', yellow: '#fdd835', green: '#43a047', orange: '#fb8c00', purple: '#8e44ad', pink: '#f06292', brown: '#8d5a34', black: '#333', white: '#fafafa' };
function balloon(c) {
  return `<path d="M50 74 C46 82 56 84 50 96" fill="none" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>
    <path d="M50 8 C72 8 84 24 84 40 C84 60 64 74 50 74 C36 74 16 60 16 40 C16 24 28 8 50 8 Z" fill="${c}" ${ln}/>
    <path d="M45 74 L55 74 L52 79 L48 79 Z" fill="${c}" ${thin}/>
    ${shine(34, 30, 6, 11, 25)}`;
}

function art(key, cls = '') {
  const u = ++_uid;
  const inner = key.startsWith('colour:') ? balloon(COLOURS[key.slice(7)]) : (ART[key] ? ART[key](u) : '');
  return `<svg class="art ${cls}" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">${inner}</svg>`;
}

/* Small UI icons (not pictures to learn). */
const ICON = {
  home: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M8 24 L24 10 L40 24" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><path d="M13 22 L13 39 L35 39 L35 22" fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round"/><rect x="20" y="28" width="8" height="11" rx="2" fill="currentColor"/></svg>',
  back: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M30 10 L16 24 L30 38" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  next: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M18 10 L32 24 L18 38" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  speaker: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M8 18 L16 18 L26 9 L26 39 L16 30 L8 30 Z" fill="currentColor" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/><path d="M32 17 C36 21 36 27 32 31 M37 12 C44 19 44 29 37 36" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/></svg>',
  play: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M15 9 L39 24 L15 39 Z" fill="currentColor" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/></svg>',
  star: '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 8 L61 36 L91 38 L68 57 L76 88 L50 71 L24 88 L32 57 L9 38 L39 36 Z" fill="#ffd54f" stroke="#c98a00" stroke-width="5" stroke-linejoin="round"/></svg>',
  eye: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M4 24 C12 12 36 12 44 24 C36 36 12 36 4 24 Z" fill="#fff" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/><circle cx="24" cy="24" r="7" fill="currentColor"/></svg>',
  again: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M38 24 A14 14 0 1 1 30 11" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/><path d="M27 4 L34 11 L26 17" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  close: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M14 14 L34 34 M34 14 L14 34" stroke="currentColor" stroke-width="6" stroke-linecap="round"/></svg>',
};


/* ===== src/30-audio.js ===== */
/* Speech (speechSynthesis, en-GB preferred) and generated Web Audio sound effects. No audio files. */
const Audio = (() => {
  let ctx = null, master = null;
  const synth = window.speechSynthesis;
  const voices = {}; // 'en' | 'pl' | 'ru' -> SpeechSynthesisVoice | null
  const PREFERRED = {
    en: [/serena/i, /kate/i, /martha/i, /stephanie/i, /google uk english female/i, /libby/i, /sonia/i, /hazel/i, /female/i, /daniel/i],
    pl: [/zosia/i, /ewa/i, /paulina/i, /agnieszka/i, /google polski/i, /zofia/i, /marek/i],
    ru: [/milena/i, /katya/i, /google русский/i, /svetlana/i, /irina/i, /dariya/i, /yuri/i],
  };
  const NOVELTY = /compact|eloquence|novelty|whisper|bad news|bells|bubbles|cellos|organ|zarvox|trinoids|boing|jester|superstar|wobble|grandpa|grandma|albert|bahh|reed|rocko|sandy|shelley|flo|eddy/i;
  let listLoaded = false;
  function pickVoices() {
    if (!synth) return;
    const vs = synth.getVoices();
    if (!vs.length) return;
    listLoaded = true;
    for (const L of ['en', 'pl', 'ru']) {
      const all = vs.filter((v) => v.lang.toLowerCase().replace('_', '-').startsWith(L));
      const pool = L === 'en' ? (all.filter((v) => /gb/i.test(v.lang)).length ? all.filter((v) => /gb/i.test(v.lang)) : all) : all;
      const clean = pool.filter((v) => !NOVELTY.test(v.name));
      let best = null;
      for (const re of PREFERRED[L]) { best = clean.find((v) => re.test(v.name)); if (best) break; }
      voices[L] = best || clean.find((v) => v.localService) || clean[0] || pool[0] || null;
    }
  }
  if (synth) { pickVoices(); synth.addEventListener?.('voiceschanged', pickVoices); }
  const LOCALE = { en: 'en-GB', pl: 'pl-PL', ru: 'ru-RU' };

  function ensureCtx() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    if (!ctx) { ctx = new AC(); master = ctx.createGain(); master.gain.value = 0.5; master.connect(ctx.destination); }
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    return ctx;
  }

  /* Must be called from inside a tap handler (iOS Safari rule). */
  let unlocked = false;
  function unlock() {
    const c = ensureCtx();
    if (c) { const b = c.createBuffer(1, 1, 22050); const s = c.createBufferSource(); s.buffer = b; s.connect(c.destination); s.start(0); }
    if (synth && !unlocked) { try { const u = new SpeechSynthesisUtterance(' '); u.volume = 0; synth.speak(u); } catch (e) {} }
    unlocked = true;
    pickVoices();
  }

  let queueToken = 0;
  /* say(['Pokaż', EN('apple')]): plain strings are guide speech in the interface language,
     EN(...) parts are English target vocabulary, always in an English voice. */
  function say(parts, opts = {}) {
    if (!synth || !Store.settings.voice) return Promise.resolve();
    const ui = lang();
    const list = (Array.isArray(parts) ? parts : [parts]).map((p) => (typeof p === 'string' ? { t: p, L: ui } : { t: p.en, L: 'en' }))
      // If the device has no voice for the interface language, skip those phrases (the bubble still shows them).
      .filter((p) => p.t && (!listLoaded || voices[p.L] || p.L === 'en'));
    const token = ++queueToken;
    synth.cancel();
    if (synth.paused) synth.resume();
    return new Promise((resolve) => {
      let i = 0;
      const next = () => {
        if (token !== queueToken || i >= list.length) return resolve();
        const p = list[i++];
        const u = new SpeechSynthesisUtterance(p.t);
        const v = voices[p.L];
        if (v) u.voice = v;
        u.lang = v ? v.lang : LOCALE[p.L];
        u.rate = opts.rate || (p.L === 'en' ? 0.8 : 0.9);
        u.pitch = opts.pitch || 1.12;
        let done = false;
        const fin = () => { if (done) return; done = true; setTimeout(next, 160); };
        u.onend = fin; u.onerror = fin;
        setTimeout(fin, 1000 + p.t.length * 150);
        synth.speak(u);
      };
      setTimeout(next, 60);
    });
  }
  function hush() { queueToken++; if (synth) synth.cancel(); }

  function tone(freq, start, dur, { type = 'sine', vol = 0.3, glide = 0, attack = 0.01 } = {}) {
    const c = ctx; if (!c) return;
    const t = c.currentTime + start;
    const o = c.createOscillator(); const g = c.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    if (glide) o.frequency.exponentialRampToValueAtTime(freq * glide, t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + attack); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + dur + 0.05);
  }
  const N = { C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880, B5: 987.77, C6: 1046.5, E6: 1318.5, G6: 1568, C4: 261.63, G4: 392, E4: 329.63, A4: 440 };
  const SFX = {
    tap: () => { tone(660, 0, 0.09, { type: 'triangle', vol: 0.18, glide: 1.5 }); },
    pop: () => { tone(420, 0, 0.12, { type: 'sine', vol: 0.25, glide: 2.2 }); },
    open: () => { [N.C5, N.E5, N.G5].forEach((f, i) => tone(f, i * 0.06, 0.18, { type: 'triangle', vol: 0.16 })); },
    correct: () => { [N.C5, N.E5, N.G5, N.C6].forEach((f, i) => { tone(f, i * 0.09, 0.35, { type: 'triangle', vol: 0.22 }); tone(f * 2, i * 0.09, 0.25, { type: 'sine', vol: 0.06 }); }); tone(N.E6, 0.42, 0.5, { type: 'sine', vol: 0.08 }); },
    sparkle: () => { [N.C6, N.E6, N.G6, N.E6 * 2].forEach((f, i) => tone(f, i * 0.05, 0.2, { type: 'sine', vol: 0.06 })); },
    // gentle "hmm?" — two soft rising notes, never a buzz
    again: () => { tone(N.E4, 0, 0.22, { type: 'sine', vol: 0.16 }); tone(N.G4, 0.18, 0.3, { type: 'sine', vol: 0.16 }); },
    count: (n = 1) => { tone(N.C5 * Math.pow(2, (n - 1) / 12 * 2), 0, 0.16, { type: 'triangle', vol: 0.18 }); },
    fanfare: () => { const s = [N.C5, N.E5, N.G5, N.C6, N.G5, N.C6, N.E6]; s.forEach((f, i) => { tone(f, i * 0.12, i === s.length - 1 ? 0.8 : 0.22, { type: 'triangle', vol: 0.2 }); tone(f / 2, i * 0.12, 0.2, { type: 'sine', vol: 0.06 }); }); },
    woof: () => { [0, 0.22].forEach((st) => { tone(260, st, 0.12, { type: 'sawtooth', vol: 0.12, glide: 0.55, attack: 0.005 }); tone(520, st, 0.08, { type: 'square', vol: 0.04, glide: 0.5, attack: 0.005 }); }); },
    sneeze: () => { tone(500, 0, 0.35, { type: 'sine', vol: 0.12, glide: 1.8, attack: 0.25 }); tone(1400, 0.4, 0.12, { type: 'sawtooth', vol: 0.08, glide: 0.4, attack: 0.003 }); },
    boing: () => { tone(180, 0, 0.35, { type: 'sine', vol: 0.2, glide: 3.5 }); },
    whoosh: () => { tone(300, 0, 0.25, { type: 'sine', vol: 0.12, glide: 3 }); },
  };
  function sfx(name, arg) { if (!Store.settings.sound) return; if (!ensureCtx()) return; try { SFX[name] && SFX[name](arg); } catch (e) {} }

  return { unlock, say, hush, sfx, voiceFor: (L) => (voices[L] ? `${voices[L].name} (${voices[L].lang})` : ''), get hasSpeech() { return !!synth; }, get listLoaded() { return listLoaded; } };
})();


/* ===== src/40-ui.js ===== */
/* Lea Learns — shared UI: screens, the Lea companion, taps, celebrations. */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const POSES = ['front', 'wave', 'cheer', 'point', 'sit', 'think', 'jump'];
const player = () => (NAMES[Store.settings.player] ? Store.settings.player : 'lea');
const playerName = (who = player()) => NAMES[who][lang()];
const playerSay = () => (lang() === 'en' ? NAMES[player()].sayEn : playerName());
const poseSrc = (pose, who = player()) => `assets/character/${who}-${pose}.png`;
const leaImg = (pose, cls = '', who = player()) => `<img class="lea ${cls}" src="${poseSrc(pose, who)}" alt="${NAMES[who].en}" draggable="false" data-pose="${pose}" data-who="${who}">`;

function h(html) { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; }

/* Reliable toddler taps: fire on release, ignore drags and scrolls, give instant pressed feedback. */
function onTap(el, fn, { sound = 'tap' } = {}) {
  let id = null, x = 0, y = 0;
  el.addEventListener('pointerdown', (e) => { if (e.button > 0) return; id = e.pointerId; x = e.clientX; y = e.clientY; el.classList.add('pressed'); });
  const clear = () => { id = null; el.classList.remove('pressed'); };
  el.addEventListener('pointerup', (e) => {
    const ok = id === e.pointerId && Math.hypot(e.clientX - x, e.clientY - y) < 40;
    clear();
    if (!ok || el.disabled || el.classList.contains('off')) return;
    if (sound) Audio.sfx(sound);
    fn(e);
  });
  el.addEventListener('pointercancel', clear);
  el.addEventListener('pointerleave', () => el.classList.remove('pressed'));
  el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (sound) Audio.sfx(sound); fn(e); } });
  el.addEventListener('contextmenu', (e) => e.preventDefault());
  return el;
}

const App = { screen: null, params: null, busy: false, timers: [] };
const SCREENS = {};
function later(fn, ms) { const t = setTimeout(fn, ms); App.timers.push(t); return t; }

function go(name, params = {}) {
  App.timers.forEach(clearTimeout); App.timers = [];
  Audio.hush();
  closeOverlays();
  const root = $('#app');
  const old = root.firstElementChild;
  const el = SCREENS[name](params);
  el.classList.add('screen', 'screen-in');
  el.dataset.screen = name;
  root.appendChild(el);
  if (old) { old.classList.add('screen-out'); setTimeout(() => old.remove(), 260); }
  App.screen = name; App.params = params; App.busy = false;
  if (el._layout) requestAnimationFrame(el._layout);
  if (el._enter) later(el._enter, 320);
  document.body.dataset.screen = name;
}

/* Top bar used by every activity screen. */
function topBar({ back, title, art: icon, colour }) {
  const bar = h(`<header class="bar">
    <button class="round-btn home-btn" aria-label="Back">${back === 'home' ? ICON.home : ICON.back}</button>
    <div class="bar-title" style="--c:${colour || 'var(--red)'}">${icon ? `<span class="bar-icon">${art(icon)}</span>` : ''}<span>${title}</span></div>
    <div class="apples-chip" aria-label="Apples">${art('apple')}<b>${Store.data.apples}</b></div>
  </header>`);
  onTap(bar.querySelector('.home-btn'), () => (typeof back === 'function' ? back() : go(back || 'home')), { sound: 'whoosh' });
  return bar;
}
function refreshApples() { $$('.apples-chip b').forEach((b) => { b.textContent = Store.data.apples; b.parentElement.classList.remove('bump'); void b.offsetWidth; b.parentElement.classList.add('bump'); }); }

/* Lea as companion with a speech bubble. */
function guide(pose, text) {
  return h(`<div class="guide"><div class="guide-lea">${leaImg(pose)}</div><div class="bubble" ${text ? '' : 'hidden'}>${text || ''}</div></div>`);
}
function setGuide(pose, text, anim = 'hop') {
  const g = $('.screen:not(.screen-out) .guide'); if (!g) return;
  const img = g.querySelector('img.lea');
  if (img && img.dataset.pose !== pose) { img.src = poseSrc(pose); img.dataset.pose = pose; }
  if (img) { img.classList.remove('hop', 'wiggle'); void img.offsetWidth; img.classList.add(anim); }
  const b = g.querySelector('.bubble');
  if (text) { b.hidden = false; b.textContent = text; b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop'); } else b.hidden = true;
}

/* Confetti of apples and stars, plus Lea jumping up to cheer. */
function celebrate({ text = tPick('praise'), pose = pick(['jump', 'cheer']), big = false } = {}) {
  const layer = h(`<div class="celebrate ${big ? 'big' : ''}" aria-hidden="true"></div>`);
  const n = big ? 34 : 18;
  for (let i = 0; i < n; i++) {
    const kind = i % 3 === 0 ? art('apple') : i % 3 === 1 ? ICON.star : `<i style="background:${pick(LETTER_COLOURS)}"></i>`;
    const p = h(`<span class="bit">${kind}</span>`);
    const ang = Math.random() * Math.PI * 2, dist = 30 + Math.random() * 45;
    p.style.setProperty('--dx', `${Math.cos(ang) * dist}vmin`); p.style.setProperty('--dy', `${Math.sin(ang) * dist - 10}vmin`);
    p.style.setProperty('--r', `${Math.random() * 720 - 360}deg`); p.style.setProperty('--d', `${Math.random() * 0.15}s`);
    p.style.setProperty('--s', `${0.6 + Math.random() * 0.8}`);
    layer.appendChild(p);
  }
  layer.appendChild(h(`<div class="cheer-lea">${leaImg(pose)}<div class="cheer-text">${text}</div></div>`));
  document.body.appendChild(layer);
  Audio.sfx('correct'); setTimeout(() => Audio.sfx('sparkle'), 380);
  setTimeout(() => layer.remove(), big ? 2600 : 1700);
}

function closeOverlays() { $$('.overlay, .celebrate').forEach((o) => o.remove()); }

/* Progress stars at the top of a round. */
function starsRow(total) { return h(`<div class="round-stars" aria-hidden="true">${Array.from({ length: total }, () => `<span class="rs">${ICON.star}</span>`).join('')}</div>`); }
function fillStar(row, i) { const s = row.children[i]; if (s) { s.classList.add('on'); } }

/* End-of-round celebration with replay / home. */
function roundEnd({ stars, onAgain, onHome, title = T('wellDone', playerName()) }) {
  Store.addStars(stars);
  const o = h(`<div class="overlay round-end" role="dialog" aria-label="${title}">
    <div class="end-card">
      <div class="end-lea">${leaImg('cheer')}</div>
      <h2>${title}</h2>
      <div class="end-stars">${Array.from({ length: stars }, (_, i) => `<span style="--i:${i}">${ICON.star}</span>`).join('')}</div>
      <div class="end-actions">
        <button class="big-btn again" aria-label="Play again">${ICON.again}</button>
        <button class="big-btn home" aria-label="Back">${ICON.home}</button>
      </div>
    </div></div>`);
  document.body.appendChild(o);
  celebrate({ text: '', pose: 'jump', big: true });
  setTimeout(() => Audio.sfx('fanfare'), 300);
  Audio.say([T('wellDone', playerSay()), T('stars5')]);
  onTap(o.querySelector('.again'), () => { o.remove(); onAgain(); }, { sound: 'pop' });
  onTap(o.querySelector('.home'), () => { o.remove(); onHome(); }, { sound: 'whoosh' });
}

/* Generic quiz helper: big choice cards, gentle retry, hint after two misses. */
function runChoice({ stage, choices, render, isRight, onRight, onMiss, cls = '' }) {
  const wrap = h(`<div class="choices n${choices.length} ${cls}"></div>`);
  let misses = 0, done = false;
  choices.forEach((c) => {
    const b = h(`<button class="choice" data-key="${c.key}" data-right="${isRight(c) ? 1 : 0}">${render(c)}</button>`);
    onTap(b, () => {
      if (done || App.busy) return;
      if (isRight(c)) {
        done = true; b.classList.add('right'); wrap.classList.add('solved');
        Store.addApple(); refreshApples();
        Dog.maybe();
        onRight(c, misses);
      } else {
        misses++; b.classList.add('miss'); setTimeout(() => b.classList.add('off'), 450);
        Audio.sfx('again');
        if (misses >= 2) { const r = wrap.querySelector('[data-right="1"]'); r && r.classList.add('hint'); }
        onMiss(c, misses);
      }
    }, { sound: 'pop' });
    wrap.appendChild(b);
  });
  stage.appendChild(wrap);
  return wrap;
}


/* Visible language switch on the home and start screens. Same setting as the parent corner. */
function langBar() {
  const labels = { pl: 'Polski', en: 'English', ru: 'Русский' };
  const aria = { pl: 'Język', en: 'Language', ru: 'Язык' };
  const el = h(`<div class="lang-bar" role="group" aria-label="${aria[lang()] || 'Language'}">${
    Object.entries(LANGS).map(([k, x]) =>
      `<button type="button" class="lang-btn${k === lang() ? ' on' : ''}" data-lang="${k}" lang="${k}" aria-pressed="${k === lang()}">${labels[k]}</button>`
    ).join('')
  }</div>`);
  $$('.lang-btn', el).forEach((b) => onTap(b, () => {
    const next = b.dataset.lang;
    if (next === lang()) return;
    Audio.unlock();
    Store.set('lang', next);
    document.documentElement.lang = next;
    const screen = App.screen || 'home';
    const params = App.params || {};
    // Re-mount so every label and the guide’s speech switch at once. Skip the hello animation.
    go(screen, screen === 'home' ? { ...params, hello: false } : params);
  }, { sound: 'open' }));
  return el;
}

/* Hidden parent corner: hold for 3 seconds. */
function parentCorner() {
  const c = h(`<div class="parent-corner" aria-label="Parents: hold for 3 seconds" role="button" tabindex="-1"><svg viewBox="0 0 36 36"><circle class="pc-track" cx="18" cy="18" r="14"/><circle class="pc-fill" cx="18" cy="18" r="14"/></svg></div>`);
  let t = null;
  const start = (e) => { e.preventDefault(); c.classList.add('holding'); t = setTimeout(() => { c.classList.remove('holding'); openParent(); }, 3000); };
  const stop = () => { c.classList.remove('holding'); clearTimeout(t); };
  c.addEventListener('pointerdown', start); ['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) => c.addEventListener(ev, stop));
  c.addEventListener('contextmenu', (e) => e.preventDefault());
  return c;
}


/* ===== src/45-dog.js ===== */
/* Lea Learns — Bacon, the family French Bulldog: comic relief who pops in now and then (not a playable character). */
const Dog = (() => {
  let lastShow = 0, sinceLast = 0, pending = false;
  const GAGS = [
    { id: 'run', pose: 'chase', sfx: 'woof' },   // zooms across after a red apple
    { id: 'roll', pose: 'roll', sfx: 'boing' },  // rolls on his back
    { id: 'jump', pose: 'jump', sfx: 'sneeze' }, // sneezes and jumps in surprise
    { id: 'party', pose: 'party', sfx: 'sparkle' }, // sits proudly in a tiny party hat
    { id: 'grin', pose: 'grin', sfx: 'woof' },   // big tongue-out grin
  ];
  let lastGag = '';
  function show(gagId) {
    if (document.querySelector('.dog-show')) return;
    const choices = GAGS.filter((g) => g.id !== lastGag);
    const g = gagId ? GAGS.find((x) => x.id === gagId) : pick(choices);
    lastGag = g.id; lastShow = Date.now(); sinceLast = 0;
    const text = g.id === 'jump' ? T('achoo') : g.id === 'party' ? T('praise')[4] : T('woof');
    const el = h(`<div class="dog-show gag-${g.id}" aria-hidden="true">
      <div class="dog-wrap">${g.id === 'run' ? `<span class="dog-apple">${art('apple')}</span>` : ''}
        <img class="dog-img" src="assets/character/dog-${g.pose}.png" alt="" draggable="false">
        <span class="dog-say">${text}</span><span class="dog-name">${DOG_NAME}</span></div></div>`);
    document.body.appendChild(el);
    const sitting = document.querySelector('.screen:not(.screen-out) .home-dog');
    if (sitting) { sitting.style.visibility = 'hidden'; setTimeout(() => { sitting.style.visibility = ''; }, 3000); }
    // The guide announces him in the interface language; his name is always "Bacon".
    if (gagId !== 'quiet') { setGuide('cheer', T('hereDog')); Audio.say([T('hereDog')]); }
    setTimeout(() => Audio.sfx(g.sfx), g.id === 'jump' ? 500 : 250);
    if (g.id === 'run') setTimeout(() => Audio.sfx('woof'), 1300);
    setTimeout(() => el.remove(), g.id === 'run' ? 3000 : 2800);
  }
  /* After a correct answer: roughly one in four, never twice in a row, at least 12 s apart. */
  function maybe() {
    sinceLast++;
    if (Date.now() - lastShow < 12000 || sinceLast < 2) return;
    if (Math.random() < 0.28) { pending = true; later(() => show(), 1500); }
  }
  /* Extra pause the activity should leave so Bacon's moment is not cut short. */
  function extra() { const p = pending; pending = false; return p ? 1800 : 0; }
  return { show, maybe, extra, GAGS, force() { lastShow = 0; sinceLast = 5; } };
})();


/* ===== src/50-home.js ===== */
/* Lea Learns — the candy house in the clouds: character pick (also unlocks audio on iOS) and home. */
const WORLD = {
  land: { src: 'assets/world/home-landscape.jpg', w: 1280, h: 720, door: [0.405, 0.37, 0.492, 0.515] },
  port: { src: 'assets/world/home-portrait.jpg', w: 864, h: 1152, door: [0.325, 0.495, 0.48, 0.655] },
};
const isLandscape = () => innerWidth > innerHeight;

function worldLayer() {
  return h(`<div class="world-bg" aria-hidden="true">
    <img class="bg bg-land" src="${WORLD.land.src}" alt="" draggable="false">
    <img class="bg bg-port" src="${WORLD.port.src}" alt="" draggable="false">
    <div class="sparkles">${Array.from({ length: 10 }, (_, i) => `<i style="--x:${(i * 37) % 100}%;--y:${(i * 23) % 60}%;--d:${i * 0.4}s"></i>`).join('')}</div>
  </div>`);
}
/* Keep things that sit "on" the painting (the heart door) aligned with it after any resize or rotation. */
function placeOnWorld(screen) {
  const W = screen.clientWidth, H = screen.clientHeight; if (!W || !H) return;
  const im = W > H ? WORLD.land : WORLD.port;
  const s = Math.max(W / im.w, H / im.h), ox = (W - im.w * s) / 2, oy = (H - im.h * s) / 2;
  screen.querySelectorAll('[data-world]').forEach((el) => {
    const [x0, y0, x1, y1] = im[el.dataset.world];
    Object.assign(el.style, { left: `${ox + x0 * im.w * s}px`, top: `${oy + y0 * im.h * s}px`, width: `${(x1 - x0) * im.w * s}px`, height: `${(y1 - y0) * im.h * s}px` });
  });
}

const lolly = (cls, inner, label, swirl) => `<button class="lolly ${cls}" aria-label="${label}">
  <span class="lolly-disc" style="--sw:${swirl}">${inner}</span><span class="lolly-stick"></span><span class="lolly-label">${label}</span></button>`;

SCREENS.gate = () => {
  const cur = Store.settings.player;
  const el = h(`<section class="world gate">
    <header class="world-top"><h1 class="logo small"><span class="l1">Lea</span> <span class="l2">Learns</span></h1><div class="world-top-right"></div></header>
    <div class="gate-ask bubble">${T('whosPlaying')}</div>
    <div class="pickers">${Object.keys(NAMES).map((who, i) => `
      <button class="picker ${who === cur ? 'last' : ''}" data-who="${who}" style="--i:${i}" aria-label="${playerName(who)}">
        <span class="picker-lea">${leaImg('wave', '', who)}</span>
        <span class="picker-name">${playerName(who)}</span>
      </button>`).join('')}</div>
  </section>`);
  el.prepend(worldLayer());
  el.appendChild(parentCorner());
  $('.world-top-right', el).appendChild(langBar());
  $$('.picker', el).forEach((b) => onTap(b, () => {
    Audio.unlock();
    Audio.sfx('open');
    Store.set('player', b.dataset.who);
    b.classList.add('chosen'); el.classList.add('picked');
    $('img', b).src = poseSrc('jump', b.dataset.who);
    setTimeout(() => go('home', { hello: true }), 500);
  }, { sound: null }));
  el._layout = () => placeOnWorld(el);
  return el;
};

SCREENS.home = ({ hello } = {}) => {
  const d = Store.data;
  const other = Object.keys(NAMES).find((w) => w !== player());
  const el = h(`<section class="world home">
    <header class="world-top">
      <h1 class="logo small"><span class="l1">Lea</span> <span class="l2">Learns</span></h1>
      <div class="world-top-right"><div class="home-score"><div class="apples-chip">${art('apple')}<b>${d.apples}</b></div><div class="stars-chip">${ICON.star}<b>${d.stars}</b></div></div></div>
    </header>
    <button class="door" data-world="door" aria-label="${T('words')}"><span class="door-glow"></span></button>
    <div class="front">
      <div class="hero" data-who="${player()}">${leaImg('front', 'hero-lea')}<div class="bubble hero-bubble" hidden></div>
        <button class="swap" aria-label="${playerName(other)}">${leaImg('front', 'swap-img', other)}</button></div>
      <nav class="lollies">
        ${lolly('l-words', art('apple'), T('words'), '#ff6b81')}
        ${lolly('l-abc', '<b style="--c:#e53935">A</b><b style="--c:#1e88e5">B</b><b style="--c:#43a047">C</b>', T('abc'), '#b388ff')}
        ${lolly('l-num', '<b style="--c:#f4b400">1</b><b style="--c:#ec407a">2</b><b style="--c:#1e88e5">3</b>', T('numbers'), '#4dd0e1')}
      </nav>
    </div>
    <button class="home-dog" aria-label="Bacon" hidden><img src="assets/character/dog-front.png" alt="" draggable="false"></button>
  </section>`);
  el.prepend(worldLayer());
  el.appendChild(parentCorner());
  $('.world-top-right', el).prepend(langBar());
  const talk = (text, speech) => {
    const img = $('.hero-lea', el); const b = $('.hero-bubble', el);
    img.classList.remove('hop'); void img.offsetWidth; img.classList.add('hop');
    b.hidden = false; b.textContent = text; b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop');
    Audio.say(speech || text);
  };
  const open = (target, label, node) => { Audio.say(label === 'ABC' ? [EN('A, B, C!')] : label + '!'); node.classList.add('chosen'); setTimeout(() => go(target), 420); };
  onTap($('.l-words', el), (e) => open('words', T('words'), e.currentTarget || $('.l-words', el)), { sound: 'open' });
  onTap($('.l-abc', el), () => open('abc', 'ABC', $('.l-abc', el)), { sound: 'open' });
  onTap($('.l-num', el), () => open('numbers', T('numbers'), $('.l-num', el)), { sound: 'open' });
  onTap($('.door', el), () => open('words', T('words'), $('.door', el)), { sound: 'open' });
  onTap($('.hero-lea', el), () => { const t = pick([T('hi', playerName()), T('hello'), T('letsPlay'), T('loveApples')]); talk(t, t.replace(playerName(), playerSay())); }, { sound: 'pop' });
  onTap($('.swap', el), () => { Store.set('player', other); go('home', { hello: true }); }, { sound: 'open' });
  const dog = $('.home-dog', el);
  onTap(dog, () => Dog.show(), { sound: null });
  el._layout = () => placeOnWorld(el);
  el._enter = () => {
    placeOnWorld(el);
    hello ? talk(T('hi', playerName()), [T('hi', playerSay()), T('whatPlay')]) : talk(T('whatPlay'));
    // Sometimes the dog is already sitting on the cloud; sometimes he bursts in a bit later.
    if (Math.random() < 0.45) later(() => { dog.hidden = false; dog.classList.add('in'); }, 2200);
    if (Math.random() < 0.3) later(() => Dog.show(), 9000);
  };
  return el;
};


/* ===== src/60-words.js ===== */
/* Lea Learns — Words. Montessori three-period lesson: 1 Look ("This is…"), 2 Find ("Show me…"), 3 Say ("What is this?"). */
const catName = (c) => T(c.id);
const isColour = (k) => k.startsWith('colour:');

SCREENS.words = () => {
  const el = h(`<section class="activity words-home"></section>`);
  el.appendChild(topBar({ back: 'home', title: T('words'), icon: 'apple', colour: 'var(--red)' }));
  const stage = h(`<main class="stage"><div class="cat-grid"></div></main>`);
  CATEGORIES.forEach((c) => {
    const t = h(`<button class="cat-tile" style="--c:${c.colour}" data-cat="${c.id}" aria-label="${catName(c)}">
      <span class="cat-art">${c.id === 'colours' ? `<span class="swatches">${['red', 'yellow', 'blue', 'green'].map((k) => art('colour:' + k)).join('')}</span>` : art(c.icon)}</span>
      <span class="cat-name">${catName(c)}</span>${Store.data.played['words:' + c.id] ? `<span class="tile-star">${ICON.star}</span>` : ''}</button>`);
    onTap(t, () => { Audio.say(catName(c)); go('category', { id: c.id }); }, { sound: 'open' });
    stage.firstElementChild.appendChild(t);
  });
  el.appendChild(stage);
  el.appendChild(guide('point', T('pickOne')));
  el._enter = () => Audio.say(T('pickOne'));
  return el;
};

function modeSwitch(active, tabs) {
  const s = h(`<div class="mode-switch n${tabs.length}" role="tablist">${tabs.map((t, i) => `
    <button class="ms ms-${t.id} ${active === t.id ? 'on' : ''}" role="tab" data-tab="${t.id}" aria-label="${t.label}"><span class="ms-n">${i + 1}</span>${t.icon}<span>${t.label}</span></button>`).join('')}</div>`);
  tabs.forEach((t) => onTap($(`[data-tab="${t.id}"]`, s), () => active !== t.id && t.go(), { sound: 'pop' }));
  return s;
}
const ICON_SAY = '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M8 10 H40 A4 4 0 0 1 44 14 V30 A4 4 0 0 1 40 34 H22 L12 42 V34 H8 A4 4 0 0 1 4 30 V14 A4 4 0 0 1 8 10 Z" fill="#fff" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/><circle cx="16" cy="22" r="3" fill="currentColor"/><circle cx="24" cy="22" r="3" fill="currentColor"/><circle cx="32" cy="22" r="3" fill="currentColor"/></svg>';
const ICON_PEN = '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M10 38 L14 28 L32 10 L38 16 L20 34 Z" fill="#fff" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/><path d="M8 42 C16 40 24 44 40 40" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"/></svg>';
const lessonTabs = (goTo) => [
  { id: 'look', label: T('look'), icon: ICON.eye, go: () => goTo('look') },
  { id: 'find', label: T('find'), icon: ICON.star, go: () => goTo('find') },
  { id: 'say', label: T('sayIt'), icon: ICON_SAY, go: () => goTo('say') },
];

/* Big picture spotlight used by Words and ABC. */
function spotlight({ key, title, sub, extra, speech, prev, next, pose = 'point', cls = '' }) {
  closeOverlays();
  const o = h(`<div class="overlay spot ${cls}" role="dialog">
    <div class="spot-card">
      <button class="round-btn spot-close" aria-label="Close">${ICON.close}</button>
      <div class="spot-main">
        ${key ? `<div class="spot-art">${art(key)}</div>` : ''}
        <div class="spot-text"><div class="spot-word">${title}</div>${sub ? `<div class="spot-sub">${sub}</div>` : ''}</div>
      </div>
      ${extra || ''}
      <div class="spot-nav">
        ${prev ? `<button class="round-btn spot-prev" aria-label="Previous">${ICON.back}</button>` : ''}
        <button class="round-btn spot-say" aria-label="Again">${ICON.speaker}</button>
        ${next ? `<button class="round-btn spot-next" aria-label="Next">${ICON.next}</button>` : ''}
      </div>
      <div class="spot-lea">${leaImg(pose)}</div>
    </div></div>`);
  document.body.appendChild(o);
  const speak = () => { const a = $('.spot-art, .spot-word', o); a.classList.remove('boing'); void a.offsetWidth; a.classList.add('boing'); Audio.say(speech); };
  onTap($('.spot-say', o), speak, { sound: null });
  const a = $('.spot-art', o); if (a) onTap(a, speak, { sound: 'pop' });
  onTap($('.spot-close', o), () => { Audio.hush(); o.classList.add('closing'); setTimeout(() => o.remove(), 200); }, { sound: 'whoosh' });
  o.addEventListener('pointerup', (e) => { if (e.target === o) { Audio.hush(); o.remove(); } });
  if (prev) onTap($('.spot-prev', o), prev, { sound: 'whoosh' });
  if (next) onTap($('.spot-next', o), next, { sound: 'whoosh' });
  Audio.sfx('sparkle');
  speak();
  return o;
}

const wordTitle = (k) => { const w = word(k); return `<span class="first">${w[0]}</span>${w.slice(1)}`; };

SCREENS.category = ({ id, mode = 'look' }) => {
  const cat = CATEGORIES.find((c) => c.id === id);
  const el = h(`<section class="activity category" style="--c:${cat.colour}"></section>`);
  el.appendChild(topBar({ back: 'words', title: catName(cat), icon: cat.id === 'colours' ? 'colour:red' : cat.icon, colour: cat.colour }));
  const stage = h(`<main class="stage"></main>`);
  el.appendChild(stage);
  el.appendChild(guide(mode === 'look' ? 'point' : 'think', mode === 'look' ? T('tapPicture') : ''));
  stage.appendChild(modeSwitch(mode, lessonTabs((m) => go('category', { id, mode: m }))));
  if (mode === 'look') {
    const grid = h(`<div class="word-grid scroll"></div>`);
    const items = cat.items;
    const open = (i) => {
      const k = items[i];
      Store.seeWord(k);
      grid.children[i].classList.add('seen');
      spotlight({ key: k, title: wordTitle(k), speech: [T('thisIs'), EN(spoken(k))], cls: isColour(k) ? 'is-colour' : '',
        prev: () => open((i - 1 + items.length) % items.length), next: () => open((i + 1) % items.length) });
      setGuide('point', `${T('thisIs')} ${word(k)}`);
    };
    items.forEach((k, i) => {
      const c = h(`<button class="word-card ${Store.data.seenWords[k] ? 'seen' : ''}" data-key="${k}" aria-label="${word(k)}"><span class="wc-art">${art(k)}</span><span class="wc-word">${word(k)}</span></button>`);
      onTap(c, () => open(i), { sound: 'pop' });
      grid.appendChild(c);
    });
    stage.appendChild(grid);
    el._enter = () => Audio.say(cat.id === 'food' ? [T('tapPicture'), T('loveApples')] : [T('tapPicture')]);
  } else if (mode === 'find') wordQuiz(el, stage, cat);
  else wordSay(el, stage, cat);
  return el;
};

function wordQuiz(el, stage, cat) {
  const ROUND = 5;
  const stars = starsRow(ROUND);
  const prompt = h(`<button class="prompt" aria-label="Again"><span class="prompt-say">${ICON.speaker}</span><span class="prompt-word"></span></button>`);
  const area = h(`<div class="quiz-area"></div>`);
  stage.append(stars, prompt, area);
  let order = shuffle(cat.items);
  if (cat.id === 'food') order = ['apple', ...order.filter((k) => k !== 'apple')]; // her favourite first
  const targets = order.slice(0, ROUND);
  let q = 0;
  const ask = (k) => [T('showMe'), EN(spoken(k))];
  const next = () => {
    if (q >= ROUND) { Store.played('words:' + cat.id); return roundEnd({ stars: ROUND, onAgain: () => go('category', { id: cat.id, mode: 'find' }), onHome: () => go('words') }); }
    const target = targets[q];
    const opts = shuffle([target, ...shuffle(cat.items.filter((k) => k !== target && word(k) !== word(target))).slice(0, 2)]);
    area.innerHTML = ''; area.dataset.answer = target;
    $('.prompt-word', prompt).innerHTML = `${T('showMe')}: <b lang="en">${word(target)}</b>`;
    prompt.classList.remove('pop'); void prompt.offsetWidth; prompt.classList.add('pop');
    setGuide('think', `${T('showMe')}: ${word(target)}`);
    Audio.say(ask(target));
    runChoice({
      stage: area, choices: opts.map((k) => ({ key: k })),
      render: (c) => `<span class="ch-art">${art(c.key)}</span>`,
      isRight: (c) => c.key === target,
      onRight: () => {
        App.busy = true; fillStar(stars, q);
        const praise = tPick('praise');
        celebrate({ text: praise });
        setGuide(pick(['jump', 'cheer']), `${praise} ${word(target)}!`);
        Audio.say([praise, EN(spoken(target))]);
        q++; later(() => { App.busy = false; next(); }, 2300 + Dog.extra());
      },
      onMiss: (c) => {
        const enc = tPick('encourage');
        setGuide('wave', enc, 'wiggle');
        Audio.say([T('thatIs'), EN(spoken(c.key)), enc, ...ask(target)]);
      },
    });
  };
  onTap(prompt, () => { const t = area.dataset.answer; if (t) Audio.say(ask(t)); }, { sound: null });
  el._enter = next;
}

/* Period 3: the child names the picture out loud, then taps to hear it — the control of error is hers. */
function wordSay(el, stage, cat) {
  const items = shuffle(cat.items);
  let i = 0;
  const box = h(`<div class="say-box"><button class="say-card" aria-label="${T('whatIs')}"><span class="say-art"></span><span class="say-word" hidden></span><span class="say-hear">${ICON.speaker}</span></button>
    <button class="round-btn say-next" aria-label="Next">${ICON.next}</button></div>`);
  stage.appendChild(box);
  const show = () => {
    const k = items[i % items.length];
    $('.say-art', box).innerHTML = art(k); const w = $('.say-word', box); w.hidden = true; w.innerHTML = wordTitle(k);
    box.dataset.key = k; $('.say-card', box).classList.remove('revealed');
    setGuide('think', `${T('whatIs')} ${T('sayThenTap')}`);
    Audio.say([T('whatIs')]);
  };
  onTap($('.say-card', box), () => {
    const k = box.dataset.key; $('.say-word', box).hidden = false; $('.say-card', box).classList.add('revealed');
    Store.seeWord(k); Audio.sfx('sparkle'); setGuide('cheer', `${word(k)}!`);
    Audio.say([EN(spoken(k))]);
  }, { sound: 'pop' });
  onTap($('.say-next', box), () => { i++; show(); if (i % 4 === 0) Dog.maybe(); }, { sound: 'whoosh' });
  el._enter = show;
}


/* ===== src/70-abc.js ===== */
/* Lea Learns — ABC. Montessori order: the sound first, then the letter, then real words; Find (period 2) and sandpaper-style Trace. */
const letterColour = (i) => LETTER_COLOURS[i % LETTER_COLOURS.length];
const letterWords = (L) => LETTER_WORDS[L.l] || [L.pic];
const letterSpeech = (L) => {
  const parts = [];
  if (!SOUND_VIA_WORD.has(L.sound)) parts.push(EN(`${L.sound}, ${L.sound}.`));
  parts.push(T('thisLetter'), EN(L.l + '.'));
  letterWords(L).forEach((k) => parts.push(EN(spoken(k))));
  return parts;
};
const abcTabs = (goTo) => [
  { id: 'look', label: T('look'), icon: ICON.eye, go: () => goTo('look') },
  { id: 'find', label: T('find'), icon: ICON.star, go: () => goTo('find') },
  { id: 'trace', label: T('trace'), icon: ICON_PEN, go: () => goTo('trace') },
];

SCREENS.abc = ({ mode = 'look', i = 0 } = {}) => {
  const el = h(`<section class="activity abc" style="--c:var(--purple)"></section>`);
  el.appendChild(topBar({ back: 'home', title: 'ABC', colour: 'var(--purple)' }));
  const stage = h(`<main class="stage"></main>`);
  el.appendChild(stage);
  el.appendChild(guide(mode === 'find' ? 'think' : 'point', mode === 'look' ? T('tapLetter') : ''));
  stage.appendChild(modeSwitch(mode, abcTabs((m) => go('abc', { mode: m }))));
  if (mode === 'look') {
    const grid = h(`<div class="letter-grid scroll"></div>`);
    const open = (i) => {
      const L = ALPHABET[i];
      Store.seeLetter(L.l); grid.children[i].classList.add('seen');
      const words = letterWords(L);
      const o = spotlight({
        cls: 'letter-spot',
        title: `<span class="big-letter sandpaper" style="--c:${letterColour(i)}">${L.l}<small>${L.l.toLowerCase()}</small></span>`,
        extra: `<div class="letter-words n${words.length}">${words.map((k) => `<button class="lw" data-key="${k}" aria-label="${word(k)}">${art(k)}<span><b style="color:${letterColour(i)}">${word(k)[0]}</b>${word(k).slice(1)}</span></button>`).join('')}</div>`,
        speech: letterSpeech(L), prev: () => open((i + 25) % 26), next: () => open((i + 1) % 26),
      });
      $$('.lw', o).forEach((b) => onTap(b, () => { b.classList.remove('boing'); void b.offsetWidth; b.classList.add('boing'); Audio.say([EN(spoken(b.dataset.key))]); }, { sound: 'pop' }));
      setGuide('point', `${L.l} ${L.l.toLowerCase()}`);
    };
    ALPHABET.forEach((L, i) => {
      const b = h(`<button class="letter-tile ${Store.data.seenLetters[L.l] ? 'seen' : ''}" style="--c:${letterColour(i)}" data-letter="${L.l}" aria-label="${L.l}">${L.l}<small>${L.l.toLowerCase()}</small></button>`);
      onTap(b, () => open(i), { sound: 'pop' });
      grid.appendChild(b);
    });
    stage.appendChild(grid);
    el._enter = () => Audio.say(T('tapLetter'));
  } else if (mode === 'find') letterHunt(el, stage);
  else traceView(el, stage, i);
  return el;
};

function letterHunt(el, stage) {
  const ROUND = 5;
  const stars = starsRow(ROUND);
  const prompt = h(`<button class="prompt" aria-label="Again"><span class="prompt-say">${ICON.speaker}</span><span class="prompt-word"></span></button>`);
  const area = h(`<div class="quiz-area"></div>`);
  stage.append(stars, prompt, area);
  const targets = shuffle(ALPHABET).slice(0, ROUND);
  let q = 0;
  const ask = (L) => [T('showMe'), T('theLetter'), EN(L.l)];
  const next = () => {
    if (q >= ROUND) { Store.played('abc'); return roundEnd({ stars: ROUND, onAgain: () => go('abc', { mode: 'find' }), onHome: () => go('home') }); }
    const Tg = targets[q];
    const opts = shuffle([Tg, ...shuffle(ALPHABET.filter((L) => L.l !== Tg.l)).slice(0, 2)]);
    area.innerHTML = ''; area.dataset.answer = Tg.l;
    $('.prompt-word', prompt).innerHTML = `${T('showMe')}: <b>${Tg.l}</b>`;
    prompt.classList.remove('pop'); void prompt.offsetWidth; prompt.classList.add('pop');
    setGuide('think', `${T('showMe')}: ${Tg.l}`);
    Audio.say(ask(Tg));
    runChoice({
      stage: area, cls: 'letters', choices: opts.map((L) => ({ key: L.l, L })),
      render: (c) => `<span class="ch-letter" style="--c:${letterColour(ALPHABET.indexOf(c.L))}">${c.L.l}<small>${c.L.l.toLowerCase()}</small></span>`,
      isRight: (c) => c.key === Tg.l,
      onRight: () => {
        App.busy = true; fillStar(stars, q);
        const praise = tPick('praise');
        celebrate({ text: `${Tg.l}!` });
        setGuide(pick(['jump', 'cheer']), `${praise} ${Tg.l} – ${word(letterWords(Tg)[0])}`);
        const r = $('.choice.right', area);
        if (r) r.insertAdjacentHTML('beforeend', `<span class="ch-pic">${art(letterWords(Tg)[0])}</span>`);
        Audio.say([praise, EN(Tg.l), EN(spoken(letterWords(Tg)[0]))]);
        q++; later(() => { App.busy = false; next(); }, 2600 + Dog.extra());
      },
      onMiss: (c) => { const enc = tPick('encourage'); setGuide('wave', enc, 'wiggle'); Audio.say([T('thatIs'), EN(c.key), enc, ...ask(Tg)]); },
    });
  };
  onTap(prompt, () => { const t = ALPHABET.find((L) => L.l === area.dataset.answer); if (t) Audio.say(ask(t)); }, { sound: null });
  el._enter = next;
}

/* Sandpaper-letter tracing: fat finger strokes, only the paint inside the letter counts, survives rotation. */
function traceView(el, stage, start) {
  let idx = start, strokes = [], targets = [], covered = new Set(), done = false, size = 0, W = 0, H = 0, dpr = 1;
  const wrap = h(`<div class="trace-wrap">
    <button class="round-btn tr-prev" aria-label="Previous">${ICON.back}</button>
    <div class="trace-box"><canvas class="trace-canvas" aria-label="Trace"></canvas><div class="trace-meter"><i></i></div></div>
    <button class="round-btn tr-next" aria-label="Next">${ICON.next}</button>
    <div class="trace-tools"><button class="round-btn tr-again" aria-label="Again">${ICON.again}</button><button class="round-btn tr-say" aria-label="Sound">${ICON.speaker}</button></div>
  </div>`);
  stage.appendChild(wrap);
  const cv = $('canvas', wrap), ctx = cv.getContext('2d');
  const mask = document.createElement('canvas'), mctx = mask.getContext('2d');
  const paint = document.createElement('canvas'), pctx = paint.getContext('2d');
  let grain = null;
  const L = () => ALPHABET[idx];
  const text = () => L().l + L().l.toLowerCase();

  function makeGrain() {
    const g = document.createElement('canvas'); g.width = g.height = 64; const c = g.getContext('2d');
    c.fillStyle = '#f3dcc0'; c.fillRect(0, 0, 64, 64);
    for (let i = 0; i < 520; i++) { c.fillStyle = Math.random() < 0.5 ? 'rgba(160,110,70,.35)' : 'rgba(255,255,255,.55)'; c.fillRect(Math.random() * 64, Math.random() * 64, 1.6, 1.6); }
    return ctx.createPattern(g, 'repeat');
  }
  function setup() {
    const box = $('.trace-box', wrap).getBoundingClientRect();
    if (!box.width || !box.height) return;
    dpr = Math.min(2, devicePixelRatio || 1); W = box.width; H = box.height;
    for (const c of [cv, mask, paint]) { c.width = Math.round(W * dpr); c.height = Math.round(H * dpr); }
    cv.style.width = W + 'px'; cv.style.height = H + 'px';
    [ctx, mctx, pctx].forEach((c) => c.setTransform(dpr, 0, 0, dpr, 0, 0));
    size = Math.min(H * 0.86, W / 1.45);
    mctx.clearRect(0, 0, W, H); mctx.fillStyle = '#000'; mctx.textAlign = 'center'; mctx.textBaseline = 'alphabetic';
    mctx.font = `600 ${size}px LeaFont, Fredoka, sans-serif`;
    mctx.fillText(text(), W / 2, H / 2 + size * 0.36);
    // sample target points inside the letters
    const step = Math.max(6, Math.round(size / 26)), data = mctx.getImageData(0, 0, mask.width, mask.height).data;
    targets = [];
    for (let y = step / 2; y < H; y += step) for (let x = step / 2; x < W; x += step) { const i = (Math.round(y * dpr) * mask.width + Math.round(x * dpr)) * 4 + 3; if (data[i] > 128) targets.push([x, y]); }
    grain = makeGrain();
    covered = new Set(); replay(); draw();
  }
  const radius = () => Math.max(16, size * 0.085);
  function stamp(a, b) {
    pctx.strokeStyle = letterColour(idx); pctx.lineCap = pctx.lineJoin = 'round'; pctx.lineWidth = radius() * 2;
    pctx.beginPath(); pctx.moveTo(a[0], a[1]); pctx.lineTo(b[0], b[1]); pctx.stroke();
    const r2 = radius() * radius();
    targets.forEach((t, i) => { if (covered.has(i)) return; const dx = b[0] - a[0], dy = b[1] - a[1], len = dx * dx + dy * dy || 1; let u = ((t[0] - a[0]) * dx + (t[1] - a[1]) * dy) / len; u = Math.max(0, Math.min(1, u)); const px = a[0] + u * dx - t[0], py = a[1] + u * dy - t[1]; if (px * px + py * py <= r2) covered.add(i); });
  }
  function replay() { pctx.clearRect(0, 0, W, H); strokes.forEach((s) => { const pts = s.map(([x, y]) => [x * W, y * H]); for (let i = 0; i < pts.length; i++) stamp(pts[Math.max(0, i - 1)], pts[i]); }); }
  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.save(); ctx.drawImage(mask, 0, 0, W, H); ctx.globalCompositeOperation = 'source-in'; ctx.fillStyle = grain; ctx.fillRect(0, 0, W, H); ctx.restore();
    ctx.save(); ctx.globalCompositeOperation = 'source-atop'; ctx.drawImage(paint, 0, 0, W, H); ctx.restore();
    // soft outline so the shape is clear
    ctx.save(); ctx.font = mctx.font; ctx.textAlign = 'center'; ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(120,70,40,.35)'; ctx.strokeText(text(), W / 2, H / 2 + size * 0.36); ctx.restore();
    const pct = targets.length ? covered.size / targets.length : 0;
    $('.trace-meter i', wrap).style.width = Math.min(100, Math.round(pct / 0.75 * 100)) + '%';
    return pct;
  }
  let cur = null;
  const pos = (e) => { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  cv.addEventListener('pointerdown', (e) => { if (done) return; cv.setPointerCapture(e.pointerId); const p = pos(e); cur = [[p[0] / W, p[1] / H]]; strokes.push(cur); stamp(p, p); draw(); Audio.sfx('tap'); });
  cv.addEventListener('pointermove', (e) => {
    if (!cur || done) return; const p = pos(e), last = cur[cur.length - 1];
    cur.push([p[0] / W, p[1] / H]); stamp([last[0] * W, last[1] * H], p);
    if (draw() >= 0.75) finish();
  });
  const end = () => { if (cur && !done) { const pct = draw(); if (pct < 0.75 && pct > 0.15) setGuide('point', T('keepGoing')); } cur = null; };
  cv.addEventListener('pointerup', end); cv.addEventListener('pointercancel', end);
  function finish() {
    done = true; cur = null; Store.seeLetter(L().l); Store.addApple(); refreshApples();
    const praise = tPick('praise');
    celebrate({ text: L().l + L().l.toLowerCase() });
    setGuide(pick(['jump', 'cheer']), praise);
    Audio.say([praise, ...letterSpeech(L()).slice(0, SOUND_VIA_WORD.has(L().sound) ? 0 : 1), EN(L().l)]);
    Dog.maybe();
    later(() => load(idx + 1), 3000 + Dog.extra());
  }
  function load(i) {
    idx = (i + 26) % 26; strokes = []; done = false;
    setup();
    setGuide('point', `${T('traceHint')}`);
    Audio.say([T('traceHint'), ...(SOUND_VIA_WORD.has(L().sound) ? [] : [EN(`${L().sound}.`)]), EN(L().l)]);
  }
  onTap($('.tr-prev', wrap), () => load(idx - 1), { sound: 'whoosh' });
  onTap($('.tr-next', wrap), () => load(idx + 1), { sound: 'whoosh' });
  onTap($('.tr-again', wrap), () => { strokes = []; done = false; setup(); }, { sound: 'pop' });
  onTap($('.tr-say', wrap), () => Audio.say(letterSpeech(L())), { sound: null });
  el._layout = () => { if (W) setup(); };
  el._enter = async () => { try { await document.fonts.load('600 100px LeaFont'); } catch (e) {} load(idx); };
  el._trace = { get pct() { return targets.length ? covered.size / targets.length : 0; }, get targets() { return targets.length; }, get letter() { return L().l; } };
}


/* ===== src/80-numbers.js ===== */
/* Lea Learns — Numbers (1–20 by default, 1–30 in the parent corner). Concrete first: real objects, grouped in
   Montessori-style ten-frames above ten; the numeral comes after the quantity. Number words are English. */
const RANGE = () => (Store.settings.range === 30 ? 30 : 20);
const dots = (n) => (n <= 10 ? `<span class="dots d${n}">${Array.from({ length: n }, () => '<i></i>').join('')}</span>` : '');
const things = (t, n) => EN(`${NUMBER_WORDS[n]} ${n === 1 ? t.one : t.many}`);
const numColour = (k) => LETTER_COLOURS[(k - 1) % LETTER_COLOURS.length];

/* n objects; up to 10 as a loose friendly group, above 10 as full ten-frames + the rest. */
function objectPile(t, n, { countable = true, away = 0 } = {}) {
  const pile = h(`<div class="pile ${n > 10 ? 'framed' : 'n' + n}"></div>`);
  let counted = 0;
  const mk = (i) => {
    const o = h(`<button class="obj ${i >= n - away ? 'away' : ''}" style="--i:${Math.min(i, 10)}" aria-label="${t.one}" tabindex="-1">${art(t.k)}<span class="obj-n"></span></button>`);
    if (countable) onTap(o, () => {
      if (o.classList.contains('counted') || o.classList.contains('gone')) { o.classList.remove('wig'); void o.offsetWidth; o.classList.add('wig'); return; }
      counted++; o.classList.add('counted'); $('.obj-n', o).textContent = counted;
      Audio.sfx('count', Math.min(counted, 12)); Audio.say([EN(NUMBER_WORDS[counted])]);
    }, { sound: null });
    return o;
  };
  if (n <= 10) { for (let i = 0; i < n; i++) pile.appendChild(mk(i)); return pile; }
  for (let f = 0; f * 10 < n; f++) {
    const fr = h(`<div class="frame ${Math.min(10, n - f * 10) === 10 ? 'full' : ''}"></div>`);
    for (let j = 0; j < 10; j++) { const i = f * 10 + j; fr.appendChild(i < n ? mk(i) : h('<span class="slot"></span>')); }
    pile.appendChild(fr);
  }
  return pile;
}
/* Light up objects one by one while counting (by tens above ten, Montessori style). */
async function countAlong(pile, n, token, isLive) {
  const objs = $$('.obj', pile);
  objs.forEach((o) => { o.classList.remove('counted'); $('.obj-n', o).textContent = ''; });
  const parts = [];
  if (n <= 10) {
    for (let i = 1; i <= n; i++) parts.push(EN(NUMBER_WORDS[i]));
    Audio.say(parts, { rate: 0.95 });
    for (let i = 0; i < n; i++) { await sleep(i ? 640 : 250); if (!isLive(token)) return; objs[i].classList.add('counted'); $('.obj-n', objs[i]).textContent = i + 1; Audio.sfx('count', i + 1); }
    return;
  }
  const tens = Math.floor(n / 10);
  for (let f = 1; f <= tens; f++) parts.push(EN(NUMBER_WORDS[f * 10]));
  for (let i = tens * 10 + 1; i <= n; i++) parts.push(EN(NUMBER_WORDS[i]));
  Audio.say(parts, { rate: 0.95 });
  const frames = $$('.frame', pile);
  for (let f = 0; f < tens; f++) { await sleep(f ? 800 : 250); if (!isLive(token)) return; frames[f].classList.add('lit'); $$('.obj', frames[f]).forEach((o) => o.classList.add('counted')); $('.obj-n', $$('.obj', frames[f])[9]).textContent = (f + 1) * 10; Audio.sfx('count', f * 3 + 1); }
  for (let i = tens * 10; i < n; i++) { await sleep(800); if (!isLive(token)) return; objs[i].classList.add('counted'); $('.obj-n', objs[i]).textContent = i + 1; Audio.sfx('count', i - tens * 10 + 4); }
}

SCREENS.numbers = () => {
  const el = h(`<section class="activity numbers-home" style="--c:var(--green)"></section>`);
  el.appendChild(topBar({ back: 'home', title: T('numbers'), colour: 'var(--green)' }));
  const stage = h(`<main class="stage"><div class="num-modes"></div></main>`);
  const tiles = [
    { go: 'count', name: T('count'), html: `<span class="nm-pics"><b>1</b><b>2</b><b>3</b></span>`, say: T('letsCount') },
    { go: 'howmany', name: T('howMany'), html: `<span class="nm-pics apples3">${art('apple')}${art('apple')}${art('apple')}<b class="q">?</b></span>`, say: T('howMany') },
    { go: 'sums', name: '+  −', html: `<span class="nm-pics sums">${art('apple')}<b>+</b>${art('apple')}</span>`, say: '' },
  ];
  tiles.forEach((t) => {
    const b = h(`<button class="num-tile" data-go="${t.go}" aria-label="${t.name}">${t.html}<span class="cat-name">${t.name}</span>${Store.data.played['num:' + t.go] ? `<span class="tile-star">${ICON.star}</span>` : ''}</button>`);
    onTap(b, () => { if (t.say) Audio.say(t.say); go(t.go); }, { sound: 'open' });
    stage.firstElementChild.appendChild(b);
  });
  el.appendChild(stage);
  el.appendChild(guide('sit', `${T('letsCount')} 1–${RANGE()}`));
  el._enter = () => Audio.say(T('letsCount'));
  return el;
};

SCREENS.count = ({ n = 1 } = {}) => {
  const max = RANGE();
  const el = h(`<section class="activity count" style="--c:var(--green)"></section>`);
  el.appendChild(topBar({ back: 'numbers', title: T('count'), colour: 'var(--green)' }));
  const stage = h(`<main class="stage count-stage"></main>`);
  const show = h(`<div class="count-show"><button class="round-btn cs-prev" aria-label="Fewer">${ICON.back}</button><div class="cs-main"><div class="cs-num"></div><div class="cs-pile"></div></div><button class="round-btn cs-next" aria-label="More">${ICON.next}</button></div>`);
  const strip = h(`<div class="num-strip scroll r${max}"></div>`);
  stage.append(show, strip);
  el.appendChild(stage);
  el.appendChild(guide('sit', ''));
  let cur = Math.min(Math.max(1, n), max), token = 0;
  const display = async (k) => {
    cur = k; const my = ++token;
    $$('.num-btn', strip).forEach((b) => b.classList.toggle('on', +b.dataset.n === k));
    const on = $(`.num-btn[data-n="${k}"]`, strip); if (on && on.scrollIntoView) on.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    const num = $('.cs-num', show); num.textContent = k; num.style.setProperty('--c', numColour(k));
    num.classList.remove('boing'); void num.offsetWidth; num.classList.add('boing');
    const t = COUNT_THINGS[(k - 1) % COUNT_THINGS.length];
    const pile = objectPile(t, k, { countable: false });
    $('.cs-pile', show).replaceChildren(pile);
    setGuide('sit', String(k));
    await countAlong(pile, k, my, (x) => x === token && document.body.contains(pile));
    if (my === token && document.body.contains(pile)) { setGuide('cheer', `${k}!`); Audio.sfx('sparkle'); Audio.say([things(t, k)]); }
  };
  for (let k = 1; k <= max; k++) {
    const b = h(`<button class="num-btn" data-n="${k}" style="--c:${numColour(k)}" aria-label="${k}">${k}</button>`);
    onTap(b, () => display(k), { sound: 'pop' });
    strip.appendChild(b);
  }
  onTap($('.cs-prev', show), () => display(cur > 1 ? cur - 1 : max), { sound: 'whoosh' });
  onTap($('.cs-next', show), () => display(cur < max ? cur + 1 : 1), { sound: 'whoosh' });
  el._enter = () => display(cur);
  return el;
};

function numberChoices(answer, max) {
  const spread = answer > 10 ? 4 : 3, pool = [];
  for (let k = Math.max(1, answer - spread); k <= Math.min(max, answer + spread); k++) if (k !== answer) pool.push(k);
  return shuffle([answer, ...shuffle(pool).slice(0, 2)]);
}
const numRender = (c) => `<span class="ch-num" style="--c:${numColour(c.key + 3)}">${c.key}</span>${dots(c.key)}`;
const randInt = (a, b) => a + Math.floor(Math.random() * (b - a + 1));

SCREENS.howmany = () => {
  const max = RANGE();
  const el = h(`<section class="activity howmany" style="--c:var(--green)"></section>`);
  el.appendChild(topBar({ back: 'numbers', title: T('howMany'), colour: 'var(--green)' }));
  const stage = h(`<main class="stage"></main>`);
  const ROUND = 5;
  const stars = starsRow(ROUND);
  const prompt = h(`<button class="prompt" aria-label="Again"><span class="prompt-say">${ICON.speaker}</span><span class="prompt-word">${T('howMany')}</span></button>`);
  const scene = h(`<div class="scene"></div>`);
  const area = h(`<div class="quiz-area nums"></div>`);
  stage.append(stars, prompt, scene, area);
  el.appendChild(stage);
  el.appendChild(guide('sit', ''));
  // Mostly small, friendly amounts, with some bigger ones up to the chosen range.
  const bands = [[1, 5], [3, 10], [1, 5], [6, 10], [11, max]];
  const qs = shuffle(bands).map(([a, b]) => randInt(a, b));
  let q = 0, ask = [];
  onTap(prompt, () => Audio.say(ask), { sound: null });
  const next = () => {
    if (q >= ROUND) { Store.played('num:howmany'); return roundEnd({ stars: ROUND, onAgain: () => go('howmany'), onHome: () => go('numbers') }); }
    const n = qs[q], t = COUNT_THINGS[randInt(0, COUNT_THINGS.length - 1)];
    scene.replaceChildren(objectPile(t, n));
    scene.className = 'scene ' + (n > 10 ? 'big' : '');
    area.innerHTML = ''; area.dataset.answer = n;
    ask = [T('howMany'), EN(t.many)];
    setGuide('sit', T('tapCount'));
    Audio.say(ask);
    runChoice({
      stage: area, cls: 'nums', choices: numberChoices(n, max).map((k) => ({ key: k })), render: numRender,
      isRight: (c) => c.key === n,
      onRight: () => {
        App.busy = true; fillStar(stars, q);
        const praise = tPick('praise');
        celebrate({ text: String(n) });
        setGuide(pick(['jump', 'cheer']), `${praise} ${n}!`);
        Audio.say([praise, things(t, n)]);
        const pile = $('.pile', scene); const objs = $$('.obj', pile);
        objs.forEach((o, i) => setTimeout(() => { o.classList.add('counted'); $('.obj-n', o).textContent = i + 1; }, 200 + i * Math.min(160, 2000 / n)));
        q++; later(() => { App.busy = false; next(); }, 2900 + Dog.extra());
      },
      onMiss: () => { const enc = tPick('encourage'); setGuide('wave', `${enc} ${T('tapCount')}`, 'wiggle'); Audio.say([enc, T('countTogether')]); },
    });
  };
  el._enter = next;
  return el;
};

SCREENS.sums = () => {
  const max = RANGE();
  const el = h(`<section class="activity sums" style="--c:var(--green)"></section>`);
  el.appendChild(topBar({ back: 'numbers', title: '+  −', colour: 'var(--green)' }));
  const stage = h(`<main class="stage"></main>`);
  const ROUND = 5;
  const stars = starsRow(ROUND);
  const prompt = h(`<button class="prompt" aria-label="Again"><span class="prompt-say">${ICON.speaker}</span><span class="prompt-word"></span></button>`);
  const scene = h(`<div class="scene sum-scene"></div>`);
  const area = h(`<div class="quiz-area nums"></div>`);
  stage.append(stars, prompt, scene, area);
  el.appendChild(stage);
  el.appendChild(guide('think', ''));
  // Small sums first, then bigger ones (groups stay ≤ 10 each, or ≤ 20 + ≤ 10 with the 1–30 range).
  const add = (big) => { if (!big) { const tot = randInt(2, 6); const a = randInt(1, tot - 1); return { op: '+', a, b: tot - a }; } const a = randInt(5, max === 30 ? 20 : 10), b = randInt(2, Math.min(10, max - a)); return { op: '+', a, b }; };
  const sub = (big) => { const a = big ? randInt(8, Math.min(max, 15)) : randInt(3, 6); const b = randInt(1, Math.min(big ? 5 : 3, a - 1)); return { op: '−', a, b }; };
  const qs = [add(false), add(false), sub(false), add(true), sub(true)].map((s) => ({ ...s, ans: s.op === '+' ? s.a + s.b : s.a - s.b }));
  let q = 0, ask = [];
  onTap(prompt, () => Audio.say(ask), { sound: null });
  const next = () => {
    if (q >= ROUND) { Store.played('num:sums'); return roundEnd({ stars: ROUND, onAgain: () => go('sums'), onHome: () => go('numbers') }); }
    const s = qs[q], t = COUNT_THINGS[[0, 4, 1, 0, 3][q]];
    area.innerHTML = ''; area.dataset.answer = s.ans;
    let done;
    scene.classList.remove('show-n');
    scene.classList.toggle('big', s.a > 10 || s.b > 10 || s.ans > 10);
    if (s.op === '+') {
      scene.innerHTML = `<div class="grp g1"></div><b class="op">+</b><div class="grp g2"></div><b class="op">=</b><div class="ans-box">?</div>`;
      $('.g1', scene).append(objectPile(t, s.a, { countable: false }), h(`<span class="grp-n">${s.a}</span>`));
      $('.g2', scene).append(objectPile(t, s.b, { countable: false }), h(`<span class="grp-n">${s.b}</span>`));
      ask = [EN(`${NUMBER_WORDS[s.a]} plus ${NUMBER_WORDS[s.b]}`), T('altogether')];
      done = EN(`${NUMBER_WORDS[s.a]} plus ${NUMBER_WORDS[s.b]} makes ${NUMBER_WORDS[s.ans]}!`);
    } else {
      scene.innerHTML = `<div class="grp g1 wide"></div><b class="op">−</b><span class="grp-n take">${s.b}</span><b class="op">=</b><div class="ans-box">?</div>`;
      $('.g1', scene).append(objectPile(t, s.a, { countable: false, away: s.b }), h(`<span class="grp-n">${s.a}</span>`));
      ask = [EN(`${NUMBER_WORDS[s.a]} take away ${NUMBER_WORDS[s.b]}`), T('left')];
      done = EN(`${NUMBER_WORDS[s.a]} take away ${NUMBER_WORDS[s.b]} is ${NUMBER_WORDS[s.ans]}!`);
      later(() => $$('.obj.away', scene).forEach((o, i) => setTimeout(() => { o.classList.add('gone'); Audio.sfx('whoosh'); }, i * 250)), 1400);
    }
    $('.prompt-word', prompt).textContent = s.op === '+' ? T('altogether') : T('left');
    later(() => { scene.classList.add('show-n'); $('.prompt-word', prompt).textContent = `${s.a} ${s.op} ${s.b} = ?`; }, 1100); // quantity first, numerals a moment later
    setGuide('think', s.op === '+' ? T('altogether') : T('left'));
    Audio.say(ask);
    runChoice({
      stage: area, cls: 'nums', choices: numberChoices(s.ans, max).map((k) => ({ key: k })), render: numRender,
      isRight: (c) => c.key === s.ans,
      onRight: () => {
        App.busy = true; fillStar(stars, q);
        const box = $('.ans-box', scene); box.textContent = s.ans; box.classList.add('solved');
        const praise = tPick('praise');
        celebrate({ text: String(s.ans) });
        setGuide(pick(['jump', 'cheer']), praise);
        Audio.say([praise, done]);
        q++; later(() => { App.busy = false; next(); }, 3200 + Dog.extra());
      },
      onMiss: () => { const enc = tPick('encourage'); setGuide('wave', enc, 'wiggle'); Audio.say([enc, ...ask]); },
    });
  };
  el._enter = next;
  return el;
};


/* ===== src/85-parent.js ===== */
/* Lea Learns — parent corner (hold the top-right corner for 3 seconds). Shown in the chosen interface language. */
const PT = {
  en: { title: 'For parents', language: 'Language', langNote: 'Menus and the guide’s hints use this language. The words being learnt are always English.', sound: 'Sound effects', voice: 'Speech', range: 'Numbers', rangeNote: 'Counting range', reset: 'Reset progress', resetSure: 'Tap again to reset', resetDone: 'Progress reset', test: 'Test voices', voices: 'Voices on this device', none: 'not found', noVoice: (l) => `No ${l} voice found: guide phrases are shown but not spoken. Add one in Settings › Accessibility › Spoken Content › Voices.`, progress: (d) => `${d.apples} apples · ${d.stars} stars · ${Object.keys(d.seenWords).length} words · ${Object.keys(d.seenLetters).length}/26 letters`, privacy: 'No accounts, ads or tracking. Progress is saved only on this device.', ios: 'iPad: if there is no sound, check the silent switch and volume, then go back to the start screen and tap Lea or Ines.', on: 'On', off: 'Off', close: 'Close', changePlayer: 'Change player' },
  pl: { title: 'Dla rodzica', language: 'Język', langNote: 'Menu i podpowiedzi są w tym języku. Słówka do nauki są zawsze po angielsku.', sound: 'Efekty dźwiękowe', voice: 'Mowa', range: 'Liczby', rangeNote: 'Zakres liczenia', reset: 'Wyzeruj postępy', resetSure: 'Dotknij ponownie, aby wyzerować', resetDone: 'Postępy wyzerowane', test: 'Sprawdź głosy', voices: 'Głosy na tym urządzeniu', none: 'brak', noVoice: (l) => `Brak głosu (${l}): podpowiedzi są wyświetlane, ale nie czytane. Dodaj głos w Ustawienia › Dostępność › Zawartość mówiona › Głosy.`, progress: (d) => `${d.apples} jabłek · ${d.stars} gwiazdek · ${Object.keys(d.seenWords).length} słów · ${Object.keys(d.seenLetters).length}/26 liter`, privacy: 'Bez kont, reklam i śledzenia. Postępy zapisują się tylko na tym urządzeniu.', ios: 'iPad: jeśli nie ma dźwięku, sprawdź przełącznik wyciszenia i głośność, a potem wróć do ekranu startowego i dotknij Lei lub Ines.', on: 'Wł.', off: 'Wył.', close: 'Zamknij', changePlayer: 'Zmień gracza' },
  ru: { title: 'Для родителей', language: 'Язык', langNote: 'Меню и подсказки на этом языке. Слова для изучения всегда на английском.', sound: 'Звуковые эффекты', voice: 'Речь', range: 'Числа', rangeNote: 'Диапазон счёта', reset: 'Сбросить прогресс', resetSure: 'Нажмите ещё раз для сброса', resetDone: 'Прогресс сброшен', test: 'Проверить голоса', voices: 'Голоса на устройстве', none: 'нет', noVoice: (l) => `Нет голоса (${l}): подсказки показываются, но не озвучиваются. Добавьте голос: Настройки › Универсальный доступ › Устный контент › Голоса.`, progress: (d) => `${d.apples} яблок · ${d.stars} звёзд · ${Object.keys(d.seenWords).length} слов · ${Object.keys(d.seenLetters).length}/26 букв`, privacy: 'Без аккаунтов, рекламы и слежки. Прогресс хранится только на этом устройстве.', ios: 'iPad: если нет звука, проверьте переключатель беззвучного режима и громкость, затем вернитесь на стартовый экран и нажмите на Лею или Инес.', on: 'Вкл.', off: 'Выкл.', close: 'Закрыть', changePlayer: 'Сменить игрока' },
};
const CREDIT = 'Made for Lea by Tomasz Zdankowski';

function openParent() {
  closeOverlays(); Audio.hush();
  const o = h(`<div class="overlay parent" role="dialog" aria-label="Parents"></div>`);
  const render = () => {
    const s = Store.settings, L = lang(), t = PT[L];
    const v = (k) => Audio.voiceFor(k) || t.none;
    const missing = Audio.listLoaded && L !== 'en' && !Audio.voiceFor(L);
    return `<div class="parent-card scroll" lang="${L}">
      <button class="round-btn p-close" aria-label="${t.close}">${ICON.close}</button>
      <h2>${t.title}</h2>
      <div class="p-block"><div class="p-label">${t.language}</div>
        <div class="lang-pick">${Object.entries(LANGS).map(([k, x]) => `<button data-lang="${k}" class="${k === L ? 'on' : ''}" lang="${k}">${x.label}</button>`).join('')}</div>
        <p class="p-note">${t.langNote}</p></div>
      <div class="p-block"><div class="p-label">${t.range} · ${t.rangeNote}</div>
        <div class="lang-pick range-pick"><button data-range="20" class="${RANGE() === 20 ? 'on' : ''}">1–20</button><button data-range="30" class="${RANGE() === 30 ? 'on' : ''}">1–30</button></div></div>
      <div class="p-row"><span>${t.sound}</span><button class="toggle ${s.sound ? 'on' : ''}" data-k="sound">${s.sound ? t.on : t.off}</button></div>
      <div class="p-row"><span>${t.voice}</span><button class="toggle ${s.voice ? 'on' : ''}" data-k="voice">${s.voice ? t.on : t.off}</button></div>
      <div class="p-block"><div class="p-label">${t.voices}</div>
        <p class="p-voices">EN: ${v('en')}<br>PL: ${v('pl')}<br>RU: ${v('ru')}</p>
        ${missing ? `<p class="p-note warn">${t.noVoice(LANGS[L].label)}</p>` : ''}
        <button class="p-btn p-test">${t.test}</button></div>
      <p class="p-progress">${t.progress(Store.data)}</p>
      <div class="p-row"><button class="p-btn p-player">${t.changePlayer}</button><button class="p-btn danger p-reset">${t.reset}</button></div>
      <p class="p-note">${t.privacy}</p>
      <p class="p-note">${t.ios}</p>
      <p class="p-credit">${CREDIT} · v${APP_VERSION}</p>
    </div>`;
  };
  const wire = () => {
    o.innerHTML = render();
    const t = PT[lang()];
    onTap($('.p-close', o), () => { o.remove(); go(App.screen || 'home', App.params || {}); });
    $$('.toggle', o).forEach((b) => onTap(b, () => { Store.set(b.dataset.k, !Store.settings[b.dataset.k]); wire(); }));
    $$('[data-lang]', o).forEach((b) => onTap(b, () => { Store.set('lang', b.dataset.lang); document.documentElement.lang = b.dataset.lang; wire(); }));
    $$('[data-range]', o).forEach((b) => onTap(b, () => { Store.set('range', +b.dataset.range); wire(); }));
    onTap($('.p-test', o), () => { Audio.unlock(); Audio.say([T('hello'), EN('A is for apple.'), EN('One, two, three!')]); });
    onTap($('.p-player', o), () => { o.remove(); go('gate'); });
    const r = $('.p-reset', o); let armed = false;
    onTap(r, () => { if (!armed) { armed = true; r.textContent = t.resetSure; r.classList.add('armed'); setTimeout(() => { if (document.body.contains(r)) { armed = false; r.textContent = t.reset; r.classList.remove('armed'); } }, 4000); return; } Store.reset(); wire(); const n = $('.p-progress', o); n.textContent = t.resetDone + ' · ' + n.textContent; });
  };
  wire();
  document.body.appendChild(o);
}


/* ===== src/99-main.js ===== */
/* Lea Learns — boot. */
(function boot() {
  // Stop pinch-zoom, double-tap zoom, long-press menus and rubber-band scrolling outside scroll areas.
  ['gesturestart', 'gesturechange', 'gestureend'].forEach((ev) => document.addEventListener(ev, (e) => e.preventDefault(), { passive: false }));
  document.addEventListener('touchmove', (e) => { if (e.touches.length > 1 || !e.target.closest('.scroll, .parent-card')) e.preventDefault(); }, { passive: false });
  document.addEventListener('contextmenu', (e) => e.preventDefault());
  // iOS: make sure audio is unlocked by the very first touch anywhere.
  const firstTouch = () => { Audio.unlock(); document.removeEventListener('touchend', firstTouch, true); document.removeEventListener('click', firstTouch, true); };
  document.addEventListener('touchend', firstTouch, true); document.addEventListener('click', firstTouch, true);
  // Warm the character images so pose changes are instant.
  Object.keys(CHARACTERS).forEach((who) => POSES.forEach((p) => { const i = new Image(); i.src = poseSrc(p, who); }));
  document.documentElement.lang = lang();
  // Rotation / resize: CSS does the layout; screens with canvases or painted hotspots re-measure.
  let rt = null;
  const relayout = () => { clearTimeout(rt); rt = setTimeout(() => { document.body.classList.toggle('is-land', innerWidth > innerHeight); const s = $('.screen:not(.screen-out)'); if (s && s._layout) s._layout(); }, 120); };
  addEventListener('resize', relayout); addEventListener('orientationchange', relayout);
  document.body.classList.toggle('is-land', innerWidth > innerHeight);
  go('gate');
  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
  }
  window.LeaLearns = { go, Store, Dog, version: APP_VERSION }; // small handle for tests and debugging
})();

})();
