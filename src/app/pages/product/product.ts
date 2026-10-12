import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DemoWarmup } from '../../core/demo-warmup';
import { absoluteUrl, Seo } from '../../core/seo';
import { productBySlug, products, type Product } from '../../data/products';
import { ProductCard } from '../../shared/product-card';
import { ProductMock } from '../../shared/product-mock';

@Component({
  selector: 'app-product',
  imports: [RouterLink, ProductMock, ProductCard],
  templateUrl: './product.html',
})
export class ProductPage {
  private readonly seo = inject(Seo);
  private readonly warmup = inject(DemoWarmup);
  readonly product = signal<Product | undefined>(undefined);
  readonly others = signal<Product[]>([]);

  constructor() {
    inject(ActivatedRoute)
      .paramMap.pipe(takeUntilDestroyed(inject(DestroyRef)))
      .subscribe((params) => {
        const product = productBySlug(params.get('slug'));
        this.product.set(product);
        this.warmup.ping(product?.demoHealthUrl);
        this.others.set(products.filter((item) => item.slug !== product?.slug));
        if (!product) {
          this.seo.set({
            title: 'Not on the shelf',
            description: 'That product is not on the Zaviks Tech shelf.',
            path: '/shelf',
          });
          return;
        }
        this.seo.set({
          title: product.name,
          description: product.summary,
          path: `/shelf/${product.slug}`,
          jsonLd: {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: product.name,
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web',
            description: product.summary,
            url: absoluteUrl(`/shelf/${product.slug}`),
            offers:
              product.priceValue === null
                ? {
                    '@type': 'Offer',
                    priceCurrency: 'GBP',
                    availability: 'https://schema.org/PreOrder',
                    description: 'Licence quoted for the business.',
                  }
                : {
                    '@type': 'Offer',
                    priceCurrency: 'GBP',
                    price: product.priceValue,
                    availability: 'https://schema.org/PreOrder',
                    description: 'Starting price. The final figure is confirmed in the quote.',
                  },
            ...(product.demoUrl
              ? {
                  potentialAction: {
                    '@type': 'ViewAction',
                    name: 'Open live demo',
                    target: product.demoUrl,
                  },
                }
              : {}),
          },
        });
      });
  }
}
