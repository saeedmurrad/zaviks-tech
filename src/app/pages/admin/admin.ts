import { afterNextRender, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/auth';
import { Seo } from '../../core/seo';
import { Icon } from '../../shared/icon';
import { AdminStore } from './store';

@Component({
  selector: 'app-admin',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Icon],
  templateUrl: './admin.html',
})
export class Admin {
  readonly auth = inject(AuthService);
  readonly store = inject(AdminStore);
  readonly links = [
    { path: '/admin', label: 'Overview', icon: 'layers', exact: true },
    { path: '/admin/requests', label: 'Requests', icon: 'tag', exact: false },
    { path: '/admin/customers', label: 'Customers', icon: 'eye', exact: false },
    { path: '/admin/products', label: 'Products', icon: 'box', exact: false },
  ];

  constructor() {
    inject(Seo).set({
      title: 'Admin',
      description: 'Zaviks Tech admin panel.',
      path: '/admin',
      noindex: true,
    });
    afterNextRender(() => {
      void this.auth.ready.then(() => {
        if (this.auth.isAdmin()) void this.store.load();
      });
    });
  }
}
