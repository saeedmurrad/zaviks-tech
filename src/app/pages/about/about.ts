import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Seo } from '../../core/seo';

@Component({
  selector: 'app-about',
  imports: [RouterLink],
  templateUrl: './about.html',
})
export class About {
  constructor() {
    inject(Seo).set({
      title: 'About',
      description:
        'Zaviks Tech is a software studio that licenses ready-made products, then customises and deploys them for each business.',
      path: '/about',
    });
  }
}
