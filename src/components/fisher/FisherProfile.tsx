import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase-client";
import { User } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";
// No need to import updateProfile/upsertProfile as they're now part of the supabase client
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Pencil, Save, X, Upload, User as UserIcon, XCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface ProfileType {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  avatar_url?: string;
  region?: string;
  license_number?: string;
  years_of_experience?: number;
  [key: string]: any; // Allow additional properties
}

interface FisherProfileProps {
  user: User;
  profile: ProfileType;
  onUpdate: () => void;
  setProfile: React.Dispatch<React.SetStateAction<ProfileType | null>>;
}

export default function FisherProfile({ user, profile, onUpdate, setProfile }: FisherProfileProps) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  type ProfileFormData = {
    name: string;
    phone: string;
    email: string;
    region: string;
    license_number: string;
    years_of_experience: string;
  };

  const [formData, setFormData] = useState<ProfileFormData>({
    name: profile?.name || '',
    phone: profile?.phone || '',
    email: user?.email || '',
    region: profile?.region || '',
    license_number: profile?.license_number || '',
    years_of_experience: profile?.years_of_experience?.toString() || '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = async (file: File) => {
    if (!profile) return;
    
    try {
      setIsUploading(true);
      
      // Generate a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `profile-images/${profile.id}/${fileName}`;

      // Upload the file using the raw client
      const supabaseClient = supabase.getClient();
      const { error: uploadError } = await supabaseClient.storage
        .from('profile-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabaseClient.storage
        .from('profile-images')
        .getPublicUrl(filePath);

      // Update the profile with the new avatar URL
      const { error: updateError } = await supabase.updateProfile(profile.id, {
        avatar_url: publicUrl
      });

      if (updateError) throw updateError;

      // Update the local state
      setProfile(prev => prev ? { ...prev, avatar_url: publicUrl } : null);
      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload an image file (JPEG, PNG, etc.)',
        variant: 'destructive',
      });
      return;
    }

    try {
      await handleImageUpload(file);
      toast({
        title: 'Success',
        description: 'Profile picture updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload profile picture',
        variant: 'destructive',
      });
    }
  };

  const removeProfilePicture = async () => {
    if (!profile?.avatar_url) return;
    
    try {
      setIsUploading(true);
      
      // Extract the file path from the URL
      const url = new URL(profile.avatar_url);
      const pathParts = url.pathname.split('/');
      const filePath = pathParts.slice(pathParts.indexOf('profile-images')).join('/');
      
      // Get the raw client for storage operations
      const supabaseClient = supabase.getClient();
      
      // Delete the file from storage
      const { error: deleteError } = await supabaseClient.storage
        .from('profile-images')
        .remove([filePath]);

      if (deleteError) throw deleteError;

      // Update the profile to remove the avatar URL
      const { error: updateError } = await supabase.updateProfile(profile.id, {
        avatar_url: null
      });

      if (updateError) throw updateError;

      // Update local state
      setProfile(prev => prev ? { ...prev, avatar_url: '' } : null);
      
      toast({
        title: 'Success',
        description: 'Profile picture removed',
      });
    } catch (error) {
      console.error('Error removing profile picture:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove profile picture',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!profile) return;
    
    try {
      setIsLoading(true);
      
      // Prepare the profile data
      const { data: updatedProfile, error } = await supabase.upsertProfile({
        id: profile.id,
        user_id: user.id,
        name: formData.name,
        phone: formData.phone || null,
        email: formData.email || null,
        avatar_url: profile.avatar_url || null,
        region: formData.region || null,
        license_number: formData.license_number || null,
        years_of_experience: formData.years_of_experience ? parseInt(formData.years_of_experience) : null,
        user_type: 'fisher' as const
      });
      
      if (error) {
        console.error('Error updating profile:', error);
        throw error;
      }
      
      // Update email in auth if changed
      if (formData.email !== user.email) {
        const { error: emailError } = await supabase.getClient().auth.updateUser(
          { email: formData.email },
          { emailRedirectTo: `${window.location.origin}/fisher-dashboard` }
        );
        if (emailError) throw emailError;
      }

      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
      });
      
      setIsEditing(false);
      onUpdate(); // Refresh parent component
      
      return updatedProfile;
    } catch (error: any) {
      console.error('Error updating profile:', {
        error,
        message: error?.message,
        details: error?.details,
        hint: error?.hint,
        code: error?.code
      });
      
      toast({
        title: 'Update Failed',
        description: error?.message || 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!profile) return null;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Fisher Profile</CardTitle>
            <CardDescription>Manage your personal and professional information</CardDescription>
          </div>
          {!isEditing ? (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsEditing(true)}
              className="gap-2"
            >
              <Pencil className="h-4 w-4" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setIsEditing(false);
                  // Reset form
                  setFormData({
                    name: profile?.name || '',
                    phone: profile?.phone || '',
                    email: user?.email || '',
                    region: profile?.region || '',
                    license_number: profile?.license_number || '',
                    years_of_experience: profile?.years_of_experience?.toString() || '',
                  });
                }}
                disabled={isLoading}
              >
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
              <Button 
                size="sm" 
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : (
                  <>
                    <Save className="h-4 w-4 mr-1" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center mb-8">
          <div className="relative group">
            {profile.avatar_url ? (
              <div className="relative">
                <img 
                  src={profile.avatar_url} 
                  alt="Profile" 
                  className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-md"
                />
                {!isUploading && (
                  <button
                    onClick={removeProfilePicture}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    disabled={isUploading}
                  >
                    <XCircle className="h-5 w-5" />
                  </button>
                )}
              </div>
            ) : (
              <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center">
                <UserIcon className="h-16 w-16 text-gray-400" />
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
              disabled={isUploading}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="mt-4 w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
            >
              {isUploading ? (
                'Uploading...'
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  {profile.avatar_url ? 'Change Photo' : 'Upload Photo'}
                </>
              )}
            </button>
          </div>
        </div>
        
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="region">Region</Label>
                <Input
                  id="region"
                  name="region"
                  value={formData.region}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="license_number">Fishing License Number</Label>
                <Input
                  id="license_number"
                  name="license_number"
                  value={formData.license_number}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="years_of_experience">Years of Experience</Label>
                <Input
                  id="years_of_experience"
                  name="years_of_experience"
                  type="number"
                  min="0"
                  value={formData.years_of_experience}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">
                  {profile.name?.charAt(0) || 'F'}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-semibold">{profile.name}</h3>
                <p className="text-muted-foreground">{profile.region || 'No region specified'}</p>
                <div className="mt-1">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    Fisher
                  </Badge>
                  {profile.license_number && (
                    <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
                      Licensed
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p>{user?.email || 'Not provided'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Phone</p>
                <p>{profile.phone || 'Not provided'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">License Number</p>
                <p>{profile.license_number || 'Not provided'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Experience</p>
                <p>{profile.years_of_experience ? `${profile.years_of_experience} years` : 'Not specified'}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
