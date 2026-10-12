import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Seo } from '../../core/seo';
import { roadmap, type RoadmapStatus } from '../../data/site';
import { Reveal } from '../../shared/reveal';

const labels: Record<RoadmapStatus, string> = {
  live: 'Live',
  building: 'In progress',
  planned: 'Planned',
};

@Component({
  selector: 'app-roadmap',
  imports: [RouterLink, Reveal],
  templateUrl: './roadmap.html',
})
export class Roadmap {
  readonly phases = roadmap;

  constructor() {
    inject(Seo).set({
      title: 'Roadmap',
      description:
        'What the Zaviks Tech platform does today and what comes next: accounts, checkout, project tracking, support tickets, and more products.',
      path: '/roadmap',
    });
  }

  label(status: RoadmapStatus): string {
    return labels[status];
  }

  count(status: RoadmapStatus): number {
    return this.phases.flatMap((phase) => phase.items).filter((item) => item.status === status)
      .length;
  }
}
