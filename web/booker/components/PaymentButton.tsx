'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard, Loader2 } from 'lucide-react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PaymentButtonProps {
  serviceRequestId: number;
  amount: number;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function PaymentButton({ 
  serviceRequestId, 
  amount, 
  onSuccess, 
  onError 
}: PaymentButtonProps) {
  const [loading, setLoading] = useState(false);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay SDK');
      }

      // Create order
      const token = localStorage.getItem('token');
      const orderResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/create-order/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          service_request_id: serviceRequestId,
          amount: amount
        })
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to create order');
      }

      const orderData = await orderResponse.json();

      // Razorpay options
      const options = {
        key: orderData.key_id,
        amount: orderData.amount * 100, // Convert to paise
        currency: 'INR',
        name: 'VehicAid',
        description: `Payment for Service Request #${serviceRequestId}`,
        order_id: orderData.order_id,
        handler: async function (response: any) {
          try {
            // Verify payment
            const verifyResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/verify/`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                payment_id: orderData.payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            if (!verifyResponse.ok) {
              throw new Error('Payment verification failed');
            }

            const verifyData = await verifyResponse.json();
            
            if (verifyData.success) {
              onSuccess?.();
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            onError?.(error instanceof Error ? error.message : 'Payment verification failed');
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: ''
        },
        theme: {
          color: '#2563eb'
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      setLoading(false);
      onError?.(error instanceof Error ? error.message : 'Payment failed');
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={loading}
      className="w-full bg-blue-600 hover:bg-blue-700"
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <CreditCard className="w-4 h-4 mr-2" />
          Pay ₹{amount}
        </>
      )}
    </Button>
  );
}
