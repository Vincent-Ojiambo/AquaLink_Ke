import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Quote, Star, MapPin } from "lucide-react";

interface TestimonialsProps {
  language: 'en' | 'sw';
}

const Testimonials = ({ language }: TestimonialsProps) => {
  const testimonials = {
    en: [
      {
        name: "Hassan Mwalimu",
        role: "Fisher from Lamu",
        location: "Lamu County",
        content: "AquaNet has revolutionized my fishing business. I can now connect directly with buyers and get fair prices for my catch. The weather alerts have helped me avoid dangerous storms.",
        rating: 5,
        avatar: "👨🏿‍🦳"
      },
      {
        name: "Grace Wanjiku",
        role: "Fish Buyer",
        location: "Nairobi",
        content: "The quality assurance and direct connection to fishers means I always get the freshest fish for my restaurant. The platform has made sourcing incredibly efficient.",
        rating: 5,
        avatar: "👩🏿‍💼"
      },
      {
        name: "John Otieno",
        role: "Lake Victoria Fisher",
        location: "Kisumu",
        content: "Being able to log my daily catch and access sustainable fishing tips has improved both my income and conservation efforts. This platform is a game-changer.",
        rating: 5,
        avatar: "👨🏿‍🌾"
      }
    ],
    sw: [
      {
        name: "Hassan Mwalimu",
        role: "Mvuvi kutoka Lamu",
        location: "Kaunti ya Lamu",
        content: "AquaNet imebadilisha biashara yangu ya uvuvi. Sasa ninaweza kuungana moja kwa moja na wanunuzi na kupata bei nzuri kwa samaki zangu. Tahadhari za hali ya hewa zimenanisaidia kuepuka dhoruba hatari.",
        rating: 5,
        avatar: "👨🏿‍🦳"
      },
      {
        name: "Grace Wanjiku",
        role: "Mnunuzi wa Samaki",
        location: "Nairobi",
        content: "Uhakikishaji wa ubora na muunganisho wa moja kwa moja na wavuvi kunamaanisha daima napata samaki safi kwa mkahawa wangu. Jukwaa limefanya utafutaji kuwa wa ufanisi sana.",
        rating: 5,
        avatar: "👩🏿‍💼"
      },
      {
        name: "John Otieno",
        role: "Mvuvi wa Ziwa Victoria",
        location: "Kisumu",
        content: "Kuweza kuandika uvuvi wangu wa kila siku na kupata vidokezo vya uvuvi endelevu kumeboresha mapato yangu na juhudi za uhifadhi. Jukwaa hili ni la kubadilisha mazingira.",
        rating: 5,
        avatar: "👨🏿‍🌾"
      }
    ]
  };

  const currentTestimonials = testimonials[language];

  return (
    <section className="py-20 px-6 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            <Quote className="w-4 h-4 mr-2" />
            {language === 'en' ? 'Testimonials' : 'Ushuhuda'}
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
            {language === 'en' 
              ? 'Trusted by Kenya\'s Fishing Communities' 
              : 'Inaaminiwa na Jamii za Uvuvi za Kenya'
            }
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {language === 'en'
              ? 'See how AquaNet is transforming lives and businesses across Kenya\'s coastal and inland fishing communities'
              : 'Tazama jinsi AquaNet inavyobadilisha maisha na biashara kote katika jamii za uvuvi za pwani na ndani ya Kenya'
            }
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {currentTestimonials.map((testimonial, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-ocean transition-all duration-300 hover:-translate-y-2 animate-fade-in border-l-4 border-l-primary"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="text-3xl mr-3">{testimonial.avatar}</div>
                  <div>
                    <h4 className="font-semibold text-lg">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    <div className="flex items-center mt-1">
                      <MapPin className="w-3 h-3 mr-1 text-primary" />
                      <span className="text-xs text-muted-foreground">{testimonial.location}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
                
                <blockquote className="text-sm leading-relaxed text-muted-foreground italic">
                  "{testimonial.content}"
                </blockquote>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;