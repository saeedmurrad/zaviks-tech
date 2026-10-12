# Zaviks Tech

Company site for the Zaviks Tech shelf: ready-made software, licensed for a business, then customised, deployed, and maintained.

The live site is [saeedmurrad.github.io/zaviks-tech](https://saeedmurrad.github.io/zaviks-tech/).

## Stack

- Angular 22, prerendered so each page is real HTML
- Firebase Firestore for contact and product requests
- GitHub Pages for hosting

ParkSpace, the driveway marketplace, is the product with a public demo: [saeedmurrad.github.io/driveway-parking-app](https://saeedmurrad.github.io/driveway-parking-app/). The source is [saeedmurrad/driveway-parking-app](https://github.com/saeedmurrad/driveway-parking-app). This site links to that demo. It does not rebuild it.

## Run locally

```bash
npm install
npm start
```

Open http://localhost:4200/.

## Production build

```bash
npm run build:pages
```

The static files are in `dist/zaviks-tech/browser`. Pushes to `main` deploy that folder with GitHub Actions.

## Enquiries

Contact and request forms write to the `enquiries` collection. Rules allow a checked create and deny every read. The web config lives in `src/environments/environment.production.ts`. If that config is empty, the form offers an email instead of pretending the message was stored.

Deploy rule changes with:

```bash
npx firebase-tools deploy --only firestore:rules --project zaviks-tech-site
```

The public contact address is `hello@zaviks.tech`, in `src/app/data/site.ts`.
