export const environment = {
  production: false,
  siteUrl: 'http://localhost:4200',
  /** Emails allowed into the admin panel. Must match the list in firestore.rules. */
  admins: ['hello@zaviks.tech', 'saeedmurrad@gmail.com', 'smurrad@innovatixinc.com'],
  firebase: {
    apiKey: 'AIzaSyCxuzaZ-NKnp-hAN637Ps4FmaGwmjkyGeQ',
    authDomain: 'zaviks-tech-site.firebaseapp.com',
    projectId: 'zaviks-tech-site',
    appId: '1:166294371001:web:828389f98e6b60b62fb968',
  },
};
