# Tara School

Tara means star in Hindi. A learning game for a four-year-old: letters, writing, words, numbers, music and more. Every instruction is spoken, so she doesn't need to read.

It runs in a browser on a Mac, or as an iPad app with finger and Apple Pencil. It works offline, because all the speech is recorded in advance.

## Games

- **Find the key:** find a letter on the keyboard, in capitals or lowercase.
- **Follow the star:** trace a letter by following a star.
- **Type a word:** spell a word under its picture.
- **Starts with:** hear a word and tap the letter it begins with.
- **Count:** build numbers to 100 in tens and ones, or count and type how many.
- **Draw:** draw freely, with a gallery that saves each picture with its date and time.
- **Feed the animal:** drag in exactly as much food as it asks for.
- **Add:** count two groups together.
- **Find the pairs:** a memory game.
- **What's next?:** finish the pattern.
- **Shapes and colours**
- **Sort:** animals to one side, food to the other.
- **Say it:** hear one word in every language she's learning.
- **Piano:** play freely, follow a song, or record a tune.

It speaks English, French, Spanish, Hindi and Arabic, and has ten themes. Choose both, and her name, under **For grown-ups**.

## Play on a Mac

```bash
open web/index.html
```

## Install on an iPad

You need Xcode and [XcodeGen](https://github.com/yonaskolb/XcodeGen).

```bash
xcodegen generate --spec ios/project.yml --project ios
open ios/StarSchool.xcodeproj
```

Choose your iPad in Xcode and press Run. Set your own team under Signing & Capabilities. The app bundles the same `web` folder, so the Mac and iPad versions are always the same game.

## Change what it says

All the words are in `web/languages.js` and `web/content.js`. After editing them, record the new lines with ElevenLabs:

```bash
cp .env.example .env    # then add your ElevenLabs API key
node tools/make-voice.mjs
```

It only records lines that are new or changed. It needs [lame](https://lame.sourceforge.io) and ffmpeg (`brew install lame ffmpeg`). `node tools/make-notes.mjs` remakes the piano notes.

## Credits

- **Voices:** recorded with [ElevenLabs](https://elevenlabs.io).
- **Font:** Baloo 2 and Baloo Bhaijaan 2 by Ek Type, under the SIL Open Font License.
