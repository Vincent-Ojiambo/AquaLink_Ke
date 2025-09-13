import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type FishType = 'Tilapia' | 'Nile Perch' | 'Catfish' | 'Mudfish' | 'Others';

const FISH_TYPES: FishType[] = ['Tilapia', 'Nile Perch', 'Catfish', 'Mudfish', 'Others'];

export default function CatchForm({ onCatchAdded }: { onCatchAdded: () => void }) {
  const [fishType, setFishType] = useState<FishType>('Tilapia');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      // Ensure user is authenticated and capture their id for RLS
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error('Please sign in to record catches');
      }

      const today = new Date().toISOString().split('T')[0];

      const { error } = await supabase
        .from('catches')
        .insert([
          { 
            fisher_id: user.id,
            fish_type: fishType, 
            quantity_kg: parseFloat(quantity),
            price_per_kg: parseFloat(price),
            catch_date: today,
            status: 'approved',
          },
        ]);

      if (error) throw error;
      
      // Reset form
      setQuantity('');
      setPrice('');
      
      // Notify parent component
      onCatchAdded();
      
      toast({
        title: "Success",
        description: "Catch recorded successfully!",
      });
    } catch (error) {
      console.error('Error adding catch:', error);
      toast({
        title: "Error",
        description: "Failed to record catch. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Record Today's Catch</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fishType">Fish Type</Label>
          <Select value={fishType} onValueChange={(value: FishType) => setFishType(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select fish type" />
            </SelectTrigger>
            <SelectContent>
              {FISH_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity (kg)</Label>
          <Input
            id="quantity"
            type="number"
            step="0.1"
            min="0.1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Enter quantity in kilograms"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="price">Price per KG (KES)</Label>
          <Input
            id="price"
            type="number"
            step="1"
            min="1"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter price per kilogram"
            required
          />
        </div>
        
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Recording...' : 'Record Catch'}
        </Button>
      </form>
    </div>
  );
}
