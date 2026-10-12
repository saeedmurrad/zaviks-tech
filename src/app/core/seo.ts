import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { environment } from '../../environments/environment';

export function absoluteUrl(path: string): string {
  const base = environment.siteUrl.replace(/\/$/, '');
  if (!path || path === '/') {
    return `${base}/`;
  }
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

export interface PageMeta {
  title: string;
  description: string;
  path: string;
  jsonLd?: unknown;
  /** Keep private pages such as the account and admin areas out of search results. */
  noindex?: boolean;
}

@Injectable({ providedIn: 'root' })
export class Seo {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  set(page: PageMeta): void {
    const fullTitle = page.title.includes('Zaviks') ? page.title : `${page.title} · Zaviks Tech`;
    const url = absoluteUrl(page.path);
    const image = absoluteUrl('/og.png');

    this.title.setTitle(fullTitle);
    this.meta.updateTag({ name: 'description', content: page.description });
    this.meta.updateTag({
      name: 'robots',
      content: page.noindex ? 'noindex,nofollow' : 'index,follow',
    });
    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:description', content: page.description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: fullTitle });
    this.meta.updateTag({ name: 'twitter:description', content: page.description });
    this.meta.updateTag({ name: 'twitter:image', content: image });

    let canonical = this.document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = this.document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      this.document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);

    this.document.getElementById('ld-json')?.remove();
    if (page.jsonLd) {
      const script = this.document.createElement('script');
      script.id = 'ld-json';
      script.type = 'application/ld+json';
      script.text = JSON.stringify(page.jsonLd);
      this.document.head.appendChild(script);
    }
  }
}
