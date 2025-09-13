import { useState, useEffect, useCallback } from 'react';
import { MapPin, MapPinOff, RefreshCw, AlertCircle, Compass, Satellite, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { locationService, Position, LocationError } from '@/services/locationService';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface GPSTrackerProps {
  onLocationUpdate?: (position: Position) => void;
  onError?: (error: LocationError) => void;
  updateInterval?: number;
  showMapLink?: boolean;
  className?: string;
}

export function GPSTracker({
  onLocationUpdate,
  onError,
  updateInterval = 30000, // 30 seconds
  showMapLink = true,
  className = ''
}: GPSTrackerProps) {
  const [position, setPosition] = useState<Position | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [error, setError] = useState<LocationError | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [signalStrength, setSignalStrength] = useState<number>(0);
  const [satellites, setSatellites] = useState<number>(0);
  const { toast } = useToast();
  
  // Mock satellite data (in a real app, this would come from the device's GPS)
  useEffect(() => {
    if (isTracking) {
      const interval = setInterval(() => {
        setSignalStrength(Math.min(100, Math.max(0, signalStrength + (Math.random() * 20 - 5))));
        setSatellites(Math.floor(3 + Math.random() * 5)); // Between 3-7 satellites
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isTracking, signalStrength]);

  const updatePosition = useCallback((newPosition: Position | null, error: LocationError | null) => {
    if (error) {
      setError(error);
      onError?.(error);
      setIsTracking(false);
      return;
    }

    if (newPosition) {
      setPosition(newPosition);
      setLastUpdated(new Date());
      onLocationUpdate?.(newPosition);
      setError(null);
    }
  }, [onLocationUpdate, onError]);

  const startTracking = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Set up the position update handler
      const handlePositionUpdate = (pos: Position | null, err: LocationError | null) => {
        if (err) {
          setError(err);
          onError?.(err);
          setIsTracking(false);
          return;
        }
        if (pos) {
          setPosition(pos);
          setLastUpdated(new Date());
          onLocationUpdate?.(pos);
          setError(null);
        }
      };
      
      // First get current position immediately
      const currentPosition = await locationService.getCurrentPosition();
      handlePositionUpdate(currentPosition, null);
      
      // Then start watching position with the handler
      locationService.startTracking(handlePositionUpdate, {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 10000
      });
      
      // Set up the listener
      const cleanup = locationService.addListener(handlePositionUpdate);
      setIsTracking(true);
      
      // Set up interval for periodic updates if needed
      const interval = setInterval(async () => {
        try {
          const pos = await locationService.getCurrentPosition();
          handlePositionUpdate(pos, null);
        } catch (err) {
          console.error('Error in periodic location update:', err);
        }
      }, updateInterval);

      return () => {
        clearInterval(interval);
        cleanup();
        locationService.stopTracking();
      };
    } catch (err) {
      const locationError = err as LocationError;
      setError(locationError);
      onError?.(locationError);
      setIsTracking(false);
    } finally {
      setIsLoading(false);
    }
  }, [onLocationUpdate, onError, updateInterval]);

  const stopTracking = useCallback(() => {
    locationService.stopTracking();
    setIsTracking(false);
    setError(null);
  }, []);

  const refreshLocation = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const pos = await locationService.getCurrentPosition();
      setPosition(pos);
      setLastUpdated(new Date());
      onLocationUpdate?.(pos);
      setError(null);
    } catch (err) {
      const locationError = err as LocationError;
      setError(locationError);
      onError?.(locationError);
    } finally {
      setIsLoading(false);
    }
  }, [onLocationUpdate, onError]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      locationService.stopTracking();
    };
  }, []);

  const getGoogleMapsLink = useCallback((lat: number, lng: number) => {
    return `https://www.google.com/maps?q=${lat},${lng}`;
  }, []);

  const formatAccuracy = (accuracy: number | null | undefined) => {
    if (accuracy === null || accuracy === undefined) return 'N/A';
    return `${Math.round(accuracy)}m`;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Compass className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">GPS Tracker</CardTitle>
            </div>
            <Badge variant={position ? 'default' : 'secondary'} className="gap-1">
              {position ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                {position ? 'Tracking your location' : 'Location service inactive'}
              </p>
              <p className="text-xs text-muted-foreground">
                {lastUpdated ? `Last updated: ${lastUpdated.toLocaleTimeString()}` : 'Never updated'}
              </p>
            </div>
            <Button
              variant={isTracking ? 'outline' : 'default'}
              size="sm"
              onClick={isTracking ? stopTracking : startTracking}
              disabled={isLoading}
              className="gap-2"
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : isTracking ? (
                <>
                  <MapPin className="h-4 w-4" />
                  <span>Tracking</span>
                </>
              ) : (
                <>
                  <MapPinOff className="h-4 w-4" />
                  <span>Start Tracking</span>
                </>
              )}
            </Button>
          </div>

          {/* GPS Signal Strength */}
          {isTracking && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <Satellite className="h-4 w-4 text-muted-foreground" />
                  <span>GPS Signal</span>
                </div>
                <span className="font-medium">
                  {signalStrength > 70 ? 'Strong' : signalStrength > 30 ? 'Fair' : 'Weak'}
                </span>
              </div>
              <Progress value={signalStrength} className="h-2" />
              
              <div className="flex items-center justify-between text-sm pt-2">
                <div className="flex items-center space-x-2">
                  <Wifi className="h-4 w-4 text-muted-foreground" />
                  <span>Satellites</span>
                </div>
                <span className="font-medium">{satellites} connected</span>
              </div>
              <div className="flex space-x-1">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1.5 rounded-full flex-1 ${i < satellites ? 'bg-primary' : 'bg-muted'}`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Location Info */}
          {position && (
            <div className="space-y-2 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Latitude</p>
                  <p className="font-mono text-sm">{position.latitude.toFixed(6)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Longitude</p>
                  <p className="font-mono text-sm">{position.longitude.toFixed(6)}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Accuracy</p>
                <p className="text-sm">{formatAccuracy(position.accuracy)}</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <span>{error.message || 'Failed to get location'}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={startTracking}
                className="mt-2 text-red-700 hover:bg-red-100"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </div>
          )}

          {/* Last Updated Section */}
          {lastUpdated && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-xs text-muted-foreground">Last Updated</p>
              <p className="text-sm">
                {lastUpdated.toLocaleTimeString()}
              </p>
            </div>
          )}

          {/* Map Link */}
          {showMapLink && position && (
            <div className="mt-4">
              <a
                href={getGoogleMapsLink(position.latitude, position.longitude)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
              >
                View on Google Maps
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
