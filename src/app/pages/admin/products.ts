import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { products } from '../../data/products';

@Component({
  selector: 'app-admin-products',
  imports: [RouterLink],
  templateUrl: './products.html',
})
export class AdminProducts {
  readonly products = products;
}
