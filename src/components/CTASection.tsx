import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Fish, Users, Waves } from "lucide-react";

interface CTASectionProps {
  language: 'en' | 'sw';
  onGetStarted: () => void;
}

const CTASection = ({ language, onGetStarted }: CTASectionProps) => {
  const content = {
    en: {
      badge: "Join the Revolution",
      title: "Ready to Transform Your Fishing Business?",
      subtitle: "Join thousands of fishers and buyers who are already benefiting from AquaNet Kenya's digital marketplace.",
      description: "Whether you're a fisher looking to increase your income or a buyer seeking fresh, sustainable catch, AquaNet Kenya provides the tools and connections you need to succeed.",
      fisherCta: "Start as Fisher",
      buyerCta: "Start as Buyer",
      stats: [
        { number: "5,200+", label: "Active Fishers" },
        { number: "1,800+", label: "Verified Buyers" },
        { number: "150+", label: "Communities Served" }
      ]
    },
    sw: {
      badge: "Jiunge na Mapinduzi",
      title: "Uko Tayari Kubadilisha Biashara Yako ya Uvuvi?",
      subtitle: "Jiunge na maelfu ya wavuvi na wanunuzi ambao tayari wananufaika na soko la kidijitali la AquaNet Kenya.",
      description: "Iwe wewe ni mvuvi anayetafuta kuongeza mapato yako au mnunuzi anayetafuta samaki safi, endelevu, AquaNet Kenya inatoa zana na miunganisho unayohitaji kufanikiwa.",
      fisherCta: "Anza kama Mvuvi",
      buyerCta: "Anza kama Mnunuzi",
      stats: [
        { number: "5,200+", label: "Wavuvi Hai" },
        { number: "1,800+", label: "Wanunuzi Waliothibitishwa" },
        { number: "150+", label: "Jamii Zinazotumiwa" }
      ]
    }
  };

  const currentContent = content[language];

  return (
    <section className="py-20 px-6 bg-gradient-ocean text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 animate-float">
          <Waves className="w-20 h-20" />
        </div>
        <div className="absolute top-1/3 right-20 animate-float" style={{ animationDelay: '1s' }}>
          <Fish className="w-16 h-16" />
        </div>
        <div className="absolute bottom-20 left-1/4 animate-float" style={{ animationDelay: '2s' }}>
          <Users className="w-12 h-12" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto text-center relative z-10">
        <div className="animate-fade-in">
          <Badge className="mb-6 bg-white/20 text-white border-white/30 hover:bg-white/30">
            <Waves className="w-4 h-4 mr-2" />
            {currentContent.badge}
          </Badge>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            {currentContent.title}
          </h2>
          
          <p className="text-xl md:text-2xl mb-6 opacity-90 max-w-4xl mx-auto">
            {currentContent.subtitle}
          </p>
          
          <p className="text-lg mb-12 opacity-80 max-w-3xl mx-auto leading-relaxed">
            {currentContent.description}
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid md:grid-cols-3 gap-8 mb-12 animate-fade-in">
          {currentContent.stats.map((stat, index) => (
            <div 
              key={index} 
              className="text-center group hover:scale-105 transition-transform duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-3xl md:text-4xl font-bold text-primary-glow mb-2 group-hover:scale-110 transition-transform">
                {stat.number}
              </div>
              <p className="text-sm md:text-base opacity-80">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in">
          <Button 
            variant="hero" 
            size="lg"
            onClick={onGetStarted}
            className="group bg-white text-primary hover:bg-white/90 hover:shadow-floating text-lg px-8 py-4"
          >
            <Fish className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
            {currentContent.fisherCta}
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            onClick={onGetStarted}
            className="group border-white/30 text-white hover:bg-white hover:text-primary text-lg px-8 py-4"
          >
            <Users className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
            {currentContent.buyerCta}
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {/* Trust Message */}
        <p className="mt-8 text-sm opacity-70 animate-fade-in">
          {language === 'en' 
            ? 'Join today and start building sustainable fishing partnerships across Kenya' 
            : 'Jiunge leo na uanze kujenga ushirikiano endelevu wa uvuvi kote Kenya'
          }
        </p>
      </div>
    </section>
  );
};

export default CTASection;