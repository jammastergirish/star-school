// Everything the game says and shows, per language. The game asks for lines by their exact text,
// and tools/make-voice.mjs records every line from allLines(language) into voice-<code>.js.
const LANGS = {};

// A language needs: label, dir, latin (types on a Latin keyboard, and can use her name), strokes
// (star tracing data exists), rows (on-screen keys), letters (letter -> [word, picture]), words,
// things (picture, how-many question), digits (its own numerals, if any), ui, numWord, letterSound, line.

const FR_UNITS = [
  "",
  "un",
  "deux",
  "trois",
  "quatre",
  "cinq",
  "six",
  "sept",
  "huit",
  "neuf",
  "dix",
  "onze",
  "douze",
  "treize",
  "quatorze",
  "quinze",
  "seize",
  "dix-sept",
  "dix-huit",
  "dix-neuf",
];
const FR_TENS = [
  "",
  "",
  "vingt",
  "trente",
  "quarante",
  "cinquante",
  "soixante",
];
function frenchNumber(n) {
  if (n === 100) return "cent";
  if (n < 20) return FR_UNITS[n];
  if (n < 70) {
    const t = Math.floor(n / 10),
      o = n % 10;
    if (!o) return FR_TENS[t];
    return o === 1 ? `${FR_TENS[t]} et un` : `${FR_TENS[t]}-${FR_UNITS[o]}`;
  }
  if (n < 80)
    return n === 71 ? "soixante et onze" : `soixante-${FR_UNITS[n - 60]}`;
  if (n === 80) return "quatre-vingts";
  return `quatre-vingt-${FR_UNITS[n - 80]}`;
}

const ES_UNITS = [
  "",
  "uno",
  "dos",
  "tres",
  "cuatro",
  "cinco",
  "seis",
  "siete",
  "ocho",
  "nueve",
  "diez",
  "once",
  "doce",
  "trece",
  "catorce",
  "quince",
  "dieciséis",
  "diecisiete",
  "dieciocho",
  "diecinueve",
  "veinte",
  "veintiuno",
  "veintidós",
  "veintitrés",
  "veinticuatro",
  "veinticinco",
  "veintiséis",
  "veintisiete",
  "veintiocho",
  "veintinueve",
];
const ES_TENS = [
  "",
  "",
  "",
  "treinta",
  "cuarenta",
  "cincuenta",
  "sesenta",
  "setenta",
  "ochenta",
  "noventa",
];
function spanishNumber(n) {
  if (n === 100) return "cien";
  if (n < 30) return ES_UNITS[n];
  const t = Math.floor(n / 10),
    o = n % 10;
  return o ? `${ES_TENS[t]} y ${ES_UNITS[o]}` : ES_TENS[t];
}

const HI_NUMBERS =
  "एक दो तीन चार पाँच छह सात आठ नौ दस ग्यारह बारह तेरह चौदह पंद्रह सोलह सत्रह अठारह उन्नीस बीस इक्कीस बाईस तेईस चौबीस पच्चीस छब्बीस सत्ताईस अट्ठाईस उनतीस तीस इकतीस बत्तीस तैंतीस चौंतीस पैंतीस छत्तीस सैंतीस अड़तीस उनतालीस चालीस इकतालीस बयालीस तैंतालीस चौवालीस पैंतालीस छियालीस सैंतालीस अड़तालीस उनचास पचास इक्यावन बावन तिरपन चौवन पचपन छप्पन सत्तावन अट्ठावन उनसठ साठ इकसठ बासठ तिरसठ चौंसठ पैंसठ छियासठ सड़सठ अड़सठ उनहत्तर सत्तर इकहत्तर बहत्तर तिहत्तर चौहत्तर पचहत्तर छिहत्तर सतहत्तर अठहत्तर उनासी अस्सी इक्यासी बयासी तिरासी चौरासी पचासी छियासी सत्तासी अट्ठासी नवासी नब्बे इक्यानवे बानवे तिरानवे चौरानवे पंचानवे छियानवे सत्तानवे अट्ठानवे निन्यानवे सौ".split(
    " ",
  );

const AR_UNITS = [
  "",
  "واحد",
  "اثنان",
  "ثلاثة",
  "أربعة",
  "خمسة",
  "ستة",
  "سبعة",
  "ثمانية",
  "تسعة",
];
const AR_TENS = [
  "",
  "عشرة",
  "عشرون",
  "ثلاثون",
  "أربعون",
  "خمسون",
  "ستون",
  "سبعون",
  "ثمانون",
  "تسعون",
];
function arabicNumber(n) {
  if (n === 100) return "مئة";
  if (n < 10) return AR_UNITS[n];
  if (n === 11) return "أحد عشر";
  if (n === 12) return "اثنا عشر";
  const t = Math.floor(n / 10),
    o = n % 10;
  if (!o) return AR_TENS[t];
  if (t === 1) return `${AR_UNITS[o]} عشر`;
  return `${AR_UNITS[o]} و${AR_TENS[t]}`;
}
const AR_COUNTED = [
  "",
  "",
  "",
  "ثلاث",
  "أربع",
  "خمس",
  "ست",
  "سبع",
  "ثماني",
  "تسع",
  "عشر",
];
const AR_NAMES = {
  أ: "ألف",
  ب: "باء",
  ت: "تاء",
  ث: "ثاء",
  ج: "جيم",
  ح: "حاء",
  خ: "خاء",
  د: "دال",
  ذ: "ذال",
  ر: "راء",
  ز: "زاي",
  س: "سين",
  ش: "شين",
  ص: "صاد",
  ض: "ضاد",
  ط: "طاء",
  ظ: "ظاء",
  ع: "عين",
  غ: "غين",
  ف: "فاء",
  ق: "قاف",
  ك: "كاف",
  ل: "لام",
  م: "ميم",
  ن: "نون",
  ه: "هاء",
  و: "واو",
  ي: "ياء",
};

const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;
const LATIN_ROWS = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];

LANGS.en = {
  label: "English",
  dir: "ltr",
  latin: true,
  strokes: true,
  rows: LATIN_ROWS,
  letters: {
    A: ["apple", "🍎"],
    B: ["bear", "🐻"],
    C: ["cat", "🐱"],
    D: ["dog", "🐶"],
    E: ["elephant", "🐘"],
    F: ["fish", "🐟"],
    G: ["grapes", "🍇"],
    H: ["horse", "🐴"],
    I: ["ice cream", "🍦"],
    J: ["juice", "🧃"],
    K: ["kite", "🪁"],
    L: ["lion", "🦁"],
    M: ["monkey", "🐵"],
    N: ["nose", "👃"],
    O: ["octopus", "🐙"],
    P: ["pig", "🐷"],
    Q: ["queen", "👸"],
    R: ["rabbit", "🐰"],
    S: ["sun", "☀️"],
    T: ["tiger", "🐯"],
    U: ["umbrella", "☂️"],
    V: ["violin", "🎻"],
    W: ["whale", "🐳"],
    X: ["fox", "🦊"],
    Y: ["yo-yo", "🪀"],
    Z: ["zebra", "🦓"],
  },
  words: [
    ["CAT", "🐱"],
    ["DOG", "🐶"],
    ["SUN", "☀️"],
    ["PIG", "🐷"],
    ["HAT", "🎩"],
    ["BUS", "🚌"],
    ["BED", "🛏️"],
    ["EGG", "🥚"],
    ["BEE", "🐝"],
    ["COW", "🐮"],
    ["ANT", "🐜"],
    ["FOX", "🦊"],
    ["HEN", "🐔"],
    ["MAP", "🗺️"],
    ["BAT", "🦇"],
    ["CAR", "🚗"],
  ],
  things: [
    ["⭐", "stars"],
    ["🍓", "strawberries"],
    ["🐞", "ladybugs"],
    ["🐟", "fish"],
    ["🍎", "apples"],
    ["🦋", "butterflies"],
    ["🐸", "frogs"],
    ["🐥", "chicks"],
  ],
  ui: {
    letters: "Find the key",
    trace: "Follow the star",
    words: "Type a word",
    count: "Count",
    space: "space",
    enter: "return",
  },
  numWord: (n) => String(n),
  letterSound: (L) => `${L}.`,
  line: {
    hello: "Hello!",
    find: (L) => `Find ${L}.`,
    letterIs: (L) =>
      `${L} ${L === "X" ? "is in" : "is for"} ${LANGS.en.letters[L][0]}.`,
    thisIs: (L) => `This is ${L}. Watch the star.`,
    typeWord: (w) => `Type ${w.toLowerCase()}.`,
    word: (w) => `${w.toLowerCase()}!`,
    howMany: (thing) => `How many ${thing}? Type the number.`,
    make: (n) => `Make ${n}.`,
    pressSpace: (n) => `Press space ${n === 1 ? "one time" : `${n} times`}.`,
    madeOf(n) {
      const t = Math.floor(n / 10),
        o = n % 10;
      if (n < 10) return `${n}!`;
      if (!o) return `${plural(t, "ten")} ${t === 1 ? "makes" : "make"} ${n}!`;
      return `${plural(t, "ten")} and ${plural(o, "one")} make ${n}!`;
    },
    sticker: "Hooray! You got a sticker!",
    nowYou: "Now you! Follow the star.",
    followStar: "Follow the star.",
    typeName: "Type your name.",
    yourName: "That's your name!",
    tensExplained: "Return makes a ten. Space makes a one.",
    nowSpace: "Now press space.",
    letsCount: "Let's count.",
    chartStart: "Press space and count to 100. Return jumps to the next ten.",
    chartDone: "100! You counted all the way to 100!",
  },
};

LANGS.fr = {
  label: "Français",
  dir: "ltr",
  latin: true,
  strokes: true,
  rows: LATIN_ROWS,
  letters: {
    A: ["ananas", "🍍"],
    B: ["ballon", "🎈"],
    C: ["chat", "🐱"],
    D: ["dauphin", "🐬"],
    E: ["éléphant", "🐘"],
    F: ["fraise", "🍓"],
    G: ["girafe", "🦒"],
    H: ["hibou", "🦉"],
    I: ["île", "🏝️"],
    J: ["jus", "🧃"],
    K: ["kiwi", "🥝"],
    L: ["lion", "🦁"],
    M: ["maison", "🏠"],
    N: ["nuage", "☁️"],
    O: ["ours", "🐻"],
    P: ["poisson", "🐟"],
    Q: ["quille", "🎳"],
    R: ["renard", "🦊"],
    S: ["soleil", "☀️"],
    T: ["tortue", "🐢"],
    U: ["usine", "🏭"],
    V: ["vache", "🐮"],
    W: ["wagon", "🚃"],
    X: ["taxi", "🚕"],
    Y: ["yo-yo", "🪀"],
    Z: ["zèbre", "🦓"],
  },
  words: [
    ["CHAT", "🐱"],
    ["LUNE", "🌙"],
    ["NEZ", "👃"],
    ["LIT", "🛏️"],
    ["BUS", "🚌"],
    ["OURS", "🐻"],
    ["RAT", "🐀"],
    ["COQ", "🐓"],
    ["ROI", "🤴"],
    ["PIED", "🦶"],
    ["MAIN", "✋"],
  ],
  things: [
    ["⭐", "d'étoiles"],
    ["🍓", "de fraises"],
    ["🐞", "de coccinelles"],
    ["🐟", "de poissons"],
    ["🍎", "de pommes"],
    ["🦋", "de papillons"],
    ["🐸", "de grenouilles"],
    ["🐥", "de poussins"],
  ],
  ui: {
    letters: "Trouve la touche",
    trace: "Suis l'étoile",
    words: "Écris un mot",
    count: "Compte",
    space: "espace",
    enter: "entrée",
  },
  numWord: frenchNumber,
  letterSound: (L) => `${L}.`,
  line: {
    hello: "Bonjour !",
    find: (L) => `Trouve ${L}.`,
    letterIs: (L) =>
      L === "X" ? "X est dans taxi." : `${L} comme ${LANGS.fr.letters[L][0]}.`,
    thisIs: (L) => `Voici ${L}. Regarde l'étoile.`,
    typeWord: (w) => `Écris ${w.toLowerCase()}.`,
    word: (w) => `${w.toLowerCase()} !`,
    howMany: (thing) => `Combien ${thing} ? Tape le nombre.`,
    make: (n) => `Fais ${frenchNumber(n)}.`,
    pressSpace: (n) =>
      `Appuie sur espace ${n === 1 ? "une fois" : `${frenchNumber(n)} fois`}.`,
    madeOf(n) {
      const t = Math.floor(n / 10),
        o = n % 10,
        word = frenchNumber(n);
      if (n < 10) return `${word} !`;
      const tens = t === 1 ? "une dizaine" : `${frenchNumber(t)} dizaines`;
      if (!o) return `${tens} ${t === 1 ? "fait" : "font"} ${word} !`;
      return `${tens} et ${o === 1 ? "une unité" : `${frenchNumber(o)} unités`} font ${word} !`;
    },
    sticker: "Bravo ! Tu as gagné un autocollant !",
    nowYou: "À toi ! Suis l'étoile.",
    followStar: "Suis l'étoile.",
    typeName: "Écris ton prénom.",
    yourName: "C'est ton prénom !",
    tensExplained: "Entrée fait une dizaine. Espace fait une unité.",
    nowSpace: "Maintenant, appuie sur espace.",
    letsCount: "Comptons.",
    chartStart:
      "Appuie sur espace et compte jusqu'à cent. Entrée saute à la dizaine suivante.",
    chartDone: "Cent ! Tu as compté jusqu'à cent !",
  },
};

LANGS.es = {
  label: "Español",
  dir: "ltr",
  latin: true,
  strokes: true,
  rows: ["QWERTYUIOP", "ASDFGHJKLÑ", "ZXCVBNM"],
  letters: {
    A: ["abeja", "🐝"],
    B: ["ballena", "🐳"],
    C: ["casa", "🏠"],
    D: ["delfín", "🐬"],
    E: ["elefante", "🐘"],
    F: ["fresa", "🍓"],
    G: ["gato", "🐱"],
    H: ["helado", "🍦"],
    I: ["isla", "🏝️"],
    J: ["jirafa", "🦒"],
    K: ["kiwi", "🥝"],
    L: ["león", "🦁"],
    M: ["manzana", "🍎"],
    N: ["nube", "☁️"],
    Ñ: ["ñu", "🦬"],
    O: ["oso", "🐻"],
    P: ["pato", "🦆"],
    Q: ["queso", "🧀"],
    R: ["rana", "🐸"],
    S: ["sol", "☀️"],
    T: ["tortuga", "🐢"],
    U: ["uva", "🍇"],
    V: ["vaca", "🐮"],
    W: ["wafle", "🧇"],
    X: ["taxi", "🚕"],
    Y: ["yoyó", "🪀"],
    Z: ["zapato", "👟"],
  },
  words: [
    ["GATO", "🐱"],
    ["SOL", "☀️"],
    ["PAN", "🍞"],
    ["OSO", "🐻"],
    ["PEZ", "🐟"],
    ["CASA", "🏠"],
    ["MANO", "✋"],
    ["LUNA", "🌙"],
    ["PATO", "🦆"],
    ["RANA", "🐸"],
    ["VACA", "🐮"],
    ["UVA", "🍇"],
  ],
  things: [
    ["⭐", "¿Cuántas estrellas hay?"],
    ["🍓", "¿Cuántas fresas hay?"],
    ["🐞", "¿Cuántas catarinas hay?"],
    ["🐟", "¿Cuántos peces hay?"],
    ["🍎", "¿Cuántas manzanas hay?"],
    ["🦋", "¿Cuántas mariposas hay?"],
    ["🐸", "¿Cuántas ranas hay?"],
    ["🐥", "¿Cuántos pollitos hay?"],
  ],
  ui: {
    letters: "Busca la tecla",
    trace: "Sigue la estrella",
    words: "Escribe una palabra",
    count: "Cuenta",
    space: "espacio",
    enter: "enter",
  },
  numWord: spanishNumber,
  letterSound: (L) => `${L}.`,
  line: {
    hello: "¡Hola!",
    find: (L) => `Busca la ${L}.`,
    letterIs: (L) =>
      L === "X" ? "La X está en taxi." : `${L} de ${LANGS.es.letters[L][0]}.`,
    thisIs: (L) => `Esta es la ${L}. Mira la estrella.`,
    typeWord: (w) => `Escribe ${w.toLowerCase()}.`,
    word: (w) => `¡${w.toLowerCase()}!`,
    howMany: (thing) => `${thing} Escribe el número.`,
    make: (n) => `Haz ${spanishNumber(n)}.`,
    pressSpace: (n) =>
      `Presiona espacio ${n === 1 ? "una vez" : `${spanishNumber(n)} veces`}.`,
    madeOf(n) {
      const t = Math.floor(n / 10),
        o = n % 10,
        word = spanishNumber(n);
      if (n < 10) return `¡${word}!`;
      const tens = t === 1 ? "una decena" : `${spanishNumber(t)} decenas`;
      if (!o) return `¡${tens} ${t === 1 ? "es" : "son"} ${word}!`;
      return `¡${tens} y ${o === 1 ? "una unidad" : `${spanishNumber(o)} unidades`} son ${word}!`;
    },
    sticker: "¡Muy bien! ¡Tienes un premio!",
    nowYou: "¡Ahora tú! Sigue la estrella.",
    followStar: "Sigue la estrella.",
    typeName: "Escribe tu nombre.",
    yourName: "¡Ese es tu nombre!",
    tensExplained: "Enter hace una decena. Espacio hace una unidad.",
    nowSpace: "Ahora presiona espacio.",
    letsCount: "Vamos a contar.",
    chartStart:
      "Presiona espacio y cuenta hasta cien. Enter salta a la siguiente decena.",
    chartDone: "¡Cien! ¡Contaste hasta cien!",
  },
};

LANGS.hi = {
  label: "हिन्दी",
  dir: "ltr",
  latin: false,
  strokes: false,
  digits: "०१२३४५६७८९",
  rows: ["अआइईउऊएऐओऔ", "कखगघचछजझट", "डतथदधनपफब", "भमयरलवशसह"],
  letters: {
    अ: ["अंगूर", "🍇"],
    आ: ["आम", "🥭"],
    इ: ["इंद्रधनुष", "🌈"],
    ई: ["ईंट", "🧱"],
    उ: ["उल्लू", "🦉"],
    ऊ: ["ऊँट", "🐫"],
    ए: ["एक", "1️⃣"],
    ऐ: ["ऐनक", "👓"],
    ओ: ["ओस", "💧"],
    औ: ["औरत", "👩"],
    क: ["कबूतर", "🕊️"],
    ख: ["खरगोश", "🐰"],
    ग: ["गाय", "🐮"],
    घ: ["घर", "🏠"],
    च: ["चम्मच", "🥄"],
    छ: ["छाता", "☂️"],
    ज: ["जहाज़", "🚢"],
    झ: ["झूला", "🛝"],
    ट: ["टमाटर", "🍅"],
    ड: ["डमरू", "🪘"],
    त: ["तरबूज़", "🍉"],
    थ: ["थाली", "🍽️"],
    द: ["दरवाज़ा", "🚪"],
    ध: ["धनुष", "🏹"],
    न: ["नल", "🚰"],
    प: ["पतंग", "🪁"],
    फ: ["फूल", "🌸"],
    ब: ["बकरी", "🐐"],
    भ: ["भालू", "🐻"],
    म: ["मछली", "🐟"],
    य: ["यान", "🚀"],
    र: ["रेलगाड़ी", "🚂"],
    ल: ["लड़की", "👧"],
    व: ["वन", "🌲"],
    श: ["शेर", "🦁"],
    स: ["सेब", "🍎"],
    ह: ["हाथी", "🐘"],
  },
  words: [
    ["कमल", "🪷"],
    ["घर", "🏠"],
    ["नल", "🚰"],
    ["फल", "🍎"],
    ["बस", "🚌"],
    ["वन", "🌲"],
    ["जल", "💧"],
    ["पर", "🪶"],
    ["धन", "💰"],
  ],
  things: [
    ["⭐", "कितने तारे हैं?"],
    ["🍎", "कितने सेब हैं?"],
    ["🐟", "कितनी मछलियाँ हैं?"],
    ["🦋", "कितनी तितलियाँ हैं?"],
    ["🐸", "कितने मेंढक हैं?"],
    ["🐥", "कितने चूज़े हैं?"],
    ["🥭", "कितने आम हैं?"],
  ],
  ui: {
    letters: "अक्षर ढूँढो",
    trace: "अक्षर में रंग भरो",
    words: "शब्द लिखो",
    count: "गिनो",
    space: "स्पेस",
    enter: "एंटर",
  },
  numWord: (n) => HI_NUMBERS[n - 1],
  letterSound: (L) => `${L}।`,
  line: {
    hello: "नमस्ते!",
    find: (L) => `${L} ढूँढो।`,
    letterIs: (L) => `${L} से ${LANGS.hi.letters[L][0]}।`,
    thisIs: (L) => `यह ${L} है। इसमें रंग भरो।`,
    typeWord: (w) => `${w} लिखो।`,
    word: (w) => `${w}!`,
    howMany: (thing) => `${thing} नंबर दबाओ।`,
    make: (n) => `${HI_NUMBERS[n - 1]} बनाओ।`,
    pressSpace: (n) => `स्पेस ${HI_NUMBERS[n - 1]} बार दबाओ।`,
    madeOf(n) {
      const t = Math.floor(n / 10),
        o = n % 10,
        word = HI_NUMBERS[n - 1];
      if (n < 10) return `${word}!`;
      if (!o) return `${HI_NUMBERS[t - 1]} दहाई मतलब ${word}!`;
      return `${HI_NUMBERS[t - 1]} दहाई और ${HI_NUMBERS[o - 1]} इकाई मिलकर ${word}!`;
    },
    sticker: "शाबाश! तुम्हें एक स्टिकर मिला!",
    nowYou: "अब तुम्हारी बारी!",
    followStar: "अक्षर में रंग भरो।",
    tensExplained: "एंटर से एक दहाई बनती है। स्पेस से एक इकाई बनती है।",
    nowSpace: "अब स्पेस दबाओ।",
    letsCount: "चलो गिनते हैं।",
    chartStart: "स्पेस दबाओ और सौ तक गिनो। एंटर अगली दहाई पर ले जाता है।",
    chartDone: "सौ! तुमने सौ तक गिन लिया!",
  },
};

LANGS.ar = {
  label: "العربية",
  dir: "rtl",
  latin: false,
  strokes: false,
  digits: "٠١٢٣٤٥٦٧٨٩",
  rows: ["أبتثجحخدذر", "زسشصضطظعغ", "فقكلمنهوي"],
  letters: {
    أ: ["أرنب", "🐰"],
    ب: ["بطة", "🦆"],
    ت: ["تفاحة", "🍎"],
    ث: ["ثعلب", "🦊"],
    ج: ["جمل", "🐫"],
    ح: ["حصان", "🐴"],
    خ: ["خروف", "🐑"],
    د: ["دب", "🐻"],
    ذ: ["ذرة", "🌽"],
    ر: ["رجل", "👨"],
    ز: ["زرافة", "🦒"],
    س: ["سمكة", "🐟"],
    ش: ["شمس", "☀️"],
    ص: ["صقر", "🦅"],
    ض: ["ضفدع", "🐸"],
    ط: ["طائرة", "✈️"],
    ظ: ["ظرف", "✉️"],
    ع: ["عنب", "🍇"],
    غ: ["غزال", "🦌"],
    ف: ["فيل", "🐘"],
    ق: ["قمر", "🌙"],
    ك: ["كلب", "🐶"],
    ل: ["ليمون", "🍋"],
    م: ["موز", "🍌"],
    ن: ["نحلة", "🐝"],
    ه: ["هدية", "🎁"],
    و: ["وردة", "🌹"],
    ي: ["يد", "✋"],
  },
  words: [
    ["قمر", "🌙"],
    ["شمس", "☀️"],
    ["كلب", "🐶"],
    ["بيت", "🏠"],
    ["موز", "🍌"],
    ["فيل", "🐘"],
    ["دب", "🐻"],
    ["يد", "✋"],
    ["عين", "👁️"],
  ],
  things: [
    ["⭐", "كم نجمة؟"],
    ["🍎", "كم تفاحة؟"],
    ["🐟", "كم سمكة؟"],
    ["🦋", "كم فراشة؟"],
    ["🐸", "كم ضفدعًا؟"],
    ["🍋", "كم ليمونة؟"],
    ["🐦", "كم عصفورًا؟"],
  ],
  ui: {
    letters: "ابحثي عن الحرف",
    trace: "لوّني الحرف",
    words: "اكتبي كلمة",
    count: "عدّي",
    space: "مسافة",
    enter: "إدخال",
  },
  numWord: arabicNumber,
  letterSound: (L) => `${AR_NAMES[L]}.`,
  line: {
    hello: "مرحبًا!",
    find: (L) => `أين حرف ${AR_NAMES[L]}؟`,
    letterIs: (L) => `حرف ${AR_NAMES[L]}: ${LANGS.ar.letters[L][0]}.`,
    thisIs: (L) => `هذا حرف ${AR_NAMES[L]}. لوّني الحرف.`,
    typeWord: (w) => `اكتبي ${w}.`,
    word: (w) => `${w}!`,
    howMany: (thing) => `${thing} اضغطي الرقم.`,
    make: (n) => `كوّني الرقم ${arabicNumber(n)}.`,
    pressSpace: (n) =>
      `اضغطي زر المسافة ${n === 1 ? "مرة واحدة" : n === 2 ? "مرتين" : `${AR_COUNTED[n]} مرات`}.`,
    madeOf(n) {
      const t = Math.floor(n / 10),
        o = n % 10,
        word = arabicNumber(n);
      if (n < 10) return `${word}!`;
      const tens =
        t === 1 ? "عشرة واحدة" : t === 2 ? "عشرتان" : `${AR_COUNTED[t]} عشرات`;
      if (!o) return `${tens}: ${word}!`;
      const ones =
        o === 1 ? "وحدة واحدة" : o === 2 ? "وحدتان" : `${AR_COUNTED[o]} وحدات`;
      return `${tens} و${ones}: ${word}!`;
    },
    sticker: "أحسنتِ! لقد ربحتِ ملصقًا!",
    nowYou: "الآن دورك!",
    followStar: "لوّني الحرف.",
    tensExplained: "زر الإدخال يضيف عشرة. زر المسافة يضيف واحدًا.",
    nowSpace: "الآن اضغطي زر المسافة.",
    letsCount: "هيا نعدّ.",
    chartStart:
      "اضغطي زر المسافة وعدّي حتى مئة. زر الإدخال ينتقل إلى العشرة التالية.",
    chartDone: "مئة! لقد عددتِ حتى مئة!",
  },
};

// Every clip a language needs, as clip name -> the text to speak.
function allLines(code) {
  const T = LANGS[code],
    L = T.line,
    lines = new Map();
  const add = (line) => lines.set(line, line);
  Object.values(L).forEach((l) => typeof l === "string" && add(l));
  for (const letter of Object.keys(T.letters)) {
    lines.set(letter, T.letterSound(letter));
    add(L.find(letter));
    add(L.letterIs(letter));
    add(L.thisIs(letter));
  }
  for (const [w] of T.words) {
    add(L.typeWord(w));
    add(L.word(w));
  }
  for (const [, thing] of T.things) add(L.howMany(thing));
  for (let n = 1; n <= 100; n++) {
    lines.set(String(n), T.numWord(n));
    add(L.madeOf(n));
    add(n < 10 ? L.pressSpace(n) : L.make(n));
  }
  return lines;
}

if (typeof module !== "undefined") module.exports = { LANGS, allLines };
