#!/usr/bin/env python3
"""Génère communication/page/index.html (la page du plan) à partir de plan.json."""
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
plan = json.load(open(os.path.join(HERE, "plan.json"), encoding="utf-8"))
data = json.dumps(plan, ensure_ascii=False).replace("</", "<\\/")

HTML = r"""<title>Plan Singulier</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Manrope:wght@400;500;600;700&display=swap">
<style>
/* Layout : une colonne de lecture, la journée du jour en tête, puis les semaines ; chaque jour se déplie. */
:root{
  --bg:#FFF4EF; --surface:#FFFFFF; --ink:#2B0202; --muted:#74364A; --line:#EBD3CD;
  --rose:#AF3554; --or:#A67C2E; --soft:#F8DAD5;
  --display:"Cormorant Garamond", "Times New Roman", serif;
  --body:"Manrope", system-ui, -apple-system, sans-serif;
}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){
  --bg:#160003; --surface:#2B0202; --ink:#F6E7E4; --muted:#D9BAB5; --line:#4A0C20;
  --rose:#E2708D; --or:#D9B873; --soft:#3E0E1B; color-scheme:dark}}
:root[data-theme="dark"]{
  --bg:#160003; --surface:#2B0202; --ink:#F6E7E4; --muted:#D9BAB5; --line:#4A0C20;
  --rose:#E2708D; --or:#D9B873; --soft:#3E0E1B; color-scheme:dark}
*{box-sizing:border-box}
body{background:var(--bg);color:var(--ink);font-family:var(--body);font-size:15px;line-height:1.55;
  padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px));padding-block:28px 64px}
.wrap{max-width:760px;margin:0 auto;display:flex;flex-direction:column;gap:28px}
h1,h2,h3{font-family:var(--display);font-weight:500;text-wrap:balance;margin:0}
h1{font-size:clamp(34px,7vw,52px);line-height:1.05;letter-spacing:.01em}
h1 em{color:var(--rose);font-style:italic}
h2{font-size:28px}
.lede{color:var(--muted);max-width:60ch;margin:8px 0 0}
.eyebrow{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--or);font-weight:600}
.phases{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
.phase{border-top:3px solid var(--line);padding-top:8px;min-width:0}
.phase.on{border-color:var(--rose)}
.phase b{display:block;font-family:var(--display);font-size:19px;font-weight:500}
.phase span{font-size:12px;color:var(--muted)}
@media (max-width:520px){.phases{grid-template-columns:1fr}}
.today{background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:20px;display:flex;flex-direction:column;gap:10px}
.today h2{font-size:30px}
.chips{display:flex;flex-wrap:wrap;gap:6px}
.chip{font-size:12px;padding:3px 10px;border-radius:999px;background:var(--soft);color:var(--ink);white-space:nowrap}
.chip.f-atelier{background:#F3E2C7;color:#3B2F2C}.chip.f-flash{background:#2B0202;color:#D9B873}
.chip.f-duo{background:#AF3554;color:#fff}.chip.f-storytime{background:#3E0E1B;color:#F6E7E4}
.chip.f-carrousel{background:#FBD3BE;color:#3E0E1B}.chip.f-porte{background:#F8DAD5;color:#3E0E1B}
.filters{display:flex;flex-wrap:wrap;gap:6px}
.filters button{font:inherit;font-size:13px;border:1px solid var(--line);background:transparent;color:var(--ink);
  padding:6px 12px;border-radius:999px;cursor:pointer}
.filters button[aria-pressed="true"]{background:var(--ink);color:var(--bg);border-color:var(--ink)}
.filters button:focus-visible,summary:focus-visible{outline:2px solid var(--rose);outline-offset:2px}
.week{display:flex;flex-direction:column;gap:6px}
.week h3{font-size:20px;color:var(--muted);padding:6px 0;border-bottom:1px solid var(--line)}
details{border-bottom:1px solid var(--line)}
summary{list-style:none;cursor:pointer;display:grid;grid-template-columns:86px minmax(0,1fr) auto;gap:10px;align-items:baseline;padding:10px 0}
summary::-webkit-details-marker{display:none}
.d{font-variant-numeric:tabular-nums;font-size:13px;color:var(--muted)}
.d b{display:block;color:var(--ink);font-size:14px;text-transform:capitalize}
.t{font-weight:600;min-width:0}
details.past summary{opacity:.55}
details.is-today summary .t::before{content:"Aujourd'hui · ";color:var(--rose)}
.body{padding:0 0 16px 96px;display:flex;flex-direction:column;gap:10px;min-width:0}
@media (max-width:520px){summary{grid-template-columns:64px minmax(0,1fr)}summary .chip{display:none}.body{padding-left:0}}
.k{font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--or);font-weight:600;margin-bottom:2px}
.hook{font-family:var(--display);font-size:22px;line-height:1.25;font-style:italic}
ol{margin:0;padding-left:20px;display:flex;flex-direction:column;gap:4px}
.note{background:var(--soft);border-radius:10px;padding:10px 12px;font-size:14px}
.cap{white-space:pre-wrap;border-left:2px solid var(--rose);padding-left:12px}
.tags{color:var(--muted);font-size:13px}
.copy{align-self:flex-start;font:inherit;font-size:13px;border:1px solid var(--line);background:var(--surface);color:var(--ink);padding:6px 12px;border-radius:8px;cursor:pointer}
.bench{display:grid;gap:10px}
.bench li{margin-bottom:4px}
.rythme{width:100%;border-collapse:collapse;font-size:14px}
.rythme td{padding:6px 8px;border-bottom:1px solid var(--line);vertical-align:top}
.rythme td:first-child{color:var(--muted);width:90px}
footer{font-size:13px;color:var(--muted)}
@media (prefers-reduced-motion:no-preference){details[open] .body{animation:in .18s ease-out}@keyframes in{from{opacity:.4;transform:translateY(-3px)}to{opacity:1}}}
</style>

<div class="wrap">
  <header>
    <div class="eyebrow">Instagram · TikTok · jusqu'à l'ouverture</div>
    <h1>Le Soleil, la Lune <em>et 75 jours</em> de contenu</h1>
    <p class="lede">Le plan de Nina et Maëline du 18 novembre au 31 janvier : un contenu par jour, avec le script, la façon de le filmer, la direction artistique et la légende. Mis à jour chaque lundi selon les tendances.</p>
  </header>

  <div class="phases" id="phases"></div>
  <section class="today" id="today" aria-live="polite"></section>

  <section>
    <h2>La semaine type</h2>
    <table class="rythme"><tbody>
      <tr><td>Lundi</td><td>Reel atelier, gestes et sons (Maëline)</td></tr>
      <tr><td>Mardi</td><td>Carrousel pierres ou coulisses, à enregistrer (Nina)</td></tr>
      <tr><td>Mercredi</td><td>Duo Soleil / Lune sur un format tendance</td></tr>
      <tr><td>Jeudi</td><td>Flash n° XX / 66, la révélation de la semaine</td></tr>
      <tr><td>Vendredi</td><td>Storytime face caméra (Nina, TikTok d'abord)</td></tr>
      <tr><td>Samedi</td><td>Porté et lifestyle (Maëline)</td></tr>
      <tr><td>Dimanche</td><td>Stories, sondages, questions</td></tr>
    </tbody></table>
  </section>

  <section style="display:flex;flex-direction:column;gap:12px">
    <h2>Le calendrier</h2>
    <div class="filters" id="filters" role="group" aria-label="Filtrer par format"></div>
    <div id="cal" style="display:flex;flex-direction:column;gap:22px"></div>
  </section>

  <section class="bench">
    <h2>Ce que dit le benchmark</h2>
    <ul>
      <li><b>Le process gagne.</b> Serti, gravure, polissage, avant / après : le format le plus fiable pour une créatrice de bijoux.</li>
      <li><b>Les partages en DM comptent plus que les likes</b> pour toucher des non-abonnés. On demande « envoie à… ».</li>
      <li><b>Originalité :</b> pas de filigrane d'un autre réseau, publication native sur chaque plateforme.</li>
      <li><b>Carrousels :</b> les plus enregistrés, et ils peuvent porter un son pour passer dans le fil Reels.</li>
      <li><b>Tendances bijoux :</b> bagues superposées, pierres de couleur, pièces uniques numérotées, transparence sur l'origine.</li>
      <li><b>Formats du moment :</b> « la même phrase sur plusieurs tons », vidéos brutes face caméra, coulisses. Une tendance son dure 7 à 10 jours.</li>
    </ul>
    <p class="tags">Détail et sources : communication/benchmark/ dans le dépôt -Singulier.</p>
  </section>
  <footer id="foot"></footer>
</div>

<script>
const PLAN = __DATA__;
const LABELS = {atelier:"Atelier",carrousel:"Carrousel",duo:"Duo",flash:"Flash",storytime:"Storytime",porte:"Porté",story:"Stories",setup:"Mise en place",live:"Live"};
const MOIS = ["janv.","févr.","mars","avr.","mai","juin","juil.","août","sept.","oct.","nov.","déc."];
const J = ["dim.","lun.","mar.","mer.","jeu.","ven.","sam."];
function parisToday(){
  try{return new Intl.DateTimeFormat("en-CA",{timeZone:"Europe/Paris"}).format(new Date())}catch(e){return new Date().toISOString().slice(0,10)}
}
const TODAY = parisToday();
const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const d8 = iso => { const [y,m,d] = iso.split("-").map(Number); return new Date(Date.UTC(y,m-1,d)); };
function chip(f){return `<span class="chip f-${f}">${LABELS[f]||f}</span>`}
function caption(e){return [e.legende,e.cta,e.hashtags].filter(Boolean).join("\n\n")}
function body(e){
  let h = "";
  if (e.hook_ecran) h += `<div><div class="k">Texte à l'écran</div><div class="hook">${esc(e.hook_ecran)}</div></div>`;
  if (e.hook_oral) h += `<div><div class="k">Première phrase</div><div>${esc(e.hook_oral)}</div></div>`;
  h += `<div><div class="k">${esc(e.plateformes)} · ${esc(e.duree)}</div></div>`;
  h += `<div><div class="k">Script</div><ol>${e.script.map(s=>`<li>${esc(s)}</li>`).join("")}</ol></div>`;
  h += `<div><div class="k">Comment le filmer</div><div>${esc(e.tournage)}</div></div>`;
  h += `<div><div class="k">Direction artistique</div><div>${esc(e.da)}</div></div>`;
  if (e.notes) h += `<div class="note">${esc(e.notes)}</div>`;
  if (e.legende){
    h += `<div><div class="k">Légende</div><div class="cap">${esc(e.legende)}${e.cta?"\n\n"+esc(e.cta):""}</div>${e.hashtags?`<div class="tags">${esc(e.hashtags)}</div>`:""}</div>`;
    h += `<button class="copy" type="button" data-cap="${esc(caption(e))}">Copier la légende</button>`;
  }
  if (e.stories && e.stories !== "(voir script)") h += `<div><div class="k">Stories</div><div>${esc(e.stories)}</div></div>`;
  return h;
}
function renderPhases(){
  document.getElementById("phases").innerHTML = PLAN.phases.map(p=>{
    const on = TODAY>=p.du && TODAY<=p.au;
    const a = d8(p.du), b = d8(p.au);
    return `<div class="phase${on?" on":""}"><span>Phase ${p.id} · ${a.getUTCDate()} ${MOIS[a.getUTCMonth()]} au ${b.getUTCDate()} ${MOIS[b.getUTCMonth()]}</span><b>${esc(p.nom)}</b><span>${esc(p.but)}</span></div>`;
  }).join("");
}
function renderToday(){
  const days = PLAN.jours;
  let e = days.find(x=>x.date===TODAY), label = "Aujourd'hui";
  if (!e){ e = days.find(x=>x.date>TODAY) || days[days.length-1]; label = e.date>TODAY ? "Prochain contenu" : "Dernier contenu du plan"; }
  document.getElementById("today").innerHTML =
    `<div class="eyebrow">${label} · ${esc(e.jour)}</div><h2>${esc(e.titre)}</h2>
     <div class="chips">${chip(e.format)}<span class="chip">${esc(e.qui)}</span></div>${body(e)}`;
}
let filter = "tous";
function renderFilters(){
  const fs = ["tous", ...Object.keys(LABELS).filter(f=>PLAN.jours.some(j=>j.format===f))];
  const el = document.getElementById("filters");
  el.innerHTML = fs.map(f=>`<button type="button" data-f="${f}" aria-pressed="${f===filter}">${f==="tous"?"Tous":LABELS[f]}</button>`).join("");
  el.onclick = ev => { const b = ev.target.closest("button"); if(!b) return; filter = b.dataset.f; renderFilters(); renderCal(); };
}
function weekKey(iso){ const d = d8(iso); const wd = (d.getUTCDay()+6)%7; d.setUTCDate(d.getUTCDate()-wd); return d.toISOString().slice(0,10); }
function renderCal(){
  const groups = {};
  PLAN.jours.filter(j=>filter==="tous"||j.format===filter).forEach(j=>{(groups[weekKey(j.date)] ||= []).push(j)});
  document.getElementById("cal").innerHTML = Object.entries(groups).map(([wk,list])=>{
    const a = d8(wk);
    return `<div class="week"><h3>Semaine du ${a.getUTCDate()} ${MOIS[a.getUTCMonth()]}</h3>${list.map(e=>{
      const d = d8(e.date), cls = e.date<TODAY?"past":(e.date===TODAY?"is-today":"");
      return `<details class="${cls}" ${e.date===TODAY?"open":""}><summary><span class="d"><b>${J[d.getUTCDay()]} ${d.getUTCDate()}</b>${MOIS[d.getUTCMonth()]}</span><span class="t">${esc(e.titre)}</span>${chip(e.format)}</summary><div class="body">${body(e)}</div></details>`;
    }).join("")}</div>`;
  }).join("");
}
document.addEventListener("click", async ev => {
  const b = ev.target.closest(".copy"); if(!b) return;
  const txt = b.dataset.cap;
  try{ await navigator.clipboard.writeText(txt); b.textContent = "Légende copiée"; }
  catch(e){ const r = document.createRange(); const cap = b.previousElementSibling; r.selectNodeContents(cap); const s = getSelection(); s.removeAllRanges(); s.addRange(r); b.textContent = "Texte sélectionné, copiez-le"; }
  setTimeout(()=>{ b.textContent = "Copier la légende"; }, 2200);
});
renderPhases(); renderToday(); renderFilters(); renderCal();
document.getElementById("foot").textContent = `${PLAN.jours.length} jours · ouverture des commandes ${PLAN.ouverture} (à confirmer) · aucun prix affiché, rendus 3D présentés comme rendus de travail.`;
</script>
"""

os.makedirs(os.path.join(HERE, "page"), exist_ok=True)
open(os.path.join(HERE, "page", "index.html"), "w", encoding="utf-8").write(HTML.replace("__DATA__", data))
print(os.path.join(HERE, "page", "index.html"))
