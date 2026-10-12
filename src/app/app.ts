import { DOCUMENT } from '@angular/common';
import { Component, DestroyRef, effect, HostListener, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { legalPages } from './data/legal';
import { products } from './data/products';
import { nav, site } from './data/site';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
})
export class App {
  private readonly document = inject(DOCUMENT);
  readonly site = site;
  readonly nav = nav;
  readonly products = products;
  readonly legalPages = legalPages;
  readonly menuOpen = signal(false);
  readonly year = new Date().getFullYear();
  private readonly lockScroll = effect(() => {
    this.document.body.classList.toggle('menu-open', this.menuOpen());
  });

  constructor() {
    const router = inject(Router);
    const destroyRef = inject(DestroyRef);
    let firstNavigation = true;
    router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(destroyRef),
      )
      .subscribe(() => {
        this.menuOpen.set(false);
        if (firstNavigation) {
          firstNavigation = false;
          return;
        }
        this.document.getElementById('content')?.focus();
      });
  }

  @HostListener('document:keydown.escape')
  closeMenu(): void {
    this.menuOpen.set(false);
  }
}
