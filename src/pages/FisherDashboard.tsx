import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Fish, MapPin, Cloud, TrendingUp, Calendar, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@supabase/supabase-js";
import AddCatchForm from "@/components/catch/AddCatchForm";
import DailyCatches from "@/components/catch/DailyCatches";

interface Profile {
  id: string;
  user_id: string;
  user_type: string;
  name: string;
  phone?: string;
  region?: string;
  created_at: string;
  updated_at: string;
}

const FisherDashboard = () => {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-coastal flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const handleCatchAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-coastal">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-ocean rounded-xl flex items-center justify-center">
                <Fish className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-primary">AquaNet Kenya</h1>
                <p className="text-sm text-muted-foreground">Fisher Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="font-medium">{profile?.name || 'Fisher'}</p>
                <p className="text-sm text-muted-foreground">{profile?.region || 'Kenya'}</p>
              </div>
              <Button variant="outline" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Record Catch Form */}
          <div className="md:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <AddCatchForm onSuccess={handleCatchAdded} />
              </CardContent>
            </Card>
          </div>
          
          {/* Catches List */}
          <div className="md:col-span-2">
            <DailyCatches key={refreshKey} />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Region</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profile?.region || 'N/A'}</div>
              <p className="text-xs text-muted-foreground">Your fishing location</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Market Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">KES 300-500</div>
              <p className="text-xs text-muted-foreground">Per kg (Tilapia)</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Weather</CardTitle>
              <Cloud className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Sunny</div>
              <p className="text-xs text-muted-foreground">Good fishing conditions</p>
            </CardContent>
          </Card>
        </div>

        {/* Today's Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-primary" />
              Today's Activities
            </CardTitle>
            <CardDescription>Your fishing schedule</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center p-4 bg-muted/50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">Morning Fishing Trip</p>
                  <p className="text-sm text-muted-foreground">05:00 - 11:00</p>
                </div>
                <Button variant="outline" size="sm">View Details</Button>
              </div>
              <div className="flex items-center p-4 bg-muted/50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">Afternoon Market</p>
                  <p className="text-sm text-muted-foreground">14:00 - 17:00</p>
                </div>
                <Button variant="outline" size="sm">View Details</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default FisherDashboard;