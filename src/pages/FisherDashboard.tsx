import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Fish, MapPin, Cloud, TrendingUp, Calendar, AlertTriangle, User as UserIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@supabase/supabase-js";
import AddCatchForm from "@/components/catch/AddCatchForm";
import DailyCatches from "@/components/catch/DailyCatches";
import FisherProfile from "@/components/fisher/FisherProfile";

export interface Profile {
  id: string;
  user_id: string;
  user_type: string;
  name: string;
  phone?: string;
  email?: string;
  avatar_url?: string;
  region?: string;
  license_number?: string | null;
  years_of_experience?: number | null;
  created_at: string;
  updated_at: string;
}

const FisherDashboard = () => {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
          console.error('Authentication error:', authError);
          window.location.href = '/';
          return;
        }

        setUser(user);

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          toast({
            title: "Error",
            description: "Failed to load profile data",
            variant: "destructive",
          });
          return;
        }

        // Check if user is a fisher
        if (profile.user_type !== 'fisher') {
          console.error('Unauthorized access: User is not a fisher');
          window.location.href = '/';
          return;
        }

        setProfile(profile);
      } catch (error) {
        console.error('Error:', error);
        window.location.href = '/';
      } finally {
        setLoading(false);
      }
    };

    getProfile();
  }, [toast]);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    } else {
      // Redirect to login page after successful sign out
      window.location.href = '/';
    }
  };

  // Show loading state if still loading or if user/profile data is missing
  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gradient-coastal flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const handleProfileUpdate = async () => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      setProfile(profile);
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  };

  const handleCatchAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-coastal">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Fish className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-primary">AquaNet Kenya</h1>
                <p className="text-sm text-muted-foreground">Fisher Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <MapPin className="h-4 w-4 mr-2" />
                {profile.region || 'Set Location'}
              </Button>
              <Button 
                variant={activeTab === 'profile' ? 'secondary' : 'outline'} 
                size="sm"
                onClick={() => setActiveTab(activeTab === 'profile' ? 'dashboard' : 'profile')}
              >
                <UserIcon className="h-4 w-4 mr-2" />
                {activeTab === 'profile' ? 'Back to Dashboard' : 'My Profile'}
              </Button>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <div className="mt-4 flex space-x-4 border-b">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-2 text-sm font-medium ${
                activeTab === 'dashboard' 
                  ? 'border-b-2 border-primary text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('catches')}
              className={`px-3 py-2 text-sm font-medium ${
                activeTab === 'catches' 
                  ? 'border-b-2 border-primary text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              My Catches
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'profile' ? (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <FisherProfile 
              user={user} 
              profile={profile} 
              onUpdate={handleProfileUpdate}
              setProfile={setProfile}
            />
          </div>
        ) : activeTab === 'catches' ? (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Catches</CardTitle>
                <CardDescription>View and manage your recorded catches</CardDescription>
              </CardHeader>
              <CardContent>
                <DailyCatches key={refreshKey} />
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left column */}
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Daily Catch Log</CardTitle>
                  <CardDescription>Record your daily catches to track your progress</CardDescription>
                </CardHeader>
                <CardContent>
                  <AddCatchForm onSuccess={() => setRefreshKey(prev => prev + 1)} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Catches</CardTitle>
                  <CardDescription>Your latest recorded catches</CardDescription>
                </CardHeader>
                <CardContent>
                  <DailyCatches key={`catches-${refreshKey}`} />
                </CardContent>
              </Card>
            </div>

            {/* Right column */}
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Weather Forecast</CardTitle>
                  <CardDescription>Next 24 hours</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 rounded-lg bg-blue-50">
                      <Cloud className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Partly Cloudy</p>
                      <p className="text-xs text-muted-foreground">25°C, 65% humidity</p>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>6 AM</span>
                    <span>12 PM</span>
                    <span>6 PM</span>
                    <span>12 AM</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Market Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="p-1 rounded bg-green-100">
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        </div>
                        <span>Tilapia</span>
                      </div>
                      <span className="text-sm font-medium">Ksh 450/kg</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="p-1 rounded bg-red-100">
                          <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />
                        </div>
                        <span>Nile Perch</span>
                      </div>
                      <span className="text-sm font-medium">Ksh 380/kg</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-amber-50 border-amber-200">
                <CardHeader className="pb-2">
                  <div className="flex items-center space-x-2 text-amber-700">
                    <AlertTriangle className="h-5 w-5" />
                    <CardTitle className="text-amber-800">Safety Alert</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-amber-700">
                    High waves expected in Lake Victoria this weekend. Exercise caution when fishing.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default FisherDashboard;