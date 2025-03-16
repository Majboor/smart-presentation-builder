
/**
 * Service for handling payment processing
 */

const PAYMENT_API_URL = 'https://pay.techrealm.pk/create-payment';

export interface CreatePaymentRequest {
  amount: number;
  redirection_url?: string;
}

export interface CreatePaymentResponse {
  payment_url: string;
  special_reference: string;
}

/**
 * Creates a payment intention for the given amount
 * @param amount Amount to charge in AED (100 = 1 AED)
 * @param redirectionUrl URL to redirect after payment completion
 * @returns Response with payment link and reference
 */
export const createPayment = async (
  amount: number,
  redirectionUrl?: string
): Promise<CreatePaymentResponse> => {
  try {
    console.log('Creating payment for amount:', amount);
    
    const payload: CreatePaymentRequest = { amount };
    
    // Add redirection URL if provided
    if (redirectionUrl) {
      payload.redirection_url = redirectionUrl;
    }
    
    const response = await fetch(PAYMENT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
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

/**
 * Verifies a payment based on URL parameters after redirection
 * @param urlParams URL parameters from the redirection URL
 * @returns True if payment was successful
 */
export const verifyPayment = async (urlParams: URLSearchParams): Promise<boolean> => {
  try {
    const success = urlParams.get('success') === 'true';
    const txnResponseCode = urlParams.get('txn_response_code');
    const message = urlParams.get('data.message');
    
    // Check basic payment parameters
    if (success && txnResponseCode === 'APPROVED' && message === 'Approved') {
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error verifying payment:', error);
    return false;
  }
};
