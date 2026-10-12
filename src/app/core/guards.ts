import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth';

/** Signed-in customers only. Prerendering passes through; the page shows a loading state until the session is known. */
export const authGuard: CanActivateFn = async (_route, state) => {
  if (!isPlatformBrowser(inject(PLATFORM_ID))) return true;
  const auth = inject(AuthService);
  const router = inject(Router);
  await auth.ready;
  return auth.user()
    ? true
    : router.createUrlTree(['/login'], { queryParams: { next: state.url } });
};

export const adminGuard: CanActivateFn = async (_route, state) => {
  if (!isPlatformBrowser(inject(PLATFORM_ID))) return true;
  const auth = inject(AuthService);
  const router = inject(Router);
  await auth.ready;
  if (!auth.user()) return router.createUrlTree(['/login'], { queryParams: { next: state.url } });
  return auth.isAdmin() ? true : router.createUrlTree(['/account']);
};
