export const environment = {
  production: false,
  siteUrl: 'http://localhost:4200',
  /** Emails allowed into the admin panel. Must match the list in firestore.rules. */
  admins: ['hello@zaviks.tech', 'saeedmurrad@gmail.com', 'smurrad@innovatixinc.com'],
  firebase: {
    apiKey: 'AIzaSyBiezS9_JBqRwKkWmqpXrbccMgwNM7mFbk',
    authDomain: 'zaviks-tech.firebaseapp.com',
    projectId: 'zaviks-tech',
    appId: '1:851579013918:web:f662533cac903fecea970f',
  },
};
