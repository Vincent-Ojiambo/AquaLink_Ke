import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, ShoppingCart, TrendingUp, DollarSign, Fish, MapPin, Clock, Star, Package, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@supabase/supabase-js";
import FishListings from "@/components/marketplace/FishListings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

const BuyerDashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const getProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        setUser(user);

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          toast({
            title: "Error",
            description: "Failed to load profile data",
            variant: "destructive",
          });
        } else {
          setProfile(profile);
        }
      } catch (error) {
        console.error('Error:', error);
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

  return (
    <div className="min-h-screen bg-gradient-coastal">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-sunset rounded-xl flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-primary">AquaNet Kenya</h1>
                <p className="text-sm text-muted-foreground">Buyer Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {profile && (
                <div className="text-right">
                  <p className="font-medium">{profile.name}</p>
                  <p className="text-sm text-muted-foreground">{profile.region || 'Nairobi, Kenya'}</p>
                </div>
              )}
              <Button 
                onClick={handleSignOut} 
                variant="ghost" 
                size="sm" 
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome back, {profile?.name}! 🐟</h2>
          <p className="text-muted-foreground">Browse fresh catches and manage your orders</p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Package className="w-8 h-8 text-primary mr-3" />
                <div>
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-xs text-muted-foreground">Active Orders</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <DollarSign className="w-8 h-8 text-accent mr-3" />
                <div>
                  <p className="text-2xl font-bold">KSh 128,400</p>
                  <p className="text-xs text-muted-foreground">This Month</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-primary-glow mr-3" />
                <div>
                  <p className="text-2xl font-bold">15</p>
                  <p className="text-xs text-muted-foreground">Trusted Suppliers</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-accent mr-3" />
                <div>
                  <p className="text-2xl font-bold">+8%</p>
                  <p className="text-xs text-muted-foreground">vs Last Month</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Fresh Catches */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Fish className="w-5 h-5 mr-2 text-primary" />
                Fresh Catches Available
              </CardTitle>
              <CardDescription>Live marketplace from local fishers</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="marketplace" className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight">Fish Marketplace</h2>
                    <p className="text-muted-foreground">
                      Browse and purchase fresh catches from local fishers
                    </p>
                  </div>
                  <TabsList className="grid w-full md:w-auto grid-cols-2">
                    <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
                    <TabsTrigger value="orders">My Orders</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="marketplace" className="space-y-6">
                  {/* Stats Cards */}
                  <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          Available Listings
                        </CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">24+</div>
                        <p className="text-xs text-muted-foreground">Fresh catches today</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Sellers</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">12+</div>
                        <p className="text-xs text-muted-foreground">Fishers online</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Your Location</CardTitle>
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">Nairobi</div>
                        <p className="text-xs text-muted-foreground">Showing local catches</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Fish Listings */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Fresh Catches</h3>
                      <Button variant="outline" size="sm">
                        <Clock className="mr-2 h-4 w-4" />
                        Latest First
                      </Button>
                    </div>
                    <FishListings />
                  </div>
                </TabsContent>

                <TabsContent value="orders" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Orders</CardTitle>
                      <CardDescription>Track and manage your fish purchases</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[1, 2, 3].map((order) => (
                          <div key={order} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center space-x-4">
                              <div className="w-16 h-16 rounded-md bg-muted flex items-center justify-center">
                                <Fish className="w-6 h-6 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">Fresh Tilapia</p>
                                <p className="text-sm text-muted-foreground">Order #100{order}</p>
                                <p className="text-sm text-muted-foreground">From: Fisherman's Co-op</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">KSh 1,200</p>
                              <p className="text-sm text-muted-foreground">2 days ago</p>
                              <Badge variant="outline" className="mt-1">
                                {order === 1 ? 'Delivered' : 'In Transit'}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Market Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-primary" />
                Market Insights
              </CardTitle>
              <CardDescription>Price trends and analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green-800">Snapper</span>
                    <Badge className="bg-green-100 text-green-800">↗ +5%</Badge>
                  </div>
                  <p className="text-xs text-green-600 mt-1">KSh 550/kg avg price</p>
                </div>
                
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-800">Tuna</span>
                    <Badge variant="secondary">→ 0%</Badge>
                  </div>
                  <p className="text-xs text-blue-600 mt-1">KSh 520/kg avg price</p>
                </div>

                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-red-800">Kingfish</span>
                    <Badge variant="destructive">↘ -3%</Badge>
                  </div>
                  <p className="text-xs text-red-600 mt-1">KSh 580/kg avg price</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Your latest purchase history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { 
                  orderId: "#AQ-1001", 
                  date: "Today", 
                  fisher: "Ahmed Hassan", 
                  fish: "Red Snapper", 
                  weight: "8.5 kg", 
                  total: "KSh 4,680", 
                  status: "Delivered" 
                },
                { 
                  orderId: "#AQ-1000", 
                  date: "Yesterday", 
                  fisher: "Grace Wanjiku", 
                  fish: "Kingfish", 
                  weight: "12.2 kg", 
                  total: "KSh 7,100", 
                  status: "In Transit" 
                },
                { 
                  orderId: "#AQ-0999", 
                  date: "2 days ago", 
                  fisher: "Joseph Mwangi", 
                  fish: "Yellowfin Tuna", 
                  weight: "18.5 kg", 
                  total: "KSh 9,620", 
                  status: "Delivered" 
                },
              ].map((order, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-sunset rounded-xl flex items-center justify-center">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">{order.orderId} - {order.fish}</p>
                      <p className="text-sm text-muted-foreground">
                        From {order.fisher} • {order.date}
                      </p>
                      <p className="text-sm text-muted-foreground">{order.weight}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{order.total}</p>
                    <Badge 
                      variant={order.status === 'Delivered' ? 'default' : 'secondary'}
                      className={order.status === 'Delivered' ? 'bg-green-100 text-green-800' : ''}
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default BuyerDashboard;