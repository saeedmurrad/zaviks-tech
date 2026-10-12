export type MockKind = 'parkspace' | 'clientline' | 'stockroom';

export interface Product {
  slug: string;
  catalog: string;
  name: string;
  category: string;
  industry: string;
  promise: string;
  summary: string;
  priceLabel: string;
  priceValue: number | null;
  delivery: string;
  stack: string[];
  features: string[];
  customisation: string[];
  demo: 'live' | 'request';
  demoUrl?: string;
  /** Health endpoint of the demo API, pinged early so a sleeping free-tier server wakes before the visitor clicks. */
  demoHealthUrl?: string;
  demoNote?: string;
  mock: MockKind;
}

export const products: Product[] = [
  {
    slug: 'parkspace',
    catalog: '01',
    name: 'ParkSpace',
    category: 'Marketplace',
    industry: 'Mobility',
    promise: 'Hosts rent out driveways. Drivers find a space, book it, and prepay.',
    summary:
      'A two-sided parking marketplace. The platform keeps a commission on each booking, and the same product can be branded for a city, a campus, or a private operator.',
    priceLabel: 'Quoted',
    priceValue: null,
    delivery:
      'A working prototype is ready today. A branded deployment typically takes a few weeks once the brief is agreed.',
    stack: ['Flutter', 'NestJS', 'Postgres', 'PostGIS', 'Supabase', 'Stripe'],
    features: [
      'Map search with price, walking time, and filters for covered, CCTV, EV, and gated spaces',
      'Instant book, or request-to-book when the host should approve first',
      'Offers and counter-offers before a driver pays',
      'Host listings, weekly availability, pricing, and an earnings view',
      'Admin tools for listing approval, bookings, disputes, and the commission rate',
      'A payment ledger, and a database rule that blocks two bookings of the same space',
    ],
    customisation: [
      'Name, logo, and colours',
      'The cities or sites you open first',
      'Commission and booking rules',
      'Extras such as EV charging or car washing',
      'Terms, privacy text, and FAQs',
    ],
    demo: 'live',
    demoUrl: 'https://saeedmurrad.github.io/driveway-parking-app/',
    demoHealthUrl: 'https://parkspace-api.onrender.com/health',
    demoNote:
      'On the login screen, choose Driver, Host, or Admin. If the demo server was idle, the first sign-in can take up to a minute. Payments are simulated, and messages stay inside the app.',
    mock: 'parkspace',
  },
  {
    slug: 'clientline',
    catalog: '02',
    name: 'Clientline',
    category: 'CRM',
    industry: 'Sales',
    promise: 'A calm CRM for a business that has outgrown a spreadsheet.',
    summary:
      'Contacts, a pipeline you can scan in one view, and follow-ups that do not depend on someone remembering. Built for a small team, not a sales floor of two hundred.',
    priceLabel: 'From £3,200',
    priceValue: 3200,
    delivery: 'Typical first deployment is four to six weeks after the brief is agreed.',
    stack: ['Angular', 'Node.js', 'Postgres'],
    features: [
      'Companies and people, with the history of every conversation in one place',
      'A pipeline with the stages your team actually uses',
      'Follow-up dates that surface what is due today',
      'Notes and files kept against the record they belong to',
      'A simple activity view for the owner',
    ],
    customisation: [
      'Your stages, fields, and words',
      'Brand, logo, and colours',
      'Who on the team can see which records',
      'The reports the owner asks for each week',
    ],
    demo: 'request',
    mock: 'clientline',
  },
  {
    slug: 'stockroom',
    catalog: '03',
    name: 'Stockroom',
    category: 'Inventory',
    industry: 'Retail',
    promise: 'Know what is in the room, what is running low, and what it is worth.',
    summary:
      'Inventory for a shop, a workshop, or a small warehouse. Every movement has a reason, so the count on screen matches the count on the shelf.',
    priceLabel: 'From £2,400',
    priceValue: 2400,
    delivery: 'Typical first deployment is four to six weeks after the brief is agreed.',
    stack: ['Angular', 'Node.js', 'Postgres'],
    features: [
      'Products, variants, and the quantity on hand',
      'Goods in and goods out, with a reason on every movement',
      'Low-stock marks so reordering is not a surprise',
      'A straightforward valuation of what is currently held',
      'More than one location, if stock lives in more than one room',
    ],
    customisation: [
      'Units, categories, and locations',
      'Brand, logo, and colours',
      'The reorder rules for your suppliers',
      'A simple export for the person who does the accounts',
    ],
    demo: 'request',
    mock: 'stockroom',
  },
];

export function productBySlug(slug: string | null): Product | undefined {
  return products.find((product) => product.slug === slug);
}
