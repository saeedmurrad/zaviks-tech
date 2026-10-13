import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { friendlyError } from '../../core/firebase';
import {
  allStatuses,
  RequestsService,
  statusLabels,
  type CustomerRequest,
  type RequestStatus,
} from '../../core/requests';
import { Icon } from '../../shared/icon';
import { AdminStore } from './store';

type Filter = 'all' | 'new' | 'quoted' | 'active' | 'done';

const filters: { id: Filter; label: string; statuses: RequestStatus[] | null }[] = [
  { id: 'all', label: 'All', statuses: null },
  { id: 'new', label: 'New', statuses: ['new'] },
  { id: 'quoted', label: 'Quoted', statuses: ['quoted'] },
  { id: 'active', label: 'Active', statuses: ['accepted', 'in_development', 'testing'] },
  { id: 'done', label: 'Done', statuses: ['deployed', 'closed', 'declined'] },
];

@Component({
  selector: 'app-admin-requests',
  imports: [ReactiveFormsModule, DatePipe, Icon],
  templateUrl: './requests.html',
})
export class AdminRequests {
  readonly store = inject(AdminStore);
  private readonly api = inject(RequestsService);
  private readonly router = inject(Router);
  readonly labels = statusLabels;
  readonly statuses = allStatuses;
  readonly filters = filters;
  readonly filter = signal<Filter>('all');
  readonly query = signal('');
  readonly selectedId = signal<string | null>(null);
  readonly busy = signal(false);
  readonly error = signal('');
  readonly done = signal('');

  readonly quoteForm = inject(FormBuilder).nonNullable.group({
    amount: ['', [Validators.required, Validators.maxLength(60)]],
    timeline: ['', [Validators.required, Validators.maxLength(120)]],
    note: ['', [Validators.maxLength(2000)]],
  });
  readonly statusForm = inject(FormBuilder).nonNullable.group({
    status: ['new' as RequestStatus],
    adminNote: ['', [Validators.maxLength(2000)]],
  });

  readonly items = computed(() => {
    const active = filters.find((f) => f.id === this.filter())?.statuses;
    const q = this.query().trim().toLowerCase();
    return (this.store.requests() ?? []).filter((item) => {
      const inFilter = !active || active.includes(item.status);
      const inQuery =
        !q ||
        [item.name, item.email, item.company, item.productName, item.message]
          .join(' ')
          .toLowerCase()
          .includes(q);
      return inFilter && inQuery;
    });
  });

  readonly selected = computed(
    () => (this.store.requests() ?? []).find((item) => item.id === this.selectedId()) ?? null,
  );

  constructor() {
    inject(ActivatedRoute)
      .queryParamMap.pipe(takeUntilDestroyed())
      .subscribe((params) => {
        const status = params.get('status') as Filter | null;
        if (status && filters.some((f) => f.id === status)) this.filter.set(status);
        const q = params.get('q');
        if (q !== null) this.query.set(q);
        const id = params.get('id');
        this.selectedId.set(id);
        this.done.set('');
        this.error.set('');
      });
  }

  select(item: CustomerRequest | null): void {
    void this.router.navigate(['/admin/requests'], {
      queryParams: { id: item?.id ?? null },
      queryParamsHandling: 'merge',
    });
    if (item) {
      this.quoteForm.reset({
        amount: item.quote?.amount ?? '',
        timeline: item.quote?.timeline ?? '',
        note: item.quote?.note ?? '',
      });
      this.statusForm.reset({ status: item.status, adminNote: item.adminNote ?? '' });
    }
  }

  setFilter(id: Filter): void {
    this.filter.set(id);
    void this.router.navigate(['/admin/requests'], {
      queryParams: { status: id === 'all' ? null : id },
      queryParamsHandling: 'merge',
    });
  }

  mailto(item: CustomerRequest): string {
    const subject = encodeURIComponent(`Zaviks Tech — your ${item.productName} request`);
    return `mailto:${item.email}?subject=${subject}`;
  }

  async sendQuote(): Promise<void> {
    const item = this.selected();
    if (!item || this.quoteForm.invalid || this.busy()) return;
    await this.run(async () => {
      await this.api.sendQuote(item.id, this.quoteForm.getRawValue());
      this.done.set('Quote saved. The customer sees it in their account; email them so they know.');
    });
  }

  async saveStatus(): Promise<void> {
    const item = this.selected();
    if (!item || this.busy()) return;
    const value = this.statusForm.getRawValue();
    await this.run(async () => {
      await this.api.setStatus(item.id, value.status, value.adminNote);
      this.done.set('Status updated.');
    });
  }

  private async run(action: () => Promise<void>): Promise<void> {
    this.busy.set(true);
    this.error.set('');
    this.done.set('');
    try {
      await action();
      await this.store.load(true);
      const fresh = this.selected();
      if (fresh) {
        this.statusForm.patchValue({ status: fresh.status });
        this.quoteForm.patchValue({
          amount: fresh.quote?.amount ?? '',
          timeline: fresh.quote?.timeline ?? '',
          note: fresh.quote?.note ?? '',
        });
      }
    } catch (err) {
      this.error.set(friendlyError(err));
    } finally {
      this.busy.set(false);
    }
  }
}
