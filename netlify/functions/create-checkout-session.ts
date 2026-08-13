import { Handler } from '@netlify/functions';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { quoteId, quoteNumber, customerEmail, depositAmount, returnUrl } = JSON.parse(event.body || '{}');

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: customerEmail,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Upfront Deposit - Quote #${quoteNumber}`,
              description: `Initial deposit to confirm job dispatch`,
            },
            unit_amount: Math.round(depositAmount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      metadata: { quoteId, quoteNumber },
      success_url: `${returnUrl}?status=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${returnUrl}?status=cancelled`,
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ checkoutUrl: session.url }),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
