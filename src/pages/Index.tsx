import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, ShoppingCart, Activity, Waves, Fish, Zap, Shield, BarChart3, Smartphone, Globe, Heart, FishSymbol, Zap as Lightning, Shield as ShieldIcon, BarChart3 as BarChart, Smartphone as Phone, Globe as GlobeIcon, Heart as HeartIcon } from "lucide-react";
import heroImage from "../assets/hero-ocean.jpg";
import AuthModal from "@/components/AuthModal";
import Navigation from "@/components/Navigation";
import Testimonials from "@/components/Testimonials";
import SupportSection from "@/components/SupportSection";
import TrustIndicators from "@/components/TrustIndicators";
import CTASection from "@/components/CTASection";

// Mock data - replace with actual API calls

const Index = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [language, setLanguage] = useState<'en' | 'sw'>('en');
  
  const [stats, setStats] = useState({
    activeFishers: 0,
    activeBuyers: 0,
    dailyTransactions: 0
  });

  // Simulate live counter effect
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        activeFishers: Math.min(prev.activeFishers + Math.floor(Math.random() * 3), 1247),
        activeBuyers: Math.min(prev.activeBuyers + Math.floor(Math.random() * 5), 2893),
        dailyTransactions: Math.min(prev.dailyTransactions + Math.floor(Math.random() * 8), 5421)
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  

  const text = {
    en: {
      hero: {
        title: "AquaLink Kenya",
        subtitle: "Empowering Coastal Communities Through Technology",
        description: "Connect fishers and buyers, promote sustainable fishing, and strengthen Kenya's marine economy with our comprehensive digital platform.",
        fisherCta: "Join as Fisher",
        buyerCta: "Join as Buyer"
      },
      features: {
        title: "Transforming Kenya's Fishing Industry",
        fisher: {
          title: "For Fishers",
          description: "Tools to optimize your catch, stay safe, and connect with buyers",
          items: ["Real-time weather updates", "Emergency SOS system", "Digital catch logging", "Direct buyer connections"]
        },
        buyer: {
          title: "For Buyers", 
          description: "Access fresh catch directly from fishers across Kenya",
          items: ["Live marketplace", "Quality assurance", "M-Pesa integration", "Price trend analysis"]
        }
      },
      impact: {
        title: "Making Waves Across Kenya",
        communities: "Coastal Communities Served",
        fishers: "Registered Fishers",
        transactions: "Monthly Transactions"
      }
    },
    sw: {
      hero: {
        title: "AquaLink Kenya",
        subtitle: "Kuwezesha Jamii za Pwani Kupitia Teknolojia",
        description: "Unganisha wavuvi na wanunuzi, kukuza uvuvi endelevu, na kuimarisha uchumi wa bahari wa Kenya kupitia jukwaa letu la kidijitali.",
        fisherCta: "Jiunge kama Mvuvi",
        buyerCta: "Jiunge kama Mnunuzi"
      },
      features: {
        title: "Kubadilisha Sekta ya Uvuvi ya Kenya",
        fisher: {
          title: "Kwa Wavuvi",
          description: "Zana za kuboresha uvuvi wako, kukaa salama, na kuungana na wanunuzi",
          items: ["Habari za hali ya hewa za wakati halisi", "Mfumo wa hatari ya SOS", "Uandikishaji wa samaki wa kidijitali", "Miunganisho ya moja kwa moja ya wanunuzi"]
        },
        buyer: {
          title: "Kwa Wanunuzi",
          description: "Pata samaki safi moja kwa moja kutoka kwa wavuvi kote Kenya",
          items: ["Soko la moja kwa moja", "Uhakikishaji wa ubora", "Uongezaji wa M-Pesa", "Uchambuzi wa mwelekeo wa bei"]
        }
      },
      impact: {
        title: "Kuleta Mabadiliko Kote Kenya",
        communities: "Jamii za Pwani Zinazotumiwa",
        fishers: "Wavuvi Waliosajiliwa", 
        transactions: "Miamala ya Kila Mwezi"
      }
    }
  };

  const currentText = text[language];

  return (
    <div className="min-h-screen bg-gradient-coastal">
      <Navigation 
        language={language} 
        onLanguageChange={setLanguage} 
        onGetStarted={() => setShowAuth(true)} 
      />
      
      {/* Hero Section - Enhanced for Responsiveness */}
      <section id="hero" className="relative pt-20 pb-12 md:pb-16 flex items-center justify-center min-h-[80vh] sm:min-h-[90vh] overflow-hidden">
        {/* Background Image with Gradient Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(${heroImage})`,
            backgroundPosition: 'center center',
            backgroundAttachment: 'fixed'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/50 md:from-primary/80 md:via-primary/60 md:to-transparent" />
        
        {/* Content Container */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center items-center gap-4 mb-8 animate-fade-in">
            {[
              { text: language === 'en' ? 'Secure Payments' : 'Malipo Salama', icon: Shield },
              { text: language === 'en' ? '24/7 Support' : 'Msaada wa Kila Wakati', icon: Phone },
              { text: language === 'en' ? 'Verified Sellers' : 'Wauzaji Waliosajiliwa', icon: '✓' },
              { text: language === 'en' ? 'Fast Delivery' : 'Uwasilishaji wa Haraka', icon: '🚚' }
            ].map((item, i) => (
              <span key={i} className="flex items-center text-xs sm:text-sm bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10 hover:bg-white/15 transition-colors">
                {typeof item.icon === 'string' ? (
                  <span className="mr-1.5">{item.icon}</span>
                ) : (
                  <item.icon className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
                )}
                {item.text}
              </span>
            ))}
          </div>

          {/* Main Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-8 sm:mb-10 animate-fade-in-up delay-100">
            {[
              { 
                value: stats.activeFishers.toLocaleString(), 
                label: language === 'en' ? 'Active Fishers' : 'Wavuvi Wenye Kazi',
                icon: Users,
                trend: '↑ 12%',
                trendColor: 'text-green-300'
              },
              { 
                value: stats.activeBuyers.toLocaleString(), 
                label: language === 'en' ? 'Verified Buyers' : 'Wanunuzi Waliodhibitishwa',
                icon: ShoppingCart,
                trend: '↑ 8%',
                trendColor: 'text-green-300'
              },
              { 
                value: stats.dailyTransactions.toLocaleString(), 
                label: language === 'en' ? 'Monthly Transactions' : 'Miamala ya Mwezi',
                icon: Activity,
                trend: '↑ 15%',
                trendColor: 'text-green-300'
              }
            ].map((stat, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/5 hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-0.5">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <stat.icon className="h-4 w-4 sm:h-5 sm:w-5 text-white/80 flex-shrink-0" />
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-white">{stat.value}</div>
                  {stat.trend && (
                    <span className={`text-xs font-medium ${stat.trendColor} bg-white/10 px-1.5 py-0.5 rounded-full`}>
                      {stat.trend}
                    </span>
                  )}
                </div>
                <div className="text-xs sm:text-sm text-white/70">{stat.label}</div>
              </div>
            ))}
          </div>
          
          {/* Badge and Heading Group */}
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-4 sm:mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30 animate-fade-in px-3 py-1.5 text-sm sm:text-base">
              <Waves className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" />
              {language === 'en' ? 'Sustainable Fishing Platform' : 'Jukwaa la Uvuvi Endelevu'}
            </Badge>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white to-primary-glow bg-clip-text text-transparent animate-fade-in leading-tight sm:leading-none">
              {currentText.hero.title}
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl mb-3 sm:mb-6 font-medium text-white/95 animate-fade-in max-w-4xl mx-auto px-4 leading-relaxed">
              {currentText.hero.subtitle}
            </p>
            
            <p className="text-sm sm:text-base md:text-lg text-white/90 mb-8 sm:mb-10 max-w-3xl mx-auto px-4 sm:px-6 animate-fade-in leading-relaxed">
              {currentText.hero.description}
            </p>
          </div>

          {/* Search/CTA Component */}
          <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-sm rounded-xl p-1 sm:p-1.5 mb-10 animate-fade-in-up delay-150">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder={language === 'en' ? 'Search for fish, location...' : 'Tafuta samaki, eneo...'}
                  className="w-full px-4 py-3 sm:py-4 rounded-lg bg-white/5 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-white/70 hover:text-white transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
              <button 
                onClick={() => setShowAuth(true)}
                className="px-6 py-3 sm:py-4 bg-white text-primary hover:bg-gray-100 font-medium rounded-lg transition-colors whitespace-nowrap"
              >
                {language === 'en' ? 'Get Started' : 'Anza Sasa'}
              </button>
            </div>
          </div>

          {/* Social Proof */}
          <div className="flex flex-col items-center mb-8 sm:mb-12 animate-fade-in-up delay-200">
            <div className="flex -space-x-2 mb-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                  {i === 5 ? '+2.5K' : `U${i}`}
                </div>
              ))}
            </div>
            <div className="flex items-center text-xs sm:text-sm text-white/80">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-4 h-4 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-1.5 font-medium">4.9/5</span>
              </div>
              <span className="mx-2">•</span>
              <span>{language === 'en' ? 'Trusted by 5,000+ fishers' : 'Imeaminika na wavuvi 5,000+'}</span>
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center animate-fade-in px-4">
            <Button 
              variant="hero" 
              size="lg"
              onClick={() => setShowAuth(true)}
              className="group w-full sm:w-auto px-6 py-5 sm:py-6 text-sm sm:text-base font-medium"
            >
              <FishSymbol className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:scale-110 transition-transform" />
              {currentText.hero.fisherCta}
            </Button>
            
            <Button 
              variant="coastal" 
              size="lg"
              onClick={() => setShowAuth(true)}
              className="group w-full sm:w-auto px-6 py-5 sm:py-6 text-sm sm:text-base font-medium"
            >
              <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:scale-110 transition-transform" />
              {currentText.hero.buyerCta}
            </Button>
          </div>
        </div>
        
        {/* Floating particles effect - Reduced on mobile */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white/20 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
                opacity: '0.8'
              }}
            />
          ))}
        </div>
      </section>

      {/* Enhanced Features Section - Improved Responsiveness */}
      <section id="features" className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 bg-gradient-to-b from-white to-muted/30">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12 sm:mb-16 md:mb-20 px-4 animate-fade-in">
            <Badge className="mb-3 sm:mb-4 bg-primary/10 text-primary border-primary/20 px-3 py-1 sm:px-4 sm:py-1.5 text-xs sm:text-sm font-medium">
              <Lightning className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" />
              {language === 'en' ? 'POWERFUL FEATURES' : 'VIPENGELI VYA NGUVU'}
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              {currentText.features.title}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {language === 'en'
                ? 'Comprehensive digital solutions transforming Kenya\'s fishing industry'
                : 'Suluhu za kidijitali zinazobadilisha sekta ya uvuvi ya Kenya'
              }
            </p>
          </div>
          
          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-16 sm:mb-20 md:mb-24 px-4 sm:px-0">
            {/* Fisher Feature Card */}
            <div className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-white shadow-lg sm:shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2 border border-gray-100">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative p-6 sm:p-8">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-ocean rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-md sm:shadow-lg">
                  <FishSymbol className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                  {currentText.features.fisher.title}
                </h3>
                <p className="text-gray-600 mb-4 sm:mb-6 text-base sm:text-lg leading-relaxed">
                  {currentText.features.fisher.description}
                </p>
                <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                  {currentText.features.fisher.items.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <div className="flex-shrink-0 mt-1.5 sm:mt-1">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full mt-1.5 sm:mt-2"></div>
                      </div>
                      <span className="ml-3 text-sm sm:text-base text-gray-700 font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 sm:mt-8">
                  <Button 
                    variant="ocean" 
                    size="lg" 
                    className="w-full sm:w-auto px-6 py-5 sm:py-6 text-sm sm:text-base font-medium group-hover:scale-[1.02] transition-transform"
                    onClick={() => setShowAuth(true)}
                  >
                    <FishSymbol className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:animate-bounce" />
                    {language === 'en' ? 'Start Fishing Smarter' : 'Anza Kuvua Kwa Ujanja'}
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Buyer Feature Card */}
            <div className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-white shadow-lg sm:shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2 border border-gray-100">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative p-6 sm:p-8">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-sunset rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-md sm:shadow-lg">
                  <Users className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                  {currentText.features.buyer.title}
                </h3>
                <p className="text-gray-600 mb-4 sm:mb-6 text-base sm:text-lg leading-relaxed">
                  {currentText.features.buyer.description}
                </p>
                <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                  {currentText.features.buyer.items.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <div className="flex-shrink-0 mt-1.5 sm:mt-1">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-accent rounded-full mt-1.5 sm:mt-2"></div>
                      </div>
                      <span className="ml-3 text-sm sm:text-base text-gray-700 font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 sm:mt-8">
                  <Button 
                    variant="ocean" 
                    size="lg" 
                    className="w-full sm:w-auto px-6 py-5 sm:py-6 text-sm sm:text-base font-medium group-hover:scale-[1.02] transition-transform"
                    onClick={() => setShowAuth(true)}
                  >
                    <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:animate-bounce" />
                    {language === 'en' ? 'Explore Fresh Catches' : 'Gundua Samaki Safi'}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* How it Works Section - Enhanced Responsiveness */}
          <div id="how-it-works" className="text-center mb-12 sm:mb-16 md:mb-20 px-4 sm:px-6 animate-fade-in">
            <div className="max-w-4xl mx-auto">
              <Badge className="mb-3 sm:mb-4 bg-primary/10 text-primary border-primary/20 px-3 py-1 sm:px-4 sm:py-1.5 text-xs sm:text-sm font-medium">
                <Zap className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" />
                {language === 'en' ? 'SIMPLE STEPS' : 'HATUA RAHISI'}
              </Badge>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-primary">
                {language === 'en' ? 'How AquaLink Works' : 'Jinsi AquaLink Inavyofanya Kazi'}
              </h3>
              <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto mb-8 sm:mb-12 leading-relaxed">
                {language === 'en'
                  ? 'Simple, secure, and efficient - designed for everyone from feature phones to smartphones'
                  : 'Rahisi, salama, na ya ufanisi - imeundwa kwa kila mtu kutoka simu za kawaida hadi simu mahiri'
                }
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 max-w-6xl mx-auto px-4">
              {[
                {
                  step: "1",
                  title: language === 'en' ? 'Register & Verify' : 'Jisajili na Thibitisha',
                  description: language === 'en' 
                    ? 'Create your profile as a fisher or buyer. Verify your phone number and location.'
                    : 'Unda wasifu wako kama mvuvi au mnunuzi. Thibitisha nambari yako ya simu na eneo lako.',
                  icon: Users,
                  color: 'from-blue-500 to-blue-600'
                },
                {
                  step: "2", 
                  title: language === 'en' ? 'Connect & Trade' : 'Unganisha na Biashara',
                  description: language === 'en'
                    ? 'Post your catch or browse listings. Connect directly with trusted partners.'
                    : 'Chapisha uvuvi wako au vinjari orodha. Unganisha moja kwa moja na washirika wa kuaminiwa.',
                  icon: Fish,
                  color: 'from-teal-500 to-teal-600'
                },
                {
                  step: "3",
                  title: language === 'en' ? 'Secure Payment' : 'Malipo Salama',
                  description: language === 'en'
                    ? 'Complete transactions safely through M-Pesa integration with instant confirmations.'
                    : 'Maliza miamala kwa usalama kupitia uongezaji wa M-Pesa na uthibitisho wa haraka.',
                  icon: Shield,
                  color: 'from-green-500 to-green-600'
                }
              ].map((step, index) => (
                <div 
                  key={index}
                  className="group relative overflow-visible h-full"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Card className="h-full text-center transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1 border border-gray-100 bg-white/90">
                    <CardContent className="pt-16 pb-8 px-6 sm:px-8">
                      <div className={`absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform border-4 border-white`}>
                        <step.icon className="w-8 h-8 text-white" />
                        <div className="absolute -top-1 -right-1 w-7 h-7 bg-accent rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg border-2 border-white">
                          {step.step}
                        </div>
                      </div>
                      <div className="mt-6">
                        <h4 className="font-bold text-xl mb-3 text-gray-900">{step.title}</h4>
                        <p className="text-gray-700 leading-relaxed">{step.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats - Enhanced Responsiveness */}
      <section className="py-16 sm:py-20 bg-primary text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 animate-fade-in">
            <Badge className="mb-3 sm:mb-4 bg-white/20 text-white border-white/30 hover:bg-white/30 px-3 py-1 sm:px-4 sm:py-1.5 text-xs sm:text-sm font-medium">
              <Activity className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" />
              {language === 'en' ? 'OUR IMPACT' : 'ATHARI ZETU'}
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 text-white">
              {currentText.impact.title}
            </h2>
            <p className="text-base sm:text-lg md:text-xl opacity-90 max-w-3xl mx-auto leading-relaxed">
              {language === 'en'
                ? 'Real impact, real results - transforming lives across Kenya\'s fishing communities'
                : 'Athari halisi, matokeo halisi - kubadilisha maisha katika jamii za uvuvi za Kenya'
              }
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 text-center">
            {[
              { 
                value: '150+', 
                label: currentText.impact.communities,
                delay: '0s',
                icon: <MapPin className="w-5 h-5 sm:w-6 sm:h-6 mb-2 mx-auto opacity-80" />
              },
              { 
                value: '5,200+', 
                label: currentText.impact.fishers,
                delay: '0.1s',
                icon: <Users className="w-5 h-5 sm:w-6 sm:h-6 mb-2 mx-auto opacity-80" />
              },
              { 
                value: '12,000+', 
                label: currentText.impact.transactions,
                delay: '0.2s',
                icon: <Activity className="w-5 h-5 sm:w-6 sm:h-6 mb-2 mx-auto opacity-80" />
              },
              { 
                value: '98%', 
                label: language === 'en' ? 'User Satisfaction' : 'Kuridhika kwa Watumiaji',
                delay: '0.3s',
                icon: <Heart className="w-5 h-5 sm:w-6 sm:h-6 mb-2 mx-auto opacity-80" />
              }
            ].map((stat, index) => (
              <div 
                key={index} 
                className="group bg-white/5 backdrop-blur-sm rounded-xl p-4 sm:p-6 hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg animate-fade-in"
                style={{ animationDelay: stat.delay }}
              >
                <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 sm:mb-3 text-primary-glow group-hover:scale-105 transition-transform">
                  {stat.value}
                </div>
                {stat.icon}
                <p className="text-sm sm:text-base lg:text-lg opacity-90">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white/20 rounded-full animate-pulse"
              style={{
                left: `${10 + Math.random() * 80}%`,
                top: `${10 + Math.random() * 80}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
      </section>

      {/* Technology Features - Enhanced Responsiveness */}
      <section className="py-16 sm:py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 animate-fade-in">
            <Badge className="mb-3 sm:mb-4 bg-primary/10 text-primary border-primary/20 px-3 py-1 sm:px-4 sm:py-1.5 text-xs sm:text-sm font-medium">
              <BarChart className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" />
              {language === 'en' ? 'TECHNOLOGY STACK' : 'TEKNOLOJIA'}
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-primary">
              {language === 'en' ? 'Built for Everyone' : 'Imejengwa kwa Kila Mtu'}
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {language === 'en'
                ? 'From basic phones to smartphones, our platform works everywhere across Kenya'
                : 'Kutoka simu za kawaida hadi simu mahiri, jukwaa letu linafanya kazi popote Kenya'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-7xl mx-auto px-4">
            {[
              { 
                icon: MapPin,
                title: language === 'en' ? 'GPS Tracking' : 'Ufuatiliaji wa GPS',
                description: language === 'en' ? 'Real-time location services' : 'Huduma za eneo za wakati halisi',
                gradient: 'from-blue-500 to-blue-600',
                delay: '0s'
              },
              { 
                icon: Phone,
                title: language === 'en' ? 'Mobile First' : 'Simu ya Kwanza',
                description: language === 'en' ? 'Works on any device' : 'Inafanya kazi kwenye kifaa chochote',
                gradient: 'from-teal-500 to-teal-600',
                delay: '0.1s'
              },
              { 
                icon: GlobeIcon,
                title: language === 'en' ? 'Real-time Data' : 'Data ya Wakati Halisi',
                description: language === 'en' ? 'Live weather & market updates' : 'Hali ya hewa na masasisho ya soko ya moja kwa moja',
                gradient: 'from-purple-500 to-purple-600',
                delay: '0.2s'
              },
              { 
                icon: ShieldIcon,
                title: language === 'en' ? 'Secure Platform' : 'Jukwaa Salama',
                description: language === 'en' ? 'Bank-level security' : 'Usalama wa kiwango cha benki',
                gradient: 'from-green-500 to-green-600',
                delay: '0.3s'
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="group relative overflow-visible h-full"
                style={{ animationDelay: feature.delay }}
              >
                <Card className="h-full text-center transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1 border border-gray-100 bg-white/90">
                  <CardContent className="pt-16 pb-8 px-6">
                    <div className={`absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform border-4 border-white`}>
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="mt-6">
                      <h3 className="font-bold text-lg mb-3 text-gray-900">{feature.title}</h3>
                      <p className="text-gray-700 leading-relaxed">{feature.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
          
          {/* Decorative background elements */}
          <div className="absolute inset-0 -z-10 overflow-hidden opacity-10">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
            <div className="absolute -bottom-20 left-20 w-64 h-64 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
          </div>
        </div>
      </section>

      <Testimonials language={language} />
      
      <TrustIndicators language={language} />
      
      <CTASection language={language} onGetStarted={() => setShowAuth(true)} />
      
      <div id="support">
        <SupportSection language={language} />
      </div>

      {/* Enhanced Footer */}
      <footer id="about" className="bg-primary text-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Brand Column */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <FishSymbol className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">AquaLink Kenya</h3>
                  <p className="text-primary-glow text-sm">
                    {language === 'en' ? 'Empowering Coastal Communities' : 'Kuwezesha Jamii za Pwani'}
                  </p>
                </div>
              </div>
              <p className="text-white/80 leading-relaxed mb-6 max-w-md">
                {language === 'en'
                  ? 'Connecting Kenya\'s fishing communities through technology, promoting sustainable practices, and creating economic opportunities for fishers and buyers across the country.'
                  : 'Kuunganisha jamii za uvuvi za Kenya kupitia teknolojia, kukuza mazoea endelevu, na kuunda fursa za kiuchumi kwa wavuvi na wanunuzi kote nchini.'
                }
              </p>
              <div className="flex items-center space-x-2">
                <Heart className="w-4 h-4 text-accent" />
                <span className="text-sm text-white/80">
                  {language === 'en' 
                    ? 'Built with love for Kenya\'s fishing communities' 
                    : 'Imejengwa kwa upendo kwa jamii za uvuvi za Kenya'
                  }
                </span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-lg mb-4">
                {language === 'en' ? 'Quick Links' : 'Viungo vya Haraka'}
              </h4>
              <ul className="space-y-3 text-white/80">
                <li>
                  <button className="hover:text-white transition-colors text-left">
                    {language === 'en' ? 'How it Works' : 'Jinsi Inavyofanya Kazi'}
                  </button>
                </li>
                <li>
                  <button className="hover:text-white transition-colors text-left">
                    {language === 'en' ? 'For Fishers' : 'Kwa Wavuvi'}
                  </button>
                </li>
                <li>
                  <button className="hover:text-white transition-colors text-left">
                    {language === 'en' ? 'For Buyers' : 'Kwa Wanunuzi'}
                  </button>
                </li>
                <li>
                  <button className="hover:text-white transition-colors text-left">
                    {language === 'en' ? 'Support' : 'Msaada'}
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-semibold text-lg mb-4">
                {language === 'en' ? 'Contact Us' : 'Wasiliana Nasi'}
              </h4>
              <div className="space-y-3 text-white/80 text-sm">
                <div>
                  <p className="font-medium text-white">
                    {language === 'en' ? 'Phone' : 'Simu'}
                  </p>
                  <p>+254741253317</p>
                </div>
                <div>
                  <p className="font-medium text-white">
                    {language === 'en' ? 'Email' : 'Barua Pepe'}
                  </p>
                  <p>support@aqualink.co.ke</p>
                </div>
                <div>
                  <p className="font-medium text-white">
                    {language === 'en' ? 'Address' : 'Anwani'}
                  </p>
                  <p>Mombasa Marine Center<br />Kilifi Road, Mombasa</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/20 pt-8 text-center">
            <p className="text-white/70 text-sm">
              © 2025 AquaLink Kenya. {language === 'en' ? 'All rights reserved.' : 'Haki zote zimehifadhiwa.'} | 
              <span className="ml-2">
                {language === 'en' ? 'Privacy Policy' : 'Sera ya Faragha'} • {language === 'en' ? 'Terms of Service' : 'Masharti ya Huduma'}
              </span>
            </p>
          </div>
        </div>
      </footer>

      <AuthModal open={showAuth} onOpenChange={setShowAuth} language={language} />
    </div>
  );
};

export default Index;