import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Quote, Star, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

interface Testimonial {
  name: string;
  role: string;
  location: string;
  content: string;
  rating: number;
  image: string;
}

interface TestimonialsProps {
  language: 'en' | 'sw';
}

const Testimonials = ({ language }: TestimonialsProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Determine screen size for responsive design
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
      setIsTablet(window.innerWidth >= 640 && window.innerWidth < 1024);
    };

    // Set initial values
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate number of testimonials to show based on screen size
  const getVisibleTestimonials = () => {
    if (isMobile) return 1;
    if (isTablet) return 2;
    return 3; // Desktop
  };

  // Using placeholder images from Unsplash (replace with actual user images in production)
  const testimonials = {
    en: [
      {
        name: "Hassan Mwalimu",
        role: "Fisher from Lamu",
        location: "Lamu County",
        content: "AquaLink has revolutionized my fishing business. I can now connect directly with buyers and get fair prices for my catch. The weather alerts have helped me avoid dangerous storms.",
        rating: 5,
        image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=300&auto=format&fit=crop"
      },
      {
        name: "Grace Wanjiku",
        role: "Fish Buyer",
        location: "Nairobi",
        content: "The quality assurance and direct connection to fishers means I always get the freshest fish for my restaurant. The platform has made sourcing incredibly efficient.",
        rating: 5,
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop"
      },
      {
        name: "John Otieno",
        role: "Lake Victoria Fisher",
        location: "Kisumu",
        content: "Being able to log my daily catch and access sustainable fishing tips has improved both my income and conservation efforts. This platform is a game-changer.",
        rating: 5,
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop"
      }
    ],
    sw: [
      {
        name: "Hassan Mwalimu",
        role: "Mvuvi kutoka Lamu",
        location: "Kaunti ya Lamu",
        content: "AquaLink imebadilisha biashara yangu ya uvuvi. Sasa ninaweza kuungana moja kwa moja na wanunuzi na kupata bei nzuri kwa samaki zangu. Tahadhari za hali ya hewa zimenanisaidia kuepuka dhoruba hatari.",
        rating: 5,
        image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=300&auto=format&fit=crop"
      },
      {
        name: "Grace Wanjiku",
        role: "Mnunuzi wa Samaki",
        location: "Nairobi",
        content: "Uhakikishaji wa ubora na muunganisho wa moja kwa moja na wavuvi kunamaanisha daima napata samaki safi kwa mkahawa wangu. Jukwaa limefanya utafutaji kuwa wa ufanisi sana.",
        rating: 5,
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop"
      },
      {
        name: "John Otieno",
        role: "Mvuvi wa Ziwa Victoria",
        location: "Kisumu",
        content: "Kuweza kuandika uvuvi wangu wa kila siku na kupata vidokezo vya uvuvi endelevu kumeboresha mapato yangu na juhudi za uhifadhi. Jukwaa hili ni la kubadilisha mazingira.",
        rating: 5,
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop"
      }
    ]
  };

  const currentTestimonials = testimonials[language];
  const visibleCount = getVisibleTestimonials();
  const totalTestimonials = currentTestimonials.length;
  const maxIndex = Math.max(0, totalTestimonials - visibleCount);

  // Navigation functions
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex >= maxIndex ? 0 : prevIndex + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex <= 0 ? maxIndex : prevIndex - 1));
  };

  // Auto-rotate testimonials
  useEffect(() => {
    if (!isMobile && !isHovered) {
      const timer = setInterval(() => {
        nextSlide();
      }, 8000);
      return () => clearInterval(timer);
    }
  }, [currentIndex, isMobile, isHovered]);

  // Get currently visible testimonials
  const visibleTestimonials = currentTestimonials.slice(
    currentIndex,
    currentIndex + visibleCount
  );

  // If we're at the end and need to wrap around
  if (currentIndex + visibleCount > totalTestimonials) {
    const remaining = visibleCount - (totalTestimonials - currentIndex);
    visibleTestimonials.push(...currentTestimonials.slice(0, remaining));
  }

  // Generate pagination dots
  const totalDots = Math.ceil(totalTestimonials / visibleCount);
  const currentDot = Math.floor(currentIndex / visibleCount);

  return (
    <section 
      className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-muted/30 relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="max-w-7xl mx-auto relative">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 animate-fade-in px-2">
          <Badge className="mb-3 sm:mb-4 bg-primary/10 text-primary border-primary/20 text-xs sm:text-sm font-medium px-3 py-1 sm:px-4 sm:py-1.5">
            <Quote className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" />
            {language === 'en' ? 'TESTIMONIALS' : 'USHUHUDA'}
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-primary">
            {language === 'en' 
              ? 'Trusted by Kenya\'s Fishing Communities' 
              : 'Inaaminiwa na Jamii za Uvuvi za Kenya'
            }
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {language === 'en'
              ? 'See how AquaLink is transforming lives and businesses across Kenya\'s fishing communities'
              : 'Tazama jinsi AquaLink inavyobadilisha maisha na biashara kote katika jamii za uvuvi za Kenya'
            }
          </p>
        </div>

        {/* Navigation Arrows - Desktop */}
        {!isMobile && (
          <>
            <button 
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white shadow-lg text-primary hover:bg-primary/10 transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary/50"
              aria-label={language === 'en' ? 'Previous testimonial' : 'Ushuhuda uliopita'}
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button 
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white shadow-lg text-primary hover:bg-primary/10 transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary/50"
              aria-label={language === 'en' ? 'Next testimonial' : 'Ushuhuda ujao'}
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </>
        )}

        {/* Testimonials Grid */}
        <div className="relative">
          <div 
            className="grid grid-flow-col auto-cols-[100%] sm:auto-cols-[calc(50%-1rem)] lg:auto-cols-[calc(33.333%-1.5rem)] gap-4 sm:gap-6 lg:gap-8 overflow-x-auto snap-x snap-mandatory scrollbar-hide"
            style={{
              scrollSnapType: isMobile ? 'x mandatory' : 'none',
              gridAutoColumns: isMobile ? '100%' : isTablet ? 'calc(50% - 0.5rem)' : 'calc(33.333% - 1rem)'
            }}
          >
            {visibleTestimonials.map((testimonial, index) => (
              <div 
                key={`${testimonial.name}-${index}`}
                className="snap-center"
              >
                <Card 
                  className="group h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-gray-100 bg-white/80 backdrop-blur-sm overflow-hidden"
                >
                  <div className="relative h-32 sm:h-36 bg-gradient-to-r from-primary/5 to-primary/10">
                    <div className="absolute -bottom-10 sm:-bottom-12 left-1/2 transform -translate-x-1/2 w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white overflow-hidden shadow-lg">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <Quote className="absolute top-4 right-4 w-6 h-6 sm:w-7 sm:h-7 text-primary/20" />
                  </div>
                  
                  <CardContent className="pt-14 sm:pt-16 pb-6 sm:pb-8 px-4 sm:px-6 text-center">
                    <div className="mb-3 sm:mb-4">
                      <h4 className="font-bold text-lg sm:text-xl text-gray-900">{testimonial.name}</h4>
                      <p className="text-primary font-medium text-sm sm:text-base">{testimonial.role}</p>
                      <div className="flex items-center justify-center mt-1 text-xs sm:text-sm text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 text-primary" />
                        <span>{testimonial.location}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-center mb-3 sm:mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    
                    <blockquote className="text-sm sm:text-base leading-relaxed text-gray-600 relative px-2 sm:px-4">
                      <Quote className="absolute -left-1 top-0 w-4 h-4 text-primary/30" />
                      {testimonial.content}
                    </blockquote>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Dots - Mobile */}
        {isMobile && totalDots > 1 && (
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: totalDots }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index * visibleCount)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  index === currentDot ? 'bg-primary w-6' : 'bg-gray-300'
                }`}
                aria-label={`Go to testimonial ${index + 1} of ${totalDots}`}
              />
            ))}
          </div>
        )}

        {/* Navigation Dots - Desktop */}
        {!isMobile && totalDots > 1 && (
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: totalDots }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index * visibleCount)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  index === currentDot ? 'bg-primary' : 'bg-gray-300 hover:bg-primary/50'
                }`}
                aria-label={`Go to testimonial ${index + 1} of ${totalDots}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 -z-10 opacity-10">
        <div className="absolute top-1/4 -right-20 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-1/2 -left-20 w-64 h-64 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>
    </section>
  );
};

export default Testimonials;