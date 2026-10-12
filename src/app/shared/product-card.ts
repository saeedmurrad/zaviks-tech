import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { Product } from '../data/products';
import { ProductMock } from './product-mock';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink, ProductMock],
  templateUrl: './product-card.html',
})
export class ProductCard {
  readonly product = input.required<Product>();
}
