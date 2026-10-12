export const site = {
  name: 'Zaviks Tech',
  email: 'hello@zaviks.tech',
  location: 'United Kingdom',
  description:
    'Zaviks Tech keeps ready-made software on the shelf. You license the closest product, and we customise, deploy, and maintain it.',
};

export interface NavItem {
  label: string;
  path: string;
}

export const nav: NavItem[] = [
  { label: 'Shelf', path: '/shelf' },
  { label: 'How it works', path: '/how-it-works' },
  { label: 'Services', path: '/services' },
  { label: 'Pricing', path: '/pricing' },
  { label: 'Roadmap', path: '/roadmap' },
  { label: 'About', path: '/about' },
];

export interface Stage {
  n: string;
  title: string;
  zaviks: string;
  customer: string;
}

export const stages: Stage[] = [
  {
    n: '01',
    title: 'Build',
    zaviks: 'We make the first working version of a product.',
    customer: 'You get something you can try, not a proposal for a build from zero.',
  },
  {
    n: '02',
    title: 'Shelf',
    zaviks: 'We list it with a description, a demo, and a starting price.',
    customer: 'You can compare products before you ask us to begin.',
  },
  {
    n: '03',
    title: 'Purchase',
    zaviks: 'We license the base product for your business.',
    customer: 'You get your own copy. We keep the original, so the shelf stays intact.',
  },
  {
    n: '04',
    title: 'Customise',
    zaviks: 'We change brand, rules, and features to fit how you work.',
    customer: 'The product matches the business, without a ground-up project.',
  },
  {
    n: '05',
    title: 'Deploy',
    zaviks: 'We install it on your server or your cloud, the same way each time.',
    customer: 'A live system, with a short guide your team can keep.',
  },
  {
    n: '06',
    title: 'Maintain',
    zaviks: 'We apply fixes and security updates, and log every support request.',
    customer: 'Someone is still there after the launch week.',
  },
];

export interface Plan {
  name: string;
  price: string;
  period: string;
  summary: string;
  points: string[];
  featured: boolean;
}

export const plans: Plan[] = [
  {
    name: 'Basic',
    price: '£149',
    period: 'a month',
    summary: 'For a product that is live and mostly settled.',
    points: [
      'Security updates',
      'Email support on business days',
      'A reminder before the plan renews',
    ],
    featured: false,
  },
  {
    name: 'Standard',
    price: '£349',
    period: 'a month',
    summary: 'The usual plan once a team is relying on the system.',
    points: ['Everything in Basic', 'Minor fixes included', 'A monthly health check'],
    featured: true,
  },
  {
    name: 'Premium',
    price: '£690',
    period: 'a month',
    summary: 'For a business that wants a named person and room for small changes.',
    points: ['Priority response', 'A small allowance for changes', 'A named contact'],
    featured: false,
  },
];

export interface Benefit {
  icon: string;
  title: string;
  text: string;
}

export const benefits: Benefit[] = [
  {
    icon: 'bolt',
    title: 'Weeks, not months',
    text: 'The product already runs. The budget goes on the difference, not on a build from zero.',
  },
  {
    icon: 'eye',
    title: 'See it before you buy',
    text: 'Every item has a description, a demo, and a starting price. No proposal to decode.',
  },
  {
    icon: 'server',
    title: 'Runs on your systems',
    text: 'Installed on your server or your cloud account. Your name, your data, your configuration.',
  },
  {
    icon: 'shield',
    title: 'Looked after',
    text: 'A monthly plan covers security updates and fixes, with every support request logged.',
  },
];

export interface Principle {
  icon: string;
  title: string;
  text: string;
}

/** How every shelf product is built, so it can be changed quickly and safely for each customer. */
export const principles: Principle[] = [
  {
    icon: 'sliders',
    title: 'Built for change',
    text: 'Logo, colours, names, settings, and texts live in configuration, not in code. Features are modular, so one can be added or switched off.',
  },
  {
    icon: 'copy',
    title: 'One base, many copies',
    text: 'Each customer gets their own copy of the base product. Fixes to the base can be applied to customer copies where useful.',
  },
  {
    icon: 'box',
    title: 'Repeatable deployment',
    text: 'Every product is packaged with Docker and a short setup guide, so it installs the same way on a server or a cloud.',
  },
  {
    icon: 'book',
    title: 'Documented per product',
    text: 'A README covers features, the stack, setup, environment variables, and how to customise.',
  },
  {
    icon: 'wrench',
    title: 'Maintained and tracked',
    text: 'We track each customer’s version, apply security updates and bug fixes, and log every support ticket.',
  },
];

export type RoadmapStatus = 'live' | 'building' | 'planned';

export interface RoadmapItem {
  label: string;
  status: RoadmapStatus;
  note?: string;
}

export interface RoadmapPhase {
  name: string;
  title: string;
  summary: string;
  items: RoadmapItem[];
}

export const roadmap: RoadmapPhase[] = [
  {
    name: 'Phase 1',
    title: 'The store',
    summary: 'A working shelf with a few products, and a way to ask for one.',
    items: [
      { label: 'Product shelf with search and filters', status: 'live' },
      { label: 'Product detail pages', status: 'live' },
      {
        label: 'Three prototype products',
        status: 'live',
        note: 'ParkSpace, Clientline, Stockroom',
      },
      { label: 'Customisation and purchase request form', status: 'live' },
      { label: 'Legal pages: terms, licence, privacy, refunds', status: 'live' },
      {
        label: 'Customer accounts',
        status: 'live',
        note: 'Sign in to track requests, quotes, and progress',
      },
      {
        label: 'Online checkout for the base licence',
        status: 'planned',
        note: 'Through Stripe. No card data is stored by us.',
      },
      { label: 'Admin panel for requests, quotes, and customers', status: 'live' },
      { label: 'Email notifications', status: 'planned' },
    ],
  },
  {
    name: 'Phase 2',
    title: 'The project',
    summary: 'Everything that happens after a quote is accepted, visible to the customer.',
    items: [
      { label: 'Maintenance plans', status: 'live', note: 'Basic, Standard, and Premium' },
      {
        label: 'Quote approval and payment online',
        status: 'building',
        note: 'Quotes are sent and accepted in the account. Payment follows.',
      },
      { label: 'Project tracking: requirements, development, testing, deployed', status: 'live' },
      { label: 'Messages and file sharing with the team', status: 'planned' },
      { label: 'Deployment records per customer', status: 'planned' },
      { label: 'Support tickets', status: 'planned' },
    ],
  },
  {
    name: 'Phase 3',
    title: 'The scale',
    summary: 'More products, more demos, and the reporting to run it.',
    items: [
      { label: 'Live demo for every product', status: 'building', note: 'ParkSpace is live today' },
      { label: 'Sales and revenue reports', status: 'planned' },
      { label: 'Automated plan renewals and reminders', status: 'planned' },
      { label: 'More products and categories', status: 'planned' },
    ],
  },
];
