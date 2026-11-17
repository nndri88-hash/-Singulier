
(() => {
'use strict';
const root = document.documentElement;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
const mqReduce = matchMedia('(prefers-reduced-motion: reduce)');
const mqMobile = matchMedia('(max-width: 820px)');
const mqFine = matchMedia('(hover: hover) and (pointer: fine)');
let reduce = mqReduce.matches, mobile = mqMobile.matches;
const G = window.gsap || null;
if (G && window.ScrollTrigger) G.registerPlugin(window.ScrollTrigger);
const store = {
  get(k){ try { return localStorage.getItem(k); } catch(e){ return null; } },
  set(k, v){ try { localStorage.setItem(k, v); } catch(e){} }
};
let side = root.dataset.side === 'maeline' ? 'maeline' : 'nina';

/* ================= Données : 66 bagues Flash ================= */
function mulberry32(a){ return function(){ a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const fr = (n, d = 1) => n.toLocaleString('fr-FR', { minimumFractionDigits: d, maximumFractionDigits: d });

const STONES = [
  { id:'saphir-bleu', nom:'Saphir bleu', fam:'bleu', d:4.00, mohs:'9', ior:1.77, orig:['Sri Lanka','Madagascar','Myanmar'], hex:['#A9C0FF','#2747A8','#0E1F5C'] },
  { id:'saphir-rose', nom:'Saphir rose', fam:'rose', d:4.00, mohs:'9', ior:1.77, orig:['Madagascar','Sri Lanka'], hex:['#FFD0DE','#E6638E','#9E2453'] },
  { id:'saphir-jaune', nom:'Saphir jaune', fam:'jaune', d:4.00, mohs:'9', ior:1.77, orig:['Sri Lanka','Thaïlande'], hex:['#FFF3B0','#F2C230','#A67A06'] },
  { id:'padparadscha', nom:'Saphir padparadscha', fam:'rose', d:4.00, mohs:'9', ior:1.77, orig:['Sri Lanka'], hex:['#FFDCC8','#F49A7C','#B8553D'] },
  { id:'saphir-vert', nom:'Saphir vert', fam:'vert', d:4.00, mohs:'9', ior:1.77, orig:['Australie','Thaïlande'], hex:['#CFF0D8','#4E9A6A','#1F5236'] },
  { id:'saphir-parti', nom:'Saphir bicolore', fam:'vert', d:4.00, mohs:'9', ior:1.77, orig:['Australie'], hex:['#E4F3C4','#5E9E86','#1C4B57'] },
  { id:'rubis', nom:'Rubis', fam:'rose', d:4.00, mohs:'9', ior:1.77, orig:['Myanmar/Birmanie','Mozambique','Thaïlande'], hex:['#FFB3C0','#C2123B','#6B0520'] },
  { id:'spinelle-rose', nom:'Spinelle rose', fam:'rose', d:3.60, mohs:'8', ior:1.72, orig:['Myanmar/Birmanie','Tanzanie'], hex:['#FFD3E2','#E05A8C','#8F1D4C'] },
  { id:'spinelle-rouge', nom:'Spinelle rouge', fam:'rose', d:3.60, mohs:'8', ior:1.72, orig:['Myanmar/Birmanie','Tanzanie'], hex:['#FFA3AC','#B5122D','#5E0414'] },
  { id:'tourmaline-verte', nom:'Tourmaline verte', fam:'vert', d:3.06, mohs:'7 à 7,5', ior:1.63, orig:['Afghanistan','Mozambique','Pakistan'], hex:['#D2F2C9','#3F8F4F','#1B4D27'] },
  { id:'tourmaline-rose', nom:'Tourmaline rose', fam:'rose', d:3.06, mohs:'7 à 7,5', ior:1.63, orig:['Afghanistan','Mozambique'], hex:['#FFD6E6','#EE7FAE','#A23A6B'] },
  { id:'tanzanite', nom:'Tanzanite', fam:'violet', d:3.35, mohs:'6,5', ior:1.69, orig:['Tanzanie'], hex:['#DCD0FF','#5B4BC4','#2A1D73'] },
  { id:'tsavorite', nom:'Tsavorite', fam:'vert', d:3.61, mohs:'7', ior:1.74, orig:['Tanzanie','Afrique'], hex:['#C9F7C6','#22A447','#0B5A22'] },
  { id:'spessartite', nom:'Grenat spessartite', fam:'jaune', d:4.15, mohs:'7', ior:1.80, orig:['Mozambique','Madagascar'], hex:['#FFD6AC','#F07A1C','#9A3D05'] },
  { id:'aigue-marine', nom:'Aigue-marine', fam:'bleu', d:2.70, mohs:'7,5', ior:1.58, orig:['Pakistan','Madagascar','Mozambique'], hex:['#E6F8FF','#8CCBE6','#3F8AA8'] },
  { id:'peridot', nom:'Péridot', fam:'vert', d:3.34, mohs:'6,5', ior:1.67, orig:['Pakistan'], hex:['#F1FFC2','#A6C93A','#5E7A12'] },
  { id:'zircon', nom:'Zircon bleu', fam:'bleu', d:4.65, mohs:'7,5', ior:1.95, orig:['Sri Lanka','Thaïlande'], hex:['#E0FBFF','#5FC7DA','#1E7F95'] },
  { id:'emeraude', nom:'Émeraude', fam:'vert', d:2.76, mohs:'7,5', ior:1.58, orig:['Afghanistan','Pakistan'], hex:['#C8F5DD','#138A55','#05452A'] },
  { id:'diamant', nom:'Diamant', fam:'diamant', d:3.52, mohs:'10', ior:2.42, orig:['À sourcer'], hex:['#FFFFFF','#E9EEF4','#9AA6B4'] }
];
const FAMILIES = [
  { id:'tout', nom:'Toutes' },
  { id:'rose', nom:'Roses et rouges', sw:'#D9406E' },
  { id:'bleu', nom:'Bleus', sw:'#3A63C9' },
  { id:'vert', nom:'Verts', sw:'#2E8E55' },
  { id:'jaune', nom:'Jaunes et orangés', sw:'#EFA12E' },
  { id:'violet', nom:'Violets', sw:'#5B4BC4' },
  { id:'diamant', nom:'Diamants', sw:'#DDE3EA' }
];
const SHAPES = { rond:{nom:'ronde', r:1}, ovale:{nom:'ovale', r:1.35}, poire:{nom:'poire', r:1.5}, marquise:{nom:'marquise', r:2}, coussin:{nom:'coussin', r:1.12}, emeraude:{nom:'émeraude', r:1.36}, trillion:{nom:'trillion', r:1} };
const SHAPE_KEYS = Object.keys(SHAPES);
const METALS = {
  jaune:{ nom:'Or jaune 18 ct', svg:['#FFF0B8','#E2B85A','#9C7226'], three:0xE6BE6A },
  rose:{ nom:'Or rose 18 ct', svg:['#FFE0D0','#E3A188','#A9644E'], three:0xE9A98F },
  blanc:{ nom:'Or blanc 18 ct', svg:['#FFFFFF','#D5D8DC','#8E949B'], three:0xDCDDE0 },
  argent:{ nom:'Argent 925', svg:['#FAFAFA','#C9CBCE','#7F8388'], three:0xCDCFD2 }
};
const MOTIFS = {
  chaton:{ nom:'Chaton débordant', serti:'Le métal coulé remonte sur le rondiste et le recouvre par vagues irrégulières. Serti clos libre, rabattu au brunissoir.' },
  spirale:{ nom:'Bras en spirale', serti:'Les deux bras s’enroulent autour de la pierre et la pincent en deux points opposés, aidés de deux griffes discrètes.' },
  branches:{ nom:'Branches', serti:'Quatre griffes en forme de rameaux, chacune affinée en pointe puis rabattue sur la couronne.' },
  racines:{ nom:'Racines', serti:'Un panier ajouré de racines fines porte la culasse ; six griffes nouées tiennent le rondiste.' },
  gouttes:{ nom:'Gouttes', serti:'Des gouttes de métal posées sur le bord de la pierre servent de griffes arrondies, douces au toucher.' },
  granules:{ nom:'Granules', serti:'Une couronne de grains relevés à l’échoppe entoure la pierre, en serti grains sur chaton clos.' },
  etoile:{ nom:'Serti étoilé', serti:'Un chaton en étoile à six branches : chaque pointe est rabattue sur la pierre comme une griffe plate.' }
};
const MOTIF_KEYS = Object.keys(MOTIFS);
const NAMES = ['Aube','Braise','Ronce','Lierre','Givre','Sève','Écume','Comète','Murmure','Rosée','Orage','Velours','Ombre','Nuée','Brume','Fougère','Vertige','Pétale','Éclipse','Marée','Grenade','Cerise','Lagune','Zénith','Nocturne','Caresse','Tempête','Halo','Sillage','Ivresse','Délice','Mirage','Bourgeon','Falaise','Étincelle','Rivage','Fièvre','Prunelle','Clairière','Crépuscule','Filament','Sorbet','Volute','Abysse','Pollen','Estuaire','Soupir','Sablier','Lucarne','Mélodie','Torrent','Duvet','Aurore','Solstice','Équinoxe','Cascade','Gourmandise','Liseron','Tisane','Minuit','Frisson','Ondine','Cocon','Dune','Boréale','Promesse'];

const RINGS = (() => {
  const rnd = mulberry32(2026);
  const pick = (a) => a[Math.floor(rnd() * a.length)];
  const out = [];
  for (let i = 0; i < 66; i++){
    const stone = STONES[(i * 7 + Math.floor(rnd() * 3)) % STONES.length];
    const shape = SHAPE_KEYS[(i * 3 + Math.floor(rnd() * 4)) % SHAPE_KEYS.length];
    const motif = MOTIF_KEYS[(i + Math.floor(rnd() * 2) * 3) % MOTIF_KEYS.length];
    let metal = pick(['jaune','jaune','rose','rose','blanc','argent']);
    if (stone.id === 'diamant' && metal === 'argent') metal = 'blanc';
    const isD = stone.id === 'diamant';
    const ct = Math.round((isD ? 0.5 + rnd() * 1.0 : 0.8 + rnd() * 2.4) * 20) / 20;
    const dEq = 6.5 * Math.cbrt(ct * 3.52 / stone.d);          // diamètre d'une ronde équivalente (mm)
    const ratio = SHAPES[shape].r;
    const L = dEq * Math.sqrt(ratio), W = dEq / Math.sqrt(ratio);
    out.push({ i, num: String(i + 1).padStart(2, '0'), nom: NAMES[i], stone, shape, motif, metal, ct, L, W, orig: pick(stone.orig), seed: 1000 + i * 37 });
  }
  return out;
})();

/* Fourchette de prix : (pierre + métal + heures × SMIC + matériel) × (1 + marge). Valeurs estimées, à valider. */
const PRICE = { smic: 12.31, or: [98, 112], argent: [1.5, 2.0], materiel: [20, 45], marge: .10 };
const CARAT = { 'saphir-bleu':[120,350], 'saphir-rose':[100,300], 'saphir-jaune':[80,220], 'padparadscha':[300,800], 'saphir-vert':[60,180], 'saphir-parti':[80,220], 'rubis':[200,600], 'spinelle-rose':[100,300], 'spinelle-rouge':[200,550], 'tourmaline-verte':[40,120], 'tourmaline-rose':[50,150], 'tanzanite':[80,250], 'tsavorite':[150,450], 'spessartite':[60,180], 'aigue-marine':[40,120], 'peridot':[30,80], 'zircon':[40,110], 'emeraude':[150,500] };
function priceOf(r, opt = {}){
  let ct = CARAT[r.stone.id];
  if (r.stone.id === 'diamant'){ const b = 2600 + 2400 * Math.max(0, r.ct - .5); ct = [b, b * 1.45]; }
  const add = { chaton: 2, spirale: 1.5, racines: -.5, etoile: .5, branches: 0, gouttes: .8, granules: .5 }[r.motif] || 0;
  let g = opt.g ? opt.g + add * .3 : Math.max(3, 6.5 + add + (r.W - 6) * .35);
  if (r.metal === 'argent') g *= .67;
  const mp = r.metal === 'argent' ? PRICE.argent : PRICE.or;
  const extra = { chaton: 1, racines: 2, branches: 2, etoile: 2 }[r.motif] || 0;
  const h = opt.h || [9 + extra, 14 + extra];
  const low = (r.ct * ct[0] + g * .9 * mp[0] + h[0] * PRICE.smic + PRICE.materiel[0]) * (1 + PRICE.marge);
  const high = (r.ct * ct[1] + g * 1.1 * mp[1] + h[1] * PRICE.smic + PRICE.materiel[1]) * (1 + PRICE.marge);
  return [Math.floor(low / 10) * 10, Math.ceil(high / 10) * 10];
}
const eur = (n) => n.toLocaleString('fr-FR') + ' €';
const priceTxt = (p) => `${p[0].toLocaleString('fr-FR')} à ${eur(p[1])}`;
RINGS.forEach(r => { r.prix = priceOf(r); });

function stoneLine(r){
  const s = r.stone;
  return `${s.nom} · ${SHAPES[r.shape].nom} · ${fr(r.ct, 2)} ct`;
}

/* ================= Dessin SVG des bagues ================= */
let uid = 0;
function shapePts(shape, L, W){
  const pts = [], n = 64;
  if (shape === 'emeraude'){
    const c = Math.min(L, W) * 0.2, w = W / 2, h = L / 2;
    return [[-w + c, -h],[w - c, -h],[w, -h + c],[w, h - c],[w - c, h],[-w + c, h],[-w, h - c],[-w, -h + c]];
  }
  for (let k = 0; k < n; k++){
    const t = k / n * Math.PI * 2; let x, y;
    if (shape === 'marquise' || shape === 'poire'){
      const right = k < n / 2; const u = right ? k / (n / 2) : 1 - (k - n / 2) / (n / 2);
      let f;
      if (shape === 'marquise') f = Math.sin(Math.PI * u);
      else { const c = 0.58; f = u < c ? Math.pow(u / c, 0.9) * Math.sin(Math.PI / 2 * Math.min(1, u / c * 1.05)) : Math.sqrt(Math.max(0, 1 - Math.pow((u - c) / (1 - c), 2))); }
      y = -L / 2 + L * u; x = (right ? 1 : -1) * f * W / 2;
    } else if (shape === 'coussin'){
      const s = Math.sin(t), c = Math.cos(t);
      x = Math.sign(s) * Math.pow(Math.abs(s), 0.55) * W / 2; y = -Math.sign(c) * Math.pow(Math.abs(c), 0.55) * L / 2;
    } else if (shape === 'trillion'){
      const a = t - Math.PI / 2, seg = Math.PI * 2 / 3;
      const m = ((a + Math.PI / 2) % seg + seg) % seg - seg / 2;
      const rr = (L / 2) * Math.pow(Math.cos(Math.PI / 3) / Math.cos(m), 0.82);
      x = Math.cos(a + Math.PI) * rr * -1; y = Math.sin(a + Math.PI) * rr; y = -y;
    } else {
      x = Math.sin(t) * W / 2; y = -Math.cos(t) * L / 2;
    }
    pts.push([x, y]);
  }
  return pts;
}
const P = (pts, cx, cy) => 'M' + pts.map(p => (cx + p[0]).toFixed(1) + ',' + (cy + p[1]).toFixed(1)).join('L') + 'Z';
function offsetPts(pts, d, amp, seed, freq = 5){
  return pts.map((p, k) => {
    const len = Math.hypot(p[0], p[1]) || 1; const a = k / pts.length * Math.PI * 2;
    const n = amp * (Math.sin(a * freq + seed) * .6 + Math.sin(a * (freq + 3) + seed * 2.3) * .4);
    const dd = d + n; return [p[0] + p[0] / len * dd, p[1] + p[1] / len * dd];
  });
}
function densify(pts){ if (pts.length >= 32) return pts; const out = []; for (let k = 0; k < pts.length; k++){ const a = pts[k], b = pts[(k + 1) % pts.length]; for (let s = 0; s < 6; s++){ const t = s / 6; out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]); } } return out; }

/* mode : 'illu' (rendu), 'croquis' (crayon, avec pierre), 'monture' (crayon, sans pierre) */
function ringSVG(r, mode, opt = {}){
  const id = 'g' + (++uid);
  const C = 110, rnd = mulberry32(r.seed);
  const px = Math.min(9, 112 / Math.max(r.L, r.W * 1.15));
  const L = r.L * px, W = r.W * px;
  const sp = shapePts(r.shape, L, W), spD = densify(sp);
  const sketch = mode !== 'illu';
  const ink = '#3B2F2C';
  const m = METALS[r.metal].svg, s = r.stone.hex;
  const metalFill = sketch ? `url(#${id}h)` : `url(#${id}m)`;
  const metalStroke = sketch ? ink : 'rgba(60,30,20,.35)';
  const sw = sketch ? 0.9 : 0.6;
  const parts = [];
  const metal = (d) => parts.push(`<path d="${d}" fill="${metalFill}" stroke="${metalStroke}" stroke-width="${sw}" stroke-linejoin="round"/>`);
  const metalLine = (d, w) => { parts.push(`<path d="${d}" fill="none" stroke="${sketch ? ink : `url(#${id}m)`}" stroke-width="${sketch ? Math.max(1, w * .35) : w}" stroke-linecap="round" stroke-linejoin="round"/>`); if (sketch) parts.push(`<path d="${d}" fill="none" stroke="${ink}" stroke-opacity=".25" stroke-width="${w}" stroke-linecap="round"/>`); };
  const dot = (x, y, rr) => parts.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${rr.toFixed(1)}" fill="${metalFill}" stroke="${metalStroke}" stroke-width="${sw}"/>` + (sketch ? '' : `<circle cx="${(x - rr * .3).toFixed(1)}" cy="${(y - rr * .35).toFixed(1)}" r="${(rr * .35).toFixed(1)}" fill="#fff" opacity=".7"/>`));

  // anneau (vue de dessus : deux branches qui partent vers le haut et le bas)
  const bw = (r.motif === 'racines' ? 2.2 : 2.8) * px;
  const shank = (dir) => {
    const y0 = C + dir * L * 0.3, y1 = dir < 0 ? -12 : 232, w0 = bw * 1.4, w1 = bw;
    const wb = () => (rnd() - .5) * bw * .5;
    return `M${C - w0 / 2},${y0} C${C - w0 / 2 + wb()},${(y0 + y1) / 2} ${C - w1 / 2 + wb()},${y1} ${C - w1 / 2},${y1} L${C + w1 / 2},${y1} C${C + w1 / 2 + wb()},${y1} ${C + w0 / 2 + wb()},${(y0 + y1) / 2} ${C + w0 / 2},${y0}Z`;
  };
  const under = [], over = [];
  if (r.motif === 'spirale'){
    const a = W / 2 + 7, b = L / 2 + 7;
    under.push(() => metalLine(`M${C - 4},-12 C${C - 6},${C - b - 30} ${C - a - 26},${C - b * .6} ${C - a - 4},${C} S${C - a * .4},${C + b + 14} ${C + 6},${C + b + 4} S${C + 16},${C + b + 30} ${C + 4},232`, bw * .8));
    under.push(() => metalLine(`M${C + 4},232 C${C + 6},${C + b + 30} ${C + a + 26},${C + b * .6} ${C + a + 4},${C} S${C + a * .4},${C - b - 14} ${C - 6},${C - b - 4} S${C - 16},${C - b - 30} ${C - 4},-12`, bw * .8));
    under.push(() => metal(P(offsetPts(spD, 2.5, .6, r.seed), C, C)));
    over.push(() => { metalLine(`M${C - W / 2 - 6},${C - 3} q5,3 8,0`, 4); metalLine(`M${C + W / 2 + 6},${C + 3} q-5,-3 -8,0`, 4); });
  } else {
    under.push(() => metal(shank(-1)), () => metal(shank(1)));
  }
  if (r.motif === 'chaton'){
    under.push(() => metal(P(offsetPts(spD, 8, 3.2, r.seed, 4), C, C)));
    over.push(() => {
      const n = 5 + Math.floor(rnd() * 3);
      for (let k = 0; k < n; k++){ const p = spD[Math.floor((k + rnd() * .6) / n * spD.length)]; const len = Math.hypot(p[0], p[1]); const rr = 3 + rnd() * 4; const x = C + p[0] - p[0] / len * rr * .35, y = C + p[1] - p[1] / len * rr * .35; parts.push(`<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${(rr * 1.4).toFixed(1)}" ry="${rr.toFixed(1)}" transform="rotate(${(Math.atan2(p[1], p[0]) * 180 / Math.PI + 90).toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})" fill="${metalFill}" stroke="${metalStroke}" stroke-width="${sw}"/>`); }
    });
  }
  if (r.motif === 'granules'){
    under.push(() => metal(P(offsetPts(spD, 3, .4, r.seed), C, C)));
    over.push(() => { const ring = offsetPts(spD, 3.4, 0, 0); const n = Math.max(14, Math.round((L + W) * 1.6 / 6.5)); for (let k = 0; k < n; k++){ const p = ring[Math.floor(k / n * ring.length)]; dot(C + p[0], C + p[1], 2.5); } });
  }
  if (r.motif === 'gouttes'){
    under.push(() => metal(P(offsetPts(spD, 4, 1, r.seed), C, C)));
    over.push(() => { const n = 6; for (let k = 0; k < n; k++){ const p = spD[Math.floor((k + .5) / n * spD.length)]; const len = Math.hypot(p[0], p[1]); const ux = p[0] / len, uy = p[1] / len; const x = C + p[0] + ux * 2, y = C + p[1] + uy * 2; const tx = x - ux * 9, ty = y - uy * 9; const nx = -uy * 4.2, ny = ux * 4.2; parts.push(`<path d="M${tx.toFixed(1)},${ty.toFixed(1)} C${(x + nx * .2).toFixed(1)},${(y + ny * .2 - 0).toFixed(1)} ${(x + nx + ux * 5).toFixed(1)},${(y + ny + uy * 5).toFixed(1)} ${(x + ux * 5).toFixed(1)},${(y + uy * 5).toFixed(1)} S${(x - nx * .2).toFixed(1)},${(y - ny * .2).toFixed(1)} ${tx.toFixed(1)},${ty.toFixed(1)}Z" fill="${metalFill}" stroke="${metalStroke}" stroke-width="${sw}"/>`); } });
  }
  if (r.motif === 'etoile'){
    under.push(() => { const star = spD.map((p, k) => { const a = Math.atan2(p[1], p[0]); const len = Math.hypot(p[0], p[1]); const d = 3 + 11 * Math.pow(Math.max(0, Math.cos(a * 6)), 3); return [p[0] + p[0] / len * d, p[1] + p[1] / len * d]; }); metal(P(star, C, C)); });
    over.push(() => { for (let k = 0; k < 6; k++){ const a = k / 6 * Math.PI * 2; const p = spD.reduce((best, q) => Math.abs(Math.atan2(q[1], q[0]) - a) < Math.abs(Math.atan2(best[1], best[0]) - a) ? q : best, spD[0]); const len = Math.hypot(p[0], p[1]); const ux = p[0] / len, uy = p[1] / len, nx = -uy, ny = ux; const bx = C + p[0] + ux * 3, by = C + p[1] + uy * 3; parts.push(`<path d="M${(bx + nx * 4).toFixed(1)},${(by + ny * 4).toFixed(1)} L${(C + p[0] - ux * 5).toFixed(1)},${(C + p[1] - uy * 5).toFixed(1)} L${(bx - nx * 4).toFixed(1)},${(by - ny * 4).toFixed(1)}Z" fill="${metalFill}" stroke="${metalStroke}" stroke-width="${sw}"/>`); } });
  }
  if (r.motif === 'branches'){
    under.push(() => metal(P(offsetPts(spD, 2.6, .5, r.seed), C, C)));
    const angs = [45, 135, 225, 315].map(a => a * Math.PI / 180);
    const at = (a) => spD.reduce((best, q) => { const da = Math.abs(((Math.atan2(q[1], q[0]) - a + Math.PI * 3) % (Math.PI * 2)) - Math.PI); const db = Math.abs(((Math.atan2(best[1], best[0]) - a + Math.PI * 3) % (Math.PI * 2)) - Math.PI); return da < db ? q : best; }, spD[0]);
    under.push(() => angs.forEach(a => { const p = at(a); const len = Math.hypot(p[0], p[1]); const ux = p[0] / len, uy = p[1] / len; const x0 = C + p[0] + ux * 16, y0 = C + p[1] + uy * 16; metalLine(`M${(x0 + uy * 4).toFixed(1)},${(y0 - ux * 4).toFixed(1)} l${(ux * 7 - uy * 6).toFixed(1)},${(uy * 7 + ux * 6).toFixed(1)}`, 2.4); }));
    over.push(() => angs.forEach(a => { const p = at(a); const len = Math.hypot(p[0], p[1]); const ux = p[0] / len, uy = p[1] / len; metalLine(`M${(C + p[0] + ux * 16).toFixed(1)},${(C + p[1] + uy * 16).toFixed(1)} Q${(C + p[0] + ux * 6 + uy * 4).toFixed(1)},${(C + p[1] + uy * 6 - ux * 4).toFixed(1)} ${(C + p[0] - ux * 4).toFixed(1)},${(C + p[1] - uy * 4).toFixed(1)}`, 4.2); }));
  }
  if (r.motif === 'racines'){
    under.push(() => { for (let k = 0; k < 8; k++){ const sgn = k % 2 ? 1 : -1; const x0 = C + (rnd() - .5) * W * .8, y0 = C + sgn * L * .4; const y1 = sgn < 0 ? -10 : 230; let d = `M${x0.toFixed(1)},${y0.toFixed(1)}`; let x = x0, y = y0; const steps = 4; for (let q = 1; q <= steps; q++){ const ny = y0 + (y1 - y0) * q / steps; const nx = C + (x0 - C) * (1 - q / steps) * .6 + (rnd() - .5) * 18; d += ` Q${((x + nx) / 2 + (rnd() - .5) * 14).toFixed(1)},${((y + ny) / 2).toFixed(1)} ${nx.toFixed(1)},${ny.toFixed(1)}`; x = nx; y = ny; } metalLine(d, 1.8 + rnd()); } });
    under.push(() => metal(P(offsetPts(spD, 3.4, 1.2, r.seed, 7), C, C)));
    over.push(() => { for (let k = 0; k < 6; k++){ const p = spD[Math.floor((k + .25) / 6 * spD.length)]; const len = Math.hypot(p[0], p[1]); dot(C + p[0] - p[0] / len * 1.4, C + p[1] - p[1] / len * 1.4, 2.6); } });
  }

  under.forEach(f => f());
  // pierre
  if (mode === 'illu'){
    parts.push(`<path d="${P(sp, C, C)}" fill="url(#${id}s)"/>`);
    const tbl = sp.map(p => [p[0] * .56, p[1] * .56]);
    const step = Math.max(1, Math.floor(sp.length / 16));
    let fac = '';
    for (let k = 0; k < sp.length; k += step){ const a = sp[k], b = sp[(k + step) % sp.length], t = tbl[k], tb = tbl[(k + step) % sp.length]; if ((k / step) % 2 === 0) fac += `<path d="M${(C + a[0]).toFixed(1)},${(C + a[1]).toFixed(1)}L${(C + b[0]).toFixed(1)},${(C + b[1]).toFixed(1)}L${(C + tb[0]).toFixed(1)},${(C + tb[1]).toFixed(1)}L${(C + t[0]).toFixed(1)},${(C + t[1]).toFixed(1)}Z" fill="${s[2]}" opacity=".22"/>`; fac += `<path d="M${(C + a[0]).toFixed(1)},${(C + a[1]).toFixed(1)}L${(C + t[0]).toFixed(1)},${(C + t[1]).toFixed(1)}" stroke="#fff" stroke-opacity=".35" stroke-width=".6"/>`; }
    parts.push(fac);
    parts.push(`<path d="${P(tbl, C, C)}" fill="${s[0]}" fill-opacity=".28" stroke="#fff" stroke-opacity=".5" stroke-width=".6"/>`);
    parts.push(`<ellipse cx="${(C - W * .14).toFixed(1)}" cy="${(C - L * .16).toFixed(1)}" rx="${(W * .1).toFixed(1)}" ry="${(L * .06).toFixed(1)}" fill="#fff" opacity=".75" transform="rotate(-30 ${(C - W * .14).toFixed(1)} ${(C - L * .16).toFixed(1)})"/>`);
  } else if (mode === 'croquis'){
    parts.push(`<path d="${P(sp, C, C)}" fill="#FBF7F1" stroke="${ink}" stroke-width="1.1"/>`);
    const tbl = sp.map(p => [p[0] * .56, p[1] * .56]);
    const step = Math.max(1, Math.floor(sp.length / 8));
    let fac = `<path d="${P(tbl, C, C)}" fill="none" stroke="${ink}" stroke-width=".6" opacity=".6"/>`;
    for (let k = 0; k < sp.length; k += step){ fac += `<path d="M${(C + sp[k][0]).toFixed(1)},${(C + sp[k][1]).toFixed(1)}L${(C + tbl[k][0]).toFixed(1)},${(C + tbl[k][1]).toFixed(1)}" stroke="${ink}" stroke-width=".5" opacity=".55"/>`; }
    parts.push(fac);
  } else {
    parts.push(`<path d="${P(sp, C, C)}" fill="#F6EFE6" stroke="${ink}" stroke-width=".9" stroke-dasharray="3 3"/>`);
    parts.push(`<path d="M${C - 6},${C}h12M${C},${C - 6}v12" stroke="${ink}" stroke-width=".6" opacity=".5"/>`);
  }
  over.forEach(f => f());

  let deco = '';
  if (sketch){
    deco += `<path d="M10,${C}H210M${C},10V210" stroke="${ink}" stroke-width=".4" stroke-dasharray="2 4" opacity=".35"/>`;
    const x0 = 18, y0 = 200, len = 5 * px;
    deco += `<g stroke="${ink}" stroke-width="1"><path d="M${x0},${y0}h${len.toFixed(1)}M${x0},${y0 - 4}v8M${(x0 + len).toFixed(1)},${y0 - 4}v8"/></g><text x="${(x0 + len + 6).toFixed(1)}" y="${y0 + 4}" font-family="Caveat, cursive" font-size="14" fill="${ink}">5 mm</text>`;
    if (opt.label) deco += `<rect x="10" y="10" width="${opt.label.length * 5.6 + 12}" height="20" rx="3" fill="#F6EFE6" opacity=".92"/><text x="16" y="25" font-family="Caveat, cursive" font-size="13" fill="${ink}">${opt.label}</text>`;
  }
  const vb = opt.viewBox || '0 0 220 220';
  return `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><defs>
<linearGradient id="${id}m" gradientUnits="userSpaceOnUse" x1="40" y1="20" x2="180" y2="200"><stop offset="0" stop-color="${m[0]}"/><stop offset=".3" stop-color="${m[1]}"/><stop offset=".48" stop-color="${m[0]}"/><stop offset=".72" stop-color="${m[2]}"/><stop offset="1" stop-color="${m[1]}"/></linearGradient>
<radialGradient id="${id}s" gradientUnits="userSpaceOnUse" cx="${(C - W * .15).toFixed(1)}" cy="${(C - L * .2).toFixed(1)}" r="${(Math.max(L, W) * .75).toFixed(1)}"><stop offset="0" stop-color="${s[0]}"/><stop offset=".5" stop-color="${s[1]}"/><stop offset="1" stop-color="${s[2]}"/></radialGradient>
<pattern id="${id}h" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(40)"><rect width="4" height="4" fill="#F1E8DD"/><path d="M0,0V4" stroke="${ink}" stroke-width=".7" opacity=".45"/></pattern>
</defs>${sketch && !opt.noPaper ? `<rect x="-20" y="-20" width="260" height="260" fill="#F6EFE6"/>` : ''}${parts.join('')}${deco}</svg>`;
}

/* ================= Boutique : état gardé dans le navigateur ================= */
const shop = (() => { let d = null; try { d = JSON.parse(localStorage.getItem('singulier-shop')); } catch(e){} return Object.assign({ user: null, logged: false, fav: [], cart: [], orders: [], news: '' }, d || {}); })();
const saveShop = () => store.set('singulier-shop', JSON.stringify(shop));
const esc = (s) => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const heartBtn = (id, nom) => `<button type="button" class="heart" data-fav="${id}" aria-pressed="${shop.fav.includes(id)}" aria-label="Favori : ${nom}"><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"/></svg></button>`;

/* ================= Shopify : Storefront API (activée par config.js) ================= */
const CFG = window.SINGULIER_CONFIG || {};
const Live = (() => {
  const c = CFG.shopify || {};
  const domain = String(c.domain || '').trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
  const on = !!(domain && c.storefrontToken);
  const endpoint = on ? `https://${domain}/api/${c.apiVersion || '2026-07'}/graphql.json` : '';
  const products = new Map();
  const slug = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
  async function gql(query, variables){
    const r = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': c.storefrontToken }, body: JSON.stringify({ query, variables }) });
    if (!r.ok) throw new Error('Shopify a répondu ' + r.status);
    const j = await r.json(); if (j.errors && j.errors.length) throw new Error(j.errors[0].message); return j.data;
  }
  const PRODUCTS = `query P($cursor: String){ products(first: 100, after: $cursor, query: "tag:flash OR tag:pluriel"){ pageInfo{ hasNextPage endCursor } nodes{ handle title availableForSale variants(first: 30){ nodes{ id availableForSale price{ amount currencyCode } selectedOptions{ name value } } } } } }`;
  const ready = on ? (async () => {
    let cursor = null;
    do { const d = await gql(PRODUCTS, { cursor }); d.products.nodes.forEach(p => products.set(p.handle, p)); cursor = d.products.pageInfo.hasNextPage ? d.products.pageInfo.endCursor : null; } while (cursor);
    return products;
  })() : Promise.resolve(products);
  ready.catch(() => {});
  return { on, domain, gql, ready, products, slug, accountUrl: on ? `https://${domain}/account` : '' };
})();
const handleOf = (id) => id[0] === 'f' ? 'flash-' + String(+id.slice(1) + 1).padStart(2, '0') : 'pluriel-' + Live.slug(MODELS_NAMES[+id.slice(1)] || '');
const MODELS_NAMES = ['Granule', 'Goutte', 'Racine', 'Étoile'];
function liveProduct(id){ return Live.on ? Live.products.get(handleOf(id)) || null : null; }
function priceInner(id, est){
  const p = liveProduct(id);
  if (p){
    if (!p.availableForSale) return `Vendue<small>pièce déjà adoptée</small>`;
    const v = p.variants.nodes.map(n => +n.price.amount), lo = Math.min(...v), hi = Math.max(...v);
    return `${lo === hi ? eur(lo) : 'À partir de ' + eur(lo)}<small>prix boutique</small>`;
  }
  return `${priceTxt(est)}<small>fourchette estimée</small>`;
}

/* ================= Flash : filtres, tri, grille, fiche ================= */
const listEl = $('#fiches'), moreBtn = $('#more'), countEl = $('#count'), filtersEl = $('#filters'), resetBtn = $('#fl-reset');
const PAGE = mobile ? 8 : 12;
const F = { fam: 'tout', metal: '', motif: '', forme: '', prix: '', tri: 'num' };
let shown = PAGE;
const fillSel = (id, opts) => { $('#' + id).innerHTML = opts.map(([v, t]) => `<option value="${v}">${t}</option>`).join(''); };
fillSel('fl-metal', [['', 'Tous les métaux'], ...Object.entries(METALS).map(([k, m]) => [k, m.nom])]);
fillSel('fl-motif', [['', 'Toutes les montures'], ...Object.entries(MOTIFS).map(([k, m]) => [k, m.nom])]);
fillSel('fl-forme', [['', 'Toutes les formes'], ...Object.entries(SHAPES).map(([k, s]) => [k, 'Taille ' + s.nom])]);
fillSel('fl-prix', [['', 'Tous les budgets'], ['0-700', 'Moins de 700 €'], ['700-1200', '700 à 1 200 €'], ['1200-2000', '1 200 à 2 000 €'], ['2000-999999', 'Plus de 2 000 €']]);
fillSel('fl-tri', [['num', 'Numéro'], ['nom', 'Nom, de A à Z'], ['prix-asc', 'Prix croissant'], ['prix-desc', 'Prix décroissant'], ['ct-desc', 'Pierre la plus grosse'], ['ct-asc', 'Pierre la plus petite']]);
const prixOf = (r) => { const p = liveProduct('f' + r.i); if (p && p.variants.nodes.length){ const v = Math.min(...p.variants.nodes.map(n => +n.price.amount)); return [v, v]; } return r.prix; };
const SORTERS = { num: (x, y) => x.i - y.i, nom: (x, y) => x.nom.localeCompare(y.nom, 'fr'), 'prix-asc': (x, y) => prixOf(x)[0] - prixOf(y)[0], 'prix-desc': (x, y) => prixOf(y)[1] - prixOf(x)[1], 'ct-desc': (x, y) => y.ct - x.ct, 'ct-asc': (x, y) => x.ct - y.ct };
function filtered(){
  let a = RINGS.filter(r => (F.fam === 'tout' || r.stone.fam === F.fam) && (!F.metal || r.metal === F.metal) && (!F.motif || r.motif === F.motif) && (!F.forme || r.shape === F.forme));
  if (F.prix){ const [lo, hi] = F.prix.split('-').map(Number); a = a.filter(r => prixOf(r)[0] >= lo && prixOf(r)[0] < hi); }
  return a.slice().sort(SORTERS[F.tri]);
}
filtersEl.innerHTML = FAMILIES.map(f => `<li><button type="button" class="chip" data-f="${f.id}" aria-pressed="${f.id === F.fam}">${f.sw ? `<span class="sw" style="background:${f.sw}"></span>` : ''}${f.nom}</button></li>`).join('');
function refilter(){ shown = PAGE; renderList(true); }
filtersEl.addEventListener('click', e => {
  const b = e.target.closest('[data-f]'); if (!b) return;
  F.fam = b.dataset.f; $$('[data-f]', filtersEl).forEach(x => x.setAttribute('aria-pressed', String(x === b))); refilter();
});
[['fl-metal', 'metal'], ['fl-motif', 'motif'], ['fl-forme', 'forme'], ['fl-prix', 'prix'], ['fl-tri', 'tri']].forEach(([id, key]) => $('#' + id).addEventListener('change', e => { F[key] = e.target.value; refilter(); }));
resetBtn.addEventListener('click', () => {
  Object.assign(F, { fam: 'tout', metal: '', motif: '', forme: '', prix: '' });
  ['fl-metal', 'fl-motif', 'fl-forme', 'fl-prix'].forEach(id => { $('#' + id).value = ''; });
  $$('[data-f]', filtersEl).forEach(x => x.setAttribute('aria-pressed', String(x.dataset.f === 'tout'))); refilter();
});
function cardHTML(r){
  return `<li><article class="card" data-i="${r.i}">${heartBtn('f' + r.i, r.nom)}
    <button type="button" class="card-stage" data-open="${r.i}" aria-label="Ouvrir la fiche ${r.nom}, numéro ${r.num}">
      <span class="card-inner">
        <span class="face face-front">${ringSVG(r, 'illu')}<img class="render" alt="" decoding="async"></span>
        <span class="face face-back">${ringSVG(r, 'monture', { label: 'monture · n°' + r.num })}</span>
      </span>
    </button>
    <div class="card-meta">
      <p class="card-num">N° ${r.num} / 66</p>
      <h3 class="card-name">${r.nom}</h3>
      <p class="card-spec">${stoneLine(r)}<br>${METALS[r.metal].nom} · ${MOTIFS[r.motif].nom.toLowerCase()}</p>
      <p class="card-price" data-price="f${r.i}">${priceInner('f' + r.i, r.prix)}</p>
      <div class="card-actions">
        <button type="button" class="btn btn-line" data-flip aria-pressed="false">Voir la monture</button>
        <button type="button" class="btn btn-main" data-open="${r.i}">Ouvrir la fiche</button>
        <button type="button" class="btn btn-line" data-try="f${r.i}" aria-label="Essayer ${r.nom} sur ma main"><svg aria-hidden="true"><use href="#i-camera"/></svg>Essayer</button>
      </div>
    </div>
  </article></li>`;
}
function renderList(reset){
  const items = filtered();
  const slice = items.slice(0, shown);
  const startAt = reset ? 0 : listEl.children.length;
  if (reset) listEl.innerHTML = '';
  if (!items.length) listEl.innerHTML = '<li class="empty">Aucune bague ne correspond à ces filtres. Retirez-en un, ou effacez-les tous.</li>';
  else listEl.insertAdjacentHTML('beforeend', slice.slice(startAt).map(cardHTML).join(''));
  const rest = items.length - slice.length;
  countEl.textContent = items.length ? `${slice.length} bague${slice.length > 1 ? 's' : ''} affichée${slice.length > 1 ? 's' : ''} sur ${items.length}` : 'Aucune bague';
  resetBtn.hidden = !(F.fam !== 'tout' || F.metal || F.motif || F.forme || F.prix);
  moreBtn.hidden = rest <= 0;
  moreBtn.textContent = `Afficher ${Math.min(PAGE, rest)} bagues de plus (${rest} restantes)`;
  const fresh = items.length ? Array.from(listEl.children).slice(startAt) : [];
  fresh.forEach(li => { const card = li.querySelector('.card'); const r = RINGS[+card.dataset.i]; if (Studio) Studio.thumb(r, card, url => { if (!url) return; const img = card.querySelector('.render'); img.onload = () => card.querySelector('.face-front').classList.add('has-render'); img.src = url; }); });
  if (G && !reduce && fresh.length) G.from(fresh, { opacity: 0, y: mobile ? 0 : 20, duration: .5, stagger: { each: .04, ease: 'power1.in' }, ease: 'power3.out', clearProps: 'all' });
  if (window.ScrollTrigger) requestAnimationFrame(() => window.ScrollTrigger.refresh());
}
moreBtn.addEventListener('click', () => { const before = listEl.children.length; shown += PAGE; renderList(false); const first = listEl.children[before]; if (first) first.querySelector('.card-stage').focus({ preventScroll: true }); });
listEl.addEventListener('click', e => {
  const flip = e.target.closest('[data-flip]');
  if (flip){ const card = flip.closest('.card'); const on = !card.classList.contains('is-flipped'); card.classList.toggle('is-flipped', on); flip.setAttribute('aria-pressed', String(on)); flip.textContent = on ? 'Voir la bague' : 'Voir la monture'; Sound.tick(); return; }
  const open = e.target.closest('[data-open]');
  if (open) openSheet(+open.dataset.open, open);
});

/* Fiche détaillée */
const sheet = $('#sheet');
let sheetIdx = 0, sheetOpener = null;
function openSheet(i, opener){
  sheetIdx = i; sheetOpener = opener || sheetOpener;
  fillSheet();
  if (!sheet.open){ if (typeof sheet.showModal === 'function') sheet.showModal(); else sheet.setAttribute('open', ''); }
  Sound.chime();
  Viewer.show(RINGS[sheetIdx]);
}
function fillSheet(){
  const r = RINGS[sheetIdx];
  $('#sheet-num').textContent = `N° ${r.num} / 66`;
  $('#sheet-title').textContent = r.nom;
  $('#sheet-price').innerHTML = priceInner('f' + r.i, r.prix).replace(/<small>.*<\/small>/, '');
  $('#v-croquis').innerHTML = ringSVG(r, 'croquis', { label: 'n°' + r.num + ' · vue de dessus' });
  $('#v-illu').innerHTML = ringSVG(r, 'illu');
  const px = Math.min(9, 112 / Math.max(r.L, r.W * 1.15));
  const ex = 110 + r.W * px / 2, size = 55;
  $('#v-serti').innerHTML = `<span class="view-badge">×4</span>` + ringSVG(r, 'illu', { viewBox: `${(ex - size / 2).toFixed(1)} ${(110 - size / 2).toFixed(1)} ${size} ${size}` });
  $('#v-serti-txt').textContent = MOTIFS[r.motif].serti;
  { const lp = liveProduct('f' + r.i), sold = !!(lp && !lp.availableForSale); $('#sheet-price-note').textContent = lp ? (sold ? 'Cette pièce unique a trouvé sa propriétaire.' : 'Prix boutique, livraison offerte.') : 'Fourchette estimée, à confirmer par devis.'; const add = $('#sheet-add'); if (add){ add.disabled = sold; add.textContent = sold ? 'Vendue' : 'Ajouter au panier'; } }
  const s = r.stone, isD = s.id === 'diamant';
  const rows = [
    ['Pierre', isD ? 'Diamant à sourcer' : s.nom],
    ['Taille proposée', SHAPES[r.shape].nom],
    ['Poids proposé', fr(r.ct, 2) + ' ct'],
    ['Dimensions proposées', `environ ${fr(r.L)} × ${fr(r.W)} mm`],
    ['Provenance', isD ? 'Spécification visée : couleur G à H, pureté VS' : `Lot aux enchères, ${r.orig}, à confirmer`],
    ['Dureté (Mohs)', s.mohs],
    ['Monture', MOTIFS[r.motif].nom],
    ['Métal', METALS[r.metal].nom + ', coulé et sculpté à la main']
  ];
  $('#sheet-specs').innerHTML = rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('');
  $('#sheet-note').textContent = (isD
    ? 'Le diamant reste à sourcer : la spécification et le poids sont une cible. '
    : 'La pierre est un lot aux enchères : s’il est vendu, il sera remplacé par une pierre de même nature, de même couleur et de poids proche. ')
    + 'La fourchette de prix est une estimation, hors TVA éventuelle, fonte sous-traitée, poinçon et écrin. Les images sont des rendus de travail, pas des photos de pièces finies.';
}
$('#sheet-close').addEventListener('click', () => sheet.close());
sheet.addEventListener('click', e => { if (e.target === sheet) sheet.close(); });
sheet.addEventListener('close', () => { Viewer.stop(); if (sheetOpener && document.contains(sheetOpener)) sheetOpener.focus(); });
$('#sheet-prev').addEventListener('click', () => { sheetIdx = (sheetIdx + 65) % 66; fillSheet(); Viewer.show(RINGS[sheetIdx]); });
$('#sheet-next').addEventListener('click', () => { sheetIdx = (sheetIdx + 1) % 66; fillSheet(); Viewer.show(RINGS[sheetIdx]); });
$('#v-mode').addEventListener('click', e => { const on = e.currentTarget.getAttribute('aria-pressed') !== 'true'; e.currentTarget.setAttribute('aria-pressed', String(on)); Viewer.setReal(!on); });

/* ================= Pluriel ================= */
const MODELS = [
  { nom:'Granule', txt:'Un anneau fin bordé de grains de métal, avec une petite pierre au centre.', art:['Bague fine','Bague large'], r:{ stone:STONES[1], shape:'rond', motif:'granules', metal:'rose', L:3.4, W:3.4, ct:.2, seed:11 } },
  { nom:'Goutte', txt:'Une goutte de métal coulé retient la pierre comme une perle d’eau.', art:['Bague','Bague de phalange'], r:{ stone:STONES[14], shape:'poire', motif:'gouttes', metal:'jaune', L:4.6, W:3.2, ct:.3, seed:23 } },
  { nom:'Racine', txt:'Un jonc fin parcouru de racines gravées, avec un éclat de diamant.', art:['Jonc','Bague fine'], r:{ stone:STONES[18], shape:'rond', motif:'racines', metal:'argent', L:2.6, W:2.6, ct:.07, seed:37 } },
  { nom:'Étoile', txt:'Un petit serti étoilé à six branches sur un anneau régulier.', art:['Bague','Bague large'], r:{ stone:STONES[11], shape:'rond', motif:'etoile', metal:'blanc', L:3.6, W:3.6, ct:.25, seed:51 } }
];
const SIZES = [48, 50, 52, 54, 56, 58, 60];
$('#models').innerHTML = MODELS.map((m, k) => `<li class="model" data-k="${k}">${heartBtn('p' + k, m.nom)}
  <div class="model-art face-front" style="position:relative">${ringSVG(m.r, 'illu')}<img class="render" alt="" decoding="async"></div>
  <div class="model-body">
    <h3>${m.nom}</h3>
    <p>${m.txt}</p>
    <p class="model-price" data-price="p${k}">${priceInner('p' + k, priceOf(m.r, { g: 3.4, h: [4, 7] }))}</p>
    <ul class="articles" aria-label="Articles">${m.art.map(a => `<li>${a}</li>`).join('')}</ul>
    <fieldset class="sizes"><legend>Taille</legend>
      <div class="size-row">${SIZES.map(s => `<input type="radio" id="t-${k}-${s}" name="taille-${k}" value="${s}"${s === 52 ? ' checked' : ''}><label for="t-${k}-${s}">${s}</label>`).join('')}</div>
    </fieldset>
    <p class="size-out" id="out-${k}" aria-live="polite"></p>
    <div class="btn-row"><button type="button" class="btn btn-main" data-add="p${k}">Ajouter au panier</button><button type="button" class="btn btn-line" data-try="p${k}" aria-label="Essayer ${m.nom} sur ma main"><svg aria-hidden="true"><use href="#i-camera"/></svg>Essayer</button></div>
  </div>
</li>`).join('');
function sizeText(t){ return `Taille ${t} : ${t} mm de tour de doigt, soit environ ${fr(t / Math.PI)} mm de diamètre intérieur.`; }
MODELS.forEach((m, k) => { $('#out-' + k).textContent = sizeText(52); });
$('#models').addEventListener('change', e => { const inp = e.target; if (inp.type !== 'radio') return; const k = inp.name.split('-')[1]; $('#out-' + k).textContent = sizeText(+inp.value); Sound.tick(); });

/* ================= Son (désactivé par défaut) ================= */
const Sound = (() => {
  let ctx = null, on = false, pad = null;
  const btn = $('#sound');
  function ensure(){ if (!ctx){ const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null; ctx = new AC(); } if (ctx.state === 'suspended') ctx.resume(); return ctx; }
  function tone(freq, dur, gain, type = 'sine', when = 0){ if (!on || !ensure()) return; const t = ctx.currentTime + when; const o = ctx.createOscillator(), g = ctx.createGain(); o.type = type; o.frequency.value = freq; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(gain, t + .02); g.gain.exponentialRampToValueAtTime(.0001, t + dur); o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + dur + .05); }
  function startPad(){ if (!ensure()) return; stopPad(); const g = ctx.createGain(); g.gain.value = 0; g.connect(ctx.destination); const f = side === 'nina' ? [110, 164.81, 207.65] : [261.63, 329.63, 392]; const os = f.map((fq, k) => { const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = fq; o.detune.value = k * 4; o.connect(g); o.start(); return o; }); g.gain.linearRampToValueAtTime(.018, ctx.currentTime + 1.5); pad = { g, os }; }
  function stopPad(){ if (!pad) return; const p = pad; pad = null; p.g.gain.cancelScheduledValues(ctx.currentTime); p.g.gain.linearRampToValueAtTime(0, ctx.currentTime + .4); setTimeout(() => p.os.forEach(o => o.stop()), 500); }
  btn.addEventListener('click', () => {
    on = !on; btn.setAttribute('aria-pressed', String(on)); btn.setAttribute('aria-label', on ? 'Couper le son' : 'Activer le son');
    btn.querySelector('use').setAttribute('href', on ? '#i-son' : '#i-muet');
    if (on){ startPad(); tone(side === 'nina' ? 392 : 784, 1.2, .05); } else stopPad();
  });
  return {
    tick(){ tone(side === 'nina' ? 880 : 1320, .18, .015, 'triangle'); },
    chime(){ const base = side === 'nina' ? 329.63 : 659.25; tone(base, 1.4, .04); tone(base * 1.5, 1.6, .025, 'sine', .08); },
    swap(){ if (on) startPad(); }
  };
})();

/* ================= Three.js : bague 3D ================= */
if (window.THREE && THREE.ColorManagement) THREE.ColorManagement.legacyMode = false;
const hasThree = !!window.THREE && (() => { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch(e){ return false; } })();

function lump(geo, amp, f, seed, weight){
  const p = geo.attributes.position, n = geo.attributes.normal, v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++){
    v.fromBufferAttribute(p, i);
    const k = (Math.sin(v.x * f + seed) + Math.sin(v.y * f * 1.3 + seed * 2.1) + Math.sin(v.z * f * .7 + seed * .7)) / 3;
    const w = weight ? weight(v) : 1;
    p.setXYZ(i, v.x + n.getX(i) * k * amp * w, v.y + n.getY(i) * k * amp * w, v.z + n.getZ(i) * k * amp * w);
  }
  geo.computeVertexNormals(); return geo;
}
function makeEnv(renderer){
  const pm = new THREE.PMREMGenerator(renderer);
  const s = new THREE.Scene(); s.background = new THREE.Color(0x120607);
  const add = (w, h, rgb, pos) => { const mat = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }); mat.color.setRGB(rgb[0], rgb[1], rgb[2]); const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat); m.position.set(pos[0], pos[1], pos[2]); m.lookAt(0, 0, 0); s.add(m); };
  add(9, 3, [4, 3.8, 3.6], [0, 6, 2]);
  add(3, 7, [3, 2.2, 2], [-6, 1, 1.5]);
  add(3, 7, [1.6, 1.8, 2.6], [6, 0, -1]);
  add(6, 1.4, [3, 3, 3], [0, -1.5, 6]);
  add(2.4, 2.4, [3, 1.1, 1.6], [3, -4, 3]);
  add(4, 2, [.6, .1, .2], [-3, -4, -4]);
  const rnd = mulberry32(7);                                   // petits éclats pour faire scintiller les facettes
  for (let k = 0; k < 18; k++){ const a = rnd() * Math.PI * 2, e = (rnd() - .2) * 1.4; const c = [[26, 26, 26], [30, 22, 16], [16, 20, 30], [30, 14, 20]][k % 4]; add(.35, .35, c, [Math.cos(a) * Math.cos(e) * 7, Math.sin(e) * 7, Math.sin(a) * Math.cos(e) * 7]); }
  const rt = pm.fromScene(s, .02); pm.dispose(); return rt.texture;
}
function makeGemEnv(renderer){                                   // pièce sombre semée de petites lumières : chaque facette s'allume ou s'éteint
  const pm = new THREE.PMREMGenerator(renderer);
  const s = new THREE.Scene(); s.background = new THREE.Color(0x1c1c1e);
  const rnd = mulberry32(11);
  for (let k = 0; k < 70; k++){
    const a = rnd() * Math.PI * 2, e = Math.asin(rnd() * 2 - 1), sz = .5 + rnd() * 1.6, v = 2 + rnd() * 9;
    const mat = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }); mat.color.setRGB(v, v * (.92 + rnd() * .1), v * (.86 + rnd() * .2));
    const m = new THREE.Mesh(new THREE.PlaneGeometry(sz, sz), mat); m.position.set(Math.cos(a) * Math.cos(e) * 7, Math.sin(e) * 7, Math.sin(a) * Math.cos(e) * 7); m.lookAt(0, 0, 0); s.add(m);
  }
  const top = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }); top.color.setRGB(3, 3, 3);
  const tm = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), top); tm.position.set(0, 7, 0); tm.lookAt(0, 0, 0); s.add(tm);
  const rt = pm.fromScene(s, 0); pm.dispose(); return rt.texture;
}
const ELONG = { rond:1, ovale:1.33, poire:1.45, marquise:1.9, coussin:1.12, emeraude:1.35, trillion:1 };
const SEG = { rond:16, ovale:16, poire:16, marquise:16, coussin:12, emeraude:8, trillion:3 };
function gemGeo(n, twist){
  const rings = [[.52, .30, 0], [.80, .17, .5], [1, .03, 0], [1, -.03, 0], [.55, -.44, .5]];
  const P = (rg, k) => { const a = (k + rg[2] * twist) / n * Math.PI * 2; return [Math.cos(a) * rg[0], rg[1], Math.sin(a) * rg[0]]; };
  const v = []; const tri = (a, b, c) => v.push(a[0], a[1], a[2], b[0], b[1], b[2], c[0], c[1], c[2]);
  for (let k = 0; k < n; k++){
    tri([0, .30, 0], P(rings[0], k), P(rings[0], k + 1));
    for (let j = 0; j < rings.length - 1; j++){
      const A = rings[j], B = rings[j + 1], a0 = P(A, k), a1 = P(A, k + 1), b0 = P(B, k), b1 = P(B, k + 1);
      if (B[2] > A[2]){ tri(a0, a1, b0); tri(a1, b1, b0); } else if (B[2] < A[2]){ tri(a0, b1, b0); tri(a0, a1, b1); } else { tri(a0, a1, b1); tri(a0, b1, b0); }
    }
    tri(P(rings[4], k), P(rings[4], k + 1), [0, -.84, 0]);
  }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(v, 3)); g.computeVertexNormals(); return g;
}
function placeBetween(mesh, a, b){ const d = new THREE.Vector3().subVectors(b, a); mesh.position.copy(a).addScaledVector(d, .5); mesh.scale.set(1, d.length(), 1); mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()); }
function buildRing3D(p, low){
  const g = new THREE.Group();
  const metal = new THREE.MeshStandardMaterial({ color: p.metal, metalness: 1, roughness: .17, envMapIntensity: 1.25 });
  const stoneMat = new THREE.MeshStandardMaterial({ color: p.stone, metalness: 1, roughness: .04, envMap: p.gemEnv || null, envMapIntensity: 1.9, flatShading: true, side: THREE.DoubleSide });
  stoneMat.emissive.copy(stoneMat.color); stoneMat.emissiveIntensity = .2;
  const seed = p.seed || 1;
  const band = lump(new THREE.TorusGeometry(1, .1, low ? 14 : 24, low ? 90 : 170), .035, 6, seed, v => .45 + Math.max(0, v.y) * 1.25);
  g.add(new THREE.Mesh(band, metal));
  const s = p.size || .3, el = ELONG[p.shape] || 1, n = SEG[p.shape] || 16, top = 1.13;
  // pierre (couronne + culasse)
  const stone = new THREE.Group();
  stone.add(new THREE.Mesh(gemGeo(n, p.shape === 'emeraude' ? 0 : 1), stoneMat));
  if (p.shape === 'emeraude') stone.rotation.y = Math.PI / 8;
  stone.scale.set(s, s, s * el); stone.position.y = top + .02;
  g.add(stone);
  // chaton
  const bez = lump(new THREE.TorusGeometry(1, p.motif === 'chaton' ? .2 : .11, low ? 10 : 16, low ? 40 : 72), p.motif === 'chaton' ? .07 : .02, 5, seed * 1.7);
  const bezel = new THREE.Mesh(bez, metal); bezel.rotation.x = Math.PI / 2; bezel.scale.set(s * 1.05, s * el * 1.05, s); bezel.position.y = top; g.add(bezel);
  const ring = (k, rr) => { const a = k * Math.PI * 2; return new THREE.Vector3(Math.cos(a) * s * rr, 0, Math.sin(a) * s * el * rr); };
  if (p.motif === 'granules'){ const cnt = Math.round(18 * Math.sqrt(el)); const geo = new THREE.SphereGeometry(.03, 10, 8); for (let k = 0; k < cnt; k++){ const m = new THREE.Mesh(geo, metal); m.position.copy(ring(k / cnt, 1.22)).setY(top + .03); g.add(m); } }
  if (p.motif === 'gouttes'){ const geo = new THREE.SphereGeometry(.05, 12, 10); for (let k = 0; k < 6; k++){ const m = new THREE.Mesh(geo, metal); const v = ring((k + .5) / 6, 1.0); m.position.copy(v).setY(top + .07); m.scale.set(1, .7, 1.6); m.lookAt(0, top + .07, 0); g.add(m); } }
  if (p.motif === 'etoile'){ const geo = new THREE.ConeGeometry(.045, .16, 4); for (let k = 0; k < 6; k++){ const m = new THREE.Mesh(geo, metal); const v = ring(k / 6, 1.12); m.position.copy(v).setY(top + .05); m.lookAt(0, top + .3, 0); m.rotateX(Math.PI / 2); g.add(m); } }
  if (p.motif === 'branches'){ const geo = new THREE.CylinderGeometry(.022, .03, 1, 6); for (let k = 0; k < 4; k++){ const m = new THREE.Mesh(geo, metal); const a = ring(k / 4 + .125, 1.5).setY(top - .12), b = ring(k / 4 + .125, .92).setY(top + .1); placeBetween(m, a, b); g.add(m); } }
  if (p.motif === 'racines'){ const geo = new THREE.CylinderGeometry(.012, .02, 1, 5); for (let k = 0; k < 8; k++){ const m = new THREE.Mesh(geo, metal); const ang = (k % 2 ? 1 : -1) * (.25 + (k >> 1) * .07); const a = new THREE.Vector3(Math.sin(ang) * 1.08, Math.cos(ang) * 1.08, (k % 3 - 1) * .05); const b = ring(k / 8, 1.0).setY(top - .02); placeBetween(m, a, b); g.add(m); } }
  if (p.motif === 'spirale'){ for (const dir of [1, -1]){ const pts = []; for (let k = 0; k <= 24; k++){ const t = k / 24; const a = dir * t * Math.PI * 1.4 + (dir > 0 ? 0 : Math.PI); const r = s * (1.5 - t * .45); pts.push(new THREE.Vector3(Math.cos(a) * r, top - .18 + t * .26, Math.sin(a) * r * el)); } const tube = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), low ? 30 : 60, .035, 8, false); g.add(new THREE.Mesh(tube, metal)); } }
  if (p.motif === 'chaton'){ const geo = new THREE.SphereGeometry(.07, 12, 10); for (let k = 0; k < 5; k++){ const m = new THREE.Mesh(geo, metal); m.position.copy(ring((k + .3) / 5, .92)).setY(top + .08); m.scale.set(1.3, .45, 1); m.lookAt(0, top + .08, 0); g.add(m); } }
  g.userData = { metal, stoneMat };
  return g;
}

/* --- Accueil --- */
const Hero = hasThree ? (() => {
  const canvas = $('#ring'), hero = $('#accueil');
  let renderer, scene, camera, ring, raf = 0, visible = true, blend = side === 'nina' ? 1 : 0, blendTarget = blend;
  const pointer = { x: 0, y: 0 }, cur = { rx: .5, ry: 0 }; let auto = 0, last = performance.now(), scrollP = 0;
  const COL = { nina: { metal: new THREE.Color(0xD6D2D8), stone: new THREE.Color(0xA3123C) }, mae: { metal: new THREE.Color(0xEBB29A), stone: new THREE.Color(0xF56E9A) } };
  const tmpA = new THREE.Color(), tmpB = new THREE.Color();
  function init(){
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: !mobile, alpha: true, powerPreference: 'high-performance' });
    } catch(e){ return false; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2));
    renderer.outputEncoding = THREE.sRGBEncoding; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
    scene = new THREE.Scene(); scene.environment = makeEnv(renderer);
    camera = new THREE.PerspectiveCamera(30, 1, .1, 50);
    ring = buildRing3D({ metal: 0xD6D2D8, stone: 0x8A1534, shape: 'ovale', motif: 'chaton', size: .32, ior: 1.77, seed: 3, gemEnv: makeGemEnv(renderer) }, mobile);
    scene.add(ring);
    const dl = new THREE.DirectionalLight(0xffffff, 1.2); dl.position.set(2, 4, 3); scene.add(dl);
    resize(); addEventListener('resize', resize);
    new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible) loop(); }, { threshold: 0 }).observe(hero);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) loop(); });
    hero.addEventListener('pointermove', e => { if (e.pointerType !== 'mouse') return; const r = hero.getBoundingClientRect(); pointer.x = (e.clientX - r.left) / r.width * 2 - 1; pointer.y = (e.clientY - r.top) / r.height * 2 - 1; });
    addEventListener('scroll', () => { scrollP = Math.min(1, scrollY / Math.max(1, hero.offsetHeight)); }, { passive: true });
    loop(); return true;
  }
  function resize(){
    const w = hero.clientWidth, h = hero.clientHeight;
    renderer.setSize(w, h, false); camera.aspect = w / h;
    const aspect = w / h, tanH = Math.tan(THREE.MathUtils.degToRad(15));
    const d = Math.max(8.2, 2.5 / (2 * tanH * aspect * .62));
    camera.position.set(0, .15, d); camera.lookAt(0, .05, 0); camera.updateProjectionMatrix();
    ring.position.y = aspect < .8 ? d * 2 * tanH * .06 : -.15;
  }
  function loop(){ if (raf) return; raf = requestAnimationFrame(frame); }
  function frame(now){
    raf = 0; if (!visible || document.hidden) return;
    const dt = Math.min(.05, (now - last) / 1000); last = now;
    if (!reduce) auto += dt * .35;
    const ty = auto + pointer.x * .9 + scrollP * (reduce ? 0 : 2.4);
    const tx = .55 + pointer.y * .25 + scrollP * (reduce ? 0 : .5);
    const k = reduce ? 1 : 1 - Math.pow(.002, dt);
    cur.ry += (ty - cur.ry) * k; cur.rx += (tx - cur.rx) * k;
    ring.rotation.set(cur.rx, cur.ry, 0);
    blend += (blendTarget - blend) * (reduce ? 1 : 1 - Math.pow(.01, dt));
    const u = ring.userData;
    u.metal.color.copy(tmpA.copy(COL.mae.metal).lerp(COL.nina.metal, blend));
    u.stoneMat.color.copy(tmpB.copy(COL.mae.stone).lerp(COL.nina.stone, blend)); u.stoneMat.emissive.copy(u.stoneMat.color);
    u.metal.roughness = .22 - blend * .1;
    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  }
  return { init, setBlend(v){ blendTarget = v; loop(); } };
})() : null;

/* --- Studio : un seul moteur pour les vignettes des fiches et la visionneuse --- */
const Studio = hasThree ? (() => {
  const canvas = document.createElement('canvas');
  canvas.setAttribute('role', 'img'); canvas.setAttribute('aria-label', 'Rendu 3D de la bague. Glissez pour la faire tourner.');
  const TH = mobile ? 320 : 460;
  let renderer, scene, camera, gemEnv, ok = null, jobs = [], pumping = false, viewing = false;
  const cache = new Map();
  const idle = window.requestIdleCallback ? (f) => requestIdleCallback(f, { timeout: 200 }) : (f) => setTimeout(f, 30);
  function init(){
    if (ok !== null) return ok;
    try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }); } catch(e){ return (ok = false); }
    renderer.outputEncoding = THREE.sRGBEncoding; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.1;
    scene = new THREE.Scene(); scene.environment = makeEnv(renderer); gemEnv = makeGemEnv(renderer);
    camera = new THREE.PerspectiveCamera(28, 1, .1, 50);
    const dl = new THREE.DirectionalLight(0xffffff, 1.1); dl.position.set(2, 4, 3); scene.add(dl);
    return (ok = true);
  }
  function make(r){
    const size = Math.max(.26, Math.min(.5, r.W * .06));
    return buildRing3D({ metal: METALS[r.metal].three, stone: r.stone.hex[1], shape: r.shape, motif: r.motif, size, ior: r.stone.ior, seed: (r.seed % 17) + 1, gemEnv }, mobile);
  }
  function dispose(obj){ obj.traverse(o => { if (o.geometry) o.geometry.dispose(); }); obj.userData.metal.dispose(); obj.userData.stoneMat.dispose(); }
  function shoot(r, kind, size){
    renderer.setPixelRatio(1); renderer.setSize(size || TH, size || TH, false);
    camera.aspect = 1; camera.position.set(0, .2, 5.7); camera.lookAt(0, .2, 0); camera.updateProjectionMatrix();
    const g = make(r); g.rotation.set(.95, -.5 + ((r.seed % 5) - 2) * .12, 0); g.position.y = -.2;
    if (kind === 'worn'){ camera.position.set(0, 0, 7); camera.lookAt(0, 0, 0); camera.updateProjectionMatrix(); g.rotation.set(Math.PI / 2, 0, 0); g.position.y = 0; }
    scene.add(g);
    renderer.render(scene, camera);
    let url = ''; try { url = canvas.toDataURL(size ? 'image/png' : 'image/webp', .9); } catch(e){}
    scene.remove(g); dispose(g); return url;
  }
  function pump(){
    if (viewing || !jobs.length){ pumping = false; return; }
    const job = jobs.shift();
    if (document.contains(job.el)){ let url = cache.get(job.key); if (url === undefined){ url = shoot(job.r, job.kind); cache.set(job.key, url); } job.done(url); }
    idle(pump);
  }
  function kick(){ if (!pumping && !viewing && jobs.length){ pumping = true; idle(pump); } }
  return {
    canvas,
    thumb(r, el, done, kind){ const key = (kind || '') + (r.nom || '') + r.seed; if (cache.has(key)){ done(cache.get(key)); return; } if (!init()) return; jobs.push({ r, el, done, key, kind }); kick(); },
    render(r, size, kind){ return init() && !viewing ? shoot(r, kind, size) : ''; },
    begin(){ if (!init()) return null; viewing = true; return { renderer, scene, camera, make, dispose }; },
    end(){ viewing = false; kick(); }
  };
})() : null;

/* --- Visionneuse de la fiche --- */
const Viewer = (() => {
  let ctx = null, ring = null, raf = 0, real = true, cur = null, drag = null, rot = { x: .7, y: 0 }, last = 0, bound = false;
  const mount = $('#v-3d');
  function apply(){
    if (!ring || !cur) return;
    const u = ring.userData;
    if (real){ u.metal.color.setHex(METALS[cur.metal].three); u.metal.metalness = 1; u.metal.roughness = .16; u.stoneMat.color.set(cur.stone.hex[1]); u.stoneMat.metalness = 1; }
    else { u.metal.color.setHex(0xEDE7E1); u.metal.metalness = .15; u.metal.roughness = .6; u.stoneMat.color.setHex(0xC8285A); u.stoneMat.metalness = .2; }
    u.stoneMat.emissive.copy(u.stoneMat.color);
  }
  function bind(canvas){
    if (bound) return; bound = true;
    canvas.addEventListener('pointerdown', e => { drag = { x: e.clientX, y: e.clientY, rx: rot.x, ry: rot.y }; canvas.setPointerCapture(e.pointerId); canvas.style.cursor = 'grabbing'; });
    canvas.addEventListener('pointermove', e => { if (!drag) return; rot.y = drag.ry + (e.clientX - drag.x) * .012; rot.x = Math.max(-.4, Math.min(1.5, drag.rx + (e.clientY - drag.y) * .01)); });
    const end = () => { drag = null; canvas.style.cursor = ''; }; canvas.addEventListener('pointerup', end); canvas.addEventListener('pointercancel', end);
  }
  function show(r){
    cur = r;
    if (!ctx) ctx = Studio && Studio.begin();
    if (!ctx){ mount.innerHTML = ringSVG(r, 'illu'); return; }
    if (Studio.canvas.parentNode !== mount){ mount.innerHTML = ''; mount.appendChild(Studio.canvas); bind(Studio.canvas); }
    if (ring){ ctx.scene.remove(ring); ctx.dispose(ring); }
    ring = ctx.make(r); ring.position.y = -.4; ctx.scene.add(ring); apply();
    rot = { x: .7, y: -.4 };
    requestAnimationFrame(() => {
      const w = mount.clientWidth, h = mount.clientHeight; if (!w || !h) return;
      ctx.renderer.setPixelRatio(Math.min(devicePixelRatio || 1, mobile ? 1.5 : 2)); ctx.renderer.setSize(w, h, false);
      ctx.camera.aspect = w / h; ctx.camera.position.set(0, .3, 7.2); ctx.camera.lookAt(0, .15, 0); ctx.camera.updateProjectionMatrix();
    });
    last = performance.now(); if (!raf) raf = requestAnimationFrame(frame);
  }
  function frame(now){
    raf = 0; if (!sheet.open || !ring) return;
    const dt = Math.min(.05, (now - last) / 1000); last = now;
    if (!drag && !reduce) rot.y += dt * .3;
    ring.rotation.set(rot.x, rot.y, 0); ctx.renderer.render(ctx.scene, ctx.camera);
    raf = requestAnimationFrame(frame);
  }
  return {
    show,
    stop(){ if (raf) cancelAnimationFrame(raf); raf = 0; if (ring && ctx){ ctx.scene.remove(ring); ctx.dispose(ring); ring = null; } if (ctx){ ctx = null; Studio.end(); } },
    setReal(v){ real = v; apply(); }
  };
})();

renderList(true);
if (Studio) $$('#models .model').forEach(li => { const m = MODELS[+li.dataset.k]; Studio.thumb(m.r, li, url => { if (!url) return; const img = li.querySelector('.render'); img.onload = () => li.querySelector('.model-art').classList.add('has-render'); img.src = url; }); });

if (!(Hero && Hero.init())){
  $('#ring').hidden = true;
  const fb = $('#ring-fallback'); fb.hidden = false;
  fb.innerHTML = ringSVG({ stone: STONES[1], shape: 'ovale', motif: 'chaton', metal: 'rose', L: 9, W: 6.7, seed: 7 }, 'illu');
}

/* ================= Lune et Soleil calculés (shaders WebGL) ================= */
const Sky = (() => {
  const NOISE = `precision highp float;
uniform vec2 uRes;
float hash(vec3 p){ p = fract(p * .3183099 + .1); p *= 17.; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float noise(vec3 x){ vec3 i = floor(x), f = fract(x); f = f * f * (3. - 2. * f);
  return mix(mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x), mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x), mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z); }
float fbm(vec3 p){ float a = .5, s = 0.; for (int i = 0; i < 5; i++){ s += a * noise(p); p *= 2.03; a *= .5; } return s; }
`;
  const MOON = NOISE + `uniform vec3 uLight;
vec3 hash3(vec3 p){ return fract(sin(vec3(dot(p, vec3(127.1,311.7,74.7)), dot(p, vec3(269.5,183.3,246.1)), dot(p, vec3(113.5,271.9,124.6)))) * 43758.5453); }
float craters(vec3 p){ vec3 i = floor(p), f = fract(p); float h = 0.;
  for (int x = -1; x <= 1; x++) for (int y = -1; y <= 1; y++) for (int z = -1; z <= 1; z++){
    vec3 g = vec3(float(x), float(y), float(z)); vec3 o = hash3(i + g);
    if (o.z > .42){ float rad = .16 + .3 * o.x * o.y; float d = length(g + o - f) / rad;
      float bowl = smoothstep(1., 0., d); float rim = exp(-pow((d - 1.) * 4., 2.));
      h += (-.7 * bowl * (2. - bowl) + .28 * rim) * rad * (.4 + .6 * o.y); } }
  return h; }
float height(vec3 p){ return craters(p * 2.2) * .9 + craters(p * 5. + 11.) * .5 + craters(p * 11. + 5.) * .28 + craters(p * 24. + 2.) * .12 + fbm(p * 6.) * .09; }
void main(){
  vec2 uv = (gl_FragCoord.xy / uRes) * 2. - 1.; uv /= .97; float r2 = dot(uv, uv);
  if (r2 > 1.){ gl_FragColor = vec4(0.); return; }
  vec3 n = vec3(uv, sqrt(1. - r2));
  vec3 t = normalize(cross(vec3(0., 1., 0.), n) + 1e-4), b = cross(n, t);
  float e = .0035, h0 = height(n), hx = height(normalize(n + t * e)), hy = height(normalize(n + b * e));
  vec3 nn = normalize(n - (t * (hx - h0) + b * (hy - h0)) / e * .16);
  float maria = smoothstep(.46, .6, fbm(n * 1.5 + vec3(3.1, 1.7, .4)));
  float alb = mix(.74, .3, maria) * (.72 + .5 * fbm(n * 5.) * (.6 + .8 * fbm(n * 22.))) + max(0., h0) * .9 + smoothstep(.62, .8, fbm(n * 3.3 + 9.)) * .1;
  float mu0 = max(dot(nn, uLight), 0.), mu = max(nn.z, .05);
  float lit = 2. * mu0 / (mu0 + mu) * smoothstep(-.04, .1, dot(n, uLight));
  vec3 col = vec3(alb) * vec3(1., .965, .93) * (lit * .95 + .03);
  float aa = smoothstep(1., .985, sqrt(r2));
  gl_FragColor = vec4(col * aa, aa);
}`;
  const SUN = NOISE + `uniform float uT;
void main(){
  vec2 uv = (gl_FragCoord.xy / uRes) * 2. - 1.; float r = length(uv) / .46;
  vec3 col = vec3(0.); float a = 0.;
  if (r < 1.02){ float rr = min(r, 1.); vec3 n = vec3(uv / .46, sqrt(1. - rr * rr));
    float ang = uT * .02; vec3 p = vec3(n.x * cos(ang) + n.z * sin(ang), n.y, -n.x * sin(ang) + n.z * cos(ang));
    float g = fbm(p * 16. + vec3(0., uT * .1, 0.)), g2 = fbm(p * 4. + vec3(uT * .03));
    float spots = smoothstep(.7, .78, fbm(p * 2.4 + 7.));
    float mu = n.z;
    vec3 c = mix(vec3(1., .74, .32), vec3(1., .97, .86), smoothstep(.34, .72, g * .6 + g2 * .5));
    c = mix(c, vec3(.96, .44, .14), pow(1. - mu, 1.6) * .8); c *= .5 + .62 * pow(mu, .5);
    c = mix(c, c * vec3(.5, .28, .16), spots * .75);
    col = c; a = 1.; }
  float d = max(r - 1., 0.); float th = atan(uv.y, uv.x); vec2 dir = vec2(cos(th), sin(th));
  float rays = .5 + .5 * noise(vec3(dir * 3.2, uT * .06)) * (.55 + .45 * noise(vec3(dir * 9., uT * .04 + 3.)));
  float cor = (exp(-d * 2.6) * rays * .8 + exp(-d * 11.) * .7) * smoothstep(1.15, .0, d);
  vec3 cc = mix(vec3(1., .6, .34), vec3(1., .9, .68), exp(-d * 5.));
  float edge = smoothstep(1.015, .99, r);
  col = mix(cc, col, edge); a = mix(clamp(cor, 0., 1.), 1., edge);
  gl_FragColor = vec4(col * a, a);
}`;
  function program(canvas, frag){
    let gl; try { gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false }); } catch(e){}
    if (!gl) return null;
    const mk = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null; };
    const vs = mk(gl.VERTEX_SHADER, 'attribute vec2 p; void main(){ gl_Position = vec4(p, 0., 1.); }'), fs = mk(gl.FRAGMENT_SHADER, frag);
    if (!vs || !fs) return null;
    const pr = gl.createProgram(); gl.attachShader(pr, vs); gl.attachShader(pr, fs); gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return null;
    gl.useProgram(pr);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer()); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U = {};
    return { draw(px, u){
      if (canvas.width !== px){ canvas.width = px; canvas.height = px; }
      gl.viewport(0, 0, px, px); gl.uniform2f(U.uRes || (U.uRes = gl.getUniformLocation(pr, 'uRes')), px, px);
      for (const k in u){ const l = U[k] || (U[k] = gl.getUniformLocation(pr, k)); const v = u[k]; if (typeof v === 'number') gl.uniform1f(l, v); else gl.uniform3f(l, v[0], v[1], v[2]); }
      gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); } };
  }
  const moonBox = $('.moon'), sunBox = $('.sun');
  const mc = document.createElement('canvas'), sc = document.createElement('canvas');
  const moon = program(mc, MOON), sun = program(sc, SUN);
  if (moon){ moonBox.appendChild(mc); moonBox.classList.add('is-live'); }
  if (sun){ sunBox.appendChild(sc); sunBox.classList.add('is-live'); }
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let phase = -1, wanted = .5, moonDue = false, heroOn = true, t0 = performance.now(), lastSun = 0, raf = 0;
  function drawMoon(){
    moonDue = false; if (!moon) return;
    const px = Math.min(mobile ? 520 : 960, Math.round(moonBox.clientWidth * dpr)) || 400;
    const a = 1.75 - 1.3 * wanted;                       // plus la nuit de Nina avance, plus la Lune est pleine
    moon.draw(px, { uLight: [Math.sin(a), .22, Math.cos(a)] }); phase = wanted;
  }
  function tick(now){
    raf = 0; if (!heroOn || document.hidden) return;
    if (sun && now - lastSun > (mobile ? 60 : 33)){ lastSun = now; const px = Math.min(mobile ? 420 : 760, Math.round(sunBox.clientWidth * dpr * .8)) || 320; sun.draw(px, { uT: (now - t0) / 1000 }); }
    if (!reduce && sun) raf = requestAnimationFrame(tick);
  }
  function start(){ if (!raf) raf = requestAnimationFrame(tick); }
  new IntersectionObserver(([en]) => { heroOn = en.isIntersecting; if (heroOn) start(); }).observe($('#accueil'));
  document.addEventListener('visibilitychange', () => { if (!document.hidden) start(); });
  addEventListener('resize', () => { if (!moonDue){ moonDue = true; requestAnimationFrame(drawMoon); } lastSun = 0; start(); });
  drawMoon(); start();
  return { setSplit(v){ wanted = v / 100; if (Math.abs(wanted - phase) > .015 && !moonDue){ moonDue = true; requestAnimationFrame(drawMoon); } } };
})();

/* ================= Ligne de partage ================= */
const heroEl = $('#accueil'), handle = $('#split-handle');
let split = 50;
function setSplit(v, animate){
  v = Math.max(0, Math.min(100, v));
  const applyV = (x) => { split = x; heroEl.style.setProperty('--split-pct', x + '%'); handle.setAttribute('aria-valuenow', String(Math.round(x))); handle.setAttribute('aria-valuetext', x > 60 ? 'Surtout Nina' : x < 40 ? 'Surtout Maëline' : 'Moitié Nina, moitié Maëline'); if (Hero) Hero.setBlend(x / 100); Sky.setSplit(x); };
  if (animate && G && !reduce){ const o = { v: split }; G.to(o, { v, duration: .9, ease: 'power3.inOut', onUpdate: () => applyV(o.v) }); }
  else applyV(v);
}
function heroForSide(animate){ setSplit(mobile ? (side === 'nina' ? 100 : 0) : 50, animate); }
heroForSide(false);
let dragging = false;
handle.addEventListener('pointerdown', e => { if (mobile) return; dragging = true; handle.setPointerCapture(e.pointerId); });
handle.addEventListener('pointermove', e => { if (!dragging) return; const r = heroEl.getBoundingClientRect(); setSplit((e.clientX - r.left) / r.width * 100); });
const endDrag = () => {
  if (!dragging) return; dragging = false;
  if (split > 85) goTo('nina', { from: handle, scroll: '#contenu' });
  else if (split < 15) goTo('maeline', { from: handle, scroll: '#contenu' });
};
handle.addEventListener('pointerup', endDrag); handle.addEventListener('pointercancel', endDrag);
handle.addEventListener('keydown', e => {
  const step = e.shiftKey ? 20 : 5; let v = null;
  if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') v = split - step;
  if (e.key === 'ArrowRight' || e.key === 'ArrowUp') v = split + step;
  if (e.key === 'Home') v = 0; if (e.key === 'End') v = 100;
  if (e.key === 'Enter'){ goTo(split >= 50 ? 'nina' : 'maeline', { from: handle, scroll: '#contenu' }); e.preventDefault(); return; }
  if (v !== null){ e.preventDefault(); setSplit(v); }
});
$$('.hs').forEach(el => el.addEventListener('focusin', () => { if (!mobile && (split > 80 || split < 20)) setSplit(50, true); }));

/* ================= Histoire : l'éclipse suit le défilement ================= */
const Story = (() => {
  const st = $('#histoire'), moon = $('.st-moon', st), cor = $('.st-corona', st), night = $('.st-night', st), dia = $('.st-diamond', st), ring = $('.st-ring', st), sunEl = $('.st-sun', st);
  const dots = $$('.story-dots i', st), lists = $$('.chapters', st);
  let p = 1, idx = -1;
  const ss = (x) => { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); };
  function set(v){
    p = v;
    const e = ss(p / .6);
    moon.style.transform = `translate(${(-155 * (1 - e)).toFixed(2)}%, ${(-36 * (1 - e)).toFixed(2)}%)`;
    night.style.opacity = (side === 'nina' ? .5 + .45 * e : e * .95).toFixed(3);
    cor.style.opacity = ss((p - .5) / .14).toFixed(3);
    const d = ss((p - .56) / .1), fade = ss((p - .8) / .15);
    dia.style.opacity = (d * (1 - fade * .25)).toFixed(3);
    dia.style.transform = `translate(-50%,-50%) scale(${(.5 + .5 * d + .5 * ss((p - .62) / .1) * (1 - fade)).toFixed(3)})`;
    ring.style.opacity = fade.toFixed(3);
    sunEl.style.opacity = (1 - fade * .9).toFixed(3);
    const i = Math.min(3, Math.floor(p * 4 + .001));
    if (i !== idx){ idx = i; lists.forEach(l => Array.from(l.children).forEach((li, k) => li.classList.toggle('is-on', k === i))); dots.forEach((dot, k) => dot.classList.toggle('is-on', k <= i)); }
  }
  if (G && window.ScrollTrigger && !reduce && !mobile){
    st.classList.add('is-pinned'); set(0);
    window.ScrollTrigger.create({ trigger: st, start: 'top top', end: 'bottom bottom', scrub: true, onUpdate: self => set(self.progress) });
  } else {
    lists.forEach(l => Array.from(l.children).forEach(li => li.classList.add('is-on'))); set(1);
    lists.forEach(l => Array.from(l.children).forEach(li => li.classList.add('is-on')));
  }
  return { refresh(){ const pinned = st.classList.contains('is-pinned'); const keep = idx; idx = -1; set(p); if (!pinned) lists.forEach(l => Array.from(l.children).forEach(li => li.classList.add('is-on'))); } };
})();

/* ================= Transition entre les univers ================= */
const eclipse = $('#eclipse');
let busy = false;
function applySide(s){
  side = s; root.dataset.side = s; store.set('singulier-side', s);
  $$('.switch-btn').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.go === s)));
  const meta = document.querySelector('meta[name="theme-color"]'); if (meta) meta.content = s === 'nina' ? '#2B0202' : '#FFF4EF';
  const other = s === 'nina' ? 'maeline' : 'nina';
  const door = $('#door');
  door.innerHTML = `<svg aria-hidden="true"><use href="#${other === 'nina' ? 'i-lune' : 'i-soleil'}"/></svg><span>Passer côté ${other === 'nina' ? 'Nina' : 'Maëline'}</span>`;
  door.dataset.go = other;
  const bas = $('#bascule'); bas.querySelector('use').setAttribute('href', other === 'nina' ? '#i-lune' : '#i-soleil'); bas.querySelector('span').textContent = `Basculer côté ${other === 'nina' ? 'Nina' : 'Maëline'}`; bas.dataset.go = other;
  heroForSide(true);
  Story.refresh();
  Sound.swap();
  if (window.ScrollTrigger) requestAnimationFrame(() => window.ScrollTrigger.refresh());
}
function scrollToSel(sel){ const t = sel && $(sel); if (!t) return; t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); if (sel === '#contenu') t.focus({ preventScroll: true }); }
function goTo(s, opt = {}){
  if (busy) return;
  if (s === side){ heroForSide(true); scrollToSel(opt.scroll); return; }
  busy = true;
  const r = opt.from ? opt.from.getBoundingClientRect() : { left: innerWidth / 2, top: innerHeight / 2, width: 0, height: 0 };
  const x = ((r.left + r.width / 2) / innerWidth * 100).toFixed(1) + '%', y = ((r.top + r.height / 2) / innerHeight * 100).toFixed(1) + '%';
  eclipse.dataset.to = s; eclipse.querySelector('.ec-word').textContent = s === 'nina' ? 'Nina' : 'Maëline';
  Sound.chime();
  const done = () => { busy = false; };
  if (!G){ applySide(s); scrollToSel(opt.scroll); done(); return; }
  if (reduce){
    G.set(eclipse, { visibility: 'visible', clipPath: 'circle(150% at 50% 50%)', opacity: 0 });
    G.timeline({ onComplete: () => { G.set(eclipse, { visibility: 'hidden', opacity: 1, clipPath: 'circle(0% at 50% 50%)' }); done(); } })
      .to(eclipse, { opacity: 1, duration: .15 })
      .add(() => { applySide(s); scrollToSel(opt.scroll); })
      .to(eclipse, { opacity: 0, duration: .2 });
    return;
  }
  const disc = eclipse.querySelector('.ec-disc'), word = eclipse.querySelector('.ec-word');
  const dur = mobile ? .55 : .75;
  G.set(eclipse, { visibility: 'visible', opacity: 1, clipPath: `circle(0% at ${x} ${y})` });
  G.set(disc, { scale: .3, xPercent: s === 'nina' ? 60 : -60, opacity: 1 });
  G.set(word, { opacity: 0, y: 20 });
  G.timeline({ onComplete: () => { G.set(eclipse, { visibility: 'hidden', clearProps: 'clipPath' }); done(); } })
    .to(eclipse, { clipPath: `circle(150% at ${x} ${y})`, duration: dur, ease: 'power3.inOut' })
    .to(disc, { scale: 1, xPercent: 0, duration: dur, ease: 'power3.out' }, '<.1')
    .to(word, { opacity: 1, y: 0, duration: .4, ease: 'power2.out' }, '<.25')
    .add(() => { applySide(s); scrollToSel(opt.scroll); })
    .to(eclipse, { opacity: 0, duration: .45, ease: 'power1.out' }, '+=.15');
}
document.addEventListener('click', e => {
  const b = e.target.closest('[data-go]'); if (!b) return;
  goTo(b.dataset.go, { from: b, scroll: b.dataset.scroll || null });
});
applySide(side);

/* Porte : masquée sur l'accueil */
const door = $('#door');
new IntersectionObserver(([en]) => { door.classList.toggle('is-away', en.isIntersecting); $('#top').classList.toggle('is-solid', !en.isIntersecting); }, { rootMargin: '-80px 0px 0px 0px' }).observe(heroEl);

/* ================= Curseur personnalisé ================= */
const Cursor = (() => {
  const el = $('#cursor'), ringEl = $('.c-ring', el), dotEl = $('.c-dot', el), label = $('.c-label', el);
  let active = false, qx, qy, rx, ry;
  const topLayer = typeof el.showPopover === 'function';
  if (topLayer) el.setAttribute('popover', 'manual');
  /* Chaque fenêtre ouverte passe au sommet de la couche supérieure : on y remet le curseur juste après */
  function raise(){ if (!topLayer || !active) return; try { if (el.matches(':popover-open')) el.hidePopover(); el.showPopover(); } catch(e){} }
  if (topLayer) ['showModal', 'show'].forEach(k => { const f = HTMLDialogElement.prototype[k]; HTMLDialogElement.prototype[k] = function(){ const r = f.apply(this, arguments); raise(); return r; }; });
  function enable(){
    if (active || !mqFine.matches) return; active = true; root.classList.add('has-cursor'); raise();
    if (G && !reduce){ qx = G.quickTo(ringEl, 'x', { duration: .45, ease: 'power3' }); qy = G.quickTo(ringEl, 'y', { duration: .45, ease: 'power3' }); }
  }
  function disable(){ active = false; root.classList.remove('has-cursor'); if (topLayer && el.matches(':popover-open')) el.hidePopover(); }
  addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse') return; if (!active) enable(); if (!active) return;
    dotEl.style.transform = `translate(${e.clientX}px,${e.clientY}px)`;
    if (qx){ qx(e.clientX); qy(e.clientY); } else ringEl.style.transform = `translate(${e.clientX}px,${e.clientY}px)`;
    const t = e.target.closest ? e.target : null;
    const field = t && t.closest('input, textarea, select');
    el.classList.toggle('is-hidden', !!field);
    const hit = t && t.closest('.card-stage, .split-handle, [data-go], .btn, .chip, a, button, label');
    el.classList.toggle('is-hover', !!(hit && (hit.matches('.card-stage, .split-handle') )));
    label.textContent = hit ? (hit.matches('.card-stage') ? 'Ouvrir' : hit.matches('.split-handle') ? 'Glisser' : '') : '';
    ringEl.style.width = '';
    if (hit && !hit.matches('.card-stage, .split-handle')) ringEl.style.opacity = '.5'; else ringEl.style.opacity = '';
  }, { passive: true });
  document.addEventListener('mouseleave', () => el.classList.add('is-hidden'));
  document.addEventListener('mouseenter', () => el.classList.remove('is-hidden'));
  mqFine.addEventListener && mqFine.addEventListener('change', () => mqFine.matches ? null : disable());
  return { reset(){ disable(); } };
})();

/* ================= Apparitions au défilement ================= */
function splitWords(el){
  const walk = (node) => {
    Array.from(node.childNodes).forEach(n => {
      if (n.nodeType === 3){
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(part => { if (!part) return; if (/^\s+$/.test(part)){ frag.appendChild(document.createTextNode(part)); return; } const w = document.createElement('span'); w.className = 'w'; const i = document.createElement('span'); i.textContent = part; w.appendChild(i); frag.appendChild(w); });
        n.replaceWith(frag);
      } else if (n.nodeType === 1) walk(n);
    });
  };
  walk(el); el.classList.add('split-words');
}
function setupReveals(){
  if (!G || !window.ScrollTrigger || reduce) return;
  $$('[data-split]').forEach(el => {
    if (!mobile) splitWords(el);
    const targets = mobile ? el : el.querySelectorAll('.w > span');
    G.from(targets, { yPercent: mobile ? 0 : 110, opacity: mobile ? 0 : 1, y: mobile ? 16 : 0, duration: mobile ? .6 : 1, ease: 'power4.out', stagger: .06, scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
  });
  $$('[data-reveal]').forEach(el => {
    G.from(el, { opacity: 0, y: mobile ? 12 : 28, duration: mobile ? .5 : .9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
  });
  if (!mobile){
    G.to('.moon', { yPercent: 18, ease: 'none', scrollTrigger: { trigger: heroEl, start: 'top top', end: 'bottom top', scrub: true } });
    G.to('.sun', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: heroEl, start: 'top top', end: 'bottom top', scrub: true } });
    G.to('.ht', { yPercent: -30, ease: 'none', scrollTrigger: { trigger: heroEl, start: 'top top', end: 'bottom top', scrub: true } });
  }
}
function heroIntro(){
  if (!G || reduce) return;
  G.from('.ht', { opacity: 0, y: 40, duration: 1.4, ease: 'power3.out', delay: .1 });
  G.from('.hs', { opacity: 0, y: 20, duration: 1, ease: 'power3.out', delay: .5, stagger: .1 });
  G.from('.split-line', { scaleY: 0, transformOrigin: '50% 50%', duration: 1.2, ease: 'power3.inOut', delay: .2 });
}
heroIntro(); setupReveals();

/* ================= Formulaire ================= */
const form = $('#raconter');
const isShopForm = (f) => !!f.querySelector('input[name="form_type"]');   // formulaire rendu par Shopify (thème de la boutique)
[form, $('#news-form')].forEach(f => { f.noValidate = true; });   // la validation est faite par le site
form.addEventListener('submit', e => {
  const checks = [
    ['f-prenom', 'e-prenom', v => v.trim().length > 0],
    ['f-email', 'e-email', v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())],
    ['f-histoire', 'e-histoire', v => v.trim().split(/\s+/).filter(Boolean).length >= 3]
  ];
  let firstBad = null;
  checks.forEach(([id, err, ok]) => { const f = $('#' + id), good = ok(f.value); f.setAttribute('aria-invalid', String(!good)); $('#' + err).hidden = good; if (!good && !firstBad) firstBad = f; });
  const status = $('#form-status');
  if (firstBad){ e.preventDefault(); status.hidden = true; firstBad.focus(); return; }
  status.hidden = false;
  const prenom = $('#f-prenom').value.trim();
  if (isShopForm(form)){
    /* Le formulaire part tel quel vers Shopify, qui l'envoie à l'adresse de contact de la boutique. La protection anti-spam de Shopify s'applique. */
    $('#f-pierres').value = $$('input[name="pierres"]:checked').map(i => i.value).join(', ') || 'non précisé';
    try { sessionStorage.setItem('sg-sent', 'contact'); } catch(err){}
    const nImg = ($('#f-inspi-img').files || []).length;
    status.textContent = `Envoi de votre histoire en cours…${nImg ? ' Les images ne passent pas par ce formulaire : envoyez-les en réponse à notre premier e-mail.' : ''}`;
    return;
  }
  e.preventDefault();
  if (Live.on){
    const pierres = $$('input[name="pierres"]:checked').map(i => i.value).join(', ') || 'non précisé';
    const nImg = ($('#f-inspi-img').files || []).length;
    postToShop({ form_type: 'contact', 'contact[name]': prenom, 'contact[email]': $('#f-email').value.trim(), 'contact[Demande]': 'Bague sur mesure',
      'contact[body]': `Histoire : ${$('#f-histoire').value.trim()}\n\nPierres souhaitées : ${pierres}\nMétal préféré : ${$('#f-metal').value}\nInspirations : ${$('#f-inspi').value.trim() || 'aucune'}${nImg ? `\nImages d'inspiration : ${nImg} (à envoyer en réponse à notre e-mail)` : ''}` });
    status.textContent = `Envoi de votre histoire en cours…${nImg ? ' Les images ne passent pas par ce formulaire : envoyez-les en réponse à notre premier e-mail.' : ''}`;
  } else status.textContent = `Merci ${prenom}. Ce formulaire est une démonstration : il n'est pas encore relié à une boîte mail, donc votre histoire n'a pas été envoyée.`;
  Sound.chime();
});
$$('#raconter input, #raconter textarea').forEach(f => f.addEventListener('input', () => { if (f.getAttribute('aria-invalid') === 'true'){ f.removeAttribute('aria-invalid'); const err = $('#e-' + f.id.slice(2)); if (err) err.hidden = true; } }));

/* ================= Documents légaux ================= */
const legal = $('#legal');
const DOCS = { 'cgv': ['Conditions générales de vente', 'doc-cgv'], 'mentions-legales': ['Mentions légales', 'doc-mentions'], 'confidentialite': ['Politique de confidentialité', 'doc-conf'], 'cadre-legal': ['Lois et obligations', 'doc-lois'], 'cookies': ['Cookies', 'doc-cookies'] };
let legalOpener = null;
function openDoc(id, opener){
  const d = DOCS[id]; if (!d) return;
  legalOpener = opener || null;
  $('#legal-title').textContent = d[0];
  const body = $('#legal-body'); body.innerHTML = ''; body.appendChild($('#' + d[1]).content.cloneNode(true));
  if (id === 'cookies'){ const c = cookieChoice(); $('#ck-audience').checked = !!(c && c.audience); }
  if (!legal.open) legal.showModal();
  legal.scrollTop = 0;
}
document.addEventListener('click', e => { const a = e.target.closest('[data-doc]'); if (!a) return; e.preventDefault(); openDoc(a.dataset.doc, a); try { history.replaceState(null, '', '#' + a.dataset.doc); } catch(err){} });
$('#legal-close').addEventListener('click', () => legal.close());
legal.addEventListener('click', e => { if (e.target === legal) legal.close(); });
legal.addEventListener('close', () => { try { history.replaceState(null, '', location.pathname + location.search); } catch(err){} if (legalOpener && document.contains(legalOpener)) legalOpener.focus(); });
if (DOCS[location.hash.slice(1)]) openDoc(location.hash.slice(1));
addEventListener('hashchange', () => { const id = location.hash.slice(1); if (DOCS[id]) openDoc(id); });

/* ================= Boutique : favoris, panier, compte ================= */
const PLURIEL_OPT = { g: 3.4, h: [4, 7] };
function itemOf(id){
  const n = +id.slice(1);
  if (id[0] === 'f'){ const r = RINGS[n]; return r ? { id, r, nom: r.nom, spec: `${stoneLine(r)} · ${METALS[r.metal].nom}`, prix: r.prix, kind: 'Flash, pièce unique' } : null; }
  const m = MODELS[n]; return m ? { id, r: m.r, nom: m.nom, spec: METALS[m.r.metal].nom, prix: priceOf(m.r, PLURIEL_OPT), kind: 'Collection Pluriel' } : null;
}
function itemOfHandle(h){ const m = /^flash-(\d{2})$/.exec(h); if (m) return itemOf('f' + (+m[1] - 1)); const k = MODELS_NAMES.findIndex(n => 'pluriel-' + Live.slug(n) === h); return k >= 0 ? itemOf('p' + k) : null; }
const toastEl = $('#toast'); let toastT = 0;
function toast(msg){ toastEl.textContent = msg; toastEl.classList.add('is-on'); clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove('is-on'), 2800); }
const miniHTML = (it) => `<span class="mini" data-mini="${it.id}">${ringSVG(it.r, 'illu')}<img alt=""></span>`;
function hydrateMinis(box){ if (!Studio) return; $$('[data-mini]', box).forEach(el => { const it = itemOf(el.dataset.mini); Studio.thumb(it.r, el, url => { if (url) el.querySelector('img').src = url; }); }); }
const accountDlg = $('#account'), cartDlg = $('#cart');
let accTab = 'profil', authTab = 'login', liveCart = null, cartBusy = false;

function refreshPrices(){
  if (F.prix || F.tri.startsWith('prix')) renderList(true);   // le tri et le filtre prennent les prix boutique dès qu'ils arrivent
  $$('[data-price]').forEach(el => { const id = el.dataset.price, it = itemOf(id); if (it) el.innerHTML = priceInner(id, it.prix); });
  $$('[data-add]').forEach(b => { const p = liveProduct(b.dataset.add); const sold = !!(p && !p.availableForSale); b.disabled = sold; if (sold) b.textContent = 'Vendue'; });
  if (sheet.open) fillSheet();
}
function cartCount(){ return Live.on ? (liveCart ? liveCart.totalQuantity : 0) : shop.cart.length; }
function syncShop(){
  saveShop();
  const n = cartCount(), badge = $('#cart-count');
  badge.hidden = !n; badge.textContent = n;
  $('#btn-cart').setAttribute('aria-label', n ? `Mon panier, ${n} article${n > 1 ? 's' : ''}` : 'Mon panier, vide');
  $$('[data-fav]').forEach(b => b.setAttribute('aria-pressed', String(shop.fav.includes(b.dataset.fav))));
  if (cartDlg.open) renderCart();
  if (accountDlg.open) renderAccount();
}

/* --- Panier Shopify --- */
const CART_FIELDS = `id checkoutUrl totalQuantity cost{ totalAmount{ amount currencyCode } } lines(first: 50){ nodes{ id quantity cost{ totalAmount{ amount } } merchandise{ ... on ProductVariant{ id title product{ handle title } } } } }`;
/* Sur la boutique elle-même (bijouteriesingulier.com), le site utilise le panier natif de Shopify :
   un seul panier partagé avec les fiches produit, les collections et la page panier de la boutique. */
const Native = (() => {
  const on = !!(Live.on && window.Shopify && window.Shopify.shop && location.hostname === Live.domain);
  const root = (window.Shopify && window.Shopify.routes && window.Shopify.routes.root) || '/';
  const shape = (c) => ({ id: 'native', checkoutUrl: root + 'checkout', totalQuantity: c.item_count, cost: { totalAmount: { amount: String(c.total_price / 100), currencyCode: c.currency } },
    lines: { nodes: c.items.map(i => ({ id: i.key, quantity: i.quantity, cost: { totalAmount: { amount: String(i.final_line_price / 100) } },
      merchandise: { id: 'gid://shopify/ProductVariant/' + i.variant_id, title: i.variant_title || 'Default Title', product: { handle: i.handle, title: i.product_title } } })) } });
  async function call(path, body){
    const r = await fetch(root + path, body ? { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(body) } : { headers: { Accept: 'application/json' } });
    if (!r.ok){ let m = 'panier'; try { m = (await r.json()).description || m; } catch(e){} throw new Error(m); }
    return r.json();
  }
  return {
    on,
    get: async () => shape(await call('cart.js')),
    add: async (variantGid) => { await call('cart/add.js', { items: [{ id: +String(variantGid).split('/').pop(), quantity: 1 }] }); return shape(await call('cart.js')); },
    remove: async (key) => shape(await call('cart/change.js', { id: key, quantity: 0 }))
  };
})();
async function loadLiveCart(){
  if (Native.on){ try { liveCart = await Native.get(); } catch(e){ liveCart = null; } syncShop(); return; }
  if (!Live.on || !shop.cartId) return;
  try { const d = await Live.gql(`query C($id: ID!){ cart(id: $id){ ${CART_FIELDS} } }`, { id: shop.cartId }); liveCart = d.cart; if (!liveCart){ shop.cartId = ''; } } catch(e){ liveCart = null; }
  syncShop();
}
function pickVariant(id){
  const p = liveProduct(id); if (!p) return null;
  const vs = p.variants.nodes.filter(v => v.availableForSale);
  if (id[0] === 'p'){ const k = id.slice(1), sz = ($(`input[name="taille-${k}"]:checked`) || {}).value; return vs.find(v => v.selectedOptions.some(o => o.value === sz)) || null; }
  return vs[0] || null;
}
async function liveAdd(id, it){
  await Live.ready.catch(() => {});
  const p = liveProduct(id);
  if (!p){ toast(`${it.nom} n'est pas encore en vente sur la boutique.`); return; }
  const v = pickVariant(id);
  if (!v){ toast(p.availableForSale ? 'Cette taille est épuisée. Choisissez-en une autre.' : `${it.nom} a déjà trouvé sa propriétaire.`); return; }
  if (liveCart && liveCart.lines.nodes.some(l => l.merchandise.id === v.id && id[0] === 'f')){ toast(`${it.nom} est déjà dans votre panier.`); return; }
  if (cartBusy) return; cartBusy = true;
  try {
    if (Native.on){ liveCart = await Native.add(v.id); syncShop(); toast(`${it.nom} ajoutée au panier.`); Sound.tick(); cartBusy = false; return; }
    const lines = [{ merchandiseId: v.id, quantity: 1 }];
    const create = async () => (await Live.gql(`mutation N($lines: [CartLineInput!]){ cartCreate(input: { lines: $lines }){ cart{ ${CART_FIELDS} } userErrors{ message } } }`, { lines })).cartCreate;
    let res = shop.cartId ? (await Live.gql(`mutation A($id: ID!, $lines: [CartLineInput!]!){ cartLinesAdd(cartId: $id, lines: $lines){ cart{ ${CART_FIELDS} } userErrors{ message } } }`, { id: shop.cartId, lines })).cartLinesAdd : await create();
    if (!res.cart && shop.cartId){ shop.cartId = ''; liveCart = null; res = await create(); }   // panier expiré ou payé : on en ouvre un neuf
    if (res.userErrors.length || !res.cart) throw new Error((res.userErrors[0] || {}).message || 'panier');
    liveCart = res.cart; shop.cartId = liveCart.id; syncShop(); toast(`${it.nom} ajoutée au panier.`); Sound.tick();
  } catch(e){ toast('Le panier n\'a pas pu être mis à jour. Réessayez dans un instant.'); }
  cartBusy = false;
}
async function liveRemove(lineId){
  if (Native.on){ try { liveCart = await Native.remove(lineId); syncShop(); } catch(e){ toast('Impossible de retirer cet article pour le moment.'); } return; }
  try { const d = await Live.gql(`mutation R($id: ID!, $ids: [ID!]!){ cartLinesRemove(cartId: $id, lineIds: $ids){ cart{ ${CART_FIELDS} } userErrors{ message } } }`, { id: shop.cartId, ids: [lineId] }); liveCart = d.cartLinesRemove.cart; syncShop(); }
  catch(e){ toast('Impossible de retirer cet article pour le moment.'); }
}
function addToCart(id){
  const it = itemOf(id); if (!it) return;
  if (Live.on){ liveAdd(id, it); return; }
  if (shop.cart.some(c => c.id === id)){ toast(`${it.nom} est déjà dans votre panier.`); return; }
  const k = id[0] === 'p' ? ($(`input[name="taille-${id.slice(1)}"]:checked`) || {}).value : '';
  shop.cart.push({ id, size: k || (shop.user && shop.user.taille) || '' }); syncShop(); toast(`${it.nom} ajoutée au panier.`); Sound.tick();
}
const sizeOpts = (v) => `<option value="">Taille à définir</option>` + SIZES.map(s => `<option value="${s}"${String(v) === String(s) ? ' selected' : ''}>Taille ${s}</option>`).join('');
const perks = (lo, hi) => `<ul class="perks">
      <li><strong>Livraison offerte</strong> en France métropolitaine, en envoi assuré remis contre signature.</li>
      <li><strong>Paiement en 3 fois sans frais avec Klarna :</strong> 3 × ${hi == null ? eur(Math.round(lo / 3)) : Math.round(lo / 3).toLocaleString('fr-FR') + ' à ' + eur(Math.round(hi / 3))}, sous réserve d'acceptation par Klarna.</li>
      <li><strong>Retour sous 14 jours</strong> pour les bagues Flash et Pluriel non gravées.</li>
    </ul>`;
function renderCart(){
  const box = $('#cart-body');
  if (Live.on){
    const lines = liveCart ? liveCart.lines.nodes : [];
    if (!lines.length){ box.innerHTML = '<p class="empty">Votre panier est vide. Parcourez les bagues Flash ou la collection Pluriel pour y ajouter une pièce.</p><a class="btn btn-main" href="#flash" data-close>Voir les bagues Flash</a>'; return; }
    const total = +liveCart.cost.totalAmount.amount;
    box.innerHTML = `<ul class="lines">${lines.map(l => { const it = itemOfHandle(l.merchandise.product.handle) || { id: '', nom: l.merchandise.product.title, kind: '', r: null }; const size = l.merchandise.title !== 'Default Title' ? l.merchandise.title : '';
        return `<li class="line">${it.r ? miniHTML(it) : '<span class="mini"></span>'}<div><h4>${esc(it.nom)}</h4><p>${it.kind}${size ? ' · ' + esc(size) : ''}</p><p class="p">${eur(+l.cost.totalAmount.amount)}</p></div><div class="line-btns"><button type="button" class="txt-btn" data-rmline="${l.id}">Retirer</button></div></li>`; }).join('')}</ul>
      ${perks(total)}
      <p class="total"><span>Total</span><b>${eur(total)}</b></p>
      <a class="btn btn-main" href="${esc(liveCart.checkoutUrl)}">Passer au paiement sécurisé</a>
      <p class="fine">Le paiement se fait sur la page sécurisée de Shopify : carte bancaire, Apple Pay ou Klarna en 3 fois sans frais.</p>`;
    hydrateMinis(box); return;
  }
  const items = shop.cart.map(c => ({ c, it: itemOf(c.id) })).filter(x => x.it);
  if (!items.length){ box.innerHTML = '<p class="empty">Votre panier est vide. Parcourez les bagues Flash ou la collection Pluriel pour y ajouter une pièce.</p><a class="btn btn-main" href="#flash" data-close>Voir les bagues Flash</a>'; return; }
  const lo = items.reduce((a, x) => a + x.it.prix[0], 0), hi = items.reduce((a, x) => a + x.it.prix[1], 0);
  box.innerHTML = `<ul class="lines">${items.map(({ c, it }) => `<li class="line">${miniHTML(it)}
      <div><h4>${it.nom}</h4><p>${it.kind}</p><p>${it.spec}</p><p class="p">${priceTxt(it.prix)}</p>
        <label class="sr-only" for="sz-${it.id}">Taille de doigt pour ${it.nom}</label><select id="sz-${it.id}" data-size="${it.id}">${sizeOpts(c.size)}</select></div>
      <div class="line-btns"><button type="button" class="txt-btn" data-rm="${it.id}">Retirer</button></div></li>`).join('')}</ul>
    ${perks(lo, hi)}
    <p class="total"><span>Total estimé</span><b>${priceTxt([lo, hi])}</b></p>
    <button type="button" class="btn btn-main" id="cart-go">Envoyer ma demande de réservation</button>
    <p class="fine">La boutique en ligne n'est pas encore branchée : cette demande ne débite rien. Le prix ferme figure sur le devis que Singulier vous envoie ensuite.</p>`;
  hydrateMinis(box);
}
function placeOrder(){
  if (!shop.logged){ cartDlg.close(); openAccount(); toast('Connectez-vous ou créez un compte pour envoyer votre demande.'); return; }
  const items = shop.cart.map(c => ({ id: c.id, size: c.size })); if (!items.length) return;
  const prix = shop.cart.reduce((a, c) => { const p = itemOf(c.id).prix; return [a[0] + p[0], a[1] + p[1]]; }, [0, 0]);
  const ref = 'SG-' + Date.now().toString(36).toUpperCase().slice(-6);
  shop.orders.unshift({ ref, date: new Date().toLocaleDateString('fr-FR'), items, prix }); shop.cart = [];
  accTab = 'commandes'; syncShop(); cartDlg.close(); openAccount(); toast(`Demande ${ref} enregistrée.`); Sound.chime();
}
function favsHTML(){
  const favs = shop.fav.map(itemOf).filter(Boolean);
  return favs.length ? `<ul class="lines">${favs.map(it => `<li class="line">${miniHTML(it)}<div><h4>${it.nom}</h4><p>${it.kind}</p><p class="p" data-price="${it.id}">${priceInner(it.id, it.prix)}</p></div><div class="line-btns"><button type="button" class="txt-btn" data-add="${it.id}">Au panier</button><button type="button" class="txt-btn" data-fav="${it.id}" aria-pressed="true">Retirer</button></div></li>`).join('')}</ul>` : '<p class="empty">Touchez le cœur d\'une bague pour la retrouver ici.</p>';
}
function renderAccount(){
  const box = $('#account-body'), demo = '<p class="notice"><svg aria-hidden="true"><use href="#i-info"/></svg><span>Démonstration : le compte est enregistré dans ce navigateur seulement. Le mot de passe n\'est ni vérifié ni conservé.</span></p>';
  if (Live.on){
    box.innerHTML = `<p class="lead" style="margin:0">Votre espace client</p>
      <p class="fine">Connexion, création de compte, profil, adresses et suivi des commandes se gèrent sur votre compte client sécurisé Singulier, hébergé par Shopify.</p>
      <div class="btn-row"><a class="btn btn-main" href="${esc(Live.accountUrl)}">Se connecter ou créer un compte</a><a class="btn btn-line" href="${esc(Live.accountUrl)}">Mes commandes</a></div>
      <h3 class="chapter-n" style="margin:12px 0 0">Mes favoris</h3>${favsHTML()}<p class="fine">Vos favoris restent enregistrés dans ce navigateur.</p>`;
    hydrateMinis(box); return;
  }
  if (!shop.logged){
    const login = authTab === 'login';
    box.innerHTML = `<div class="tabs" role="tablist"><button type="button" role="tab" aria-selected="${login}" data-auth="login">Se connecter</button><button type="button" role="tab" aria-selected="${!login}" data-auth="signup">Créer un compte</button></div>
      <form class="stack" id="auth-form" novalidate>
        ${login ? '' : `<div class="field"><label for="a-prenom">Prénom</label><input id="a-prenom" autocomplete="given-name" required></div><div class="field"><label for="a-nom">Nom</label><input id="a-nom" autocomplete="family-name" required></div>`}
        <div class="field"><label for="a-email">E-mail</label><input id="a-email" type="email" inputmode="email" autocomplete="email" required></div>
        <div class="field"><label for="a-pass">Mot de passe</label><input id="a-pass" type="password" autocomplete="${login ? 'current-password' : 'new-password'}" minlength="8" required aria-describedby="a-pass-h"><p class="help" id="a-pass-h">Au moins 8 caractères.</p></div>
        ${login ? '' : `<label class="check"><input type="checkbox" id="a-cgv" required><span>J'accepte les <a href="#cgv" data-doc="cgv">conditions générales de vente</a>.</span></label><label class="check"><input type="checkbox" id="a-news"><span>Je veux recevoir chaque mois la revue des pierres précieuses.</span></label>`}
        <p class="error" id="a-err" role="alert" hidden></p>
        <button type="submit" class="btn btn-main">${login ? 'Se connecter' : 'Créer mon compte'}</button>
      </form>${demo}`;
    return;
  }
  const u = shop.user, tabs = [['profil', 'Mon profil'], ['commandes', 'Mes commandes'], ['favoris', 'Mes favoris']];
  let body = '';
  if (accTab === 'profil') body = `<form class="stack" id="profile-form" novalidate>
      <div class="field"><label for="p-prenom">Prénom</label><input id="p-prenom" value="${esc(u.prenom)}" autocomplete="given-name"></div>
      <div class="field"><label for="p-nom">Nom</label><input id="p-nom" value="${esc(u.nom)}" autocomplete="family-name"></div>
      <div class="field"><label for="p-email">E-mail</label><input id="p-email" type="email" value="${esc(u.email)}" autocomplete="email"></div>
      <div class="field"><label for="p-taille">Ma taille de doigt</label><select id="p-taille">${sizeOpts(u.taille)}</select><p class="help">La taille correspond au tour de doigt en millimètres.</p></div>
      <label class="check"><input type="checkbox" id="p-news"${u.news ? ' checked' : ''}><span>Recevoir chaque mois la revue des pierres précieuses.</span></label>
      <div class="btn-row"><button type="submit" class="btn btn-main">Enregistrer</button><button type="button" class="btn btn-line" id="logout">Se déconnecter</button></div>
      <button type="button" class="txt-btn" id="forget" style="justify-self:start">Supprimer mon compte et mes données de ce navigateur</button>
    </form>`;
  if (accTab === 'commandes') body = shop.orders.length ? `<ul class="lines">${shop.orders.map(o => `<li class="line" style="grid-template-columns:1fr auto"><div><h4>${o.ref}</h4><p>Demande du ${o.date}</p><p>${o.items.map(i => { const it = itemOf(i.id); return it ? it.nom + (i.size ? ' (taille ' + i.size + ')' : '') : ''; }).filter(Boolean).join(', ')}</p><p class="p">${priceTxt(o.prix)}</p></div><div class="line-btns"><span class="fine">En attente de devis</span></div></li>`).join('')}</ul><p class="fine">Livraison offerte et paiement en 3 fois sans frais avec Klarna sur chaque commande confirmée.</p>` : '<p class="empty">Aucune commande pour l\'instant. Vos demandes de réservation apparaîtront ici.</p>';
  if (accTab === 'favoris') body = favsHTML();
  box.innerHTML = `<p class="lead" style="margin:0">Bonjour ${esc(u.prenom)}.</p><div class="tabs" role="tablist">${tabs.map(([k, t]) => `<button type="button" role="tab" aria-selected="${k === accTab}" data-acc="${k}">${t}</button>`).join('')}</div>${body}${accTab === 'profil' ? demo : ''}`;
  hydrateMinis(box);
}
function openAccount(){ renderAccount(); if (!accountDlg.open) accountDlg.showModal(); }
function openCart(){ renderCart(); if (!cartDlg.open) cartDlg.showModal(); }
$('#btn-account').addEventListener('click', openAccount);
$('#btn-cart').addEventListener('click', openCart);
[accountDlg, cartDlg].forEach(d => d.addEventListener('click', e => { if (e.target === d) d.close(); }));
document.addEventListener('click', e => {
  const t = e.target.closest('[data-fav],[data-add],[data-rm],[data-rmline],[data-auth],[data-acc],[data-close],[data-open-account],[data-open-cart],#cart-go,#logout,#forget'); if (!t) return;
  if (t.dataset.fav){ const id = t.dataset.fav, i = shop.fav.indexOf(id), it = itemOf(id); if (i >= 0) shop.fav.splice(i, 1); else shop.fav.push(id); syncShop(); toast(i >= 0 ? `${it.nom} retirée des favoris.` : `${it.nom} ajoutée aux favoris.`); return; }
  if (t.dataset.add){ addToCart(t.dataset.add); return; }
  if (t.dataset.rm){ shop.cart = shop.cart.filter(c => c.id !== t.dataset.rm); syncShop(); return; }
  if (t.dataset.rmline){ liveRemove(t.dataset.rmline); return; }
  if (t.dataset.auth){ authTab = t.dataset.auth; renderAccount(); return; }
  if (t.dataset.acc){ accTab = t.dataset.acc; renderAccount(); return; }
  if (t.hasAttribute('data-open-account')){ openAccount(); return; }
  if (t.hasAttribute('data-open-cart')){ openCart(); return; }
  if (t.hasAttribute('data-close')){ const d = t.closest('dialog'); if (d) d.close(); return; }
  if (t.id === 'cart-go'){ placeOrder(); return; }
  if (t.id === 'logout'){ shop.logged = false; authTab = 'login'; syncShop(); toast('Vous êtes déconnecté·e.'); return; }
  if (t.id === 'forget'){ shop.user = null; shop.logged = false; shop.orders = []; shop.fav = []; shop.cart = []; shop.news = ''; authTab = 'signup'; syncShop(); toast('Compte et données supprimés de ce navigateur.'); }
});
document.addEventListener('change', e => { const s = e.target.closest('[data-size]'); if (!s) return; const c = shop.cart.find(x => x.id === s.dataset.size); if (c){ c.size = s.value; saveShop(); } });
const mailOK = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
document.addEventListener('submit', e => {
  const f = e.target;
  if (f.id === 'auth-form'){
    e.preventDefault(); const err = $('#a-err'), email = $('#a-email').value.trim(), pass = $('#a-pass').value;
    const fail = (m, el) => { err.textContent = m; err.hidden = false; if (el) el.focus(); };
    if (!mailOK(email)) return fail('Indiquez une adresse e-mail valide, par exemple prenom@exemple.fr.', $('#a-email'));
    if (pass.length < 8) return fail('Le mot de passe doit compter au moins 8 caractères.', $('#a-pass'));
    if (authTab === 'login'){
      if (!shop.user || shop.user.email.toLowerCase() !== email.toLowerCase()) return fail('Aucun compte avec cette adresse dans ce navigateur. Créez un compte.', $('#a-email'));
    } else {
      const prenom = $('#a-prenom').value.trim(), nom = $('#a-nom').value.trim();
      if (!prenom) return fail('Indiquez votre prénom.', $('#a-prenom'));
      if (!$('#a-cgv').checked) return fail('Acceptez les conditions générales de vente pour créer votre compte.', $('#a-cgv'));
      shop.user = { prenom, nom, email, taille: '', news: $('#a-news').checked };
    }
    shop.logged = true; accTab = 'profil'; syncShop(); toast(`Bienvenue ${shop.user.prenom}.`);
  }
  if (f.id === 'profile-form'){
    e.preventDefault(); const email = $('#p-email').value.trim(); if (!mailOK(email)){ $('#p-email').focus(); toast('Adresse e-mail invalide.'); return; }
    Object.assign(shop.user, { prenom: $('#p-prenom').value.trim() || shop.user.prenom, nom: $('#p-nom').value.trim(), email, taille: $('#p-taille').value, news: $('#p-news').checked });
    syncShop(); toast('Profil enregistré.');
  }
});
/* Envoi vers les formulaires natifs de la boutique Shopify (contact et abonnement) */
function postToShop(fields){
  /* Sur la boutique Shopify, le thème fournit les vrais formulaires (contact et abonnement) avec leurs jetons anti-spam : on les remplit et on les envoie dans la même page */
  const real = document.getElementById(fields.form_type === 'customer' ? 'sg-customer' : 'sg-contact');
  if (real){
    real.querySelectorAll('[data-sg]').forEach(i => i.remove());
    Object.entries(fields).forEach(([k, v]) => { if (k === 'form_type' || k === 'utf8') return; const i = document.createElement('input'); i.type = 'hidden'; i.name = k; i.value = v; i.dataset.sg = ''; real.appendChild(i); });
    try { sessionStorage.setItem('sg-sent', fields.form_type === 'customer' ? 'news' : 'contact'); } catch(e){}
    HTMLFormElement.prototype.submit.call(real); return true;   // envoi natif : les scripts de la boutique interceptaient l'événement et annulaient l'envoi
  }
  const f = document.createElement('form'); f.method = 'post'; f.action = `https://${Live.domain}/contact#contact_form`; f.target = '_blank'; f.hidden = true;
  Object.entries(Object.assign({ utf8: '✓' }, fields)).forEach(([k, v]) => { const i = document.createElement('input'); i.type = 'hidden'; i.name = k; i.value = v; f.appendChild(i); });
  document.body.appendChild(f); f.submit(); f.remove();
}
syncShop();
/* Retour de Shopify après l'envoi d'un formulaire : confirmation ou erreur */
(() => {
  let sent = ''; try { sent = sessionStorage.getItem('sg-sent') || ''; sessionStorage.removeItem('sg-sent'); } catch(e){}
  if (!sent) return;
  const q = new URLSearchParams(location.search), ok = q.get('contact_posted') === 'true' || q.get('customer_posted') === 'true';
  if (sent === 'contact'){
    const st = $('#form-status'); st.hidden = false;
    st.textContent = ok ? 'Merci. Votre histoire est bien arrivée chez Singulier. Nina et Maëline vous répondent par e-mail.' : "Votre histoire n'a pas pu être envoyée. Vérifiez votre adresse e-mail et réessayez.";
    setTimeout(() => { const f = $('#raconter'); if (f) f.scrollIntoView({ block: 'center' }); }, 300);
  } else {
    const st = $('#news-status'); st.hidden = false;
    st.textContent = ok ? 'Merci. Votre inscription à la revue est enregistrée.' : "L'inscription n'a pas pu être enregistrée. Réessayez dans un instant.";
  }
  if (ok) history.replaceState(null, '', location.pathname + location.hash);
})();
if (Live.on) $('#foot-note').textContent = 'Les bagues affichées sont des rendus 3D et des illustrations de travail, pas des photos de pièces finies. Prix, stock, panier et paiement sont gérés par la boutique Singulier sur Shopify.';
if (Live.on){ Live.ready.then(refreshPrices).catch(() => toast('La boutique ne répond pas. Les prix affichés sont des estimations.')); loadLiveCart(); }

/* ================= Essayage sur la main, avec suivi automatique ================= */
const TryOn = (() => {
  const dlg = $('#tryon'), stage = $('#try-stage'), video = $('#try-video'), photo = $('#try-photo'), ringImg = $('#try-ring'), sizeIn = $('#try-size'), rotIn = $('#try-rot'), errEl = $('#try-error'), trackBtn = $('#try-track'), statusEl = $('#try-status');
  const steps = { consent: $('#try-consent'), live: $('#try-live'), result: $('#try-result') };
  const HC = Object.assign({ cdn: 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14', model: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task' }, CFG.handTracking || {});
  let stream = null, cur = null, blobUrl = '', T = { x: .5, y: .5, s: .6, a: 0 };
  let tracking = true, landmarker = null, loading = null, mode = '', raf = 0, lastT = -1, seen = false, lostFrames = 0, statusTxt = '';
  const pts = new Map(); let g0 = null;
  const show = (k) => { for (const n in steps) steps[n].hidden = n !== k; };
  function apply(){ ringImg.style.left = (T.x * 100).toFixed(2) + '%'; ringImg.style.top = (T.y * 100).toFixed(2) + '%'; ringImg.style.transform = `translate(-50%,-50%) rotate(${T.a.toFixed(1)}deg) scale(${T.s.toFixed(3)})`; sizeIn.value = Math.round(T.s * 100); rotIn.value = Math.round(((T.a + 540) % 360) - 180); }
  function say(t){ if (t !== statusTxt){ statusTxt = t; statusEl.textContent = t; } }
  function setTracking(on){ tracking = on; trackBtn.setAttribute('aria-pressed', String(on)); trackBtn.textContent = on ? 'Suivi de la main : activé' : 'Suivi de la main : désactivé'; if (on) startTracking(); else { cancelAnimationFrame(raf); raf = 0; say('Placez la bague à la main : glissez-la, ou utilisez les curseurs.'); } }

  async function getLandmarker(){
    if (landmarker) return landmarker; if (loading) return loading;
    loading = (async () => {
      const vision = await import(HC.cdn + '/vision_bundle.mjs');
      const files = await vision.FilesetResolver.forVisionTasks(HC.cdn + '/wasm');
      const opts = (delegate) => ({ baseOptions: { modelAssetPath: HC.model, delegate }, runningMode: 'VIDEO', numHands: 1, minHandDetectionConfidence: .4, minHandPresenceConfidence: .4, minTrackingConfidence: .4 });
      try { landmarker = await vision.HandLandmarker.createFromOptions(files, opts('GPU')); } catch(e){ landmarker = await vision.HandLandmarker.createFromOptions(files, opts('CPU')); }
      mode = 'VIDEO'; return landmarker;
    })();
    try { return await loading; } catch(e){ loading = null; throw e; }
  }
  async function setMode(m){ if (mode !== m){ await landmarker.setOptions(m === 'IMAGE' ? { runningMode: m, minHandDetectionConfidence: .1, minHandPresenceConfidence: .1 } : { runningMode: m, minHandDetectionConfidence: .4, minHandPresenceConfidence: .4, minTrackingConfidence: .4 }); mode = m; } }
  /* Bague posée sur la première phalange de l'annulaire (repères 13 et 14), largeur déduite de la paume */
  function fit(lms, sw, sh){
    const r = stage.getBoundingClientRect(), sc = Math.max(r.width / sw, r.height / sh), dx = (r.width - sw * sc) / 2, dy = (r.height - sh * sc) / 2;
    const P = (i) => ({ x: lms[i].x * sw * sc + dx, y: lms[i].y * sh * sc + dy });
    const a = P(13), b = P(14), i9 = P(9), i17 = P(17);
    const t = .4, x = a.x + (b.x - a.x) * t, y = a.y + (b.y - a.y) * t;
    const finger = Math.hypot(i9.x - i17.x, i9.y - i17.y) * .5;
    return { x: x / r.width, y: y / r.height, s: Math.max(.12, Math.min(2.5, finger * 1.9 / (r.width * .46))), a: Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI + 90 };
  }
  function follow(n, k){ T.x += (n.x - T.x) * k; T.y += (n.y - T.y) * k; T.s += (n.s - T.s) * k; const d = ((n.a - T.a + 540) % 360) - 180; T.a += d * k; apply(); }
  function loop(){
    raf = 0; if (!tracking || !stream || video.hidden || !landmarker || !dlg.open) return;
    if (video.readyState >= 2 && video.currentTime !== lastT){
      lastT = video.currentTime;
      try {
        const res = landmarker.detectForVideo(video, performance.now());
        if (res.landmarks && res.landmarks[0]){ follow(fit(res.landmarks[0], video.videoWidth, video.videoHeight), seen ? (reduce ? 1 : .45) : 1); seen = true; lostFrames = 0; say('Main détectée : la bague suit votre annulaire.'); }
        else if (++lostFrames > 8){ seen = false; say('Montrez le dos de votre main, doigts vers le haut.'); }
      } catch(e){}
    }
    raf = requestAnimationFrame(loop);
  }
  async function startTracking(){
    if (!tracking) return;
    say('Chargement du suivi de la main…');
    try { await getLandmarker(); } catch(e){ say('Le suivi automatique n\'a pas pu démarrer ici. Placez la bague à la main.'); return; }
    if (!tracking) return;
    if (stream && !video.hidden){ await setMode('VIDEO'); seen = false; lostFrames = 0; say('Montrez le dos de votre main, doigts vers le haut.'); if (!raf) raf = requestAnimationFrame(loop); }
    else if (!photo.hidden && photo.complete && photo.naturalWidth){
      await setMode('IMAGE');
      try { const k = Math.min(1, 960 / Math.max(photo.naturalWidth, photo.naturalHeight)), cv = document.createElement('canvas'); cv.width = Math.round(photo.naturalWidth * k); cv.height = Math.round(photo.naturalHeight * k); cv.getContext('2d').drawImage(photo, 0, 0, cv.width, cv.height);
        const res = landmarker.detect(cv); if (res.landmarks && res.landmarks[0]){ follow(fit(res.landmarks[0], photo.naturalWidth, photo.naturalHeight), 1); say('Main détectée : ajustez si besoin.'); } else say('Aucune main trouvée sur la photo. Placez la bague à la main.'); }
      catch(e){ say('Analyse impossible sur cette photo. Placez la bague à la main.'); }
    }
  }
  function stopCam(){ cancelAnimationFrame(raf); raf = 0; if (stream){ stream.getTracks().forEach(t => t.stop()); stream = null; } video.srcObject = null; video.hidden = true; }
  function fail(msg){ errEl.textContent = msg; errEl.hidden = false; show('consent'); }
  async function startCam(){
    errEl.hidden = true;
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return fail('La caméra n\'est pas disponible dans ce navigateur. Utilisez une photo de votre main.');
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 960 } }, audio: false });
      video.srcObject = stream; photo.hidden = true; video.hidden = false; await video.play(); show('live'); startTracking();
    } catch(e){
      fail(e && e.name === 'NotAllowedError' ? 'L\'accès à la caméra a été refusé. Vous pouvez l\'autoriser dans les réglages du navigateur, ou utiliser une photo de votre main.' : 'La caméra n\'a pas pu démarrer ici. Utilisez une photo de votre main.');
    }
  }
  $('#try-cam').addEventListener('click', startCam);
  $('#try-file').addEventListener('change', e => {
    const f = e.target.files && e.target.files[0]; if (!f) return; stopCam(); if (blobUrl) URL.revokeObjectURL(blobUrl); blobUrl = URL.createObjectURL(f);
    photo.onload = () => startTracking(); photo.src = blobUrl; photo.hidden = false; errEl.hidden = true; show('live'); e.target.value = '';
  });
  trackBtn.addEventListener('click', () => setTracking(!tracking));
  sizeIn.addEventListener('input', () => { T.s = sizeIn.value / 100; apply(); });
  rotIn.addEventListener('input', () => { T.a = +rotIn.value; apply(); });
  stage.addEventListener('pointerdown', e => { if (tracking && stream) setTracking(false); stage.setPointerCapture(e.pointerId); pts.set(e.pointerId, { x: e.clientX, y: e.clientY }); g0 = null; });
  stage.addEventListener('pointermove', e => {
    const p = pts.get(e.pointerId); if (!p) return; const r = stage.getBoundingClientRect();
    if (pts.size === 1){ T.x = Math.max(0, Math.min(1, T.x + (e.clientX - p.x) / r.width)); T.y = Math.max(0, Math.min(1, T.y + (e.clientY - p.y) / r.height)); p.x = e.clientX; p.y = e.clientY; }
    else { p.x = e.clientX; p.y = e.clientY; const [a, b] = Array.from(pts.values()); const d = Math.hypot(b.x - a.x, b.y - a.y), ang = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;
      if (!g0) g0 = { d, ang, s: T.s, a: T.a }; T.s = Math.max(.12, Math.min(2.5, g0.s * d / g0.d)); T.a = g0.a + ang - g0.ang; }
    apply();
  });
  const up = e => { pts.delete(e.pointerId); g0 = null; }; stage.addEventListener('pointerup', up); stage.addEventListener('pointercancel', up);
  $('#try-shot').addEventListener('click', () => {
    const r = stage.getBoundingClientRect(), k = Math.min(2, window.devicePixelRatio || 1), c = document.createElement('canvas'); c.width = Math.round(r.width * k); c.height = Math.round(r.height * k);
    const x = c.getContext('2d'), src = video.hidden ? photo : video, sw = src.videoWidth || src.naturalWidth, sh = src.videoHeight || src.naturalHeight;
    if (sw && sh){ const sc = Math.max(c.width / sw, c.height / sh); x.drawImage(src, (c.width - sw * sc) / 2, (c.height - sh * sc) / 2, sw * sc, sh * sc); }
    const base = c.width * .46 * T.s; x.translate(T.x * c.width, T.y * c.height); x.rotate(T.a * Math.PI / 180); x.shadowColor = 'rgba(0,0,0,.45)'; x.shadowBlur = 10 * k; x.shadowOffsetY = 5 * k;
    try { x.drawImage(ringImg, -base / 2, -base / 2, base, base); $('#try-out').src = c.toDataURL('image/jpeg', .9); stopCam(); show('result'); } catch(err){ toast('La photo n\'a pas pu être créée.'); }
  });
  $('#try-back').addEventListener('click', () => { stopCam(); show('consent'); });
  $('#try-again').addEventListener('click', () => show('consent'));
  $('#try-add').addEventListener('click', () => { if (cur) addToCart(cur.id); });
  dlg.addEventListener('close', () => { stopCam(); if (blobUrl){ URL.revokeObjectURL(blobUrl); blobUrl = ''; } });
  dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
  return { open(id){
    const it = itemOf(id); if (!it) return; cur = it; $('#try-name').textContent = it.nom; errEl.hidden = true; T = { x: .5, y: .5, s: .6, a: 0 }; apply(); show('consent');
    tracking = true; trackBtn.setAttribute('aria-pressed', 'true'); trackBtn.textContent = 'Suivi de la main : activé'; say('');
    ringImg.src = 'data:image/svg+xml,' + encodeURIComponent(ringSVG(it.r, 'illu'));
    if (Studio) Studio.thumb(it.r, dlg, url => { if (url) ringImg.src = url; }, 'worn');
    if (!dlg.open) dlg.showModal();
  } };
})();

/* ================= Certificat d'authenticité ================= */
const certDlg = $('#certdlg');
function weightOf(r){ const add = { chaton: 2, spirale: 1.5, racines: -.5, etoile: .5, branches: 0, gouttes: .8, granules: .5 }[r.motif] || 0; let g = Math.max(3, 6.5 + add + (r.W - 6) * .35); if (r.metal === 'argent') g *= .67; return g; }
function certHTML(r){
  const no = 'SG-F-' + r.num, s = r.stone, isD = s.id === 'diamant', url = location.href.split('#')[0] + '#certificat-f' + r.num;
  let qr = `<small>${no}</small>`;
  try { if (window.qrcode){ const q = window.qrcode(0, 'M'); q.addData(url); q.make(); qr = q.createSvgTag({ cellSize: 3, margin: 2, scalable: true }); } } catch(e){}
  const mohs = parseFloat(s.mohs.replace(',', '.')), g = weightOf(r);
  const row = (k, v) => `<div><dt>${k}</dt><dd>${v}</dd></div>`;
  return `<article class="certif" aria-label="Certificat ${no}, spécimen">
    <header class="certif-head"><div><div class="certif-brand">SINGULIER</div><p class="certif-title">Certificat d'authenticité</p></div>
      <p class="certif-no" style="margin:0">Certificat n°<b>${no}</b>Bague Flash, pièce unique</p></header>
    <div class="certif-grid">
      <div>
        <p class="cbar">Le bijou</p>
        <dl>${row('Référence', 'Flash ' + r.num + ' / 66')}${row('Nom', r.nom)}${row('Descriptif', `Bague ${MOTIFS[r.motif].nom.toLowerCase()}, sertie d'un${isD ? '' : 'e pierre :'} ${s.nom.toLowerCase()}`)}${row('Matière', METALS[r.metal].nom)}${row('Titre', r.metal === 'argent' ? '925 millièmes' : '750 millièmes')}${row('Poids du bijou', 'environ ' + fr(g) + ' g')}${row('Façon', 'Coulée, sculptée, sertie et gravée à la main')}</dl>
        <p class="cbar">Les pierres</p>
        <div class="ctable-wrap"><table><thead><tr><th>Désignation</th><th>Taille</th><th>mm</th><th>Qté</th><th>Poids</th><th>Origine</th></tr></thead>
          <tbody><tr><td>${s.nom}</td><td>${SHAPES[r.shape].nom}</td><td>${fr(r.L)} × ${fr(r.W)}</td><td>1</td><td>${fr(r.ct, 2)} ct</td><td>${isD ? 'à sourcer' : r.orig}</td></tr></tbody></table></div>
        <p class="cbar">${isD ? 'Qualité du diamant' : 'Caractéristiques'}</p>
        <dl>${isD ? row('Couleur', 'G à H (visée)') + row('Pureté', 'VS (visée)') + row('Taille', 'Très bonne à excellente (visée)') : row('Couleur', s.nom.replace(/^\S+\s?/, '') || 'naturelle') + row('Traitements', 'Indiqués après expertise')}${row('Dureté', s.mohs + ' sur l\'échelle de Mohs')}</dl>
        <div class="mohs" aria-hidden="true"><i style="left:${((mohs - 1) / 9 * 100).toFixed(1)}%"></i></div><div class="mohs-l" aria-hidden="true"><span>1 · talc</span><span>Dureté</span><span>10 · diamant</span></div>
      </div>
      <div>
        <p class="cbar">Croquis, vue de dessus</p>
        <div class="certif-art">${ringSVG(r, 'croquis', { label: no })}</div>
        <p class="cbar">Suivi</p>
        <dl>${row('Date de remise', '…………')}${row('Taille de doigt', '…………')}${row('1ʳᵉ mise à taille', '…………')}${row('Gravure', '…………')}</dl>
        <small>Les pierres sont un produit de la nature : chacune est unique. Le poids indiqué est un poids minimal.</small>
      </div>
    </div>
    <footer class="certif-foot">
      <div class="qr">${qr}</div>
      <div><div class="signs"><span>Nina</span><span>Maëline</span></div>
        <small style="margin-top:10px">Scannez le code ou saisissez le numéro ${no} sur le site pour retrouver ce certificat. Singulier garantit que ce bijou a été fabriqué à la main dans son atelier, dans les matériaux décrits ci-dessus.</small></div>
      <svg class="seal" viewBox="0 0 100 100" aria-hidden="true"><g fill="none" stroke="#A67C2E"><circle cx="50" cy="50" r="46" stroke-dasharray="2 3"/><circle cx="50" cy="50" r="38" stroke-width="1.5"/></g><circle cx="42" cy="50" r="15" fill="#F2C76B"/><circle cx="58" cy="50" r="15" fill="#2B0202"/><circle cx="67.5" cy="38" r="2.5" fill="#fff"/><path id="sealp" d="M50 50m-31 0a31 31 0 1 1 62 0" fill="none"/><text font-family="Cormorant Garamond, serif" font-size="7.5" letter-spacing="2.4" fill="#A67C2E"><textPath href="#sealp" startOffset="50%" text-anchor="middle">SINGULIER · PIÈCE UNIQUE</textPath></text></svg>
    </footer></article>`;
}
function openCert(i, opener){
  const r = RINGS[i]; if (!r) return false;
  $('#cert-out').innerHTML = certHTML(r); $('#cert-no').value = 'SG-F-' + r.num; $('#cert-err').hidden = true;
  if (!certDlg.open) certDlg.showModal(); certDlg.scrollTop = 0;
  try { history.replaceState(null, '', '#certificat-f' + r.num); } catch(e){}
  return true;
}
$('#cert-lookup').addEventListener('submit', e => { e.preventDefault(); const m = $('#cert-no').value.trim().toUpperCase().match(/^SG-?F-?(\d{1,2})$/); const ok = m && +m[1] >= 1 && +m[1] <= 66 && openCert(+m[1] - 1); $('#cert-err').hidden = !!ok; if (!ok) $('#cert-no').focus(); });
certDlg.addEventListener('click', e => { if (e.target === certDlg) certDlg.close(); });
certDlg.addEventListener('close', () => { try { history.replaceState(null, '', location.pathname + location.search); } catch(e){} });
function certFromHash(){ const m = location.hash.match(/^#certificat-f(\d{2})$/); if (m) openCert(+m[1] - 1); }
certFromHash(); addEventListener('hashchange', certFromHash);
document.addEventListener('click', e => {
  const t = e.target.closest('[data-try],[data-cert],[data-verify]'); if (!t) return;
  e.preventDefault(); if (sheet.open) sheet.close();
  if (t.dataset.try) TryOn.open(t.dataset.try === 'sheet' ? 'f' + sheetIdx : t.dataset.try);
  else if (t.hasAttribute('data-verify')){ $('#cert-out').innerHTML = ''; $('#cert-no').value = ''; $('#cert-err').hidden = true; certDlg.showModal(); $('#cert-no').focus(); }
  else openCert(t.dataset.cert === 'sheet' ? sheetIdx : +t.dataset.cert);
});
$('#sheet-add').addEventListener('click', () => addToCart('f' + sheetIdx));

/* ================= Cookies : la fenêtre s'ouvre comme une éclipse ================= */
const ckDlg = $('#cookies');
function cookieChoice(){ try { const c = JSON.parse(localStorage.getItem('singulier-cookies')); if (c && Date.now() - c.ts < 183 * 864e5) return c; } catch(e){} return null; }
function closeEclipse(){
  if (!ckDlg.open) return;
  if (reduce){ ckDlg.close(); return; }
  ckDlg.classList.add('is-leaving');
  setTimeout(() => { ckDlg.close(); ckDlg.classList.remove('is-leaving'); }, 650);
}
/* Sur la boutique Shopify, le choix fait dans l'éclipse est transmis à l'API de consentement de Shopify */
function shopifyConsent(audience){
  const S = window.Shopify; if (!S || typeof S.loadFeatures !== 'function') return;
  try { S.loadFeatures([{ name: 'consent-tracking-api', version: '0.1' }], err => { if (err || !S.customerPrivacy) return; S.customerPrivacy.setTrackingConsent({ analytics: !!audience, marketing: false, preferences: true, sale_of_data: false }, () => {}); }); } catch(e){}
}
function setCookies(audience){ store.set('singulier-cookies', JSON.stringify({ ts: Date.now(), audience: !!audience })); shopifyConsent(audience); closeEclipse(); toast(audience ? 'Cookies acceptés. La lumière revient.' : 'Seuls les cookies nécessaires restent actifs.'); }
ckDlg.addEventListener('cancel', e => e.preventDefault());           // un choix explicite est demandé ; « Tout refuser » est aussi simple qu'accepter
if (!cookieChoice()) requestAnimationFrame(() => { ckDlg.showModal(); $('#ck-title').focus({ preventScroll: true }); });
document.addEventListener('click', e => {
  const b = e.target.closest('[data-ck]'); if (!b) return; const k = b.dataset.ck;
  if (k === 'accept') setCookies(true);
  else if (k === 'refuse'){ setCookies(false); if (legal.open) legal.close(); }
  else if (k === 'custom') openDoc('cookies', b);
  else if (k === 'save'){ setCookies($('#ck-audience').checked); legal.close(); }
});

/* ================= Revue mensuelle ================= */
$('#news-form').addEventListener('submit', e => {
  const inp = $('#n-email'), ok = mailOK(inp.value), agree = $('#n-ok').checked, st = $('#news-status');
  inp.setAttribute('aria-invalid', String(!ok)); $('#n-err').hidden = ok && agree;
  $('#n-err').textContent = !ok ? 'Indiquez une adresse e-mail valide, par exemple prenom@exemple.fr.' : 'Cochez la case pour confirmer votre inscription.';
  if (!ok){ e.preventDefault(); inp.focus(); return; } if (!agree){ e.preventDefault(); $('#n-ok').focus(); return; }
  shop.news = inp.value.trim(); if (shop.user) shop.user.news = true; saveShop(); st.hidden = false;
  if (isShopForm(e.target)){ try { sessionStorage.setItem('sg-sent', 'news'); } catch(err){} st.textContent = 'Inscription en cours…'; return; }
  e.preventDefault();
  if (Live.on){ postToShop({ form_type: 'customer', 'contact[email]': shop.news, 'contact[tags]': 'newsletter, revue-pierres' }); st.textContent = 'Inscription en cours…'; }
  else st.textContent = 'Merci. Démonstration : l\'envoi de la revue n\'est pas encore branché, votre adresse est seulement notée dans ce navigateur.';
});

/* Inspirations : aperçu local des images choisies */
$('#f-inspi-img').addEventListener('change', e => { const box = $('#f-thumbs'); box.innerHTML = ''; Array.from(e.target.files || []).slice(0, 6).forEach(f => { if (!/^image\//.test(f.type)) return; const im = new Image(); im.alt = 'Inspiration : ' + f.name; im.src = URL.createObjectURL(f); im.onload = () => URL.revokeObjectURL(im.src); box.appendChild(im); }); });

/* Accès pour l'export du catalogue Shopify (dossier shopify/) */
window.Singulier = { RINGS, MODELS, SIZES, METALS, MOTIFS, SHAPES, priceOf, stoneLine, handleOf, render: (r, size, kind) => Studio ? Studio.render(r, size, kind) : '' };

/* ================= Préférences changeantes ================= */
mqReduce.addEventListener && mqReduce.addEventListener('change', e => { reduce = e.matches; });
mqMobile.addEventListener && mqMobile.addEventListener('change', e => { mobile = e.matches; heroForSide(false); });
})();
