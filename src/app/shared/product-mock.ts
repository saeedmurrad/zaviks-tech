import { Component, input } from '@angular/core';
import type { MockKind } from '../data/products';

@Component({
  selector: 'app-product-mock',
  templateUrl: './product-mock.html',
})
export class ProductMock {
  readonly kind = input.required<MockKind>();
}
