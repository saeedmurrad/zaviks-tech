import { afterNextRender, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth';
import { friendlyError } from '../../core/firebase';
import { Seo } from '../../core/seo';

export type AuthMode = 'login' | 'register' | 'forgot';

const copy: Record<AuthMode, { title: string; lede: string; seo: string }> = {
  login: {
    title: 'Welcome back.',
    lede: 'Sign in to see your requests, quotes, and project progress.',
    seo: 'Sign in',
  },
  register: {
    title: 'Create your account.',
    lede: 'Track every request and quote in one place. It takes a minute.',
    seo: 'Create an account',
  },
  forgot: {
    title: 'Reset your password.',
    lede: 'We will email you a link to choose a new one.',
    seo: 'Reset password',
  },
};

@Component({
  selector: 'app-auth',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './auth.html',
})
export class AuthPage {
  readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  readonly mode = signal<AuthMode>((this.route.snapshot.data['mode'] as AuthMode) ?? 'login');
  readonly text = computed(() => copy[this.mode()]);
  readonly tried = signal(false);
  readonly busy = signal(false);
  readonly error = signal('');
  readonly done = signal(false);
  readonly next = signal('/account');
  readonly form = inject(FormBuilder).nonNullable.group({
    name: ['', [Validators.maxLength(120)]],
    company: ['', [Validators.maxLength(160)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(160)]],
    password: [''],
    terms: [false],
  });

  constructor() {
    const mode = this.mode();
    inject(Seo).set({
      title: copy[mode].seo,
      description:
        'Customer accounts for Zaviks Tech: track requests, quotes, and project progress.',
      path: `/${mode}`,
      noindex: true,
    });
    if (mode === 'register') {
      this.form.controls.name.addValidators([Validators.required, Validators.minLength(2)]);
      this.form.controls.terms.addValidators(Validators.requiredTrue);
    }
    if (mode !== 'forgot') {
      this.form.controls.password.addValidators([
        Validators.required,
        Validators.minLength(mode === 'register' ? 8 : 1),
      ]);
    }
    afterNextRender(() => {
      const next = this.route.snapshot.queryParamMap.get('next');
      if (next && next.startsWith('/')) this.next.set(next);
      void this.auth.ready.then(() => {
        if (this.auth.user() && mode !== 'forgot') {
          void this.router.navigateByUrl(this.next());
        }
      });
    });
  }

  invalid(name: 'name' | 'email' | 'password' | 'terms'): boolean {
    return this.tried() && this.form.controls[name].invalid;
  }

  async submit(): Promise<void> {
    this.tried.set(true);
    this.error.set('');
    if (this.form.invalid || this.busy()) return;
    const value = this.form.getRawValue();
    this.busy.set(true);
    try {
      switch (this.mode()) {
        case 'login':
          await this.auth.login(value.email, value.password);
          await this.router.navigateByUrl(this.next());
          break;
        case 'register':
          await this.auth.register({
            name: value.name,
            email: value.email,
            password: value.password,
            company: value.company,
          });
          await this.router.navigateByUrl(this.next());
          break;
        case 'forgot':
          await this.auth.resetPassword(value.email);
          this.done.set(true);
          break;
      }
    } catch (err) {
      this.error.set(friendlyError(err));
    } finally {
      this.busy.set(false);
    }
  }
}
