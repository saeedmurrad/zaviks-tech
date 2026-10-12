import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';

/**
 * The ParkSpace demo API runs on a free tier that sleeps when idle and takes up to a
 * minute to wake. Pinging it as soon as a visitor lands on a page that links to the demo
 * means the server is usually ready by the time they click "Open live demo".
 */
@Injectable({ providedIn: 'root' })
export class DemoWarmup {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly pinged = new Set<string>();

  ping(healthUrl: string | undefined): void {
    if (!this.isBrowser || !healthUrl || this.pinged.has(healthUrl)) {
      return;
    }
    this.pinged.add(healthUrl);
    fetch(healthUrl, { mode: 'no-cors', cache: 'no-store' }).catch(() => undefined);
  }
}
