# Lea Learns

A cheerful, offline tablet game for little ones (made for Lea, almost 4): **English words**, the **ABC** and **numbers** with simple adding and taking away. A candy house in the clouds is home. Lea or her friend Ines guides and celebrates, and Bacon the French Bulldog pops in now and then to make everyone laugh.

Made for Lea by Tomasz Zdankowski. No accounts, ads, tracking, analytics or backend. Progress is kept only in the device's `localStorage`.

## Open it

```bash
npm run build                    # bundles src/*.js -> app.js and writes dist/
cd dist && python3 -m http.server 8080   # then open http://localhost:8080
```

`dist/` is ready for GitHub Pages as-is (it includes `.nojekyll`, relative paths, manifest, icons and a service worker). Speech, the service worker and Add to Home Screen need HTTPS (or `localhost`).

### Add to Home Screen on iPad

1. Open the HTTPS address in **Safari**.
2. Tap **Share** → **Add to Home Screen** → **Add**.
3. Open **Lea Learns** from the Home Screen. It runs full-screen, follows the iPad when it is rotated (no orientation lock), and works offline after the first visit.

### Full screen

In the browser, the small square button in the top-right corner (next to the apples and stars, on the start screen and on home) switches full screen on and off; Esc or the system gesture also leaves it. iPhone Safari has no full-screen mode for web pages, so the button is hidden there: add Lea Learns to the Home Screen (Share → Add to Home Screen) and open it from its icon to play without browser bars. The parent corner shows this tip on iPhone.

## How to play

* **Start:** tap Lea, Ines or Leo (“Who’s playing?”). This first tap also switches on sound and speech on iPad. The last choice is remembered. You can swap on the home screen with the small round face next to the character.
* **Create your character:** tap the big purple **+** (“New”) on the start screen. Every character is painted in the same illustration style as Lea and Ines, in all 7 poses. Choose with pictures only: **who** (5 painted children: Lea, Ines, Leo, Maya and Sam, girls and boys with different skin tones, faces and builds), **clothes** (their own clothes or 8 painted costumes: chicken, dinosaur, bunny, princess / prince, superhero, pirate, astronaut, banana), **hair colour** (their own or 11 colours including pink, blue, purple, neon green and rainbow, painted onto the hair), and a name. The dice makes a surprise character, the green tick saves it. Up to 6 own characters can live next to Lea, Ines and Leo; open one again with the pencil on the home screen (right of the candy house), where a bin button (tap twice) removes it. Characters made with an older version move automatically to the closest painted child, keeping their name, costume and fun hair colour.
* **Lea, Ines and Leo dress-up:** the round pencil button on the right of the candy house (home screen) dresses up whoever is playing **in their own painted illustration style**, in every pose: their own clothes or the 8 painted costumes, and 11 hair colours painted onto their real hair. The round arrow brings back their original look at any time.
* **Home:** the candy house in the clouds. The five big lollipops are the modes (Words, ABC, Numbers, Shapes, Days), and the heart door also opens Words.
* **Words:** Food (apple first), Animals, Colours, Home, Nature and Body, 8–10 pictures each. Montessori three-period lesson:
  1. **Look**: “This is … apple”.
  2. **Find**: “Show me … apple”. Tap the right one of 3 big pictures.
  3. **Say**: “What is this?” The child says it, then taps to hear it.
* **ABC:** A–Z. **Look** says the letter’s English name, then several picture words (B → ball, banana, bed, book). **Find**: “Show me the letter B”. **Trace** is a sandpaper-style letter (Aa) for a fat finger, and it keeps working after rotation.
* **Numbers:** **Count** 1–20 (1–30 in the parent corner), shown as real objects. Above 10, the objects sit in ten-frames. **How many?** lets the child tap each object to count it aloud. **+ −** shows picture groups first and numerals a moment later. Sums go up to 20, or 30 when the 1–30 range is on.
* **Shapes:** circle, square, triangle, rectangle, oval, star, heart, diamond, pentagon and hexagon, each a friendly coloured picture with its English name spoken. **Look** shows every shape and, for most shapes, real things with that shape (the ball is a circle, the pizza is a triangle). **Find**: “Show me … triangle”. **Match**: a real thing appears (clock, window, pizza, door, egg, kite…) and the child taps its shape.
* **Days:** Monday to Sunday, each with its own colour and a little routine picture. **Look** highlights today from the device date (“Today is Friday!”). **Sing** lights up the days one by one as the guide sings the week. **What comes next?** shows two days and a gap to fill.
* **Lea explains:** the first time home opens, the guide (Lea, or whoever is playing) gives a short tour with her voice and a speech bubble while a glowing ring and a bouncing arrow point at each button: the lollipops, the pencil (dress-up), swap-player, Bacon, apples and stars, language, full screen, the grown-ups corner and the **?** help button. Tap anywhere for the next step, or ✕ to skip. Every game and mode explains its own controls the first time (back arrow, speaker, answers, modes); this never blocks play: tapping the game ends it. Tap **?** (top right) or tap the guide to hear it again. Grown-ups can switch the automatic explanations off in the parent corner.
* A miss is never “wrong”: the card wobbles, the guide says “try again”, and after two misses the right answer gently glows. Correct answers give stars, apples, confetti, a jump from the guide, and sometimes Bacon.

## Parent corner

**Hold the faint circle in the top-right corner of the start or home screen for 3 seconds.** It has:

* the interface language (**Polski / English / Русский**; English is the default) — this can also be changed with the **Polski / English / Русский** buttons on the start and home screens,
* the counting range (1–20 / 1–30),
* sound effects, background music and speech on/off,
* the voices this device has,
* a voice test,
* change player,
* reset progress (tap twice).

The interface language changes the menus and the guide’s hints. **The vocabulary being learnt is always English** (apple is always “apple”, letters are English letter names).

## Speech and sound

* Speech is pre-recorded, so it sounds the same on every iPad, and it follows the guide: girls (Lea, Ines, Maya and girl characters you create) speak with a girl’s voice, boys (Leo, Sam and boy characters) with a boy’s voice, in English, Polish and Russian. English is British, and letters are said as English letter names (ay, bee, see … zed). The voices are lifted only gently to sound young, so every word stays clear (each recording is checked with speech-to-text). Guide phrases follow the interface language; the English words and letters being learnt stay in English. The boy’s voice is downloaded the first time a boy is the guide and then works offline. If a clip is missing, the device’s own voice is used as a fallback.
* Cheerful original background music (a gentle music-box and flute loop) plays after the first tap, and gets quieter while someone is speaking. You can turn it off in the parent corner.
* All sound effects (chimes, pops, Bacon’s “woof”) are generated with the Web Audio API.
* **iOS notes:**
  * Safari only allows audio and speech after a tap, so the first tap on Lea or Ines unlocks both.
  * If there is no sound, check the silent switch and the volume, then go back to the start screen and tap a character again.
  * Better voices can be downloaded in *Settings › Accessibility › Spoken Content › Voices*.
  * The picture words carry each letter’s sound.

## Project layout

```
index.html  styles.css  manifest.webmanifest  sw.template.js  build.mjs
src/                 game code (concatenated in order into app.js); 22-avatar.js draws the made-up characters, 24-paint.js dresses up the painted characters, 82-shapes.js and 84-days.js are the Shapes and Days modes, 52-creator.js is the editor
assets/character/    Lea, Ines and Bacon (transparent PNGs cut from the approved illustrations); look/ = painted characters (Leo, Maya, Sam) and costume variants (all 7 poses), hair/ = hair masks used to recolour hair on the painting
assets/world/        candy-house backgrounds (landscape + portrait)
assets/fonts/        Fredoka (Latin) + Nunito (Cyrillic) subsets, SIL OFL 1.1 (see FONTS.txt)
icons/               app icons from the illustrated Lea
tools/               cutout.py (background removal + pose crops), make_icons.py, check-no-photo.py
tests/e2e.mjs        end-to-end walkthrough (puppeteer-core + Chrome); screenshots in shots/
tests/creator.mjs    focused test of “Create your character”
```

Every picture to learn is an original SVG drawn in `src/20-art.js`. Only illustrated artwork is used: no photographs are part of the app.

The service worker cache name is versioned automatically (`lea-learns-<version>-<content hash>`) on every build, so updates arrive on the next launch.
