import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Fish, Users, LogIn, UserPlus, Phone, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/types/database.types";

type Profile = Database['public']['Tables']['profiles']['Insert'];
type Tables = Database['public']['Tables'];
type ProfilesTable = Tables['profiles'];
type ProfileInsert = ProfilesTable['Insert'];

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  language: 'en' | 'sw';
}

const AuthModal = ({ open, onOpenChange, language }: AuthModalProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState<'fisher' | 'buyer'>('fisher');
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    name: '',
    region: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const text = {
    en: {
      title: isLogin ? 'Welcome Back to AquaLink' : 'Join AquaLink Kenya',
      description: isLogin 
        ? 'Sign in to access your dashboard and connect with the fishing community' 
        : 'Create your account and become part of Kenya\'s digital fishing revolution',
      loginTab: 'Sign In',
      registerTab: 'Register',
      userType: 'I am a',
      fisher: 'Fisher',
      buyer: 'Buyer',
      name: 'Full Name',
      email: 'Email Address',
      phone: 'Phone Number',
      password: 'Password',
      region: 'Region',
      regions: {
        coastal: 'Coastal Region',
        nairobi: 'Nairobi',
        central: 'Central Kenya',
        nyanza: 'Nyanza (Lake Victoria)',
        western: 'Western Kenya',
        eastern: 'Eastern Kenya',
        rift: 'Rift Valley'
      },
      signIn: 'Sign In',
      createAccount: 'Create Account',
      switchToRegister: 'Don\'t have an account? Register here',
      switchToLogin: 'Already have an account? Sign in here',
      success: {
        login: 'Welcome back! Redirecting to your dashboard...',
        register: 'Account created successfully! Welcome to AquaLink Kenya!'
      }
    },
    sw: {
      title: isLogin ? 'Karibu Tena AquaLink' : 'Jiunge na AquaLink Kenya',
      description: isLogin
        ? 'Ingia ili kufikia dashibodi yako na kuungana na jamii ya uvuvi'
        : 'Unda akaunti yako na kuwa sehemu ya mapinduzi ya uvuvi wa kidijitali ya Kenya',
      loginTab: 'Ingia',
      registerTab: 'Jisajili',
      userType: 'Mimi ni',
      fisher: 'Mvuvi',
      buyer: 'Mnunuzi',
      name: 'Jina Kamili',
      email: 'Anwani ya Barua Pepe',
      phone: 'Nambari ya Simu',
      password: 'Nenosiri',
      region: 'Mkoa',
      regions: {
        coastal: 'Mkoa wa Pwani',
        nairobi: 'Nairobi',
        central: 'Kenya ya Kati',
        nyanza: 'Nyanza (Ziwa Victoria)',
        western: 'Kenya Magharibi',
        eastern: 'Kenya Mashariki',
        rift: 'Bonde la Ufa'
      },
      signIn: 'Ingia',
      createAccount: 'Unda Akaunti',
      switchToRegister: 'Huna akaunti? Jisajili hapa',
      switchToLogin: 'Una akaunti tayari? Ingia hapa',
      success: {
        login: 'Karibu tena! Tunaongoza kwenda dashibodi yako...',
        register: 'Akaunti imeundwa kwa ufanisi! Karibu AquaLink Kenya!'
      }
    }
  };

  const currentText = text[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // Login existing user
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) {
          toast({
            title: language === 'en' ? "Login Failed" : "Kuingia Kumeshindikana",
            description: error.message,
            variant: "destructive",
          });
          return;
        }

        toast({
          title: language === 'en' ? "Success!" : "Mafanikio!",
          description: currentText.success.login,
        });

        // Close modal and redirect based on user type
        onOpenChange(false);
        
        // Get user profile to determine redirect
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', data.user.id)
          .single() as { data: Profile | null; error: any };

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          navigate('/');
          return;
        }

        if (profile) {
          if (profile.user_type === 'fisher') {
            navigate('/fisher-dashboard');
          } else if (profile.user_type === 'buyer') {
            navigate('/buyer-dashboard');
          } else {
            navigate('/');
          }
        }
        
      } else {
        // Register new user
        const redirectUrl = `${window.location.origin}/`;
        
        // First, sign up the user with metadata
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              name: formData.name,
              phone: formData.phone,
              region: formData.region,
              user_type: userType
            }
          }
        });

        if (signUpError) {
          toast({
            title: language === 'en' ? "Registration Failed" : "Usajili Umeshindikana",
            description: signUpError.message,
            variant: "destructive",
          });
          return;
        }

        // Profile is automatically created by the handle_new_user trigger
        toast({
          title: language === 'en' ? "Success!" : "Imefanikiwa!",
          description: currentText.success.register,
        });

        // Check if user is immediately signed in (email confirmation disabled)
        if (authData.user && !authData.user.email_confirmed_at) {
          toast({
            title: language === 'en' ? "Success!" : "Mafanikio!",
            description: language === 'en' 
              ? "Account created! Please check your email to confirm your account." 
              : "Akaunti imeundwa! Tafadhali angalia barua pepe yako ili kuthibitisha akaunti yako.",
          });
          
          // Redirect to login after successful registration
          onOpenChange(false);
          setIsLogin(true);
          
          // Reset form
          setFormData({
            email: '',
            phone: '',
            password: '',
            name: '',
            region: ''
          });
          
        } else if (authData.user && authData.session) {
          // User is automatically signed in
          toast({
            title: language === 'en' ? "Success!" : "Mafanikio!",
            description: currentText.success.register,
          });

          // Redirect based on user type
          onOpenChange(false);
          if (userType === 'fisher') {
            navigate('/fisher-dashboard');
          } else if (userType === 'buyer') {
            navigate('/buyer-dashboard');
          }
          
          // Reset form
          setFormData({
            email: '',
            phone: '',
            password: '',
            name: '',
            region: ''
          });
          
        } else {
          // This handles any other case
          toast({
            title: language === 'en' ? "Success!" : "Mafanikio!",
            description: currentText.success.register,
          });
          onOpenChange(false);
          setIsLogin(true);
          
          // Reset form
          setFormData({
            email: '',
            phone: '',
            password: '',
            name: '',
            region: ''
          });
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast({
        title: language === 'en' ? "Error" : "Hitilafu",
        description: language === 'en' 
          ? "An error occurred. Please try again." 
          : "Hitilafu imetokea. Tafadhali jaribu tena.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-primary">
            {currentText.title}
          </DialogTitle>
          <DialogDescription className="text-center">
            {currentText.description}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={isLogin ? 'login' : 'register'} onValueChange={(value) => setIsLogin(value === 'login')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login" className="flex items-center gap-2">
              <LogIn className="w-4 h-4" />
              {currentText.loginTab}
            </TabsTrigger>
            <TabsTrigger value="register" className="flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              {currentText.registerTab}
            </TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            {!isLogin && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="userType">{currentText.userType}</Label>
                  <Select value={userType} onValueChange={(value: 'fisher' | 'buyer') => setUserType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fisher">
                        <div className="flex items-center gap-2">
                          <Fish className="w-4 h-4" />
                          {currentText.fisher}
                        </div>
                      </SelectItem>
                      <SelectItem value="buyer">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          {currentText.buyer}
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">{currentText.name}</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </div>
              </>
            )}

            <TabsContent value="login" className="space-y-4 mt-0">
              <div className="space-y-2">
                <Label htmlFor="email">{currentText.email}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{currentText.password}</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                />
              </div>

              <Button type="submit" variant="ocean" className="w-full" disabled={loading}>
                {loading ? (language === 'en' ? 'Signing in...' : 'Kuingia...') : currentText.signIn}
              </Button>

              <Button 
                type="button" 
                variant="ghost" 
                className="w-full"
                onClick={() => setIsLogin(false)}
              >
                {currentText.switchToRegister}
              </Button>
            </TabsContent>

            <TabsContent value="register" className="space-y-4 mt-0">
              <div className="space-y-2">
                <Label htmlFor="email">{currentText.email}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">{currentText.phone}</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    className="pl-10"
                    placeholder="+254..."
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="region">{currentText.region}</Label>
                <Select value={formData.region} onValueChange={(value) => handleInputChange('region', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={language === 'en' ? 'Select your region' : 'Chagua mkoa wako'} />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(currentText.regions).map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{currentText.password}</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                />
              </div>

              <Button type="submit" variant="ocean" className="w-full" disabled={loading}>
                {loading ? (language === 'en' ? 'Creating account...' : 'Kuunda akaunti...') : currentText.createAccount}
              </Button>

              <Button 
                type="button" 
                variant="ghost" 
                className="w-full"
                onClick={() => setIsLogin(true)}
              >
                {currentText.switchToLogin}
              </Button>
            </TabsContent>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;