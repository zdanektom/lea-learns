/* Lea Learns 1.5.1 — generated from src/ by build.mjs. Made for Lea by Tomasz Zdankowski. */
(() => {
'use strict';
const APP_VERSION = '1.5.1';

/* ===== src/00-store.js ===== */
/* Lea Learns — progress and settings, kept only in this device's localStorage. */
const Store = (() => {
  const KEY = 'lea-learns:v1';
  const fresh = () => ({ apples: 0, stars: 0, rounds: 0, seenWords: {}, seenLetters: {}, played: {}, chars: [], looks: {}, tours: {}, settings: { player: null, tours: true, sound: true, music: true, voice: true, lang: 'en', range: 20 } });
  let d;
  try { d = Object.assign(fresh(), JSON.parse(localStorage.getItem(KEY) || '{}')); d.settings = Object.assign(fresh().settings, d.settings || {}); if (!Array.isArray(d.chars)) d.chars = []; if (!d.looks || typeof d.looks !== 'object') d.looks = {}; } catch (e) { d = fresh(); }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {} };
  return {
    get data() { return d; },
    get settings() { return d.settings; },
    set(k, v) { d.settings[k] = v; save(); },
    addApple(n = 1) { d.apples += n; save(); },
    addStars(n) { d.stars += n; d.rounds += 1; save(); },
    seeWord(k) { d.seenWords[k] = 1; save(); },
    seeLetter(l) { d.seenLetters[l] = 1; save(); },
    toured(k) { return !!(d.tours && d.tours[k]); },
    markTour(k) { if (!d.tours) d.tours = {}; d.tours[k] = 1; save(); },
    played(id) { d.played[id] = (d.played[id] || 0) + 1; save(); },
    /* Custom characters (made in "Create your character") and edited looks for Lea / Ines. */
    get chars() { return d.chars; },
    char(id) { return d.chars.find((c) => c.id === id) || null; },
    saveChar(c) { const i = d.chars.findIndex((x) => x.id === c.id); if (i < 0) d.chars.push(c); else d.chars[i] = c; save(); },
    deleteChar(id) { d.chars = d.chars.filter((c) => c.id !== id); if (d.settings.player === id) d.settings.player = 'lea'; save(); },
    look(who) { return d.looks[who] || null; },
    setLook(who, p) { if (p) d.looks[who] = p; else delete d.looks[who]; save(); },
    reset() { const s = d.settings, c = d.chars, l = d.looks, tr = d.tours; d = fresh(); d.tours = tr; d.settings = s; d.chars = c; d.looks = l; save(); },
  };
})();


/* ===== src/10-data.js ===== */
/* Lea Learns: learning content. */
const APP_NAME = 'Lea Learns';
/* Playable characters (illustrated only). `say` is how the device voice should pronounce the name. */
const CHARACTERS = { lea: {}, ines: {}, leo: {} };
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
Object.assign(WORDS, { clock: 'clock', window: 'window', pizza: 'pizza', door: 'door', starfish: 'starfish', cookie: 'cookie' });
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

/* v1.4.0 — Shapes. The first eight are the everyday ones used in the games; pentagon and hexagon are extra cards. */
const SHAPES = ['circle', 'square', 'triangle', 'rectangle', 'oval', 'star', 'heart', 'diamond', 'pentagon', 'hexagon'];
const CORE_SHAPES = SHAPES.slice(0, 8);
const shapeColour = (k) => SHAPE_DEFS[k][0];
/* Real things a child knows, and their shape (Montessori: from the object to the abstract shape). */
const SHAPE_THINGS = [
  ['ball', 'circle'], ['orange', 'circle'], ['clock', 'circle'], ['gift', 'square'], ['window', 'square'],
  ['pizza', 'triangle'], ['book', 'rectangle'], ['door', 'rectangle'], ['egg', 'oval'],
  ['starfish', 'star'], ['cookie', 'heart'], ['kite', 'diamond'],
];

/* v1.4.0 — Days of the week. Each day keeps one colour everywhere, plus a small picture "routine" cue. */
const DAYS = [
  { k: 'Monday', c: '#e53935', cue: 'book' },
  { k: 'Tuesday', c: '#fb8c00', cue: 'ball' },
  { k: 'Wednesday', c: '#f4b400', cue: 'flower' },
  { k: 'Thursday', c: '#43a047', cue: 'xylophone' },
  { k: 'Friday', c: '#1e88e5', cue: 'pizza' },
  { k: 'Saturday', c: '#8e44ad', cue: 'icecream' },
  { k: 'Sunday', c: '#ec407a', cue: 'sun' },
];
/* Index into DAYS for today (Monday first, as in the UK and Poland). */
const todayIndex = () => (new Date().getDay() + 6) % 7;


/* ===== src/15-i18n.js ===== */
/* Lea Learns — interface and guide language (pl / en / ru). The English words being taught are never translated. */
const LANGS = { pl: { label: 'Polski', voice: 'pl' }, en: { label: 'English', voice: 'en' }, ru: { label: 'Русский', voice: 'ru' } };
const STR = {
  en: {
    creator: 'Create your character!', newChar: 'New', editLook: 'Change my look', surprise: 'Surprise!', cluck: 'Cluck cluck!', roar: 'Roar!', likeBefore: 'Just like before!',
    crAsk: { base: 'Who will you be?', gender: 'Girl or boy?', hair: 'Choose a hairstyle!', hairColour: 'Choose a hair colour!', eyes: 'Choose an eye colour!', face: 'Choose a face shape!', skin: 'Choose a skin colour!', body: 'Choose a body shape!', outfit: 'Choose an outfit!', acc: 'Choose something extra!', name: 'What’s my name?' },
    fsEnter: 'Full screen', fsExit: 'Exit full screen', shapes: 'Shapes', days: 'Days', match: 'Match', sing: 'Sing', today: 'Today', whatShape: 'What shape is it?', learnShapes: 'Let’s learn shapes!', tapShape: 'Tap a shape!', daysWeek: 'Days of the week!', singDays: 'Let’s sing the days!', whatNext: 'What comes next?', tapDay: 'Tap a day!',
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
    creator: 'Stwórz swoją postać!', newChar: 'Nowa postać', editLook: 'Zmień wygląd', surprise: 'Niespodzianka!', cluck: 'Ko ko ko!', roar: 'Wrrr!', likeBefore: 'Jak dawniej!',
    crAsk: { base: 'Kim będziesz?', gender: 'Dziewczynka czy chłopiec?', hair: 'Wybierz fryzurę!', hairColour: 'Wybierz kolor włosów!', eyes: 'Wybierz kolor oczu!', face: 'Wybierz kształt buzi!', skin: 'Wybierz kolor skóry!', body: 'Wybierz sylwetkę!', outfit: 'Wybierz ubranie!', acc: 'Wybierz dodatek!', name: 'Jak mam na imię?' },
    fsEnter: 'Pełny ekran', fsExit: 'Zamknij pełny ekran', shapes: 'Kształty', days: 'Dni', match: 'Dopasuj', sing: 'Śpiewaj', today: 'Dziś', whatShape: 'Jaki to kształt?', learnShapes: 'Poznajmy kształty!', tapShape: 'Dotknij kształtu!', daysWeek: 'Dni tygodnia!', singDays: 'Zaśpiewajmy dni!', whatNext: 'Co jest dalej?', tapDay: 'Dotknij dnia!',
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
    creator: 'Создай своего персонажа!', newChar: 'Новый', editLook: 'Изменить образ', surprise: 'Сюрприз!', cluck: 'Ко-ко-ко!', roar: 'Р-р-р!', likeBefore: 'Как раньше!',
    crAsk: { base: 'Кем ты будешь?', gender: 'Девочка или мальчик?', hair: 'Выбери причёску!', hairColour: 'Выбери цвет волос!', eyes: 'Выбери цвет глаз!', face: 'Выбери форму лица!', skin: 'Выбери цвет кожи!', body: 'Выбери фигуру!', outfit: 'Выбери одежду!', acc: 'Выбери украшение!', name: 'Как меня зовут?' },
    fsEnter: 'Полный экран', fsExit: 'Выйти из полноэкранного режима', shapes: 'Формы', days: 'Дни', match: 'Подбери', sing: 'Пой', today: 'Сегодня', whatShape: 'Какая это форма?', learnShapes: 'Давай учить формы!', tapShape: 'Нажми на форму!', daysWeek: 'Дни недели!', singDays: 'Споём дни недели!', whatNext: 'Что дальше?', tapDay: 'Нажми на день!',
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
const NAMES = { lea: { en: 'Lea', pl: 'Lea', ru: 'Лея', sayEn: 'Lea' }, ines: { en: 'Ines', pl: 'Ines', ru: 'Инес', sayEn: 'Eeness' }, leo: { en: 'Leo', pl: 'Leo', ru: 'Лео', sayEn: 'Leo' } };
const lang = () => (STR[Store.settings.lang] ? Store.settings.lang : 'en');
const T = (k, ...a) => { const v = STR[lang()][k] ?? STR.en[k]; return typeof v === 'function' ? v(...a) : v; };
const tPick = (k) => pick(T(k));
/* Mark a piece of speech as English target vocabulary (always spoken with an English voice). */
const EN = (t) => ({ en: t });
/* A custom name: no recorded clip exists, so it is spoken by the device voice in the interface language. */
const NAME = (t) => ({ name: t });


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
  /* v1.4.0 — real things for "match the shape" */
  clock: () => `
    <circle cx="50" cy="52" r="38" fill="#4fc3f7" ${ln}/><circle cx="50" cy="52" r="29" fill="#fff" ${ln}/>
    <g fill="${INK}"><circle cx="50" cy="28" r="2.2"/><circle cx="74" cy="52" r="2.2"/><circle cx="50" cy="76" r="2.2"/><circle cx="26" cy="52" r="2.2"/></g>
    <path d="M50 52 L50 36 M50 52 L62 58" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/><circle cx="50" cy="52" r="3.5" fill="#e53935"/>
    <path d="M24 20 L32 14 M76 20 L68 14" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>${shine(30, 36, 4, 8)}`,
  window: () => `
    <rect x="16" y="16" width="68" height="68" rx="4" fill="#8d5a34" ${ln}/><rect x="23" y="23" width="54" height="54" fill="#bfe9ff" ${ln}/>
    <path d="M50 23 V77 M23 50 H77" stroke="#8d5a34" stroke-width="6"/><path d="M23 23 V77 M23 50 H77" fill="none" ${thin}/>
    <path d="M28 44 L40 30 M56 44 L68 30" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".8"/>`,
  pizza: () => `
    <path d="M50 92 L14 18 Q50 6 86 18 Z" fill="#ffd54f" ${ln}/><path d="M14 18 Q50 6 86 18 L82 26 Q50 15 18 26 Z" fill="#d9952f" ${ln}/>
    <g fill="#e53935" stroke="${INK}" stroke-width="2"><circle cx="40" cy="36" r="6"/><circle cx="60" cy="40" r="6"/><circle cx="50" cy="62" r="5"/></g>
    <g fill="#43a047"><circle cx="34" cy="50" r="2"/><circle cx="62" cy="56" r="2"/><circle cx="52" cy="30" r="2"/></g>`,
  door: () => `
    <rect x="27" y="8" width="46" height="86" rx="3" fill="#ef6c57" ${ln}/>
    <rect x="34" y="16" width="32" height="30" rx="2" fill="#f8a090" ${thin}/><rect x="34" y="54" width="32" height="32" rx="2" fill="#f8a090" ${thin}/>
    <circle cx="64" cy="51" r="3.5" fill="#ffd54f" ${thin}/>`,
  starfish: () => `
    <path d="M50 8 L61 36 L91 38 L67 57 L76 87 L50 70 L24 87 L33 57 L9 38 L39 36 Z" fill="#ff8a65" ${ln}/>
    <g fill="#ffccbc"><circle cx="50" cy="22" r="2.5"/><circle cx="76" cy="41" r="2.5"/><circle cx="66" cy="74" r="2.5"/><circle cx="34" cy="74" r="2.5"/><circle cx="24" cy="41" r="2.5"/></g>
    ${eyes(43, 57, 48, 3)}${smile(50, 56, 5)}`,
  cookie: () => `
    <path d="M50 88 C30 72 10 58 10 36 C10 22 21 12 33 12 C41 12 47 17 50 23 C53 17 59 12 67 12 C79 12 90 22 90 36 C90 58 70 72 50 88 Z" fill="#d7a35f" ${ln}/>
    <path d="M50 78 C34 65 19 54 19 37 C19 27 26 20 34 20 C41 20 46 25 50 32 C54 25 59 20 66 20 C74 20 81 27 81 37 C81 54 66 65 50 78 Z" fill="#f48fb1"/>
    <g fill="#fff"><circle cx="35" cy="36" r="2.3"/><circle cx="62" cy="34" r="2.3"/><circle cx="50" cy="52" r="2.3"/><circle cx="40" cy="58" r="2"/><circle cx="64" cy="54" r="2"/></g>`,
  calendar: () => `
    <rect x="12" y="18" width="76" height="70" rx="10" fill="#fff" ${ln}/><path d="M12 28 A10 10 0 0 1 22 18 H78 A10 10 0 0 1 88 28 V38 H12 Z" fill="#e53935" ${ln}/>
    <path d="M30 10 V26 M70 10 V26" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>
    ${['#e53935', '#fb8c00', '#f4b400', '#43a047', '#1e88e5', '#8e44ad', '#ec407a'].map((c, i) => `<circle cx="${23 + (i % 4) * 18}" cy="${52 + Math.floor(i / 4) * 20}" r="6.5" fill="${c}"/>`).join('')}`,
};

const COLOURS = { red: '#e53935', blue: '#1e88e5', yellow: '#fdd835', green: '#43a047', orange: '#fb8c00', purple: '#8e44ad', pink: '#f06292', brown: '#8d5a34', black: '#333', white: '#fafafa' };
function balloon(c) {
  return `<path d="M50 74 C46 82 56 84 50 96" fill="none" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>
    <path d="M50 8 C72 8 84 24 84 40 C84 60 64 74 50 74 C36 74 16 60 16 40 C16 24 28 8 50 8 Z" fill="${c}" ${ln}/>
    <path d="M45 74 L55 74 L52 79 L48 79 Z" fill="${c}" ${thin}/>
    ${shine(34, 30, 6, 11, 25)}`;
}

/* v1.4.0 — Shapes: bright, flat, friendly (a little face, like the other pictures). */
const SHAPE_DEFS = {
  circle: ['#e53935', '<circle cx="50" cy="50" r="38"/>'],
  square: ['#1e88e5', '<rect x="14" y="14" width="72" height="72" rx="5"/>'],
  triangle: ['#43a047', '<path d="M50 10 L90 84 L10 84 Z"/>'],
  rectangle: ['#fb8c00', '<rect x="6" y="26" width="88" height="50" rx="5"/>'],
  oval: ['#8e44ad', '<ellipse cx="50" cy="50" rx="28" ry="40"/>'],
  star: ['#f4b400', '<path d="M50 6 L62 37 L95 38 L69 58 L78 91 L50 72 L22 91 L31 58 L5 38 L38 37 Z"/>'],
  heart: ['#ec407a', '<path d="M50 88 C30 72 8 58 8 35 C8 20 20 10 32 10 C41 10 47 15 50 22 C53 15 59 10 68 10 C80 10 92 20 92 35 C92 58 70 72 50 88 Z"/>'],
  diamond: ['#00acc1', '<path d="M50 6 L86 50 L50 94 L14 50 Z"/>'],
  pentagon: ['#7cb342', '<path d="M50 8 L91 38 L75 88 L25 88 L9 38 Z"/>'],
  hexagon: ['#5c6bc0', '<path d="M28 12 L72 12 L94 50 L72 88 L28 88 L6 50 Z"/>'],
};
function shapeSvg(k) {
  const [c, d] = SHAPE_DEFS[k] || SHAPE_DEFS.circle;
  const cy = k === 'triangle' ? 62 : k === 'heart' ? 44 : k === 'star' ? 52 : 50;
  return `<g fill="${c}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round">${d}</g>
    <path d="M28 30 Q32 22 40 20" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".7" transform="translate(${k === 'rectangle' ? '-8 14' : k === 'oval' ? '4 4' : k === 'triangle' ? '12 26' : k === 'diamond' ? '10 14' : k === 'star' ? '12 20' : '0 0'})"/>
    ${eyes(42, 58, cy - 4, 3.2)}${cheeks(36, 64, cy + 3, 3.4)}${smile(50, cy + 3, 5)}`;
}

function art(key, cls = '') {
  const u = ++_uid;
  const inner = key.startsWith('colour:') ? balloon(COLOURS[key.slice(7)]) : key.startsWith('shape:') ? shapeSvg(key.slice(6)) : (ART[key] ? ART[key](u) : '');
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


/* ===== src/22-avatar.js ===== */
/* Lea Learns — parametric characters ("Create your character"). Every look is drawn here as an SVG,
   turned into a data: URL and used in the same <img class="lea"> as the illustrated Lea and Ines,
   so every screen, pose swap and celebration works unchanged. No photos, no external files. */
const AV = (() => {
  const HAIR = ['pigtails', 'braids', 'long', 'bob', 'ponytail', 'bun', 'curly', 'short', 'spiky'];
  const HAIR_COLOURS = {
    brunette: '#6b4226', black: '#2e2422', blonde: '#e3b562', ginger: '#d9772b', red: '#c0392b', silver: '#e9e4dc',
    pink: '#ff7eb6', blue: '#4aa3ff', purple: '#9b6dd6', neon: '#7dff3a', rainbow: 'rainbow',
  };
  const EYES = { brown: '#6b3e1f', dark: '#3b2416', blue: '#3d8fe0', green: '#3fa14a', hazel: '#a07a2c', grey: '#7d8d9c', violet: '#9b59b6' };
  const FACES = ['round', 'oval', 'heart', 'square'];
  const SKIN = { porcelain: '#ffe6d5', light: '#fbd6bb', peach: '#f1c09a', tan: '#d9a273', brown: '#a8714a', deep: '#76482b' };
  const BODIES = { slim: [0.86, 1], average: [1, 1], round: [1.22, 1], tall: [0.95, 1.1], small: [1.06, 0.9] };
  const OUTFITS = ['flowerPink', 'flowerTeal', 'appleDress', 'princess', 'polka', 'rainbow', 'tee', 'dungarees', 'sporty',
    'pirate', 'superhero', 'astronaut', 'chicken', 'dino', 'bunny', 'bear', 'banana'];
  const FUNNY = ['pirate', 'superhero', 'astronaut', 'chicken', 'dino', 'bunny', 'bear', 'banana'];
  const ACCS = ['none', 'headband', 'bow', 'flower', 'crown', 'hat', 'cap', 'glasses'];
  const GIRL_NAMES = ['Mia', 'Zoe', 'Lily', 'Ola', 'Ana', 'Ella', 'Nina', 'Maja'];
  const BOY_NAMES = ['Olek', 'Max', 'Tom', 'Oskar', 'Ben', 'Adam', 'Kuba', 'Noah'];
  const PRESETS = {
    lea: { gender: 'girl', hair: 'pigtails', hairColour: 'blonde', eyes: 'brown', face: 'round', skin: 'light', body: 'average', outfit: 'flowerPink', acc: 'headband' },
    ines: { gender: 'girl', hair: 'braids', hairColour: 'brunette', eyes: 'brown', face: 'round', skin: 'light', body: 'average', outfit: 'flowerTeal', acc: 'none' },
  };
  const DEFAULT = { gender: 'girl', name: 'Mia', hair: 'bob', hairColour: 'ginger', eyes: 'green', face: 'round', skin: 'peach', body: 'average', outfit: 'appleDress', acc: 'bow' };
  /* Gender only changes the suggestions it starts from — every hairstyle and outfit stays available. */
  const GENDER_DEFAULTS = {
    girl: { hair: 'pigtails', outfit: 'appleDress', acc: 'bow' },
    boy: { hair: 'short', outfit: 'tee', acc: 'none' },
  };
  const GIRLISH_HAIR = ['pigtails', 'braids', 'long', 'bun'], DRESSES = ['flowerPink', 'flowerTeal', 'appleDress', 'princess', 'polka', 'rainbow'];

  const valid = (p) => {
    const o = Object.assign({}, DEFAULT, p || {});
    if (!['girl', 'boy'].includes(o.gender)) o.gender = 'girl';
    if (!HAIR.includes(o.hair)) o.hair = DEFAULT.hair;
    if (!HAIR_COLOURS[o.hairColour]) o.hairColour = DEFAULT.hairColour;
    if (!EYES[o.eyes]) o.eyes = DEFAULT.eyes;
    if (!FACES.includes(o.face)) o.face = 'round';
    if (!SKIN[o.skin]) o.skin = DEFAULT.skin;
    if (!BODIES[o.body]) o.body = 'average';
    if (!OUTFITS.includes(o.outfit)) o.outfit = DEFAULT.outfit;
    if (!ACCS.includes(o.acc)) o.acc = 'none';
    o.name = String(o.name || '').replace(/[<>&"]/g, '').trim().slice(0, 14);
    return o;
  };
  const rnd = (a) => a[Math.floor(Math.random() * a.length)];
  function random(keep = {}) {
    const gender = keep.gender || rnd(['girl', 'boy']);
    return valid(Object.assign({
      gender, name: rnd(gender === 'boy' ? BOY_NAMES : GIRL_NAMES), hair: rnd(HAIR), hairColour: rnd(Object.keys(HAIR_COLOURS)), eyes: rnd(Object.keys(EYES)),
      face: rnd(FACES), skin: rnd(Object.keys(SKIN)), body: rnd(Object.keys(BODIES)), outfit: rnd(OUTFITS), acc: rnd(ACCS),
    }, keep));
  }
  function withGender(p, g) {
    const o = Object.assign({}, p, { gender: g });
    const d = GENDER_DEFAULTS[g];
    if (g === 'boy') { if (GIRLISH_HAIR.includes(o.hair)) o.hair = d.hair; if (DRESSES.includes(o.outfit)) o.outfit = d.outfit; if (['bow', 'flower', 'headband'].includes(o.acc)) o.acc = d.acc; if (GIRL_NAMES.includes(o.name)) o.name = rnd(BOY_NAMES); }
    else { if (['short', 'spiky'].includes(o.hair)) o.hair = d.hair; if (o.outfit === 'tee') o.outfit = d.outfit; if (BOY_NAMES.includes(o.name)) o.name = rnd(GIRL_NAMES); }
    return o;
  }

  /* ---------- drawing ---------- */
  const K = '#4a2f27';
  const L = `stroke="${K}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"`;
  const LT = `stroke="${K}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"`;
  const shade = (hex, f) => { if (!/^#/.test(hex)) return hex; const n = parseInt(hex.slice(1), 16); const c = [n >> 16, (n >> 8) & 255, n & 255].map((v) => Math.max(0, Math.min(255, Math.round(f < 1 ? v * f : v + (255 - v) * (f - 1))))); return '#' + c.map((v) => v.toString(16).padStart(2, '0')).join(''); };

  const OUT = {
    flowerPink: { top: '#f8cdd3', pat: 'flowersP', sleeve: 'long', bottom: 'skirt', shoes: '#e0393b', frill: true },
    flowerTeal: { top: '#3fa7a0', pat: 'daisies', sleeve: 'long', bottom: 'skirt', shoes: '#2f8c86', frill: true },
    appleDress: { top: '#e53935', pat: 'apples', sleeve: 'short', bottom: 'skirt', shoes: '#7a4a2a', collar: '#fff' },
    princess: { top: '#f7a8d0', pat: 'sparkles', sleeve: 'puff', bottom: 'gown', shoes: '#f0c040', grad: ['#ffc1e3', '#c79bf2'] },
    polka: { top: '#3f6fd1', pat: 'dots', sleeve: 'short', bottom: 'skirt', shoes: '#e53935', collar: '#fff' },
    rainbow: { top: '#fff', pat: 'rainbow', sleeve: 'short', bottom: 'skirt', shoes: '#9b6dd6' },
    tee: { top: '#ffb300', sleeve: 'short', bottom: 'trousers', bottomFill: '#3f6fd1', shoes: '#e53935', shoe: 'sneaker', star: '#fff' },
    dungarees: { top: '#ffffff', pat: 'stripesR', sleeve: 'short', bottom: 'trousers', bottomFill: '#4f86c6', bib: true, shoes: '#ffd54f', shoe: 'sneaker' },
    sporty: { top: '#26a69a', sleeve: 'long', bottom: 'shorts', bottomFill: '#1e6f68', socks: '#fff', shoes: '#ff7043', shoe: 'sneaker', sportStripe: '#fff' },
    pirate: { top: '#ffffff', pat: 'stripesR', sleeve: 'long', bottom: 'capri', bottomFill: '#3b3b46', shoes: '#2b2222', shoe: 'boot', vest: '#2b2b33', bandana: '#d32f2f', patch: true },
    superhero: { top: '#2f6fe0', sleeve: 'long', bottom: 'trousers', bottomFill: '#2f6fe0', shoes: '#d32f2f', shoe: 'boot', cape: '#e53935', emblem: '#ffd54f', belt: '#ffd54f' },
    astronaut: { top: '#f2f4f7', sleeve: 'long', bottom: 'onesie', bottomFill: '#f2f4f7', shoes: '#9aa6b2', shoe: 'boot', helmet: true, pack: '#b8c2cc', panel: true },
    chicken: { top: '#ffd84d', sleeve: 'wing', bottom: 'chicken', bottomFill: '#ffd84d', legs: '#ff9f1c', shoes: '#ff9f1c', shoe: 'feet', hood: { fill: '#ffd84d', kind: 'chicken' } },
    dino: { top: '#6cc24a', sleeve: 'long', bottom: 'onesie', bottomFill: '#6cc24a', belly: '#d7f0a8', shoes: '#4e9a34', shoe: 'paw', hood: { fill: '#6cc24a', kind: 'dino' }, tail: 'dino' },
    bunny: { top: '#fbf7fb', sleeve: 'long', bottom: 'onesie', bottomFill: '#fbf7fb', belly: '#ffd1e3', shoes: '#ffd1e3', shoe: 'paw', hood: { fill: '#fbf7fb', kind: 'bunny' }, tail: 'pom' },
    bear: { top: '#a8703f', sleeve: 'long', bottom: 'onesie', bottomFill: '#a8703f', belly: '#e9c79a', shoes: '#7a4f2a', shoe: 'paw', hood: { fill: '#a8703f', kind: 'bear' } },
    banana: { top: '#ffe14d', sleeve: 'long', bottom: 'banana', bottomFill: '#ffe14d', legs: '#fff3b0', shoes: '#7a5a2a', shoe: 'sneaker', hood: { fill: '#ffe14d', kind: 'banana' } },
  };

  function defs(p, o) {
    const hc = HAIR_COLOURS[p.hairColour];
    let d = `<filter id="st" x="-25%" y="-15%" width="150%" height="130%"><feMorphology in="SourceAlpha" operator="dilate" radius="5" result="d"/><feFlood flood-color="#fff"/><feComposite in2="d" operator="in"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;
    if (hc === 'rainbow') d += `<linearGradient id="hg" x1="0" y1="0" x2="0" y2="1">${['#ff4d6d', '#ff9f1c', '#ffe14d', '#5ed35e', '#4aa3ff', '#9b6dd6'].map((c, i) => `<stop offset="${(i / 5).toFixed(2)}" stop-color="${c}"/>`).join('')}</linearGradient>`;
    if (o.grad) d += `<linearGradient id="og" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${o.grad[0]}"/><stop offset="1" stop-color="${o.grad[1]}"/></linearGradient>`;
    d += `<pattern id="flowersP" width="34" height="34" patternUnits="userSpaceOnUse"><path d="M17 20 L17 30 M17 26 Q12 24 11 21 M17 26 Q22 24 23 21" stroke="#3f8f5a" stroke-width="2" fill="none"/>${[0, 72, 144, 216, 288].map((a) => `<circle cx="${(17 + Math.cos(a * Math.PI / 180 - 1.57) * 4.5).toFixed(1)}" cy="${(14 + Math.sin(a * Math.PI / 180 - 1.57) * 4.5).toFixed(1)}" r="3.6" fill="#7b4f9e"/>`).join('')}<circle cx="17" cy="14" r="2" fill="#fff3c4"/></pattern>`;
    d += `<pattern id="daisies" width="34" height="34" patternUnits="userSpaceOnUse"><path d="M17 20 L17 30 M17 26 Q12 24 11 21 M17 26 Q22 24 23 21" stroke="#205e57" stroke-width="2" fill="none"/>${[0, 60, 120, 180, 240, 300].map((a) => `<circle cx="${(17 + Math.cos(a * Math.PI / 180) * 4.5).toFixed(1)}" cy="${(14 + Math.sin(a * Math.PI / 180) * 4.5).toFixed(1)}" r="3.2" fill="#fff"/>`).join('')}<circle cx="17" cy="14" r="2.4" fill="#f6b72a"/></pattern>`;
    d += `<pattern id="apples" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M15 12 C12 9 7 10 7 15 C7 20 11 23 15 22 C19 23 23 20 23 15 C23 10 18 9 15 12 Z" fill="#fff3e0"/><path d="M15 12 L16 8" stroke="#7a4a2a" stroke-width="1.6"/><path d="M16 9 C18 6 21 6 22 7 C20 9 18 10 16 9 Z" fill="#7cc35a"/></pattern>`;
    d += `<pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="5" cy="5" r="3.2" fill="#fff"/><circle cx="15" cy="15" r="3.2" fill="#fff"/></pattern>`;
    d += `<pattern id="sparkles" width="26" height="26" patternUnits="userSpaceOnUse"><path d="M8 4 L9.5 8 L13 9 L9.5 10 L8 14 L6.5 10 L3 9 L6.5 8 Z" fill="#fff" opacity=".85"/><circle cx="20" cy="20" r="1.8" fill="#ffe082"/></pattern>`;
    d += `<pattern id="stripesR" width="12" height="12" patternUnits="userSpaceOnUse"><rect width="12" height="5" fill="#e53935"/></pattern>`;
    d += `<pattern id="rainbow" width="200" height="60" patternUnits="userSpaceOnUse">${['#ff4d6d', '#ff9f1c', '#ffe14d', '#5ed35e', '#4aa3ff', '#9b6dd6'].map((c, i) => `<rect y="${i * 10}" width="200" height="10" fill="${c}"/>`).join('')}</pattern>`;
    return `<defs>${d}</defs>`;
  }

  /* Arm positions for each pose, for the arm on the viewer's right (mirrored for the left). [elbow dx,dy, hand dx,dy] */
  const ARM = { down: [9, 38, 14, 74], wave: [30, -18, 36, -60], up: [26, -28, 42, -62], point: [38, 4, 74, 2], chin: [10, 30, -24, -12], lap: [4, 40, -12, 70] };
  const POSE = {
    front: ['down', 'down'], wave: ['down', 'wave'], cheer: ['up', 'up'], point: ['down', 'point'], think: ['down', 'chin'], jump: ['up', 'up'], sit: ['lap', 'lap'],
  };

  function svg(p, pose = 'front', crop = '') {
    p = valid(p);
    const o = OUT[p.outfit];
    const [bw, bh] = BODIES[p.body];
    const skin = SKIN[p.skin], skinD = shade(skin, 0.86);
    const hcRaw = HAIR_COLOURS[p.hairColour], hc = hcRaw === 'rainbow' ? 'url(#hg)' : hcRaw, hcD = hcRaw === 'rainbow' ? '#9b6dd6' : shade(hcRaw, 0.72);
    const jump = pose === 'jump';
    /* Map body coordinates (designed for an average body) to this body type. Absolute M/L/C/Q/Z paths only. */
    const tx = (x) => +(100 + (x - 100) * bw).toFixed(1), ty = (y) => +(150 + (y - 150) * bh).toFixed(1);
    const tp = (s) => s.replace(/(-?\d+(?:\.\d+)?)[ ,](-?\d+(?:\.\d+)?)/g, (_, x, y) => `${tx(+x)} ${ty(+y)}`);
    const fill = o.grad ? 'url(#og)' : o.top;
    const patt = (d, id) => (id ? `<path d="${d}" fill="url(#${id})"/>` : '');
    const parts = [];
    const hooded = !!o.hood;
    const hw = { round: 55, oval: 49, heart: 54, square: 54 }[p.face];

    // cape, tails and backpacks behind everything
    if (o.cape) parts.push(`<path d="${tp('M68 166 L132 166 C148 240 160 310 166 372 C124 384 76 384 34 372 C40 310 52 240 68 166 Z')}" fill="${o.cape}" ${L}/><path d="${tp('M68 166 L132 166 L150 300')}" fill="none" stroke="${shade(o.cape, 0.8)}" stroke-width="3"/>`);
    if (o.pack) parts.push(`<rect x="${tx(58)}" y="${ty(168)}" width="${tx(142) - tx(58)}" height="${ty(262) - ty(168)}" rx="14" fill="${o.pack}" ${L}/>`);
    if (o.tail === 'dino') parts.push(`<path d="${tp('M126 300 C150 310 176 320 194 344 C170 346 146 338 124 330 Z')}" fill="${o.top}" ${L}/><path d="${tp('M140 306 L146 296 L152 312 M158 314 L166 304 L170 322 M176 324 L184 316 L186 334')}" fill="#ff9f1c" ${LT}/>`);
    if (o.bottom === 'chicken') parts.push(`<path d="${tp('M150 250 C170 236 182 238 186 246 C178 252 176 262 172 272 C184 268 190 274 188 282 C176 284 166 288 154 292 Z')}" fill="#fff3b0" ${L}/>`);

    // hair (back layer) or hood back
    const back = hooded ? '' : hairBack(p.hair, hc, hcD);
    const hood = o.hood ? hoodBack(o.hood) : '';
    parts.push(`<g transform="translate(100 0) scale(${(hw / 55).toFixed(3)} 1) translate(-100 0)">${back}${hood}</g>`);

    // legs + shoes
    const hipY = 286, footY = jump ? 384 : pose === 'sit' ? 352 : 394;
    const feet = jump ? [[70, footY], [130, footY]] : [[86, footY], [114, footY]];
    const legC = o.legs || skin;
    [[88, feet[0]], [112, feet[1]]].forEach(([hx, [fx, fy]]) => {
      const a = `${tx(hx)} ${ty(hipY)}`, b = `${tx(fx)} ${ty(fy)}`;
      parts.push(`<path d="M${a} L${b}" stroke="${K}" stroke-width="${o.bottom === 'chicken' ? 12 : 21}" stroke-linecap="round"/><path d="M${a} L${b}" stroke="${legC}" stroke-width="${o.bottom === 'chicken' ? 7 : 16}" stroke-linecap="round"/>`);
      if (o.socks) parts.push(`<path d="M${tx(fx)} ${ty(fy - 22)} L${b}" stroke="${o.socks}" stroke-width="15" stroke-linecap="round"/>`);
      parts.push(shoe(o, tx(fx), ty(fy) + 4, fx < 100 ? -1 : 1));
    });

    // bottoms
    const sk = 'M62 226 L138 226 C148 256 156 284 160 302 C130 314 70 314 40 302 C44 284 52 256 62 226 Z';
    const gown = 'M64 226 L136 226 C150 280 166 340 172 390 C130 402 70 402 28 390 C34 340 50 280 64 226 Z';
    const trousers = 'M64 222 L136 222 L138 388 L106 388 L100 268 L94 388 L62 388 Z';
    const capri = 'M64 222 L136 222 L138 344 L106 344 L100 268 L94 344 L62 344 Z';
    const shorts = 'M64 222 L136 222 L140 290 L104 290 L100 262 L96 290 L60 290 Z';
    const onesie = 'M64 166 C80 158 120 158 136 166 C150 220 150 300 140 388 L106 388 L100 300 L94 388 L60 388 C50 300 50 220 64 166 Z';
    const chickenB = 'M100 158 C152 158 168 230 162 280 C156 322 130 334 100 334 C70 334 44 322 38 280 C32 230 48 158 100 158 Z';
    const bananaB = 'M72 162 C90 156 112 156 128 162 C150 220 152 290 132 336 C112 346 88 346 68 336 C48 290 50 220 72 162 Z';
    const cut = (d) => (pose === 'sit' ? d.replace(/388/g, '350') : d);
    if (o.bottom === 'skirt') { parts.push(`<path d="${tp(sk)}" fill="${fill}" ${L}/>${patt(tp(sk), o.pat)}`); }
    else if (o.bottom === 'gown') { const g = cut(gown).replace(/390/g, pose === 'sit' ? '352' : '390').replace(/402/g, pose === 'sit' ? '362' : '402'); parts.push(`<path d="${tp(g)}" fill="${fill}" ${L}/>${patt(tp(g), o.pat)}<path d="${tp('M52 300 C80 312 120 312 148 300')}" fill="none" stroke="#fff" stroke-width="3" opacity=".7"/>`); }
    else if (o.bottom === 'trousers') parts.push(`<path d="${tp(cut(trousers))}" fill="${o.bottomFill}" ${L}/>`);
    else if (o.bottom === 'capri') parts.push(`<path d="${tp(capri)}" fill="${o.bottomFill}" ${L}/>`);
    else if (o.bottom === 'shorts') parts.push(`<path d="${tp(shorts)}" fill="${o.bottomFill}" ${L}/><path d="${tp('M66 240 L70 286 M134 240 L130 286')}" stroke="${o.sportStripe || '#fff'}" stroke-width="3"/>`);
    else if (o.bottom === 'onesie') parts.push(`<path d="${tp(cut(onesie))}" fill="${o.bottomFill}" ${L}/>`);
    else if (o.bottom === 'chicken') parts.push(`<path d="${tp(chickenB)}" fill="${o.bottomFill}" ${L}/><path d="${tp('M70 300 C84 310 116 310 130 300')}" fill="none" stroke="#f0b400" stroke-width="3"/>`);
    else if (o.bottom === 'banana') parts.push(`<path d="${tp(bananaB)}" fill="${o.bottomFill}" ${L}/><path d="${tp('M100 168 C96 230 98 290 100 340 M80 170 C70 230 72 290 80 336')}" fill="none" stroke="#e6b800" stroke-width="2.5"/>`);

    // top
    const top = 'M68 166 C80 158 120 158 132 166 L138 232 L62 232 Z';
    if (!['onesie', 'chicken', 'banana'].includes(o.bottom)) {
      parts.push(`<path d="${tp(top)}" fill="${fill}" ${L}/>${patt(tp(top), o.pat)}`);
      if (o.bottom === 'skirt' || o.bottom === 'gown') parts.push(`<path d="${tp('M63 228 C88 234 112 234 137 228')}" fill="none" ${LT}/>`);
      if (o.collar) parts.push(`<path d="${tp('M84 162 C90 174 110 174 116 162')}" fill="${o.collar}" ${LT}/>`);
      if (o.frill) parts.push(`<path d="${tp('M68 168 C62 176 64 186 70 190 M132 168 C138 176 136 186 130 190')}" fill="none" stroke="${shade(o.top, 0.85)}" stroke-width="5" stroke-linecap="round"/>`);
      if (o.bib) parts.push(`<path d="${tp('M76 192 L124 192 L126 232 L74 232 Z')}" fill="${o.bottomFill}" ${L}/><path d="${tp('M76 194 L70 164 M124 194 L130 164')}" stroke="${o.bottomFill}" stroke-width="7" stroke-linecap="round"/><circle cx="${tx(78)}" cy="${ty(198)}" r="3" fill="#ffd54f"/><circle cx="${tx(122)}" cy="${ty(198)}" r="3" fill="#ffd54f"/><rect x="${tx(90)}" y="${ty(204)}" width="${20 * bw}" height="${14 * bh}" rx="3" fill="${shade(o.bottomFill, 0.85)}"/>`);
      if (o.star) parts.push(star(tx(100), ty(196), 12, o.star));
      if (o.sportStripe) parts.push(`<path d="${tp('M100 162 L100 232')}" stroke="${o.sportStripe}" stroke-width="4"/><circle cx="${tx(100)}" cy="${ty(196)}" r="10" fill="#fff" ${LT}/>${star(tx(100), ty(196), 7, '#ff7043')}`);
      if (o.vest) parts.push(`<path d="${tp('M68 166 L84 164 L88 232 L62 232 Z')}" fill="${o.vest}" ${L}/><path d="${tp('M132 166 L116 164 L112 232 L138 232 Z')}" fill="${o.vest}" ${L}/><rect x="${tx(62)}" y="${ty(222)}" width="${tx(138) - tx(62)}" height="9" fill="#8d5a34" ${LT}/><rect x="${tx(95)}" y="${ty(221)}" width="11" height="11" fill="#ffd54f" ${LT}/>`);
      if (o.emblem) parts.push(`<circle cx="${tx(100)}" cy="${ty(192)}" r="15" fill="#fff" ${LT}/>${star(tx(100), ty(192), 11, '#e53935')}`);
      if (o.belt) parts.push(`<rect x="${tx(62)}" y="${ty(222)}" width="${tx(138) - tx(62)}" height="8" fill="${o.belt}" ${LT}/>`);
    } else {
      if (o.belly) parts.push(`<ellipse cx="${tx(100)}" cy="${ty(248)}" rx="${26 * bw}" ry="${46 * bh}" fill="${o.belly}" ${LT}/>`);
      if (o.panel) parts.push(`<rect x="${tx(84)}" y="${ty(186)}" width="${32 * bw}" height="${24 * bh}" rx="4" fill="#cfd8dc" ${LT}/><circle cx="${tx(92)}" cy="${ty(198)}" r="3.5" fill="#e53935"/><circle cx="${tx(102)}" cy="${ty(198)}" r="3.5" fill="#43a047"/><circle cx="${tx(111)}" cy="${ty(198)}" r="3.5" fill="#1e88e5"/><path d="${tp('M62 238 L138 238')}" stroke="#90a4ae" stroke-width="6"/>`);
      if (o.tail === 'pom') parts.push(`<circle cx="${tx(146)}" cy="${ty(276)}" r="10" fill="#fff" ${LT}/>`);
    }

    // arms
    const [aL, aR] = POSE[pose] || POSE.front;
    [[-1, aL], [1, aR]].forEach(([side, k]) => {
      const a = ARM[k]; const sx = tx(100 + side * 30), sy = ty(172);
      const ex = sx + side * a[0], ey = sy + a[1], hx = sx + side * a[2], hy = sy + a[3];
      const d = `M${sx} ${sy} Q${ex} ${ey} ${hx} ${hy}`;
      const sl = o.sleeve === 'wing' ? o.top : o.sleeve === 'long' ? (o.grad ? o.grad[0] : o.top) : skin;
      parts.push(`<path d="${d}" fill="none" stroke="${K}" stroke-width="${o.sleeve === 'wing' ? 24 : 19}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${sl}" stroke-width="${o.sleeve === 'wing' ? 18 : 14}" stroke-linecap="round"/>`);
      if (o.sleeve === 'long' && o.pat === 'stripesR') parts.push(`<path d="${d}" fill="none" stroke="#e53935" stroke-width="14" stroke-dasharray="5 7"/>`);
      if (o.sleeve === 'short' || o.sleeve === 'puff') { const mx = (sx + ex) / 2, my = (sy + ey) / 2; parts.push(`<path d="M${sx} ${sy} L${mx.toFixed(1)} ${my.toFixed(1)}" stroke="${K}" stroke-width="${o.sleeve === 'puff' ? 26 : 21}" stroke-linecap="round"/><path d="M${sx} ${sy} L${mx.toFixed(1)} ${my.toFixed(1)}" stroke="${o.grad ? o.grad[0] : o.top}" stroke-width="${o.sleeve === 'puff' ? 21 : 16}" stroke-linecap="round"/>`); }
      if (o.sleeve === 'wing') parts.push(`<path d="M${hx - 8} ${hy + 4} L${hx - 4} ${hy + 14} L${hx} ${hy + 6} L${hx + 4} ${hy + 14} L${hx + 8} ${hy + 4}" fill="${o.top}" ${LT}/>`);
      parts.push(`<circle cx="${hx}" cy="${hy}" r="8.5" fill="${o.panel ? '#cfd8dc' : skin}" ${L}/>`);
      if (k === 'point') parts.push(`<path d="M${hx + 6} ${hy - 1} L${hx + 16} ${hy - 2}" stroke="${K}" stroke-width="8" stroke-linecap="round"/><path d="M${hx + 6} ${hy - 1} L${hx + 16} ${hy - 2}" stroke="${skin}" stroke-width="4" stroke-linecap="round"/>`);
    });

    // neck, ears, head
    parts.push(`<rect x="92" y="140" width="16" height="26" rx="6" fill="${skinD}" ${LT}/>`);
    if (!hooded) parts.push(`<circle cx="${100 - hw + 2}" cy="108" r="11" fill="${skin}" ${L}/><circle cx="${100 + hw - 2}" cy="108" r="11" fill="${skin}" ${L}/>`);
    const head = { round: `<ellipse cx="100" cy="98" rx="55" ry="56"`, oval: `<ellipse cx="100" cy="100" rx="49" ry="61"`, heart: `<path d="M100 160 C80 157 50 132 47 98 C44 60 70 42 100 42 C130 42 156 60 153 98 C150 132 120 157 100 160 Z"`, square: `<rect x="46" y="44" width="108" height="112" rx="32"` }[p.face];
    parts.push(`${head} fill="${skin}" ${L}/>`);
    parts.push(face(p, pose, skin));

    // hair front or hood front, then accessories
    if (!hooded) parts.push(`<g transform="translate(100 0) scale(${(hw / 55).toFixed(3)} 1) translate(-100 0)">${hairFront(p.hair, hc, hcD)}</g>`);
    else parts.push(hoodFront(o.hood, hw));
    if (o.bandana) parts.push(`<path d="M44 100 C38 52 70 34 100 34 C130 34 162 52 156 100 C140 82 120 76 100 76 C80 76 60 82 44 100 Z" fill="${o.bandana}" ${L}/><g fill="#fff"><circle cx="80" cy="56" r="3"/><circle cx="104" cy="48" r="3"/><circle cx="126" cy="60" r="3"/><circle cx="94" cy="66" r="2.5"/></g><path d="M150 78 C166 80 172 94 170 104 C162 98 156 94 150 92 Z M152 82 C166 92 168 108 160 116 C156 106 152 98 148 90 Z" fill="${o.bandana}" ${L}/>`);
    if (!hooded && !o.bandana) parts.push(accessory(p.acc, hw, hc));
    else if (p.acc === 'glasses') parts.push(accessory('glasses', hw, hc));
    if (o.patch) parts.push(`<path d="M46 86 L154 70" stroke="${K}" stroke-width="3"/><ellipse cx="121" cy="106" rx="13" ry="11" fill="${K}"/>`);
    if (o.helmet) parts.push(`<circle cx="100" cy="98" r="76" fill="#dff3ff" fill-opacity=".16" ${L}/><path d="M50 70 C60 46 84 32 108 32" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" opacity=".8"/><rect x="62" y="164" width="76" height="14" rx="7" fill="#cfd8dc" ${L}/>`);

    const lift = jump ? -14 : 0;
    const vb = crop === 'head' ? '18 -30 164 220' : crop === 'top' ? '0 -30 200 330' : '0 -30 200 480';
    const [, , vw, vh] = vb.split(' ').map(Number);
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" width="${vw * 2}" height="${vh * 2}">${defs(p, o)}<g filter="url(#st)" transform="translate(0 ${lift})">${parts.join('')}</g></svg>`;
  }

  const star = (x, y, r, c) => `<path d="${Array.from({ length: 10 }, (_, i) => { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r; return `${i ? 'L' : 'M'}${(x + Math.cos(a) * rr).toFixed(1)} ${(y + Math.sin(a) * rr).toFixed(1)}`; }).join(' ')} Z" fill="${c}" ${LT}/>`;

  function shoe(o, x, y, side) {
    if (o.shoe === 'feet') return `<path d="M${x} ${y - 6} L${x - 12} ${y + 6} M${x} ${y - 6} L${x} ${y + 8} M${x} ${y - 6} L${x + 12} ${y + 6}" stroke="${K}" stroke-width="8" stroke-linecap="round"/><path d="M${x} ${y - 6} L${x - 12} ${y + 6} M${x} ${y - 6} L${x} ${y + 8} M${x} ${y - 6} L${x + 12} ${y + 6}" stroke="${o.shoes}" stroke-width="4.5" stroke-linecap="round"/>`;
    if (o.shoe === 'paw') return `<ellipse cx="${x + side * 2}" cy="${y}" rx="15" ry="10" fill="${o.shoes}" ${L}/>`;
    if (o.shoe === 'boot') return `<path d="M${x - 10} ${y - 18} L${x + 10} ${y - 18} L${x + 10} ${y} C${x + 18} ${y} ${x + side * 6 + 14} ${y + 10} ${x + side * 4 + 10} ${y + 10} L${x - 12} ${y + 10} C${x - 14} ${y + 4} ${x - 12} ${y} ${x - 10} ${y} Z" fill="${o.shoes}" ${L}/>`;
    if (o.shoe === 'sneaker') return `<path d="M${x - 12} ${y - 6} C${x - 6} ${y - 10} ${x + 8} ${y - 10} ${x + 12} ${y - 2} C${x + 16} ${y + 2} ${x + 16} ${y + 8} ${x + 10} ${y + 9} L${x - 12} ${y + 9} C${x - 16} ${y + 8} ${x - 16} ${y - 2} ${x - 12} ${y - 6} Z" fill="${o.shoes}" ${L}/><path d="M${x - 14} ${y + 5} L${x + 14} ${y + 5}" stroke="#fff" stroke-width="3"/>`;
    return `<path d="M${x - 12} ${y - 4} C${x - 8} ${y - 10} ${x + 8} ${y - 10} ${x + 12} ${y - 2} C${x + 15} ${y + 4} ${x + 12} ${y + 9} ${x + 6} ${y + 9} L${x - 8} ${y + 9} C${x - 15} ${y + 9} ${x - 15} ${y} ${x - 12} ${y - 4} Z" fill="${o.shoes}" ${L}/><path d="M${x - 9} ${y - 5} L${x + 9} ${y - 5}" stroke="${K}" stroke-width="2.5"/>`;
  }

  function face(p, pose, skin) {
    const e = EYES[p.eyes], y = p.face === 'oval' ? 106 : 104, dx = p.face === 'oval' ? 19 : 21;
    let s = '';
    [100 - dx, 100 + dx].forEach((x) => {
      s += `<ellipse cx="${x}" cy="${y}" rx="8.5" ry="9.5" fill="#fff" ${LT}/><circle cx="${x}" cy="${y + 1}" r="6.6" fill="${e}"/><circle cx="${x}" cy="${y + 1}" r="3.4" fill="#2a1a14"/><circle cx="${x + 2.4}" cy="${y - 2}" r="2.2" fill="#fff"/>`;
      if (p.gender === 'girl') s += `<path d="M${x - 9} ${y - 5} L${x - 12} ${y - 9} M${x - 6} ${y - 8} L${x - 8} ${y - 12}" stroke="${K}" stroke-width="2" stroke-linecap="round" transform="${x > 100 ? `translate(${2 * x} 0) scale(-1 1)` : ''}"/>`;
      s += `<path d="M${x - 8} ${y - 15} Q${x} ${y - 20} ${x + 8} ${y - 15}" fill="none" stroke="${K}" stroke-width="2.6" stroke-linecap="round" opacity=".75"/>`;
    });
    s += `<ellipse cx="${100 - dx - 7}" cy="${y + 18}" rx="8" ry="5" fill="#ff8a80" opacity=".55"/><ellipse cx="${100 + dx + 7}" cy="${y + 18}" rx="8" ry="5" fill="#ff8a80" opacity=".55"/>`;
    s += `<path d="M97 ${y + 13} Q100 ${y + 17} 104 ${y + 14}" fill="none" stroke="${shade(skin, 0.7)}" stroke-width="2.4" stroke-linecap="round"/>`;
    const my = y + 26;
    s += pose === 'think' ? `<path d="M92 ${my} Q100 ${my + 3} 108 ${my - 1}" fill="none" ${LT}/>` : `<path d="M87 ${my - 2} Q100 ${my + 12} 113 ${my - 2} Q100 ${my + 3} 87 ${my - 2} Z" fill="#e2626f" ${LT}/>`;
    return s;
  }

  const capSwoop = 'M44 108 C38 56 70 36 100 36 C130 36 162 56 156 108 C152 92 148 82 140 74 C124 84 102 86 82 78 C70 78 58 86 52 98 C49 101 46 105 44 108 Z';
  function hairBack(style, c, d) {
    const f = `fill="${c}" ${L}`;
    switch (style) {
      case 'long': return `<path d="M44 96 C28 150 32 214 50 244 C72 254 128 254 150 244 C168 214 172 150 156 96 C150 66 130 42 100 42 C70 42 50 66 44 96 Z" ${f}/><path d="M58 170 C56 200 60 226 66 240 M142 170 C144 200 140 226 134 240" fill="none" stroke="${d}" stroke-width="3" stroke-linecap="round"/>`;
      case 'bob': return `<path d="M40 104 C34 132 38 152 50 164 C80 170 120 170 150 164 C162 152 166 132 160 104 C154 64 130 42 100 42 C70 42 46 64 40 104 Z" ${f}/>`;
      case 'curly': return `${Array.from({ length: 16 }, (_, i) => { const a = i / 16 * Math.PI * 2; return `<circle cx="${(100 + Math.cos(a) * 62).toFixed(1)}" cy="${(94 + Math.sin(a) * 58).toFixed(1)}" r="21" ${f}/>`; }).join('')}<ellipse cx="100" cy="94" rx="64" ry="60" fill="${c}"/>`;
      case 'ponytail': return `<path d="M136 64 C182 58 190 130 170 196 C164 166 156 128 132 96 Z" ${f}/><circle cx="138" cy="66" r="7" fill="#ff6fa3" ${LT}/>`;
      case 'bun': return `<circle cx="100" cy="34" r="22" ${f}/><path d="M86 30 C94 24 106 24 114 30" fill="none" stroke="${d}" stroke-width="3"/>`;
      case 'pigtails': return `<path d="M50 112 C28 114 18 148 24 180 C34 172 44 160 50 146 C52 160 52 168 50 178 C60 164 62 140 58 120 Z" ${f}/><path d="M150 112 C172 114 182 148 176 180 C166 172 156 160 150 146 C148 160 148 168 150 178 C140 164 138 140 142 120 Z" ${f}/>`;
      case 'braids': return [-1, 1].map((s) => { const x = 100 + s * 54; return Array.from({ length: 6 }, (_, i) => `<ellipse cx="${x - s * (i % 2 ? 2 : -2)}" cy="${128 + i * 20}" rx="11" ry="13" ${f}/>`).join('') + `<path d="M${x - 5} ${246} L${x} ${262} L${x + 5} ${246}" fill="${c}" ${LT}/><rect x="${x - 7}" y="${234}" width="14" height="8" rx="3" fill="#2f8c86" ${LT}/>`; }).join('');
      default: return '';
    }
  }
  function hairFront(style, c, d) {
    const f = `fill="${c}" ${L}`;
    const strands = `<path d="M78 46 C90 40 110 40 122 46" fill="none" stroke="${d}" stroke-width="2.5" stroke-linecap="round" opacity=".7"/>`;
    switch (style) {
      case 'spiky': return `<path d="M46 102 L42 70 L56 74 L56 50 L70 58 L76 36 L88 50 L100 30 L112 50 L124 36 L130 58 L144 50 L144 74 L158 70 L154 102 C150 86 140 76 128 72 C110 78 90 78 72 72 C60 76 50 86 46 102 Z" ${f}/>`;
      case 'short': return `<path d="M45 106 C40 60 66 38 100 38 C134 38 160 60 155 106 C152 92 148 80 142 72 C126 80 96 82 72 70 C60 78 50 90 45 106 Z" ${f}/>${strands}`;
      case 'bob': return `<path d="M44 112 C38 56 70 36 100 36 C130 36 162 56 156 112 L150 112 C148 92 144 82 140 76 L60 76 C56 82 52 92 50 112 Z" ${f}/>${strands}`;
      case 'curly': return `${[56, 72, 88, 104, 120, 136, 146].map((x, i) => `<circle cx="${x}" cy="${i % 2 ? 54 : 62}" r="13" ${f}/>`).join('')}`;
      case 'pigtails': return `<path d="${capSwoop}" ${f}/>${strands}<circle cx="52" cy="118" r="6" fill="#ff6fa3" ${LT}/><circle cx="148" cy="118" r="6" fill="#ff6fa3" ${LT}/>`;
      case 'braids': return `<path d="M44 112 C38 56 70 36 100 36 C130 36 162 56 156 112 C150 90 140 74 120 66 C110 74 104 80 100 84 C96 80 90 74 80 66 C60 74 50 90 44 112 Z" ${f}/>`;
      default: return `<path d="${capSwoop}" ${f}/>${strands}`;
    }
  }
  function hoodBack(h) {
    const f = `fill="${h.fill}" ${L}`;
    let s = '';
    if (h.kind === 'bunny') s += `<path d="M70 50 C56 10 60 -24 74 -26 C88 -24 90 14 86 46 Z" ${f}/><path d="M73 40 C66 12 68 -12 75 -16 C82 -12 82 14 80 40 Z" fill="#ffd1e3"/><path d="M130 50 C144 10 140 -24 126 -26 C112 -24 110 14 114 46 Z" ${f}/><path d="M127 40 C134 12 132 -12 125 -16 C118 -12 118 14 120 40 Z" fill="#ffd1e3"/>`;
    if (h.kind === 'bear') s += `<circle cx="50" cy="44" r="20" ${f}/><circle cx="50" cy="44" r="10" fill="#e9c79a"/><circle cx="150" cy="44" r="20" ${f}/><circle cx="150" cy="44" r="10" fill="#e9c79a"/>`;
    if (h.kind === 'dino') s += `${[[60, 34, 44, 10], [82, 22, 74, -4], [106, 20, 102, -8], [128, 28, 132, 0], [146, 44, 158, 22]].map(([x, y, px, py]) => `<path d="M${x - 10} ${y + 8} L${px} ${py} L${x + 12} ${y + 4} Z" fill="#ff9f1c" ${L}/>`).join('')}`;
    if (h.kind === 'chicken') s += `<circle cx="88" cy="22" r="11" fill="#e53935" ${L}/><circle cx="104" cy="14" r="12" fill="#e53935" ${L}/><circle cx="119" cy="24" r="10" fill="#e53935" ${L}/>`;
    if (h.kind === 'banana') return `<path d="M108 -14 C140 20 172 60 166 112 C162 152 140 172 100 172 C60 172 38 152 34 112 C30 64 66 26 96 -6 Z" ${f}/><path d="M96 -6 L92 -22 L104 -24 L108 -14 Z" fill="#6d4c2f" ${L}/><path d="M60 40 C50 70 46 110 52 150" fill="none" stroke="#e6b800" stroke-width="3"/>`;
    return s + `<path d="M100 26 C146 26 170 64 168 106 C166 146 140 170 100 170 C60 170 34 146 32 106 C30 64 54 26 100 26 Z" ${f}/>`;
  }
  function hoodFront(h, hw) {
    const f = `fill="${h.fill}" ${L}`;
    let s = `<path d="M${100 - hw - 2} 110 C${100 - hw - 6} 56 70 36 100 36 C130 36 ${100 + hw + 6} 56 ${100 + hw + 2} 110 C${100 + hw - 6} 84 128 70 100 70 C72 70 ${100 - hw + 6} 84 ${100 - hw - 2} 110 Z" ${f}/>`;
    if (h.kind === 'chicken') s += `<path d="M90 50 L110 50 L100 66 Z" fill="#ff9f1c" ${L}/><circle cx="84" cy="48" r="5" fill="${K}"/><circle cx="116" cy="48" r="5" fill="${K}"/><circle cx="85.5" cy="46.5" r="1.8" fill="#fff"/><circle cx="117.5" cy="46.5" r="1.8" fill="#fff"/>`;
    if (h.kind === 'dino') s += `<circle cx="80" cy="48" r="7" fill="#fff" ${LT}/><circle cx="120" cy="48" r="7" fill="#fff" ${LT}/><circle cx="81" cy="49" r="3.5" fill="${K}"/><circle cx="121" cy="49" r="3.5" fill="${K}"/><path d="M84 60 L90 66 L96 60 L102 66 L108 60 L114 66 L118 60" fill="#fff" ${LT}/>`;
    if (h.kind === 'bear' || h.kind === 'bunny') s += `<ellipse cx="100" cy="50" rx="9" ry="6" fill="${h.kind === 'bear' ? '#4a2f27' : '#ff9ec4'}"/>`;
    return s;
  }
  function accessory(a, hw, hc) {
    switch (a) {
      case 'headband': return `<path d="M${100 - hw + 2} 92 C${100 - hw + 6} 50 70 38 100 38 C130 38 ${100 + hw - 6} 50 ${100 + hw - 2} 92" fill="none" stroke="${K}" stroke-width="13" stroke-linecap="round"/><path d="M${100 - hw + 2} 92 C${100 - hw + 6} 50 70 38 100 38 C130 38 ${100 + hw - 6} 50 ${100 + hw - 2} 92" fill="none" stroke="#e0393b" stroke-width="8" stroke-linecap="round"/>`;
      case 'bow': return `<g transform="translate(136 46) rotate(18)"><path d="M0 0 C-12 -16 -30 -12 -28 2 C-26 14 -12 12 0 0 Z M0 0 C12 -16 30 -12 28 2 C26 14 12 12 0 0 Z" fill="#ff5c9a" ${L}/><circle r="6" fill="#ff8fbd" ${L}/></g>`;
      case 'flower': return `<g transform="translate(138 58)">${[0, 72, 144, 216, 288].map((d) => `<circle cx="${(Math.cos(d * Math.PI / 180) * 8).toFixed(1)}" cy="${(Math.sin(d * Math.PI / 180) * 8).toFixed(1)}" r="7" fill="#fff" ${LT}/>`).join('')}<circle r="5.5" fill="#ffc107" ${LT}/></g>`;
      case 'crown': return `<path d="M68 46 L64 14 L82 30 L100 6 L118 30 L136 14 L132 46 Z" fill="#ffca28" ${L}/><circle cx="100" cy="34" r="5" fill="#e53935" ${LT}/><circle cx="80" cy="38" r="3.5" fill="#42a5f5"/><circle cx="120" cy="38" r="3.5" fill="#9b59b6"/>`;
      case 'hat': return `<ellipse cx="100" cy="52" rx="${hw + 26}" ry="14" fill="#f3d27a" ${L}/><path d="M64 52 C64 18 136 18 136 52 Z" fill="#f3d27a" ${L}/><path d="M65 44 C80 48 120 48 135 44 L136 52 C120 56 80 56 64 52 Z" fill="#ff6fa3" ${LT}/>`;
      case 'cap': return `<path d="M48 70 C48 22 152 22 152 70 Z" fill="#1e88e5" ${L}/><path d="M48 70 C40 72 24 74 18 80 C30 84 46 80 60 74 Z" fill="#1565c0" ${L}/><circle cx="100" cy="30" r="4" fill="#fff"/>`;
      case 'glasses': return `<g fill="#ffffff55" stroke="#c2185b" stroke-width="4"><circle cx="79" cy="105" r="13"/><circle cx="121" cy="105" r="13"/></g><path d="M92 103 Q100 98 108 103" fill="none" stroke="#c2185b" stroke-width="4"/>`;
      default: return '';
    }
  }

  const cache = new Map();
  function src(p, pose = 'front', crop = '') {
    const k = JSON.stringify(valid(p)) + pose + crop;
    let u = cache.get(k);
    if (!u) { u = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg(p, pose, crop)); if (cache.size > 400) cache.clear(); cache.set(k, u); }
    return u;
  }
  return { HAIR, HAIR_COLOURS, EYES, FACES, SKIN, BODIES, OUTFITS, FUNNY, ACCS, PRESETS, DEFAULT, GIRL_NAMES, BOY_NAMES, valid, random, withGender, svg, src };
})();


/* ===== src/24-paint.js ===== */
/* Lea Learns — dress-up for every character in the ORIGINAL painted style (Lea, Ines, Leo, plus Maya and Sam as creator bases).
   Costumes are painted variants of the same illustrations (assets/character/look/<who>-<outfit>-<pose>.webp, all 7 poses).
   Hair colour is changed on the painted art itself: a per-image hair mask (assets/character/hair/<image>.png) tells
   which pixels are hair, and those pixels get the new colour while keeping the brush-stroke light and shade. */
const PAINT = (() => {
  const OUTFITS = ['original', 'chicken', 'dino', 'bunny', 'princess', 'superhero', 'pirate', 'astronaut', 'banana'];
  const HAIR = ['original', ...Object.keys(AV.HAIR_COLOURS)];
  const ORIGINAL_HAIR = { lea: '#c9965f', ines: '#4a2f22', leo: '#7a4a2a', maya: '#1c1410', sam: '#1d1511' };
  /* Painted bodies: Lea, Ines and Leo are ready-made players; all five are bases for "Create your character". */
  const BASES = ['lea', 'ines', 'leo', 'maya', 'sam'];
  const BOYS = ['leo', 'sam'];
  const base = (who, pose, outfit) => {
    const o = outfit && outfit !== 'original' ? outfit : 'original';
    return o === 'original' && (who === 'lea' || who === 'ines') ? `assets/character/${who}-${pose}.png` : `assets/character/look/${who}-${o}-${pose}.webp`;
  };
  const maskOf = (who, pose, outfit) => `assets/character/hair/${who}${outfit && outfit !== 'original' ? '-' + outfit : ''}-${pose}.png`;
  const valid = (l) => {
    const o = Object.assign({ outfit: 'original', hairColour: 'original' }, l || {});
    if (!OUTFITS.includes(o.outfit)) o.outfit = 'original';   // older (1.3.0) looks used vector outfits: fall back to the painted dress
    if (!HAIR.includes(o.hairColour)) o.hairColour = 'original';
    return { outfit: o.outfit, hairColour: o.hairColour };
  };
  const isOriginal = (l) => { const v = valid(l); return v.outfit === 'original' && v.hairColour === 'original'; };
  const cache = new Map(), pending = new Map();
  const key = (who, pose, l) => `${who}|${pose}|${l.outfit}|${l.hairColour}`;
  const load = (src) => new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; });
  const hex = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16) / 255);
  function rgb2hsl(r, g, b) {
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2; let h = 0, s = 0;
    if (mx !== mn) { const d = mx - mn; s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
      h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h /= 6; }
    return [h, s, l];
  }
  function hsl2rgb(h, s, l) {
    if (!s) return [l, l, l];
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
    const f = (t) => { t = (t + 1) % 1; return t < 1 / 6 ? p + (q - p) * 6 * t : t < 1 / 2 ? q : t < 2 / 3 ? p + (q - p) * (2 / 3 - t) * 6 : p; };
    return [f(h + 1 / 3), f(h), f(h - 1 / 3)];
  }
  /* Recolour: keep each hair pixel's lightness relative to the average hair lightness, swap hue and saturation for the new colour. */
  async function render(who, pose, l) {
    const [img, mimg] = await Promise.all([load(base(who, pose, l.outfit)), load(maskOf(who, pose, l.outfit))]);
    const W = img.naturalWidth, H = img.naturalHeight;
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const x = c.getContext('2d', { willReadFrequently: true });
    x.drawImage(mimg, 0, 0, W, H); const m = x.getImageData(0, 0, W, H).data;
    x.clearRect(0, 0, W, H); x.drawImage(img, 0, 0); const id = x.getImageData(0, 0, W, H), d = id.data;
    let sw = 0, sl = 0, y0 = H, y1 = 0;
    for (let i = 0, n = W * H; i < n; i++) { const a = m[i * 4] / 255; if (a > 0.5) { const p = i * 4; sl += a * (0.299 * d[p] + 0.587 * d[p + 1] + 0.114 * d[p + 2]) / 255; sw += a; const yy = (i / W) | 0; if (yy < y0) y0 = yy; if (yy > y1) y1 = yy; } }
    if (!sw) return base(who, pose, l.outfit);
    const meanL = sl / sw, rainbow = l.hairColour === 'rainbow';
    const [th, ts, tl] = rainbow ? [0, 0.85, 0.6] : rgb2hsl(...hex(AV.HAIR_COLOURS[l.hairColour]));
    const k = tl < 0.3 ? 0.55 : 0.85, span = Math.max(1, y1 - y0);
    for (let i = 0, n = W * H; i < n; i++) {
      const a = m[i * 4] / 255; if (a < 0.02) continue;
      const p = i * 4, r = d[p] / 255, g = d[p + 1] / 255, b = d[p + 2] / 255;
      const L = 0.299 * r + 0.587 * g + 0.114 * b;
      const nl = Math.min(0.96, Math.max(0.04, tl + (L - meanL) * k));
      const hh = rainbow ? (((i / W) | 0) - y0) / span * 0.83 : th;
      const [nr, ng, nb] = hsl2rgb(hh, ts * (1 - Math.max(0, nl - 0.8)), nl);
      d[p] = (r * (1 - a) + nr * a) * 255; d[p + 1] = (g * (1 - a) + ng * a) * 255; d[p + 2] = (b * (1 - a) + nb * a) * 255;
    }
    x.putImageData(id, 0, 0);
    const blob = await new Promise((res) => c.toBlob(res, 'image/png'));
    return blob ? URL.createObjectURL(blob) : c.toDataURL('image/png');
  }
  /* Synchronous answer for <img src>: the finished variant if ready, else the right outfit with original hair while the colour is painted. */
  function src(who, pose, look) {
    const l = valid(look);
    if (l.hairColour === 'original') return base(who, pose, l.outfit);
    const kk = key(who, pose, l);
    if (cache.has(kk)) return cache.get(kk);
    prepare(who, l, [pose]).then(refresh);
    return base(who, pose, l.outfit);
  }
  function prepare(who, look, poses = POSES) {
    const l = valid(look);
    if (l.hairColour === 'original') return Promise.resolve();
    return Promise.all(poses.map((pose) => {
      const kk = key(who, pose, l);
      if (cache.has(kk)) return null;
      if (!pending.has(kk)) pending.set(kk, render(who, pose, l).then((u) => { cache.set(kk, u); pending.delete(kk); }).catch(() => pending.delete(kk)));
      return pending.get(kk);
    }));
  }
  /* Repaint any character image on screen that is still showing a placeholder. */
  function refresh() {
    $$('img.lea[data-who][data-pose]').forEach((im) => { const s = poseSrc(im.dataset.pose, im.dataset.who); if (im.getAttribute('src') !== s) im.src = s; });
  }
  /* A custom character: painted base + outfit + hair colour + name. */
  const validChar = (c) => Object.assign({}, c, valid(c), { base: BASES.includes(c && c.base) ? c.base : 'maya' });
  /* 1.3.x characters were drawn as vectors: move them to the nearest painted base, keeping name, outfit and hair colour where they exist. */
  function fromVector(c) {
    const dark = ['tan', 'brown', 'deep'].includes(c.skin);
    const b = c.gender === 'boy' ? (dark ? 'sam' : 'leo') : dark ? 'maya' : ['black', 'brunette'].includes(c.hairColour) ? 'ines' : 'lea';
    const outfit = c.outfit === 'bear' ? 'bunny' : c.outfit;
    // a natural colour close to the painted child's own hair keeps the painting untouched; fun colours are recoloured
    const own = { lea: ['blonde'], ines: ['brunette', 'black'], leo: ['brunette'], maya: ['black', 'brunette'], sam: ['black', 'brunette'] }[b];
    const hairColour = own.includes(c.hairColour) ? 'original' : c.hairColour;
    return Object.assign(validChar({ base: b, outfit, hairColour }), { id: c.id, name: c.name });
  }
  return { OUTFITS, HAIR, ORIGINAL_HAIR, BASES, BOYS, valid, validChar, fromVector, isOriginal, src, prepare, base, render };
})();


/* ===== src/30-audio.js ===== */
/* Speech (pre-recorded clips, speechSynthesis fallback), Web Audio sound effects,
   and a looping original background music bed. Prefer a pleasant girl's voice. */
const Audio = (() => {
  let ctx = null, master = null;
  const synth = window.speechSynthesis;
  const voices = {}; // 'en' | 'pl' | 'ru' -> SpeechSynthesisVoice | null
  /* Named female voices on iOS, macOS, Android and Windows. Word boundaries avoid accidental matches. */
  const FEMALE = /\b(serena|kate|martha|stephanie|libby|sonia|hazel|samantha|susan|allison|alice|ava|zoe|zoey|nicky|nicole|joelle|kathy|katie|vicki|victoria|karen|moira|tessa|fiona|zira|aria|jenny|jenna|anna|ana|sara|sarah|emma|emily|olivia|amy|linda|lisa|lucy|mary|heather|jill|josie|zosia|zofia|ewa|eva|paulina|agnieszka|milena|katya|katia|svetlana|irina|dariya|daria|elena|katerina|ekaterina|oksana|female|woman|girl|skye|kelly|pauline|iwona|siri)\b|google uk english female|google us english|google polski|google русский/i;
  const MALE = /\b(daniel|david|dave|fred|alex|tom|thomas|oliver|arthur|aaron|gordon|george|james|nathan|rishi|ralph|bruce|albert|eddy|reed|rocko|grandpa|marek|adam|yuri|yuriy|dmitri|dmitry|male|man|boy|guy|mark|ryan|christopher|ivan|sergey|pavel)\b|google uk english male/i;
  const NOVELTY = /compact|eloquence|novelty|whisper|bad news|bells|bubbles|cellos|organ|zarvox|trinoids|boing|jester|superstar|wobble|grandpa|grandma|albert|bahh|reed|rocko|sandy|shelley|flo|eddy|princess|junior|bahh|pipes|good news|cellos/i;
  let listLoaded = false;
  function scoreVoice(v, L) {
    const name = v.name || '';
    const loc = (v.lang || '').toLowerCase().replace('_', '-');
    if (NOVELTY.test(name)) return -200;
    let s = 0;
    const girl = FEMALE.test(name);
    const boy = MALE.test(name);
    if (girl && !boy) s += 80;
    else if (boy) s -= 60;
    if (/enhanced|premium|neural|natural|wavenet|studio/i.test(name)) s += 12;
    if (v.localService) s += 8;
    if (L === 'en') {
      if (girl && /gb|en-uk/.test(loc)) s += 18;      // Serena, Kate — British and female
      else if (girl) s += 14;                          // Samantha (US) beats Daniel (GB)
      else if (/gb/.test(loc) && !boy) s += 4;
    }
    return s;
  }
  function pickVoices() {
    if (!synth) return;
    const vs = synth.getVoices();
    if (!vs.length) return;
    listLoaded = true;
    for (const L of ['en', 'pl', 'ru']) {
      const all = vs.filter((v) => v.lang.toLowerCase().replace('_', '-').startsWith(L));
      if (!all.length) { voices[L] = null; continue; }
      const ranked = all.slice().sort((a, b) => scoreVoice(b, L) - scoreVoice(a, L) || a.name.localeCompare(b.name));
      voices[L] = ranked[0] || null;
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

  /* Pre-recorded clips (assets/voice). Two banks: a girl's voice (default, precached) and a
     boy's voice (assets/voice/boy, cached on first use) — the current guide decides which.
     Fallback: device speechSynthesis. */
  let clipManifest = null, clipLoading = null;
  let boyManifest = null, boyLoading = null, boyWarm = false, lastClips = [];
  const clipPlayer = (typeof window !== 'undefined' && window.Audio) ? new window.Audio() : null;
  if (clipPlayer) { clipPlayer.setAttribute('playsinline', ''); clipPlayer.preload = 'auto'; }
  function clipKey(L, text) { return L + ':' + String(text).trim(); }
  const getJson = (u) => fetch(u).then((r) => r.ok ? r.json() : {}).catch(() => ({}));
  function loadClips() {
    if (clipManifest) return Promise.resolve(clipManifest);
    if (clipLoading) return clipLoading;
    clipLoading = getJson('assets/voice/manifest.json').then((m) => { clipManifest = m || {}; return clipManifest; });
    return clipLoading;
  }
  function loadBoy() {
    if (boyManifest) return Promise.resolve(boyManifest);
    if (boyLoading) return boyLoading;
    boyLoading = getJson('assets/voice/boy/manifest.json').then((m) => { boyManifest = m || {}; return boyManifest; });
    return boyLoading;
  }
  loadClips();
  /* 'girl' | 'boy' — from the current guide character (40-ui.js). */
  const voiceKind = () => { try { return guideVoice(); } catch (e) { return 'girl'; } };
  /* Once a boy is the guide, quietly fetch his whole bank so it also works offline (the service worker keeps it). */
  function warmBoy() {
    if (boyWarm) return; boyWarm = true;
    loadBoy().then((m) => {
      const urls = [...new Set(Object.values(m))]; let i = 0;
      const one = () => (i < urls.length ? fetch(urls[i++]).catch(() => {}).then(() => new Promise((r) => setTimeout(r, 30))).then(one) : null);
      const start = () => { one(); one(); };
      if (window.requestIdleCallback) requestIdleCallback(start, { timeout: 4000 }); else setTimeout(start, 1500);
    });
  }
  function clipsFor(list) {
    if (!clipManifest) return null;
    const boy = voiceKind() === 'boy' ? (boyManifest || {}) : null;
    const urls = list.map((p) => (p.tts ? { tts: p } : (boy && boy[clipKey(p.L, p.t)]) || clipManifest[clipKey(p.L, p.t)]));
    return urls.every(Boolean) ? urls : null;
  }

  /* Cheerful original music-box loop. Decoded into an AudioBuffer and looped
     sample-accurately, so the repeat has no MP3 encoder gap. */
  const MUSIC_URL = 'assets/music/theme.mp3';
  const MUSIC_SAMPLES = 1568000;
  const MUSIC_VOL = 0.32;
  const MUSIC_DUCK = 0.08;
  const MUSIC_FP = [0.112491,0.107608,0.109745,0.110721,0.107761,0.110660,0.111148,0.104923,0.098453,0.103244,0.104831,0.103854,0.105533,0.098849,0.100558,0.107028,0.106113,0.109775,0.113376,0.111118,0.102634,0.097781,0.102847,0.108158,0.115665,0.123203,0.119419,0.108982,0.094363,0.095798,0.102329,0.094302,0.084323,0.080599,0.069460,0.081210,0.092318,0.080325,0.047029,0.039216,0.042512,0.045900,0.063875,0.085452,0.060793,0.018097,0.001221,-0.008026,-0.027863,-0.041353,-0.021699,0.009644,-0.011200,-0.066652,-0.069430,-0.045198,-0.056215,-0.098239,-0.106021,-0.075900,-0.081179,-0.136662,-0.153691,-0.120090,-0.088626,-0.103427,-0.115482,-0.119999,-0.117557,-0.132756,-0.157872,-0.177892,-0.192083,-0.204596,-0.214911,-0.185583,-0.158574,-0.135929,-0.095676,-0.083834,-0.111301,-0.121830,-0.103336,-0.109073,-0.105228,-0.067110,-0.053896,-0.083651,-0.081057,-0.057314,-0.070986,-0.057405,-0.056185,-0.133457,-0.171484,-0.126316,-0.050722,-0.021271,-0.044435,-0.028352,-0.014039,-0.064455,-0.075991,-0.072573,-0.131199,-0.130039,-0.064821,-0.045137,-0.056642,-0.077212,-0.092898,-0.075350,-0.042634,-0.012909,-0.009613,-0.052217,-0.152196,-0.181036,-0.127415,-0.124119,-0.139225,-0.146886,-0.170110,-0.185369,-0.123417,-0.029420,0.010865,0.002045];
  let musicBuf = null, musicSrc = null, musicGain = null, musicAb = null, musicLoading = null;
  let musicPos = 0, musicStartedAt = 0, duckCount = 0, musicWanted = false;

  function prefetchMusic() {
    fetch(MUSIC_URL).then((r) => r.ok ? r.arrayBuffer() : null).then((ab) => { musicAb = ab; }).catch(() => {});
  }
  prefetchMusic();

  function musicTargetVol() {
    if (!Store.settings.music) return 0;
    return duckCount > 0 ? MUSIC_DUCK : MUSIC_VOL;
  }
  function applyMusicVol(quick) {
    if (!musicGain || !ctx) return;
    const g = musicGain.gain, t = ctx.currentTime, v = musicTargetVol();
    const dur = quick ? 0.05 : (duckCount > 0 ? 0.25 : 0.55);
    try { g.cancelScheduledValues(t); g.setValueAtTime(g.value, t); g.linearRampToValueAtTime(v, t + dur); }
    catch (e) { try { g.value = v; } catch (e2) {} }
  }
  function duckMusic(on) {
    if (on) duckCount += 1;
    else duckCount = Math.max(0, duckCount - 1);
    applyMusicVol();
  }
  function trimMusic(buf) {
    if (!buf || !buf.length || !ctx) return buf;
    const ch0 = buf.getChannelData(0);
    const fl = MUSIC_FP.length;
    let fpN = 0; for (let i = 0; i < fl; i++) fpN += MUSIC_FP[i] * MUSIC_FP[i];
    fpN = Math.sqrt(fpN) + 1e-12;
    let best = 0, bestS = -1;
    const limit = Math.min(4000, Math.max(0, ch0.length - fl));
    for (let off = 0; off <= limit; off++) {
      let d = 0, n = 0;
      for (let i = 0; i < fl; i++) { const v = ch0[off + i]; d += MUSIC_FP[i] * v; n += v * v; }
      const s = d / (fpN * (Math.sqrt(n) + 1e-12));
      if (s > bestS) { bestS = s; best = off; }
    }
    const want = MUSIC_SAMPLES;
    const n = Math.min(want, buf.length - best);
    if (n < want * 0.95) return buf;
    if (best === 0 && n === buf.length) return buf;
    const out = ctx.createBuffer(buf.numberOfChannels, n, buf.sampleRate);
    for (let ch = 0; ch < buf.numberOfChannels; ch++) out.getChannelData(ch).set(buf.getChannelData(ch).subarray(best, best + n));
    return out;
  }
  function decodeMusic(c, ab) {
    return new Promise((resolve) => {
      let settled = false;
      const done = (b) => { if (settled) return; settled = true; resolve(b || null); };
      try {
        const p = c.decodeAudioData(ab.slice(0), done, () => done(null));
        if (p && p.then) p.then(done, () => done(null));
      } catch (e) { done(null); }
    });
  }
  function loadMusic() {
    if (musicBuf) return Promise.resolve(musicBuf);
    if (musicLoading) return musicLoading;
    const c = ensureCtx();
    if (!c) return Promise.resolve(null);
    musicLoading = (musicAb ? Promise.resolve(musicAb) : fetch(MUSIC_URL).then((r) => r.ok ? r.arrayBuffer() : null))
      .then((ab) => { if (ab) musicAb = ab; return ab ? decodeMusic(c, ab) : null; })
      .then((buf) => { musicBuf = buf ? trimMusic(buf) : null; musicLoading = null; return musicBuf; })
      .catch(() => { musicLoading = null; return null; });
    return musicLoading;
  }
  function currentMusicPos() {
    if (!ctx || !musicSrc || !musicBuf) return musicPos;
    return (musicPos + (ctx.currentTime - musicStartedAt)) % (musicBuf.duration || 1);
  }
  function stopMusicSrc() {
    if (!musicSrc) return;
    try { musicPos = currentMusicPos(); musicSrc.onended = null; musicSrc.stop(); } catch (e) {}
    musicSrc = null;
  }
  function startMusic() {
    musicWanted = true;
    if (!unlocked || !Store.settings.music) return;
    const c = ensureCtx();
    if (!c) return;
    const go = (buf) => {
      if (!buf || !musicWanted || !Store.settings.music || musicSrc) return;
      if (!musicGain) {
        musicGain = c.createGain();
        musicGain.gain.value = 0;
        musicGain.connect(master || c.destination);
      }
      applyMusicVol(true);
      const src = c.createBufferSource();
      src.buffer = buf;
      src.loop = true;
      src.loopStart = 0;
      src.loopEnd = buf.duration;
      src.connect(musicGain);
      const pos = ((musicPos % buf.duration) + buf.duration) % buf.duration;
      try { src.start(0, pos); } catch (e) { try { src.start(0); } catch (e2) {} }
      musicStartedAt = c.currentTime;
      musicSrc = src;
    };
    if (musicBuf) go(musicBuf);
    else loadMusic().then(go);
  }
  function stopMusic() {
    musicWanted = false;
    if (musicGain && ctx) {
      const g = musicGain.gain, t = ctx.currentTime;
      try { g.cancelScheduledValues(t); g.setValueAtTime(g.value, t); g.linearRampToValueAtTime(0, t + 0.3); } catch (e) {}
    }
    setTimeout(() => { if (!musicWanted) stopMusicSrc(); }, 360);
  }
  function setMusic(on) { if (on) startMusic(); else stopMusic(); }
  if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stopMusicSrc();
      else if (Store.settings.music && unlocked) startMusic();
    });
  }

  /* Must be called from inside a tap handler (iOS Safari rule). */
  let unlocked = false;
  function unlock() {
    const c = ensureCtx();
    if (c) { const b = c.createBuffer(1, 1, 22050); const s = c.createBufferSource(); s.buffer = b; s.connect(c.destination); s.start(0); }
    if (synth && !unlocked) { try { const u = new SpeechSynthesisUtterance(' '); u.volume = 0; synth.speak(u); } catch (e) {} }
    if (clipPlayer && !unlocked) {
      try {
        clipPlayer.muted = true;
        clipPlayer.src = 'assets/voice/silence.mp3';
        const p = clipPlayer.play();
        if (p && p.then) p.then(() => { clipPlayer.pause(); clipPlayer.muted = false; }).catch(() => { clipPlayer.muted = false; });
        else clipPlayer.muted = false;
      } catch (e) { clipPlayer.muted = false; }
    }
    unlocked = true;
    pickVoices();
    loadClips();
    startMusic();
  }

  let queueToken = 0;
  /* say(['Pokaż', EN('apple')]): plain strings are guide speech in the interface language,
     EN(...) parts are English target vocabulary, always in an English voice. */
  function partsList(parts) {
    const ui = lang();
    return (Array.isArray(parts) ? parts : [parts])
      .flat()
      .map((p) => (typeof p === 'string' ? { t: p, L: ui } : p.name ? { t: p.name, L: ui, tts: true } : { t: p.en, L: 'en' }))
      .filter((p) => p.t);
  }
  function playClips(urls, opts = {}) {
    const token = ++queueToken;
    if (synth) { synth.cancel(); }
    if (!clipPlayer) return Promise.resolve();
    return new Promise((resolve) => {
      let i = 0;
      const next = () => {
        if (token !== queueToken || i >= urls.length) return resolve();
        const url = urls[i++];
        lastClips.push(url && url.tts ? 'tts:' + url.tts.t : url); if (lastClips.length > 40) lastClips.shift();
        let done = false;
        const fin = () => {
          if (done) return; done = true;
          clipPlayer.onended = null; clipPlayer.onerror = null;
          setTimeout(next, 80);
        };
        if (url && url.tts) { // a custom name: no clip, use the device voice for just this part
          if (!synth) return fin();
          const u = new SpeechSynthesisUtterance(url.tts.t); const v = voices[url.tts.L];
          if (v) u.voice = v; u.lang = v ? v.lang : LOCALE[url.tts.L]; u.pitch = voiceKind() === 'boy' ? 1.15 : 1.45; u.rate = 1;
          u.onend = fin; u.onerror = fin; setTimeout(fin, 1200 + url.tts.t.length * 160);
          try { synth.cancel(); synth.speak(u); } catch (e) { fin(); }
          return;
        }
        clipPlayer.onended = fin;
        clipPlayer.onerror = fin;
        try {
          clipPlayer.muted = false;
          clipPlayer.playbackRate = opts.clipRate || 1;
          clipPlayer.src = url;
          const p = clipPlayer.play();
          if (p && p.catch) p.catch(fin);
        } catch (e) { fin(); }
        setTimeout(fin, 7000);
      };
      next();
    });
  }
  let live = 0; // how many say() calls are still playing (the tour waits for quiet before it talks)
  function say(parts, opts = {}) {
    if (!Store.settings.voice) return Promise.resolve();
    live++; const done = (r) => { live = Math.max(0, live - 1); return r; };
    return say0(parts, opts).then(done, done);
  }
  function say0(parts, opts = {}) {
    duckMusic(true);
    const list = partsList(parts);
    const go = () => {
      const urls = clipsFor(list);
      if (urls && urls.length) return playClips(urls, opts);
      // Fallback: device speechSynthesis, pitched for a girl or a boy guide.
      if (!synth) return Promise.resolve();
      const spoken = list.filter((p) => !listLoaded || voices[p.L] || p.L === 'en');
      const token = ++queueToken;
      synth.cancel();
      if (synth.paused) synth.resume();
      return new Promise((resolve) => {
        let i = 0;
        const next = () => {
          if (token !== queueToken || i >= spoken.length) return resolve();
          const p = spoken[i++];
          const u = new SpeechSynthesisUtterance(p.t);
          const v = voices[p.L];
          if (v) u.voice = v;
          u.lang = v ? v.lang : LOCALE[p.L];
          u.rate = opts.rate || (p.L === 'en' ? 0.95 : 1.0);
          u.pitch = opts.pitch || (voiceKind() === 'boy' ? 1.15 : 1.45);
          let done = false;
          const fin = () => { if (done) return; done = true; setTimeout(next, 120); };
          u.onend = fin; u.onerror = fin;
          setTimeout(fin, 1000 + p.t.length * 150);
          synth.speak(u);
        };
        setTimeout(next, 40);
      });
    };
    const boy = voiceKind() === 'boy';
    if (boy) warmBoy();
    const p = clipManifest && (!boy || boyManifest) ? go() : Promise.all([loadClips(), boy ? loadBoy() : null]).then(go);
    return Promise.resolve(p).then((r) => { duckMusic(false); return r; }, () => { duckMusic(false); });
  }
  function hush() {
    queueToken++; live = 0;
    duckCount = 0;
    applyMusicVol();
    if (synth) synth.cancel();
    if (clipPlayer) { try { clipPlayer.pause(); clipPlayer.removeAttribute('src'); clipPlayer.load(); } catch (e) {} }
  }

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

  return { get speaking() { return live > 0; }, get voiceKind() { return voiceKind(); }, get lastClips() { return lastClips.slice(); }, resetClips() { lastClips = []; }, warmBoy, unlock, say, hush, sfx, setMusic, voiceFor: (L) => (voices[L] ? `${voices[L].name} (${voices[L].lang})` : ''), get hasSpeech() { return !!synth; }, get listLoaded() { return listLoaded; } };
})();


/* ===== src/40-ui.js ===== */
/* Lea Learns — shared UI: screens, the Lea companion, taps, celebrations. */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const POSES = ['front', 'wave', 'cheer', 'point', 'sit', 'think', 'jump'];
/* Characters: ready-made Lea, Ines and Leo plus custom ones; all painted (see 24-paint.js). */
const BUILTIN = ['lea', 'ines', 'leo'];
const isBuiltin = (who) => BUILTIN.includes(who);
const allChars = () => [...BUILTIN, ...Store.chars.map((c) => c.id)];
const lookOf = (who) => (isBuiltin(who) ? Store.look(who) : Store.char(who));
const player = () => (allChars().includes(Store.settings.player) ? Store.settings.player : 'lea');
/* Boys (Leo, or a custom child built on a boy base) speak with the boy's voice bank. */
const isBoyChar = (who = player()) => who === 'leo' || (!isBuiltin(who) && !!Store.char(who) && PAINT.BOYS.includes(PAINT.validChar(Store.char(who)).base));
const guideVoice = () => (isBoyChar() ? 'boy' : 'girl');
const playerName = (who = player()) => (isBuiltin(who) ? NAMES[who][lang()] : (Store.char(who) || {}).name || '?');
const playerSay = () => (lang() === 'en' && isBuiltin(player()) ? NAMES[player()].sayEn : playerName());
/* Speech lines that contain the player's name: recorded clips for Lea / Ines / Leo, device voice for a custom name. */
const hiSpeech = () => (isBuiltin(player()) ? T('hi', playerSay()) : [T('hello'), NAME(playerName() + '!')]);
const wellDoneSpeech = () => (isBuiltin(player()) ? T('wellDone', playerSay()) : [T('praise')[1], NAME(playerName() + '!')]);
const poseSrc = (pose, who = player()) => {
  if (isBuiltin(who)) { const l = Store.look(who); return l ? PAINT.src(who, pose, l) : PAINT.base(who, pose); } // painted art, same style
  const c = Store.char(who); if (!c) return PAINT.base('lea', pose);
  const v = PAINT.validChar(c); return PAINT.src(v.base, pose, v);
};
const leaImg = (pose, cls = '', who = player()) => `<img class="lea ${cls}" src="${poseSrc(pose, who)}" alt="${playerName(who)}" draggable="false" data-pose="${pose}" data-who="${who}">`;

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
  Tour.stop(false);
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
  const gl = el.querySelector('.guide .guide-lea'); // tap the guide → she explains this screen again
  if (gl) { gl.classList.add('tappable'); onTap(gl, () => Tour.replay(), { sound: 'pop' }); }
  later(() => Tour.auto(name, params), name === 'home' ? 1500 : 900);
}

/* Top bar used by every activity screen. */
function topBar({ back, title, art: icon, colour }) {
  const bar = h(`<header class="bar">
    <button class="round-btn home-btn" aria-label="Back">${back === 'home' ? ICON.home : ICON.back}</button>
    <div class="bar-title" style="--c:${colour || 'var(--red)'}">${icon ? `<span class="bar-icon">${art(icon)}</span>` : ''}<span>${title}</span></div>
    <div class="apples-chip" aria-label="Apples">${art('apple')}<b>${Store.data.apples}</b></div>
  </header>`);
  bar.insertBefore(Tour.button(), bar.querySelector('.apples-chip'));
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
  Audio.say([wellDoneSpeech(), T('stars5')]);
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
/* Full screen (v1.4.2): Fullscreen API with the webkit prefix (Safari / iPad). Where it does not exist (iPhone Safari) the
   button is hidden; there "Share → Add to Home Screen" opens the app without browser bars (see the parent corner). */
const FS = (() => {
  const d = document, root = d.documentElement;
  const supported = () => !!((d.fullscreenEnabled || d.webkitFullscreenEnabled) && (root.requestFullscreen || root.webkitRequestFullscreen));
  const active = () => !!(d.fullscreenElement || d.webkitFullscreenElement);
  const ICON_IN = '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M8 18 V8 H18 M30 8 H40 V18 M40 30 V40 H30 M18 40 H8 V30" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const ICON_OUT = '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M18 8 V18 H8 M40 18 H30 V8 M30 40 V30 H40 M8 30 H18 V40" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const sync = () => document.querySelectorAll('.fs-btn').forEach((b) => {
    const on = active(); b.classList.toggle('on', on); b.setAttribute('aria-pressed', String(on));
    b.setAttribute('aria-label', T(on ? 'fsExit' : 'fsEnter')); b.title = T(on ? 'fsExit' : 'fsEnter'); b.innerHTML = on ? ICON_OUT : ICON_IN;
  });
  function toggle() {
    try {
      const r = active() ? (d.exitFullscreen || d.webkitExitFullscreen).call(d) : (root.requestFullscreen || root.webkitRequestFullscreen).call(root, { navigationUI: 'hide' });
      if (r && r.catch) r.catch(() => sync());
    } catch (e) { sync(); }
  }
  ['fullscreenchange', 'webkitfullscreenchange'].forEach((ev) => d.addEventListener(ev, sync));
  function button() {
    const b = h(`<button class="fs-btn" type="button"></button>`);
    if (!supported()) b.hidden = true;
    onTap(b, toggle, { sound: 'pop' });
    setTimeout(sync); return b;
  }
  const standalone = () => matchMedia('(display-mode: fullscreen), (display-mode: standalone)').matches || navigator.standalone === true;
  return { supported, active, toggle, sync, button, standalone };
})();

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


/* ===== src/46-tour.js ===== */
/* Lea Learns — guided tour (v1.4.2). The guide (Lea by default, or whoever is playing) explains each button with her
   recorded voice and a speech bubble, while a ring and a bouncing arrow point at the real button. Positions always come
   from the button's live getBoundingClientRect(), so it works at every size and after rotation.
   Home: full tour on the first visit (tap anywhere = next, ✕ = skip). Games: a short tour the first time a screen or mode
   opens that never blocks play (any tap in the game ends it). Replay any time with the “?” button or by tapping the guide.
   The texts below are also read by tools/gen-voice.py (between the TOUR-JSON markers) to record the clips. */
const Tour = (() => {
  const TXT = /*TOUR-JSON*/{
    "en": {
      "hello": "Hi! Let me show you around!", "lollies": "Tap a lollipop to play a game.", "pencil": "The pencil dresses me up!",
      "swap": "Tap here to change who plays.", "dog": "This is Bacon! Tap him for a surprise.", "score": "Here are your apples and stars.",
      "lang": "Here you change the language.", "fs": "This button makes the game fill the whole screen.",
      "parent": "Grown-ups: hold this corner for three seconds.", "help": "Tap the question mark and I’ll show you again!",
      "back": "The arrow takes you back.", "helpGame": "Tap the question mark to hear me again.",
      "cats": "Pick a group of pictures.", "modes3": "Look, find, then say: three little steps.",
      "tapPic": "Tap a picture to hear its name.", "speaker": "Tap the speaker to hear it again.", "pickRight": "Then tap the right picture.",
      "sayIt": "Say the word, then tap to check.", "abcModes": "Look at letters, find them, or trace them.",
      "tapLetter": "Tap a letter to hear it.", "trace": "Trace the letter with your finger.",
      "numModes": "Count, how many, or adding. Pick one!", "numStrip": "Tap a number to count things.",
      "countEach": "Tap each thing to count it.", "tapAnswer": "Then tap the answer.", "sumLook": "Look at the groups of things.",
      "shapeModes": "Look at shapes, find them, or match real things.", "tapShapeHear": "Tap a shape to hear its name.",
      "tapShape2": "Tap the right shape.", "matchThing": "What shape is this thing? Tap its shape.",
      "dayModes": "Look at the days, sing them, or guess what comes next.", "todayStar": "The star shows today.",
      "tapDayHear": "Tap a day to hear it.", "singPlay": "Tap play and sing along!", "seqNext": "Which day comes next? Tap it.",
      "crTabs": "Pick who, clothes and hair colour.", "crDice": "The dice makes a surprise!", "crSave": "The green tick saves it."
    },
    "pl": {
      "hello": "Cześć! Pokażę ci, co tu jest!", "lollies": "Dotknij lizaka, żeby zagrać.", "pencil": "Ołówkiem możesz mnie przebrać!",
      "swap": "Tu zmienisz, kto gra.", "dog": "To jest Bacon! Dotknij go, będzie niespodzianka.", "score": "Tu są twoje jabłka i gwiazdki.",
      "lang": "Tu zmieniasz język.", "fs": "Ten przycisk włącza pełny ekran.",
      "parent": "Dorośli: przytrzymajcie ten róg przez trzy sekundy.", "help": "Dotknij znaku zapytania, a pokażę ci jeszcze raz!",
      "back": "Strzałka zabiera cię z powrotem.", "helpGame": "Dotknij znaku zapytania, a powtórzę.",
      "cats": "Wybierz grupę obrazków.", "modes3": "Patrz, znajdź, powiedz: trzy małe kroki.",
      "tapPic": "Dotknij obrazka, a usłyszysz nazwę.", "speaker": "Dotknij głośnika, żeby usłyszeć jeszcze raz.", "pickRight": "Potem dotknij właściwego obrazka.",
      "sayIt": "Powiedz słowo, potem dotknij i sprawdź.", "abcModes": "Oglądaj litery, szukaj ich albo rysuj palcem.",
      "tapLetter": "Dotknij litery, żeby ją usłyszeć.", "trace": "Rysuj literę palcem.",
      "numModes": "Liczenie, ile jest, albo dodawanie. Wybierz!", "numStrip": "Dotknij liczby i policz rzeczy.",
      "countEach": "Dotykaj po kolei i licz.", "tapAnswer": "Potem dotknij odpowiedzi.", "sumLook": "Popatrz na grupki rzeczy.",
      "shapeModes": "Oglądaj kształty, szukaj ich albo dopasuj rzeczy.", "tapShapeHear": "Dotknij kształtu, a usłyszysz nazwę.",
      "tapShape2": "Dotknij właściwego kształtu.", "matchThing": "Jaki kształt ma ta rzecz? Dotknij go.",
      "dayModes": "Oglądaj dni, śpiewaj je albo zgadnij, co dalej.", "todayStar": "Gwiazdka pokazuje dzisiaj.",
      "tapDayHear": "Dotknij dnia, żeby go usłyszeć.", "singPlay": "Dotknij i śpiewaj razem ze mną!", "seqNext": "Który dzień jest następny? Dotknij go.",
      "crTabs": "Wybierz, kto, ubranie i kolor włosów.", "crDice": "Kostka robi niespodziankę!", "crSave": "Zielony znaczek zapisuje."
    },
    "ru": {
      "hello": "Привет! Я всё тебе покажу!", "lollies": "Нажми на леденец, чтобы играть.", "pencil": "Карандашом можно меня переодеть!",
      "swap": "Здесь можно поменять, кто играет.", "dog": "Это Bacon! Нажми на него, будет сюрприз.", "score": "Здесь твои яблоки и звёзды.",
      "lang": "Здесь меняется язык.", "fs": "Эта кнопка включает полный экран.",
      "parent": "Взрослые: держите этот уголок три секунды.", "help": "Нажми на вопросик, и я покажу ещё раз!",
      "back": "Стрелка возвращает назад.", "helpGame": "Нажми на вопросик, и я повторю.",
      "cats": "Выбери группу картинок.", "modes3": "Смотри, найди, скажи: три маленьких шага.",
      "tapPic": "Нажми на картинку и услышишь название.", "speaker": "Нажми на динамик, чтобы послушать ещё раз.", "pickRight": "Потом нажми на правильную картинку.",
      "sayIt": "Скажи слово, потом нажми и проверь.", "abcModes": "Смотри на буквы, ищи их или обводи пальцем.",
      "tapLetter": "Нажми на букву, чтобы её услышать.", "trace": "Обведи букву пальцем.",
      "numModes": "Считать, сколько, или складывать. Выбирай!", "numStrip": "Нажми на число и посчитай.",
      "countEach": "Нажимай на каждую вещь и считай.", "tapAnswer": "Потом нажми на ответ.", "sumLook": "Посмотри на группы вещей.",
      "shapeModes": "Смотри на формы, ищи их или подбирай вещи.", "tapShapeHear": "Нажми на форму и услышишь название.",
      "tapShape2": "Нажми на правильную форму.", "matchThing": "Какой формы эта вещь? Нажми на форму.",
      "dayModes": "Смотри на дни, пой их или угадай, что дальше.", "todayStar": "Звёздочка показывает сегодня.",
      "tapDayHear": "Нажми на день, чтобы его услышать.", "singPlay": "Нажми и пой вместе со мной!", "seqNext": "Какой день следующий? Нажми на него.",
      "crTabs": "Выбери, кто, одежду и цвет волос.", "crDice": "Кубик делает сюрприз!", "crSave": "Зелёная галочка сохраняет."
    }
  }/*END-TOUR-JSON*/;
  const LBL = { en: { help: 'Help', skip: 'Skip' }, pl: { help: 'Pomoc', skip: 'Pomiń' }, ru: { help: 'Помощь', skip: 'Пропустить' } };
  const tt = (k) => (TXT[lang()] || TXT.en)[k] || TXT.en[k];
  const lbl = (k) => (LBL[lang()] || LBL.en)[k];
  const S = '.screen:not(.screen-out) ';
  const HOME = [['hello', '.hero-lea'], ['lollies', '.lollies'], ['pencil', '.edit-look'], ['swap', '.swap'], ['dog', '.home-dog'],
    ['score', '.home-score'], ['lang', '.lang-bar'], ['fs', '.fs-btn'], ['parent', '.parent-corner'], ['help', '.help-btn']];
  const QUIZ = [['speaker', '.prompt'], ['pickRight', '.quiz-area']];
  const SCREEN = {
    words: [['cats', '.cat-grid']], category: [['modes3', '.mode-switch']], abc: [['abcModes', '.mode-switch']],
    numbers: [['numModes', '.num-modes']], count: [['numStrip', '.num-strip']],
    howmany: [['countEach', '.scene'], ['tapAnswer', '.quiz-area']], sums: [['sumLook', '.scene'], ['tapAnswer', '.quiz-area']],
    shapes: [['shapeModes', '.num-modes']], shapeLook: [['tapShapeHear', '.shape-grid']],
    shapeFind: [['speaker', '.prompt'], ['tapShape2', '.quiz-area']], shapeMatch: [['matchThing', '.quiz-area']],
    days: [['dayModes', '.num-modes']], dayLook: [['todayStar', '.week .day-today'], ['tapDayHear', '.week']],
    daySing: [['singPlay', '.sing-play']], dayNext: [['seqNext', '.quiz-area']],
    creator: [['crTabs', '.cr-tabs'], ['crDice', '.cr-dice'], ['crSave', '.cr-save']],
  };
  const MODES = {
    'category:look': [['tapPic', '.word-grid']], 'category:find': QUIZ, 'category:say': [['sayIt', '.say-box']],
    'abc:look': [['tapLetter', '.letter-grid']], 'abc:find': QUIZ, 'abc:trace': [['trace', '.trace-box']],
  };
  const modeKey = (name, params) => (MODES[`${name}:${(params && params.mode) || 'look'}`] ? `${name}:${(params && params.mode) || 'look'}` : '');
  const find = (sel) => document.querySelector(S + sel) || document.querySelector(sel);
  const visible = (sel) => { const e = find(sel); if (!e || e.hidden || e.closest('[hidden]')) return false; const r = e.getBoundingClientRect();
    return r.width > 4 && r.height > 4 && r.right > 0 && r.bottom > 0 && r.left < innerWidth && r.top < innerHeight && getComputedStyle(e).visibility !== 'hidden'; };

  /* Which steps to show on this screen. all = replay (help button): everything for the screen, already seen or not. */
  function stepsFor(name, params, all) {
    if (name === 'home') return all || !Store.toured('home') ? { keys: ['home'], steps: HOME.slice() } : null;
    const mk = modeKey(name, params), out = [], keys = [];
    const screenNew = SCREEN[name] && (all || !Store.toured(name)), modeNew = mk && (all || !Store.toured(mk));
    if (!screenNew && !modeNew) return null;
    if (all || !Store.toured('back')) { out.push(['back', '.bar .home-btn']); keys.push('back'); }
    if (screenNew) { out.push(...SCREEN[name]); keys.push(name); }
    if (modeNew) { out.push(...MODES[mk]); keys.push(mk); }
    if (all || !Store.toured('helpGame')) { out.push(['helpGame', '.help-btn']); keys.push('helpGame'); }
    return { keys, steps: out };
  }

  const ARROW = '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 4 L58 32 H42 V60 H22 V32 H6 Z" fill="#ff7043" stroke="#fff" stroke-width="5" stroke-linejoin="round"/></svg>';
  let cur = null;

  function place() {
    if (!cur || !cur.el) return;
    const st = cur, r0 = st.el.getBoundingClientRect(), W = innerWidth, H = innerHeight, pad = 8;
    const r = { left: Math.max(2, r0.left - pad), top: Math.max(2, r0.top - pad), right: Math.min(W - 2, r0.right + pad), bottom: Math.min(H - 2, r0.bottom + pad) };
    const ring = st.layer.querySelector('.tour-ring'), arrow = st.layer.querySelector('.tour-arrow');
    const round = parseFloat(getComputedStyle(st.el).borderRadius) >= Math.min(r0.width, r0.height) * 0.4;
    Object.assign(ring.style, { left: r.left + 'px', top: r.top + 'px', width: (r.right - r.left) + 'px', height: (r.bottom - r.top) + 'px', borderRadius: round ? '999px' : '24px' });
    const A = Math.round(Math.min(72, Math.max(48, Math.min(W, H) * 0.09))), gap = 6;
    const cx = (r.left + r.right) / 2, cy = (r.top + r.bottom) / 2;
    const room = { below: H - r.bottom, above: r.top, left: r.left, right: W - r.right };
    const order = (cy > H / 2 ? ['above', 'below'] : ['below', 'above']).concat(room.left > room.right ? ['left', 'right'] : ['right', 'left']);
    const side = order.find((s) => room[s] >= A + gap + 4) || 'inside';
    const clampX = (x) => Math.max(4, Math.min(W - A - 4, x)), clampY = (y) => Math.max(4, Math.min(H - A - 4, y));
    let x, y, rot;
    if (side === 'below') { x = clampX(cx - A / 2); y = r.bottom + gap; rot = 0; }
    else if (side === 'above') { x = clampX(cx - A / 2); y = r.top - gap - A; rot = 180; }
    else if (side === 'left') { x = r.left - gap - A; y = clampY(cy - A / 2); rot = 90; }
    else if (side === 'right') { x = r.right + gap; y = clampY(cy - A / 2); rot = -90; }
    else { x = clampX(cx - A / 2); y = clampY(r.top + 10); rot = 180; }
    Object.assign(arrow.style, { left: x + 'px', top: y + 'px', width: A + 'px', height: A + 'px' });
    arrow.style.setProperty('--rot', rot + 'deg'); arrow.dataset.side = side;
    const skip = st.layer.querySelector('.tour-skip'), hb = $(S + '.hero-bubble');
    if (skip && hb && !hb.hidden) { const q = hb.getBoundingClientRect();
      Object.assign(skip.style, { left: Math.max(4, Math.min(W - 48, q.right - 26)) + 'px', top: Math.max(4, Math.min(H - 48, q.top - 22)) + 'px' }); }
  }

  function show(k) {
    const st = cur; if (!st) return;
    const g = $(S + '.guide');
    if (st.home) st.home(tt(k));
    else if (g) { setGuide('point', tt(k)); st.layer.querySelector('.tour-say').hidden = true; }
    else { // no guide on this screen (creator): a small bubble on the side away from the button
      const b = st.layer.querySelector('.tour-say'); b.hidden = false; b.textContent = tt(k);
      const r = st.el.getBoundingClientRect(); b.dataset.at = r.top + r.height / 2 > innerHeight / 2 ? 'top' : 'bottom';
    }
  }

  function next() {
    const st = cur; if (!st) return;
    clearTimeout(st.timer);
    do { st.i++; } while (st.i < st.steps.length && !visible(st.steps[st.i][1]));
    if (st.i >= st.steps.length) return stop(false);
    const [k, sel] = st.steps[st.i]; st.el = find(sel);
    st.layer.dataset.step = k; show(k); place(); requestAnimationFrame(place);
    const my = st.i, t0 = Date.now();
    Audio.say(tt(k)).then(() => {
      if (cur !== st || st.i !== my) return;
      st.timer = setTimeout(() => { if (cur === st && st.i === my) next(); }, Math.max(700, 2600 - (Date.now() - t0)));
    });
  }

  function run(name, params, all) {
    stop(false);
    const plan = stepsFor(name, params, all); if (!plan) return false;
    plan.keys.forEach((k) => Store.markTour(k)); // mark at the start, so an interrupted tour does not come back every time
    const block = name === 'home';
    const layer = h(`<div class="tour ${block ? 'block' : ''}" data-screen="${name}"><div class="tour-ring"></div><div class="tour-arrow">${ARROW}</div><div class="bubble tour-say" hidden></div>${block ? `<button class="round-btn tour-skip" aria-label="${lbl('skip')}">${ICON.close}</button>` : ''}</div>`);
    document.body.appendChild(layer);
    const st = { name, steps: plan.steps, i: -1, layer, el: null, timer: 0, home: null, onDone: null };
    if (block) {
      const el = $(S + '.hero-lea'), bubble = $(S + '.hero-bubble');
      st.home = (text) => {
        if (el) { el.addEventListener('load', place, { once: true }); el.src = poseSrc('point'); el.classList.remove('hop'); void el.offsetWidth; el.classList.add('hop'); }
        if (bubble) { bubble.hidden = false; bubble.textContent = text; bubble.classList.remove('pop'); void bubble.offsetWidth; bubble.classList.add('pop'); }
      };
      st.onDone = () => { if (el && el.isConnected) el.src = poseSrc('front'); };
      layer.addEventListener('pointerup', (e) => { e.stopPropagation(); if (e.target.closest('.tour-skip')) return stop(true); Audio.hush(); next(); });
    } else {
      st.onAny = (e) => { if (!e.target.closest('.help-btn')) stop(true); };
      document.addEventListener('pointerdown', st.onAny, true);
    }
    st.onResize = () => place(); addEventListener('resize', st.onResize);
    st.tick = setInterval(place, 400);
    cur = st; next(); return true;
  }

  function stop(hush) {
    const st = cur; if (!st) return; cur = null;
    clearTimeout(st.timer); clearInterval(st.tick); removeEventListener('resize', st.onResize);
    if (st.onAny) document.removeEventListener('pointerdown', st.onAny, true);
    st.layer.remove(); if (st.onDone) st.onDone();
    if (hush) Audio.hush();
  }

  /* After a screen opens: wait until its own greeting / question has been said, then explain (first time only). */
  function auto(name, params) {
    if (!Store.settings.tours || window.LEA_NO_AUTO_TOUR || name === 'gate' || !stepsFor(name, params, false)) return; // flag: older tests only
    let waited = 0;
    const tryNow = () => {
      if (App.screen !== name || document.querySelector('.overlay, .round-end')) return;
      if ((Audio.speaking || App.busy) && waited < 9000) { waited += 300; later(tryNow, 300); return; }
      run(name, params, false);
    };
    tryNow();
  }
  const replay = () => run(App.screen, App.params || {}, true);
  function button() { const b = h(`<button class="help-btn" type="button" aria-label="${lbl('help')}" title="${lbl('help')}">?</button>`); onTap(b, replay, { sound: 'pop' }); return b; }
  return { TXT, auto, run, replay, stop, button, place, stepsFor, next: () => next(), get active() { return cur ? { screen: cur.name, step: cur.steps[cur.i] && cur.steps[cur.i][0], sel: cur.steps[cur.i] && cur.steps[cur.i][1], i: cur.i, n: cur.steps.length } : null; } };
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

const MAX_CHARS = 6;
const lolly = (cls, inner, label, swirl) => `<button class="lolly ${cls}" aria-label="${label}">
  <span class="lolly-disc" style="--sw:${swirl}">${inner}</span><span class="lolly-stick"></span><span class="lolly-label">${label}</span></button>`;

SCREENS.gate = () => {
  const cur = Store.settings.player;
  const el = h(`<section class="world gate">
    <header class="world-top"><h1 class="logo small"><span class="l1">Lea</span> <span class="l2">Learns</span></h1><div class="world-top-right"></div></header>
    <div class="gate-ask bubble">${T('whosPlaying')}</div>
    <div class="pickers ${allChars().length + (Store.chars.length < MAX_CHARS ? 1 : 0) >= 3 ? 'many' : ''}" style="--n:${allChars().length + (Store.chars.length < MAX_CHARS ? 1 : 0)}">${allChars().map((who, i) => `
      <button class="picker ${who === cur ? 'last' : ''} ${isBuiltin(who) ? '' : 'custom'}" data-who="${who}" style="--i:${i}" aria-label="${playerName(who)}">
        <span class="picker-lea">${leaImg('wave', '', who)}</span>
        <span class="picker-name">${playerName(who)}</span>
      </button>`).join('')}${Store.chars.length < MAX_CHARS ? `
      <button class="picker picker-new" style="--i:${allChars().length}" aria-label="${T('creator')}">
        <span class="picker-lea"><span class="new-disc"><svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 10 V38 M10 24 H38" stroke="currentColor" stroke-width="7" stroke-linecap="round"/></svg></span></span>
        <span class="picker-name">${T('newChar')}</span>
      </button>` : ''}</div>
  </section>`);
  el.prepend(worldLayer());
  el.appendChild(parentCorner());
  $('.world-top-right', el).append(langBar(), FS.button());
  const nb = $('.picker-new', el);
  if (nb) onTap(nb, () => { Audio.unlock(); nb.classList.add('chosen'); setTimeout(() => go('creator', { id: 'new' }), 350); }, { sound: 'open' });
  $$('.picker[data-who]', el).forEach((b) => onTap(b, () => {
    Audio.unlock();
    Audio.sfx('open');
    Store.set('player', b.dataset.who);
    b.classList.add('chosen'); el.classList.add('picked');
    const pi = $('img', b); pi.src = poseSrc('jump', b.dataset.who); pi.dataset.pose = 'jump';
    setTimeout(() => go('home', { hello: true }), 500);
  }, { sound: null }));
  el._layout = () => placeOnWorld(el);
  return el;
};

SCREENS.home = ({ hello } = {}) => {
  const d = Store.data;
  const list = allChars(), other = list[(list.indexOf(player()) + 1) % list.length];
  const el = h(`<section class="world home">
    <header class="world-top">
      <h1 class="logo small"><span class="l1">Lea</span> <span class="l2">Learns</span></h1>
      <div class="world-top-right"><div class="home-score"><div class="apples-chip">${art('apple')}<b>${d.apples}</b></div><div class="stars-chip">${ICON.star}<b>${d.stars}</b></div></div></div>
    </header>
    <button class="edit-look" aria-label="${T('editLook')}"><svg viewBox="0 0 48 48" aria-hidden="true"><path d="M30 8 C34 4 44 14 40 18 L20 38 L8 40 L10 28 Z" fill="#ffd54f" stroke="#4a2f27" stroke-width="3.5" stroke-linejoin="round"/><path d="M10 28 L20 38" stroke="#4a2f27" stroke-width="3.5"/><path d="M28 10 L38 20" stroke="#4a2f27" stroke-width="3.5"/><path d="M30 8 C34 4 44 14 40 18 L36 22 L26 12 Z" fill="#ff6fa3" stroke="#4a2f27" stroke-width="3.5" stroke-linejoin="round"/></svg></button>
    <button class="door" data-world="door" aria-label="${T('words')}"><span class="door-glow"></span></button>
    <div class="front">
      <div class="hero" data-who="${player()}">${leaImg('front', 'hero-lea')}<div class="bubble hero-bubble" hidden></div>
        <button class="swap" aria-label="${playerName(other)}">${leaImg('front', 'swap-img', other)}</button>
</div>
      <nav class="lollies">
        ${lolly('l-words', art('apple'), T('words'), '#ff6b81')}
        ${lolly('l-abc', '<b style="--c:#e53935">A</b><b style="--c:#1e88e5">B</b><b style="--c:#43a047">C</b>', T('abc'), '#b388ff')}
        ${lolly('l-num', '<b style="--c:#f4b400">1</b><b style="--c:#ec407a">2</b><b style="--c:#1e88e5">3</b>', T('numbers'), '#4dd0e1')}
        ${lolly('l-shapes', art('shape:triangle', 'mini') + art('shape:circle', 'mini'), T('shapes'), '#9ccc65')}
        ${lolly('l-days', art('calendar'), T('days'), '#ffb74d')}
      </nav>
    </div>
    <button class="home-dog" aria-label="Bacon" hidden><img src="assets/character/dog-front.png" alt="" draggable="false"></button>
  </section>`);
  el.prepend(worldLayer());
  el.appendChild(parentCorner());
  $('.world-top-right', el).prepend(langBar()); $('.world-top-right', el).append(Tour.button(), FS.button());
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
  onTap($('.l-shapes', el), () => open('shapes', T('shapes'), $('.l-shapes', el)), { sound: 'open' });
  onTap($('.l-days', el), () => open('days', T('days'), $('.l-days', el)), { sound: 'open' });
  onTap($('.door', el), () => open('words', T('words'), $('.door', el)), { sound: 'open' });
  onTap($('.hero-lea', el), () => { const t = pick([T('hi', playerName()), T('hello'), T('letsPlay'), T('loveApples')]); talk(t, t === T('hi', playerName()) ? hiSpeech() : t); }, { sound: 'pop' });
  onTap($('.swap', el), () => { Store.set('player', other); go('home', { hello: true }); }, { sound: 'open' });
  onTap($('.edit-look', el), () => go('creator', { id: player() }), { sound: 'open' });
  const dog = $('.home-dog', el);
  onTap(dog, () => Dog.show(), { sound: null });
  /* Pencil lives on the other side of the candy house (bottom-right). In portrait the lollipops fill the bottom row,
     so it sits just above the Numbers lollipop instead. */
  const pen = $('.edit-look', el);
  const placeDog = () => { // Bacon sits right above the pencil, on the free right edge — never on a lollipop
    const r = pen.getBoundingClientRect(); if (!r.height) return;
    dog.style.right = Math.round(innerWidth - r.right) + 'px';
    dog.style.bottom = Math.round(innerHeight - r.top + 16) + 'px';
  };
  const placePen = () => {
    pen.style.bottom = '';
    if (innerWidth <= innerHeight) {
      const tops = $$('.lolly', el).map((l) => l.getBoundingClientRect()).filter((r) => r.height).map((r) => r.top);
      if (tops.length) pen.style.bottom = Math.round(innerHeight - Math.min(...tops) + 14) + 'px';
    }
    placeDog();
  };
  el._layout = () => { placeOnWorld(el); placePen(); };
  el._enter = () => {
    placeOnWorld(el); placePen(); later(placePen, 700); later(placePen, 1400); // again once the pencil's own entrance has settled
    hello ? talk(T('hi', playerName()), [hiSpeech(), T('whatPlay')]) : talk(T('whatPlay'));
    // Bacon always sits on the cloud above the pencil (tap him for a gag); sometimes he also bursts in later.
    later(() => { placeDog(); dog.hidden = false; dog.classList.add('in'); }, 600);
    if (Math.random() < 0.3) later(() => Dog.show(), 9000);
  };
  return el;
};


/* ===== src/52-creator.js ===== */
/* Lea Learns — "Create your character": a live dress-up editor. Icons and swatches, no reading needed.
   Everything is painted in the same illustration style as Lea and Ines: a new character is a painted child (base) + a painted
   costume + a hair colour recoloured on the painting + a name (see 24-paint.js). Lea, Ines and Leo change clothes and hair
   colour the same way, and one tap brings back their original look. */
const CRL = {
  en: {
    cat: { base: 'Who', gender: 'Girl / boy', hair: 'Hair', hairColour: 'Colour', eyes: 'Eyes', face: 'Face', skin: 'Skin', body: 'Body', outfit: 'Clothes', acc: 'Extras' },
    gender: { girl: 'Girl', boy: 'Boy' },
    hair: { pigtails: 'Pigtails', braids: 'Braids', long: 'Long', bob: 'Bob', ponytail: 'Ponytail', bun: 'Bun', curly: 'Curly', short: 'Short', spiky: 'Spiky' },
    hairColour: { brunette: 'Brown', black: 'Black', blonde: 'Blonde', ginger: 'Ginger', red: 'Red', silver: 'Silver', pink: 'Pink', blue: 'Blue', purple: 'Purple', neon: 'Neon green', rainbow: 'Rainbow' },
    eyes: { brown: 'Brown', dark: 'Dark brown', blue: 'Blue', green: 'Green', hazel: 'Hazel', grey: 'Grey', violet: 'Violet' },
    face: { round: 'Round', oval: 'Oval', heart: 'Heart', square: 'Square' },
    skin: { porcelain: 'Very light', light: 'Light', peach: 'Peach', tan: 'Tan', brown: 'Brown', deep: 'Dark brown' },
    body: { slim: 'Slim', average: 'Medium', round: 'Round', tall: 'Tall', small: 'Small' },
    outfit: { flowerPink: 'Pink flower dress', flowerTeal: 'Teal daisy dress', appleDress: 'Apple dress', princess: 'Princess dress', polka: 'Polka-dot dress', rainbow: 'Rainbow dress', tee: 'T-shirt and trousers', dungarees: 'Dungarees', sporty: 'Sporty', pirate: 'Pirate', superhero: 'Superhero', astronaut: 'Astronaut', chicken: 'Chicken', dino: 'Dinosaur', bunny: 'Bunny', bear: 'Teddy bear', banana: 'Banana' },
    acc: { none: 'Nothing', headband: 'Headband', bow: 'Bow', flower: 'Flower', crown: 'Crown', hat: 'Sun hat', cap: 'Cap', glasses: 'Glasses' },
    prince: 'Prince',
    orig: { outfit: 'Own clothes', hair: 'Own hair' },
    base: { lea: 'Girl with fair hair', ines: 'Girl with dark braids', leo: 'Boy with brown hair', maya: 'Girl with curly puffs', sam: 'Boy with curly hair' },
    name: 'Name', save: 'Save', dice: 'Surprise me', reset: 'Original look', del: 'Delete', delSure: 'Tap again to delete', back: 'Back',
  },
  pl: {
    cat: { base: 'Kto', gender: 'Dziewczynka / chłopiec', hair: 'Fryzura', hairColour: 'Kolor', eyes: 'Oczy', face: 'Buzia', skin: 'Skóra', body: 'Sylwetka', outfit: 'Ubranie', acc: 'Dodatki' },
    gender: { girl: 'Dziewczynka', boy: 'Chłopiec' },
    hair: { pigtails: 'Kucyki', braids: 'Warkocze', long: 'Długie', bob: 'Bob', ponytail: 'Kitka', bun: 'Kok', curly: 'Loki', short: 'Krótkie', spiky: 'Na jeża' },
    hairColour: { brunette: 'Brązowe', black: 'Czarne', blonde: 'Blond', ginger: 'Rude', red: 'Czerwone', silver: 'Srebrne', pink: 'Różowe', blue: 'Niebieskie', purple: 'Fioletowe', neon: 'Neonowo zielone', rainbow: 'Tęczowe' },
    eyes: { brown: 'Brązowe', dark: 'Ciemnobrązowe', blue: 'Niebieskie', green: 'Zielone', hazel: 'Piwne', grey: 'Szare', violet: 'Fiołkowe' },
    face: { round: 'Okrągła', oval: 'Owalna', heart: 'Serduszko', square: 'Kwadratowa' },
    skin: { porcelain: 'Bardzo jasna', light: 'Jasna', peach: 'Brzoskwiniowa', tan: 'Opalona', brown: 'Brązowa', deep: 'Ciemnobrązowa' },
    body: { slim: 'Szczupła', average: 'Średnia', round: 'Pulchna', tall: 'Wysoka', small: 'Niska' },
    outfit: { flowerPink: 'Różowa sukienka w kwiatki', flowerTeal: 'Morska sukienka w stokrotki', appleDress: 'Sukienka w jabłuszka', princess: 'Suknia księżniczki', polka: 'Sukienka w kropki', rainbow: 'Tęczowa sukienka', tee: 'Koszulka i spodnie', dungarees: 'Ogrodniczki', sporty: 'Strój sportowy', pirate: 'Pirat', superhero: 'Superbohater', astronaut: 'Astronauta', chicken: 'Kurczak', dino: 'Dinozaur', bunny: 'Króliczek', bear: 'Miś', banana: 'Banan' },
    acc: { none: 'Nic', headband: 'Opaska', bow: 'Kokarda', flower: 'Kwiatek', crown: 'Korona', hat: 'Kapelusz', cap: 'Czapka z daszkiem', glasses: 'Okulary' },
    prince: 'Książę',
    orig: { outfit: 'Własne ubranie', hair: 'Własne włosy' },
    base: { lea: 'Dziewczynka o jasnych włosach', ines: 'Dziewczynka z ciemnymi warkoczami', leo: 'Chłopiec o brązowych włosach', maya: 'Dziewczynka z kręconymi kucykami', sam: 'Chłopiec z kręconymi włosami' },
    name: 'Imię', save: 'Zapisz', dice: 'Losuj', reset: 'Oryginalny wygląd', del: 'Usuń', delSure: 'Dotknij ponownie, aby usunąć', back: 'Wróć',
  },
  ru: {
    cat: { base: 'Кто', gender: 'Девочка / мальчик', hair: 'Причёска', hairColour: 'Цвет', eyes: 'Глаза', face: 'Лицо', skin: 'Кожа', body: 'Фигура', outfit: 'Одежда', acc: 'Украшения' },
    gender: { girl: 'Девочка', boy: 'Мальчик' },
    hair: { pigtails: 'Хвостики', braids: 'Косички', long: 'Длинные', bob: 'Каре', ponytail: 'Хвост', bun: 'Пучок', curly: 'Кудри', short: 'Короткие', spiky: 'Ёжик' },
    hairColour: { brunette: 'Каштановые', black: 'Чёрные', blonde: 'Светлые', ginger: 'Рыжие', red: 'Красные', silver: 'Серебряные', pink: 'Розовые', blue: 'Синие', purple: 'Фиолетовые', neon: 'Неоново-зелёные', rainbow: 'Радужные' },
    eyes: { brown: 'Карие', dark: 'Тёмно-карие', blue: 'Голубые', green: 'Зелёные', hazel: 'Ореховые', grey: 'Серые', violet: 'Фиалковые' },
    face: { round: 'Круглое', oval: 'Овальное', heart: 'Сердечком', square: 'Квадратное' },
    skin: { porcelain: 'Очень светлая', light: 'Светлая', peach: 'Персиковая', tan: 'Загорелая', brown: 'Смуглая', deep: 'Тёмная' },
    body: { slim: 'Стройная', average: 'Средняя', round: 'Пухленькая', tall: 'Высокая', small: 'Маленькая' },
    outfit: { flowerPink: 'Розовое платье в цветочек', flowerTeal: 'Бирюзовое платье с ромашками', appleDress: 'Платье с яблочками', princess: 'Платье принцессы', polka: 'Платье в горошек', rainbow: 'Радужное платье', tee: 'Футболка и брюки', dungarees: 'Комбинезон', sporty: 'Спортивная форма', pirate: 'Пират', superhero: 'Супергерой', astronaut: 'Космонавт', chicken: 'Цыплёнок', dino: 'Динозавр', bunny: 'Зайчик', bear: 'Мишка', banana: 'Банан' },
    acc: { none: 'Ничего', headband: 'Ободок', bow: 'Бантик', flower: 'Цветочек', crown: 'Корона', hat: 'Шляпка', cap: 'Кепка', glasses: 'Очки' },
    prince: 'Принц',
    orig: { outfit: 'Своя одежда', hair: 'Свои волосы' },
    base: { lea: 'Девочка со светлыми волосами', ines: 'Девочка с тёмными косичками', leo: 'Мальчик с каштановыми волосами', maya: 'Девочка с кудрявыми хвостиками', sam: 'Мальчик с кудрявыми волосами' },
    name: 'Имя', save: 'Сохранить', dice: 'Случайно', reset: 'Как было', del: 'Удалить', delSure: 'Нажмите ещё раз, чтобы удалить', back: 'Назад',
  },
};
const CR = () => CRL[lang()] || CRL.en;
const CR_OPTIONS = { gender: ['girl', 'boy'], hair: AV.HAIR, hairColour: Object.keys(AV.HAIR_COLOURS), eyes: Object.keys(AV.EYES), face: AV.FACES, skin: Object.keys(AV.SKIN), body: Object.keys(AV.BODIES), outfit: AV.OUTFITS, acc: AV.ACCS };

function crTabIcon(k, p) {
  const s = (inner) => `<svg viewBox="0 0 48 48" aria-hidden="true">${inner}</svg>`;
  const K = 'stroke="#4a2f27" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"';
  const hc = AV.HAIR_COLOURS[p.hairColour] || '#7a4a2a';
  switch (k) {
    case 'base': case 'gender': return s(`<circle cx="15" cy="13" r="7" fill="#ffd9b8" ${K}/><path d="M15 21 L6 40 L24 40 Z" fill="#ff7eb6" ${K}/><circle cx="34" cy="13" r="7" fill="#ffd9b8" ${K}/><path d="M27 22 L41 22 L41 32 L38 32 L38 42 L30 42 L30 32 L27 32 Z" fill="#4aa3ff" ${K}/>`);
    case 'hair': return s(`<path d="M8 30 C4 8 44 8 40 30 C40 40 36 44 34 44 C36 30 30 20 24 18 C18 20 12 30 14 44 C12 44 8 40 8 30 Z" fill="${hc === 'rainbow' ? '#ff7eb6' : hc}" ${K}/>`);
    case 'hairColour': return s(`<circle cx="15" cy="16" r="9" fill="#ff7eb6" ${K}/><circle cx="33" cy="16" r="9" fill="#ffd54f" ${K}/><circle cx="15" cy="33" r="9" fill="#4aa3ff" ${K}/><circle cx="33" cy="33" r="9" fill="#7dff3a" ${K}/>`);
    case 'eyes': return s(`<path d="M4 24 C12 10 36 10 44 24 C36 38 12 38 4 24 Z" fill="#fff" ${K}/><circle cx="24" cy="24" r="8" fill="${AV.EYES[p.eyes]}"/><circle cx="24" cy="24" r="4" fill="#2a1a14"/><circle cx="27" cy="21" r="2" fill="#fff"/>`);
    case 'face': return s(`<ellipse cx="24" cy="24" rx="17" ry="20" fill="${AV.SKIN[p.skin]}" ${K}/><circle cx="18" cy="22" r="2.5" fill="#4a2f27"/><circle cx="30" cy="22" r="2.5" fill="#4a2f27"/><path d="M18 31 Q24 36 30 31" fill="none" ${K}/>`);
    case 'skin': return s(`${['#ffe6d5', '#f1c09a', '#a8714a', '#76482b'].map((c, i) => `<circle cx="${14 + (i % 2) * 20}" cy="${14 + Math.floor(i / 2) * 20}" r="9" fill="${c}" ${K}/>`).join('')}`);
    case 'body': return s(`<circle cx="14" cy="10" r="5" fill="#ffd9b8" ${K}/><rect x="9" y="16" width="10" height="28" rx="5" fill="#9b6dd6" ${K}/><circle cx="34" cy="20" r="5" fill="#ffd9b8" ${K}/><rect x="25" y="26" width="18" height="18" rx="8" fill="#26a69a" ${K}/>`);
    case 'outfit': return s(`<path d="M17 6 L31 6 L34 16 L30 18 L40 42 L8 42 L18 18 L14 16 Z" fill="#e53935" ${K}/><circle cx="20" cy="30" r="2.5" fill="#fff"/><circle cx="28" cy="34" r="2.5" fill="#fff"/><circle cx="25" cy="24" r="2.5" fill="#fff"/>`);
    case 'acc': return s(`<path d="M8 36 L6 12 L16 22 L24 8 L32 22 L42 12 L40 36 Z" fill="#ffca28" ${K}/><circle cx="24" cy="28" r="3.5" fill="#e53935"/>`);
    default: return '';
  }
}

SCREENS.creator = ({ id = 'new', from } = {}) => {
  const isNew = id === 'new' || (!isBuiltin(id) && !Store.char(id));
  const builtin = isBuiltin(id);
  const back = from || (isNew ? 'gate' : 'home');
  let p = builtin ? PAINT.valid(Store.look(id)) : isNew ? PAINT.validChar({ base: 'maya', name: pick(AV.GIRL_NAMES) }) : PAINT.validChar(Store.char(id));
  const cats = builtin ? ['outfit', 'hairColour'] : ['base', 'outfit', 'hairColour'];
  const body = () => (builtin ? id : p.base);
  const isBoy = () => PAINT.BOYS.includes(body());
  let tab = cats[0];
  const t = CR();
  const el = h(`<section class="creator" lang="${lang()}">
    <header class="bar cr-bar">
      <button class="round-btn home-btn cr-back" aria-label="${t.back}">${ICON.back}</button>
      <div class="bar-title" style="--c:var(--purple)"><span>${builtin ? T('editLook') : T('creator')}</span></div>
      <span class="cr-bar-gap"></span><span class="cr-help"></span>
    </header>
    <div class="cr-main">
      <div class="cr-show">
        <div class="cr-preview"><img class="lea cr-img" alt="" draggable="false"></div>
        <div class="cr-side">
          ${builtin ? `<div class="cr-fixed-name">${playerName(id)}</div>` : `<label class="cr-name-wrap"><span class="sr">${t.name}</span><input class="cr-name" type="text" maxlength="14" autocomplete="off" autocorrect="off" spellcheck="false" enterkeyhint="done" aria-label="${t.name}" value=""></label>`}
          <div class="cr-actions">
            <button class="cr-btn cr-dice" aria-label="${t.dice}"><svg viewBox="0 0 48 48" aria-hidden="true"><rect x="6" y="6" width="36" height="36" rx="9" fill="#fff" stroke="#4a2f27" stroke-width="3.5"/><g fill="#e53935"><circle cx="16" cy="16" r="4"/><circle cx="32" cy="32" r="4"/><circle cx="24" cy="24" r="4"/><circle cx="32" cy="16" r="4"/><circle cx="16" cy="32" r="4"/></g></svg></button>
            ${builtin ? `<button class="cr-btn cr-reset" aria-label="${t.reset}">${ICON.again}</button>` : isNew ? '' : `<button class="cr-btn cr-del" aria-label="${t.del}"><svg viewBox="0 0 48 48" aria-hidden="true"><path d="M12 14 H36 L33 42 H15 Z" fill="#fff" stroke="#c62828" stroke-width="3.5" stroke-linejoin="round"/><path d="M8 14 H40 M19 14 V8 H29 V14 M20 21 V35 M28 21 V35" fill="none" stroke="#c62828" stroke-width="3.5" stroke-linecap="round"/></svg></button>`}
            <button class="cr-btn cr-save" aria-label="${t.save}"><svg viewBox="0 0 48 48" aria-hidden="true"><path d="M10 25 L20 35 L39 13" fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
          </div>
        </div>
      </div>
      <div class="cr-panel">
        <nav class="cr-tabs n${cats.length}">${cats.map((k) => `<button class="cr-tab" data-cat="${k}" aria-label="${t.cat[k]}"><span class="cr-tab-ic"></span><span class="cr-tab-l">${t.cat[k]}</span></button>`).join('')}</nav>
        <div class="cr-opts scroll"></div>
      </div>
    </div>
  </section>`);
  { const hb = el.querySelector('.cr-help'); hb.replaceWith(Tour.button()); }
  const img = $('.cr-img', el), opts = $('.cr-opts', el), nameIn = $('.cr-name', el);
  if (nameIn) nameIn.value = p.name;
  const hop = () => { img.classList.remove('hop'); void img.offsetWidth; img.classList.add('hop'); };
  const opt = (k) => (k === 'base' ? PAINT.BASES : k === 'outfit' ? PAINT.OUTFITS : PAINT.HAIR);
  const label = (k, v) => (v === 'original' ? t.orig[k === 'outfit' ? 'outfit' : 'hair'] : k === 'outfit' && v === 'princess' && isBoy() ? t.prince : t[k][v]);
  const paint = () => {
    const want = p, who = body(); img.src = PAINT.src(who, 'front', p);
    PAINT.prepare(who, p, ['front']).then(() => { if (want === p) img.src = PAINT.src(who, 'front', p); });
    $$('.cr-tab', el).forEach((b) => { b.classList.toggle('on', b.dataset.cat === tab); $('.cr-tab-ic', b).innerHTML = crTabIcon(b.dataset.cat, p); });
  };
  const thumb = (k, v) => {
    if (k === 'base') return `<img src="${PAINT.base(v, 'front', 'original')}" alt="" draggable="false">`;
    if (k === 'outfit') return `<img src="${PAINT.base(body(), 'front', v)}" alt="" draggable="false">`;
    if (k === 'hairColour' && v === 'original') return `<span class="sw" style="--c:${PAINT.ORIGINAL_HAIR[body()]}"></span>`;
    return `<span class="sw ${v === 'rainbow' ? 'sw-rainbow' : ''}" style="--c:${AV.HAIR_COLOURS[v]}"></span>`;
  };
  const renderOpts = () => {
    const cur = p[tab];
    opts.className = `cr-opts scroll k-${tab}`;
    opts.innerHTML = opt(tab).map((v) => `<button class="cr-opt ${v === cur ? 'on' : ''} ${AV.FUNNY.includes(v) ? 'funny' : ''} ${tab === 'outfit' || tab === 'base' ? 'painted' : ''}" data-v="${v}" aria-label="${label(tab, v)}" aria-pressed="${v === cur}">${thumb(tab, v)}</button>`).join('');
    opts.scrollTop = 0;
    $$('.cr-opt', opts).forEach((b) => onTap(b, () => {
      const v = b.dataset.v;
      p = Object.assign({}, p, { [tab]: v });
      if (tab === 'base' && nameIn) { // keep a typed name; swap only our own suggestion when girl ↔ boy changes
        const boy = PAINT.BOYS.includes(v), cur = nameIn.value.trim();
        if (!cur || (boy && AV.GIRL_NAMES.includes(cur)) || (!boy && AV.BOY_NAMES.includes(cur))) nameIn.value = p.name = pick(boy ? AV.BOY_NAMES : AV.GIRL_NAMES);
      }
      paint(); hop(); renderOpts();
      if (v === 'chicken') Audio.say(T('cluck')); else if (v === 'dino') Audio.say(T('roar'));
    }, { sound: 'pop' }));
  };
  $$('.cr-tab', el).forEach((b) => onTap(b, () => { tab = b.dataset.cat; paint(); renderOpts(); Audio.say(T('crAsk')[tab]); }, { sound: 'tap' }));
  if (nameIn) {
    nameIn.addEventListener('input', () => { p.name = nameIn.value; });
    nameIn.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); nameIn.blur(); } });
    nameIn.addEventListener('focus', () => Audio.say(T('crAsk').name));
  }
  onTap($('.cr-back', el), () => go(back), { sound: 'whoosh' });
  onTap($('.cr-dice', el), () => {
    if (builtin) p = PAINT.valid({ outfit: pick(PAINT.OUTFITS.slice(1)), hairColour: pick(PAINT.HAIR.slice(1)) });
    else {
      const b = pick(PAINT.BASES);
      p = PAINT.validChar({ base: b, outfit: pick(PAINT.OUTFITS), hairColour: Math.random() < 0.5 ? 'original' : pick(PAINT.HAIR.slice(1)), name: pick(PAINT.BOYS.includes(b) ? AV.BOY_NAMES : AV.GIRL_NAMES) });
      if (nameIn) nameIn.value = p.name;
    }
    paint(); hop(); renderOpts(); Audio.say(T('surprise'));
  }, { sound: 'sparkle' });
  const reset = $('.cr-reset', el);
  if (reset) onTap(reset, () => { Store.setLook(id, null); p = PAINT.valid(null); paint(); hop(); renderOpts(); Audio.say(T('likeBefore')); }, { sound: 'whoosh' });
  const del = $('.cr-del', el);
  if (del) { let armed = false; onTap(del, () => {
    if (!armed) { armed = true; del.classList.add('armed'); del.setAttribute('aria-label', t.delSure); setTimeout(() => { armed = false; del.classList.remove('armed'); }, 3500); return; }
    Store.deleteChar(id); go('gate');
  }, { sound: 'again' }); }
  onTap($('.cr-save', el), () => {
    if (App.busy) return; App.busy = true;
    let who = id;
    if (builtin) Store.setLook(id, PAINT.isOriginal(p) ? null : PAINT.valid(p));
    else {
      const name = (nameIn ? nameIn.value : p.name).replace(/[<>&"]/g, '').trim().slice(0, 14) || (isBoy() ? AV.BOY_NAMES[0] : AV.GIRL_NAMES[0]);
      who = isNew ? 'c-' + Date.now().toString(36) + Math.floor(Math.random() * 1e3).toString(36) : id;
      const v = PAINT.validChar(p);
      Store.saveChar({ id: who, name, base: v.base, outfit: v.outfit, hairColour: v.hairColour });
    }
    Store.set('player', who);
    const ready = builtin ? PAINT.prepare(id, Store.look(id) || {}) : PAINT.prepare(p.base, PAINT.validChar(p));
    const superWord = T('praise').find((x) => /^(Super|Супер)/.test(x)) || T('praise')[0];
    ready.then(() => {
      celebrate({ text: superWord, pose: 'jump' });
      Audio.say([superWord, T('letsPlay')]);
      later(() => go('home', { hello: true }), 1600);
    });
  }, { sound: 'pop' });
  el._enter = () => Audio.say(builtin ? [T('editLook'), T('crAsk')[tab]] : T('creator'));
  paint(); renderOpts();
  el.appendChild(parentCorner());
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
/* Lea Learns — ABC. The letter (English letter name), then real words; Find (period 2) and sandpaper-style Trace.
   No separate phonics syllables: spoken by a voice they came out as odd non-words, so the words carry the sound. */
const letterColour = (i) => LETTER_COLOURS[i % LETTER_COLOURS.length];
const letterWords = (L) => LETTER_WORDS[L.l] || [L.pic];
const letterSpeech = (L) => {
  const parts = [];
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
    Audio.say([praise, EN(L().l + '.')]);
    Dog.maybe();
    later(() => load(idx + 1), 3000 + Dog.extra());
  }
  function load(i) {
    idx = (i + 26) % 26; strokes = []; done = false;
    setup();
    setGuide('point', `${T('traceHint')}`);
    Audio.say([T('traceHint'), EN(L().l + '.')]);
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
      ask = [EN(NUMBER_WORDS[s.a]), EN('plus'), EN(NUMBER_WORDS[s.b]), T('altogether')];
      done = [EN(NUMBER_WORDS[s.a]), EN('plus'), EN(NUMBER_WORDS[s.b]), EN('makes'), EN(NUMBER_WORDS[s.ans] + '!')];
    } else {
      scene.innerHTML = `<div class="grp g1 wide"></div><b class="op">−</b><span class="grp-n take">${s.b}</span><b class="op">=</b><div class="ans-box">?</div>`;
      $('.g1', scene).append(objectPile(t, s.a, { countable: false, away: s.b }), h(`<span class="grp-n">${s.a}</span>`));
      ask = [EN(NUMBER_WORDS[s.a]), EN('take away'), EN(NUMBER_WORDS[s.b]), T('left')];
      done = [EN(NUMBER_WORDS[s.a]), EN('take away'), EN(NUMBER_WORDS[s.b]), EN('is'), EN(NUMBER_WORDS[s.ans] + '!')];
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
        Audio.say([praise, ...done]);
        q++; later(() => { App.busy = false; next(); }, 3200 + Dog.extra());
      },
      onMiss: () => { const enc = tPick('encourage'); setGuide('wave', enc, 'wiggle'); Audio.say([enc, ...ask]); },
    });
  };
  el._enter = next;
  return el;
};


/* ===== src/82-shapes.js ===== */
/* Lea Learns — Shapes. Montessori order: look and name the shape, find it among others, then find it in real
   things around us (ball → circle, pizza slice → triangle). Shape words are English. */
const SHAPE_C = 'var(--shape-c, #43a047)';
const shapeWord = (k) => k;
const anShape = (k) => (/^[aeiou]/.test(k) ? 'an ' : 'a ');
const thingSentence = (obj, shape) => `The ${spoken(obj)} is ${anShape(shape)}${shape}.`;

function modeTiles(stage, tiles, prefix) {
  const box = h(`<div class="num-modes"></div>`);
  tiles.forEach((t) => {
    const b = h(`<button class="num-tile" data-go="${t.go}" aria-label="${t.name}">${t.html}<span class="cat-name">${t.name}</span>${Store.data.played[prefix + t.go] ? `<span class="tile-star">${ICON.star}</span>` : ''}</button>`);
    onTap(b, () => { if (t.say) Audio.say(t.say); go(t.go); }, { sound: 'open' });
    box.appendChild(b);
  });
  stage.appendChild(box);
}

SCREENS.shapes = () => {
  const el = h(`<section class="activity shapes-home" style="--c:${SHAPE_C}"></section>`);
  el.appendChild(topBar({ back: 'home', title: T('shapes'), icon: 'shape:star', colour: SHAPE_C }));
  const stage = h(`<main class="stage"></main>`);
  modeTiles(stage, [
    { go: 'shapeLook', name: T('look'), html: `<span class="nm-pics">${art('shape:circle')}${art('shape:triangle')}${art('shape:square')}</span>`, say: T('lookListen') },
    { go: 'shapeFind', name: T('find'), html: `<span class="nm-pics">${art('shape:star')}${art('shape:heart')}<b class="q">?</b></span>`, say: T('tapShape') },
    { go: 'shapeMatch', name: T('match'), html: `<span class="nm-pics">${art('pizza')}<b>=</b>${art('shape:triangle')}</span>`, say: T('whatShape') },
  ], 'shapes:');
  el.appendChild(stage);
  el.appendChild(guide('point', T('learnShapes')));
  el._enter = () => Audio.say(T('learnShapes'));
  return el;
};

SCREENS.shapeLook = () => {
  const el = h(`<section class="activity shape-look" style="--c:${SHAPE_C}"></section>`);
  el.appendChild(topBar({ back: 'shapes', title: T('look'), icon: 'shape:circle', colour: SHAPE_C }));
  const stage = h(`<main class="stage"></main>`);
  const grid = h(`<div class="word-grid shape-grid scroll"></div>`);
  const open = (i) => {
    const k = SHAPES[i];
    Store.played('shapes:shapeLook'); grid.children[i].classList.add('seen');
    const things = SHAPE_THINGS.filter(([, s]) => s === k).map(([o]) => o);
    const extra = things.length ? `<div class="spot-things">${things.map((o) => `<button class="spot-thing" data-obj="${o}" aria-label="${word(o)}">${art(o)}</button>`).join('')}</div>` : '';
    const o = spotlight({ key: 'shape:' + k, title: `<span class="first" style="color:${shapeColour(k)}">${k[0]}</span>${k.slice(1)}`, extra, speech: [T('thisIs'), EN(k)], cls: 'shape-spot',
      prev: () => open((i - 1 + SHAPES.length) % SHAPES.length), next: () => open((i + 1) % SHAPES.length) });
    $$('.spot-thing', o).forEach((b) => onTap(b, () => { b.classList.remove('boing'); void b.offsetWidth; b.classList.add('boing'); Audio.say([EN(thingSentence(b.dataset.obj, k))]); }, { sound: 'pop' }));
    setGuide('point', `${T('thisIs')} ${k}`);
  };
  SHAPES.forEach((k, i) => {
    const c = h(`<button class="word-card" data-key="${k}" aria-label="${k}" style="--sc:${shapeColour(k)}"><span class="wc-art">${art('shape:' + k)}</span><span class="wc-word">${k}</span></button>`);
    onTap(c, () => open(i), { sound: 'pop' });
    grid.appendChild(c);
  });
  stage.appendChild(grid);
  el.appendChild(stage);
  el.appendChild(guide('point', T('tapShape')));
  el._enter = () => Audio.say([T('tapShape')]);
  return el;
};

/* One quiz engine for both shape games: `ask(q)` gives the question, three shape cards are the answers. */
function shapeQuiz({ screen, back, title, icon, kind }) {
  const el = h(`<section class="activity shape-quiz ${kind}" style="--c:${SHAPE_C}"></section>`);
  el.appendChild(topBar({ back, title, icon, colour: SHAPE_C }));
  const stage = h(`<main class="stage"></main>`);
  const ROUND = 5;
  const stars = starsRow(ROUND);
  const prompt = h(`<button class="prompt" aria-label="Again"><span class="prompt-say">${ICON.speaker}</span><span class="prompt-word"></span></button>`);
  const scene = h(`<div class="scene shape-scene"></div>`);
  const area = h(`<div class="quiz-area"></div>`);
  stage.append(stars, prompt);
  if (kind === 'match') stage.append(h(`<div class="q-row"></div>`)), stage.lastChild.append(scene, area);
  else stage.append(area);
  el.appendChild(stage);
  el.appendChild(guide('think', ''));
  const qs = kind === 'match' ? shuffle(SHAPE_THINGS).slice(0, ROUND) : shuffle(CORE_SHAPES).slice(0, ROUND).map((s) => [null, s]);
  let q = 0, ask = [];
  onTap(prompt, () => Audio.say(ask), { sound: null });
  const next = () => {
    if (q >= ROUND) { Store.played('shapes:' + screen); return roundEnd({ stars: ROUND, onAgain: () => go(screen), onHome: () => go('shapes') }); }
    const [obj, k] = qs[q];
    const others = shuffle(CORE_SHAPES.filter((s) => s !== k)).slice(0, 2);
    area.innerHTML = ''; area.dataset.answer = k;
    if (obj) {
      scene.innerHTML = `<button class="shape-thing" aria-label="${word(obj)}">${art(obj)}</button>`;
      onTap($('.shape-thing', scene), () => Audio.say(ask), { sound: 'pop' });
      ask = [T('whatShape'), EN(spoken(obj))];
      $('.prompt-word', prompt).textContent = T('whatShape');
    } else {
      ask = [T('showMe'), EN(k)];
      $('.prompt-word', prompt).innerHTML = `${T('showMe')} <b style="color:${shapeColour(k)}">${k}</b>`;
    }
    setGuide('think', obj ? T('whatShape') : T('tapShape'));
    Audio.say(ask);
    runChoice({
      stage: area, cls: 'shapes', choices: shuffle([k, ...others]).map((s) => ({ key: s })),
      render: (c) => art('shape:' + c.key, 'ch-art'),
      isRight: (c) => c.key === k,
      onRight: () => {
        App.busy = true; fillStar(stars, q);
        const praise = tPick('praise');
        celebrate({ text: k });
        setGuide(pick(['jump', 'cheer']), `${praise} ${obj ? thingSentence(obj, k) : k + '!'}`);
        Audio.say([praise, EN(obj ? thingSentence(obj, k) : k)]);
        q++; later(() => { App.busy = false; next(); }, 3000 + Dog.extra());
      },
      onMiss: () => { const enc = tPick('encourage'); setGuide('wave', enc, 'wiggle'); Audio.say([enc, ...ask]); },
    });
  };
  el._enter = next;
  return el;
}
SCREENS.shapeFind = () => shapeQuiz({ screen: 'shapeFind', back: 'shapes', title: T('find'), icon: 'shape:heart', kind: 'find' });
SCREENS.shapeMatch = () => shapeQuiz({ screen: 'shapeMatch', back: 'shapes', title: T('match'), icon: 'pizza', kind: 'match' });


/* ===== src/84-days.js ===== */
/* Lea Learns — Days of the week. Every day keeps its own colour and a little routine picture, today is
   always highlighted from the device date, and the week can be sung in order. Day names are English. */
const DAYS_C = 'var(--days-c, #fb8c00)';
const todayIs = (i) => `Today is ${DAYS[i].k}!`;

function dayCard(d, i, { tag = 'button', today = todayIndex() } = {}) {
  return `<${tag} class="day-card${i === today ? ' today' : ''}" data-day="${i}" style="--dc:${d.c}" aria-label="${d.k}">
    ${i === today ? `<span class="day-today">${ICON.star}<i>${T('today')}</i></span>` : ''}
    <span class="day-art">${art(d.cue)}</span><span class="day-name"><b>${d.k.slice(0, 2)}</b>${d.k.slice(2)}</span></${tag}>`;
}
const dayTitle = (d) => `<span class="first" style="color:${d.c}">${d.k[0]}</span>${d.k.slice(1)}`;

SCREENS.days = () => {
  const el = h(`<section class="activity days-home" style="--c:${DAYS_C}"></section>`);
  el.appendChild(topBar({ back: 'home', title: T('days'), icon: 'calendar', colour: DAYS_C }));
  const stage = h(`<main class="stage"></main>`);
  const t = DAYS[todayIndex()];
  modeTiles(stage, [
    { go: 'dayLook', name: T('look'), html: `<span class="nm-pics day-dots">${DAYS.map((d) => `<i style="background:${d.c}"></i>`).join('')}</span>`, say: T('daysWeek') },
    { go: 'daySing', name: T('sing'), html: `<span class="nm-pics"><b>♪</b>${art('calendar')}<b>♫</b></span>`, say: T('singDays') },
    { go: 'dayNext', name: T('whatNext'), html: `<span class="nm-pics day-dots next"><i style="background:${DAYS[0].c}"></i><i style="background:${DAYS[1].c}"></i><b class="q">?</b></span>`, say: T('whatNext') },
  ], 'days:');
  el.appendChild(stage);
  el.appendChild(guide('point', `${T('today')}: ${t.k}`));
  el._enter = () => Audio.say([T('daysWeek'), EN(todayIs(todayIndex()))]);
  return el;
};

SCREENS.dayLook = () => {
  const ti = todayIndex();
  const el = h(`<section class="activity day-look" style="--c:${DAYS_C}"></section>`);
  el.appendChild(topBar({ back: 'days', title: T('look'), icon: 'calendar', colour: DAYS_C }));
  const stage = h(`<main class="stage"></main>`);
  const banner = h(`<button class="today-banner" style="--dc:${DAYS[ti].c}" aria-label="${todayIs(ti)}"><span class="tb-star">${ICON.star}</span><span>${T('today')}: <b>${DAYS[ti].k}</b></span><span class="prompt-say">${ICON.speaker}</span></button>`);
  const week = h(`<div class="week">${DAYS.map((d, i) => dayCard(d, i, { today: ti })).join('')}</div>`);
  stage.append(banner, week);
  el.appendChild(stage);
  el.appendChild(guide('point', T('tapDay')));
  onTap(banner, () => { setGuide('cheer', todayIs(ti)); Audio.say([EN(todayIs(ti))]); }, { sound: 'sparkle' });
  const open = (i) => {
    const d = DAYS[i];
    Store.played('days:dayLook');
    spotlight({ key: d.cue, title: dayTitle(d), sub: i === ti ? `⭐ ${T('today')}` : '', speech: i === ti ? [EN(d.k), EN(todayIs(i))] : [EN(d.k)], cls: 'day-spot',
      prev: () => open((i + 6) % 7), next: () => open((i + 1) % 7) });
    setGuide('point', d.k);
  };
  $$('.day-card', week).forEach((c) => onTap(c, () => open(+c.dataset.day), { sound: 'pop' }));
  el._enter = () => Audio.say([T('daysWeek'), EN(todayIs(ti))]);
  return el;
};

/* Sing-along: the days light up one after another while they are sung; then a little fanfare and an apple. */
SCREENS.daySing = () => {
  const ti = todayIndex();
  const el = h(`<section class="activity day-sing" style="--c:${DAYS_C}"></section>`);
  el.appendChild(topBar({ back: 'days', title: T('sing'), icon: 'calendar', colour: DAYS_C }));
  const stage = h(`<main class="stage"></main>`);
  const week = h(`<div class="week sing">${DAYS.map((d, i) => dayCard(d, i, { tag: 'div', today: ti })).join('')}</div>`);
  const play = h(`<button class="round-btn sing-play" aria-label="${T('sing')}">${ICON.play}</button>`);
  stage.append(week, play);
  el.appendChild(stage);
  el.appendChild(guide('sit', T('singDays')));
  let token = 0, rewarded = false;
  const live = (t) => t === token && el.isConnected;
  const sing = async () => {
    const my = ++token;
    const cards = $$('.day-card', week);
    cards.forEach((c) => c.classList.remove('lit', 'sung'));
    play.classList.add('playing'); setGuide('cheer', T('singDays'));
    Audio.say([T('singDays')]); await sleep(1500);
    for (let lap = 0; lap < 2; lap++) {
      for (let i = 0; i < 7; i++) {
        if (!live(my)) return;
        cards.forEach((c) => c.classList.remove('lit'));
        cards[i].classList.add('lit', 'sung');
        Audio.sfx('count', [1, 3, 5, 6, 5, 3, 8][i]);
        Audio.say([EN(DAYS[i].k)]);
        setGuide(i % 2 ? 'jump' : 'cheer', DAYS[i].k);
        await sleep(lap ? 820 : 1000);
      }
      await sleep(500);
    }
    if (!live(my)) return;
    cards.forEach((c) => c.classList.remove('lit'));
    play.classList.remove('playing');
    Audio.sfx('fanfare');
    const praise = tPick('praise');
    celebrate({ text: '♪ ♫', big: true });
    setGuide('cheer', praise);
    Audio.say([praise, EN(todayIs(ti))]);
    Store.played('days:daySing');
    if (!rewarded) { rewarded = true; Store.addApple(); Store.addStars(3); refreshApples(); }
  };
  onTap(play, sing, { sound: 'tap' });
  el._enter = sing;
  return el;
};

/* What comes next? Two days in order, then a gap: pick the day that follows (Sunday → Monday wraps round). */
SCREENS.dayNext = () => {
  const el = h(`<section class="activity day-next" style="--c:${DAYS_C}"></section>`);
  el.appendChild(topBar({ back: 'days', title: T('whatNext'), icon: 'calendar', colour: DAYS_C }));
  const stage = h(`<main class="stage"></main>`);
  const ROUND = 5;
  const stars = starsRow(ROUND);
  const prompt = h(`<button class="prompt" aria-label="Again"><span class="prompt-say">${ICON.speaker}</span><span class="prompt-word">${T('whatNext')}</span></button>`);
  const scene = h(`<div class="scene day-seq"></div>`);
  const area = h(`<div class="quiz-area"></div>`);
  const row = h(`<div class="q-row"></div>`); row.append(scene, area);
  stage.append(stars, prompt, row);
  el.appendChild(stage);
  el.appendChild(guide('think', ''));
  const starts = shuffle([0, 1, 2, 3, 4, 5, 6]).slice(0, ROUND);
  let q = 0, ask = [];
  onTap(prompt, () => Audio.say(ask), { sound: null });
  const next = () => {
    if (q >= ROUND) { Store.played('days:dayNext'); return roundEnd({ stars: ROUND, onAgain: () => go('dayNext'), onHome: () => go('days') }); }
    const a = starts[q], b = (a + 1) % 7, ans = (a + 2) % 7;
    scene.innerHTML = `${dayCard(DAYS[a], a, { tag: 'div', today: -1 })}<span class="seq-arrow">${ICON.next}</span>${dayCard(DAYS[b], b, { tag: 'div', today: -1 })}<span class="seq-arrow">${ICON.next}</span><div class="day-card gap"><b>?</b></div>`;
    area.innerHTML = ''; area.dataset.answer = DAYS[ans].k;
    ask = [EN(DAYS[a].k), EN(DAYS[b].k), T('whatNext')];
    setGuide('think', T('whatNext'));
    Audio.say(ask);
    const others = shuffle([0, 1, 2, 3, 4, 5, 6].filter((i) => i !== a && i !== b && i !== ans)).slice(0, 2);
    runChoice({
      stage: area, cls: 'days', choices: shuffle([ans, ...others]).map((i) => ({ key: DAYS[i].k, i })),
      render: (c) => `<span class="ch-day" style="--dc:${DAYS[c.i].c}"><span class="day-art">${art(DAYS[c.i].cue)}</span><b>${c.key}</b></span>`,
      isRight: (c) => c.i === ans,
      onRight: () => {
        App.busy = true; fillStar(stars, q);
        const gap = $('.gap', scene); gap.outerHTML = dayCard(DAYS[ans], ans, { tag: 'div', today: -1 }).replace('day-card', 'day-card filled');
        const praise = tPick('praise');
        celebrate({ text: DAYS[ans].k });
        setGuide(pick(['jump', 'cheer']), `${praise} ${DAYS[ans].k}!`);
        Audio.say([praise, EN(DAYS[a].k), EN(DAYS[b].k), EN(DAYS[ans].k)]);
        q++; later(() => { App.busy = false; next(); }, 3600 + Dog.extra());
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
  en: { title: 'For parents', language: 'Language', langNote: 'Menus and the guide’s hints use this language. The words being learnt are always English.', sound: 'Sound effects', music: 'Music', voice: 'Speech', range: 'Numbers', rangeNote: 'Counting range', reset: 'Reset progress', resetSure: 'Tap again to reset', resetDone: 'Progress reset', test: 'Listen', voices: 'Voice', voiceStyle: 'A bright, playful little-girl voice, like in a children’s cartoon.', none: 'not found', noVoice: (l) => `No ${l} voice found: guide phrases are shown but not spoken. Add one in Settings › Accessibility › Spoken Content › Voices.`, progress: (d) => `${d.apples} apples · ${d.stars} stars · ${Object.keys(d.seenWords).length} words · ${Object.keys(d.seenLetters).length}/26 letters`, privacy: 'No accounts, ads or tracking. Progress is saved only on this device.', tours: 'Guide explains the buttons', fsHint: 'Full screen on iPhone: in Safari tap Share, then “Add to Home Screen”, and open Lea Learns from its icon.', ios: 'iPad: if there is no sound, check the silent switch and volume, then go back to the start screen and tap Lea or Ines.', on: 'On', off: 'Off', close: 'Close', changePlayer: 'Change player' },
  pl: { title: 'Dla rodzica', language: 'Język', langNote: 'Menu i podpowiedzi są w tym języku. Słówka do nauki są zawsze po angielsku.', sound: 'Efekty dźwiękowe', music: 'Muzyka', voice: 'Mowa', range: 'Liczby', rangeNote: 'Zakres liczenia', reset: 'Wyzeruj postępy', resetSure: 'Dotknij ponownie, aby wyzerować', resetDone: 'Postępy wyzerowane', test: 'Posłuchaj', voices: 'Głos', voiceStyle: 'Jasny, wesoły głos dziewczynki, jak w bajce.', none: 'brak', noVoice: (l) => `Brak głosu (${l}): podpowiedzi są wyświetlane, ale nie czytane. Dodaj głos w Ustawienia › Dostępność › Zawartość mówiona › Głosy.`, progress: (d) => `${d.apples} jabłek · ${d.stars} gwiazdek · ${Object.keys(d.seenWords).length} słów · ${Object.keys(d.seenLetters).length}/26 liter`, privacy: 'Bez kont, reklam i śledzenia. Postępy zapisują się tylko na tym urządzeniu.', tours: 'Przewodnik objaśnia przyciski', fsHint: 'Pełny ekran na iPhonie: w Safari dotknij Udostępnij, potem „Do ekranu początkowego” i otwórz Lea Learns z ikony.', ios: 'iPad: jeśli nie ma dźwięku, sprawdź przełącznik wyciszenia i głośność, a potem wróć do ekranu startowego i dotknij Lei lub Ines.', on: 'Wł.', off: 'Wył.', close: 'Zamknij', changePlayer: 'Zmień gracza' },
  ru: { title: 'Для родителей', language: 'Язык', langNote: 'Меню и подсказки на этом языке. Слова для изучения всегда на английском.', sound: 'Звуковые эффекты', music: 'Музыка', voice: 'Речь', range: 'Числа', rangeNote: 'Диапазон счёта', reset: 'Сбросить прогресс', resetSure: 'Нажмите ещё раз для сброса', resetDone: 'Прогресс сброшен', test: 'Послушать', voices: 'Голос', voiceStyle: 'Яркий, весёлый голос девочки, как в мультфильме.', none: 'нет', noVoice: (l) => `Нет голоса (${l}): подсказки показываются, но не озвучиваются. Добавьте голос: Настройки › Универсальный доступ › Устный контент › Голоса.`, progress: (d) => `${d.apples} яблок · ${d.stars} звёзд · ${Object.keys(d.seenWords).length} слов · ${Object.keys(d.seenLetters).length}/26 букв`, privacy: 'Без аккаунтов, рекламы и слежки. Прогресс хранится только на этом устройстве.', tours: 'Подсказки к кнопкам', fsHint: 'Полный экран на iPhone: в Safari нажмите «Поделиться», затем «На экран „Домой“» и откройте Lea Learns с иконки.', ios: 'iPad: если нет звука, проверьте переключатель беззвучного режима и громкость, затем вернитесь на стартовый экран и нажмите на Лею или Инес.', on: 'Вкл.', off: 'Выкл.', close: 'Закрыть', changePlayer: 'Сменить игрока' },
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
      <div class="p-row"><span>${t.music}</span><button class="toggle ${s.music ? 'on' : ''}" data-k="music">${s.music ? t.on : t.off}</button></div>
      <div class="p-row"><span>${t.voice}</span><button class="toggle ${s.voice ? 'on' : ''}" data-k="voice">${s.voice ? t.on : t.off}</button></div>
      <div class="p-row"><span>${t.tours}</span><button class="toggle ${s.tours ? 'on' : ''}" data-k="tours">${s.tours ? t.on : t.off}</button></div>
      <div class="p-block"><div class="p-label">${t.voices}</div>
        <p class="p-voices">${t.voiceStyle}</p>
        ${missing ? `<p class="p-note warn">${t.noVoice(LANGS[L].label)}</p>` : ''}
        <button class="p-btn p-test">${t.test}</button></div>
      <p class="p-progress">${t.progress(Store.data)}</p>
      <div class="p-row"><button class="p-btn p-player">${t.changePlayer}</button><button class="p-btn danger p-reset">${t.reset}</button></div>
      <p class="p-note">${t.privacy}</p>
      ${!FS.supported() && !FS.standalone() ? `<p class="p-note p-fs">${t.fsHint}</p>` : ''}
      <p class="p-note">${t.ios}</p>
      <p class="p-credit">${CREDIT} · v${APP_VERSION}</p>
    </div>`;
  };
  const wire = () => {
    o.innerHTML = render();
    const t = PT[lang()];
    onTap($('.p-close', o), () => { o.remove(); go(App.screen || 'home', App.params || {}); });
    $$('.toggle', o).forEach((b) => onTap(b, () => { Store.set(b.dataset.k, !Store.settings[b.dataset.k]); if (b.dataset.k === 'music') Audio.setMusic(Store.settings.music); wire(); }));
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
  // 1.3.x custom characters were vector drawings: move them to the nearest painted base (same name, outfit, hair colour).
  Store.chars.forEach((c) => { if (!c.base) Store.saveChar(PAINT.fromVector(c)); });
  BUILTIN.forEach((who) => { const l = Store.look(who); if (l) PAINT.prepare(who, l); });
  Store.chars.forEach((c) => { const v = PAINT.validChar(c); PAINT.prepare(v.base, v); });
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
  window.LeaLearns = { go, Store, Dog, Tour, Audio, poseSrc, version: APP_VERSION }; // small handle for tests and debugging
})();

})();
