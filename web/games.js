// The newer games. Each is a start function plus one entry in EXTRA_GAMES, which puts its card on
// the home screen. They share the main game's helpers: enterGame, addStar, say, keyHandler and T.
addGameContent(LANGS);

const EXTRA_GAMES = [
  { part: "sounds", pic: "🔤", start: startSounds },
  { part: "draw", pic: "🎨", start: startDraw },
  { part: "feed", pic: "🐵", start: startFeed },
  { part: "add", pic: "🧮", start: startAdd },
  { part: "memory", pic: "🃏", start: startMemory },
  { part: "pattern", pic: "🔴", start: startPattern },
  { part: "shapes", pic: "🔷", start: startShapes },
  { part: "sort", pic: "🧺", start: startSort },
  { part: "same", pic: "💬", start: startSame },
  { part: "piano", pic: "🎹", start: startPiano },
];
let leaveHook = null; // runs when she leaves a game, so a drawing is never lost
let rawKeyHandler = null; // for games that want keys the letter games ignore

const pickFrom = (list) => list[Math.floor(Math.random() * list.length)];
const between = (low, high) =>
  low + Math.floor(Math.random() * (high - low + 1));
const numberWord = (n) => T.numWord(n);

// The languages she is learning. The game's own language is always one of them.
function learningLanguages() {
  const chosen = store.get("known", null) || [T.code];
  const list = Object.keys(LANGS).filter(
    (code) => chosen.includes(code) || code === T.code,
  );
  return list;
}
const inEachLanguage = (lineFor) =>
  learningLanguages().map((lang) => ({ lang, line: lineFor(lang) }));
const loadLearning = () => Promise.all(learningLanguages().map(loadVoice));

function panel(html) {
  const stage = $("stage");
  stage.className = "panel";
  stage.innerHTML = html;
  return stage;
}

// Drag an element onto something, or just tap it: a finger, a Pencil and a trackpad all work.
function draggable(el, { onDrop, onTap }) {
  el.style.touchAction = "none";
  el.addEventListener("pointerdown", (start) => {
    start.preventDefault();
    el.setPointerCapture(start.pointerId);
    let moved = false;
    const move = (e) => {
      const dx = e.clientX - start.clientX,
        dy = e.clientY - start.clientY;
      if (Math.hypot(dx, dy) > 8) moved = true;
      el.style.transform = `translate(${dx}px, ${dy}px) scale(1.15)`;
      el.style.zIndex = 20;
    };
    const up = (e) => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
      el.style.transform = "";
      el.style.zIndex = "";
      if (!moved) onTap?.(el);
      else if (e.type === "pointerup") onDrop?.(el, e.clientX, e.clientY);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
  });
}
const isOver = (target, x, y) => {
  const box = target.getBoundingClientRect();
  return (
    x >= box.left - 24 &&
    x <= box.right + 24 &&
    y >= box.top - 24 &&
    y <= box.bottom + 24
  );
};
const wiggle = (el) => {
  el.classList.remove("wrong");
  void el.offsetWidth;
  el.classList.add("wrong");
};
async function wellDone(r, line = T.line.praise) {
  cheer();
  await say(line);
  await wait(300);
  if (r !== round) return false;
  await addStar(r);
  return r === round;
}

// Feed the animal: she drags in exactly the number it asks for.
function startFeed() {
  const r = enterGame(4, false, false);
  function next() {
    const feed = pickFrom(FEEDS),
      n = between(FEED_RANGE[0], FEED_RANGE[1]),
      ask = T.line.feed[feed.id](numberWord(n));
    let fed = 0;
    panel(`<div class="feed">
        <div class="pile" id="pile"></div>
        <div class="eater"><button class="animal" id="animal" aria-label="${numberWord(n)}">${feed.animal}</button>
        <div class="tally"><b id="fed">0</b> / ${n}</div></div>
      </div>`);
    const animal = $("animal");
    animal.onclick = () => say(ask);
    const eat = (item) => {
      if (fed >= n) return;
      fed++;
      item.remove();
      $("fed").textContent = fed;
      animal.classList.remove("munch");
      void animal.offsetWidth;
      animal.classList.add("munch");
      ding();
      if (fed < n) return void say(String(fed));
      say(String(fed)).then(async () => {
        if (r === round && (await wellDone(r))) next();
      });
    };
    for (let i = 0; i < n + 3; i++) {
      const item = document.createElement("div");
      item.className = "food";
      item.textContent = feed.food;
      $("pile").append(item);
      draggable(item, {
        onTap: eat,
        onDrop: (el, x, y) => isOver(animal, x, y) && eat(el),
      });
    }
    say(ask);
  }
  next();
}

// First adding: she counts two groups together and picks the answer.
function startAdd() {
  const r = enterGame(4, false, false);
  numMode = true;
  const fruit = ["🍎", "🍓", "🍌", "🍊", "🍐", "🍑"];
  function next() {
    const a = between(1, ADD_MAX),
      b = between(1, ADD_MAX),
      total = a + b,
      pic = pickFrom(fruit),
      ask = T.line.addAsk(numberWord(a), numberWord(b));
    const answers = new Set([total]);
    while (answers.size < 3) {
      const guess = total + between(-3, 3);
      if (guess >= 1 && guess <= 10) answers.add(guess);
    }
    const group = (n) => `<div class="group-of">${pic.repeat(n)}</div>`;
    panel(`<div class="sum" id="again">${group(a)}<b>+</b>${group(b)}<b>=</b><b class="unknown">?</b></div>
      <div class="answers">${shuffle([...answers])
        .map((n) => `<button class="answer" data-n="${n}">${n}</button>`)
        .join("")}</div>`);
    $("again").onclick = () => say(ask);
    let open = true,
      lastHelp = 0;
    const choose = async (n, button) => {
      if (!open) return;
      if (n !== total) {
        wiggle(button);
        boop();
        if (Date.now() - lastHelp > 6000) {
          lastHelp = Date.now();
          const count = [];
          for (let i = 1; i <= total; i++) count.push(i);
          say([T.line.letsCount, ...count]);
        }
        return;
      }
      open = false;
      button.classList.add("right");
      document.querySelector(".unknown").textContent = total;
      if (
        await wellDone(
          r,
          T.line.addSay(numberWord(a), numberWord(b), numberWord(total)),
        )
      )
        next();
    };
    document.querySelectorAll(".answer").forEach((button) => {
      button.onclick = () => choose(+button.dataset.n, button);
    });
    keyHandler = (key) => {
      const n = key === "0" ? 10 : +key;
      const button = document.querySelector(`.answer[data-n="${n}"]`);
      if (button) choose(n, button);
    };
    say(ask);
  }
  next();
}

// Memory pairs: a picture and its twin, a letter and its picture, or a number and that many dots.
function startMemory() {
  const r = enterGame(3, false, false);
  let turn = 0;
  function deal() {
    const kind = ["pictures", "letters", "numbers"][turn++ % 3];
    let cards;
    if (kind === "pictures") {
      cards = shuffle(VOCAB)
        .slice(0, 4)
        .flatMap((word) => {
          const twin = { pair: word.en, show: word.pic, line: word[T.code] };
          return [twin, { ...twin }];
        });
    } else if (kind === "letters") {
      cards = shuffle(Object.keys(T.letters))
        .slice(0, 4)
        .flatMap((L) => [
          { pair: L, show: L, line: L, big: true },
          { pair: L, show: T.letters[L][1], line: T.line.letterIs(L) },
        ]);
    } else {
      cards = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9])
        .slice(0, 4)
        .flatMap((n) => [
          { pair: n, show: n, line: String(n), big: true },
          {
            pair: n,
            show: `<span class="dots">${"●".repeat(n)}</span>`,
            line: String(n),
          },
        ]);
    }
    panel(
      `<div class="cards">${shuffle(cards)
        .map(
          (card, i) =>
            `<button class="card" data-i="${i}"><span class="back">${skin.mascot}</span><span class="front ${card.big ? "big" : ""}">${card.show}</span></button>`,
        )
        .join("")}</div>`,
    );
    const dealt = [...document.querySelectorAll(".card")];
    const order = shuffle(cards);
    dealt.forEach((button, i) => {
      button.querySelector(".front").innerHTML = order[i].show;
      button.querySelector(".front").classList.toggle("big", !!order[i].big);
    });
    let first = null,
      busy = false,
      matched = 0;
    dealt.forEach((button, i) => {
      button.onclick = async () => {
        if (busy || button.classList.contains("up")) return;
        button.classList.add("up");
        say(order[i].line);
        if (!first) return void (first = { button, i });
        const a = first;
        first = null;
        if (order[a.i].pair === order[i].pair) {
          ding();
          a.button.classList.add("done");
          button.classList.add("done");
          matched += 2;
          if (matched === order.length) {
            await wait(900);
            if (r === round && (await wellDone(r))) deal();
          }
          return;
        }
        busy = true;
        await wait(1200);
        if (r !== round) return;
        a.button.classList.remove("up");
        button.classList.remove("up");
        busy = false;
      };
    });
    say(T.line.pairs);
  }
  deal();
}

// What comes next: she finishes a repeating pattern.
function startPattern() {
  const r = enterGame(4, false, false);
  const sets = [
    ["🔴", "🔵", "🟡", "🟢"],
    ["🍎", "🍌", "🍇", "🍓"],
    ["🐱", "🐶", "🐰", "🐸"],
    ["⭐", "🌙", "☀️", "☁️"],
  ];
  const shapes = [
    [0, 1],
    [0, 0, 1],
    [0, 1, 1],
    [0, 1, 2],
  ];
  function next() {
    const items = shuffle(pickFrom(sets)),
      shape = pickFrom(shapes),
      length = shape.length * 2 + between(1, shape.length),
      row = Array.from({ length }, (_, i) => items[shape[i % shape.length]]),
      answer = items[shape[length % shape.length]],
      options = shuffle(items.slice(0, Math.max(3, shape.length)));
    panel(`<div class="pattern" id="again">${row.map((item) => `<span>${item}</span>`).join("")}<span class="unknown" id="unknown">?</span></div>
      <div class="answers">${options.map((item) => `<button class="answer" data-item="${item}">${item}</button>`).join("")}</div>`);
    $("again").onclick = () => say(T.line.next);
    let open = true;
    document.querySelectorAll(".answer").forEach((button) => {
      button.onclick = async () => {
        if (!open) return;
        if (button.dataset.item !== answer) {
          wiggle(button);
          boop();
          return void say(T.line.next);
        }
        open = false;
        button.classList.add("right");
        $("unknown").textContent = answer;
        $("unknown").classList.remove("unknown");
        if (await wellDone(r)) next();
      };
    });
    say(T.line.next);
  }
  next();
}

// Shapes and colours: asked in the game's language, then named in every language she is learning.
function shapeSvg(shape, hex) {
  const art = {
    circle: `<circle cx="50" cy="50" r="42"/>`,
    square: `<rect x="12" y="12" width="76" height="76" rx="8"/>`,
    triangle: `<path d="M50 10 L92 86 H8 Z" stroke-linejoin="round"/>`,
    star: `<path d="M50 6 L62 38 L96 40 L69 61 L79 94 L50 75 L21 94 L31 61 L4 40 L38 38 Z" stroke-linejoin="round"/>`,
  };
  return `<svg viewBox="0 0 100 100" aria-hidden="true" fill="${hex}" stroke="rgba(255,255,255,0.85)" stroke-width="3">${art[shape]}</svg>`;
}
function startShapes() {
  const r = enterGame(4, false, false);
  loadLearning();
  function next() {
    const options = new Map();
    while (options.size < 6) {
      const colour = pickFrom(COLOURS),
        shape = pickFrom(SHAPES);
      options.set(colour.id + shape, { colour, shape });
    }
    const list = [...options.values()],
      target = pickFrom(list),
      ask = T.line.findShape(target.colour.id, target.shape);
    panel(
      `<div class="shapes" id="shapes">${list.map((o, i) => `<button class="shape" data-i="${i}" aria-label="${o.colour.id} ${o.shape}">${shapeSvg(o.shape, o.colour.hex)}</button>`).join("")}</div>`,
    );
    let open = true;
    document.querySelectorAll(".shape").forEach((button) => {
      button.onclick = async () => {
        if (!open) return;
        const picked = list[+button.dataset.i];
        if (picked !== target) {
          wiggle(button);
          boop();
          return void say(ask);
        }
        open = false;
        button.classList.add("right");
        cheer();
        await loadLearning();
        await say(
          inEachLanguage((lang) =>
            GAME_CONTENT[lang].line.shapeName(target.colour.id, target.shape),
          ),
        );
        await wait(300);
        if (r !== round) return;
        await addStar(r);
        if (r === round) next();
      };
    });
    say(ask);
  }
  next();
}

// Sorting: animals on one side, food on the other.
function startSort() {
  const r = enterGame(3, false, false);
  function next() {
    const items = shuffle(VOCAB).slice(0, 8);
    let left = items.length;
    panel(`<div class="sorter">
        <div class="basket" id="side-animal" data-kind="animal"><b>🐾</b></div>
        <div class="tray" id="tray"></div>
        <div class="basket" id="side-food" data-kind="food"><b>🍽️</b></div>
      </div>`);
    const baskets = [$("side-animal"), $("side-food")];
    const place = (el, word, basket) => {
      if (basket.dataset.kind !== word.kind) {
        boop();
        wiggle(el);
        return void say(word[T.code]);
      }
      ding();
      el.remove();
      basket.insertAdjacentHTML(
        "beforeend",
        `<span class="sorted">${word.pic}</span>`,
      );
      say([word[T.code], word.kind === "animal" ? T.line.animal : T.line.food]);
      if (--left === 0)
        wait(1600).then(async () => {
          if (r === round && (await wellDone(r))) next();
        });
    };
    for (const word of items) {
      const el = document.createElement("div");
      el.className = "food";
      el.textContent = word.pic;
      $("tray").append(el);
      draggable(el, {
        onTap: () => say(word[T.code]),
        onDrop: (_, x, y) => {
          const basket = baskets.find((b) => isOver(b, x, y));
          if (basket) place(el, word, basket);
        },
      });
    }
    say(T.line.sortStart);
  }
  next();
}

// Same word, different languages: only the ones she is learning.
function startSame() {
  enterGame(0, false, false);
  loadLearning();
  panel(`<div class="said" id="said"></div>
    <div class="words">${VOCAB.map((word, i) => `<button class="word-pic" data-i="${i}" aria-label="${word.en}">${word.pic}</button>`).join("")}</div>`);
  document.querySelectorAll(".word-pic").forEach((button) => {
    button.onclick = async () => {
      const word = VOCAB[+button.dataset.i];
      $("said").innerHTML = learningLanguages()
        .map(
          (lang) =>
            `<span dir="${LANGS[lang].dir}" lang="${lang}">${word[lang]}</span>`,
        )
        .join("");
      await loadLearning();
      say(inEachLanguage((lang) => word[lang]));
    };
  });
  say(T.line.same);
}

// Saved pictures: real files in the app on iPad, browser storage on the web.
const nativeGallery = window.webkit?.messageHandlers?.gallery;
const memoryPictures = [];
function pictureDb() {
  return new Promise((done, fail) => {
    const open = indexedDB.open("star-school", 1);
    open.onupgradeneeded = () =>
      open.result.createObjectStore("pictures", { keyPath: "id" });
    open.onsuccess = () => done(open.result);
    open.onerror = () => fail(open.error);
  });
}
const gallery = {
  keepsPictures: true,
  async save(data) {
    const when = new Date().toISOString();
    if (nativeGallery)
      return nativeGallery.postMessage({ action: "save", when, data });
    const picture = { id: when, when, data };
    try {
      const db = await pictureDb();
      await new Promise((done, fail) => {
        const write = db.transaction("pictures", "readwrite");
        write.objectStore("pictures").put(picture);
        write.oncomplete = done;
        write.onerror = () => fail(write.error);
      });
    } catch {
      gallery.keepsPictures = false;
      memoryPictures.push(picture);
    }
    return picture;
  },
  async list() {
    if (nativeGallery) return nativeGallery.postMessage({ action: "list" });
    try {
      const db = await pictureDb();
      const saved = await new Promise((done, fail) => {
        const read = db
          .transaction("pictures")
          .objectStore("pictures")
          .getAll();
        read.onsuccess = () => done(read.result);
        read.onerror = () => fail(read.error);
      });
      return [...saved, ...memoryPictures].sort((a, b) =>
        a.when < b.when ? 1 : -1,
      );
    } catch {
      gallery.keepsPictures = false;
      return [...memoryPictures].reverse();
    }
  },
  async remove(id) {
    if (nativeGallery)
      return nativeGallery.postMessage({ action: "delete", id });
    const i = memoryPictures.findIndex((p) => p.id === id);
    if (i >= 0) return void memoryPictures.splice(i, 1);
    const db = await pictureDb();
    db.transaction("pictures", "readwrite").objectStore("pictures").delete(id);
  },
};
const longDate = (when) =>
  new Intl.DateTimeFormat(T.locale, {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(when));

// Free drawing: a page in the current theme, with Pencil pressure, and nothing to get wrong.
function startDraw() {
  const r = enterGame(0, false, false);
  const INKS = [
    "#1f2937",
    "#ef4444",
    "#f97316",
    "#facc15",
    "#22c55e",
    "#3b82f6",
    "#a855f7",
    "#ec4899",
    "#92400e",
    "#ffffff",
  ];
  const SIZES = [8, 18, 36];
  const paper = () => skin.colors.paper || "#fffdf7";
  panel(`<div class="draw">
      <div class="tools">
        ${INKS.map((ink, i) => `<button class="ink ${i === 0 ? "on" : ""}" data-ink="${ink}" style="background:${ink}" aria-label="Colour ${i + 1}"></button>`).join("")}
        <span class="gap"></span>
        ${SIZES.map((size, i) => `<button class="size ${i === 1 ? "on" : ""}" data-size="${size}" aria-label="Brush size ${i + 1}"><i style="width:${size * 0.7 + 4}px;height:${size * 0.7 + 4}px"></i></button>`).join("")}
        <span class="gap"></span>
        <button class="tool" id="undo" aria-label="Undo">↩️</button>
        <button class="tool" id="new-page" aria-label="${T.ui.clear}">📄</button>
        <button class="tool" id="save" aria-label="${T.ui.save}">💾</button>
        <button class="tool" id="open-gallery" aria-label="${T.ui.gallery}">🖼️</button>
      </div>
      <canvas id="page" width="1200" height="900"></canvas>
    </div>`);
  const page = $("page"),
    ctx = page.getContext("2d");
  ctx.lineCap = ctx.lineJoin = "round";
  let ink = INKS[0],
    size = SIZES[1],
    drawing = null,
    lastPen = -1e9,
    dirty = false;
  const undoStack = [];
  const blank = () => {
    ctx.fillStyle = paper();
    ctx.fillRect(0, 0, page.width, page.height);
    dirty = false;
    undoStack.length = 0;
  };
  blank();
  const toPage = (e) => {
    const box = page.getBoundingClientRect();
    return {
      x: ((e.clientX - box.left) / box.width) * page.width,
      y: ((e.clientY - box.top) / box.height) * page.height,
    };
  };
  const widthFor = (e) =>
    e.pointerType === "pen" && e.pressure > 0
      ? size * (0.35 + e.pressure * 1.4)
      : size;
  function segment(from, to, width) {
    ctx.strokeStyle = ink;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  }
  page.addEventListener("pointerdown", (e) => {
    if (e.pointerType === "pen") lastPen = e.timeStamp;
    if (drawing || (e.pointerType === "touch" && e.timeStamp - lastPen < 2000))
      return; // her palm while using Pencil
    e.preventDefault();
    page.setPointerCapture(e.pointerId);
    if (undoStack.length >= 6) undoStack.shift();
    undoStack.push(ctx.getImageData(0, 0, page.width, page.height));
    const at = toPage(e);
    drawing = { id: e.pointerId, at };
    segment(at, { x: at.x + 0.1, y: at.y }, widthFor(e));
    dirty = true;
  });
  page.addEventListener("pointermove", (e) => {
    if (e.pointerType === "pen") lastPen = e.timeStamp;
    if (!drawing || e.pointerId !== drawing.id) return;
    const events = e.getCoalescedEvents?.() || [];
    for (const point of events.length ? events : [e]) {
      const at = toPage(point);
      segment(drawing.at, at, widthFor(point));
      drawing.at = at;
    }
  });
  const stop = (e) => {
    if (drawing && e.pointerId === drawing.id) drawing = null;
  };
  page.addEventListener("pointerup", stop);
  page.addEventListener("pointercancel", stop);
  document.querySelectorAll(".ink").forEach((button) => {
    button.onclick = () => {
      ink = button.dataset.ink;
      document
        .querySelectorAll(".ink")
        .forEach((b) => b.classList.toggle("on", b === button));
    };
  });
  document.querySelectorAll(".size").forEach((button) => {
    button.onclick = () => {
      size = +button.dataset.size;
      document
        .querySelectorAll(".size")
        .forEach((b) => b.classList.toggle("on", b === button));
    };
  });
  const keep = async () => {
    if (!dirty) return false;
    dirty = false;
    await gallery.save(page.toDataURL("image/png"));
    return true;
  };
  leaveHook = keep; // leaving the game keeps her picture too
  $("undo").onclick = () => {
    const last = undoStack.pop();
    if (last) ctx.putImageData(last, 0, 0);
    dirty = undoStack.length > 0;
  };
  $("new-page").onclick = async () => {
    await keep();
    blank();
  };
  $("save").onclick = async () => {
    const button = $("save");
    if (await keep()) {
      cheer();
      say(T.line.saved);
      button.classList.add("right");
      setTimeout(() => button.classList.remove("right"), 900);
    } else boop();
  };
  $("open-gallery").onclick = async () => {
    await keep();
    leaveHook = null;
    if (r === round) showGallery();
  };
  say(T.line.draw);
}
async function showGallery() {
  const r = enterGame(0, false, false);
  const pictures = await gallery.list();
  if (r !== round) return;
  const note = gallery.keepsPictures
    ? ""
    : `<p class="warn">This browser won't keep these pictures after it closes. Use the app or a normal browser window.</p>`;
  panel(
    `${note}<div class="pictures">${pictures.length ? pictures.map((p, i) => `<button class="picture" data-i="${i}"><img src="${p.data}" alt="${longDate(p.when)}"><span>${longDate(p.when)}</span></button>`).join("") : `<button class="picture empty" id="draw-now"><b>🖍️</b><span>${T.ui.draw}</span></button>`}</div>`,
  );
  const fresh = $("draw-now");
  if (fresh) fresh.onclick = startDraw;
  document.querySelectorAll(".picture[data-i]").forEach((button) => {
    button.onclick = () => showPicture(pictures[+button.dataset.i]);
  });
}
function showPicture(picture) {
  panel(`<div class="big-picture"><img src="${picture.data}" alt=""><div class="caption">
      <span>${longDate(picture.when)}</span>
      <button class="tool" id="to-gallery" aria-label="${T.ui.gallery}">🖼️</button>
      <button class="tool" id="delete-picture" aria-label="Delete">🗑️</button>
    </div></div>`);
  $("to-gallery").onclick = showGallery;
  $("delete-picture").onclick = () => {
    // two taps, so a stray finger can't lose a picture
    const button = $("delete-picture");
    if (button.textContent !== "✅") {
      button.textContent = "✅";
      setTimeout(() => button.isConnected && (button.textContent = "🗑️"), 3000);
      return;
    }
    gallery.remove(picture.id).then(showGallery);
  };
}

// The piano: free play, songs to follow with a glowing key, and her own recorded tune.
const PIANO = [
  "C4",
  "C#4",
  "D4",
  "D#4",
  "E4",
  "F4",
  "F#4",
  "G4",
  "G#4",
  "A4",
  "A#4",
  "B4",
  "C5",
];
const SONGS = [
  {
    pic: "⭐",
    notes:
      "C4 C4 G4 G4 A4 A4 G4 F4 F4 E4 E4 D4 D4 C4 G4 G4 F4 F4 E4 E4 D4 G4 G4 F4 F4 E4 E4 D4 C4 C4 G4 G4 A4 A4 G4 F4 F4 E4 E4 D4 D4 C4",
  },
  {
    pic: "🐑",
    notes:
      "E4 D4 C4 D4 E4 E4 E4 D4 D4 D4 E4 G4 G4 E4 D4 C4 D4 E4 E4 E4 E4 D4 D4 E4 D4 C4",
  },
  {
    pic: "🔔",
    notes:
      "C4 D4 E4 C4 C4 D4 E4 C4 E4 F4 G4 E4 F4 G4 G4 A4 G4 F4 E4 C4 G4 A4 G4 F4 E4 C4 C4 G4 C4 C4 G4 C4",
  },
  {
    pic: "🎵",
    notes:
      "E4 E4 F4 G4 G4 F4 E4 D4 C4 C4 D4 E4 E4 D4 D4 E4 E4 F4 G4 G4 F4 E4 D4 C4 C4 D4 E4 D4 C4 C4",
  },
  {
    pic: "🎂",
    notes:
      "C4 C4 D4 C4 F4 E4 C4 C4 D4 C4 G4 F4 C4 C4 C5 A4 F4 E4 D4 A#4 A#4 A4 F4 G4 F4",
  },
];
function startPiano() {
  const r = enterGame(3, false, false);
  const WHITE = PIANO.filter((n) => !n.includes("#"));
  const nameOf = (note) => T.notes["CDEFGAB".indexOf(note[0])];
  panel(`<div class="piano-bar">
      <button class="chip on" id="mode-free" aria-label="${T.ui.free}">🎹</button>
      ${SONGS.map((song, i) => `<button class="chip" data-song="${i}" aria-label="Song ${i + 1}">${song.pic}</button>`).join("")}
      <span class="gap"></span>
      <button class="chip" id="record" aria-label="${T.ui.record}">⏺️</button>
      <button class="chip" id="replay" aria-label="${T.ui.play}">▶️</button>
    </div>
    <div class="piano" id="piano" dir="ltr">${WHITE.map((note) => {
      const sharp = note[0] + "#" + note[1];
      const hasSharp = PIANO.includes(sharp);
      return `<div class="white" data-note="${note}"><span>${note === "C5" ? nameOf(note) : nameOf(note)}</span>${hasSharp ? `<div class="black" data-note="${sharp}"></div>` : ""}</div>`;
    }).join("")}</div>`);
  const keys = Object.fromEntries(
    [...document.querySelectorAll("[data-note]")].map((k) => [
      k.dataset.note,
      k,
    ]),
  );
  let song = null,
    step = 0,
    take = null,
    takeStart = 0;
  const glow = (note) => {
    Object.values(keys).forEach((k) => k.classList.remove("next"));
    if (note) keys[note].classList.add("next");
  };
  const players = Object.fromEntries(
    PIANO.map((note) => {
      const player = new Audio("data:audio/mpeg;base64," + window.PIANO_NOTES[note]);
      player.preload = "auto";
      return [note, player];
    }),
  );
  let nameTimer = 0;
  const sound = (note) => {
    const player = players[note];
    player.currentTime = 0;
    player.play().catch(() => {});
    const key = keys[note];
    key.classList.add("down");
    setTimeout(() => key.classList.remove("down"), 220);
  };
  function press(note) {
    sound(note);
    clearTimeout(nameTimer);
    stopSay();
    if (!note.includes("#"))
      nameTimer = setTimeout(() => r === round && say(nameOf(note)), 260);
    if (take) take.push([note, performance.now() - takeStart]);
    if (!song) return;
    if (note !== song[step]) return;
    step++;
    if (step < song.length) return glow(song[step]);
    glow(null);
    song = null;
    wait(500).then(async () => {
      if (r !== round) return;
      await wellDone(r, T.line.tune);
      setMode("free");
    });
  }
  function setMode(which, i) {
    song = null;
    glow(null);
    document
      .querySelectorAll(".piano-bar .chip")
      .forEach((b) => b.classList.remove("on"));
    if (which === "song") {
      song = SONGS[i].notes.split(" ");
      step = 0;
      document.querySelector(`[data-song="${i}"]`).classList.add("on");
      glow(song[0]);
      say(T.line.follow);
    } else $("mode-free")?.classList.add("on");
  }
  $("mode-free").onclick = () => setMode("free");
  document.querySelectorAll("[data-song]").forEach((b) => {
    b.onclick = () => setMode("song", +b.dataset.song);
  });
  $("record").onclick = () => {
    const button = $("record");
    if (take) {
      if (take.length) {
        store.set("tune", take);
        cheer();
        say(T.line.tune);
      }
      take = null;
      button.classList.remove("on");
      return;
    }
    setMode("free");
    take = [];
    takeStart = performance.now();
    button.classList.add("on");
  };
  $("replay").onclick = () => {
    const tune = store.get("tune", []);
    if (!tune.length) return boop();
    setMode("free");
    const button = $("replay");
    button.classList.add("on");
    tune.forEach(([note, at]) =>
      setTimeout(() => {
        if (r === round && keys[note]?.isConnected) sound(note);
      }, at),
    );
    setTimeout(
      () => button.isConnected && button.classList.remove("on"),
      tune.at(-1)[1] + 400,
    );
  };
  Object.entries(keys).forEach(([note, key]) => {
    key.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      e.stopPropagation();
      press(note);
    });
  });
  rawKeyHandler = (key) => {
    const upper = key.toUpperCase();
    if ("CDEFGAB".includes(upper)) press(upper + "4");
  };
  say(T.line.piano);
}

// The ABC / abc switch on the letter games.
function caseToggle(restart) {
  const button = document.createElement("button");
  button.className = "chip case-toggle";
  button.textContent = lowerCase() ? "abc" : "ABC";
  button.setAttribute("aria-label", "Capital or small letters");
  button.onclick = () => {
    store.set("lower", !lowerCase());
    buildKeys();
    restart();
  };
  $("top-tools").prepend(button);
}

// Instructions: spoken the first time she opens a game in each language, and on the ❓ button.
let pendingHow = null;
function launch(part, start) {
  const seenKey = `seen.${part}.${T.code}`;
  pendingHow = store.get(seenKey, false) ? null : T.line.how[part];
  store.set(seenKey, true);
  start();
  const help = document.createElement("button");
  help.className = "round help";
  help.textContent = "❓";
  help.setAttribute("aria-label", "How to play");
  help.onclick = () => say(T.line.how[part]);
  document.querySelector("#game .help")?.remove();
  $("game").append(help);
}
function showHowTo() {
  const parts = ["letters", "trace", "words", "count", ...EXTRA_GAMES.map((g) => g.part)];
  $("how-to").innerHTML = parts
    .map((part) => `<div class="how" dir="${T.dir}"><b>${T.ui[part]}</b><span>${T.line.how[part]}</span></div>`)
    .join("");
}

// A grown-up check before Settings, as Apple asks of children's apps: a sum she can't do yet.
function grownUpCheck(onPass) {
  const a = between(4, 9),
    b = between(4, 9),
    answer = String(a * b);
  let typed = "";
  const gate = document.createElement("div");
  gate.id = "gate";
  gate.innerHTML = `<div class="gate-card" role="dialog" aria-modal="true" aria-labelledby="gate-question">
      <p>For grown-ups</p>
      <h2 id="gate-question">What is ${a} × ${b}?</h2>
      <div class="gate-typed" id="gate-typed">&nbsp;</div>
      <div class="gate-keys">${[1, 2, 3, 4, 5, 6, 7, 8, 9, "✕", 0, "⌫"].map((k) => `<button data-k="${k}">${k}</button>`).join("")}</div>
    </div>`;
  document.body.append(gate);
  const show = () => ($("gate-typed").textContent = typed || " ");
  gate.querySelectorAll("[data-k]").forEach((button) => {
    button.onclick = () => {
      const k = button.dataset.k;
      if (k === "✕") return gate.remove();
      if (k === "⌫") typed = typed.slice(0, -1);
      else if (typed.length < 2) typed += k;
      show();
      if (typed.length < answer.length) return;
      if (typed === answer) {
        gate.remove();
        onPass();
      } else {
        typed = "";
        show();
        wiggle($("gate-question"));
      }
    };
  });
  gate.onclick = (e) => e.target === gate && gate.remove();
}

// Starts with: she hears a word, sees its picture, and taps the letter it begins with.
function startSounds() {
  const r = enterGame(5, false, false);
  const pool = startLetters(T.code, T);
  let last = null;
  function next() {
    let target = pickFrom(pool);
    while (target === last && pool.length > 1) target = pickFrom(pool);
    last = target;
    const [word, pic] = T.letters[target];
    const others = shuffle(pool.filter((L) => L !== target && !soundAlike(T.code, L, target)));
    const choices = shuffle([target, ...others.slice(0, 2)]);
    const ask = T.line.startAsk(word);
    panel(`<button class="sound-pic" id="again" aria-label="${word}">${pic}</button>
      <div class="answers" dir="${T.dir}">${choices.map((L) => `<button class="answer letter-choice" data-letter="${L}">${shown(L)}</button>`).join("")}</div>`);
    $("again").onclick = () => say(ask);
    let open = true;
    document.querySelectorAll(".letter-choice").forEach((button) => {
      button.onclick = async () => {
        if (!open) return;
        if (button.dataset.letter !== target) {
          wiggle(button);
          boop();
          return void say(ask);
        }
        open = false;
        button.classList.add("right");
        cheer();
        await say([T.line.startSay(word), { pause: 150 }, target]);
        await wait(300);
        if (r !== round) return;
        await addStar(r);
        if (r === round) next();
      };
    });
    say(ask);
  }
  next();
}
