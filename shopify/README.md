# Boutique Shopify de Singulier

Le site reste un site statique (`index.html`). Shopify gère les produits, le stock, le panier et le paiement. Le site lit le catalogue avec la **Storefront API** et envoie les clientes vers le **checkout Shopify** pour payer.

| Offre | Dans Shopify | Sur le site |
| --- | --- | --- |
| Flash | Un produit par bague, stock de 1, poignée `flash-01` à `flash-66` | Prix boutique, mention « Vendue » quand le stock tombe à 0 |
| Pluriel | Un produit par modèle, une variante par taille (48 à 60), poignées `pluriel-granule`, `pluriel-goutte`, `pluriel-racine`, `pluriel-etoile` | Le bouton « Ajouter au panier » prend la taille choisie |
| Sur mesure | Pas de produit | Le formulaire part vers le formulaire de contact de la boutique |

Tant que `config.js` est vide, le site reste en mode démonstration : prix estimés, panier et compte enregistrés dans le navigateur.

## 1. Créer la boutique

1. Créez un compte sur shopify.com et choisissez la France comme pays.
2. Dans **Paramètres > Paiements**, activez Shopify Payments, puis Klarna (paiement en 3 fois).
3. Dans **Paramètres > Expédition et livraison**, créez un tarif à 0 € pour la France métropolitaine (livraison offerte).
4. Dans **Paramètres > Comptes clients**, gardez les nouveaux comptes clients activés : le bouton « Mon compte » du site y renvoie.

## 2. Importer les produits

1. Mettez d'abord le site en ligne (voir le README principal) : les images du fichier d'import sont lues à l'adresse `https://nndri88-hash.github.io/-Singulier/shopify/images/`.
2. Dans **Produits > Importer**, choisissez `produits.csv`.
3. Les 70 produits arrivent **en brouillon** (66 bagues Flash et 4 modèles Pluriel, avec 7 tailles chacun).
4. Vérifiez chaque fiche avant de la publier :
   - le **prix** est le milieu de la fourchette estimée sur le site, à remplacer par votre prix réel ;
   - la **pierre** et son poids sont des propositions ;
   - les **images** sont des rendus 3D, à remplacer par vos photos.
5. Publiez les produits sur le canal **Headless** (étape 3) pour que le site les voie.

## 3. Obtenir le jeton Storefront

1. Dans l'admin, ouvrez **Paramètres > Applications et canaux de vente > Boutique Shopify App Store**, puis installez le canal **Headless**.
2. Créez un storefront, puis copiez le **jeton d'accès public** (Public access token).
3. Dans les autorisations du storefront, cochez au minimum :
   - lire les produits, les variantes et les collections ;
   - lire et modifier les paniers (`unauthenticated_read_checkouts`, `unauthenticated_write_checkouts` ou leurs équivalents « carts »).

## 4. Remplir config.js

```js
window.SINGULIER_CONFIG = {
  shopify: {
    domain: 'votre-boutique.myshopify.com',
    storefrontToken: 'le jeton public copié à l’étape 3',
    apiVersion: '2026-07'
  },
  ...
};
```

Le jeton public est fait pour être visible dans le navigateur. Ne mettez jamais à sa place un jeton d'administration (il commence par `shpat_`).

## 5. Ce qui se branche automatiquement

- **Prix et disponibilité** : lus dans Shopify au chargement de la page.
- **Panier** : créé dans Shopify, gardé d'une visite à l'autre, avec le bouton « Passer au paiement sécurisé ».
- **Mon compte** : renvoie vers le compte client Shopify (connexion, création, commandes). Les favoris restent dans le navigateur.
- **Formulaire Sur mesure** : envoyé au formulaire de contact de la boutique. Les images d'inspiration ne passent pas par ce formulaire : la cliente les envoie en réponse à votre premier e-mail.
- **Revue mensuelle** : l'adresse est ajoutée aux clients de la boutique avec les étiquettes `newsletter` et `revue-pierres`, abonnée au marketing par e-mail. Vous préparez la revue avec Shopify Email.

## Mettre à jour le catalogue

`produits.csv` et `images/` sont générés à partir des données du site (bagues, pierres, prix estimés). Si vous changez une bague dans `index.html`, demandez à Claude de régénérer ces fichiers.

## Thème de la boutique (bijouteriesingulier.com)

La page d'accueil du thème « Singulier — site » est le site lui-même : même HTML, même CSS, même JavaScript. Les fiches produit, les collections et le panier Shopify reprennent les couleurs (crème, bordeaux, rose) et la police Cormorant du site.

- `shopify/theme/build.py` génère les fichiers du thème à partir de `index.html` : `assets/singulier.css`, `assets/singulier.js`, `layout/singulier.liquid` et `templates/index.liquid`.
- Après une modification de `index.html`, relancez `python3 shopify/theme/build.py`, puis renvoyez ces quatre fichiers dans le thème (demandez à Claude).
- Le contenu de la page d'accueil se modifie dans `index.html`, pas dans l'éditeur de thème de Shopify.
- Le choix fait dans le bandeau cookies du site (l'éclipse) est transmis à Shopify. Désactivez la bannière de cookies de Shopify (Paramètres > Confidentialité des clients > Bannière de cookies) pour n'en garder qu'une.
