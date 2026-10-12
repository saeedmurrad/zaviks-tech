import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Seo } from '../../core/seo';
import { plans } from '../../data/site';
import { Icon } from '../../shared/icon';
import { Reveal } from '../../shared/reveal';

@Component({
  selector: 'app-pricing',
  imports: [RouterLink, Icon, Reveal],
  templateUrl: './pricing.html',
})
export class Pricing {
  readonly plans = plans;

  constructor() {
    inject(Seo).set({
      title: 'Pricing',
      description:
        'Zaviks Tech prices a base licence, a customisation quote, and a maintenance plan. Starting figures are confirmed in the quote.',
      path: '/pricing',
    });
  }
}
