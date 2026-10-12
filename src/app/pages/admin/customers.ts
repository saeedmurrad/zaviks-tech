import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdminStore } from './store';

@Component({
  selector: 'app-admin-customers',
  imports: [RouterLink, DatePipe],
  templateUrl: './customers.html',
})
export class AdminCustomers {
  readonly store = inject(AdminStore);
  readonly query = signal('');
  readonly items = computed(() => {
    const q = this.query().trim().toLowerCase();
    return (this.store.customers() ?? []).filter(
      (c) => !q || [c.name, c.email, c.company].join(' ').toLowerCase().includes(q),
    );
  });

  requestCount(email: string): number {
    return this.store.requestsByEmail().get(email.toLowerCase()) ?? 0;
  }
}
