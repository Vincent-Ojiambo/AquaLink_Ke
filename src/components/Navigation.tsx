import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Fish, Menu, X, Waves, Phone, Mail } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface NavigationProps {
  language: 'en' | 'sw';
  onLanguageChange: (language: 'en' | 'sw') => void;
  onGetStarted: () => void;
}

const Navigation = ({ language, onLanguageChange, onGetStarted }: NavigationProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = {
    en: [
      { label: 'Features', href: '#features' },
      { label: 'How it Works', href: '#how-it-works' },
      { label: 'Support', href: '#support' },
      { label: 'About', href: '#about' }
    ],
    sw: [
      { label: 'Vipengele', href: '#features' },
      { label: 'Jinsi Inavyofanya Kazi', href: '#how-it-works' },
      { label: 'Msaada', href: '#support' },
      { label: 'Kuhusu', href: '#about' }
    ]
  };

  const currentNavItems = navItems[language];

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-border/50' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-ocean rounded-xl flex items-center justify-center">
                <Fish className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className={`text-xl font-bold ${isScrolled ? 'text-primary' : 'text-white'}`}>
                  AquaNet
                </h1>
                <p className={`text-xs ${isScrolled ? 'text-muted-foreground' : 'text-white/80'}`}>
                  Kenya
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {currentNavItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.href)}
                  className={`text-sm font-medium transition-colors hover:scale-105 transform duration-200 ${
                    isScrolled 
                      ? 'text-muted-foreground hover:text-primary' 
                      : 'text-white/90 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onLanguageChange(language === 'en' ? 'sw' : 'en')}
                className={`${
                  isScrolled 
                    ? 'text-muted-foreground hover:text-primary hover:bg-primary/10' 
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                {language === 'en' ? 'Kiswahili' : 'English'}
              </Button>
              
              <Button
                variant={isScrolled ? "ocean" : "coastal"}
                size="sm"
                onClick={onGetStarted}
                className="group"
              >
                <Waves className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                {language === 'en' ? 'Get Started' : 'Anza'}
              </Button>
            </div>

            {/* Mobile Menu Trigger */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`md:hidden ${
                    isScrolled ? 'text-primary' : 'text-white'
                  }`}
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col h-full">
                  <div className="flex items-center space-x-3 mb-8">
                    <div className="w-10 h-10 bg-gradient-ocean rounded-xl flex items-center justify-center">
                      <Fish className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-primary">AquaNet</h1>
                      <p className="text-xs text-muted-foreground">Kenya</p>
                    </div>
                  </div>

                  {/* Mobile Navigation Links */}
                  <div className="flex flex-col space-y-4 mb-8">
                    {currentNavItems.map((item) => (
                      <button
                        key={item.label}
                        onClick={() => handleNavClick(item.href)}
                        className="text-left text-lg font-medium text-muted-foreground hover:text-primary transition-colors py-2"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>

                  {/* Mobile Actions */}
                  <div className="flex flex-col space-y-4 mt-auto">
                    <Button
                      variant="outline"
                      onClick={() => onLanguageChange(language === 'en' ? 'sw' : 'en')}
                      className="w-full"
                    >
                      {language === 'en' ? 'Switch to Kiswahili' : 'Badili kwa Kiingereza'}
                    </Button>
                    
                    <Button
                      variant="ocean"
                      onClick={onGetStarted}
                      className="w-full group"
                    >
                      <Waves className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                      {language === 'en' ? 'Get Started Free' : 'Anza Bure'}
                    </Button>

                    {/* Contact Info */}
                    <div className="pt-6 border-t border-border">
                      <div className="flex items-center space-x-3 text-sm text-muted-foreground mb-2">
                        <Phone className="w-4 h-4" />
                        <span>+254 700 123 456</span>
                      </div>
                      <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                        <Mail className="w-4 h-4" />
                        <span>support@aquanet.co.ke</span>
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      {/* Spacer for fixed navigation */}
      <div className="h-16" />
    </>
  );
};

export default Navigation;