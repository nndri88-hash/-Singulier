#!/usr/bin/env python3
"""
Monte un Reel / TikTok vertical à partir de rushs, avec ffmpeg.

Recette au format JSON :

{
  "sortie": "2026-11-21-serti.mp4",
  "plans": [
    {"fichier": "IMG_0012.MOV", "debut": 1.5, "fin": 6.0},
    {"fichier": "IMG_0013.MOV", "debut": 0, "fin": 4.2, "vitesse": 4},
    {"fichier": "croquis.jpg", "duree": 2.5}
  ],
  "textes": [
    {"de": 0, "a": 2.5, "texte": "Ce petit bruit, c'est une pierre qui ne bougera plus jamais.", "style": "maeline"},
    {"de": 12, "a": 16, "texte": "Sertie par Maëline.", "style": "maeline", "position": "bas"}
  ],
  "son": "original",            // "original", "aucun" (on ajoute le son tendance dans l'app) ou chemin d'un mp3
  "logo_fin": true              // ajoute le symbole Singulier sur fond bordeaux pendant 1,5 s
}

    python3 montage.py recette.json --rushs dossier_des_rushs/ --out dossier_sortie/

Sortie : MP4 H.264 1080 × 1920, 30 i/s, son normalisé à -14 LUFS, sans filigrane.
Les textes restent dans la zone sûre (ni en haut sous le nom du compte, ni en bas sous la légende).
"""
import argparse
import json
import os
import shutil
import subprocess
import sys
import tempfile

W, H, FPS = 1080, 1920, 30
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
LOGO = os.path.join(ROOT, "logo", "png", "symbole-or.png")

STYLES = {
    # couleur du texte, couleur de l'ombre, taille
    "maeline": ("white", "0x3E0E1B@0.55", 58),
    "nina": ("0xF6E7E4", "black@0.7", 58),
    "flash": ("0xD9B873", "black@0.0", 76),
    "titre": ("white", "black@0.6", 84),
}
FONTS = [
    os.path.join(HERE, "polices", "Manrope-Bold.ttf"),
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
]
FONT_SERIF = [
    os.path.join(HERE, "polices", "CormorantGaramond-Medium.ttf"),
    "/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf",
]


def first(paths):
    for p in paths:
        if os.path.exists(p):
            return p
    sys.exit("Aucune police trouvée.")


def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        sys.stderr.write(r.stderr[-3000:])
        sys.exit(f"ffmpeg a échoué : {' '.join(cmd[:6])}…")


def is_image(path):
    return os.path.splitext(path)[1].lower() in (".jpg", ".jpeg", ".png", ".webp", ".heic")


def wrap(text, width=26):
    words, lines, cur = text.split(), [], ""
    for w in words:
        if len(cur) + len(w) + 1 > width and cur:
            lines.append(cur)
            cur = w
        else:
            cur = (cur + " " + w).strip()
    if cur:
        lines.append(cur)
    return "\n".join(lines)


def render_plan(i, p, rushs, tmp, keep_audio):
    src = p["fichier"] if os.path.isabs(p["fichier"]) else os.path.join(rushs, p["fichier"])
    out = os.path.join(tmp, f"plan{i:02d}.mp4")
    fit = (f"scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},setsar=1,fps={FPS}")
    if is_image(src):
        d = float(p.get("duree", 2.5))
        # léger zoom lent sur les images fixes (croquis, rendus)
        vf = (f"scale={W*2}:{H*2}:force_original_aspect_ratio=increase,crop={W*2}:{H*2},"
              f"zoompan=z='min(zoom+0.0008,1.08)':d={int(d*FPS)}:s={W}x{H}:fps={FPS},setsar=1")
        run(["ffmpeg", "-y", "-loop", "1", "-i", src, "-f", "lavfi", "-i", "anullsrc=r=48000:cl=stereo",
             "-t", str(d), "-vf", vf, "-c:v", "libx264", "-pix_fmt", "yuv420p", "-c:a", "aac", "-shortest", out])
        return out
    speed = float(p.get("vitesse", 1))
    ss, to = float(p.get("debut", 0)), p.get("fin")
    vf = fit + (f",setpts=PTS/{speed}" if speed != 1 else "")
    cmd = ["ffmpeg", "-y", "-ss", str(ss)] + (["-to", str(to)] if to is not None else []) + ["-i", src]
    has_audio = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "a", "-show_entries",
                                "stream=index", "-of", "csv=p=0", src], capture_output=True, text=True).stdout.strip()
    if keep_audio and has_audio and speed == 1:
        cmd += ["-vf", vf, "-af", "aresample=48000", "-c:a", "aac", "-ac", "2"]
    else:
        cmd += ["-f", "lavfi", "-i", "anullsrc=r=48000:cl=stereo", "-map", "0:v", "-map", "1:a", "-shortest",
                "-vf", vf, "-c:a", "aac"]
    cmd += ["-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p", out]
    run(cmd)
    return out


def logo_card(tmp):
    out = os.path.join(tmp, "logo.mp4")
    run(["ffmpeg", "-y", "-f", "lavfi", "-i", f"color=c=0x2B0202:s={W}x{H}:r={FPS}:d=1.5",
         "-i", LOGO, "-f", "lavfi", "-i", "anullsrc=r=48000:cl=stereo",
         "-filter_complex", "[1]scale=360:-1[l];[0][l]overlay=(W-w)/2:(H-h)/2:format=auto,fade=in:0:10",
         "-t", "1.5", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-c:a", "aac", "-shortest", out])
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("recette")
    ap.add_argument("--rushs", default=".")
    ap.add_argument("--out", default=".")
    a = ap.parse_args()
    r = json.load(open(a.recette, encoding="utf-8"))
    son = r.get("son", "original")
    tmp = tempfile.mkdtemp(prefix="montage-")
    try:
        parts = [render_plan(i, p, a.rushs, tmp, son == "original") for i, p in enumerate(r["plans"])]
        if r.get("logo_fin") and os.path.exists(LOGO):
            parts.append(logo_card(tmp))
        lst = os.path.join(tmp, "liste.txt")
        open(lst, "w").write("".join(f"file '{p}'\n" for p in parts))
        joined = os.path.join(tmp, "joint.mp4")
        run(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", lst, "-c", "copy", joined])

        filters = []
        for k, t in enumerate(r.get("textes", [])):
            color, shadow, size = STYLES.get(t.get("style", "maeline"), STYLES["maeline"])
            font = first(FONT_SERIF if t.get("style") in ("flash", "nina") else FONTS)
            txtfile = os.path.join(tmp, f"t{k}.txt")
            open(txtfile, "w", encoding="utf-8").write(wrap(t["texte"]))
            y = {"haut": "h*0.18", "milieu": "(h-text_h)/2", "bas": "h*0.70-text_h"}[t.get("position", "milieu")]
            filters.append(
                f"drawtext=fontfile='{font}':textfile='{txtfile}':fontcolor={color}:fontsize={size}:"
                f"line_spacing=14:x=(w-text_w)/2:y={y}:box=1:boxcolor={shadow}:boxborderw=24:"
                f"enable='between(t,{t['de']},{t['a']})'")
        vf = ",".join(filters) if filters else "null"
        os.makedirs(a.out, exist_ok=True)
        final = os.path.join(a.out, r.get("sortie", "montage.mp4"))
        cmd = ["ffmpeg", "-y", "-i", joined]
        if son not in ("original", "aucun"):
            cmd += ["-i", son, "-map", "0:v", "-map", "1:a", "-shortest"]
        cmd += ["-vf", vf, "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-pix_fmt", "yuv420p",
                "-r", str(FPS), "-movflags", "+faststart"]
        if son == "aucun":
            cmd += ["-an"]
        else:
            cmd += ["-af", "loudnorm=I=-14:TP=-1.5:LRA=11", "-c:a", "aac", "-b:a", "192k", "-ar", "48000"]
        run(cmd + [final])
        print(final)
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


if __name__ == "__main__":
    main()
