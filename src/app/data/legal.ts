export interface LegalSection {
  heading: string;
  paragraphs: string[];
}

export interface LegalPage {
  slug: string;
  title: string;
  description: string;
  sections: LegalSection[];
}

export const legalPages: LegalPage[] = [
  {
    slug: 'terms',
    title: 'Terms of sale',
    description: 'How a Zaviks Tech licence, customisation quote, and maintenance plan are agreed.',
    sections: [
      {
        heading: 'What you are buying',
        paragraphs: [
          'A shelf product is licensed for your business. You receive your own deployed copy. Zaviks Tech keeps the base product and may license it to other customers.',
          'Nothing on this website is a completed order. A request is an invitation for us to send a quote. Work starts when both sides accept that quote in writing.',
        ],
      },
      {
        heading: 'Quotes',
        paragraphs: [
          'Starting prices on the shelf are illustrations. The figure you pay is the one in the quote, after we have read the brief.',
          'Customisation is priced per request. We do not sell hours as a package, and we do not ask you to guess a fixed bundle before we understand the change.',
        ],
      },
      {
        heading: 'What a launch includes',
        paragraphs: [
          'Unless the quote says otherwise, launch means the agreed configuration, deployed on the system named in the quote, with a short guide covering setup and the choices that are safe to change.',
          'Ongoing fixes, security updates, and small later changes sit on a maintenance plan. They are not included forever in the first invoice.',
        ],
      },
      {
        heading: 'Acceptable use',
        paragraphs: [
          'You will not use a product to break the law, to mislead your own customers, or to resell the base product as a shelf of your own.',
          'You are responsible for the data you and your users put into the system, and for keeping your account credentials private.',
        ],
      },
      {
        heading: 'Liability',
        paragraphs: [
          'We will carry out the work with reasonable care. We do not promise that a product will be uninterrupted or fit for a purpose we were not told about.',
          'Our liability for a piece of work is limited to the fees you paid us for that work. We are not liable for lost profit, lost data, or indirect loss. Nothing here limits liability that the law does not allow us to limit.',
        ],
      },
      {
        heading: 'Law',
        paragraphs: [
          'These terms are governed by the law of England and Wales. The courts of England and Wales decide disputes, unless the law gives you a right to use another court.',
          'Questions about a quote or an order: hello@zaviks.tech.',
        ],
      },
    ],
  },
  {
    slug: 'privacy',
    title: 'Privacy',
    description: 'What Zaviks Tech collects on this website, why, and how to ask for a copy or deletion.',
    sections: [
      {
        heading: 'Who we are',
        paragraphs: [
          'Zaviks Tech operates this website. For privacy questions, write to hello@zaviks.tech. We are based in the United Kingdom.',
        ],
      },
      {
        heading: 'What the forms collect',
        paragraphs: [
          'If you contact us or request a product, we collect your name, email address, company, phone number if you give one, the product you are asking about, a priority, and your message.',
          'We use that information to reply, to prepare a quote, and to keep a record of the conversation. We do not use it for a mailing list, and we do not sell it.',
        ],
      },
      {
        heading: 'Where it is stored',
        paragraphs: [
          'Enquiries are stored in Cloud Firestore, a Google service. Google processes that data on our instructions. We do not take card payments on this website, and we do not ask you to send card numbers.',
          'If the enquiry store is unavailable, the form offers an email instead. That message then sits in the inbox you send it to.',
        ],
      },
      {
        heading: 'How long we keep it',
        paragraphs: [
          'We keep enquiry records for as long as we need them to answer you, to complete a quote, or to meet a legal duty. You can ask us to delete a message that is no longer needed.',
        ],
      },
      {
        heading: 'Your rights',
        paragraphs: [
          'You can ask for a copy of the information we hold about you, ask us to correct it, or ask us to delete it. Write to hello@zaviks.tech. You can also complain to the Information Commissioner’s Office if you think we have handled your information badly.',
        ],
      },
    ],
  },
  {
    slug: 'licence',
    title: 'Licence',
    description: 'Customers license a copy of a Zaviks Tech product. The base product stays with Zaviks Tech.',
    sections: [
      {
        heading: 'A licence, not a sale of the product',
        paragraphs: [
          'When you buy a shelf product, you buy a licence to use a copy in your business. You do not buy the intellectual property in the base product, and you do not receive an exclusive right to it.',
          'Each customer gets their own copy. A fix we make to the base can later be applied to your copy where it is useful and safe.',
        ],
      },
      {
        heading: 'What you own',
        paragraphs: [
          'You own your logo, your name, your copy, and the data your business puts into the system. We do not claim your customer records.',
          'Configuration that only makes sense for you, such as your price list or your booking rules, is yours to keep using under the licence.',
        ],
      },
      {
        heading: 'What you may not do',
        paragraphs: [
          'You may not resell the product, rent it out as a software business of your own, or publish the source as a public project, unless the quote says otherwise in writing.',
          'You may not remove notices that identify Zaviks Tech as the author of the base product. Your own brand can still be what your users see.',
        ],
      },
      {
        heading: 'How long it lasts',
        paragraphs: [
          'The licence lasts for as long as you use the copy in line with these terms and the quote. We can end it if you seriously break the terms and do not fix that after we have written to you.',
          'Ending the licence does not erase your data. We will agree a handover of an export before access is removed.',
        ],
      },
    ],
  },
  {
    slug: 'refund',
    title: 'Refunds',
    description: 'When a Zaviks Tech fee can be refunded, and what this website does not charge for.',
    sections: [
      {
        heading: 'This website does not take payment',
        paragraphs: [
          'You cannot pay by card here. A request asks us to quote. Trying the ParkSpace demo is free and creates no charge.',
        ],
      },
      {
        heading: 'Before work starts',
        paragraphs: [
          'If you have paid a base licence fee and customisation has not started, tell us and we will refund that fee. Say so in writing to hello@zaviks.tech.',
        ],
      },
      {
        heading: 'After work has started',
        paragraphs: [
          'Once we have started the customisation described in the quote, we refund the unused portion of that work. Time already spent, and any third-party cost we have already paid on your behalf, is not refunded.',
          'If a deployment fails because of something we did, we fix it or we refund the deployment fee. We do not refund a fee because a product was a poor fit for a need you did not tell us about.',
        ],
      },
      {
        heading: 'Maintenance plans',
        paragraphs: [
          'A maintenance plan renews by agreement. You can end it at the next renewal date. A plan that has already started is not refunded mid-period, unless we have failed to provide the support described in the plan.',
        ],
      },
    ],
  },
];

export function legalBySlug(slug: string | null): LegalPage | undefined {
  return legalPages.find((page) => page.slug === slug);
}
