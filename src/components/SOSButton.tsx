import { useState, useEffect, useCallback, useRef } from 'react';
import { AlertTriangle, X, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useEmergencyAlerts } from '@/hooks/useEmergencyAlerts';
import { cn } from '@/lib/utils';

interface SOSButtonProps {
  className?: string;
  testMode?: boolean;
  countdownSeconds?: number;
  onAlertSent?: (alert: any) => void;
  onError?: (error: Error) => void;
}

export function SOSButton({ 
  className = '', 
  testMode = false, 
  countdownSeconds: initialCountdownSeconds = 5,
  onAlertSent,
  onError
}: SOSButtonProps) {
  const [isActive, setIsActive] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [countdown, setCountdown] = useState(initialCountdownSeconds);
  const [position, setPosition] = useState<{ lat: number; lng: number; accuracy?: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { sendEmergencyAlert, isLoading } = useEmergencyAlerts();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isProcessing = useRef(false);

  // Get current location
  const getLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return null;
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      });

      return {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy
      };
    } catch (err) {
      console.error('Error getting location:', err);
      setError('Unable to retrieve your location. Please check your browser permissions.');
      return null;
    }
  }, []);

  // Toggle SOS button
  const handleSOS = useCallback(async () => {
    // Prevent multiple rapid clicks
    if (isProcessing.current) return;
    isProcessing.current = true;

    try {
      if (isActive) {
        // Cancel the alert
        setIsActive(false);
        setIsConfirming(false);
        setCountdown(initialCountdownSeconds);
        
        // Provide haptic feedback if available
        if (navigator.vibrate) {
          navigator.vibrate(50);
        }
        return;
      }

      // First click - show confirmation
      if (!isConfirming) {
        setIsConfirming(true);
        
        // Reset confirmation after 3 seconds if no second click
        const timeoutId = setTimeout(() => {
          if (isConfirming) {
            setIsConfirming(false);
          }
        }, 3000);
        
        // Cleanup
        return () => clearTimeout(timeoutId);
      }

      // Second click - proceed with alert
      setIsActive(true);
      setIsConfirming(false);
      setError(null);

      // Get location
      try {
        const location = await getLocation();
        if (location) {
          setPosition(location);
          
          // Provide haptic feedback
          if (navigator.vibrate) {
            navigator.vibrate([100, 50, 100]);
          }
        } else {
          throw new Error('Could not get your location. Please ensure location services are enabled.');
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to get location');
        console.error('Error getting location:', error);
        setError(error.message);
        setIsActive(false);
        setCountdown(initialCountdownSeconds);
        onError?.(error);
        
        // Show error toast
        toast({
          title: 'Location Error',
          description: error.message,
          variant: 'destructive',
        });
      }
    } finally {
      isProcessing.current = false;
    }
  }, [isActive, isConfirming, getLocation, initialCountdownSeconds, onError, toast]);

  // Handle countdown
  useEffect(() => {
    if (!isActive || !position) return;

    let timer: NodeJS.Timeout;
    let vibrationInterval: NodeJS.Timeout;

    // Define the sendSOS function inside the effect to access the latest state
    const sendSOS = async () => {
      try {
        if (!position) {
          throw new Error('No location available');
        }
        
        // Stop vibration
        if (navigator.vibrate) {
          navigator.vibrate(0);
        }
        
        // Send the emergency alert
        const alert = await sendEmergencyAlert(position, testMode);
        
        // Notify parent component
        onAlertSent?.(alert);
        
        // Show success message with haptic feedback
        if (navigator.vibrate) {
          navigator.vibrate([100, 50, 100, 50, 100]);
        }
        
        toast({
          title: testMode ? 'Test Alert Sent!' : 'Emergency Alert Sent!',
          description: testMode 
            ? 'This was a test alert. No actual emergency contacts were notified.'
            : 'Help is on the way. Your location has been shared with emergency contacts.',
          variant: testMode ? 'default' : 'destructive',
          duration: 10000, // Show for 10 seconds
        });
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to send emergency alert');
        console.error('Error sending emergency alert:', error);
        
        // Show error toast with haptic feedback
        if (navigator.vibrate) {
          navigator.vibrate([200, 100, 200, 100, 200]);
        }
        
        toast({
          title: testMode ? 'Test Alert Failed' : 'Emergency Alert Failed',
          description: error.message,
          variant: 'destructive',
          duration: 8000,
        });
        
        // Notify parent component
        onError?.(error);
        setError(error.message);
      } finally {
        // Reset state
        setIsActive(false);
        setIsConfirming(false);
        setCountdown(initialCountdownSeconds);
        setPosition(null);
      }
    };
    
    // Add vibration pattern during countdown
    if (navigator.vibrate) {
      vibrationInterval = setInterval(() => {
        navigator.vibrate(200);
      }, 1000);
    }

    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
      return () => {
        clearTimeout(timer);
        if (vibrationInterval) clearInterval(vibrationInterval);
      };
    } else {
      sendSOS();
      if (vibrationInterval) clearInterval(vibrationInterval);
    }
  }, [
    countdown, 
    isActive, 
    position, 
    sendEmergencyAlert, 
    testMode, 
    onAlertSent, 
    onError, 
    initialCountdownSeconds, 
    toast
  ]);

  // Render confirmation state
  if (isConfirming) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <div className="bg-amber-500 text-white p-4 rounded-lg shadow-lg max-w-xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <ShieldAlert className="w-5 h-5 mr-2" />
              <span className="font-bold">Confirm Emergency</span>
            </div>
            <button 
              onClick={handleSOS}
              className="text-white hover:bg-amber-600 rounded-full p-1"
              aria-label="Cancel"
              disabled={isLoading}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm mb-2">
            {testMode ? 'Test alert' : 'Emergency alert'} will be sent if you press the button again.
          </p>
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-amber-600 bg-white hover:bg-amber-50"
              onClick={handleSOS}
              disabled={isLoading}
            >
              {testMode ? 'Send Test Alert' : 'Send Emergency Alert'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Render active countdown state
  if (isActive) {
    return (
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        <div className="bg-red-600 text-white p-4 rounded-lg shadow-lg max-w-xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              <span className="font-bold">
                {testMode ? 'TEST ' : ''}Emergency SOS
              </span>
            </div>
            <button 
              onClick={handleSOS}
              className="text-white hover:bg-red-700 rounded-full p-1"
              aria-label="Cancel SOS"
              disabled={isLoading}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <p className="text-sm mb-3">
            {countdown > 0 
              ? `${testMode ? 'Test alert' : 'Emergency alert'} will be sent in ${countdown} seconds...`
              : 'Sending alert...'}
          </p>
          
          <div className="w-full bg-red-300 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${(countdown / initialCountdownSeconds) * 100}%` }}
            />
          </div>
          
          {error && (
            <p className="text-xs mt-2 text-red-100">{error}</p>
          )}
          
          {isLoading && !error && (
            <p className="text-xs mt-2 text-red-100">Processing...</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        ref={buttonRef}
        onClick={handleSOS}
        disabled={isLoading}
        className={cn(
          'text-white rounded-full h-16 w-16 shadow-lg transform transition-transform',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500',
          'active:scale-95',
          testMode 
            ? 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500' 
            : 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
          isLoading && 'opacity-80 cursor-not-allowed',
          className
        )}
        aria-label={testMode ? 'Test Emergency SOS' : 'Emergency SOS'}
        aria-live="assertive"
      >
        <div className="flex flex-col items-center">
          {isLoading ? (
            <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full my-1"></div>
          ) : (
            <>
              <AlertTriangle className="w-6 h-6 mb-1" />
              <span className="text-xs font-bold">{testMode ? 'TEST ' : ''}SOS</span>
            </>
          )}
        </div>
      </Button>
      
      {/* Accessibility announcement */}
      <div className="sr-only" role="status" aria-live="polite">
        {isLoading 
          ? 'Sending emergency alert...' 
          : isConfirming 
            ? 'Press again to confirm emergency alert' 
            : 'Emergency SOS button ready'}
      </div>
    </div>
  );
}
