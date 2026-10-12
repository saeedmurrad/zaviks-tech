import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Seo } from '../../core/seo';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  templateUrl: './not-found.html',
})
export class NotFound {
  constructor() {
    inject(Seo).set({
      title: 'Page not found',
      description: 'That page is not on the Zaviks Tech site.',
      path: '/404',
    });
  }
}
