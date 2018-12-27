# Présentation

Schoolx est LA solution de gestion de présence pour votre école démocratique.

> Comment est-ce possible ?

Vous dites-vous surement.

> Mon fichier excel est tellement bien pourtant, j'adore remplir ces petites cases chaque jour pendant 1h.

Vous dites-vous aussi. Nos développeurs (un seul pour le moment, on attend des invests pour embaucher) ont effectué une longue période d'immersion dans une école démocratique afin de VOUS apporter l'expertise que VOUS méritez. A l'écoute, attentif et l'oreille tendue, ils ont su comprendre votre besoin et ont ainsi pu établir un cahier des charges hors-normes ! Après plusieurs semaines de travail minutieux, nos développeurs sortent enfin la version 0.000001 de ce bête d'outil. Une version pre-alpha-crash-test que les critiques ont unanimement qualifié de "propre".

# Installation

A compléter 😬

## Éxecution avec pm2

Dans le dossier `back`, faites la commande :

```bash
pm2 -n back start "yarn start"
```

Dans le dossier `front`, faites les commandes :

```bash
yarn build
pm2 -n front start "serve -s build"
```
