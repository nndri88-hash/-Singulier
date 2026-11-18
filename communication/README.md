# Communication Singulier : Instagram et TikTok

Claude est votre community manager jusqu'à l'ouverture des commandes.

| Fichier | Rôle |
| --- | --- |
| `benchmark/2026-11-18.md` | Benchmark de départ : algorithmes, tendances bijouterie, formats, comptes à suivre |
| `benchmark/AAAA-MM-JJ.md` | Benchmark de chaque semaine (ajouté le lundi) |
| `benchmark/captures/` | Vos relevés de Reels pour `/ig-viral` (modèle : `modele.tsv`) |
| `plan_data.py` | **Le plan**, jour par jour, du 18 novembre au 31 janvier : script, tournage, DA, légende, stories |
| `plan.md`, `plan.json` | Le plan lisible, généré par `build.py` |
| `voice.md` | Votre voix de marque, lue par les skills `/ig-*` |
| `rushs/montage.py` | Le monteur : rushs → Reel vertical prêt à publier |
| `../.claude/skills/ig-*` | Les 13 skills Instagram (dont `/ig-viral`, `/ig-reel`, `/ig-caption`) |

## Le rythme

| Jour | Contenu | Qui |
| --- | --- | --- |
| Lundi | Reel atelier (ASMR, process) | Maëline |
| Mardi | Carrousel (pierres, coulisses, FAQ) | Nina (je monte les slides) |
| Mercredi | Reel duo sur un format tendance | Les deux |
| Jeudi | Révélation « Flash n° XX / 66 » | Maëline filme le croquis, je monte |
| Vendredi | Storytime face caméra | Nina |
| Samedi | Porté / lifestyle | Maëline |
| Dimanche | Stories, sondages, questions | Les deux |

Stories tous les jours. Chaque vidéo est publiée en natif sur Instagram **et** TikTok (jamais avec un filigrane de l'autre réseau).

## Ce qui tourne tout seul

- **Chaque matin à 8 h 47 (Paris)** : une notification avec le contenu du jour, le script, comment le filmer, la DA, la légende et les stories.
- **Chaque lundi à 7 h 13 (Paris)** : benchmark de la semaine (tendances + `/ig-viral` sur vos captures), puis mise à jour des 14 jours suivants du plan. Le résumé arrive en notification.

## Envoyer vos rushs

1. Filmez en vertical, 4K 30 i/s, sans filtre ni musique.
2. Envoyez les fichiers dans une session Claude Code (glisser-déposer dans le chat) avec la date du contenu, par exemple « rushs du 21/11 ». Pour les gros fichiers, déposez-les dans un dossier Google Drive « Singulier Rushs / 2026-11-21 » et donnez-moi le lien.
3. Je choisis les meilleurs passages, je monte avec `rushs/montage.py` (recadrage 9:16, coupes au rythme, textes dans la zone sûre, son normalisé, carte logo de fin) et je vous renvoie la vidéo + la légende + les hashtags.
4. Vous ajoutez le son tendance **dans l'application** au moment de publier (les droits musicaux passent par Instagram et TikTok, pas par le fichier).

## Mettre à jour le plan à la main

```bash
python3 communication/build.py              # régénère plan.md / plan.json et vérifie le plan
python3 communication/build.py --jour        # contenu du jour
python3 communication/build.py --semaine     # les 7 prochains jours
```

## À confirmer par vous

- [ ] Le nom des comptes (@singulier ?) et s'ils existent déjà.
- [ ] La date d'ouverture des commandes (hypothèse : février 2027, avant la Saint-Valentin). Changer `OUVERTURE` dans `plan_data.py`.
- [ ] Prenez-vous déjà des demandes Sur mesure avant l'ouverture ?
- [ ] Vos vrais temps de fabrication (vidéos du 30 novembre et du 15 janvier).
- [ ] La bague secrète pour Nina (23 décembre) : Maëline, à préparer dès maintenant.
