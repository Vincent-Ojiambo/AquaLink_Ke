import { useState, useEffect } from 'react';
import { 
  MapPin, 
  AlertTriangle, 
  Shield, 
  ShieldCheck,
  ShieldAlert,
  Settings, 
  Bell, 
  User, 
  HeartPulse, 
  Phone, 
  AlertCircle, 
  Wifi, 
  WifiOff, 
  Clock, 
  Map, 
  Users, 
  AlertOctagon,
  Pencil,
  RefreshCw,
  UserPlus,
  Activity,
  Info,
  X,
  Loader2,
  History,
  Filter,
  ChevronRight,
  Flame,
  MoreHorizontal,
  MessageSquare
} from 'lucide-react';

// UI Components
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';

// Custom Components
import { GPSTracker } from './GPSTracker';
import { SOSButton } from './SOSButton';
import { EmergencyDetailsForm } from './EmergencyDetailsForm';
import { EmergencyContactsManager } from './EmergencyContactsManager';

// Hooks
import { useEmergencyAlerts } from '@/hooks/useEmergencyAlerts';
import { useEmergencyContacts } from '@/hooks/useEmergencyContacts';

// Utilities
import { formatDistanceToNow } from 'date-fns';

interface StatusCardProps {
  title: string;
  status: 'active' | 'inactive' | 'warning' | 'error' | 'info';
  icon: React.ReactNode;
  description: string;
}

const StatusCard = ({ title, status, icon, description }: StatusCardProps) => {
  const statusColors = {
    active: 'bg-green-100 text-green-800 border-green-200',
    inactive: 'bg-gray-100 text-gray-800 border-gray-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    error: 'bg-red-100 text-red-800 border-red-200',
    info: 'bg-blue-100 text-blue-800 border-blue-200',
  };

  return (
    <div className={`p-4 border rounded-lg ${statusColors[status]}`}>
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-full bg-white/50">
              {icon}
            </div>
            <h3 className="font-medium">{title}</h3>
          </div>
          <p className="text-sm mt-1">{description}</p>
        </div>
        <div className={`px-2 py-1 text-xs font-medium rounded-full ${
          status === 'active' ? 'bg-green-500/10 text-green-700' :
          status === 'inactive' ? 'bg-gray-500/10 text-gray-700' :
          status === 'warning' ? 'bg-yellow-500/10 text-yellow-700' :
          status === 'error' ? 'bg-red-500/10 text-red-700' :
          'bg-blue-500/10 text-blue-700'
        }`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </div>
      </div>
    </div>
  );
};

interface EmergencyDetails {
  fullName: string;
  bloodType?: string;
  allergies?: string;
  medicalConditions?: string;
  medications?: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  notes?: string;
}

interface SafetyDashboardProps {
  className?: string;
  defaultTab?: 'gps' | 'alerts' | 'settings' | 'emergency-details';
  showSOSButton?: boolean;
}

export function SafetyDashboard({
  className = '',
  defaultTab = 'gps',
  showSOSButton = true
}: SafetyDashboardProps) {
  const [isManagingContacts, setIsManagingContacts] = useState(false);
  const { contacts = [], loading: contactsLoading } = useEmergencyContacts();
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [location, setLocation] = useState<{ lat: number; lng: number; accuracy?: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Mock data for recent alerts
  const recentAlerts = [
    {
      id: '1',
      type: 'medical',
      status: 'resolved',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      location: 'Nairobi, Kenya',
      message: 'Medical emergency near Westlands'
    },
    {
      id: '2',
      type: 'police',
      status: 'active',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      location: 'Mombasa Road, Nairobi',
      message: 'Security alert reported'
    },
    {
      id: '3',
      type: 'fire',
      status: 'resolved',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      location: 'Kilimani, Nairobi',
      message: 'Fire outbreak in residential area'
    }
  ];

  // Mock active alert
  const [activeAlert, setActiveAlert] = useState<any>(null);

  const handleResolveAlert = async () => {
    try {
      setIsLoading(true);
      // Add your resolve alert logic here
      await new Promise(resolve => setTimeout(resolve, 1000));
      setActiveAlert(null);
      toast({
        title: 'Alert Resolved',
        description: 'The emergency alert has been resolved successfully.',
      });
    } catch (error) {
      console.error('Error resolving alert:', error);
      toast({
        title: 'Error',
        description: 'Failed to resolve the alert. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Check emergency services status (mock implementation)
  const [servicesStatus, setServicesStatus] = useState({
    gps: true,
    network: true,
    emergencyServices: true,
    lastChecked: new Date().toISOString()
  });

  // Emergency details state
  const [emergencyDetails, setEmergencyDetails] = useState<EmergencyDetails>({
    fullName: 'John Doe',
    bloodType: 'O+',
    allergies: 'Penicillin, Peanuts',
    medicalConditions: 'Asthma',
    medications: 'Ventolin',
    emergencyContactName: 'Jane Smith',
    emergencyContactPhone: '+254 700 123456',
    notes: 'Carries a Ventolin inhaler at all times.'
  });
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveEmergencyDetails = async (data: EmergencyDetails) => {
    try {
      setIsSaving(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setEmergencyDetails(data);
      setIsEditingDetails(false);
      toast({
        title: 'Success',
        description: 'Emergency details updated successfully.',
      });
    } catch (error) {
      console.error('Error saving emergency details:', error);
      toast({
        title: 'Error',
        description: 'Failed to save emergency details. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Quick action handlers
  const handleQuickAction = (action: string) => {
    toast({
      title: 'Quick Action',
      description: `${action} action triggered`,
    });
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Safety Dashboard</h2>
        {showSOSButton && <SOSButton />}
      </div>

      <Tabs 
        value={activeTab} 
        onValueChange={(value) => setActiveTab(value as any)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="gps" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" /> GPS Tracker
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-2">
            <Bell className="h-4 w-4" /> Alerts
          </TabsTrigger>
          <TabsTrigger value="emergency-details" className="flex items-center gap-2">
            <User className="h-4 w-4" /> My Details
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" /> Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="gps" className="mt-6">
          <GPSTracker />
        </TabsContent>

        <TabsContent value="alerts" className="mt-6 space-y-6">
          {/* Active Alert Section */}
          {activeAlert ? (
            <Card className="border-l-4 border-red-500 shadow-md">
              <CardHeader className="bg-red-50/80 pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="p-2.5 bg-red-100 rounded-full">
                      <AlertOctagon className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <CardTitle className="text-red-900 flex items-center gap-2">
                        Active Emergency Alert
                        <Badge variant="destructive" className="animate-pulse">
                          {activeAlert.status.toUpperCase()}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="text-red-800 mt-1">
                        {formatDistanceToNow(new Date(activeAlert.timestamp), { addSuffix: true })}
                      </CardDescription>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="text-red-600 hover:bg-red-100">
                    <X className="h-5 w-5" />
                    <span className="sr-only">Dismiss</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="space-y-2 p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center space-x-2 text-sm">
                      <AlertCircle className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Type:</span>
                      <Badge variant="outline" className="capitalize">
                        {activeAlert.type}
                      </Badge>
                    </div>
                    <div className="flex items-start space-x-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium">Location:</span>
                        <p className="text-muted-foreground">{activeAlert.location}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center space-x-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Contacts Notified:</span>
                      <span className="font-semibold">{activeAlert.contacts_notified || 0} / {contacts.length}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Activity className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Response Time:</span>
                      <span className="text-emerald-600 font-medium">
                        {formatDistanceToNow(new Date(activeAlert.timestamp), { addSuffix: false })}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
                  <Button 
                    variant="outline" 
                    className="gap-2"
                    onClick={handleResolveAlert}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Resolving...
                      </>
                    ) : 'Resolve Alert'}
                  </Button>
                  <Button className="gap-2 bg-red-600 hover:bg-red-700">
                    <Phone className="h-4 w-4" /> Call Emergency Services
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-l-4 border-emerald-500">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 bg-emerald-100 rounded-full mb-4">
                    <ShieldCheck className="h-8 w-8 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-emerald-900">No Active Alerts</h3>
                  <p className="mt-1 text-sm text-muted-foreground max-w-md">
                    Your safety is our priority. All systems are operational and monitoring for any emergencies.
                  </p>
                  <div className="mt-4 flex gap-3">
                    <Button variant="outline" size="sm" className="gap-2">
                      <History className="h-4 w-4" />
                      Alert History
                    </Button>
                    <Button size="sm" className="gap-2">
                      <ShieldAlert className="h-4 w-4" />
                      Test Alert
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Alerts Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Recent Alerts</h3>
                <p className="text-sm text-muted-foreground">
                  {recentAlerts.length} alert{recentAlerts.length !== 1 ? 's' : ''} in the last 7 days
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  <Filter className="h-4 w-4 mr-1.5" />
                  Filter
                </Button>
                <Button variant="ghost" size="sm" className="text-primary">
                  View All
                  <ChevronRight className="h-4 w-4 ml-1.5" />
                </Button>
              </div>
            </div>

            <Card>
              <ScrollArea className="h-[400px]">
                <div className="divide-y">
                  {recentAlerts.map((alert) => {
                    const isActive = alert.status === 'active';
                    const alertTypeIcons = {
                      medical: <HeartPulse className="h-4 w-4" />,
                      police: <Shield className="h-4 w-4" />,
                      fire: <Flame className="h-4 w-4" />,
                      default: <AlertCircle className="h-4 w-4" />
                    };
                    
                    return (
                      <div key={alert.id} className="p-4 hover:bg-muted/30 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <div className={`p-2 rounded-lg ${
                              isActive ? 'bg-red-100 text-red-600' : 'bg-muted text-muted-foreground'
                            }`}>
                              {alertTypeIcons[alert.type as keyof typeof alertTypeIcons] || alertTypeIcons.default}
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="font-medium">{alert.message}</span>
                                <Badge 
                                  variant={isActive ? 'destructive' : 'secondary'}
                                  className="text-xs font-medium"
                                >
                                  {alert.status}
                                </Badge>
                              </div>
                              <div className="mt-1.5 space-y-1.5">
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <MapPin className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                                  <span className="truncate">{alert.location}</span>
                                </div>
                                <div className="flex items-center text-xs text-muted-foreground">
                                  <Clock className="h-3 w-3 mr-1.5 flex-shrink-0" />
                                  <span>{formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}</span>
                                  {isActive && (
                                    <span className="ml-2 px-1.5 py-0.5 bg-red-100 text-red-700 text-[10px] font-medium rounded-full">
                                      IN PROGRESS
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">View details</span>
                          </Button>
                        </div>
                        {isActive && (
                          <div className="mt-3 pt-3 border-t flex justify-end space-x-2">
                            <Button variant="outline" size="sm" className="gap-1.5">
                              <Phone className="h-3.5 w-3.5" />
                              <span>Call Responder</span>
                            </Button>
                            <Button variant="outline" size="sm" className="gap-1.5">
                              <MessageSquare className="h-3.5 w-3.5" />
                              <span>Message</span>
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="mt-6 space-y-6">
          {/* Emergency Contacts Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5" />
                Emergency Contacts
              </CardTitle>
              <CardDescription>Manage who to notify in case of an emergency</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="space-y-1">
                    <h4 className="font-medium">Emergency Contacts</h4>
                    <p className="text-sm text-muted-foreground">
                      {contactsLoading 
                        ? 'Loading contacts...'
                        : contacts.length > 0 
                          ? `${contacts.length} contact${contacts.length !== 1 ? 's' : ''} saved` 
                          : 'No emergency contacts added'}
                    </p>
                  </div>
                  <Dialog open={isManagingContacts} onOpenChange={setIsManagingContacts}>
                    <DialogTrigger asChild>
                      <Button 
                        variant={contacts.length > 0 ? 'default' : 'outline'}
                        disabled={contactsLoading}
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        {contacts.length > 0 ? 'Manage Contacts' : 'Add Contacts'}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Manage Emergency Contacts</DialogTitle>
                        <DialogDescription>
                          Add or edit emergency contacts who will be notified in case of an emergency.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <EmergencyContactsManager onClose={() => setIsManagingContacts(false)} />
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Customize how you receive emergency alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">Push Notifications</h4>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Receive instant alerts on your device
                  </p>
                </div>
                <Switch checked={true} onCheckedChange={() => {}} />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">Email Alerts</h4>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Get email notifications for important updates
                  </p>
                </div>
                <Switch checked={true} onCheckedChange={() => {}} />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">SMS Alerts</h4>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Receive text messages for critical alerts
                  </p>
                </div>
                <Switch checked={true} onCheckedChange={() => {}} />
              </div>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Activity className="h-5 w-5" />
                System Status
              </CardTitle>
              <CardDescription>Current status of safety services</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <StatusCard 
                  title="GPS Service" 
                  status={servicesStatus.gps ? 'active' : 'inactive'}
                  icon={<MapPin className="h-4 w-4" />}
                  description={servicesStatus.gps ? 'Location tracking active' : 'Location services disabled'}
                />
                <StatusCard 
                  title="Network Connection" 
                  status={servicesStatus.network ? 'active' : 'inactive'}
                  icon={servicesStatus.network ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
                  description={servicesStatus.network ? 'Connected to the internet' : 'No internet connection'}
                />
                <StatusCard 
                  title="Emergency Services" 
                  status={servicesStatus.emergencyServices ? 'active' : 'inactive'}
                  icon={<Shield className="h-4 w-4" />}
                  description={servicesStatus.emergencyServices ? 'Emergency services available' : 'Emergency services unavailable'}
                />
                <StatusCard 
                  title="Last System Check" 
                  status="info"
                  icon={<Clock className="h-4 w-4" />}
                  description={`Checked ${formatDistanceToNow(new Date(servicesStatus.lastChecked), { addSuffix: true })}`}
                />
              </div>
              <div className="pt-2 text-right">
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Status
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Advanced Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Settings className="h-5 w-5" />
                Advanced Settings
              </CardTitle>
              <CardDescription>Configure advanced safety features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">Auto-SOS</h4>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Automatically trigger SOS in case of a fall or impact
                  </p>
                </div>
                <Switch checked={false} onCheckedChange={() => {}} />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">Battery Saver Mode</h4>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Reduce battery usage by limiting background services
                  </p>
                </div>
                <Switch checked={false} onCheckedChange={() => {}} />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">Location Sharing</h4>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Share your location with emergency contacts
                  </p>
                </div>
                <Switch checked={true} onCheckedChange={() => {}} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Emergency Details Tab */}
        <TabsContent value="emergency-details" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  My Emergency Details
                </CardTitle>
                <Dialog open={isEditingDetails} onOpenChange={setIsEditingDetails}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Pencil className="h-4 w-4" /> Edit Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Edit Emergency Details</DialogTitle>
                    </DialogHeader>
                    <EmergencyDetailsForm
                      initialData={emergencyDetails}
                      onSave={handleSaveEmergencyDetails}
                      onCancel={() => setIsEditingDetails(false)}
                      isLoading={isSaving}
                    />
                  </DialogContent>
                </Dialog>
              </div>
              <CardDescription>
                This information will be shared with emergency services when needed.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Personal Information</h4>
                  <div className="space-y-1">
                    <p className="text-sm">
                      <span className="font-medium">Full Name:</span> {emergencyDetails.fullName || 'Not provided'}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Blood Type:</span> {emergencyDetails.bloodType || 'Not provided'}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Emergency Contact</h4>
                  <div className="space-y-1">
                    <p className="text-sm">
                      <span className="font-medium">Name:</span> {emergencyDetails.emergencyContactName || 'Not provided'}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Phone:</span> {emergencyDetails.emergencyContactPhone || 'Not provided'}
                    </p>
                  </div>
                </div>

                {emergencyDetails.allergies && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Allergies</h4>
                    <p className="text-sm">{emergencyDetails.allergies}</p>
                  </div>
                )}

                {emergencyDetails.medicalConditions && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Medical Conditions</h4>
                    <p className="text-sm">{emergencyDetails.medicalConditions}</p>
                  </div>
                )}

                {emergencyDetails.medications && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Current Medications</h4>
                    <p className="text-sm">{emergencyDetails.medications}</p>
                  </div>
                )}

                {emergencyDetails.notes && (
                  <div className="space-y-2 md:col-span-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Additional Notes</h4>
                    <p className="text-sm whitespace-pre-line">{emergencyDetails.notes}</p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="bg-muted/50 border-t px-6 py-3">
              <p className="text-xs text-muted-foreground">
                Last updated: {formatDistanceToNow(new Date(), { addSuffix: true })}
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
