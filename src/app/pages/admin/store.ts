import { computed, Injectable, inject, signal } from '@angular/core';
import { friendlyError } from '../../core/firebase';
import { RequestsService, type Customer, type CustomerRequest } from '../../core/requests';

/** Loads requests and customers once for the whole admin area, with a manual refresh. */
@Injectable({ providedIn: 'root' })
export class AdminStore {
  private readonly api = inject(RequestsService);
  readonly requests = signal<CustomerRequest[] | undefined>(undefined);
  readonly customers = signal<Customer[] | undefined>(undefined);
  readonly error = signal('');
  readonly loading = signal(false);

  readonly counts = computed(() => {
    const items = this.requests() ?? [];
    const by = (statuses: string[]) =>
      items.filter((item) => statuses.includes(item.status)).length;
    return {
      newRequests: by(['new']),
      quoted: by(['quoted']),
      active: by(['accepted', 'in_development', 'testing']),
      deployed: by(['deployed']),
      customers: (this.customers() ?? []).length,
    };
  });

  readonly requestsByEmail = computed(() => {
    const map = new Map<string, number>();
    for (const item of this.requests() ?? []) {
      const key = item.email.toLowerCase();
      map.set(key, (map.get(key) ?? 0) + 1);
    }
    return map;
  });

  async load(force = false): Promise<void> {
    if (this.loading()) return;
    if (!force && this.requests() && this.customers()) return;
    this.loading.set(true);
    this.error.set('');
    try {
      const [requests, customers] = await Promise.all([
        this.api.listAll(),
        this.api.listCustomers(),
      ]);
      this.requests.set(requests);
      this.customers.set(customers);
    } catch (err) {
      this.error.set(friendlyError(err, 'We could not load the admin data.'));
      this.requests.set(this.requests() ?? []);
      this.customers.set(this.customers() ?? []);
    } finally {
      this.loading.set(false);
    }
  }
}
