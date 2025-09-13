import { useState, useEffect, useCallback } from 'react';

export interface Position {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  timestamp: number;
  speed: number | null;
  heading: number | null;
  altitude: number | null;
  altitudeAccuracy: number | null;
}

export interface LocationError {
  code: number;
  message: string;
  PERMISSION_DENIED: number;
  POSITION_UNAVAILABLE: number;
  TIMEOUT: number;
}

class LocationService {
  private watchId: number | null = null;
  private position: Position | null = null;
  private error: LocationError | null = null;
  private listeners: Array<(position: Position | null, error: LocationError | null) => void> = [];
  private setState: ((position: Position | null, error: LocationError | null) => void) | null = null;

  constructor() {
    this.requestPermission();
  }

  private async requestPermission(): Promise<boolean> {
    if (!navigator.permissions) return true;
    
    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
      return permission.state === 'granted';
    } catch (error) {
      console.warn('Geolocation permission check failed:', error);
      return true; // Proceed with default behavior if permission API is not available
    }
  }

  public startTracking(
    setState: (position: Position | null, error: LocationError | null) => void,
    options: PositionOptions = {
      enableHighAccuracy: true,
      maximumAge: 10000, // 10 seconds
      timeout: 5000, // 5 seconds
    }
  ) {
    this.setState = setState;
    if (this.watchId !== null) return;

    if (!navigator.geolocation) {
      const error = {
        code: 0,
        message: 'Geolocation is not supported by your browser',
        PERMISSION_DENIED: 1,
        POSITION_UNAVAILABLE: 2,
        TIMEOUT: 3
      };
      this.error = error;
      if (this.setState) {
        this.setState(null, error);
      }
      this.notifyListeners(null, error);
      return;
    }

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        const newPosition: Position = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
          speed: position.coords.speed,
          heading: position.coords.heading,
          altitude: position.coords.altitude,
          altitudeAccuracy: position.coords.altitudeAccuracy
        };
        
        this.position = newPosition;
        if (this.setState) {
          this.setState(newPosition, null);
        }
        this.notifyListeners(newPosition, null);
      },
      (error: GeolocationPositionError) => {
        const locationError: LocationError = {
          code: error.code,
          message: error.message,
          PERMISSION_DENIED: error.PERMISSION_DENIED,
          POSITION_UNAVAILABLE: error.POSITION_UNAVAILABLE,
          TIMEOUT: error.TIMEOUT
        };
        
        this.error = locationError;
        if (this.setState) {
          this.setState(null, locationError);
        }
        this.notifyListeners(null, locationError);
      },
      options
    );
  }

  public stopTracking() {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  public getCurrentPosition(): Promise<Position> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
            speed: position.coords.speed,
            heading: position.coords.heading,
            altitude: position.coords.altitude,
            altitudeAccuracy: position.coords.altitudeAccuracy
          });
        },
        (error) => reject(error),
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  }

  public addListener(callback: (position: Position | null, error: LocationError | null) => void) {
    this.listeners.push(callback);
    // Immediately notify new listener of current state
    if (this.position || this.error) {
      callback(this.position, this.error);
    }
    
    // Return cleanup function
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  public removeListener(callback: (position: Position | null, error: LocationError | null) => void) {
    this.listeners = this.listeners.filter(cb => cb !== callback);
  }

  private notifyListeners(position: Position | null, error: LocationError | null) {
    this.listeners.forEach(callback => {
      try {
        callback(position, error);
      } catch (e) {
        console.error('Error in location listener:', e);
      }
    });
  }

  // Clean up when service is no longer needed
  public dispose() {
    this.stopTracking();
    this.listeners = [];
  }
}

// Export a singleton instance
export const locationService = new LocationService();

// Auto-cleanup when the app is unloaded
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    locationService.dispose();
  });
}

// Hook for React components
export function useLocationTracking() {
  const [position, setPosition] = useState<Position | null>(null);
  const [error, setError] = useState<LocationError | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const updatePosition = useCallback((newPosition: Position | null, newError: LocationError | null) => {
    setPosition(newPosition);
    setError(newError);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    locationService.addListener(updatePosition);
    
    return () => {
      locationService.removeListener(updatePosition);
    };
  }, [updatePosition]);

  return {
    position,
    error,
    isLoading,
    getCurrentPosition: locationService.getCurrentPosition.bind(locationService),
    startTracking: (options?: PositionOptions) => {
      locationService.startTracking(updatePosition, options);
    },
    stopTracking: locationService.stopTracking.bind(locationService)
  };
}
