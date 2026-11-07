// The themes. Each one is only data: colours, stickers, what floats, and a scene drawn on a
// 1200x800 stage. index.html has one engine that applies any of them, and the settings screen
// reuses the same scene for its previews. To add a theme, add an entry here.
const seeded = (seed) => () =>
  (seed = (seed * 16807) % 2147483647) / 2147483647;
const repeat = (count, draw) =>
  Array.from({ length: count }, (_, i) => draw(i)).join("");
const emoji = (x, y, size, glyph, cls = "") =>
  `<text x="${x}" y="${y}" font-size="${size}" text-anchor="middle" class="${cls}">${glyph}</text>`;
const petals = (cx, cy, distance, count, rx, ry, fill, opacity = 1) =>
  repeat(count, (i) => {
    const angle = (360 / count) * i;
    return `<ellipse cx="${cx}" cy="${cy - distance}" rx="${rx}" ry="${ry}" fill="${fill}" opacity="${opacity}" transform="rotate(${angle} ${cx} ${cy})"/>`;
  });

const THEMES = {
  mermaid: {
    label: "Mermaids",
    mascot: "🧜‍♀️",
    colors: {
      bg: "linear-gradient(180deg, #17b5bd 0%, #0b7c9e 36%, #0a4470 72%, #062a50 100%)",
      glow: "#ffe27a",
      halo: "rgba(255, 226, 122, 0.45)",
      ink: "#ff7fa8",
      mint: "#7ff0d2",
      moon: "#f2fffb",
      dim: "#b6e8ec",
      ghost: "rgba(255, 255, 255, 0.24)",
      key: "rgba(4, 34, 66, 0.86)",
      "key-edge": "rgba(130, 232, 232, 0.6)",
      card: "rgba(4, 44, 78, 0.58)",
      paper: "#e8f9f8",
    },
    stickers: [
      "🧜‍♀️",
      "🐚",
      "🐠",
      "🐙",
      "🐬",
      "🦀",
      "🐳",
      "🪸",
      "🐡",
      "🦑",
      "🐢",
      "🦭",
    ],
    bits: ["🫧", "🐚", "⭐", "🐠"],
    floater: { kind: "bubble", count: 24 },
    scene() {
      const rays = repeat(5, (i) => {
        const x = 120 + i * 240;
        return `<polygon points="${x},0 ${x + 130},0 ${x - 40},720 ${x - 230},720" fill="#ffffff" opacity="0.06"/>`;
      });
      const weed = (x, height, color, delay) =>
        `<path class="sway" style="animation-delay:${delay}s;transform-origin:${x}px 800px" d="M${x} 800 C${x - 34} ${800 - height * 0.3} ${x + 34} ${800 - height * 0.6} ${x} ${800 - height}" fill="none" stroke="${color}" stroke-width="16" stroke-linecap="round"/>`;
      const weeds = [
        [50, 250, "#13a57c"],
        [100, 170, "#0d8a6d"],
        [165, 215, "#18b98b"],
        [1040, 240, "#13a57c"],
        [1095, 180, "#0d8a6d"],
        [1160, 260, "#18b98b"],
        [430, 110, "#0d8a6d"],
        [780, 130, "#13a57c"],
      ]
        .map(([x, h, c], i) => weed(x, h, c, -i * 0.7))
        .join("");
      const coral = (x, y, s, color) =>
        `<g transform="translate(${x} ${y}) scale(${s})" stroke="${color}" stroke-width="13" stroke-linecap="round" fill="none"><path d="M0 0 V-92"/><path d="M0 -36 L-36 -78"/><path d="M0 -50 L34 -92"/><path d="M-18 -56 L-42 -56"/><path d="M18 -70 L42 -66"/></g>`;
      return `${rays}
        <path d="M0 700 C220 655 420 725 620 695 S1000 640 1200 695 V800 H0Z" fill="#05365a"/>
        ${weeds}
        ${coral(280, 742, 1.15, "#ff7d9c")}${coral(900, 736, 1.25, "#ffb36b")}${coral(610, 770, 0.8, "#c79bff")}
        <path d="M0 752 C260 722 480 776 700 752 S1040 726 1200 756 V800 H0Z" fill="#e9cf9b" opacity="0.75"/>
        ${emoji(340, 780, 44, "🐚")}${emoji(760, 786, 40, "🐚")}${emoji(1010, 782, 36, "⭐")}
        ${emoji(235, 300, 56, "🐠", "swim")}${emoji(960, 380, 62, "🐡", "swim slow")}${emoji(1095, 722, 118, "🧜‍♀️", "bob")}${emoji(135, 610, 74, "🐙", "bob slow")}`;
    },
  },

  unicorn: {
    label: "Unicorns",
    mascot: "🦄",
    colors: {
      bg: "linear-gradient(180deg, #33106f 0%, #7428b8 40%, #c44cb2 76%, #ff93c9 100%)",
      glow: "#fff0a3",
      halo: "rgba(255, 240, 163, 0.5)",
      ink: "#ff4fa3",
      mint: "#b8fff0",
      moon: "#fff7ff",
      dim: "#f3cdf9",
      ghost: "rgba(255, 255, 255, 0.26)",
      key: "rgba(46, 12, 94, 0.86)",
      "key-edge": "rgba(255, 190, 240, 0.65)",
      card: "rgba(58, 16, 112, 0.55)",
      paper: "#fdf0fb",
    },
    stickers: [
      "🦄",
      "🌈",
      "🧁",
      "🌸",
      "🍭",
      "🦋",
      "💖",
      "🎀",
      "🌷",
      "👑",
      "🍰",
      "🪄",
    ],
    bits: ["✨", "💖", "🌸", "🦄"],
    floater: { kind: "sparkle", count: 26 },
    scene() {
      const rainbow = [
        "#ff5d8f",
        "#ff9f45",
        "#ffe066",
        "#7be495",
        "#62c6ff",
        "#b18cff",
      ]
        .map(
          (color, i) =>
            `<circle cx="600" cy="800" r="${640 - i * 38}" fill="none" stroke="${color}" stroke-width="38" opacity="0.55"/>`,
        )
        .join("");
      const cloud = (x, y, s) =>
        `<g transform="translate(${x} ${y}) scale(${s})" fill="#fff" opacity="0.92"><circle r="52"/><circle cx="62" cy="-20" r="62"/><circle cx="132" cy="2" r="50"/><circle cx="-52" cy="10" r="38"/><rect x="-82" y="6" width="256" height="46" rx="23"/></g>`;
      return `${rainbow}${cloud(70, 700, 1)}${cloud(990, 700, 1.05)}${cloud(250, 150, 0.6)}${cloud(860, 110, 0.5)}
        <path d="M0 720 C240 650 430 750 640 710 S1020 650 1200 720 V800 H0Z" fill="#a93aa8"/>
        <path d="M0 765 C300 725 520 790 800 758 S1120 745 1200 765 V800 H0Z" fill="#e974c1"/>
        ${emoji(180, 700, 140, "🦄", "bob")}${emoji(1040, 742, 60, "🌷")}${emoji(940, 770, 46, "🌸")}${emoji(350, 780, 44, "🌷")}${emoji(610, 782, 40, "🌸")}${emoji(775, 776, 42, "🍄")}`;
    },
  },

  astronaut: {
    label: "Astronauts",
    mascot: "👩‍🚀",
    colors: {
      bg: "radial-gradient(120% 95% at 50% 0%, #17204f 0%, #0a0d24 52%, #03040c 100%)",
      glow: "#ffd166",
      halo: "rgba(255, 209, 102, 0.45)",
      ink: "#4cc9f0",
      mint: "#80ffdb",
      moon: "#f5f7ff",
      dim: "#a4afd4",
      ghost: "#2c3667",
      key: "rgba(6, 9, 22, 0.9)",
      "key-edge": "#46528c",
      card: "rgba(14, 20, 50, 0.72)",
      paper: "#ecf1fc",
    },
    stickers: [
      "👩‍🚀",
      "🚀",
      "🪐",
      "🌙",
      "🛸",
      "⭐",
      "☄️",
      "🛰️",
      "🌍",
      "🌟",
      "👽",
      "🔭",
    ],
    bits: ["⭐", "🌟", "✨", "🚀"],
    floater: { kind: "twinkle", count: 30 },
    scene() {
      const rand = seeded(7);
      const stars = repeat(
        150,
        () =>
          `<circle cx="${(rand() * 1200) | 0}" cy="${(rand() * 680) | 0}" r="${(0.7 + rand() * 1.9).toFixed(1)}" fill="#fff" opacity="${(0.35 + rand() * 0.6).toFixed(2)}"/>`,
      );
      const crater = (x, y, r, fill) =>
        `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`;
      return `<defs>
          <radialGradient id="ringed" cx="35%" cy="30%"><stop offset="0" stop-color="#ffd8a8"/><stop offset="1" stop-color="#d9764a"/></radialGradient>
          <radialGradient id="blue" cx="35%" cy="30%"><stop offset="0" stop-color="#9fe7ff"/><stop offset="1" stop-color="#2a6fd6"/></radialGradient>
          <radialGradient id="moonface" cx="35%" cy="30%"><stop offset="0" stop-color="#fffbe9"/><stop offset="1" stop-color="#cfc6a6"/></radialGradient>
        </defs>${stars}
        <g><circle cx="1035" cy="150" r="96" fill="url(#moonface)"/>${crater(1000, 120, 16, "#bdb392")}${crater(1062, 178, 22, "#bdb392")}${crater(1072, 108, 10, "#bdb392")}${crater(1008, 190, 9, "#bdb392")}</g>
        <g class="bob slow"><ellipse cx="165" cy="205" rx="118" ry="24" fill="none" stroke="#f7d9a8" stroke-width="10" opacity="0.8" transform="rotate(-14 165 205)"/><circle cx="165" cy="205" r="66" fill="url(#ringed)"/><path d="M58 233 A118 24 -14 0 0 272 177" fill="none" stroke="#f7d9a8" stroke-width="10" opacity="0.95"/></g>
        <circle cx="880" cy="430" r="30" fill="url(#blue)"/><circle cx="315" cy="430" r="16" fill="#c98bff"/>
        <path d="M0 720 C220 680 420 740 640 705 S1040 672 1200 716 V800 H0Z" fill="#3a3f58"/>
        ${crater(170, 760, 34, "#2c3045")}${crater(470, 752, 20, "#2c3045")}${crater(760, 748, 26, "#2c3045")}${crater(1080, 758, 30, "#2c3045")}
        ${emoji(1010, 700, 130, "👩‍🚀", "bob")}${emoji(170, 690, 118, "🚀", "bob slow")}${emoji(660, 240, 52, "🛸", "swim slow")}${emoji(800, 300, 42, "☄️")}`;
    },
  },

  diwali: {
    label: "Diwali",
    mascot: "🪔",
    colors: {
      bg: "radial-gradient(120% 95% at 50% 100%, #9b1f52 0%, #520e3f 45%, #1f0a33 100%)",
      glow: "#ffc533",
      halo: "rgba(255, 197, 51, 0.5)",
      ink: "#ff6a3d",
      mint: "#7de0b0",
      moon: "#fff4e0",
      dim: "#eebf95",
      ghost: "rgba(255, 210, 140, 0.26)",
      key: "rgba(40, 6, 40, 0.88)",
      "key-edge": "rgba(255, 180, 70, 0.65)",
      card: "rgba(62, 10, 52, 0.62)",
      paper: "#fff4e2",
    },
    stickers: [
      "🪔",
      "🎆",
      "🌼",
      "🪷",
      "🍬",
      "🎇",
      "✨",
      "🎁",
      "🥭",
      "🌺",
      "🐘",
      "🦚",
    ],
    bits: ["✨", "🌼", "🪔", "🎇"],
    floater: { kind: "ember", count: 24 },
    scene() {
      const rangoli = (cx, cy, s, opacity) =>
        `<g opacity="${opacity}" transform="translate(${cx} ${cy}) scale(${s}) translate(${-cx} ${-cy})">
          ${petals(cx, cy, 208, 24, 19, 42, "#ff5e8a")}
          ${petals(cx, cy, 158, 16, 26, 52, "#ffc533")}
          ${petals(cx, cy, 112, 12, 25, 44, "#2ec4b6")}
          ${petals(cx, cy, 72, 8, 24, 36, "#ff7a1a")}
          <circle cx="${cx}" cy="${cy}" r="46" fill="#fff4e0"/>
          ${petals(cx, cy, 24, 8, 10, 20, "#d6336c")}
          <circle cx="${cx}" cy="${cy}" r="11" fill="#ffc533"/>
          ${repeat(32, (i) => {
            const a = (i / 32) * 2 * Math.PI;
            return `<circle cx="${(cx + Math.cos(a) * 268).toFixed(1)}" cy="${(cy + Math.sin(a) * 268).toFixed(1)}" r="8" fill="#fff4e0"/>`;
          })}
        </g>`;
      const diya = (x, y, s, delay) =>
        `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cy="-46" rx="17" ry="32" fill="#ffc533" opacity="0.25"/><path class="flicker" style="animation-delay:${delay}s" d="M0 -18 C-13 -35 -3 -52 0 -66 C4 -52 13 -35 0 -18Z" fill="#ffb01f"/><path class="flicker" style="animation-delay:${delay}s" d="M0 -20 C-6 -30 -1 -40 0 -46 C2 -40 6 -30 0 -20Z" fill="#fff1b8"/><path d="M-50 -16 H50 C42 22 -42 22 -50 -16Z" fill="#c9602b"/><path d="M-50 -16 H50 C44 -6 -44 -6 -50 -16Z" fill="#7a3216"/></g>`;
      const swag = (x1, x2, sag) =>
        repeat(13, (i) => {
          const t = i / 12,
            x = x1 + (x2 - x1) * t,
            y = 4 * sag * t * (1 - t);
          return `<circle cx="${x}" cy="${y}" r="15" fill="${i % 2 ? "#ffa51f" : "#ff7a1a"}"/>`;
        });
      return `${rangoli(600, 640, 1.15, 0.42)}${rangoli(90, 120, 0.42, 0.5)}${rangoli(1110, 120, 0.42, 0.5)}
        ${swag(0, 400, 80)}${swag(400, 800, 80)}${swag(800, 1200, 80)}
        ${repeat(7, (i) => diya(90 + i * 170, 770, 1, -i * 0.31))}`;
    },
  },

  dinosaurs: {
    label: "Dinosaurs",
    mascot: "🦕",
    colors: {
      bg: "linear-gradient(180deg, #171338 0%, #351a58 38%, #7f2b52 66%, #cf5f2e 100%)",
      glow: "#ffd447",
      halo: "rgba(255, 212, 71, 0.45)",
      ink: "#ff7b3d",
      mint: "#9df0b8",
      moon: "#fff6ea",
      dim: "#e6c6c0",
      ghost: "rgba(255, 225, 190, 0.26)",
      key: "rgba(30, 14, 50, 0.88)",
      "key-edge": "rgba(255, 170, 90, 0.62)",
      card: "rgba(36, 16, 58, 0.62)",
      paper: "#f5f7e6",
    },
    stickers: ["🦕", "🦖", "🥚", "🌋", "🦴", "🌿", "🪨", "🦎", "🌴", "🪺", "🐊", "🍃"],
    bits: ["🦴", "🌿", "🥚", "🦕"],
    floater: { kind: "ember", count: 20 },
    scene() {
      const rand = seeded(23);
      const stars = repeat(45, () =>
        `<circle cx="${(rand() * 1200) | 0}" cy="${(rand() * 280) | 0}" r="${(0.8 + rand() * 1.6).toFixed(1)}" fill="#fff" opacity="${(0.3 + rand() * 0.5).toFixed(2)}"/>`);
      const smoke = (x, y, s, delay) =>
        `<g transform="translate(${x} ${y}) scale(${s})"><g class="bob slow" style="animation-delay:${delay}s" fill="#7d6078" opacity="0.8"><circle r="30"/><circle cx="-34" cy="-34" r="38" fill="#6d5270"/><circle cx="16" cy="-74" r="48" fill="#5d4668"/><circle cx="72" cy="-122" r="58" fill="#4f3b60"/></g></g>`;
      const volcano = (x, base, half, peak, mouth, lava) =>
        `<ellipse cx="${x}" cy="${peak + 2}" rx="${mouth * 2.4}" ry="${mouth * 1.2}" fill="url(#lavaglow)"/>
        <path d="M${x - half} ${base} C${x - half * 0.55} ${base - (base - peak) * 0.28} ${x - mouth * 1.5} ${peak + (base - peak) * 0.3} ${x - mouth} ${peak} Q${x} ${peak + 14} ${x + mouth} ${peak} C${x + mouth * 1.5} ${peak + (base - peak) * 0.3} ${x + half * 0.55} ${base - (base - peak) * 0.28} ${x + half} ${base}Z" fill="url(#rock)"/>
        <ellipse class="flicker" cx="${x}" cy="${peak + 3}" rx="${mouth * 0.92}" ry="${mouth * 0.26}" fill="#ffe27a"/>
        ${lava.map(([dx, width, reach]) => {
          const h = (base - peak) * reach;
          return `<path d="M${x + dx - width} ${peak + 5} C${x + dx - width * 2} ${peak + h * 0.35} ${x + dx * 2.2 - width} ${peak + h * 0.6} ${x + dx * 2.6} ${peak + h} C${x + dx * 2.2 + width} ${peak + h * 0.6} ${x + dx + width * 1.6} ${peak + h * 0.3} ${x + dx + width} ${peak + 5}Z" fill="url(#lava)"/>`;
        }).join("")}`;
      const fern = (x, y, s, color, delay) =>
        `<g transform="translate(${x} ${y}) scale(${s})"><g class="sway" style="animation-delay:${delay}s;transform-origin:0px 0px">${[-72, -46, -20, 8, 34, 62]
          .map((angle) => {
            const bend = angle * 0.9;
            const leaflets = repeat(10, (i) => {
              const t = 0.16 + i * 0.09,
                px = (bend * t * t).toFixed(1),
                py = (-170 * t).toFixed(1),
                size = (1.15 - t) * 30;
              return `M${px} ${py}l${(-size).toFixed(1)} ${(-size * 0.5).toFixed(1)}M${px} ${py}l${size.toFixed(1)} ${(-size * 0.5).toFixed(1)}`;
            });
            return `<path transform="rotate(${angle})" d="M0 0Q0 -90 ${bend} -170${leaflets}" fill="none" stroke="${color}" stroke-width="6" stroke-linecap="round"/>`;
          })
          .join("")}</g></g>`;
      const palm = (x, base, height, delay) => {
        const top = base - height;
        const leaf = (dx, dy) =>
          `<path d="M0 0C${dx * 0.4} ${dy - 50} ${dx * 0.8} ${dy - 40} ${dx} ${dy}C${dx * 0.7} ${dy * 0.5} ${dx * 0.35} ${dy * 0.4} 0 0Z"/>`;
        return `<path d="M${x - 14} ${base}C${x - 8} ${base - height * 0.5} ${x + 2} ${top + 40} ${x + 2} ${top}H${x + 16}C${x + 18} ${top + 50} ${x + 18} ${base - height * 0.5} ${x + 22} ${base}Z" fill="#3a2231"/>
          <g transform="translate(${x + 9} ${top})"><g class="sway" style="animation-delay:${delay}s;transform-origin:0px 0px" fill="#1b6a4d">${leaf(-150, 50)}${leaf(150, 50)}${leaf(-110, -30)}${leaf(110, -30)}${leaf(-170, 110)}${leaf(170, 110)}${leaf(-20, -90)}</g></g>`;
      };
      const longneck = (x, y, s) =>
        `<g transform="translate(${x} ${y}) scale(${s})">
          <g fill="#3f9c7c"><rect x="-60" y="-70" width="34" height="70" rx="15"/><rect x="58" y="-70" width="34" height="70" rx="15"/></g>
          <path d="M-210 -28C-150 -50 -110 -118 -30 -136C40 -150 90 -132 118 -100C134 -66 118 -44 92 -40L-60 -40C-110 -36 -160 -24 -210 -28Z" fill="#5fbf9a"/>
          <g fill="#5fbf9a"><rect x="-98" y="-72" width="38" height="72" rx="16"/><rect x="22" y="-72" width="38" height="72" rx="16"/></g>
          <g fill="#3f9c7c"><ellipse cx="-40" cy="-108" rx="24" ry="14"/><ellipse cx="22" cy="-112" rx="17" ry="11"/><ellipse cx="-92" cy="-84" rx="15" ry="9"/></g>
          <g class="sway" style="transform-origin:96px -96px"><path d="M72 -116C106 -150 122 -230 146 -292C156 -328 214 -336 238 -306C248 -290 236 -274 208 -272C190 -270 180 -254 174 -220C164 -170 150 -110 118 -74Z" fill="#6fcda8"/><circle cx="196" cy="-306" r="8" fill="#fff"/><circle cx="198" cy="-305" r="4.5" fill="#1a2b28"/><path d="M212 -285q12 2 20 -6" fill="none" stroke="#2c6b58" stroke-width="4" stroke-linecap="round"/></g>
        </g>`;
      const plated = (x, y, s) =>
        `<g transform="translate(${x} ${y}) scale(${s})">
          <g fill="#c8602a">${[[-72, -86], [-34, -112], [8, -118], [50, -102], [88, -76]].map(([px, py]) => `<path d="M${px - 22} ${py + 26}L${px} ${py - 22}L${px + 22} ${py + 26}Z"/>`).join("")}</g>
          <path d="M138 -44L152 -78L164 -38ZM168 -36L188 -68L192 -30Z" fill="#fff0d0"/>
          <path d="M-112 -44C-86 -112 40 -118 92 -64C124 -54 170 -42 198 -28C150 -22 104 -20 76 -18L-90 -18Z" fill="#f2a94e"/>
          <g fill="#d98a35"><rect x="-84" y="-40" width="30" height="40" rx="12"/><rect x="42" y="-40" width="30" height="40" rx="12"/></g>
          <g fill="#f2a94e"><rect x="-48" y="-40" width="30" height="40" rx="12"/><rect x="76" y="-34" width="28" height="34" rx="12"/></g>
          <ellipse cx="-128" cy="-46" rx="36" ry="24" fill="#f2a94e"/><circle cx="-138" cy="-54" r="6" fill="#fff"/><circle cx="-140" cy="-53" r="3.4" fill="#2a1a10"/><path d="M-158 -38q12 8 24 2" fill="none" stroke="#9a5a20" stroke-width="3.5" stroke-linecap="round"/>
        </g>`;
      const egg = (x, y, s, fill, speck, tilt) =>
        `<g transform="translate(${x} ${y}) rotate(${tilt}) scale(${s})"><path d="M0 -46C22 -46 34 -12 34 8C34 28 18 40 0 40C-18 40 -34 28 -34 8C-34 -12 -22 -46 0 -46Z" fill="${fill}"/><path d="M-16 -18C-22 -8 -24 2 -23 10" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity="0.65"/><g fill="${speck}"><circle cx="10" cy="-14" r="5"/><circle cx="16" cy="12" r="6"/><circle cx="-6" cy="22" r="4.5"/><circle cx="-8" cy="-2" r="3.5"/></g></g>`;
      const flier = (x, y, s) =>
        `<g transform="translate(${x} ${y}) scale(${s})" fill="#241238"><path d="M0 0C-30 -30 -80 -36 -120 -14C-84 -14 -44 -2 -14 16C-6 18 8 18 14 16C44 -2 84 -14 120 -14C80 -36 30 -30 0 0Z"/><path d="M-6 6L-30 -10L-44 -6L-12 16Z"/></g>`;
      return `<defs>
          <radialGradient id="lavaglow"><stop offset="0" stop-color="#ffb347" stop-opacity="0.9"/><stop offset="1" stop-color="#ff6a2b" stop-opacity="0"/></radialGradient>
          <linearGradient id="lava" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe27a"/><stop offset="0.55" stop-color="#ff8a2b"/><stop offset="1" stop-color="#e8391f"/></linearGradient>
          <linearGradient id="rock" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a2547"/><stop offset="1" stop-color="#23122f"/></linearGradient>
        </defs>${stars}
        <g class="swim slow">${flier(250, 120, 0.62)}${flier(620, 70, 0.4)}</g>
        <path d="M0 610C140 560 280 600 420 570S720 540 860 580S1100 560 1200 600V800H0Z" fill="#54234e" opacity="0.9"/>
        ${smoke(1040, 180, 0.95, 0)}${smoke(590, 500, 0.6, -3)}${smoke(150, 440, 0.55, -5)}
        ${volcano(1020, 720, 420, 190, 56, [[-14, 9, 0.62], [18, 8, 0.44]])}
        ${volcano(150, 720, 250, 450, 34, [[6, 6, 0.5]])}
        ${volcano(590, 730, 300, 505, 44, [[-10, 8, 0.72], [16, 6, 0.46]])}
        ${palm(70, 730, 330, -1)}${palm(1120, 730, 280, -3)}
        <path d="M0 690C200 650 380 700 620 672S1000 650 1200 690V800H0Z" fill="#1f5a48"/>
        ${fern(250, 700, 0.62, "#2f8a63", -1)}${fern(960, 690, 0.7, "#2f8a63", -2)}${fern(720, 690, 0.45, "#2f8a63", -4)}
        <path d="M0 738C260 706 480 760 720 730S1060 712 1200 742V800H0Z" fill="#17463a"/>
        ${longneck(400, 772, 0.66)}${plated(850, 772, 0.62)}
        <ellipse cx="610" cy="786" rx="98" ry="22" fill="#6a4426"/>
        ${egg(566, 748, 0.72, "#fdf3d4", "#7fbf7a", -14)}${egg(654, 748, 0.72, "#d9f3e6", "#e8805a", 14)}${egg(610, 742, 0.86, "#ffe3b0", "#d9694a", 0)}
        <path d="M512 780C560 760 660 760 708 780C710 798 516 800 512 780Z" fill="#8a5a30"/><path d="M522 786l60 -12M570 794l70 -18M640 792l50 -14M536 776l44 16" stroke="#5d3a1c" stroke-width="5" stroke-linecap="round"/>
        ${fern(20, 800, 1, "#0f3a2e", 0)}${fern(1180, 800, 1.05, "#0f3a2e", -2)}${fern(320, 806, 0.62, "#12473a", -3)}${fern(1010, 806, 0.62, "#12473a", -1)}
        ${emoji(470, 788, 34, "🦴")}${emoji(760, 790, 30, "🪨")}`;
    },
  },

  holi: {
    label: "Holi",
    mascot: "🎨",
    colors: {
      bg: "linear-gradient(180deg, #1d0f52 0%, #43148c 42%, #8e1c90 76%, #d32a80 100%)",
      glow: "#ffe14d",
      halo: "rgba(255, 225, 77, 0.5)",
      ink: "#ff4fae",
      mint: "#7dffc4",
      moon: "#fff8fd",
      dim: "#e9cdf6",
      ghost: "rgba(255, 255, 255, 0.26)",
      key: "rgba(32, 10, 74, 0.86)",
      "key-edge": "rgba(255, 150, 215, 0.65)",
      card: "rgba(38, 12, 86, 0.62)",
      paper: "#fdf0f8",
    },
    stickers: ["🎨", "🌈", "💦", "🎈", "🌼", "🌸", "🥁", "🍬", "🫧", "🌺", "🥟", "🥛"],
    bits: ["💦", "🌸", "🎈", "🌼"],
    floater: { kind: "powder", count: 30 },
    scene() {
      const hues = { pink: "#ff3ea5", gold: "#ffd21f", leaf: "#2fe07a", sky: "#27c4ff", flame: "#ff7a1a", plum: "#b45cff" };
      const grads = Object.entries(hues)
        .map(([id, c]) => `<radialGradient id="${id}"><stop offset="0" stop-color="${c}"/><stop offset="0.5" stop-color="${c}" stop-opacity="0.75"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>`)
        .join("");
      const rand = seeded(41);
      // A burst of powder: soft overlapping puffs, then fine specks thrown outwards.
      const burst = (x, y, size, hue, other, delay) =>
        `<g class="bob slow" style="animation-delay:${delay}s">${repeat(9, (i) => {
          const a = rand() * 6.28,
            d = rand() * size * 0.75,
            r = size * (0.35 + rand() * 0.4);
          return `<circle cx="${(x + Math.cos(a) * d).toFixed(0)}" cy="${(y + Math.sin(a) * d * 0.8).toFixed(0)}" r="${r.toFixed(0)}" fill="url(#${i % 3 == 2 ? other : hue})"/>`;
        })}${repeat(26, (i) => {
          const a = rand() * 6.28,
            d = size * (0.7 + rand() * 0.75);
          return `<circle cx="${(x + Math.cos(a) * d).toFixed(0)}" cy="${(y + Math.sin(a) * d * 0.8).toFixed(0)}" r="${(1.5 + rand() * 4).toFixed(1)}" fill="${hues[i % 3 == 2 ? other : hue]}"/>`;
        })}</g>`;
      const balloon = (x, y, s, fill, shade, delay) =>
        `<g transform="translate(${x} ${y}) scale(${s})"><g class="bob" style="animation-delay:${delay}s"><path d="M0 -60C34 -60 52 -30 44 2C38 24 16 40 0 44C-16 40 -38 24 -44 2C-52 -30 -34 -60 0 -60Z" fill="${fill}"/><path d="M0 44C16 40 38 24 44 2C46 -8 46 -18 44 -26C38 10 18 30 -8 42Z" fill="${shade}"/><path d="M-8 44L8 44L4 54L-4 54Z" fill="${shade}"/><path d="M-24 -32C-30 -22 -32 -10 -30 0" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity="0.7"/></g></g>`;
      const thali = (x, y, s, hue, light) =>
        `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cy="8" rx="92" ry="22" fill="#a86c17"/><ellipse rx="92" ry="22" fill="#e9b53c"/><ellipse rx="74" ry="15" fill="#c98f22"/><path d="M-62 2C-46 -12 -30 -56 0 -60C30 -56 46 -12 62 2C30 14 -30 14 -62 2Z" fill="${hue}"/><path d="M-22 -38C-14 -52 -6 -56 2 -56C-4 -40 -10 -22 -28 -6C-32 -16 -28 -28 -22 -38Z" fill="${light}" opacity="0.8"/></g>`;
      const pichkari = (x, y, s, rotate) =>
        `<g transform="translate(${x} ${y}) rotate(${rotate}) scale(${s})">
          <rect x="-112" y="-7" width="62" height="14" rx="5" fill="#d9e2e8"/><rect x="-128" y="-24" width="16" height="48" rx="7" fill="#ff7a1a"/>
          <rect x="-54" y="-27" width="120" height="54" rx="12" fill="#ffc533"/><rect x="-54" y="-27" width="120" height="17" rx="10" fill="#ffe28a"/><rect x="-22" y="-27" width="14" height="54" fill="#ff3ea5"/><rect x="24" y="-27" width="14" height="54" fill="#27c4ff"/>
          <path d="M66 -18L118 -5V5L66 18Z" fill="#e0a21c"/><rect x="116" y="-7" width="22" height="14" rx="4" fill="#ff7a1a"/>
        </g>`;
      const spray = (x0, y0, cx, cy, x1, y1, color, count) =>
        repeat(count, (i) => {
          const t = i / (count - 1),
            u = 1 - t,
            x = u * u * x0 + 2 * u * t * cx + t * t * x1,
            y = u * u * y0 + 2 * u * t * cy + t * t * y1;
          return `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(9 - t * 3 + (i % 2) * 3).toFixed(1)}" fill="${color}" opacity="${(0.95 - t * 0.35).toFixed(2)}"/>`;
        });
      const splat = (x, y, s, color) =>
        `<g transform="translate(${x} ${y}) scale(${s} ${s * 0.42})" fill="${color}">${petals(0, 0, 36, 9, 16, 34, color)}<circle r="46"/></g>`;
      return `<defs>${grads}</defs>
        ${burst(120, 90, 170, "pink", "gold", 0)}${burst(1085, 95, 175, "sky", "leaf", -3)}${burst(600, 14, 70, "plum", "sky", -5)}
        ${burst(95, 610, 200, "leaf", "gold", -2)}${burst(1105, 600, 205, "flame", "pink", -4)}${burst(360, 655, 150, "gold", "flame", -1)}${burst(850, 650, 155, "pink", "plum", -6)}${burst(600, 610, 120, "sky", "plum", -3)}
        <path d="M0 738C240 716 460 750 700 730S1040 716 1200 738V800H0Z" fill="#3b1160"/>
        ${splat(90, 770, 1.1, "#ff3ea5")}${splat(300, 780, 0.8, "#ffd21f")}${splat(900, 776, 0.9, "#27c4ff")}${splat(1110, 768, 1.05, "#2fe07a")}${splat(470, 790, 0.5, "#27c4ff")}${splat(740, 792, 0.55, "#ff7a1a")}
        ${spray(492, 636, 620, 500, 770, 610, "#fff27a", 14)}
        ${pichkari(410, 678, 0.8, -28)}
        ${pichkari(1010, 690, 0.72, 208)}${spray(930, 650, 860, 540, 790, 640, "#7dfff0", 9)}
        ${thali(490, 760, 0.8, "#ff3ea5", "#ffb3da")}${thali(610, 772, 0.92, "#ffd21f", "#fff0a0")}${thali(735, 760, 0.8, "#2fe07a", "#b6ffd6")}
        ${balloon(840, 716, 0.66, "#ff5f8f", "#d63a6b", 0)}${balloon(372, 748, 0.56, "#ffb02e", "#e8861a", -2)}${balloon(180, 712, 0.72, "#27c4ff", "#1593d0", -1)}${balloon(1090, 712, 0.7, "#b45cff", "#8c38dc", -3)}${balloon(790, 762, 0.48, "#2fe07a", "#17b35c", -4)}
        ${emoji(250, 785, 40, "🌼")}${emoji(960, 785, 36, "🌸")}`;
    },
  },

  farm: {
    label: "Farm",
    mascot: "🐄",
    colors: {
      bg: "linear-gradient(180deg, #16244f 0%, #33397f 34%, #9a4f83 58%, #f08b5e 74%, #ffc27a 100%)",
      glow: "#ffdc5e",
      halo: "rgba(255, 220, 94, 0.48)",
      ink: "#ff6f59",
      mint: "#b5f2a0",
      moon: "#fffaf0",
      dim: "#e6d4e4",
      ghost: "rgba(255, 240, 215, 0.28)",
      key: "rgba(24, 28, 68, 0.88)",
      "key-edge": "rgba(255, 196, 130, 0.65)",
      card: "rgba(28, 30, 78, 0.6)",
      paper: "#fdf8e6",
    },
    stickers: ["🐄", "🐖", "🐑", "🐓", "🐴", "🐥", "🚜", "🌽", "🥕", "🐐", "🦆", "🌾"],
    bits: ["🌾", "🐥", "🌽", "⭐"],
    floater: { kind: "sparkle", count: 14 },
    scene() {
      const rand = seeded(11);
      const stars = repeat(30, () =>
        `<circle cx="${(rand() * 1200) | 0}" cy="${(rand() * 230) | 0}" r="${(0.8 + rand() * 1.4).toFixed(1)}" fill="#fff" opacity="${(0.3 + rand() * 0.5).toFixed(2)}"/>`);
      const puff = (x, y, s) =>
        `<g transform="translate(${x} ${y}) scale(${s})"><g class="swim slow" fill="#f7a9a0" opacity="0.72"><circle r="34"/><circle cx="46" cy="-14" r="44"/><circle cx="98" cy="2" r="32"/><rect x="-34" y="4" width="166" height="30" rx="15"/></g></g>`;
      const rows = (points, color) =>
        `<path d="${points.map(([a, b, c, d]) => `M${a} ${b}L${c} ${d}`).join("")}" stroke="${color}" stroke-width="5" stroke-linecap="round"/>`;
      const barn = (x, y, s) =>
        `<g transform="translate(${x} ${y}) scale(${s})">
          <g><rect x="150" y="-250" width="84" height="250" fill="#d9d2c6"/><rect x="150" y="-250" width="22" height="250" fill="#f1ebdf"/><rect x="212" y="-250" width="22" height="250" fill="#b5ad9f"/><path d="M150 -250C150 -300 234 -300 234 -250Z" fill="#7b8aa0"/><path d="M150 -190H234M150 -130H234M150 -70H234" stroke="#a79f90" stroke-width="4"/></g>
          <path d="M-160 0V-150L-112 -232L0 -286L112 -232L160 -150V0Z" fill="#c6302a"/>
          <path d="M-160 -150L-112 -232L0 -286L0 -270L-100 -222L-146 -142V0H-160Z" fill="#dd4238"/>
          <g stroke="#a42420" stroke-width="3">${repeat(11, (i) => `<path d="M${-125 + i * 25} -${i == 5 ? 270 : i == 4 || i == 6 ? 255 : i == 3 || i == 7 ? 240 : 150} V0"/>`)}</g>
          <path d="M-172 -146L-120 -240L0 -298L120 -240L172 -146" fill="none" stroke="#4a2c2c" stroke-width="16" stroke-linejoin="round" stroke-linecap="round"/>
          <g fill="none" stroke="#fff6e6" stroke-width="10"><rect x="-68" y="-116" width="136" height="116"/><path d="M-68 -116L68 0M68 -116L-68 0M0 -116V0"/><rect x="-36" y="-212" width="72" height="66"/><path d="M-36 -212L36 -146M36 -212L-36 -146"/></g>
          <rect x="-36" y="-212" width="72" height="66" fill="#ffd27a" opacity="0.55"/>
          <circle cx="0" cy="-246" r="13" fill="#2a1a2a" stroke="#fff6e6" stroke-width="6"/>
          <path d="M-14 -296H14" stroke="#4a2c2c" stroke-width="5"/>
        </g>`;
      const cow = (x, y, s) =>
        `<g transform="translate(${x} ${y}) scale(${s})">
          <path d="M84 -92C110 -88 112 -50 106 -34" fill="none" stroke="#efe6d8" stroke-width="7" stroke-linecap="round"/><circle cx="106" cy="-30" r="8" fill="#2c2420"/>
          <g fill="#ded4c4"><rect x="-56" y="-50" width="22" height="50" rx="9"/><rect x="48" y="-50" width="22" height="50" rx="9"/></g>
          <path d="M18 -36q18 18 32 0z" fill="#ffb3c0"/>
          <rect x="-86" y="-116" width="176" height="84" rx="38" fill="#fff8ec"/>
          <path d="M-30 -116C-40 -92 -24 -66 6 -74C30 -80 28 -104 16 -116Z" fill="#2f2826"/><ellipse cx="62" cy="-82" rx="20" ry="22" fill="#2f2826"/>
          <g fill="#fff8ec"><rect x="-76" y="-52" width="22" height="52" rx="9"/><rect x="28" y="-52" width="22" height="52" rx="9"/></g>
          <g fill="#2f2826"><rect x="-76" y="-12" width="22" height="12" rx="4"/><rect x="28" y="-12" width="22" height="12" rx="4"/><rect x="-56" y="-12" width="22" height="12" rx="4"/><rect x="48" y="-12" width="22" height="12" rx="4"/></g>
          <path d="M-96 -164l-8 -22 16 8zM-146 -164l8 -22 -16 8z" fill="#e8d6a8"/>
          <ellipse cx="-160" cy="-146" rx="20" ry="10" fill="#2f2826" transform="rotate(-20 -160 -146)"/><ellipse cx="-80" cy="-146" rx="20" ry="10" fill="#2f2826" transform="rotate(20 -80 -146)"/>
          <rect x="-152" y="-168" width="66" height="84" rx="30" fill="#fff8ec"/><ellipse cx="-119" cy="-96" rx="35" ry="24" fill="#ffc2cc"/><circle cx="-130" cy="-98" r="4.5" fill="#b86d7b"/><circle cx="-108" cy="-98" r="4.5" fill="#b86d7b"/>
          <circle cx="-134" cy="-134" r="7" fill="#2a2020"/><circle cx="-104" cy="-134" r="7" fill="#2a2020"/><circle cx="-132" cy="-136" r="2.4" fill="#fff"/><circle cx="-102" cy="-136" r="2.4" fill="#fff"/>
        </g>`;
      const sheep = (x, y, s) =>
        `<g transform="translate(${x} ${y}) scale(${s})">
          <g fill="#3a3038"><rect x="-44" y="-40" width="14" height="40" rx="6"/><rect x="28" y="-40" width="14" height="40" rx="6"/><rect x="-22" y="-40" width="14" height="40" rx="6"/><rect x="8" y="-40" width="14" height="40" rx="6"/></g>
          <g fill="#fffdf6">${[[-46, -70, 28], [-16, -92, 32], [22, -88, 32], [50, -66, 26], [-20, -52, 28], [20, -52, 28]].map(([cx, cy, r]) => `<circle cx="${cx}" cy="${cy}" r="${r}"/>`).join("")}</g>
          <ellipse cx="-92" cy="-92" rx="17" ry="8" fill="#3a3038"/><ellipse cx="-56" cy="-94" rx="15" ry="8" fill="#3a3038"/><ellipse cx="-74" cy="-78" rx="23" ry="28" fill="#3a3038"/><circle cx="-74" cy="-108" r="17" fill="#fffdf6"/>
          <circle cx="-84" cy="-84" r="6" fill="#fff"/><circle cx="-64" cy="-84" r="6" fill="#fff"/><circle cx="-85" cy="-84" r="3" fill="#111"/><circle cx="-65" cy="-84" r="3" fill="#111"/>
        </g>`;
      const hen = (x, y, s, body = "#fff4e2", wing = "#e8cfa8") =>
        `<g transform="translate(${x} ${y}) scale(${s})">
          <path d="M-8 -6V4M12 -6V4M-14 4H0M6 4H20" stroke="#f2951f" stroke-width="5" stroke-linecap="round"/>
          <path d="M40 -60C64 -84 76 -64 62 -44C78 -48 80 -28 56 -26Z" fill="#c6442f"/>
          <path d="M-30 -74C-42 -50 -40 -10 2 -6C40 -2 62 -34 50 -54C30 -46 2 -44 -6 -66Z" fill="${body}"/>
          <path d="M-6 -44C14 -50 34 -42 32 -28C22 -14 2 -14 -6 -44Z" fill="${wing}"/>
          <circle cx="-22" cy="-78" r="20" fill="${body}"/><path d="M-36 -94q4 -12 10 -4q4 -12 10 -2q8 -6 8 8l-24 4z" fill="#e0352b"/>
          <path d="M-40 -82L-58 -76L-40 -70Z" fill="#f2951f"/><path d="M-38 -68q-4 12 4 12q6 -4 2 -12z" fill="#e0352b"/><circle cx="-28" cy="-82" r="4" fill="#1b1410"/>
        </g>`;
      const pig = (x, y, s) =>
        `<g transform="translate(${x} ${y}) scale(${s})">
          <path d="M66 -60c18 -14 24 8 10 8c-10 0 -6 -14 6 -12" fill="none" stroke="#f08fa8" stroke-width="5" stroke-linecap="round"/>
          <g fill="#ee8aa4"><rect x="-46" y="-34" width="20" height="34" rx="8"/><rect x="36" y="-34" width="20" height="34" rx="8"/></g>
          <ellipse cx="4" cy="-58" rx="70" ry="42" fill="#ffa8bd"/>
          <g fill="#ffa8bd"><rect x="-58" y="-34" width="20" height="34" rx="8"/><rect x="22" y="-34" width="20" height="34" rx="8"/></g>
          <path d="M-90 -104L-64 -92L-84 -76Z M-46 -100L-62 -92L-38 -76Z" fill="#ee8aa4"/><circle cx="-66" cy="-70" r="32" fill="#ffb5c7"/><ellipse cx="-80" cy="-60" rx="17" ry="13" fill="#f58da7"/><circle cx="-86" cy="-60" r="3.4" fill="#a24d66"/><circle cx="-74" cy="-60" r="3.4" fill="#a24d66"/><circle cx="-80" cy="-80" r="4.5" fill="#241a1a"/><circle cx="-54" cy="-80" r="4.5" fill="#241a1a"/>
        </g>`;
      const fence = (from, to, y, color = "#fff1dc") =>
        `<g fill="${color}"><rect x="${from}" y="${y}" width="${to - from}" height="10" rx="3"/><rect x="${from}" y="${y + 26}" width="${to - from}" height="10" rx="3"/>${repeat(Math.round((to - from) / 70) + 1, (i) => `<path d="M${from + i * 70 - 8} ${y + 54}V${y - 14}l8 -10 8 10V${y + 54}Z"/>`)}</g>`;
      const sunflower = (x, y, s, delay) =>
        `<g transform="translate(${x} ${y}) scale(${s})"><g class="sway" style="animation-delay:${delay}s;transform-origin:0px 86px"><path d="M0 86V0" stroke="#3f7a35" stroke-width="7"/><path d="M0 52C16 34 34 38 38 46C24 58 12 58 0 52ZM0 66C-16 50 -34 52 -38 60C-24 72 -12 72 0 66Z" fill="#4e9a40"/>${petals(0, 0, 25, 14, 8, 15, "#ffcc29")}<circle r="17" fill="#6d3f1a"/></g></g>`;
      const hay = (x, y, s) =>
        `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="-34" rx="58" ry="36" fill="#e6b84c"/><ellipse cx="42" cy="-34" rx="20" ry="35" fill="#f4d578"/><path d="M42 -56c-10 6 -14 18 -10 30M50 -46c-6 6 -8 14 -4 22M-46 -48c26 -6 52 -6 74 -2M-52 -28c30 -4 56 -4 78 0" fill="none" stroke="#b58a2e" stroke-width="3"/></g>`;
      const tree = (x, y, s) =>
        `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-14 0C-8 -40 -10 -70 -8 -100H10C10 -70 8 -40 16 0Z" fill="#4c2f26"/><g fill="#2c6d4f"><circle cx="-46" cy="-120" r="50"/><circle cx="46" cy="-122" r="52"/><circle cy="-170" r="58"/></g><g fill="#3b8a5c"><circle cx="-16" cy="-160" r="34"/><circle cx="-54" cy="-128" r="26"/><circle cx="26" cy="-136" r="28"/></g></g>`;
      return `${stars}
        <defs><radialGradient id="sunhalo"><stop offset="0.2" stop-color="#ffdf94" stop-opacity="0.8"/><stop offset="1" stop-color="#ffb066" stop-opacity="0"/></radialGradient></defs><circle cx="210" cy="540" r="260" fill="url(#sunhalo)"/><circle cx="210" cy="540" r="62" fill="#ffefb8"/>
        ${puff(60, 130, 0.9)}${puff(960, 110, 1.05)}
        <path d="M0 590C170 545 330 590 520 562S860 520 1010 560S1140 570 1200 552V800H0Z" fill="#6c5a97"/>
        <path d="M0 630C240 590 420 640 660 604S1040 590 1200 620V800H0Z" fill="#4c7d5c"/>
        <path d="M0 628C100 612 200 610 300 618L250 712H0Z" fill="#e7bd52"/>${rows([[40, 632, 0, 660], [100, 626, 40, 700], [160, 622, 110, 706], [220, 620, 180, 708], [280, 620, 236, 708]], "#c49a35")}
        <path d="M300 618C380 622 450 628 500 622L500 712H250Z" fill="#7cb54f"/>${rows([[340, 622, 306, 708], [390, 626, 366, 708], [440, 628, 424, 708], [486, 626, 480, 708]], "#5e9c3c")}
        <path d="M880 596C980 588 1100 600 1200 618V712H930Z" fill="#a0683f"/>${rows([[950, 594, 990, 708], [1020, 594, 1062, 710], [1090, 600, 1130, 710], [1160, 610, 1194, 710]], "#7d4c2c")}
        ${tree(925, 712, 0.82)}${tree(80, 700, 0.6)}
        ${barn(650, 706, 0.82)}
        ${hay(820, 730, 0.62)}${hay(480, 728, 0.56)}
        ${fence(-10, 480, 688)}${fence(810, 1210, 688)}
        <path d="M0 734C240 712 500 748 760 724S1080 716 1200 736V800H0Z" fill="#4a9a44"/>
        <path d="M0 776C280 752 560 790 820 770S1100 762 1200 776V800H0Z" fill="#3a8238"/>
        ${sunflower(290, 668, 0.95, -1)}${sunflower(1000, 662, 1, -3)}${sunflower(240, 700, 0.72, -2)}${sunflower(1060, 700, 0.74, -4)}
        ${sheep(150, 772, 0.72)}${cow(490, 780, 0.82)}${sheep(830, 778, 0.74)}${pig(1090, 782, 0.72)}
        ${hen(630, 790, 0.72)}${hen(700, 786, 0.42, "#ffd84d", "#f2b82b")}${hen(740, 794, 0.36, "#ffd84d", "#f2b82b")}
        ${emoji(590, 690, 32, "🦋", "bob slow")}${emoji(250, 790, 30, "🌼")}${emoji(960, 792, 28, "🌼")}`;
    },
  },

  eid: {
    label: "Eid",
    mascot: "🌙",
    colors: {
      bg: "linear-gradient(180deg, #0a1140 0%, #1b1b62 36%, #4d2a72 60%, #a4546f 76%, #e8985a 92%, #f3b56b 100%)",
      glow: "#ffd76a",
      halo: "rgba(255, 215, 106, 0.5)",
      ink: "#39c9a3",
      mint: "#8cf0d0",
      moon: "#fff8e8",
      dim: "#d8cfe8",
      ghost: "rgba(255, 228, 170, 0.25)",
      key: "rgba(10, 14, 60, 0.88)",
      "key-edge": "rgba(255, 205, 110, 0.62)",
      card: "rgba(14, 18, 72, 0.62)",
      paper: "#f3f1fb",
    },
    stickers: ["🌙", "⭐", "🕌", "🌟", "✨", "🍬", "🎁", "🍪", "🫖", "🌴", "🌹", "🍯"],
    bits: ["✨", "🌙", "⭐", "🎁"],
    floater: { kind: "twinkle", count: 26 },
    scene() {
      const rand = seeded(19);
      const stars = repeat(120, () =>
        `<circle cx="${(rand() * 1200) | 0}" cy="${(rand() * 520) | 0}" r="${(0.7 + rand() * 1.7).toFixed(1)}" fill="#fff4d6" opacity="${(0.35 + rand() * 0.6).toFixed(2)}"/>`);
      const star = (x, y, r, fill = "#ffd76a") =>
        `<polygon fill="${fill}" points="${repeat(10, (i) => {
          const a = (i * Math.PI) / 5 - Math.PI / 2,
            d = i % 2 ? r * 0.42 : r;
          return `${(x + Math.cos(a) * d).toFixed(1)},${(y + Math.sin(a) * d).toFixed(1)} `;
        })}"/>`;
      const crescent = (x, y, r, tilt, fill) =>
        `<path transform="translate(${x} ${y}) rotate(${tilt})" d="M0 ${-r}A${r} ${r} 0 1 0 0 ${r}A${r * 1.25} ${r * 1.25} 0 0 1 0 ${-r}Z" fill="${fill}"/>`;
      const lantern = (x, drop, s, tint, delay) =>
        `<g transform="translate(${x} 0)"><g class="sway" style="animation-delay:${delay}s;transform-origin:0px 0px">
          <path d="M0 0V${drop}" stroke="#d8a93f" stroke-width="3"/>
          <g transform="translate(0 ${drop}) scale(${s})">
            <circle cy="66" r="82" fill="url(#lampglow)"/>
            <circle cy="-2" r="7" fill="none" stroke="#e8bb4d" stroke-width="4"/>
            <path d="M0 5C16 16 30 22 36 30H-36C-30 22 -16 16 0 5Z" fill="#e8bb4d"/><path d="M0 5C-16 16 -30 22 -36 30H-14C-10 22 -6 14 0 5Z" fill="#ffd978"/>
            <path d="M-36 30L-46 62L-30 112H30L46 62L36 30Z" fill="${tint}"/>
            <path class="flicker" style="animation-delay:${delay}s" d="M0 92C-15 78 -8 58 0 44C8 58 15 78 0 92Z" fill="#fff0b0"/>
            <path d="M-36 30L-46 62L-30 112M36 30L46 62L30 112M-46 62H46M-14 30L-16 62L-11 112M14 30L16 62L11 112" fill="none" stroke="#e8bb4d" stroke-width="4" stroke-linejoin="round"/>
            <path d="M-36 112H36L24 130H-24Z" fill="#e8bb4d"/><path d="M-24 130H-8L0 112L-36 112Z" fill="#ffd978"/>
            <path d="M0 130V154" stroke="#e8bb4d" stroke-width="4"/><path d="M-6 150H6L4 174H-4Z" fill="#c8334f"/>
          </g></g></g>`;
      const dome = (x, y, r, fill) =>
        `<path d="M${x - r} ${y}C${x - r * 1.14} ${y - r * 0.8} ${x - r * 0.5} ${y - r * 1.2} ${x} ${y - r * 1.6}C${x + r * 0.5} ${y - r * 1.2} ${x + r * 1.14} ${y - r * 0.8} ${x + r} ${y}Z" fill="${fill}"/>`;
      const finial = (x, y, s, fill) =>
        `<path d="M${x} ${y}V${y - 20 * s}" stroke="${fill}" stroke-width="${3 * s}"/><circle cx="${x}" cy="${y - 8 * s}" r="${3.5 * s}" fill="${fill}"/>${crescent(x, y - 30 * s, 9 * s, -90, fill)}`;
      const arch = (x, y, w, h, fill) =>
        `<path d="M${x - w / 2} ${y}V${y - h * 0.55}C${x - w / 2} ${y - h * 0.8} ${x - w * 0.2} ${y - h * 0.88} ${x} ${y - h}C${x + w * 0.2} ${y - h * 0.88} ${x + w / 2} ${y - h * 0.8} ${x + w / 2} ${y - h * 0.55}V${y}Z" fill="${fill}"/>`;
      const minaret = (x, top, base, dark, gold) =>
        `<rect x="${x - 17}" y="${top + 34}" width="34" height="${base - top - 34}" fill="${dark}"/>
        <rect x="${x - 26}" y="${top + 70}" width="52" height="11" rx="3" fill="${dark}"/><rect x="${x - 23}" y="${top + 150}" width="46" height="9" rx="3" fill="${dark}"/>
        ${dome(x, top + 36, 17, dark)}${finial(x, top + 10, 0.62, gold)}
        ${arch(x, top + 62, 12, 24, "#ffc65a")}${arch(x, top + 132, 12, 28, "#ffc65a")}`;
      const dark = "#1a0f3d",
        gold = "#ffcf66";
      const palm = (x, base, height, s) =>
        `<g fill="#120a2c"><path d="M${x - 6} ${base}C${x - 2} ${base - height * 0.5} ${x + 8} ${base - height * 0.8} ${x + 5} ${base - height}H${x + 12}C${x + 18} ${base - height * 0.8} ${x + 12} ${base - height * 0.5} ${x + 10} ${base}Z"/>
        <g transform="translate(${x + 8} ${base - height}) scale(${s})">${[[-90, 30], [90, 30], [-70, -24], [70, -24], [-96, 70], [96, 70], [0, -50]].map(([dx, dy]) => `<path d="M0 0C${dx * 0.4} ${dy - 36} ${dx * 0.8} ${dy - 26} ${dx} ${dy}C${dx * 0.7} ${dy * 0.5} ${dx * 0.35} ${dy * 0.4} 0 0Z"/>`).join("")}</g></g>`;
      const tile = (x, y, r, fill) =>
        `<g fill="${fill}"><rect x="${x - r * 0.7}" y="${y - r * 0.7}" width="${r * 1.4}" height="${r * 1.4}"/><rect x="${x - r * 0.7}" y="${y - r * 0.7}" width="${r * 1.4}" height="${r * 1.4}" transform="rotate(45 ${x} ${y})"/></g>`;
      return `<defs>
          <radialGradient id="lampglow"><stop offset="0" stop-color="#ffd27a" stop-opacity="0.65"/><stop offset="1" stop-color="#ffb347" stop-opacity="0"/></radialGradient>
          <radialGradient id="moonglow"><stop offset="0.35" stop-color="#fff0b8" stop-opacity="0.45"/><stop offset="1" stop-color="#fff0b8" stop-opacity="0"/></radialGradient>
        </defs>${stars}
        <circle cx="868" cy="82" r="100" fill="url(#moonglow)"/>${crescent(868, 82, 46, 24, "#ffe9a6")}${star(900, 78, 12, "#fff4c8")}
        ${star(440, 58, 13)}${star(150, 262, 10)}${star(1060, 300, 12)}${star(925, 34, 9)}${star(268, 120, 11)}
        ${lantern(70, 100, 0.92, "#c8334f", 0)}${lantern(190, 40, 0.68, "#1f9d82", -2)}${lantern(345, 26, 0.56, "#e0822a", -4)}${lantern(1130, 90, 0.9, "#1f9d82", -1)}${lantern(1000, 130, 0.62, "#c8334f", -3)}
        <path d="M0 800V700H70V640C80 610 110 610 120 640V690H230V660C250 625 290 625 310 660V700H420V800ZM780 800V690H880V650C900 616 950 616 970 650V700H1060V636C1072 606 1100 606 1112 636V690H1200V800Z" fill="#4a2a6c"/>
        ${minaret(330, 500, 800, dark, gold)}${minaret(870, 500, 800, dark, gold)}
        ${dome(440, 660, 62, dark)}${finial(440, 562, 0.8, gold)}${dome(760, 660, 62, dark)}${finial(760, 562, 0.8, gold)}
        <circle cx="600" cy="610" r="150" fill="url(#lampglow)"/>
        ${dome(600, 640, 112, dark)}${finial(600, 462, 1.15, gold)}
        <rect x="462" y="628" width="276" height="22" fill="#27195a"/><path d="M462 628H738" stroke="#ffcf66" stroke-width="3"/>
        <rect x="360" y="650" width="480" height="150" fill="${dark}"/>
        ${arch(600, 800, 84, 128, "#ffc65a")}${arch(600, 800, 62, 104, "#ffe29a")}
        ${arch(490, 770, 48, 88, "#ffc65a")}${arch(710, 770, 48, 88, "#ffc65a")}${arch(410, 770, 40, 78, "#e8a94a")}${arch(790, 770, 40, 78, "#e8a94a")}
        ${palm(130, 790, 170, 0.9)}${palm(1075, 790, 150, 0.85)}
        <path d="M0 776C300 760 900 760 1200 776V800H0Z" fill="#100828"/>
        ${repeat(20, (i) => tile(30 + i * 60, 788, 7, i % 2 ? "#ffcf66" : "#39c9a3"))}`;
    },
  },

  rain: {
    label: "Rain",
    mascot: "☔",
    colors: {
      bg: "linear-gradient(180deg, #17233f 0%, #2c3e63 44%, #4b6c8c 76%, #7ea3b2 100%)",
      glow: "#ffe066",
      halo: "rgba(255, 224, 102, 0.42)",
      ink: "#ff7c8f",
      mint: "#a2f0d8",
      moon: "#f4fbff",
      dim: "#c3d8e6",
      ghost: "rgba(255, 255, 255, 0.24)",
      key: "rgba(16, 28, 54, 0.86)",
      "key-edge": "rgba(170, 215, 240, 0.6)",
      card: "rgba(18, 32, 62, 0.6)",
      paper: "#ebf4f9",
    },
    stickers: ["☔", "🌈", "🌧️", "🐸", "🦆", "💧", "🐌", "🌷", "🍄", "☂️", "🌦️", "🐞"],
    bits: ["💧", "☔", "🌈", "🐸"],
    floater: { kind: "drop", count: 34 },
    scene() {
      const rand = seeded(29);
      const streaks = repeat(110, () => {
        const x = (rand() * 1240) | 0,
          y = (rand() * 760) | 0,
          len = 16 + rand() * 26;
        return `M${x} ${y}l${(-len * 0.16).toFixed(1)} ${len.toFixed(0)}`;
      });
      const rainbow = ["#ff6b6b", "#ffa94d", "#ffe066", "#69db7c", "#4dabf7", "#b197fc"]
        .map((color, i) => `<circle cx="900" cy="800" r="${570 - i * 25}" fill="none" stroke="${color}" stroke-width="25" opacity="0.8"/>`)
        .join("");
      const cloud = (x, y, s, fill, delay) =>
        `<g transform="translate(${x} ${y}) scale(${s})"><g class="swim slow" style="animation-delay:${delay}s" fill="${fill}"><circle r="62"/><circle cx="84" cy="-34" r="82"/><circle cx="182" cy="-6" r="70"/><circle cx="264" cy="18" r="48"/><circle cx="-72" cy="18" r="46"/><rect x="-118" y="10" width="430" height="60" rx="30"/></g></g>`;
      const umbrella = (x, y, s, tilt, main, panel, stick = true) =>
        `<g transform="translate(${x} ${y}) rotate(${tilt}) scale(${s})">
          ${stick ? `<path d="M0 -90V96C0 118 30 118 30 96" fill="none" stroke="#5b3a29" stroke-width="8" stroke-linecap="round"/>` : ""}
          <path d="M0 -100V-118" stroke="#5b3a29" stroke-width="7" stroke-linecap="round"/>
          <path d="M-112 0C-108 -60 -60 -100 0 -100C60 -100 108 -60 112 0Q84 -24 56 0Q28 -24 0 0Q-28 -24 -56 0Q-84 -24 -112 0Z" fill="${main}"/>
          <path d="M-56 0C-52 -50 -30 -88 0 -100C30 -88 52 -50 56 0Q28 -24 0 0Q-28 -24 -56 0Z" fill="${panel}"/>
          <path d="M-20 -86C-40 -78 -66 -56 -76 -24" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity="0.45"/>
        </g>`;
      const puddle = (x, y, rx, ry, delay) =>
        `<ellipse cx="${x}" cy="${y + 4}" rx="${rx + 8}" ry="${ry + 4}" fill="#1f4a50" opacity="0.6"/>
        <ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#9fd0e6"/>
        <ellipse cx="${x}" cy="${y - ry * 0.24}" rx="${rx * 0.8}" ry="${ry * 0.5}" fill="#d4edf7" opacity="0.65"/>
        <ellipse class="ripple" style="animation-delay:${delay}s" cx="${x - rx * 0.3}" cy="${y}" rx="${rx * 0.4}" ry="${ry * 0.45}" fill="none" stroke="#fff" stroke-width="3"/>
        <ellipse class="ripple" style="animation-delay:${delay - 1.7}s" cx="${x + rx * 0.35}" cy="${y + ry * 0.1}" rx="${rx * 0.34}" ry="${ry * 0.38}" fill="none" stroke="#fff" stroke-width="3"/>`;
      const duck = (x, y, s, delay) =>
        `<g transform="translate(${x} ${y}) scale(${s})"><g class="bob" style="animation-delay:${delay}s"><path d="M-46 -30C-44 -6 -22 8 12 8C42 8 54 -10 48 -32C40 -18 18 -14 -4 -22C-20 -28 -36 -36 -46 -30Z" fill="#ffd93b"/><path d="M-26 -24C-4 -32 18 -24 20 -10C4 -2 -20 -4 -26 -24Z" fill="#f2b92b"/><circle cx="34" cy="-48" r="24" fill="#ffd93b"/><path d="M54 -54L78 -46L54 -38Z" fill="#ff8a1f"/><circle cx="40" cy="-54" r="4.5" fill="#1b1410"/></g></g>`;
      const frog = (x, y, s) =>
        `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="-34" cy="-6" rx="24" ry="12" fill="#3f9a4a"/><ellipse cx="34" cy="-6" rx="24" ry="12" fill="#3f9a4a"/><ellipse cy="-30" rx="40" ry="32" fill="#56bd5c"/><ellipse cy="-20" rx="26" ry="18" fill="#c8eeb0"/><circle cx="-20" cy="-60" r="15" fill="#56bd5c"/><circle cx="20" cy="-60" r="15" fill="#56bd5c"/><circle cx="-20" cy="-61" r="9" fill="#fff"/><circle cx="20" cy="-61" r="9" fill="#fff"/><circle cx="-19" cy="-60" r="5" fill="#16201a"/><circle cx="21" cy="-60" r="5" fill="#16201a"/><path d="M-18 -38q18 12 36 0" fill="none" stroke="#2c6e33" stroke-width="4" stroke-linecap="round"/></g>`;
      const boots = (x, y, s) =>
        `<g transform="translate(${x} ${y}) scale(${s})">${[[0, "#ffcf33", "#e5a81c"], [62, "#ffdb5c", "#e5a81c"]].map(([dx, c, d]) => `<g transform="translate(${dx} 0)"><path d="M-22 -96H24V-30C42 -26 58 -18 60 -2H-22Z" fill="${c}"/><rect x="-26" y="-104" width="54" height="14" rx="6" fill="${d}"/><rect x="-24" y="-8" width="86" height="10" rx="4" fill="${d}"/></g>`).join("")}</g>`;
      const tulip = (x, y, s, color, delay) =>
        `<g transform="translate(${x} ${y}) scale(${s})"><g class="sway" style="animation-delay:${delay}s;transform-origin:0px 0px"><path d="M0 0C-3 -30 2 -50 0 -70" fill="none" stroke="#2f7a55" stroke-width="6"/><path d="M0 -4C-24 -20 -30 -40 -26 -52C-10 -44 -2 -26 0 -4Z" fill="#3d9a68"/><path d="M0 -66C-22 -68 -24 -96 -20 -106L-8 -94L0 -110L8 -94L20 -106C24 -96 22 -68 0 -66Z" fill="${color}"/></g></g>`;
      return `<defs><linearGradient id="fade" gradientUnits="userSpaceOnUse" x1="570" y1="0" x2="760" y2="0"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#fff"/></linearGradient><mask id="peek"><rect width="1200" height="800" fill="url(#fade)"/></mask><radialGradient id="breakup"><stop offset="0" stop-color="#ffe9b0" stop-opacity="0.32"/><stop offset="1" stop-color="#ffe9b0" stop-opacity="0"/></radialGradient></defs>
        <circle cx="830" cy="330" r="360" fill="url(#breakup)"/>
        <g mask="url(#peek)">${rainbow}</g>
        ${cloud(-40, 90, 1.05, "#3f4f71", 0)}${cloud(330, 70, 0.92, "#4d5e80", -7)}${cloud(860, 50, 0.72, "#3f4f71", -4)}
        ${cloud(-110, 240, 1.2, "#566888", -2)}${cloud(120, 300, 0.9, "#61749a", -9)}
        ${cloud(430, 320, 0.8, "#6c7fa4", -6)}
        <path d="M0 640C180 590 360 630 560 606S960 570 1200 628V800H0Z" fill="#3a6f70"/>
        <path d="M0 696C240 660 460 708 720 676S1060 664 1200 694V800H0Z" fill="#3f8a6c"/>
        ${tulip(170, 712, 0.86, "#ff7c8f", -1)}${tulip(1020, 706, 0.9, "#ffcf33", -3)}${tulip(1070, 716, 0.76, "#ff7c8f", -2)}${tulip(120, 724, 0.7, "#c79bff", -4)}
        <path d="M0 738C260 712 520 756 800 730S1080 720 1200 742V800H0Z" fill="#2f7a5e"/>
        ${puddle(170, 770, 118, 20, 0)}${puddle(600, 762, 168, 26, -1)}${puddle(1050, 772, 120, 20, -2.4)}${puddle(860, 786, 56, 10, -3.2)}
        ${umbrella(420, 668, 0.88, -12, "#ff5d6c", "#ffd447")}
        ${frog(428, 770, 0.72)}
        ${umbrella(790, 672, 0.86, 13, "#5c9dff", "#ffffff")}
        ${boots(790, 776, 0.7)}
        ${duck(575, 750, 0.82, 0)}${duck(650, 760, 0.5, -2)}
        ${umbrella(1110, 640, 0.6, 8, "#b28dff", "#7fe0c3")}${umbrella(90, 650, 0.6, -8, "#ffb03b", "#ff7c8f")}
        <path d="${streaks}" fill="none" stroke="#d4ecff" stroke-width="2.4" stroke-linecap="round" opacity="0.42"/>
        ${emoji(290, 788, 30, "🐌")}${emoji(960, 760, 34, "🍄")}`;
    },
  },

  jungle: {
    label: "Jungle",
    mascot: "🐒",
    colors: {
      bg: "linear-gradient(180deg, #06281f 0%, #0a4231 40%, #116044 72%, #1b7a4d 100%)",
      glow: "#ffe45c",
      halo: "rgba(255, 228, 92, 0.42)",
      ink: "#ff8a3d",
      mint: "#a4f58f",
      moon: "#f6ffe8",
      dim: "#c2e6c0",
      ghost: "rgba(235, 255, 200, 0.24)",
      key: "rgba(4, 34, 24, 0.88)",
      "key-edge": "rgba(170, 235, 130, 0.58)",
      card: "rgba(4, 42, 28, 0.62)",
      paper: "#edf7e6",
    },
    stickers: ["🐒", "🦜", "🐅", "🐘", "🦥", "🐍", "🦋", "🐸", "🌴", "🍌", "🦧", "🌺"],
    bits: ["🍃", "🍌", "🦜", "🌺"],
    floater: { kind: "sparkle", count: 18 },
    scene() {
      const rand = seeded(37);
      const rays = repeat(4, (i) => {
        const x = 260 + i * 240;
        return `<polygon points="${x},0 ${x + 90},0 ${x - 170},800 ${x - 340},800" fill="#e8ffb0" opacity="0.055"/>`;
      });
      const bush = (y, count, color, big) =>
        repeat(count, (i) =>
          `<circle cx="${((i + rand() * 0.6) * 1240 / count - 20).toFixed(0)}" cy="${(y + rand() * 50).toFixed(0)}" r="${(big * (0.7 + rand() * 0.6)).toFixed(0)}" fill="${color}"/>`);
      const leaf = (x, y, s, turn, fill, vein, delay = 0) =>
        `<g transform="translate(${x} ${y}) rotate(${turn}) scale(${s})"><g class="sway" style="animation-delay:${delay}s;transform-origin:0px 0px"><path d="M0 0C-86 -60 -92 -210 0 -320C92 -210 86 -60 0 0Z" fill="${fill}"/><path d="M0 0C0 -60 92 -210 0 -320Z" fill="#000" opacity="0.08"/><path d="M0 -6V-300M0 -50L-52 -96M0 -50L52 -96M0 -110L-62 -160M0 -110L62 -160M0 -170L-52 -222M0 -170L52 -222M0 -226L-28 -262M0 -226L28 -262" fill="none" stroke="${vein}" stroke-width="5" stroke-linecap="round"/></g></g>`;
      // A split leaf: broad fingers fanned along a stem, like a monstera.
      const split = (x, y, s, turn, fill, vein, delay = 0) =>
        `<g transform="translate(${x} ${y}) rotate(${turn}) scale(${s})"><g class="sway" style="animation-delay:${delay}s;transform-origin:0px 0px"><path d="M0 0V-250" stroke="${vein}" stroke-width="8" stroke-linecap="round"/>${repeat(7, (i) => {
          const py = -46 - i * 34,
            size = 94 - Math.abs(i - 2) * 15;
          return `<path d="M0 ${py}C${-size * 0.4} ${py - 34} ${-size} ${py - 42} ${-size} ${py - 52}C${-size * 0.7} ${py - 58} ${-size * 0.2} ${py - 52} 0 ${py - 26}Z M0 ${py}C${size * 0.4} ${py - 34} ${size} ${py - 42} ${size} ${py - 52}C${size * 0.7} ${py - 58} ${size * 0.2} ${py - 52} 0 ${py - 26}Z" fill="${fill}"/>`;
        })}<ellipse cy="-286" rx="26" ry="40" fill="${fill}"/></g></g>`;
      const vine = (x, len, bend, delay, inner = "") => {
        const leaves = repeat(Math.floor(len / 58), (i) => {
          const y = 34 + i * 58,
            side = i % 2 ? 1 : -1;
          return `<path d="M0 ${y}C${side * 12} ${y - 24} ${side * 34} ${y - 20} ${side * 42} ${y - 8}C${side * 30} ${y + 10} ${side * 12} ${y + 10} 0 ${y}Z" fill="#2f9a56"/>`;
        });
        return `<g transform="translate(${x} 0)"><g class="sway" style="animation-delay:${delay}s;transform-origin:0px 0px"><path d="M0 0C${bend} ${len * 0.4} ${-bend} ${len * 0.7} 0 ${len}" fill="none" stroke="#2b7a41" stroke-width="8" stroke-linecap="round"/>${leaves}${inner}</g></g>`;
      };
      const monkey = (y, s, fur = "#7c4a24", light = "#e7bd86") =>
        `<g transform="translate(0 ${y}) scale(${s})">
          <path d="M24 148C76 172 92 112 58 104C40 102 42 126 56 124" fill="none" stroke="${fur}" stroke-width="11" stroke-linecap="round"/>
          <path d="M0 2C4 26 14 50 24 82" fill="none" stroke="${fur}" stroke-width="17" stroke-linecap="round"/><circle cx="0" cy="0" r="12" fill="${light}"/>
          <path d="M-30 142C-34 162 -44 182 -40 200M14 146C20 166 34 180 38 198" fill="none" stroke="${fur}" stroke-width="17" stroke-linecap="round"/><ellipse cx="-40" cy="204" rx="14" ry="9" fill="${light}"/><ellipse cx="40" cy="202" rx="14" ry="9" fill="${light}"/>
          <path d="M-36 100C-58 110 -72 122 -80 136" fill="none" stroke="${fur}" stroke-width="16" stroke-linecap="round"/><circle cx="-84" cy="142" r="11" fill="${light}"/>
          <path d="M-96 150C-92 174 -64 180 -48 168C-66 168 -82 160 -86 140Z" fill="#ffd93b"/>
          <ellipse cx="-8" cy="118" rx="38" ry="46" fill="${fur}"/><ellipse cx="-8" cy="124" rx="24" ry="32" fill="${light}"/>
          <circle cx="-54" cy="52" r="15" fill="${fur}"/><circle cx="34" cy="52" r="15" fill="${fur}"/><circle cx="-54" cy="52" r="8" fill="${light}"/><circle cx="34" cy="52" r="8" fill="${light}"/>
          <circle cx="-10" cy="50" r="40" fill="${fur}"/>
          <path d="M-10 26C-22 18 -38 26 -36 44C-36 50 -38 54 -36 60C-30 80 10 80 16 60C18 54 16 50 16 44C18 26 2 18 -10 26Z" fill="${light}"/>
          <circle cx="-22" cy="44" r="6.5" fill="#1d1208"/><circle cx="2" cy="44" r="6.5" fill="#1d1208"/><circle cx="-20" cy="42" r="2.2" fill="#fff"/><circle cx="4" cy="42" r="2.2" fill="#fff"/>
          <path d="M-14 56h8" stroke="#7c4a24" stroke-width="3.5" stroke-linecap="round"/><path d="M-24 62C-16 72 -4 72 4 62" fill="none" stroke="#5c3518" stroke-width="4" stroke-linecap="round"/>
        </g>`;
      const parrot = (x, y, s, flip, body, wingTop, wingLow, tail) =>
        `<g transform="translate(${x} ${y}) scale(${flip * s} ${s})">
          <path d="M6 -14C12 40 24 96 44 150C20 110 -6 60 -10 -10Z" fill="${tail}"/><path d="M14 -16C26 34 44 80 66 124C36 96 14 50 2 -10Z" fill="${wingLow}"/>
          <ellipse cx="2" cy="-54" rx="31" ry="54" fill="${body}" transform="rotate(14 2 -54)"/>
          <path d="M10 -92C42 -72 44 -24 26 18C4 -8 -8 -50 10 -92Z" fill="${wingLow}"/><path d="M10 -92C34 -78 40 -54 36 -36C16 -40 2 -62 10 -92Z" fill="${wingTop}"/>
          <circle cx="-14" cy="-112" r="29" fill="${body}"/>
          <ellipse cx="-28" cy="-112" rx="15" ry="15" fill="#fff8ec"/><circle cx="-28" cy="-115" r="5.5" fill="#15110c"/><circle cx="-26" cy="-117" r="1.8" fill="#fff"/>
          <path d="M-38 -128C-66 -128 -68 -96 -54 -88C-54 -98 -48 -104 -34 -106Z" fill="#2c2420"/><path d="M-38 -128C-58 -128 -64 -112 -60 -102C-54 -108 -46 -112 -36 -114Z" fill="#f4e4c0"/>
          <path d="M-14 -4v10M4 -2v10" stroke="#3a2c24" stroke-width="7" stroke-linecap="round"/>
        </g>`;
      const hibiscus = (x, y, s, fill, centre) =>
        `<g transform="translate(${x} ${y}) scale(${s})">${petals(0, 0, 24, 5, 21, 26, fill)}<circle r="12" fill="${centre}"/><path d="M0 0L20 -18" stroke="#ffd93b" stroke-width="4" stroke-linecap="round"/><circle cx="21" cy="-20" r="4" fill="#ffd93b"/></g>`;
      return `${rays}
        ${bush(120, 12, "#0a4a32", 58)}${bush(10, 11, "#0c5438", 70)}
        <path d="M78 800C92 560 84 280 108 0H208C186 280 200 560 226 800Z" fill="#2a1d10"/><path d="M122 800C132 560 124 280 142 0H164C148 280 158 560 176 800Z" fill="#3b2a18"/>
        <path d="M1040 800C1070 560 1058 280 1078 0H1178C1160 280 1170 560 1190 800Z" fill="#2a1d10"/><path d="M1090 800C1110 560 1102 280 1116 0H1140C1124 280 1134 560 1146 800Z" fill="#3b2a18"/>
        ${bush(520, 12, "#0d5a3a", 58)}
        ${leaf(40, 640, 1, 40, "#177a4c", "#0d5a3a", -1)}${split(1180, 650, 1, -44, "#177a4c", "#0d5a3a", -3)}
        <path d="M1090 232C980 250 900 230 790 262" fill="none" stroke="#3b2a18" stroke-width="20" stroke-linecap="round"/>
        <path d="M1180 628C1040 640 880 620 700 654" fill="none" stroke="#4a3620" stroke-width="24" stroke-linecap="round"/>
        <path d="M980 636C960 610 930 606 900 612" fill="none" stroke="#4a3620" stroke-width="12" stroke-linecap="round"/>
        <path d="M150 240C210 236 280 250 320 232" fill="none" stroke="#3b2a18" stroke-width="20" stroke-linecap="round"/>
        ${vine(60, 300, 26, -1)}${vine(250, 210, -20, -3)}${vine(1150, 280, 22, -2)}${vine(950, 170, -18, -4)}${vine(560, 96, 10, -5)}${vine(822, 130, -12, -2, monkey(130, 0.62, "#5e3a1e", "#dcae72"))}
        ${parrot(240, 234, 0.72, 1, "#ef3b3b", "#ffd33d", "#2b77e0", "#2b77e0")}
        ${parrot(985, 236, 0.66, -1, "#2f8be6", "#ffd33d", "#17b88a", "#ef3b3b")}
        ${parrot(778, 640, 0.82, -1, "#ef3b3b", "#ffd33d", "#2b77e0", "#2b77e0")}
        <path d="M0 720C220 690 440 736 700 700S1040 690 1200 722V800H0Z" fill="#0f6a43"/>
        ${vine(385, 548, -22, -1, monkey(548, 0.76))}
        ${leaf(590, 790, 0.62, 14, "#27a062", "#14764a", -2)}${split(668, 790, 0.46, -14, "#1f8f58", "#0f6a43", -4)}${leaf(215, 800, 0.8, -8, "#1f8f58", "#0f6a43", 0)}${split(960, 800, 0.74, 8, "#27a062", "#14764a", -3)}
        ${hibiscus(632, 748, 0.92, "#ff5d8f", "#c21e56")}${hibiscus(812, 764, 0.8, "#ff8a3d", "#c24a10")}${hibiscus(490, 760, 0.7, "#ffd33d", "#e0781a")}
        ${split(40, 810, 1.28, 28, "#0e5a3b", "#0a4430", -2)}${leaf(1170, 820, 1.25, -26, "#0e5a3b", "#0a4430", -5)}${leaf(305, 840, 0.6, -16, "#0e5a3b", "#0a4430", -1)}${split(905, 830, 0.68, -12, "#0e5a3b", "#0a4430", -4)}
        ${emoji(560, 700, 36, "🦋", "bob slow")}${emoji(742, 788, 34, "🐸")}`;
    },
  },
};
const DEFAULT_THEME = "astronaut";

function sceneSvg(theme) {
  return `<svg class="scene-art" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMax slice" aria-hidden="true">${theme.scene()}</svg>`;
}
function floaters(theme) {
  const rand = seeded(theme.label.length * 97 + 11);
  return repeat(theme.floater.count, () => {
    const size = (6 + rand() * 18) | 0;
    return `<i class="float ${theme.floater.kind}" style="left:${(rand() * 100).toFixed(1)}%;top:${(rand() * 90).toFixed(1)}%;width:${size}px;height:${size}px;animation-duration:${(5 + rand() * 9).toFixed(1)}s;animation-delay:${(-rand() * 12).toFixed(1)}s"></i>`;
  });
}
