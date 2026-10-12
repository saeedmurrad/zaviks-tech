import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Seo } from '../../core/seo';
import { principles } from '../../data/site';
import { Icon } from '../../shared/icon';
import { Reveal } from '../../shared/reveal';

@Component({
  selector: 'app-services',
  imports: [RouterLink, Icon, Reveal],
  templateUrl: './services.html',
})
export class Services {
  readonly principles = principles;

  constructor() {
    inject(Seo).set({
      title: 'Services',
      description:
        'Zaviks Tech customises a shelf product, deploys it on your server or cloud, and maintains it afterwards.',
      path: '/services',
    });
  }
}
