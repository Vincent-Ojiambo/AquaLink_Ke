import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Smartphone, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Define types manually to avoid dependency on database.types.ts
interface TransactionInsert {
  id?: string;
  catch_id: string;
  fisher_id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  payment_method: string;
  payment_reference: string;
  phone_number: string;
  created_at?: string;
  updated_at?: string;
}

interface CatchesUpdate {
  status: 'available' | 'sold' | 'discarded';
  updated_at?: string;
  [key: string]: any;
}

type TransactionStatus = 'pending' | 'completed' | 'failed';

// Extend the types to include our custom fields
type CustomTransactionInsert = Omit<TransactionInsert, 'status' | 'payment_method' | 'payment_reference' | 'phone_number'> & {
  status: TransactionStatus;
  payment_method: string;
  payment_reference: string;
  phone_number: string;
};

// Use CatchesUpdate directly since we've defined it manually
type CustomCatchesUpdate = CatchesUpdate;

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: {
    id: string;
    fish_type: string;
    quantity_kg: number;
    price_per_kg: number;
    fisher_id: string;
  };
  onSuccess: () => void;
}

export default function PaymentModal({ isOpen, onClose, listing, onSuccess }: PaymentModalProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const formatPhoneNumber = (input: string) => {
    // Remove all non-digit characters
    const digits = input.replace(/\D/g, '');
    
    // Format as Kenyan phone number (e.g., 712 345 678)
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 9)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length <= 9) { // Kenyan phone numbers are 9 digits without country code
      setPhoneNumber(value);
    }
  };

  const handlePayment = async () => {
    if (!phoneNumber || phoneNumber.length !== 9) {
      setError('Please enter a valid M-Pesa phone number (e.g., 712345678)');
      return;
    }

    setError(null);
    setIsProcessing(true);
    setPaymentStatus('processing');

    try {
      // In a real app, you would call your backend API to initiate M-Pesa payment
      // For now, we'll simulate a successful payment after a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create a transaction record in the database
      const transactionData: CustomTransactionInsert = {
        catch_id: listing.id,
        fisher_id: listing.fisher_id,
        amount: listing.quantity_kg * listing.price_per_kg,
        status: 'completed',
        payment_method: 'mpesa',
        payment_reference: `MPESA-${Date.now()}`,
        phone_number: `+254${phoneNumber}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Insert transaction with type assertion
      const { data, error: insertError } = await (supabase as any)
        .from('transactions')
        .insert([transactionData])
        .select()
        .single();
      
      if (insertError) throw insertError;

      // Update the catch status to sold
      const updateData: CustomCatchesUpdate = { 
        status: 'sold',
        updated_at: new Date().toISOString()
      };

      // Update catch status with type assertion
      const { error: updateError } = await (supabase as any)
        .from('catches')
        .update(updateData)
        .eq('id', listing.id);

      if (updateError) throw updateError;

      setPaymentStatus('success');
      
      // Show success message
      toast({
        title: "Payment Successful",
        description: `You've successfully purchased ${listing.quantity_kg}kg of ${listing.fish_type}.`,
      });
      
      // Close the modal after 2 seconds
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
      
    } catch (err) {
      console.error('Payment error:', err);
      setPaymentStatus('error');
      setError(err instanceof Error ? err.message : 'Failed to process payment');
      
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const resetForm = () => {
    setPhoneNumber('');
    setError(null);
    setPaymentStatus('idle');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {paymentStatus === 'success' ? 'Payment Successful' : 
             paymentStatus === 'error' ? 'Payment Failed' : 'Complete Payment'}
          </h2>
          <button 
            onClick={() => {
              onClose();
              resetForm();
            }}
            className="text-gray-500 hover:text-gray-700"
            disabled={isProcessing}
          >
            ✕
          </button>
        </div>
        
        {paymentStatus === 'success' ? (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Payment Successful!</h3>
            <p className="text-gray-600">Your transaction is being processed.</p>
          </div>
        ) : paymentStatus === 'error' ? (
          <div className="text-center py-8">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Payment Failed</h3>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <Button onClick={() => setPaymentStatus('idle')} className="mt-4">
              Try Again
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Item:</span>
                <span className="font-medium">{listing.quantity_kg}kg {listing.fish_type}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Price per kg:</span>
                <span className="font-medium">KSh {listing.price_per_kg.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2 mt-4">
                <span>Total:</span>
                <span>KSh {(listing.quantity_kg * listing.price_per_kg).toLocaleString()}</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  M-Pesa Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">+254</span>
                  </div>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="712 345 678"
                    className="pl-16"
                    value={formatPhoneNumber(phoneNumber)}
                    onChange={handlePhoneChange}
                    disabled={isProcessing}
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Enter your M-Pesa registered phone number (e.g., 712 345 678)
                </p>
                {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
              </div>
              
              <Button
                onClick={handlePayment}
                disabled={isProcessing || !phoneNumber || phoneNumber.length !== 9}
                className="w-full bg-green-600 hover:bg-green-700 h-12 mt-4"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Smartphone className="mr-2 h-5 w-5" />
                    Pay with M-Pesa
                  </>
                )}
              </Button>
              
              <div className="flex items-center justify-center mt-4 text-xs text-gray-500">
                <div className="bg-gray-100 p-2 rounded-lg text-center">
                  <p>You'll receive an M-Pesa prompt on your phone</p>
                  <p>to complete the payment</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
