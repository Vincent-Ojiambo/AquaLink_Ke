import { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Fish as FishIcon, Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/types/database.types";

type Catch = Database['public']['Tables']['catches']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

export interface FishListing {
  id: string;
  fisher_id: string;
  fisher_name: string;
  fisher_phone?: string;
  fisher_region?: string;
  fish_type: string;
  quantity_kg: number;
  price_per_kg: number;
  catch_date: string;
  image_url: string | null;
  created_at: string;
  status: string;
}

export default function FishListings() {
  const [listings, setListings] = useState<FishListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"latest" | "price_asc" | "price_desc" | "qty_desc">("latest");
  const { toast } = useToast();

  const fetchListings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching fish listings...');
      
      // First, get all approved (or legacy available) catches
      const { data: catchesData, error: catchesError } = await supabase
        .from('catches')
        .select('*')
        .in('status', ['approved', 'available'])
        .order('created_at', { ascending: false }) as unknown as {
          data: Catch[] | null;
          error: any;
        };

      if (catchesError) {
        console.error('Error fetching catches:', catchesError);
        throw new Error(`Failed to load fish listings: ${catchesError.message}`);
      }

      // Get unique fisher IDs
      const fisherIds = [...new Set((catchesData || []).map(c => c.fisher_id))];
      
      // Get profiles for all fishers (only if there are IDs)
      let profilesData: Pick<Profile, 'user_id' | 'name' | 'phone' | 'region'>[] | null = [];
      if (fisherIds.length > 0) {
        const profilesQuery = await supabase
        .from('profiles')
          .select('user_id, name, phone, region')
          .in('user_id', fisherIds) as unknown as {
            data: Pick<Profile, 'user_id' | 'name' | 'phone' | 'region'>[] | null;
          error: any;
        };

        if (profilesQuery.error) {
          console.error('Error fetching profiles:', profilesQuery.error);
          throw new Error(`Failed to load fisher profiles: ${profilesQuery.error.message}`);
        }
        profilesData = profilesQuery.data;
      }

      // Create a map of fisher IDs to their names
      const fisherMap = new Map(
        (profilesData || []).map(profile => [profile.user_id, {
          name: profile.name,
          phone: profile.phone,
          region: profile.region
        }])
      );
      
      console.log('Fetched listings:', catchesData);
      
      // Transform the data to include fisher's name
      const formattedListings = (catchesData || []).map((item) => ({
        id: String(item.id),
        fisher_id: String(item.fisher_id),
        fisher_name: fisherMap.get(item.fisher_id)?.name || 'Unknown Fisher',
        fisher_phone: fisherMap.get(item.fisher_id)?.phone || undefined,
        fisher_region: fisherMap.get(item.fisher_id)?.region || undefined,
        fish_type: item.fish_type || 'Unknown',
        quantity_kg: Number(item.quantity_kg),
        price_per_kg: Number(item.price_per_kg),
        catch_date: item.catch_date || new Date().toISOString().split('T')[0],
        image_url: item.image_url || null,
        created_at: item.created_at,
        status: item.status || 'pending'
      }));
      
      setListings(formattedListings);
      
    } catch (err) {
      console.error('Error in fetchListings:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      
      toast({
        title: "Error",
        description: `Failed to load fish listings: ${errorMessage}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
    // Realtime updates: reflect inserts/updates/deletes to catches
    const channel = supabase
      .channel('realtime-catches')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'catches' },
        () => {
          // Simplest and safest: refetch listings on any change
          fetchListings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handlePurchase = async (listing: FishListing) => {
    try {
      // Here you would implement the purchase logic
      // For now, we'll just show a success message
      toast({
        title: "Purchase Initiated",
        description: `You've initiated a purchase of ${listing.quantity_kg}kg of ${listing.fish_type} from ${listing.fisher_name}.`,
      });
      
      // In a real app, you would:
      // 1. Create an order record
      // 2. Update the catch quantity
      // 3. Handle payment processing
      
    } catch (error) {
      console.error('Error handling purchase:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to process purchase';
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="border rounded-lg p-4 animate-pulse">
            <div className="h-40 bg-muted rounded-md mb-4" />
            <div className="h-4 bg-muted rounded w-2/3 mb-2" />
            <div className="h-4 bg-muted rounded w-1/3 mb-4" />
            <div className="h-10 bg-muted rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500">{error}</p>
        <Button 
          onClick={fetchListings}
          className="mt-4"
          variant="outline"
        >
          Retry
        </Button>
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="text-center p-12 border rounded-lg bg-muted/20">
        <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <FishIcon className="w-7 h-7 text-primary" />
        </div>
        <p className="text-lg font-medium">No fresh catches right now</p>
        <p className="text-sm text-muted-foreground mt-1">Check back soon or adjust your filters.</p>
      </div>
    );
  }

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filtered = listings.filter((l) =>
    [l.fish_type, l.fisher_name]
      .filter(Boolean)
      .some((v) => String(v).toLowerCase().includes(normalizedQuery))
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "latest") {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    if (sortBy === "price_asc") {
      return Number(a.price_per_kg) - Number(b.price_per_kg);
    }
    if (sortBy === "price_desc") {
      return Number(b.price_per_kg) - Number(a.price_per_kg);
    }
    return Number(b.quantity_kg) - Number(a.quantity_kg);
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search fish type or fisher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by</span>
          <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="price_asc">Price: Low to High</SelectItem>
              <SelectItem value="price_desc">Price: High to Low</SelectItem>
              <SelectItem value="qty_desc">Quantity</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {sorted.map((listing) => (
          <Card key={listing.id} className="flex flex-col h-full transition-shadow hover:shadow-lg">
            <div className="relative">
            <img
              src={listing.image_url || '/placeholder-fish.jpg'}
              alt={listing.fish_type}
                className="w-full h-44 object-cover rounded-t-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder-fish.jpg';
              }}
            />
              <div className="absolute top-2 left-2 flex gap-2">
                <Badge className="bg-background/90 backdrop-blur border">{listing.fish_type}</Badge>
              </div>
              <div className="absolute bottom-2 right-2">
                <Badge className="bg-primary text-primary-foreground">
                  KSh {Number(listing.price_per_kg).toLocaleString()}/kg
                </Badge>
                </div>
            </div>
            <CardContent className="flex-grow pt-4">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold">{listing.fisher_name}</div>
                <Badge variant="outline" className="capitalize">{listing.status}</Badge>
              </div>
              {(listing.fisher_phone || listing.fisher_region) && (
                <div className="text-xs text-muted-foreground mb-3">
                  {listing.fisher_phone && <span className="mr-2">📞 {listing.fisher_phone}</span>}
                  {listing.fisher_region && <span>📍 {listing.fisher_region}</span>}
                </div>
              )}
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Quantity</span>
                <span className="font-medium text-foreground">{Number(listing.quantity_kg).toLocaleString()} kg</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-muted-foreground">Total</span>
                <span className="font-bold">KSh {(Number(listing.quantity_kg) * Number(listing.price_per_kg)).toLocaleString()}</span>
            </div>
          </CardContent>
          <CardFooter>
              <Button onClick={() => handlePurchase(listing)} className="w-full">Purchase</Button>
          </CardFooter>
        </Card>
      ))}
      </div>
    </div>
  );
}
