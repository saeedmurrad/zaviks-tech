import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Seo } from '../../core/seo';
import { products } from '../../data/products';
import { ProductCard } from '../../shared/product-card';

@Component({
  selector: 'app-shelf',
  imports: [ProductCard, RouterLink],
  templateUrl: './shelf.html',
})
export class Shelf {
  readonly query = signal('');
  readonly industry = signal('All');
  readonly price = signal('all');
  readonly industries = ['All', ...new Set(products.map((product) => product.industry))];
  readonly prices = [
    { id: 'all', label: 'Any price' },
    { id: 'under', label: 'Under £3,000' },
    { id: 'over', label: '£3,000 and over' },
    { id: 'quoted', label: 'Quoted' },
  ];

  readonly results = computed(() => {
    const query = this.query().trim().toLowerCase();
    return products.filter((product) => {
      const haystack = [
        product.name,
        product.promise,
        product.summary,
        product.category,
        product.industry,
      ]
        .join(' ')
        .toLowerCase();
      const matchesQuery = !query || haystack.includes(query);
      const matchesIndustry = this.industry() === 'All' || product.industry === this.industry();
      const matchesPrice =
        this.price() === 'all' ||
        (this.price() === 'quoted' && product.priceValue === null) ||
        (this.price() === 'under' && product.priceValue !== null && product.priceValue < 3000) ||
        (this.price() === 'over' && product.priceValue !== null && product.priceValue >= 3000);
      return matchesQuery && matchesIndustry && matchesPrice;
    });
  });

  constructor() {
    inject(Seo).set({
      title: 'The shelf',
      description:
        'Browse Zaviks Tech products: ParkSpace, a driveway marketplace with a live demo, plus Clientline CRM and Stockroom inventory.',
      path: '/shelf',
    });
  }

  clear(): void {
    this.query.set('');
    this.industry.set('All');
    this.price.set('all');
  }
}
