# functional-programming

## De Volkskrant

Voor de Volkskrant zullen we het parkeren in Nederland onderzoeken en waardevolle data verzamelen en daar digitaal interactieve visualisaties van te maken die journalisten en onderzoekers kunnen gebruiken als interessante onderwerpen.

## Hoofdvraag

### Wat gebeurt er met de betalingsmethodes, als de verkooppunten stijgen/dalen?

De wereld is continu in verandering. Technologisering zorgt ervoor dat we steeds op makkelijkere manieren kunnen betalen voor diensten. Dit heeft ook gevolgen op de verkooppunten van de parkeergarage. Tegenwoordig is het zelfs mogelijk om je mobiel te scannen op het moment dat je in een garage rijdt. Daalt het aantal verkooppunten in Nederland door technologisering? En zijn er steeds minder plekken waar we contant kunnen betalen?

## Deelvragen

* Hoeveel verkooppunten zijn er op nu ten opzichte van vijf jaar geleden?

Om antwoord te kunnen geven op de vraag moeten we eerst in kaart brengen wat het aantal verkooppunten is in Nederland op dit moment en of er sprake is van een stijging of een daling.

* Welke betalingsopties kennen we in Nederland?

Het is belangrijk om te weten welke betalingsopties we op dit moment kennen in Nederland zodat we kunnen kijken naar welke betalingsopties wellicht zijn verdwenen en welke nieuwe betalingsopties we hebben gekregen.

* Welke verkooppunten hebben deze nieuwe betalingsopties?

Het is interessant om in kaart te brengen welke steden gebruik maken van de nieuwste betalingsopties. Zijn er steden die op dit gebied nog achterlopen op de rest?

* Welke betalingsopties zijn verminderd ten opzichte van vijf jaar geleden?

Het is interessant om in kaart te brengen welke betalingsopties zijn verminderd of misschien zelfd verdwenen? Wordt het steeds lastiger om contant te betalen voor het parkeren? Of verdwijnt het betalen met creditcard juist?

## Variabelen

Om deze vragen te beantwoorden zal ik de [Open Data Parkeren: VERKOOPPUNT](https://opendata.rdw.nl/d/fk68-nf2y/visualization) en de [Open Data Parkeren: BETAALMETHODE VERKOOPPUNT](https://opendata.rdw.nl/d/j96a-7nhx/visualization) gebruiken.

#### Open Data Parkeren: VERKOOPPUNT

Deze dataset heeft de volgende relevante variabelen
* StartDateSellingPoint (Datum vanaf wanneer een verkooppunt actief is)
* EndDateSellingPoint (Datum vanaf wanneer een verkooppunt niet meer actief is)
* SellingPointDesc (Omschrijving van een verkooppunt)

#### Open Data Parkeren: BETAALMETHODE VERKOOPPUNT

Deze dataset heeft de volgende relevante variabelen
* PaymentMethod (Betaal methode die gebruikt kan worden voor het betalen van parkeren)
* StartDatePaymentMethod  (Begindatum van een periode waarin de betalingsmogelijkheid geldig is)
* EndDatePaymentMethod (Einddatum van een periode waarin de betalingsmogelijkheid geldig is)
* SellingPointNumber (Identificatie van een verkooppunt)

## Verwachtingen

Mijn hypothese is dat er stijging te zien zal zijn in het digitaal parkeren en een daling in het cash betalen. 

# Installation

Clone this repo
```
git clone https://github.com/bbawuah/functional-programming.git
```

Then, navigate to this folder and run:
```
npm install
```

Run dev server:
```
npm run dev
```

Dependencies
```json
    "devDependencies": {
    "@babel/cli": "^7.10.5",
    "@babel/core": "^7.10.5",
    "@babel/preset-env": "^7.10.4",
    "@types/react": "^16.9.43",
    "@types/react-dom": "^16.9.8",
    "@types/react-router-dom": "^5.1.5",
    "@types/webpack-env": "^1.15.2",
    "@typescript-eslint/eslint-plugin": "^3.10.1",
    "@typescript-eslint/eslint-plugin-tslint": "^3.7.0",
    "@typescript-eslint/parser": "^3.10.1",
    "eslint": "^7.12.0",
    "eslint-config-prettier": "^6.14.0",
    "eslint-plugin-jsdoc": "^30.0.3",
    "eslint-plugin-prefer-arrow": "^1.2.2",
    "eslint-plugin-prettier": "^3.1.4",
    "eslint-plugin-react": "^7.20.3",
    "prettier": "^2.1.2",
    "source-map-loader": "^1.0.1",
    "ts-loader": "^8.0.1",
    "tslint": "^6.1.2",
    "typescript": "^3.9.7",
    "webpack": "^4.43.0",
    "webpack-cli": "^3.3.12"
  },
  "dependencies": {
    "@babel/polyfill": "^7.10.4",
    "@babel/preset-react": "^7.10.4",
    "@babel/preset-typescript": "^7.10.4",
    "css-loader": "^3.6.0",
    "node-sass": "^4.14.1",
    "path": "^0.12.7",
    "react": "^16.13.1",
    "react-dom": "^16.13.1",
    "react-router-dom": "^5.2.0",
    "sass-loader": "^9.0.2",
    "style-loader": "^1.2.1",
    "webpack-dev-server": "^3.11.0"
  }
```
