import { isPlatformBrowser } from '@angular/common';
import { afterNextRender, Directive, ElementRef, inject, PLATFORM_ID } from '@angular/core';

/**
 * Fades an element up as it scrolls into view. The element renders normally without JavaScript:
 * the hidden state only applies once the `js` class is on <html>, which App adds after hydration.
 */
@Directive({
  selector: '[reveal]',
  host: { class: 'reveal' },
})
export class Reveal {
  constructor() {
    const el = inject(ElementRef<HTMLElement>).nativeElement;
    const isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
    afterNextRender(() => {
      if (!isBrowser || typeof IntersectionObserver === 'undefined') {
        el.classList.add('in');
        return;
      }
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              el.classList.add('in');
              observer.disconnect();
            }
          }
        },
        { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
      );
      observer.observe(el);
    });
  }
}
