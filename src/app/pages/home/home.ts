import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DemoWarmup } from '../../core/demo-warmup';
import { absoluteUrl, Seo } from '../../core/seo';
import { products } from '../../data/products';
import { benefits, plans, site, stages } from '../../data/site';
import { ProductCard } from '../../shared/product-card';
import { Icon } from '../../shared/icon';
import { ProductMock } from '../../shared/product-mock';
import { Reveal } from '../../shared/reveal';

@Component({
  selector: 'app-home',
  imports: [RouterLink, ProductMock, ProductCard, Icon, Reveal],
  templateUrl: './home.html',
})
export class Home {
  readonly products = products;
  readonly stages = stages;
  readonly plans = plans;
  readonly benefits = benefits;
  readonly parkspace = products[0];

  constructor() {
    inject(DemoWarmup).ping(this.parkspace.demoHealthUrl);
    inject(Seo).set({
      title: 'Zaviks Tech — Software that already works',
      description: site.description,
      path: '/',
      jsonLd: {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Organization',
            name: site.name,
            url: absoluteUrl('/'),
            email: site.email,
            description: site.description,
          },
          {
            '@type': 'WebSite',
            name: site.name,
            url: absoluteUrl('/'),
            description: site.description,
          },
        ],
      },
    });
  }
}
