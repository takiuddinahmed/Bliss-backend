import { Injectable } from '@nestjs/common';
import { Stripe } from 'stripe';

@Injectable()
export class PaymentService {
  private apiKey: string;
  private secretKey: string;
  private stripeMode: string;
  private stripe: Stripe;
  constructor() {
    this.apiKey = process.env.STRIPE_API_KEY;
    this.secretKey = process.env.STRIPE_SECRET_KEY;
    this.stripeMode = process.env.STRIPE_MODE;
    this.stripe = new Stripe(this.apiKey, {
      apiVersion: '2022-11-15',
      typescript: true,
    });
  }
  
}
