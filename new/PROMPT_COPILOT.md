# PROMPT COPILOT — Refonte site Entreprise Sow et Frères

## Contexte

Je veux remplacer les 3 fichiers de mon site vitrine (index.html, styles.css, script.js)
par les nouvelles versions que j'ai générées dans D:\workspace\Building-Website\new.
Ne modifie PAS la logique ni les classes —
remplace uniquement le contenu fichier par fichier.

## Instructions

### 1. Remplace le contenu de `index.html`

Remplace TOUT le contenu de `index.html` par le fichier `index.html` fourni (nouvelle version).
Conserve exactement la structure, les classes, les attributs data-\* et les liens.

### 2. Remplace le contenu de `styles.css`

Remplace TOUT le contenu de `styles.css` par le fichier `styles.css` fourni (nouvelle version).
Ne garde rien de l'ancien CSS.

### 3. Remplace le contenu de `script.js`

Remplace TOUT le contenu de `script.js` par le fichier `script.js` fourni (nouvelle version).
Note : la variable BACKEND_URL en ligne ~67 doit pointer vers ton endpoint Render actuel.

## Personnalisations à faire après remplacement

1. **Photo du DG** : Dans index.html, section #dg, remplace le `.dg-placeholder`
   par une vraie balise `<img>` avec la photo d'Alassane SOW :

   ```html
   <img
     src="./images/dg-alassane-sow.jpg"
     alt="Alassane SOW, Directeur Général"
   />
   ```

2. **Photos de galerie** : Remplace les URLs Unsplash de la section #galerie
   par tes vraies photos de chantiers, réalisations et activités.
   Format recommandé : `./images/galerie/construction-01.jpg`

3. **BACKEND_URL dans script.js** : Ligne ~67, remplace la valeur par ton URL Render :

   ```js
   const BACKEND_URL = "https://TON-SERVICE.onrender.com/send";
   ```

   Assure-toi aussi que `digitalesf.com` est dans la liste CORS de ton server.js.

4. **Email de contact** dans index.html section #contact :
   Remplace `contact@digitalesf.com` par ton vrai email professionnel.

5. **Favicon** : Ajoute dans `<head>` de index.html :
   ```html
   <link rel="icon" type="image/png" href="./images/favicon.png" />
   ```

## Structure de dossiers attendue

```
/
├── index.html        ← nouveau fichier
├── styles.css        ← nouveau fichier
├── script.js         ← nouveau fichier
└── images/
    ├── dg-alassane-sow.jpg
    ├── favicon.png
    └── galerie/
        ├── construction-01.jpg
        ├── construction-02.jpg
        └── ...
```

## Vérifications post-remplacement

- [ ] `npm run dev` ou ouvrir `index.html` en local sans erreur console
- [ ] Mobile responsive OK (nav hamburger, grilles)
- [ ] Galerie filtres fonctionnels (tous/construction/agriculture/commerce/services)
- [ ] Lightbox s'ouvre au clic sur les images
- [ ] Formulaire valide et envoie bien au backend
- [ ] Ancres de navigation (#services, #galerie, #digital, #entreprise, #dg, #contact) OK
- [ ] Liens pôle digital (DerewolPrint, SmartStock, SmartPointage, RestoPlus) fonctionnels
