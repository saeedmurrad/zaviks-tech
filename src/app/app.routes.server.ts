import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'shelf/:slug',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return [{ slug: 'parkspace' }, { slug: 'clientline' }, { slug: 'stockroom' }];
    },
  },
  {
    path: 'legal/:page',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      return [{ page: 'terms' }, { page: 'privacy' }, { page: 'licence' }, { page: 'refund' }];
    },
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
