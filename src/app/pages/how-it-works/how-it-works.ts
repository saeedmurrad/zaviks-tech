import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Seo } from '../../core/seo';
import { stages } from '../../data/site';

@Component({
  selector: 'app-how-it-works',
  imports: [RouterLink],
  templateUrl: './how-it-works.html',
})
export class HowItWorks {
  readonly stages = stages;

  constructor() {
    inject(Seo).set({
      title: 'How it works',
      description:
        'Browse the shelf, license a product, then Zaviks Tech customises it, deploys it, and maintains it.',
      path: '/how-it-works',
    });
  }
}
