import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Fish, Menu, X, Waves, Phone, Mail, ChevronRight } from "lucide-react";
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
                  size="icon"
                  className="md:hidden"
                  aria-label={isOpen ? (language === 'en' ? 'Close menu' : 'Funga menyu') : (language === 'en' ? 'Open menu' : 'Fungua menyu')}
                  onClick={() => setIsOpen(!isOpen)}
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
                className="w-[90vw] max-w-sm p-0 flex flex-col bg-gradient-to-b from-background/95 to-background/80 backdrop-blur-lg border-l border-border/20 shadow-2xl shadow-black/20"
                onOpenAutoFocus={(e) => e.preventDefault()}
                onInteractOutside={() => setIsOpen(false)}
                style={{
                  '--tw-bg-opacity': '0.98',
                  animation: 'slideIn 0.3s ease-out forwards',
                } as React.CSSProperties}
              >
                <div className="p-6 pb-4 bg-gradient-to-r from-primary/5 to-primary/10 border-b border-border/20 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-50" />
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3 relative z-10">
                      <div className="relative">
                        <img
                          src="/Aqua_Link.png"
                          alt="AquaLink Kenya"
                          className="w-14 h-14 rounded-xl object-cover border-2 border-primary/20 shadow-lg"
                        />
                        <div className="absolute -inset-1 rounded-xl bg-primary/10 -z-10 blur-sm" />
                      </div>
                      <div className="space-y-0.5">
                        <h3 className="font-bold text-foreground text-lg bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                          AquaLink Kenya
                        </h3>
                        <p className="text-xs text-muted-foreground font-medium">
                          {language === 'en' ? 'Connecting fishers to markets' : 'Kuunganisha wavuvi na masoko'}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsOpen(false)}
                      className="text-muted-foreground hover:bg-accent/50 hover:text-foreground"
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
                    className="w-full mb-4 bg-background/90 hover:bg-accent/30 transition-all duration-200 border-border/30 hover:border-primary/30 shadow-sm hover:shadow-md backdrop-blur-sm"
                  >
                    {language === 'en' ? 'Switch to Kiswahili' : 'Badili kwa Kiingereza'}
                  </Button>
                </div>

                {/* Mobile Navigation Links */}
                <nav className="flex-1 overflow-y-auto px-2 py-4">
                  <ul className="space-y-1.5 px-2">
                    {currentNavItems.map((item) => (
                      <li key={item.href} className="group">
                        <a
                          href={item.href}
                          onClick={(e) => {
                            e.preventDefault();
                            handleNavClick(item);
                            setIsOpen(false);
                          }}
                          className={`flex items-center px-4 py-3.5 rounded-xl transition-all duration-300 ${
                            item.href === '/safety'
                              ? 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 border border-red-100 dark:border-red-900/30 hover:border-red-200 dark:hover:border-red-800/50'
                              : 'text-foreground hover:bg-accent/80 hover:text-accent-foreground border border-transparent hover:border-border/30'
                          } group-hover:translate-x-1`}
                        >
                          <span className="relative flex items-center">
                            <span className="absolute -left-2 w-1 h-5 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <span className="text-sm font-medium flex items-center ml-1">
                              {item.label}
                              {item.href === '/safety' && (
                                <span className="ml-2 inline-flex items-center justify-center h-5 w-5 rounded-full bg-red-100 text-xs font-medium text-red-600 dark:bg-red-900/30 dark:text-red-400 animate-pulse">
                                  !
                                </span>
                              )}
                            </span>
                          </span>
                          <span className="ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-1 group-hover:translate-x-0">
                            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>

                {/* Mobile Actions */}
                <div className="p-5 pt-3 bg-gradient-to-t from-background/95 to-background/80 backdrop-blur-lg border-t border-border/30 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-30" />
                  <div className="relative z-10">
                    <Button
                      variant="ocean"
                      onClick={() => {
                        onGetStarted();
                        setIsOpen(false);
                      }}
                      className="w-full group mb-5 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80"
                      size="lg"
                    >
                      <Waves className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform group-hover:animate-wave" />
                      {language === 'en' ? 'Get Started Free' : 'Anza Bure'}
                      <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <ChevronRight className="w-4 h-4 inline-block group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Button>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-3 text-sm relative z-10">
                    <div className="flex items-center mb-2">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground inline-flex items-center">
                        {language === 'en' ? 'Contact Us' : 'Wasiliana Nasi'}
                      </h4>
                      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-border/50 to-transparent ml-3" />
                    </div>
                    <a 
                      href="tel:+254741253317" 
                      className="flex items-center space-x-3 p-2.5 rounded-xl hover:bg-accent/50 transition-all duration-200 group border border-transparent hover:border-border/20"
                    >
                      <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors duration-200">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground group-hover:text-primary transition-colors">+254 741 253 317</p>
                        <p className="text-xs text-muted-foreground group-hover:text-foreground/80 transition-colors">
                          {language === 'en' ? 'Call us now' : 'Tupe simu sasa'}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                    </a>
                    <a 
                      href="mailto:support@aquanet.co.ke" 
                      className="flex items-center space-x-3 p-2.5 rounded-xl hover:bg-accent/50 transition-all duration-200 group border border-transparent hover:border-border/20"
                    >
                      <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors duration-200">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground group-hover:text-primary transition-colors truncate">support@aquanet.co.ke</p>
                        <p className="text-xs text-muted-foreground group-hover:text-foreground/80 transition-colors">
                          {language === 'en' ? 'Email us' : 'Tutumie barua pepe'}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
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