# Vos droits, vos démarches — boîte à outils citoyenne

Collection d'outils statiques, indépendants et gratuits pour comprendre
un délai légal et générer le document correspondant, sans jamais
collecter de données.

## Principe commun à chaque outil

1. **Cadre légal sourcé** — articles de loi cités, résumés en langage clair.
2. **Calculateur de délai** quand c'est pertinent (délai avant une
   action, ou délai pour agir après un événement déclencheur).
3. **Génération de document côté client** (PDF via jsPDF) — rien
   n'est envoyé à un serveur, tout se passe dans le navigateur.

## Outils inclus

| Outil | Dossier | Délai clé |
|---|---|---|
| Déclarer une manifestation | `declaration-manifestation/` | 3 à 15 jours francs |
| Recours gracieux | `recours-gracieux/` | 2 mois |
| Demander un document administratif | `demande-cada/` | réponse sous 1 mois |
| Exercer ses droits RGPD | `demande-rgpd/` | réponse sous 1 mois |
| Saisir le Défenseur des droits | `signalement-defenseur/` | aucun délai strict |
| Droit de retrait | `droit-retrait/` | immédiat |
| Préavis de grève | `preavis-greve/` | 5 jours francs |
| Lettre de rétractation | `retractation/` | 14 jours |
| Contester une amende | `contestation-amende/` | 45 jours (30 si majorée) |
| Mise en demeure | `mise-en-demeure/` | au choix (8-30 jours) |

## Structure

```
annuaire-citoyen/
├── index.html              ← page d'accueil / annuaire
├── shared/
│   ├── style.css            ← design system commun
│   └── shared.js            ← calculateur de délai + générateur PDF génériques
└── <chaque-outil>/
    ├── index.html
    └── app.js                ← logique spécifique à l'outil
```

`declaration-manifestation/` garde pour l'instant sa propre copie de
`style.css` et `app.js` (première version du projet) plutôt que le
module partagé — à harmoniser si vous voulez unifier complètement le
design system.

## Déployer sur GitHub Pages

1. Poussez ce dossier tel quel dans un dépôt GitHub.
2. Paramètres du dépôt → **Pages** → branche `main`, dossier racine `/`.
3. Le site est disponible à `https://<votre-utilisateur>.github.io/<nom-du-depot>/`.

Aucune étape de build : tout est statique, jsPDF est chargé depuis un CDN.

## Ajouter un nouvel outil

1. Créez un dossier `<nom-de-loutil>/` avec un `index.html` et un `app.js`.
2. Réutilisez `shared/style.css` et `shared/shared.js` (voir un outil
   existant comme modèle, par exemple `retractation/`).
3. Ajoutez une carte dans `index.html` (page d'accueil) pointant vers
   le nouvel outil.
4. Sourcez toujours le cadre légal depuis un texte officiel
   (legifrance.gouv.fr, service-public.fr, ou un site `.gouv.fr`).

## Limites à garder en tête

- Les calculs de délai sont **indicatifs**. La notion de « jour franc »
  et les cas particuliers (jours fériés, week-ends, procédures
  spécifiques) peuvent faire varier la date exacte — chaque outil le
  rappelle.
- Ces outils **génèrent des documents**, ils n'organisent, ne
  coordonnent ni n'accompagnent aucune démarche collective. C'est ce
  qui en fait des outils d'information plutôt que des plateformes à
  risque juridique.
- Pour un litige complexe ou à fort enjeu, l'avis d'un professionnel
  du droit (avocat, association agréée, permanence juridique
  gratuite) reste recommandé.

## Licence et responsabilité

Fourni « en l'état », à but d'information et de facilitation
administrative. Vérifiez systématiquement les informations générées
auprès de l'autorité ou de l'organisme destinataire avant tout envoi.
