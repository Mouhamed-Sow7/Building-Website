# Bâtisseur — Template site Construction & Terrains

Un site vitrine moderne et responsive pour une entreprise de construction et de vente de terrains.

## Démarrage

1. Ouvrez `index.html` dans votre navigateur.
2. Éditez les sections (Services, Entreprise, DG, Projets, Contact) selon vos informations.

## Personnalisation rapide

- Nom/branding: modifiez le logo texte dans `index.html` (`Bâtisseur`).
- Couleurs: changez les variables CSS dans `styles.css` (section `:root`).
- Images: remplacez les URLs Unsplash par vos visuels.
- Coordonnées: mettez à jour l'adresse, le téléphone et l'email dans la section `#contact`.
- DG: modifiez le nom, la photo et le message dans la section `#dg`.

## Formulaire de contact

Le formulaire inclut une validation côté client. Pour l'envoi réel:

- Option 1: Servez le site via Netlify et activez Netlify Forms (ajoutez `name="contact"` et l'attribut `netlify` au `<form>`).
- Option 2: Utilisez EmailJS (`emailjs-com`) côté client.
- Option 3: Créez un endpoint (Node/Express, PHP, etc.) et faites un `fetch` POST dans `script.js`.

## Déploiement

- GitHub Pages, Netlify, Vercel ou hébergement classique.

## Licence

Usage libre pour vos projets professionnels. Aucune garantie.
