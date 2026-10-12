import { DatePipe } from '@angular/common';
import { afterNextRender, Component, computed, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth';
import { friendlyError } from '../../core/firebase';
import {
  RequestsService,
  statusLabels,
  trackSteps,
  type CustomerRequest,
  type RequestStatus,
} from '../../core/requests';
import { Seo } from '../../core/seo';
import { Icon } from '../../shared/icon';

@Component({
  selector: 'app-account',
  imports: [ReactiveFormsModule, RouterLink, DatePipe, Icon],
  templateUrl: './account.html',
})
export class Account {
  readonly auth = inject(AuthService);
  private readonly requests = inject(RequestsService);
  private readonly router = inject(Router);
  readonly items = signal<CustomerRequest[] | undefined>(undefined);
  readonly open = signal<string | null>(null);
  readonly busyId = signal<string | null>(null);
  readonly error = signal('');
  readonly saved = signal(false);
  readonly saving = signal(false);
  readonly verifySent = signal(false);
  readonly labels = statusLabels;
  readonly steps = trackSteps;
  readonly firstName = computed(() => {
    const name = this.auth.profile()?.name || this.auth.user()?.displayName || '';
    return name.split(' ')[0] || 'there';
  });
  readonly form = inject(FormBuilder).nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(120)]],
    company: ['', [Validators.maxLength(160)]],
    phone: ['', [Validators.maxLength(40)]],
  });

  constructor() {
    inject(Seo).set({
      title: 'Your account',
      description: 'Your Zaviks Tech requests, quotes, and project progress.',
      path: '/account',
      noindex: true,
    });
    effect(() => {
      const profile = this.auth.profile();
      const user = this.auth.user();
      if (profile) {
        this.form.patchValue({
          name: profile.name,
          company: profile.company,
          phone: profile.phone,
        });
      } else if (user?.displayName) {
        this.form.patchValue({ name: user.displayName });
      }
    });
    afterNextRender(() => {
      void this.auth.ready.then(() => this.load());
    });
  }

  private async load(): Promise<void> {
    try {
      this.items.set(await this.requests.listMine());
    } catch (err) {
      this.items.set([]);
      this.error.set(friendlyError(err, 'We could not load your requests just now.'));
    }
  }

  toggle(id: string): void {
    this.open.set(this.open() === id ? null : id);
  }

  stepIndex(status: RequestStatus): number {
    return this.steps.indexOf(status);
  }

  onTrack(status: RequestStatus): boolean {
    return this.steps.includes(status);
  }

  async respond(item: CustomerRequest, answer: 'accepted' | 'declined'): Promise<void> {
    if (this.busyId()) return;
    this.busyId.set(item.id);
    this.error.set('');
    try {
      await this.requests.respond(item.id, answer);
      await this.load();
    } catch (err) {
      this.error.set(friendlyError(err));
    } finally {
      this.busyId.set(null);
    }
  }

  async save(): Promise<void> {
    if (this.form.invalid || this.saving()) return;
    this.saving.set(true);
    this.saved.set(false);
    this.error.set('');
    try {
      await this.auth.saveProfile(this.form.getRawValue());
      this.saved.set(true);
    } catch (err) {
      this.error.set(friendlyError(err));
    } finally {
      this.saving.set(false);
    }
  }

  async resend(): Promise<void> {
    try {
      await this.auth.resendVerification();
      this.verifySent.set(true);
    } catch (err) {
      this.error.set(friendlyError(err));
    }
  }

  async checkVerified(): Promise<void> {
    await this.auth.refresh();
    if (this.auth.user()?.emailVerified) {
      await this.load();
    }
  }

  async logout(): Promise<void> {
    await this.auth.logout();
    await this.router.navigateByUrl('/');
  }
}
