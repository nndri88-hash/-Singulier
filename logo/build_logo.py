"""Logo Singulier : l'anneau de diamant.

Symbole : une Lune qui couvre le Soleil. Il reste un mince croissant de lumière, qui s'épaissit
vers le haut à droite, et un éclat (le diamant) au point où la lumière s'échappe.
Le même dessin se lit comme une bague vue de face, sertie d'une pierre.
Nom : SINGULIER en Cormorant Garamond, espacé comme sur le site, vectorisé (aucune police requise).

Usage : python3 logo/build_logo.py <chemin du woff2 Cormorant Garamond 400>
"""
import math, pathlib, sys
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

OUT = pathlib.Path(__file__).resolve().parent
FONT = sys.argv[1]

COUL = {
    'bordeaux': {'trait': '#2B0202', 'lune': '#2B0202', 'lumiere': '#A67C2E', 'fond': '#FFF4EF'},
    'or':       {'trait': '#D9B873', 'lune': '#2B0202', 'lumiere': '#D9B873', 'fond': '#2B0202'},
    'rose':     {'trait': '#AF3554', 'lune': None, 'lumiere': '#AF3554', 'fond': '#FBE3DA'},
    'blanc':    {'trait': '#FFFFFF', 'lune': None,      'lumiere': '#FFFFFF', 'fond': '#2B0202'},
}

def symbole(c, x=0, y=0, s=1.0, dec=2.4):
    """Symbole dans un carré de 100 × 100, placé en (x, y) à l'échelle s."""
    cx, cy, R = 50, 53, 31
    dx, dy = -dec, dec            # décalage de la Lune : le croissant s'épaissit vers le haut à droite
    r = 29.2
    ang = math.radians(45)
    sx, sy = cx + R * math.cos(ang), cy - R * math.sin(ang)   # point d'où s'échappe la lumière
    L, l = 17, 2.1                # éclat à quatre branches : longues branches, taille fine
    star = (f"M{sx:.2f} {sy-L:.2f} C{sx+l*.35:.2f} {sy-l:.2f} {sx+l:.2f} {sy-l*.35:.2f} {sx+L:.2f} {sy:.2f} "
            f"C{sx+l:.2f} {sy+l*.35:.2f} {sx+l*.35:.2f} {sy+l:.2f} {sx:.2f} {sy+L:.2f} "
            f"C{sx-l*.35:.2f} {sy+l:.2f} {sx-l:.2f} {sy+l*.35:.2f} {sx-L:.2f} {sy:.2f} "
            f"C{sx-l:.2f} {sy-l*.35:.2f} {sx-l*.35:.2f} {sy-l:.2f} {sx:.2f} {sy-L:.2f}Z")
    mask_id = "eclipse"
    lune = (f'<circle cx="{cx+dx}" cy="{cy+dy}" r="{r}" fill="{c["lune"]}"/>' if c['lune'] else '')
    return (f'<g transform="translate({x:.2f} {y:.2f}) scale({s:.4f})">'
            f'<mask id="{mask_id}"><rect width="100" height="100" fill="#fff"/><circle cx="{cx+dx}" cy="{cy+dy}" r="{r}" fill="#000"/></mask>'
            f'<circle cx="{cx}" cy="{cy}" r="{R}" fill="{c["lumiere"]}" mask="url(#{mask_id})"/>'
            f'{lune}'
            f'<path d="{star}" fill="{c["lumiere"]}"/>'
            f'<circle cx="{sx:.2f}" cy="{sy:.2f}" r="2.3" fill="{c["lumiere"]}"/>'
            f'</g>')

font = TTFont(FONT)
gs, cmap, upm = font.getGlyphSet(), font.getBestCmap(), font['head'].unitsPerEm
CAP = font['OS/2'].sCapHeight or 0.63 * upm

def mot(texte, x, y_base, hauteur_cap, tracking_em, couleur):
    """Texte vectorisé : hauteur des capitales en unités SVG, espacement en em."""
    k = hauteur_cap / CAP
    paths, cur = [], 0.0
    for ch in texte:
        g = cmap[ord(ch)]
        pen = SVGPathPen(gs)
        gs[g].draw(TransformPen(pen, (k, 0, 0, -k, x + cur, y_base)))
        paths.append(pen.getCommands())
        cur += gs[g].width * k + tracking_em * upm * k
    largeur = cur - tracking_em * upm * k
    return f'<path fill="{couleur}" d="{" ".join(paths)}"/>', largeur

def svg(w, h, corps, fond=None, titre='Singulier'):
    bg = f'<rect width="{w}" height="{h}" fill="{fond}"/>' if fond else ''
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:.0f} {h:.0f}" width="{w:.0f}" height="{h:.0f}" role="img" aria-label="{titre}">'
            f'<title>{titre}</title>{bg}{corps}</svg>\n')

files = {}
for nom, c in COUL.items():
    # Symbole seul
    files[f'symbole-{nom}.svg'] = svg(100, 100, symbole(c))
    # Horizontal : symbole à gauche, nom à droite
    cap = 30
    texte, lw = mot('SINGULIER', 0, 0, cap, 0.32, c['trait'])
    S = 96
    pad = 12
    tx = pad + S + 26
    h = S + 2 * pad
    base = pad + S / 2 + cap / 2
    texte, lw = mot('SINGULIER', tx, base, cap, 0.32, c['trait'])
    files[f'logo-horizontal-{nom}.svg'] = svg(tx + lw + pad, h, symbole(c, pad, pad, S / 100) + texte)
    # Vertical : symbole au-dessus, nom dessous
    S2, cap2 = 150, 34
    _, lw2 = mot('SINGULIER', 0, 0, cap2, 0.32, c['trait'])
    w2 = max(S2, lw2) + 2 * pad
    texte2, _ = mot('SINGULIER', (w2 - lw2) / 2, pad + S2 + 26 + cap2, cap2, 0.32, c['trait'])
    files[f'logo-vertical-{nom}.svg'] = svg(w2, pad + S2 + 26 + cap2 + pad + 6, symbole(c, (w2 - S2) / 2, pad, S2 / 100) + texte2)
    # Nom seul
    texte3, lw3 = mot('SINGULIER', pad, pad + cap, cap, 0.32, c['trait'])
    files[f'nom-{nom}.svg'] = svg(lw3 + 2 * pad, cap + 2 * pad, texte3)

# Icône d'application et favicon : symbole sur fond bordeaux, coins arrondis
c = COUL['or']
files['favicon.svg'] = svg(100, 100, f'<rect width="100" height="100" rx="22" fill="#2B0202"/>' + symbole(c, 6, 4, .88, dec=4.2))

for f, s in files.items():
    (OUT / f).write_text(s, encoding='utf-8')
print(len(files), 'fichiers SVG écrits dans', OUT)
