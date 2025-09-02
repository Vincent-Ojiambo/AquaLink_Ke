import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { format, parseISO } from 'date-fns';
import { Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface FishCatch {
  id: string;
  fish_type: string;
  quantity_kg: number;
  price_per_kg: number;
  catch_date: string;
  created_at: string;
  status: string;
}

export default function DailyCatches() {
  const [catches, setCatches] = useState<FishCatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchCatches = async () => {
    try {
      setLoading(true);
      setError(null);
      const today = new Date().toISOString().split('T')[0];
      
      console.log('1. Starting to fetch catches for date:', today);
      
      // First, check if user is authenticated
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        console.log('2. User not authenticated:', authError?.message || 'No user found');
        setError('Please sign in to view catches');
        setCatches([]);
        return;
      }
      
      console.log('3. User authenticated:', user.id);
      
      // Try to fetch from the catches table with user's ID
      console.log('4. Querying catches table...');
      const { data, error } = await supabase
        .from('catches')
        .select('*')
        .eq('fisher_id', user.id)  // Filter by user's ID
        .eq('catch_date', today)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('5. Supabase query error:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        
        if (error.message.includes('relation "catches" does not exist')) {
          const errorMsg = 'The catches table does not exist. Please run the database setup first.';
          console.error('6. Table does not exist error');
          setError(errorMsg);
          toast({
            title: "Setup Required",
            description: errorMsg,
            variant: "destructive"
          });
          return;
        }
        
        throw new Error(`Database error: ${error.message}`);
      }
      
      console.log('7. Raw data from database:', JSON.stringify(data, null, 2));
      
      if (!data || data.length === 0) {
        console.log('8. No catches found for today');
        toast({
          title: "No Catches Today",
          description: "No catches have been recorded for today yet.",
        });
        setCatches([]);
        return;
      }
      
      // Map the data to the FishCatch type
      const formattedCatches: FishCatch[] = data.map((item: any) => {
        const formattedItem = {
          id: item.id || 'no-id',
          fish_type: item.fish_type || 'Unknown',
          quantity_kg: Number(item.quantity_kg) || 0,
          price_per_kg: Number(item.price_per_kg) || 0,
          catch_date: item.catch_date || today,
          created_at: item.created_at || new Date().toISOString(),
          status: item.status || 'pending',
          image_url: item.image_url || null
        };
        
        console.log('9. Formatted catch item:', JSON.stringify(formattedItem, null, 2));
        return formattedItem;
      });
      
      console.log('10. Setting catches state with:', formattedCatches.length, 'items');
      setCatches(formattedCatches);
      
    } catch (err) {
      console.error('Error in fetchCatches:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(`Failed to load catches. ${errorMessage}`);
      
      toast({
        title: "Error",
        description: `Failed to load catches: ${errorMessage}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatches();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4 text-red-500">
        {error}
      </div>
    );
  }

  const totalValue = catches.reduce((sum, item) => {
    return sum + (item.quantity_kg * item.price_per_kg);
  }, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Catches</CardTitle>
      </CardHeader>
      <CardContent>
        {catches.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">No catches recorded for today.</p>
        ) : (
          <div className="space-y-4">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fish Type</TableHead>
                    <TableHead className="text-right">Quantity (kg)</TableHead>
                    <TableHead className="text-right">Price/KG (KES)</TableHead>
                    <TableHead className="text-right">Total (KES)</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {catches.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.fish_type}</TableCell>
                      <TableCell className="text-right">{item.quantity_kg.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{item.price_per_kg.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        {(item.quantity_kg * item.price_per_kg).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {format(new Date(item.created_at), 'h:mm a')}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          item.status === 'available' 
                            ? 'bg-green-100 text-green-800' 
                            : item.status === 'sold'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div className="flex justify-end">
              <div className="text-right space-y-1">
                <div className="text-sm text-muted-foreground">
                  Total Catches: {catches.length}
                </div>
                <div className="text-lg font-semibold">
                  Total Value: KES {totalValue.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
