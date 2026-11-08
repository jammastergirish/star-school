// What the newer games say, per language. Loaded after languages.js, this adds to the same LANGS
// entries, and tools/make-voice.mjs records everything from allLinesWithGames(code).
const VOCAB = [
  {
    pic: "🐱",
    kind: "animal",
    en: "cat",
    fr: "chat",
    es: "gato",
    hi: "बिल्ली",
    ar: "قطة",
  },
  {
    pic: "🐶",
    kind: "animal",
    en: "dog",
    fr: "chien",
    es: "perro",
    hi: "कुत्ता",
    ar: "كلب",
  },
  {
    pic: "🐮",
    kind: "animal",
    en: "cow",
    fr: "vache",
    es: "vaca",
    hi: "गाय",
    ar: "بقرة",
  },
  {
    pic: "🐟",
    kind: "animal",
    en: "fish",
    fr: "poisson",
    es: "pez",
    hi: "मछली",
    ar: "سمكة",
  },
  {
    pic: "🐦",
    kind: "animal",
    en: "bird",
    fr: "oiseau",
    es: "pájaro",
    hi: "चिड़िया",
    ar: "طائر",
  },
  {
    pic: "🐴",
    kind: "animal",
    en: "horse",
    fr: "cheval",
    es: "caballo",
    hi: "घोड़ा",
    ar: "حصان",
  },
  {
    pic: "🐰",
    kind: "animal",
    en: "rabbit",
    fr: "lapin",
    es: "conejo",
    hi: "खरगोश",
    ar: "أرنب",
  },
  {
    pic: "🐘",
    kind: "animal",
    en: "elephant",
    fr: "éléphant",
    es: "elefante",
    hi: "हाथी",
    ar: "فيل",
  },
  {
    pic: "🍎",
    kind: "food",
    en: "apple",
    fr: "pomme",
    es: "manzana",
    hi: "सेब",
    ar: "تفاحة",
  },
  {
    pic: "🍌",
    kind: "food",
    en: "banana",
    fr: "banane",
    es: "banana",
    hi: "केला",
    ar: "موزة",
  },
  {
    pic: "🍞",
    kind: "food",
    en: "bread",
    fr: "pain",
    es: "pan",
    hi: "रोटी",
    ar: "خبز",
  },
  {
    pic: "🥛",
    kind: "food",
    en: "milk",
    fr: "lait",
    es: "leche",
    hi: "दूध",
    ar: "حليب",
  },
  {
    pic: "🥚",
    kind: "food",
    en: "egg",
    fr: "œuf",
    es: "huevo",
    hi: "अंडा",
    ar: "بيضة",
  },
  {
    pic: "🥕",
    kind: "food",
    en: "carrot",
    fr: "carotte",
    es: "zanahoria",
    hi: "गाजर",
    ar: "جزرة",
  },
  {
    pic: "🧀",
    kind: "food",
    en: "cheese",
    fr: "fromage",
    es: "queso",
    hi: "पनीर",
    ar: "جبن",
  },
  {
    pic: "🍇",
    kind: "food",
    en: "grapes",
    fr: "raisin",
    es: "uvas",
    hi: "अंगूर",
    ar: "عنب",
  },
];
const COLOURS = [
  { id: "red", hex: "#ef4444" },
  { id: "blue", hex: "#3b82f6" },
  { id: "yellow", hex: "#facc15" },
  { id: "green", hex: "#22c55e" },
  { id: "orange", hex: "#f97316" },
  { id: "purple", hex: "#a855f7" },
];
const SHAPES = ["circle", "square", "triangle", "star"];
const FEEDS = [
  { id: "monkey", animal: "🐵", food: "🍌" },
  { id: "rabbit", animal: "🐰", food: "🥕" },
  { id: "bear", animal: "🐻", food: "🐟" },
  { id: "squirrel", animal: "🐿️", food: "🌰" },
];
const FEED_RANGE = [2, 10];
const ADD_MAX = 5;

const FR_COLOUR = {
  red: ["rouge", "rouge"],
  blue: ["bleu", "bleue"],
  yellow: ["jaune", "jaune"],
  green: ["vert", "verte"],
  orange: ["orange", "orange"],
  purple: ["violet", "violette"],
};
const FR_SHAPE = {
  circle: ["cercle", 0, "le "],
  square: ["carré", 0, "le "],
  triangle: ["triangle", 0, "le "],
  star: ["étoile", 1, "l'"],
};
const ES_COLOUR = {
  red: ["rojo", "roja"],
  blue: ["azul", "azul"],
  yellow: ["amarillo", "amarilla"],
  green: ["verde", "verde"],
  orange: ["naranja", "naranja"],
  purple: ["morado", "morada"],
};
const ES_SHAPE = {
  circle: ["círculo", 0, "el"],
  square: ["cuadrado", 0, "el"],
  triangle: ["triángulo", 0, "el"],
  star: ["estrella", 1, "la"],
};
const HI_COLOUR = {
  red: "लाल",
  blue: "नीला",
  yellow: "पीला",
  green: "हरा",
  orange: "नारंगी",
  purple: "बैंगनी",
};
const HI_SHAPE = {
  circle: "गोला",
  square: "चौकोर",
  triangle: "त्रिभुज",
  star: "तारा",
};
const AR_COLOUR = {
  red: ["أحمر", "حمراء"],
  blue: ["أزرق", "زرقاء"],
  yellow: ["أصفر", "صفراء"],
  green: ["أخضر", "خضراء"],
  orange: ["برتقالي", "برتقالية"],
  purple: ["بنفسجي", "بنفسجية"],
};
const AR_SHAPE = {
  circle: ["دائرة", 1],
  square: ["مربع", 0],
  triangle: ["مثلث", 0],
  star: ["نجمة", 1],
};

const GAME_CONTENT = {
  en: {
    ui: {
      draw: "Draw",
      feed: "Feed the animal",
      add: "Add",
      memory: "Find the pairs",
      pattern: "What's next?",
      shapes: "Shapes and colours",
      sort: "Sort",
      same: "Say it",
      piano: "Piano",
      gallery: "My pictures",
      save: "Save",
      clear: "New page",
      songs: "Songs",
      record: "Record",
      play: "Play",
      free: "Free play",
    },
    locale: "en-GB",
    notes: ["C", "D", "E", "F", "G", "A", "B"],
    line: {
      how: { letters: "A letter appears. Find it on the keyboard and press it.", trace: "Watch the star, then follow it with your finger to draw the letter.", words: "Look at the picture. Press each letter to spell the word.", count: "Make the number with space and return, or count the pictures and type how many.", draw: "Pick a colour and draw anything you like. Your picture is saved for you.", feed: "Drag the food to the animal until it has enough.", add: "Count all the fruit together, then tap the answer.", memory: "Tap two cards. Find the two that go together.", pattern: "Look at the pattern, then tap what comes next.", shapes: "Listen, then tap the shape and colour you hear.", sort: "Drag each picture to its side: animals here, food there.", same: "Tap a picture to hear its name in your languages.", piano: "Press the keys to play. Tap a picture to follow a song, or record your own." },
      praise: "Yes! Well done!",
      pairs: "Find the pairs.",
      next: "What comes next?",
      sortStart: "Animals go on this side. Food goes on that side.",
      animal: "Animal!",
      food: "Food!",
      draw: "Draw anything you like!",
      saved: "I saved your picture!",
      same: "Tap a picture.",
      piano: "Play the piano!",
      follow: "Follow the glowing key.",
      tune: "What a lovely song!",
      feed: {
        monkey: (n) => `The monkey wants ${n} bananas.`,
        rabbit: (n) => `The rabbit wants ${n} carrots.`,
        bear: (n) => `The bear wants ${n} fish.`,
        squirrel: (n) => `The squirrel wants ${n} nuts.`,
      },
      addAsk: (a, b) => `${a} and ${b}. How many now?`,
      addSay: (a, b, c) => `${a} and ${b} make ${c}!`,
      shapeName: (c, s) => `${c} ${s}`,
      findShape: (c, s) => `Find the ${c} ${s}.`,
    },
  },
  fr: {
    ui: {
      draw: "Dessine",
      feed: "Nourris l'animal",
      add: "Additionne",
      memory: "Trouve les paires",
      pattern: "Et après ?",
      shapes: "Formes et couleurs",
      sort: "Trie",
      same: "Dis-le",
      piano: "Piano",
      gallery: "Mes dessins",
      save: "Garder",
      clear: "Nouvelle page",
      songs: "Chansons",
      record: "Enregistrer",
      play: "Écouter",
      free: "Jeu libre",
    },
    locale: "fr-FR",
    notes: ["do", "ré", "mi", "fa", "sol", "la", "si"],
    line: {
      how: { letters: "Une lettre apparaît. Trouve-la sur le clavier et appuie dessus.", trace: "Regarde l'étoile, puis suis-la avec ton doigt pour dessiner la lettre.", words: "Regarde l'image. Appuie sur chaque lettre pour écrire le mot.", count: "Fais le nombre avec espace et entrée, ou compte les images et tape le nombre.", draw: "Choisis une couleur et dessine ce que tu veux. Ton dessin est gardé pour toi.", feed: "Fais glisser la nourriture vers l'animal jusqu'à ce qu'il en ait assez.", add: "Compte tous les fruits ensemble, puis touche la réponse.", memory: "Touche deux cartes. Trouve les deux qui vont ensemble.", pattern: "Regarde la suite, puis touche ce qui vient après.", shapes: "Écoute, puis touche la forme et la couleur que tu entends.", sort: "Fais glisser chaque image de son côté : les animaux ici, la nourriture là.", same: "Touche une image pour entendre son nom dans tes langues.", piano: "Appuie sur les touches pour jouer. Touche une image pour suivre une chanson, ou enregistre la tienne." },
      praise: "Oui ! Bravo !",
      pairs: "Trouve les paires.",
      next: "Qu'est-ce qui vient après ?",
      sortStart: "Les animaux de ce côté. La nourriture de l'autre côté.",
      animal: "Un animal !",
      food: "À manger !",
      draw: "Dessine ce que tu veux !",
      saved: "J'ai gardé ton dessin !",
      same: "Touche une image.",
      piano: "Joue du piano !",
      follow: "Suis la touche qui brille.",
      tune: "Quelle belle chanson !",
      feed: {
        monkey: (n) => `Le singe veut ${n} bananes.`,
        rabbit: (n) => `Le lapin veut ${n} carottes.`,
        bear: (n) => `L'ours veut ${n} poissons.`,
        squirrel: (n) => `L'écureuil veut ${n} noisettes.`,
      },
      addAsk: (a, b) => `${a} et ${b}. Ça fait combien ?`,
      addSay: (a, b, c) => `${a} et ${b} font ${c} !`,
      shapeName: (c, s) => `${FR_SHAPE[s][0]} ${FR_COLOUR[c][FR_SHAPE[s][1]]}`,
      findShape: (c, s) =>
        `Trouve ${FR_SHAPE[s][2]}${FR_SHAPE[s][0]} ${FR_COLOUR[c][FR_SHAPE[s][1]]}.`,
    },
  },
  es: {
    ui: {
      draw: "Dibuja",
      feed: "Da de comer",
      add: "Suma",
      memory: "Busca las parejas",
      pattern: "¿Qué sigue?",
      shapes: "Formas y colores",
      sort: "Ordena",
      same: "Dilo",
      piano: "Piano",
      gallery: "Mis dibujos",
      save: "Guardar",
      clear: "Hoja nueva",
      songs: "Canciones",
      record: "Grabar",
      play: "Escuchar",
      free: "Juego libre",
    },
    locale: "es-419",
    notes: ["do", "re", "mi", "fa", "sol", "la", "si"],
    line: {
      how: { letters: "Aparece una letra. Búscala en el teclado y presiónala.", trace: "Mira la estrella y síguela con tu dedo para dibujar la letra.", words: "Mira el dibujo. Presiona cada letra para escribir la palabra.", count: "Haz el número con espacio y Enter, o cuenta los dibujos y escribe cuántos hay.", draw: "Elige un color y dibuja lo que quieras. Tu dibujo se guarda para ti.", feed: "Arrastra la comida hasta el animal hasta que tenga suficiente.", add: "Cuenta todas las frutas juntas y luego toca la respuesta.", memory: "Toca dos cartas. Busca las dos que van juntas.", pattern: "Mira la serie y luego toca lo que sigue.", shapes: "Escucha y luego toca la forma y el color que oyes.", sort: "Arrastra cada dibujo a su lado: los animales aquí, la comida allá.", same: "Toca un dibujo para oír su nombre en tus idiomas.", piano: "Presiona las teclas para tocar. Toca un dibujo para seguir una canción, o graba la tuya." },
      praise: "¡Sí! ¡Muy bien!",
      pairs: "Busca las parejas.",
      next: "¿Qué sigue?",
      sortStart: "Los animales de este lado. La comida de ese lado.",
      animal: "¡Un animal!",
      food: "¡Comida!",
      draw: "¡Dibuja lo que quieras!",
      saved: "¡Guardé tu dibujo!",
      same: "Toca un dibujo.",
      piano: "¡Toca el piano!",
      follow: "Sigue la tecla que brilla.",
      tune: "¡Qué linda canción!",
      feed: {
        monkey: (n) => `El mono quiere ${n} bananas.`,
        rabbit: (n) => `El conejo quiere ${n} zanahorias.`,
        bear: (n) => `El oso quiere ${n} peces.`,
        squirrel: (n) => `La ardilla quiere ${n} nueces.`,
      },
      addAsk: (a, b) => `${a} y ${b}. ¿Cuántos son?`,
      addSay: (a, b, c) => `¡${a} y ${b} son ${c}!`,
      shapeName: (c, s) => `${ES_SHAPE[s][0]} ${ES_COLOUR[c][ES_SHAPE[s][1]]}`,
      findShape: (c, s) =>
        `Busca ${ES_SHAPE[s][2]} ${ES_SHAPE[s][0]} ${ES_COLOUR[c][ES_SHAPE[s][1]]}.`,
    },
  },
  hi: {
    ui: {
      draw: "चित्र बनाओ",
      feed: "जानवर को खिलाओ",
      add: "जोड़ो",
      memory: "जोड़े ढूँढो",
      pattern: "आगे क्या?",
      shapes: "आकार और रंग",
      sort: "छाँटो",
      same: "बोलो",
      piano: "पियानो",
      gallery: "मेरे चित्र",
      save: "सहेजो",
      clear: "नया पन्ना",
      songs: "गाने",
      record: "रिकॉर्ड",
      play: "सुनो",
      free: "खुला खेल",
    },
    locale: "hi-IN",
    notes: ["सा", "रे", "ग", "म", "प", "ध", "नि"],
    line: {
      how: { letters: "एक अक्षर आएगा। उसे नीचे ढूँढो और दबाओ।", trace: "अक्षर के ऊपर अपनी उँगली चलाकर उसमें रंग भरो।", words: "चित्र देखो। शब्द लिखने के लिए हर अक्षर दबाओ।", count: "स्पेस और एंटर से संख्या बनाओ, या चित्र गिनकर संख्या दबाओ।", draw: "कोई रंग चुनो और जो मन करे वह बनाओ। तुम्हारा चित्र सहेज लिया जाएगा।", feed: "खाने को खींचकर जानवर तक ले जाओ, जब तक उसका पेट न भर जाए।", add: "सारे फल एक साथ गिनो, फिर सही जवाब को छुओ।", memory: "दो पत्ते छुओ। वे दो ढूँढो जो एक जैसे हों।", pattern: "क्रम को देखो, फिर छुओ कि आगे क्या आएगा।", shapes: "सुनो, फिर वही आकार और रंग छुओ।", sort: "हर चित्र को उसकी तरफ़ खींचो: जानवर यहाँ, खाना वहाँ।", same: "किसी चित्र को छुओ और उसका नाम अपनी भाषाओं में सुनो।", piano: "बजाने के लिए कुंजियाँ दबाओ। गाने के साथ चलने के लिए कोई चित्र छुओ, या अपना गाना रिकॉर्ड करो।" },
      praise: "हाँ! शाबाश!",
      pairs: "जोड़े ढूँढो।",
      next: "आगे क्या आएगा?",
      sortStart: "जानवर इस तरफ़। खाना उस तरफ़।",
      animal: "जानवर!",
      food: "खाना!",
      draw: "जो मन करे वह बनाओ!",
      saved: "तुम्हारा चित्र सहेज लिया!",
      same: "किसी चित्र को छुओ।",
      piano: "पियानो बजाओ!",
      follow: "चमकती हुई कुंजी के पीछे चलो।",
      tune: "कितना सुंदर गाना!",
      feed: {
        monkey: (n) => `बंदर को ${n} केले चाहिए।`,
        rabbit: (n) => `खरगोश को ${n} गाजर चाहिए।`,
        bear: (n) => `भालू को ${n} मछलियाँ चाहिए।`,
        squirrel: (n) => `गिलहरी को ${n} अखरोट चाहिए।`,
      },
      addAsk: (a, b) => `${a} और ${b}। कुल कितने हुए?`,
      addSay: (a, b, c) => `${a} और ${b} मिलकर ${c}!`,
      shapeName: (c, s) => `${HI_COLOUR[c]} ${HI_SHAPE[s]}`,
      findShape: (c, s) => `${HI_COLOUR[c]} ${HI_SHAPE[s]} ढूँढो।`,
    },
  },
  ar: {
    ui: {
      draw: "ارسمي",
      feed: "أطعمي الحيوان",
      add: "اجمعي",
      memory: "ابحثي عن الأزواج",
      pattern: "ماذا بعد؟",
      shapes: "الأشكال والألوان",
      sort: "رتّبي",
      same: "قوليها",
      piano: "بيانو",
      gallery: "رسوماتي",
      save: "احفظي",
      clear: "صفحة جديدة",
      songs: "أغاني",
      record: "سجّلي",
      play: "استمعي",
      free: "لعب حر",
    },
    locale: "ar",
    notes: ["دو", "ري", "مي", "فا", "صول", "لا", "سي"],
    line: {
      how: { letters: "سيظهر حرف. ابحثي عنه في الأسفل واضغطيه.", trace: "حرّكي إصبعك فوق الحرف ولوّنيه.", words: "انظري إلى الصورة. اضغطي كل حرف لتكتبي الكلمة.", count: "كوّني الرقم بزر المسافة وزر الإدخال، أو عدّي الصور واضغطي الرقم.", draw: "اختاري لونًا وارسمي ما تحبين. ستُحفظ رسمتكِ لكِ.", feed: "اسحبي الطعام إلى الحيوان حتى يشبع.", add: "عدّي كل الفواكه معًا، ثم المسي الجواب.", memory: "المسي بطاقتين. ابحثي عن البطاقتين المتشابهتين.", pattern: "انظري إلى النمط، ثم المسي ما يأتي بعده.", shapes: "استمعي، ثم المسي الشكل واللون اللذين تسمعينهما.", sort: "اسحبي كل صورة إلى جهتها: الحيوانات هنا، والطعام هناك.", same: "المسي صورة لتسمعي اسمها بلغاتك.", piano: "اضغطي المفاتيح لتعزفي. المسي صورة لتتبعي أغنية، أو سجّلي أغنيتك." },
      praise: "نعم! أحسنتِ!",
      pairs: "ابحثي عن الأزواج.",
      next: "ماذا يأتي بعد ذلك؟",
      sortStart: "الحيوانات في هذه الجهة. الطعام في تلك الجهة.",
      animal: "حيوان!",
      food: "طعام!",
      draw: "ارسمي ما تحبين!",
      saved: "حفظتُ رسمتكِ!",
      same: "المسي صورة.",
      piano: "اعزفي على البيانو!",
      follow: "اتبعي المفتاح المضيء.",
      tune: "يا لها من أغنية جميلة!",
      feed: {
        monkey: (n) => `أعطي القرد موزًا: ${n}.`,
        rabbit: (n) => `أعطي الأرنب جزرًا: ${n}.`,
        bear: (n) => `أعطي الدب سمكًا: ${n}.`,
        squirrel: (n) => `أعطي السنجاب جوزًا: ${n}.`,
      },
      addAsk: (a, b) => `${a} و${b}. كم المجموع؟`,
      addSay: (a, b, c) => `${a} و${b}: ${c}!`,
      shapeName: (c, s) => `${AR_SHAPE[s][0]} ${AR_COLOUR[c][AR_SHAPE[s][1]]}`,
      findShape: (c, s) => {
        const colour = AR_COLOUR[c][AR_SHAPE[s][1]];
        return `أين ال${AR_SHAPE[s][0]} ال${colour}؟`;
      },
    },
  },
};

// The newer games live alongside the older lines, so the game reads them all the same way.
function addGameContent(LANGS) {
  for (const [code, extra] of Object.entries(GAME_CONTENT)) {
    const T = LANGS[code];
    Object.assign(T.ui, extra.ui);
    T.locale = extra.locale;
    T.notes = extra.notes;
    Object.assign(T.line, extra.line);
    T.ui.sounds = STARTS[code].ui;
    T.line.how.sounds = STARTS[code].how;
    T.line.startAsk = STARTS[code].ask;
    T.line.startSay = STARTS[code].say;
  }
}

// Every extra clip a language needs. Clip names match the text, except numbers inside feed and add lines.
function gameLines(code, LANGS) {
  const T = LANGS[code],
    L = GAME_CONTENT[code].line,
    num = (n) => T.numWord(n),
    lines = [];
  for (const value of Object.values(L))
    if (typeof value === "string") lines.push(value);
  for (const value of Object.values(L.how)) lines.push(value);
  lines.push(STARTS[code].how);
  for (const letter of startLetters(code, T)) {
    const word = T.letters[letter][0];
    lines.push(STARTS[code].ask(word), STARTS[code].say(word));
  }
  for (const word of VOCAB) lines.push(word[code]);
  for (const note of T.notes) if (!T.letters?.[note]) lines.push(note);
  for (const feed of FEEDS)
    for (let n = FEED_RANGE[0]; n <= FEED_RANGE[1]; n++)
      lines.push(L.feed[feed.id](num(n)));
  for (let a = 1; a <= ADD_MAX; a++)
    for (let b = 1; b <= ADD_MAX; b++) {
      lines.push(L.addAsk(num(a), num(b)));
      lines.push(L.addSay(num(a), num(b), num(a + b)));
    }
  for (const colour of COLOURS)
    for (const shape of SHAPES) {
      lines.push(L.shapeName(colour.id, shape));
      lines.push(L.findShape(colour.id, shape));
    }
  return lines;
}

// Starts with: she hears a word and taps the letter it begins with. Letters whose word doesn't begin
// with that letter's usual sound are left out, and letters that sound alike never appear together.
const capital = (word) => word.charAt(0).toUpperCase() + word.slice(1);
const STARTS = {
  en: {
    skip: ["I", "X"],
    alike: [["C", "K", "Q", "S"]],
    ui: "Starts with",
    how: "Listen to the word, then tap the letter it starts with.",
    ask: (w) => `${capital(w)}. What does ${w} start with?`,
    say: (w) => `${capital(w)} starts with`,
  },
  fr: {
    skip: ["C", "E", "G", "H", "O", "W", "X"],
    alike: [["K", "Q"], ["S", "Z"]],
    ui: "Première lettre",
    how: "Écoute le mot, puis touche la lettre par laquelle il commence.",
    ask: (w) => `${capital(w)}. Par quelle lettre commence ${w} ?`,
    say: (w) => `${capital(w)} commence par`,
  },
  es: {
    skip: ["H", "W", "X"],
    alike: [["B", "V"], ["C", "K", "Q", "S", "Z"], ["G", "J"], ["I", "Y"]],
    ui: "¿Con qué empieza?",
    how: "Escucha la palabra y toca la letra con la que empieza.",
    ask: (w) => `${capital(w)}. ¿Con qué letra empieza ${w}?`,
    say: (w) => `${capital(w)} empieza con la`,
  },
  hi: {
    skip: [],
    alike: [["श", "स"], ["ब", "व"], ["अ", "आ"], ["इ", "ई"], ["उ", "ऊ"], ["ए", "ऐ"], ["ओ", "औ"], ["ट", "त"], ["ड", "द"]],
    ui: "पहला अक्षर",
    how: "शब्द सुनो, फिर वह अक्षर छुओ जिससे वह शुरू होता है।",
    ask: (w) => `${w}। ${w} किस अक्षर से शुरू होता है?`,
    say: (w) => `${w} का पहला अक्षर है`,
  },
  ar: {
    skip: [],
    alike: [["ت", "ط"], ["س", "ص"], ["ذ", "ز", "ظ"], ["ح", "خ", "ه"], ["ك", "ق"], ["د", "ض"], ["أ", "ع"]],
    ui: "الحرف الأول",
    how: "استمعي إلى الكلمة، ثم المسي الحرف الذي تبدأ به.",
    ask: (w) => `${w}. بأي حرف تبدأ كلمة ${w}؟`,
    say: (w) => `كلمة ${w} تبدأ بحرف`,
  },
};
// The letters this game may ask about, in one language.
const startLetters = (code, T) => Object.keys(T.letters).filter((L) => !STARTS[code].skip.includes(L));
// Two letters that sound alike, so they are never offered side by side.
const soundAlike = (code, a, b) => STARTS[code].alike.some((group) => group.includes(a) && group.includes(b));

if (typeof module !== "undefined")
  module.exports = { STARTS, startLetters, soundAlike, VOCAB, COLOURS, SHAPES, FEEDS, gameLines, addGameContent };
