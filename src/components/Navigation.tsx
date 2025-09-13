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

  interface NavItem {
    label: string;
    href: string;
    isRoute?: boolean;
  }

  const navItems: { en: NavItem[]; sw: NavItem[] } = {
    en: [
      { label: 'Features', href: '#features' },
      { label: 'How it Works', href: '#how-it-works' },
      { label: 'Support', href: '#support' },
      { label: 'About', href: '#about' },
      { label: 'Safety', href: '/safety', isRoute: true }
    ],
    sw: [
      { label: 'Vipengele', href: '#features' },
      { label: 'Jinsi Inavyofanya Kazi', href: '#how-it-works' },
      { label: 'Msaada', href: '#support' },
      { label: 'Kuhusu', href: '#about' },
      { label: 'Usalama', href: '/safety', isRoute: true }
    ]
  };

  const currentNavItems = navItems[language];

  const handleNavClick = (item: NavItem) => {
    setIsOpen(false);
    
    if (item.isRoute) {
      window.location.href = item.href;
      return;
    }
    
    const element = document.querySelector(item.href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-border/50' 
          : 'bg-primary/95 backdrop-blur-md'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <img
                src="/Aqua_Link.png"
                alt="AquaLink Kenya"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover"
              />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              {currentNavItems.map((item) => (
                <div key={item.label} className="relative group">
                  <button
                    onClick={() => handleNavClick(item)}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                      isScrolled 
                        ? item.href === '/safety' 
                          ? 'text-red-600 hover:text-red-700 font-semibold' 
                          : 'text-foreground hover:text-primary hover:bg-primary/5 font-semibold'
                        : item.href === '/safety'
                          ? 'text-red-400 hover:text-red-300 font-semibold'
                          : 'text-white hover:text-white hover:bg-white/20 font-medium'
                    }`}
                  >
                    {item.label}
                    {item.href === '/safety' && (
                      <span className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-red-100 text-[10px] font-medium text-red-600 dark:bg-red-900/30 dark:text-red-400">
                        !
                      </span>
                    )}
                  </button>
                  <span className={`absolute bottom-0 left-1/2 w-0 h-0.5 ${
                    isScrolled ? 'bg-primary' : 'bg-white'
                  } transition-all duration-300 group-hover:w-4/5 group-hover:left-[10%]`}></span>
                </div>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onLanguageChange(language === 'en' ? 'sw' : 'en')}
                className={`px-3 py-1.5 rounded-md transition-all duration-200 ${
                  isScrolled 
                    ? 'text-foreground hover:text-primary hover:bg-primary/5' 
                    : 'text-white hover:text-white hover:bg-white/20'
                } font-medium border border-white/30 hover:border-white/50`}
              >
                {language === 'en' ? 'Kiswahili' : 'English'}
              </Button>
              
              <Button
                variant={isScrolled ? "ocean" : "coastal"}
                size="sm"
                onClick={onGetStarted}
                className="group transition-transform hover:scale-105 duration-200 shadow-md hover:shadow-lg font-semibold"
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
                  className="md:hidden p-2 text-white hover:bg-white/10"
                  aria-label={language === 'en' ? 'Open menu' : 'Fungua menyu'}
                >
                  {isOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="right" 
                className="w-[85vw] max-w-sm p-0 flex flex-col"
                onOpenAutoFocus={(e) => e.preventDefault()}
              >
                <div className="p-6 pb-4 border-b border-border">
                  <div className="flex items-center justify-between mb-6">
                    <img
                      src="/Aqua_Link.png"
                      alt="AquaLink Kenya"
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsOpen(false)}
                      className="text-muted-foreground"
                      aria-label={language === 'en' ? 'Close menu' : 'Funga menyu'}
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>

                  {/* Language Toggle */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onLanguageChange(language === 'en' ? 'sw' : 'en')}
                    className="w-full mb-4"
                  >
                    {language === 'en' ? 'Switch to Kiswahili' : 'Badili kwa Kiingereza'}
                  </Button>
                </div>

                {/* Mobile Navigation Links */}
                <nav className="flex-1 overflow-y-auto">
                  <ul className="py-2">
                    {currentNavItems.map((item) => (
                      <li key={item.href}>
                        <a
                          href={item.href}
                          onClick={(e) => {
                            e.preventDefault();
                            handleNavClick(item);
                          }}
                          className={`text-sm font-medium ${
                            item.href === '/safety' 
                              ? 'text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300' 
                              : 'text-gray-900 hover:text-blue-600 dark:text-gray-100 dark:hover:text-blue-400'
                          } transition-colors`}
                        >
                          {item.label}
                          {item.href === '/safety' && (
                            <span className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-red-100 text-[10px] font-medium text-red-600 dark:bg-red-900/30 dark:text-red-400">
                              !
                            </span>
                          )}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>

                {/* Mobile Actions */}
                <div className="p-6 pt-4 border-t border-border">
                  <Button
                    variant="ocean"
                    onClick={() => {
                      onGetStarted();
                      setIsOpen(false);
                    }}
                    className="w-full group mb-4"
                    size="lg"
                  >
                    <Waves className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    {language === 'en' ? 'Get Started Free' : 'Anza Bure'}
                  </Button>

                  {/* Contact Info */}
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <a 
                      href="tel:+254741253317" 
                      className="flex items-center space-x-3 hover:text-primary transition-colors"
                    >
                      <Phone className="w-4 h-4 flex-shrink-0" />
                      <span>+254 741 253 317</span>
                    </a>
                    <a 
                      href="mailto:support@aquanet.co.ke" 
                      className="flex items-center space-x-3 hover:text-primary transition-colors"
                    >
                      <Mail className="w-4 h-4 flex-shrink-0" />
                      <span className="break-all">support@aquanet.co.ke</span>
                    </a>
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