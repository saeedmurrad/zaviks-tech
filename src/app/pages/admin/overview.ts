import { DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { statusLabels } from '../../core/requests';
import { AdminStore } from './store';

@Component({
  selector: 'app-admin-overview',
  imports: [RouterLink, DatePipe],
  templateUrl: './overview.html',
})
export class AdminOverview {
  readonly store = inject(AdminStore);
  readonly labels = statusLabels;
  readonly recent = computed(() => (this.store.requests() ?? []).slice(0, 8));
}
