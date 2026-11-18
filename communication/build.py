#!/usr/bin/env python3
"""
Génère plan.json et plan.md à partir de plan_data.py, et vérifie le plan.

    python3 communication/build.py            # régénère et vérifie
    python3 communication/build.py --jour      # affiche le contenu du jour (heure de Paris)
    python3 communication/build.py --jour 2026-12-03
    python3 communication/build.py --semaine   # les 7 prochains jours, en bref
"""
import datetime as dt
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import plan_data as P  # noqa: E402

JOURS_FR = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"]
MOIS_FR = ["", "janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août",
           "septembre", "octobre", "novembre", "décembre"]


def date_fr(d):
    return f"{JOURS_FR[d.weekday()]} {d.day} {MOIS_FR[d.month]} {d.year}"


def phase_of(d):
    for ph in P.PHASES:
        if dt.date.fromisoformat(ph["du"]) <= d <= dt.date.fromisoformat(ph["au"]):
            return ph
    return None


def entries():
    out = []
    for j in P.JOURS:
        d = dt.date.fromisoformat(j["date"])
        f = P.FORMATS[j["format"]]
        e = dict(j)
        e["jour"] = date_fr(d)
        e["phase"] = phase_of(d)["nom"] if phase_of(d) else ""
        e["format_label"] = f["label"]
        e["plateformes"] = f["plateformes"]
        e["duree"] = f["duree"]
        e["tournage"] = f["tournage"]
        e["da"] = f["da"]
        e["hashtags"] = j.get("hashtags", f["hashtags"])
        out.append(e)
    return out


def check(es):
    problems = []
    dates = [dt.date.fromisoformat(e["date"]) for e in es]
    if dates != sorted(dates):
        problems.append("dates pas dans l'ordre")
    d = dates[0]
    while d <= dates[-1]:
        if d not in dates:
            problems.append(f"jour manquant : {d}")
        d += dt.timedelta(days=1)
    if len(set(dates)) != len(dates):
        problems.append("date en double")
    for e in es:
        txt = json.dumps(e, ensure_ascii=False)
        if "—" in txt:
            problems.append(f"{e['date']} : tiret cadratin (à remplacer)")
        if "€" in txt:
            problems.append(f"{e['date']} : un prix apparaît, interdit avant validation")
        if e["format"] == "flash" and "rendu de travail" not in e["legende"].lower():
            problems.append(f"{e['date']} : légende Flash sans « rendu de travail »")
    return problems


def notification(e):
    """Texte du message du jour (court en tête, détail ensuite)."""
    lines = []
    lines.append(f"☀️🌙 Singulier · {e['jour']}")
    lines.append(f"{e['format_label']} · {e['qui']}")
    lines.append(f"« {e['titre']} »")
    lines.append("")
    if e["hook_ecran"]:
        lines.append(f"Texte à l'écran : {e['hook_ecran']}")
    if e["hook_oral"]:
        lines.append(f"Première phrase : {e['hook_oral']}")
    lines.append(f"Où : {e['plateformes']} · Durée : {e['duree']}")
    lines.append("")
    lines.append("SCRIPT")
    for s in e["script"]:
        lines.append(f"• {s}")
    lines.append("")
    lines.append("COMMENT LE FILMER")
    lines.append(e["tournage"])
    lines.append("")
    lines.append("DA")
    lines.append(e["da"])
    if e.get("notes"):
        lines.append("")
        lines.append(f"⚠️ {e['notes']}")
    if e["legende"]:
        lines.append("")
        lines.append("LÉGENDE")
        lines.append(e["legende"])
        if e["cta"]:
            lines.append(e["cta"])
        if e["hashtags"]:
            lines.append(e["hashtags"])
    if e["stories"] and e["stories"] != "(voir script)":
        lines.append("")
        lines.append(f"STORIES : {e['stories']}")
    lines.append("")
    lines.append("Rushs : envoyez-les dans la session Claude (ou le dossier Drive « Singulier Rushs »), je monte et je vous renvoie la vidéo prête.")
    return "\n".join(lines)


def to_md(es):
    out = ["# Plan de communication Singulier", "",
           f"Du {date_fr(dt.date.fromisoformat(es[0]['date']))} au {date_fr(dt.date.fromisoformat(es[-1]['date']))}.",
           "Fichier généré par `build.py` à partir de `plan_data.py` : modifier `plan_data.py`, pas ce fichier.", ""]
    for ph in P.PHASES:
        out += [f"## Phase {ph['id']} : {ph['nom']} ({ph['du']} au {ph['au']})", "",
                f"**But :** {ph['but']}", f"**Indicateurs :** {ph['kpi']}", ""]
        for e in es:
            if e["phase"] != ph["nom"]:
                continue
            out += [f"### {e['jour'].capitalize()} · {e['titre']}", "",
                    f"- **Format :** {e['format_label']} ({e['plateformes']}, {e['duree']})",
                    f"- **Qui :** {e['qui']}"]
            if e["hook_ecran"]:
                out.append(f"- **Texte à l'écran :** {e['hook_ecran']}")
            if e["hook_oral"]:
                out.append(f"- **Première phrase :** {e['hook_oral']}")
            out += ["", "**Script**", ""] + [f"1. {s}" for s in e["script"]]
            if e["legende"]:
                out += ["", f"**Légende :** {e['legende']} {e['cta']}"]
                if e["hashtags"]:
                    out.append(f"`{e['hashtags']}`")
            if e["stories"] and e["stories"] != "(voir script)":
                out += ["", f"**Stories :** {e['stories']}"]
            if e.get("notes"):
                out += ["", f"> {e['notes']}"]
            out.append("")
    out += ["## Formats : tournage et DA", ""]
    for k, f in P.FORMATS.items():
        out += [f"### {f['label']}", "", f"- **Plateformes :** {f['plateformes']}", f"- **Durée :** {f['duree']}",
                f"- **Tournage :** {f['tournage']}", f"- **DA :** {f['da']}", ""]
    return "\n".join(out)


def today_paris():
    try:
        from zoneinfo import ZoneInfo
        return dt.datetime.now(ZoneInfo("Europe/Paris")).date()
    except Exception:
        return (dt.datetime.utcnow() + dt.timedelta(hours=1)).date()


def main():
    es = entries()
    args = sys.argv[1:]
    if args and args[0] == "--jour":
        d = args[1] if len(args) > 1 else today_paris().isoformat()
        hit = [e for e in es if e["date"] == d]
        if not hit:
            print(f"Aucun contenu prévu le {d}. Le plan couvre {es[0]['date']} au {es[-1]['date']}.")
            return 1
        print(notification(hit[0]))
        return 0
    if args and args[0] == "--semaine":
        start = today_paris()
        for e in es:
            d = dt.date.fromisoformat(e["date"])
            if start <= d < start + dt.timedelta(days=7):
                print(f"{e['jour']:<28} {e['format_label']:<32} {e['titre']}")
        return 0
    probs = check(es)
    json.dump({"phases": P.PHASES, "formats": P.FORMATS, "jours": es, "ouverture": P.OUVERTURE},
              open(os.path.join(HERE, "plan.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    open(os.path.join(HERE, "plan.md"), "w", encoding="utf-8").write(to_md(es))
    print(f"{len(es)} jours, du {es[0]['date']} au {es[-1]['date']}.")
    for p in probs:
        print("PROBLÈME :", p)
    return 1 if probs else 0


if __name__ == "__main__":
    sys.exit(main())
