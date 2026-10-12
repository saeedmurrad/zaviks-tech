import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { site } from '../data/site';

export type EnquiryType = 'contact' | 'purchase' | 'customisation';
export type EnquiryPriority = 'standard' | 'soon' | 'urgent';

export interface Enquiry {
  type: EnquiryType;
  name: string;
  email: string;
  company: string;
  phone: string;
  productSlug: string;
  message: string;
  priority: EnquiryPriority;
}

@Injectable({ providedIn: 'root' })
export class EnquiryService {
  private readonly platformId = inject(PLATFORM_ID);

  configured(): boolean {
    return environment.firebase.apiKey.length > 0 && environment.firebase.projectId.length > 0;
  }

  async send(enquiry: Enquiry): Promise<'stored' | 'mailto'> {
    if (!isPlatformBrowser(this.platformId) || !this.configured()) {
      return 'mailto';
    }

    const { getApps, initializeApp } = await import('firebase/app');
    const { addDoc, collection, getFirestore, serverTimestamp } = await import('firebase/firestore');
    const app = getApps()[0] ?? initializeApp(environment.firebase);
    const db = getFirestore(app);
    await addDoc(collection(db, 'enquiries'), {
      type: enquiry.type,
      name: enquiry.name.trim(),
      email: enquiry.email.trim(),
      company: enquiry.company.trim(),
      phone: enquiry.phone.trim(),
      productSlug: enquiry.productSlug,
      message: enquiry.message.trim(),
      priority: enquiry.priority,
      createdAt: serverTimestamp(),
    });
    return 'stored';
  }

  mailto(enquiry: Enquiry): string {
    const subject = encodeURIComponent(`Zaviks Tech enquiry — ${enquiry.type}`);
    const body = encodeURIComponent(
      [
        `Name: ${enquiry.name}`,
        `Email: ${enquiry.email}`,
        `Company: ${enquiry.company || '—'}`,
        `Phone: ${enquiry.phone || '—'}`,
        `Product: ${enquiry.productSlug || '—'}`,
        `Priority: ${enquiry.priority}`,
        '',
        enquiry.message,
      ].join('\n'),
    );
    return `mailto:${site.email}?subject=${subject}&body=${body}`;
  }
}
