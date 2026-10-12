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
    points: ['Security updates', 'Email support on business days', 'A reminder before the plan renews'],
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
