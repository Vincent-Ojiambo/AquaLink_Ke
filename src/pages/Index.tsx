import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Fish, Users, MapPin, Smartphone, Globe, Shield, Waves, Heart, BarChart3, Clock, Zap } from "lucide-react";
import heroImage from "../assets/hero-ocean.jpg";
import AuthModal from "@/components/AuthModal";
import Navigation from "@/components/Navigation";
import Testimonials from "@/components/Testimonials";
import SupportSection from "@/components/SupportSection";
import TrustIndicators from "@/components/TrustIndicators";
import CTASection from "@/components/CTASection";

const Index = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [language, setLanguage] = useState<'en' | 'sw'>('en');

  const text = {
    en: {
      hero: {
        title: "AquaNet Kenya",
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
        title: "AquaNet Kenya",
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
      
      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden -mt-16">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/60 to-transparent" />
        
        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center text-white pt-16">
          <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30 animate-fade-in">
            <Waves className="w-4 h-4 mr-2" />
            {language === 'en' ? 'Sustainable Fishing Platform' : 'Jukwaa la Uvuvi Endelevu'}
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-primary-glow bg-clip-text text-transparent animate-fade-in">
            {currentText.hero.title}
          </h1>
          
          <p className="text-xl md:text-2xl mb-4 font-medium animate-fade-in">
            {currentText.hero.subtitle}
          </p>
          
          <p className="text-lg mb-12 max-w-3xl mx-auto opacity-90 animate-fade-in">
            {currentText.hero.description}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Button 
              variant="hero" 
              size="lg"
              onClick={() => setShowAuth(true)}
              className="group"
            >
              <Fish className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              {currentText.hero.fisherCta}
            </Button>
            
            <Button 
              variant="coastal" 
              size="lg"
              onClick={() => setShowAuth(true)}
              className="group"
            >
              <Users className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              {currentText.hero.buyerCta}
            </Button>
          </div>
        </div>
        
        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <Zap className="w-4 h-4 mr-2" />
              {language === 'en' ? 'Core Features' : 'Vipengele Muhimu'}
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
              {currentText.features.title}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {language === 'en'
                ? 'Comprehensive tools designed specifically for Kenya\'s fishing industry'
                : 'Zana za kina zilizoundwa maalum kwa sekta ya uvuvi ya Kenya'
              }
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            <Card className="group hover:shadow-ocean transition-all duration-300 hover:-translate-y-2 animate-fade-in">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-ocean rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Fish className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-2xl">{currentText.features.fisher.title}</CardTitle>
                <CardDescription className="text-lg">
                  {currentText.features.fisher.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {currentText.features.fisher.items.map((item, index) => (
                    <li key={index} className="flex items-center">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            
            <Card className="group hover:shadow-ocean transition-all duration-300 hover:-translate-y-2 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-sunset rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-2xl">{currentText.features.buyer.title}</CardTitle>
                <CardDescription className="text-lg">
                  {currentText.features.buyer.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {currentText.features.buyer.items.map((item, index) => (
                    <li key={index} className="flex items-center">
                      <div className="w-2 h-2 bg-accent rounded-full mr-3" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* How it Works Section */}
          <div id="how-it-works" className="text-center mb-16 animate-fade-in">
            <h3 className="text-3xl md:text-4xl font-bold mb-4 text-primary">
              {language === 'en' ? 'How AquaNet Works' : 'Jinsi AquaNet Inavyofanya Kazi'}
            </h3>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-12">
              {language === 'en'
                ? 'Simple, secure, and efficient - designed for everyone from feature phones to smartphones'
                : 'Rahisi, salama, na ya ufanisi - imeundwa kwa kila mtu kutoka simu za kawaida hadi simu mahiri'
              }
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: language === 'en' ? 'Register & Verify' : 'Jisajili na Thibitisha',
                description: language === 'en' 
                  ? 'Create your profile as a fisher or buyer. Verify your phone number and location.'
                  : 'Unda wasifu wako kama mvuvi au mnunuzi. Thibitisha nambari yako ya simu na eneo lako.',
                icon: Users
              },
              {
                step: "2", 
                title: language === 'en' ? 'Connect & Trade' : 'Unganisha na Biashara',
                description: language === 'en'
                  ? 'Post your catch or browse listings. Connect directly with trusted partners.'
                  : 'Chapisha uvuvi wako au vinjari orodha. Unganisha moja kwa moja na washirika wa kuaminiwa.',
                icon: Fish
              },
              {
                step: "3",
                title: language === 'en' ? 'Secure Payment' : 'Malipo Salama',
                description: language === 'en'
                  ? 'Complete transactions safely through M-Pesa integration with instant confirmations.'
                  : 'Maliza miamala kwa usalama kupitia uongezaji wa M-Pesa na uthibitisho wa haraka.',
                icon: Shield
              }
            ].map((step, index) => (
              <Card 
                key={index} 
                className="text-center group hover:shadow-ocean transition-all duration-300 hover:-translate-y-1 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-gradient-ocean rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform relative">
                    <step.icon className="w-8 h-8 text-white" />
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {step.step}
                    </div>
                  </div>
                  <h4 className="font-semibold text-lg mb-3">{step.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {currentText.impact.title}
            </h2>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              {language === 'en'
                ? 'Real impact, real results - transforming lives across Kenya\'s fishing communities'
                : 'Athari halisi, matokeo halisi - kubadilisha maisha katika jamii za uvuvi za Kenya'
              }
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="group animate-fade-in">
              <div className="text-4xl md:text-6xl font-bold mb-2 text-primary-glow group-hover:scale-110 transition-transform">
                150+
              </div>
              <p className="text-xl opacity-90">{currentText.impact.communities}</p>
            </div>
            
            <div className="group animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="text-4xl md:text-6xl font-bold mb-2 text-primary-glow group-hover:scale-110 transition-transform">
                5,200+
              </div>
              <p className="text-xl opacity-90">{currentText.impact.fishers}</p>
            </div>
            
            <div className="group animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="text-4xl md:text-6xl font-bold mb-2 text-primary-glow group-hover:scale-110 transition-transform">
                12,000+
              </div>
              <p className="text-xl opacity-90">{currentText.impact.transactions}</p>
            </div>

            <div className="group animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="text-4xl md:text-6xl font-bold mb-2 text-primary-glow group-hover:scale-110 transition-transform">
                98%
              </div>
              <p className="text-xl opacity-90">
                {language === 'en' ? 'User Satisfaction' : 'Kuridhika kwa Watumiaji'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Features */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <BarChart3 className="w-4 h-4 mr-2" />
              {language === 'en' ? 'Technology Stack' : 'Teknolojia'}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">
              {language === 'en' ? 'Built for Everyone' : 'Imejengwa kwa Kila Mtu'}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {language === 'en'
                ? 'From basic phones to smartphones, our platform works everywhere across Kenya'
                : 'Kutoka simu za kawaida hadi simu mahiri, jukwaa letu linafanya kazi popote Kenya'
              }
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { 
                icon: MapPin, 
                title: language === 'en' ? 'GPS Tracking' : 'Ufuatiliaji wa GPS',
                description: language === 'en' ? 'Real-time location services' : 'Huduma za eneo za wakati halisi'
              },
              { 
                icon: Smartphone, 
                title: language === 'en' ? 'Mobile First' : 'Simu ya Kwanza',
                description: language === 'en' ? 'Works on any device' : 'Inafanya kazi kwenye kifaa chochote'
              },
              { 
                icon: Globe, 
                title: language === 'en' ? 'Real-time Data' : 'Data ya Wakati Halisi',
                description: language === 'en' ? 'Live weather & market updates' : 'Hali ya hewa na masasisho ya soko ya moja kwa moja'
              },
              { 
                icon: Shield, 
                title: language === 'en' ? 'Secure Platform' : 'Jukwaa Salama',
                description: language === 'en' ? 'Bank-level security' : 'Usalama wa kiwango cha benki'
              }
            ].map((feature, index) => (
              <Card 
                key={index} 
                className="text-center group hover:shadow-ocean transition-all duration-300 hover:-translate-y-1 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-gradient-ocean rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
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
                  <Fish className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">AquaNet Kenya</h3>
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
                  <p>+254 700 123 456</p>
                </div>
                <div>
                  <p className="font-medium text-white">
                    {language === 'en' ? 'Email' : 'Barua Pepe'}
                  </p>
                  <p>support@aquanet.co.ke</p>
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
              © 2024 AquaNet Kenya. {language === 'en' ? 'All rights reserved.' : 'Haki zote zimehifadhiwa.'} | 
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