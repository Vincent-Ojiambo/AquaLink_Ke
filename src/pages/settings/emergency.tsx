import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmergencyContactsManager } from '@/components/EmergencyContactsManager';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, ShieldAlert, BellRing, MapPin, MessageSquare, Loader2, Phone } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useEmergencySettings } from '@/hooks/useEmergencySettings';
import { useEmergencyAlerts } from '@/hooks/useEmergencyAlerts';
import { toast } from '@/components/ui/use-toast';
import { SOSButton } from '@/components/SOSButton';
import { EmergencySettingsState } from '@/types/emergency';

export default function EmergencySettings() {
  const { user } = useAuth();
  const { 
    settings, 
    loading: settingsLoading, 
    updateSettings 
  } = useEmergencySettings();
  const { activeAlert, isLoading: isAlertLoading } = useEmergencyAlerts();
  const [isSaving, setIsSaving] = useState(false);
  const [sosSettings, setSosSettings] = useState<EmergencySettingsState>({
    autoSendLocation: true,
    sendSMS: true,
    makeEmergencyCall: false,
    shareLiveLocation: false,
    sosCountdown: 5
  });

  const handleToggleSetting = (setting: keyof EmergencySettingsState) => {
    setSosSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleCountdownChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1 && value <= 30) {
      setSosSettings(prev => ({
        ...prev,
        sosCountdown: value
      }));
    }
  };

  // Initialize form with settings from the database
  useEffect(() => {
    if (settings) {
      setSosSettings({
        autoSendLocation: settings.autoSendLocation ?? true,
        sendSMS: settings.sendSMS ?? true,
        makeEmergencyCall: settings.makeEmergencyCall ?? false,
        shareLiveLocation: settings.shareLiveLocation ?? false,
        sosCountdown: settings.sosCountdown ?? 5
      });
    }
  }, [settings]);

  useEffect(() => {
    if (!user && !settingsLoading) {
      window.location.href = '/login';
    }
  }, [user, settingsLoading]);

  const handleSaveSettings = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      await updateSettings({
        autoSendLocation: sosSettings.autoSendLocation,
        sendSMS: sosSettings.sendSMS,
        makeEmergencyCall: sosSettings.makeEmergencyCall,
        shareLiveLocation: sosSettings.shareLiveLocation,
        sosCountdown: sosSettings.sosCountdown
      });
      
      toast({
        title: 'Success',
        description: 'Emergency settings saved successfully',
        variant: 'default',
      });
      return true;
    } catch (error) {
      console.error('Error saving emergency settings:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save emergency settings',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleTestAlertSent = (alert: any) => {
    console.log('Test alert sent:', alert);
    toast({
      title: 'Test Alert Sent',
      description: 'A test alert has been sent successfully',
      variant: 'default',
    });
  };

  const handleTestAlertError = (error: Error) => {
    console.error('Test alert error:', error);
    toast({
      title: 'Test Alert Failed',
      description: error.message || 'Failed to send test alert',
      variant: 'destructive',
    });
  };

  if (settingsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Emergency Settings</h1>
        <p className="text-muted-foreground">
          Manage your emergency contacts and SOS settings to ensure your safety on the water.
        </p>
      </div>

      <Tabs defaultValue="contacts" className="space-y-6">
        <TabsList>
          <TabsTrigger value="contacts">Emergency Contacts</TabsTrigger>
          <TabsTrigger value="settings">SOS Settings</TabsTrigger>
          <TabsTrigger value="test">Test SOS</TabsTrigger>
        </TabsList>

        <TabsContent value="contacts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Emergency Contacts</CardTitle>
              <CardDescription>
                Add and manage the contacts that will be notified in case of an emergency.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EmergencyContactsManager />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>SOS Alert Settings</CardTitle>
              <CardDescription>
                Customize how your emergency alerts work.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between space-x-4">
                <div className="space-y-1">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-primary" />
                    <Label htmlFor="auto-send-location" className="font-medium">
                      Automatically send location
                    </Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Include your current location when sending an SOS alert
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="auto-send-location"
                      checked={sosSettings.autoSendLocation}
                      onCheckedChange={() => handleToggleSetting('autoSendLocation')}
                    />
                    <Label htmlFor="auto-send-location">Automatically send my location</Label>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {sosSettings.autoSendLocation ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between space-x-4">
                <div className="space-y-1">
                  <div className="flex items-center">
                    <MessageSquare className="w-4 h-4 mr-2 text-primary" />
                    <Label htmlFor="send-sms" className="font-medium">
                      Send SMS alerts
                    </Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Send SMS messages to your emergency contacts
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="send-sms"
                      checked={sosSettings.sendSMS}
                      onCheckedChange={() => handleToggleSetting('sendSMS')}
                    />
                    <Label htmlFor="send-sms">Send SMS to emergency contacts</Label>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {sosSettings.sendSMS ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between space-x-4">
                <div className="space-y-1">
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-primary" />
                    <Label htmlFor="make-emergency-call" className="font-medium">
                      Make emergency call
                    </Label>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Automatically call emergency services when SOS is activated
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="make-emergency-call"
                      checked={sosSettings.makeEmergencyCall}
                      onCheckedChange={() => handleToggleSetting('makeEmergencyCall')}
                    />
                    <Label htmlFor="make-emergency-call">Make emergency call</Label>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {sosSettings.makeEmergencyCall ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-medium mb-4">SOS Countdown</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sos-countdown">SOS Countdown (seconds)</Label>
                    <span className="text-sm text-muted-foreground">
                      {sosSettings.sosCountdown}s
                    </span>
                  </div>
                  <input
                    type="range"
                    id="sos-countdown"
                    min="1"
                    max="30"
                    value={sosSettings.sosCountdown}
                    onChange={handleCountdownChange}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1s</span>
                    <span>15s</span>
                    <span>30s</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Time before emergency alert is sent
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button 
                onClick={handleSaveSettings}
                disabled={settingsLoading || isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : 'Save Changes'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="test" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Test SOS Alert</CardTitle>
              <CardDescription>
                Test your emergency alert system to make sure everything is working correctly.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <ShieldAlert className="h-4 w-4" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>
                  This will send a test alert to your emergency contacts. Only use this for testing purposes.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <SOSButton 
                    testMode={true} 
                    countdownSeconds={sosSettings.sosCountdown}
                    onAlertSent={handleTestAlertSent}
                    onError={handleTestAlertError}
                    className="w-full max-w-xs"
                  />
                </div>
                
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>How testing works</AlertTitle>
                  <AlertDescription className="mt-2">
                    <p className="mb-2">Click the test button above to send a test alert. This will:</p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <BellRing className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Show a {sosSettings.sosCountdown}-second countdown before sending</span>
                      </li>
                      <li className="flex items-start">
                        <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Capture your current location (if location access is granted)</span>
                      </li>
                      <li className="flex items-start">
                        <MessageSquare className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                        <span>You'll receive a confirmation that the test was successful</span>
                      </li>
                      <li className="flex items-start">
                        <AlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Show a confirmation when the test is complete</span>
                      </li>
                    </ul>
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
