import { Injectable, inject } from '@angular/core';
import { productBySlug } from '../data/products';
import { AuthService } from './auth';
import { firestore, toDate } from './firebase';

export type RequestStatus =
  'new' | 'quoted' | 'accepted' | 'declined' | 'in_development' | 'testing' | 'deployed' | 'closed';

export const statusLabels: Record<RequestStatus, string> = {
  new: 'Received',
  quoted: 'Quote sent',
  accepted: 'Accepted',
  declined: 'Declined',
  in_development: 'In development',
  testing: 'Testing',
  deployed: 'Deployed',
  closed: 'Closed',
};

export const allStatuses = Object.keys(statusLabels) as RequestStatus[];

/** The customer-facing progress track. Declined and closed sit outside it. */
export const trackSteps: RequestStatus[] = [
  'new',
  'quoted',
  'accepted',
  'in_development',
  'testing',
  'deployed',
];

export interface Quote {
  amount: string;
  timeline: string;
  note: string;
  sentAt?: Date;
}

export interface CustomerRequest {
  id: string;
  type: 'contact' | 'purchase' | 'customisation';
  name: string;
  email: string;
  company: string;
  phone: string;
  productSlug: string;
  productName: string;
  message: string;
  priority: 'standard' | 'soon' | 'urgent';
  status: RequestStatus;
  uid?: string;
  quote?: Quote;
  adminNote?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Customer {
  uid: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  createdAt?: Date;
}

function toRequest(id: string, data: Record<string, unknown>): CustomerRequest {
  const slug = (data['productSlug'] as string) ?? '';
  const quote = data['quote'] as Record<string, unknown> | undefined;
  return {
    id,
    type: (data['type'] as CustomerRequest['type']) ?? 'contact',
    name: (data['name'] as string) ?? '',
    email: (data['email'] as string) ?? '',
    company: (data['company'] as string) ?? '',
    phone: (data['phone'] as string) ?? '',
    productSlug: slug,
    productName: productBySlug(slug)?.name ?? (slug ? slug : 'General enquiry'),
    message: (data['message'] as string) ?? '',
    priority: (data['priority'] as CustomerRequest['priority']) ?? 'standard',
    status: (data['status'] as RequestStatus) ?? 'new',
    uid: data['uid'] as string | undefined,
    quote: quote
      ? {
          amount: (quote['amount'] as string) ?? '',
          timeline: (quote['timeline'] as string) ?? '',
          note: (quote['note'] as string) ?? '',
          sentAt: toDate(quote['sentAt']),
        }
      : undefined,
    adminNote: data['adminNote'] as string | undefined,
    createdAt: toDate(data['createdAt']),
    updatedAt: toDate(data['updatedAt']),
  };
}

function newestFirst(a: CustomerRequest, b: CustomerRequest): number {
  return (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0);
}

@Injectable({ providedIn: 'root' })
export class RequestsService {
  private readonly auth = inject(AuthService);

  /** Requests made while signed in, plus guest requests sent from the same verified email. */
  async listMine(): Promise<CustomerRequest[]> {
    const user = this.auth.user();
    if (!user) return [];
    const { collection, getDocs, query, where } = await import('firebase/firestore');
    const db = await firestore();
    const byId = new Map<string, CustomerRequest>();
    const byUid = await getDocs(query(collection(db, 'enquiries'), where('uid', '==', user.uid)));
    byUid.forEach((snap) => byId.set(snap.id, toRequest(snap.id, snap.data())));
    if (user.emailVerified) {
      const byEmail = await getDocs(
        query(collection(db, 'enquiries'), where('email', '==', user.email)),
      );
      byEmail.forEach((snap) => byId.set(snap.id, toRequest(snap.id, snap.data())));
    }
    return [...byId.values()].sort(newestFirst);
  }

  async listAll(): Promise<CustomerRequest[]> {
    const { collection, getDocs, limit, orderBy, query } = await import('firebase/firestore');
    const snaps = await getDocs(
      query(collection(await firestore(), 'enquiries'), orderBy('createdAt', 'desc'), limit(300)),
    );
    const items: CustomerRequest[] = [];
    snaps.forEach((snap) => items.push(toRequest(snap.id, snap.data())));
    return items;
  }

  async sendQuote(
    id: string,
    quote: { amount: string; timeline: string; note: string },
  ): Promise<void> {
    const { doc, serverTimestamp, updateDoc } = await import('firebase/firestore');
    await updateDoc(doc(await firestore(), 'enquiries', id), {
      status: 'quoted',
      quote: {
        amount: quote.amount.trim(),
        timeline: quote.timeline.trim(),
        note: quote.note.trim(),
        sentAt: serverTimestamp(),
      },
      updatedAt: serverTimestamp(),
    });
  }

  async setStatus(id: string, status: RequestStatus, adminNote?: string): Promise<void> {
    const { doc, serverTimestamp, updateDoc } = await import('firebase/firestore');
    await updateDoc(doc(await firestore(), 'enquiries', id), {
      status,
      ...(adminNote !== undefined ? { adminNote: adminNote.trim() } : {}),
      updatedAt: serverTimestamp(),
    });
  }

  /** A customer answering a quote. The rules only allow this move from 'quoted'. */
  async respond(id: string, answer: 'accepted' | 'declined'): Promise<void> {
    const { doc, serverTimestamp, updateDoc } = await import('firebase/firestore');
    await updateDoc(doc(await firestore(), 'enquiries', id), {
      status: answer,
      updatedAt: serverTimestamp(),
    });
  }

  async listCustomers(): Promise<Customer[]> {
    const { collection, getDocs, limit, orderBy, query } = await import('firebase/firestore');
    const snaps = await getDocs(
      query(collection(await firestore(), 'users'), orderBy('createdAt', 'desc'), limit(500)),
    );
    const items: Customer[] = [];
    snaps.forEach((snap) => {
      const data = snap.data();
      items.push({
        uid: snap.id,
        name: data['name'] ?? '',
        email: data['email'] ?? '',
        company: data['company'] ?? '',
        phone: data['phone'] ?? '',
        createdAt: toDate(data['createdAt']),
      });
    });
    return items;
  }
}
