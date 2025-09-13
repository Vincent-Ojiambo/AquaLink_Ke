import { useState, useRef, ChangeEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ImagePlus, X } from 'lucide-react';

type FishType = 'Tilapia' | 'Nile Perch' | 'Catfish' | 'Mudfish' | 'Others';

const FISH_TYPES: FishType[] = ['Tilapia', 'Nile Perch', 'Catfish', 'Mudfish', 'Others'];

interface AddCatchFormProps {
  onSuccess: () => void;
}

export default function AddCatchForm({ onSuccess }: AddCatchFormProps) {
  const [fishType, setFishType] = useState<FishType>('Tilapia');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File",
          description: "Please upload an image file",
          variant: "destructive",
        });
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please upload an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }
      
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    const quantityNum = parseFloat(quantity);
    const priceNum = parseFloat(price);
    
    if (isNaN(quantityNum) || quantityNum <= 0) {
      toast({
        title: "Invalid Quantity",
        description: "Please enter a valid quantity greater than 0",
        variant: "destructive",
      });
      return;
    }
    
    if (isNaN(priceNum) || priceNum <= 0) {
      toast({
        title: "Invalid Price",
        description: "Please enter a valid price greater than 0",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      console.log('Starting catch submission...');
      
      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      console.log('User:', user);
      
      if (authError || !user) {
        console.error('Authentication error:', authError);
        throw new Error('Please sign in to record catches');
      }
      
      let imageUrl = null;
      
      // Upload image if exists
      if (imageFile) {
        console.log('Uploading image...');
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        console.log('Uploading file:', { fileName, size: imageFile.size, type: imageFile.type });
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('catch-images')
          .upload(fileName, imageFile, {
            cacheControl: '3600',
            upsert: false
          });
          
        if (uploadError) {
          console.error('Upload error details:', {
            message: uploadError.message,
            status: uploadError.statusCode,
            error: uploadError.error
          });
          throw new Error(`Failed to upload image: ${uploadError.message}`);
        }
        
        console.log('Upload successful:', uploadData);
        
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('catch-images')
          .getPublicUrl(fileName);
          
        imageUrl = publicUrl;
        console.log('Generated public URL:', imageUrl);
      }
      
      // Prepare catch data with current date
      const catchData = {
        fisher_id: user.id,
        fish_type: fishType,
        quantity_kg: quantityNum,
        price_per_kg: priceNum,
        catch_date: new Date().toISOString().split('T')[0],
        image_url: imageUrl,
        created_at: new Date().toISOString(),
        status: 'approved'
      };
      
      console.log('Prepared catch data:', JSON.stringify(catchData, null, 2));
      
      // Insert catch record
      console.log('Inserting catch record...');
      const { data, error } = await supabase
        .from('catches')
        .insert([catchData])
        .select();

      if (error) {
        console.error('Database error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw new Error(`Database error: ${error.message}`);
      }
      
      console.log('Catch recorded successfully:', data);
      
      // Reset form
      setQuantity('');
      setPrice('');
      setImageFile(null);
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Notify parent component
      onSuccess();
      
      toast({
        title: "Success",
        description: "Catch recorded successfully!",
      });
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      
      toast({
        title: "Error",
        description: `Failed to record catch: ${errorMessage}`,
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
        
        {/* Image Upload */}
        <div className="space-y-2">
          <Label>Image of the Catch (Optional)</Label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md">
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Catch preview"
                  className="max-h-48 rounded-md"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  aria-label="Remove image"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-1 text-center">
                <div className="flex text-gray-600 justify-center">
                  <ImagePlus className="h-12 w-12 text-gray-400" aria-hidden="true" />
                </div>
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none"
                  >
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleImageChange}
                      ref={fileInputRef}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
              </div>
            )}
          </div>
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
