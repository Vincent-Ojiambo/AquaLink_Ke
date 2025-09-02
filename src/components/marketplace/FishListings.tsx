import { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/types/database.types";

type Catch = Database['public']['Tables']['catches']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

export interface FishListing {
  id: string;
  fisher_id: string;
  fisher_name: string;
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
  const { toast } = useToast();

  const fetchListings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching fish listings...');
      
      // First, get all approved catches
      const { data: catchesData, error: catchesError } = await supabase
        .from('catches')
        .select('*')
        .eq('status', 'approved')
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
      
      // Get profiles for all fishers
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, name')
        .in('id', fisherIds) as unknown as {
          data: Pick<Profile, 'id' | 'name'>[] | null;
          error: any;
        };

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw new Error(`Failed to load fisher profiles: ${profilesError.message}`);
      }

      // Create a map of fisher IDs to their names
      const fisherNameMap = new Map(
        (profilesData || []).map(profile => [profile.id, profile.name])
      );
      
      console.log('Fetched listings:', catchesData);
      
      // Transform the data to include fisher's name
      const formattedListings = (catchesData || []).map((item) => ({
        id: item.id,
        fisher_id: item.fisher_id,
        fisher_name: fisherNameMap.get(item.fisher_id) || 'Unknown Fisher',
        fish_type: item.fish_type || 'Unknown',
        quantity_kg: item.quantity_kg,
        price_per_kg: item.price_per_kg,
        catch_date: item.catch_date || new Date().toISOString().split('T')[0],
        image_url: item.image_url,
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
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading fish listings...</span>
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
      <div className="text-center p-8">
        <p>No fish listings available at the moment.</p>
        <p className="text-sm text-gray-500 mt-2">Check back later or contact local fishers.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {listings.map((listing) => (
        <Card key={listing.id} className="flex flex-col h-full">
          <CardHeader>
            <img
              src={listing.image_url || '/placeholder-fish.jpg'}
              alt={listing.fish_type}
              className="rounded-md object-cover w-32 h-20"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder-fish.jpg';
              }}
            />
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="aspect-square relative mb-4">
              {listing.image_url ? (
                <img
                  src={listing.image_url}
                  alt={`${listing.fish_type} catch`}
                  className="w-full h-full object-cover rounded-md"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder-fish.jpg';
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Quantity:</span>
                <span className="font-medium">{listing.quantity_kg} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Price per kg:</span>
                <span className="font-medium">KSh {listing.price_per_kg.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-lg mt-4">
                <span>Total:</span>
                <span>KSh {(listing.quantity_kg * listing.price_per_kg).toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => handlePurchase(listing)}
              className="w-full"
            >
              Purchase
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
