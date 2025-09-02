import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';

interface Catch {
  id: string;
  fish_type: string;
  quantity_kg: number;
  price_per_kg: number;
  catch_date: string;
  status: string;
}

export default function CatchList() {
  const [catches, setCatches] = useState<Catch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCatches = async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('catches')
        .select('*')
        .eq('catch_date', today)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setCatches(data || []);
    } catch (err) {
      console.error('Error fetching catches:', err);
      setError('Failed to load catches. Please try again.');
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
                        {format(new Date(item.catch_date + 'T' + item.created_at.split('T')[1]), 'h:mm a')}
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
