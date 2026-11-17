"""Génère les fichiers du thème Shopify à partir de index.html.

La page d'accueil du thème reprend le site tel quel : même HTML, même CSS, même JavaScript.
Lancer depuis la racine du dépôt :  python3 shopify/theme/build.py
Puis envoyer les fichiers de shopify/theme/ dans le thème « Singulier — site ».
"""
import pathlib, re

ROOT = pathlib.Path(__file__).resolve().parents[2]
OUT = ROOT / 'shopify' / 'theme'
html = (ROOT / 'index.html').read_text(encoding='utf-8')

head = html.split('<head>', 1)[1].split('</head>', 1)[0]
body = html.split('<body>', 1)[1].split('</body>', 1)[0]

# CSS : le bloc <style> du <head>
css = re.search(r'<style>\n?(.*?)</style>', head, re.S).group(1)
# Liens de polices (Google Fonts) et balises meta à garder dans la mise en page
font_links = '\n'.join(l for l in re.findall(r'<link [^>]*>', head) if 'canonical' not in l)

# JavaScript : le dernier <script> du corps (le site), les scripts CDN restent dans la mise en page
scripts = list(re.finditer(r'<script(?P<attrs>[^>]*)>(?P<code>.*?)</script>', body, re.S))
main = scripts[-1]
js = main.group('code')
cdn = [m.group(0) for m in scripts if 'src="http' in m.group('attrs')]
markup = body
# On retire de la page : le script principal, config.js et les scripts CDN (repris par la mise en page)
for m in reversed(scripts):
    a = m.group('attrs')
    if m is main or 'src=' in a:
        markup = markup[:m.start()] + markup[m.end():]
markup = markup.strip() + '\n'

assert '{{' not in markup and '{%' not in markup, 'syntaxe Liquid dans le HTML'

(OUT / 'assets').mkdir(parents=True, exist_ok=True)
(OUT / 'layout').mkdir(parents=True, exist_ok=True)
(OUT / 'templates').mkdir(parents=True, exist_ok=True)
(OUT / 'assets' / 'singulier.css').write_text(css, encoding='utf-8')
(OUT / 'assets' / 'singulier.js').write_text(js, encoding='utf-8')
(OUT / 'templates' / 'index.liquid').write_text(
    "{%- layout 'singulier' -%}\n{%- comment -%} Page d'accueil : le site Singulier, généré par shopify/theme/build.py à partir de index.html. {%- endcomment -%}\n{% raw %}\n" + markup + "{% endraw %}\n",
    encoding='utf-8')

layout = f"""<!doctype html>
<html lang="fr" data-side="nina">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{{{{ shop.name }}}}</title>
<meta name="description" content="Singulier : bijoux faits main, sertis et gravés par Maëline. Bagues sur mesure, éditions Flash et collection Pluriel.">
<meta name="theme-color" content="#2B0202">
<link rel="canonical" href="{{{{ canonical_url }}}}">
{font_links}
{{{{ 'singulier.css' | asset_url | stylesheet_tag }}}}
{{{{ content_for_header }}}}
</head>
<body>
{{{{ content_for_layout }}}}
{{%- comment -%}} Vrais formulaires Shopify (jetons anti-spam) remplis par le site : demandes Sur mesure et revue mensuelle {{%- endcomment -%}}
<style>.sg-shopify-form{{display:none}}</style>
{{%- form 'contact', id: 'sg-contact', class: 'sg-shopify-form' -%}}{{%- endform -%}}
{{%- form 'customer', id: 'sg-customer', class: 'sg-shopify-form' -%}}{{%- endform -%}}
<script>
window.SINGULIER_CONFIG = {{
  shopify: {{
    domain: {{{{ request.host | json }}}},
    storefrontToken: 'dba8afe69edb7c1db9a36f5deba2800c',
    apiVersion: '2026-07'
  }},
  handTracking: {{
    cdn: 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14',
    model: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task'
  }}
}};
</script>
{chr(10).join(cdn)}
<script src="{{{{ 'singulier.js' | asset_url }}}}"></script>
</body>
</html>
"""
(OUT / 'layout' / 'singulier.liquid').write_text(layout, encoding='utf-8')
for p in ['assets/singulier.css', 'assets/singulier.js', 'templates/index.liquid', 'layout/singulier.liquid']:
    print(p, (OUT / p).stat().st_size, 'octets')
