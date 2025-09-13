import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ChevronRight, Sparkles, Users } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CTASectionProps {
  language: 'en' | 'sw';
  onGetStarted: () => void;
}

const CTASection = ({ language, onGetStarted }: CTASectionProps) => {
  interface ContentType {
    badge: string;
    title: string;
    subtitle: string;
    description: string;
    stats: { number: string; label: string }[];
    fisherCta: string;
    buyerCta: string;
  }

  const content: Record<string, ContentType> = {
    en: {
      badge: "Join the Revolution",
      title: "Ready to Transform Your Fishing Business?",
      subtitle: "Join thousands of fishers and buyers who are already benefiting from AquaLink Kenya's digital marketplace.",
      description: "Whether you're a fisher looking to increase your income or a buyer seeking fresh, sustainable catch, AquaLink Kenya provides the tools and connections you need to succeed.",
      stats: [
        { number: "5,200+", label: "Active Fishers" },
        { number: "1,800+", label: "Verified Buyers" },
        { number: "150+", label: "Communities Served" }
      ],
      fisherCta: "Start as Fisher",
      buyerCta: "Start as Buyer"
    },
    sw: {
      badge: "Jiunge na Mapinduzi",
      title: "Uko Tayari Kubadilisha Biashara Yako ya Uvuvi?",
      subtitle: "Jiunge na maelfu ya wavuvi na wanunuzi ambao tayari wananufaika na soko la kidijitali la AquaLink Kenya.",
      description: "Iwe wewe ni mvuvi anayetafuta kuongeza mapato yako au mnunuzi anayetafuta samaki safi, endelevu, AquaLink Kenya inatoa zana na miunganisho unayohitaji kufanikiwa.",
      stats: [
        { number: "5,200+", label: "Wavuvi Hai" },
        { number: "1,800+", label: "Wanunuzi Waliothibitishwa" },
        { number: "150+", label: "Jamii Zinazotumiwa" }
      ],
      fisherCta: "Anza kama Mvuvi",
      buyerCta: "Anza kama Mnunuzi"
    }
  };

  const currentContent = content[language];

  return (
    <section className="relative py-24 px-6 bg-gradient-to-br from-blue-900 via-blue-800 to-teal-900 text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-500/10 rounded-full mix-blend-screen blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-teal-500/10 rounded-full mix-blend-screen blur-3xl"></div>
        
        {/* Animated grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div 
            className="absolute inset-0" 
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
              backgroundSize: '60px 60px'
            }}
          />
        </div>
      </div>

      <div className="max-w-6xl mx-auto text-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <Badge className="mb-6 bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-md px-4 py-1.5 text-sm font-medium">
            <Sparkles className="w-4 h-4 mr-2 text-yellow-300" />
            {currentContent.badge}
          </Badge>
          
          <h2 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100 leading-tight">
            {currentContent.title}
          </h2>
          
          <p className="text-xl md:text-2xl text-blue-100 max-w-4xl mx-auto leading-relaxed">
            {currentContent.subtitle}
          </p>
          
          <p className="text-lg text-blue-100/80 max-w-3xl mx-auto leading-relaxed">
            {currentContent.description}
          </p>
          
          {/* Social Proof */}
          <div className="flex items-center justify-center gap-3 pt-4">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div 
                  key={i}
                  className="w-8 h-8 rounded-full bg-white/20 border-2 border-blue-900"
                  style={{
                    backgroundImage: `url(https://randomuser.me/api/portraits/${i % 2 === 0 ? 'men' : 'women'}/${i}0.jpg)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                />
              ))}
            </div>
            <div className="text-left">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg key={i} className="w-4 h-4 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-xs text-blue-100/70 mt-0.5">
                {language === 'en' ? 'Trusted by 7,000+ users' : 'Imeaminika na watumiaji 7,000+'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Animated Stats Row */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-8 my-16"
        >
          {currentContent.stats.map((stat, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-blue-300/30 transition-all duration-300 group"
            >
              <div className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-teal-300 mb-3">
                {stat.number}
              </div>
              <p className="text-blue-100/80 text-sm md:text-base font-medium">{stat.label}</p>
              <div className="mt-4 h-1 w-12 bg-gradient-to-r from-blue-400 to-teal-400 rounded-full group-hover:w-16 transition-all duration-500"></div>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced CTA Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-8"
        >
          <Button 
            variant="ghost"
            size="lg"
            onClick={onGetStarted}
            className={cn(
              "group relative overflow-hidden px-8 py-6 text-lg font-medium text-white",
              "bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600",
              "rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300",
              "hover:-translate-y-0.5 transform"
            )}
          >
            <span className="relative z-10 flex items-center">
              {language === 'en' ? 'Get Started' : 'Anza Sasa'}
              <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </Button>
          
          <Button 
            variant="outline"
            size="lg"
            className={cn(
              "group relative overflow-hidden px-8 py-6 text-lg font-medium",
              "bg-transparent text-white border-white/20 hover:bg-white/5 hover:border-white/30",
              "rounded-xl hover:shadow-lg transition-all duration-300",
              "hover:-translate-y-0.5 transform"
            )}
          >
            <span className="relative z-10 flex items-center">
              {language === 'en' ? 'Learn More' : 'Jifunze Zaidi'}
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </span>
          </Button>
        </motion.div>
        
        {/* Trust Badges */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 pt-8 border-t border-white/10"
        >
          <p className="text-sm text-blue-100/70 mb-4">
            {language === 'en' ? 'Trusted by leading organizations' : 'Imeaminika na mashirika ya kiongozi'}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-6 opacity-80">
            {['🔒', '🌍', '🏆', '💯'].map((icon, i) => (
              <div key={i} className="text-2xl hover:scale-110 transition-transform">
                {icon}
              </div>
            ))}
          </div>
        </motion.div>
        
        {/* Trust Message */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 text-sm opacity-70"
        >
          {language === 'en' 
            ? 'Join today and start building sustainable fishing partnerships across Kenya' 
            : 'Jiunge leo na uanze kujenga ushirikiano endelevu wa uvuvi kote Kenya'
          }
        </motion.p>
      </div>
    </section>
  );
};

export default CTASection;