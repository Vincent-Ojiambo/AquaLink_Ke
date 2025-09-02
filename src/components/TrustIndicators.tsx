import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Award, Users, Zap, Lock, Globe, Phone, Wifi } from "lucide-react";

interface TrustIndicatorsProps {
  language: 'en' | 'sw';
}

const TrustIndicators = ({ language }: TrustIndicatorsProps) => {
  const content = {
    en: {
      title: "Trusted & Secure Platform",
      subtitle: "AquaNet Kenya meets the highest standards for security, reliability, and performance",
      indicators: [
        {
          icon: Shield,
          title: "Bank-Level Security",
          description: "256-bit SSL encryption and secure data handling"
        },
        {
          icon: Award,
          title: "Government Certified",
          description: "Approved by Kenya Marine & Fisheries Research Institute"
        },
        {
          icon: Users,
          title: "Community Verified",
          description: "Trusted by 5,000+ fishers across Kenya"
        },
        {
          icon: Phone,
          title: "24/7 Support",
          description: "Round-the-clock assistance in English & Swahili"
        },
        {
          icon: Zap,
          title: "99.9% Uptime",
          description: "Reliable platform you can count on"
        },
        {
          icon: Wifi,
          title: "Offline Capable",
          description: "Works even with poor internet connectivity"
        }
      ],
      partnerships: {
        title: "Trusted Partners",
        subtitle: "Working with leading organizations to serve Kenya's fishing communities"
      }
    },
    sw: {
      title: "Jukwaa la Kuaminiwa na Salama",
      subtitle: "AquaNet Kenya inakutana na viwango vya juu vya usalama, kuaminika, na utendaji",
      indicators: [
        {
          icon: Shield,
          title: "Usalama wa Kiwango cha Benki",
          description: "Usimbaji wa SSL wa 256-bit na utunzaji salama wa data"
        },
        {
          icon: Award,
          title: "Hati ya Serikali",
          description: "Imeidhinishwa na Taasisi ya Utafiti wa Bahari na Uvuvi ya Kenya"
        },
        {
          icon: Users,
          title: "Imethibitishwa na Jamii",
          description: "Inaaminiwa na wavuvi 5,000+ kote Kenya"
        },
        {
          icon: Phone,
          title: "Msaada wa Masaa 24/7",
          description: "Msaada wa mzunguko kamili kwa Kiingereza na Kiswahili"
        },
        {
          icon: Zap,
          title: "Kupatikana kwa 99.9%",
          description: "Jukwaa la kuaminika unaloweza kutegemea"
        },
        {
          icon: Wifi,
          title: "Inaweza Kutumika Nje ya Mtandao",
          description: "Inafanya kazi hata na muunganisho mbaya wa intaneti"
        }
      ],
      partnerships: {
        title: "Washirika wa Kuaminiwa",
        subtitle: "Kufanya kazi na mashirika ya kiongozi kutumikia jamii za uvuvi za Kenya"
      }
    }
  };

  const currentContent = content[language];

  const partnerLogos = [
    { name: "Kenya Marine Institute", logo: "🏛️" },
    { name: "M-Pesa", logo: "💳" },
    { name: "Safaricom", logo: "📱" },
    { name: "Kenya Fisheries Service", logo: "🐟" },
    { name: "UN Sustainable Development", logo: "🌍" },
    { name: "World Bank", logo: "🏦" }
  ];

  return (
    <section className="py-20 px-6 bg-primary text-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {currentContent.title}
          </h2>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            {currentContent.subtitle}
          </p>
        </div>

        {/* Trust Indicators Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {currentContent.indicators.map((indicator, index) => (
            <Card 
              key={index} 
              className="bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-300 hover:-translate-y-1 group animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <indicator.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2 text-white">{indicator.title}</h3>
                <p className="text-sm text-white/80">{indicator.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Partnerships Section */}
        <div className="text-center animate-fade-in">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            {currentContent.partnerships.title}
          </h3>
          <p className="text-lg opacity-90 mb-12 max-w-3xl mx-auto">
            {currentContent.partnerships.subtitle}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
            {partnerLogos.map((partner, index) => (
              <div 
                key={index} 
                className="group text-center hover:scale-110 transition-transform duration-300 animate-float"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                  {partner.logo}
                </div>
                <p className="text-xs text-white/60 group-hover:text-white/80 transition-colors">
                  {partner.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Security Badges */}
        <div className="flex justify-center items-center gap-8 mt-16 animate-fade-in">
          <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
            <Lock className="w-4 h-4 mr-2" />
            {language === 'en' ? 'SSL Secured' : 'SSL Salama'}
          </Badge>
          <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
            <Shield className="w-4 h-4 mr-2" />
            {language === 'en' ? 'Data Protected' : 'Data Inalindwa'}
          </Badge>
          <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
            <Globe className="w-4 h-4 mr-2" />
            {language === 'en' ? 'GDPR Compliant' : 'GDPR Inafuata'}
          </Badge>
        </div>
      </div>
    </section>
  );
};

export default TrustIndicators;