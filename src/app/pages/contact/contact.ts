import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EnquiryService } from '../../core/enquiry';
import { Seo } from '../../core/seo';
import { site } from '../../data/site';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule],
  templateUrl: './contact.html',
})
export class Contact {
  private readonly enquiries = inject(EnquiryService);
  readonly site = site;
  readonly tried = signal(false);
  readonly status = signal<'idle' | 'sending' | 'sent' | 'mailto' | 'error'>('idle');
  readonly mailtoHref = signal('');
  readonly form = inject(FormBuilder).nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(120)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(160)]],
    company: ['', [Validators.maxLength(160)]],
    phone: ['', [Validators.maxLength(40)]],
    message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(4000)]],
    website: [''],
  });

  constructor() {
    inject(Seo).set({
      title: 'Contact',
      description: 'Write to Zaviks Tech about a shelf product, a customisation, or a maintenance plan.',
      path: '/contact',
    });
  }

  invalid(name: 'name' | 'email' | 'company' | 'phone' | 'message'): boolean {
    const control = this.form.controls[name];
    return this.tried() && control.invalid;
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
      type: 'contact' as const,
      name: value.name,
      email: value.email,
      company: value.company,
      phone: value.phone,
      productSlug: '',
      message: value.message,
      priority: 'standard' as const,
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
