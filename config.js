/*
 * Réglages du site Singulier.
 *
 * Boutique Shopify : remplissez « domain » et « storefrontToken » pour brancher
 * les produits, le panier et le paiement sur votre boutique. Laissés vides, le site
 * reste en mode démonstration (prix estimés, panier enregistré dans le navigateur).
 *
 *   domain           l'adresse myshopify de la boutique, par exemple « singulier.myshopify.com »
 *   storefrontToken  le jeton public de la Storefront API (canal « Headless » de Shopify).
 *                    Ce jeton est fait pour être visible dans le navigateur. Ne mettez jamais
 *                    ici un jeton d'administration (il commence par « shpat_ »).
 *   apiVersion       la version de l'API Storefront
 *
 * Marche à suivre : shopify/README.md
 */
window.SINGULIER_CONFIG = {
  shopify: {
    domain: '',
    storefrontToken: '',
    apiVersion: '2026-07'
  },
  handTracking: {
    // Bibliothèque MediaPipe et modèle de repérage de la main, chargés seulement au moment de l'essayage
    cdn: 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14',
    model: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task'
  }
};
