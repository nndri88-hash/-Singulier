# -Singulier
# Singulier

Marque de bijoux portée par Nina et Maëline.
Deux univers opposés qui s'attirent : bijoux faits main, sertis et gravés par Maëline, et bagues uniques sur mesure.

Couleurs : #2B0202 (Nina) et #AF3554 (Maëline).

Voir BRIEF.md pour le cahier des charges du site.

## Le site

- `index.html` : le site complet (HTML, CSS, JavaScript), avec Three.js, GSAP, qrcode-generator et MediaPipe chargés depuis des CDN.
- `config.js` : les réglages de la boutique Shopify et du suivi de la main. Vides, le site tourne en mode démonstration.
- `shopify/` : le fichier d'import des 70 produits, leurs images et la marche à suivre (`shopify/README.md`).

## Mise en ligne en HTTPS avec GitHub Pages

La caméra de l'essayage ne fonctionne qu'en HTTPS. GitHub Pages fournit l'HTTPS gratuitement.

1. Le dépôt est privé : GitHub Pages demande alors un abonnement GitHub Pro (4 $ par mois). Sinon, passez le dépôt en public dans **Settings > General > Danger Zone > Change visibility**.
2. Dans **Settings > Pages**, choisissez **Source : GitHub Actions**.
3. Fusionnez la branche de travail dans `main`. Le workflow `.github/workflows/pages.yml` publie le site à chaque mise à jour de `main`.
4. Le site est en ligne à l'adresse `https://nndri88-hash.github.io/-Singulier/`. Un nom de domaine (par exemple singulier.fr) se branche ensuite dans **Settings > Pages > Custom domain**.
