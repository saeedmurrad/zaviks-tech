import { afterNextRender, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EnquiryService, type EnquiryPriority, type EnquiryType } from '../../core/enquiry';
import { Seo } from '../../core/seo';
import { productBySlug, products } from '../../data/products';

@Component({
  selector: 'app-request',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './request.html',
})
export class Request {
  private readonly enquiries = inject(EnquiryService);
  readonly products = products;
  readonly tried = signal(false);
  readonly status = signal<'idle' | 'sending' | 'sent' | 'mailto' | 'error'>('idle');
  readonly mailtoHref = signal('');
  readonly form = inject(FormBuilder).nonNullable.group({
    product: ['', Validators.required],
    intent: ['purchase' as EnquiryType, Validators.required],
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(120)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(160)]],
    company: ['', [Validators.required, Validators.maxLength(160)]],
    phone: ['', [Validators.maxLength(40)]],
    priority: ['standard' as EnquiryPriority, Validators.required],
    message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(3000)]],
    links: ['', [Validators.maxLength(800)]],
    website: [''],
  });

  constructor() {
    inject(Seo).set({
      title: 'Request a product',
      description:
        'Ask Zaviks Tech to license a shelf product or to quote a customisation. Payment is not taken on this form.',
      path: '/request',
    });

    const route = inject(ActivatedRoute);
    afterNextRender(() => {
      const product = route.snapshot.queryParamMap.get('product') ?? '';
      const intent = route.snapshot.queryParamMap.get('intent');
      if (productBySlug(product)) {
        this.form.controls.product.setValue(product);
      }
      if (intent === 'purchase' || intent === 'customisation') {
        this.form.controls.intent.setValue(intent);
      }
    });
  }

  invalid(name: 'product' | 'name' | 'email' | 'company' | 'message'): boolean {
    return this.tried() && this.form.controls[name].invalid;
  }

  async submit(): Promise<void> {
    this.tried.set(true);
    if (this.form.invalid || this.status() === 'sending') {
      return;
    }
    const value = this.form.getRawValue();
    if (value.website.trim()) {
      this.status.set('sent');
      return;
    }
    const enquiry = {
      type: value.intent === 'customisation' ? ('customisation' as const) : ('purchase' as const),
      name: value.name,
      email: value.email,
      company: value.company,
      phone: value.phone,
      productSlug: value.product,
      message: value.links.trim()
        ? `${value.message.trim()}\n\nLinks to documents:\n${value.links.trim()}`
        : value.message,
      priority: value.priority,
    };
    this.mailtoHref.set(this.enquiries.mailto(enquiry));
    if (!this.enquiries.configured()) {
      this.status.set('mailto');
      return;
    }
    this.status.set('sending');
    try {
      await this.enquiries.send(enquiry);
      this.status.set('sent');
    } catch {
      this.status.set('error');
    }
  }
}
