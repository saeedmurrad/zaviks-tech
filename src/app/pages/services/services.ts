import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Seo } from '../../core/seo';

@Component({
  selector: 'app-services',
  imports: [RouterLink],
  templateUrl: './services.html',
})
export class Services {
  constructor() {
    inject(Seo).set({
      title: 'Services',
      description:
        'Zaviks Tech customises a shelf product, deploys it on your server or cloud, and maintains it afterwards.',
      path: '/services',
    });
  }
}
