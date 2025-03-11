
/**
 * Service for handling payment processing
 */

const PAYMENT_API_URL = 'https://pay.techrealm.pk/create-payment';

export interface CreatePaymentRequest {
  amount: number;
}

export interface CreatePaymentResponse {
  payment_link: string;
  reference: string;
}

/**
 * Creates a payment intention for the given amount
 * @param amount Amount to charge in AED (100 = 1 AED)
 * @returns Response with payment link and reference
 */
export const createPayment = async (amount: number): Promise<CreatePaymentResponse> => {
  try {
    console.log('Creating payment for amount:', amount);
    const response = await fetch(PAYMENT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount }),
    });

    if (!response.ok) {
      throw new Error(`Payment API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Payment API response:', data);
    return data;
  } catch (error) {
    console.error('Error creating payment:', error);
    throw error;
  }
};
