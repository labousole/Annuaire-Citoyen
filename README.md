# Déclarer une manifestation

Outil statique, indépendant et gratuit pour générer une déclaration
préalable de manifestation sur la voie publique, conforme au contenu
exigé par les articles L.211-1 à L.211-4 du code de la sécurité
intérieure.

**Ce que fait ce site :**
- Rappelle le cadre légal (délais, contenu obligatoire, sanctions).
- Calcule la fenêtre de dépôt (3 à 15 jours francs avant l'événement).
- Génère un document PDF pré-rempli à partir d'un formulaire.
- Affiche les coordonnées connues de quelques préfectures (annuaire
  partiel, à compléter).

**Ce que ce site ne fait pas :**
- Il ne collecte, ne transmet ni ne stocke aucune donnée saisie —
  tout le traitement (calcul, génération du PDF) a lieu dans le
  navigateur de l'utilisateur.
- Il n'organise, ne coordonne ni n'héberge aucun événement, et ne
  propose aucune fonction de mise en relation entre participants.
- Il n'est ni édité ni approuvé par l'État. Un bandeau le rappelle
  sur chaque page.

## Déployer sur GitHub Pages

1. Créez un dépôt GitHub et poussez ce dossier tel quel.
2. Dans les paramètres du dépôt → **Pages**, choisissez la branche
   `main` et le dossier racine `/`.
3. Le site sera disponible à `https://<votre-utilisateur>.github.io/<nom-du-depot>/`.

Aucune étape de build n'est nécessaire : le site est 100 % statique
(HTML/CSS/JS), avec génération de PDF côté client via la bibliothèque
[jsPDF](https://github.com/parallax/jsPDF) chargée depuis un CDN.

## Compléter l'annuaire des préfectures

Le fichier `prefectures.json` liste les coordonnées connues, par
département, pour l'envoi de la déclaration. Il est volontairement
incomplet au démarrage. Pour ajouter un département, ouvrez une
pull request avec une entrée suivant ce format :

```json
{
  "code": "75",
  "nom": "Paris",
  "autorite": "Préfecture de police de Paris",
  "adresse": "…",
  "telephone": "…",
  "email": "…",
  "source": "URL de la page officielle utilisée comme référence"
}
```

Sourcez toujours l'information depuis un site `.gouv.fr` officiel.

## Fichiers

- `index.html` — structure de la page
- `style.css` — mise en forme
- `app.js` — calculateur de délai, annuaire, génération du PDF
- `prefectures.json` — données de l'annuaire

## Licence et responsabilité

Projet fourni « en l'état », à but d'information et de facilitation
administrative. Vérifiez systématiquement les informations générées
et les coordonnées affichées auprès de l'autorité destinataire avant
tout envoi.
