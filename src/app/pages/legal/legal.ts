import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Seo } from '../../core/seo';
import { legalBySlug, type LegalPage } from '../../data/legal';

@Component({
  selector: 'app-legal',
  imports: [RouterLink],
  templateUrl: './legal.html',
})
export class Legal {
  private readonly seo = inject(Seo);
  readonly page = signal<LegalPage | undefined>(undefined);

  constructor() {
    inject(ActivatedRoute)
      .paramMap.pipe(takeUntilDestroyed(inject(DestroyRef)))
      .subscribe((params) => {
        const page = legalBySlug(params.get('page'));
        this.page.set(page);
        if (!page) {
          this.seo.set({
            title: 'Legal',
            description: 'Terms, privacy, licence, and refunds for Zaviks Tech.',
            path: '/',
          });
          return;
        }
        this.seo.set({
          title: page.title,
          description: page.description,
          path: `/legal/${page.slug}`,
        });
      });
  }
}
