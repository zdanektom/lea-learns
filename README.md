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

## How to play

* **Start:** tap Lea or Ines (“Who’s playing?”). This first tap also switches on sound and speech on iPad. The last choice is remembered. You can swap on the home screen with the small round face next to the character.
* **Home:** the candy house in the clouds. The three big lollipops are the modes, and the heart door also opens Words.
* **Words:** Food (apple first), Animals, Colours, Home, Nature and Body, 8–10 pictures each. Montessori three-period lesson:
  1. **Look**: “This is … apple”.
  2. **Find**: “Show me … apple”. Tap the right one of 3 big pictures.
  3. **Say**: “What is this?” The child says it, then taps to hear it.
* **ABC:** A–Z. **Look** plays the sound first, then the letter, then several picture words (B → ball, banana, bed, book). **Find**: “Show me the letter B”. **Trace** is a sandpaper-style letter (Aa) for a fat finger, and it keeps working after rotation.
* **Numbers:** **Count** 1–20 (1–30 in the parent corner), shown as real objects. Above 10, the objects sit in ten-frames. **How many?** lets the child tap each object to count it aloud. **+ −** shows picture groups first and numerals a moment later. Sums go up to 20, or 30 when the 1–30 range is on.
* A miss is never “wrong”: the card wobbles, the guide says “try again”, and after two misses the right answer gently glows. Correct answers give stars, apples, confetti, a jump from the guide, and sometimes Bacon.

## Parent corner

**Hold the faint circle in the top-right corner of the start or home screen for 3 seconds.** It has:

* the interface language (**Polski / English / Русский**; Polish is the default) — this can also be changed with the **Polski / English / Русский** buttons on the start and home screens,
* the counting range (1–20 / 1–30),
* sound effects, background music and speech on/off,
* the voices this device has,
* a voice test,
* change player,
* reset progress (tap twice).

The interface language changes the menus and the guide’s hints. **The vocabulary being learnt is always English** (apple is always “apple”, letter sounds are English phonics).

## Speech and sound

* Speech is a bright, playful little-girl voice (pre-recorded, so it sounds the same on every iPad), in the style of a girl in a children’s cartoon. Guide phrases follow the interface language; the English words being learnt stay in English. If a clip is missing, the device’s own female voice is used as a fallback.
* Cheerful original background music (a gentle music-box and flute loop) plays after the first tap, and gets quieter while someone is speaking. You can turn it off in the parent corner.
* All sound effects (chimes, pops, Bacon’s “woof”) are generated with the Web Audio API.
* **iOS notes:**
  * Safari only allows audio and speech after a tap, so the first tap on Lea or Ines unlocks both.
  * If there is no sound, check the silent switch and the volume, then go back to the start screen and tap a character again.
  * Better voices can be downloaded in *Settings › Accessibility › Spoken Content › Voices*.
  * Device voices say phonics approximately. For short vowels the picture word carries the sound.

## Project layout

```
index.html  styles.css  manifest.webmanifest  sw.template.js  build.mjs
src/                 game code (concatenated in order into app.js)
assets/character/    Lea, Ines and Bacon (transparent PNGs cut from the approved illustrations)
assets/world/        candy-house backgrounds (landscape + portrait)
assets/fonts/        Fredoka (Latin) + Nunito (Cyrillic) subsets, SIL OFL 1.1 (see FONTS.txt)
icons/               app icons from the illustrated Lea
tools/               cutout.py (background removal + pose crops), make_icons.py, check-no-photo.py
tests/e2e.mjs        end-to-end walkthrough (puppeteer-core + Chrome); screenshots in shots/
```

Every picture to learn is an original SVG drawn in `src/20-art.js`. Only illustrated artwork is used: no photographs are part of the app.

The service worker cache name is versioned automatically (`lea-learns-<version>-<content hash>`) on every build, so updates arrive on the next launch.
