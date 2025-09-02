import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, MessageSquare, Phone, Mail, Clock, MapPin } from "lucide-react";

interface SupportSectionProps {
  language: 'en' | 'sw';
}

const SupportSection = ({ language }: SupportSectionProps) => {
  const content = {
    en: {
      faq: {
        title: "Frequently Asked Questions",
        subtitle: "Find answers to common questions about AquaNet Kenya",
        items: [
          {
            question: "How do I register as a fisher or buyer?",
            answer: "Click the 'Join as Fisher' or 'Join as Buyer' button on our homepage. Fill out the registration form with your details, select your region, and verify your phone number. You'll receive access to your personalized dashboard immediately."
          },
          {
            question: "Is AquaNet Kenya free to use?",
            answer: "Yes! AquaNet Kenya is completely free for fishers to use. Buyers pay a small transaction fee only when they complete a purchase through our platform. There are no subscription fees or hidden charges."
          },
          {
            question: "How does the emergency SOS system work?",
            answer: "The SOS button in your fisher dashboard immediately sends your GPS location to local marine rescue services and emergency contacts. It also broadcasts an alert to nearby vessels using our network."
          },
          {
            question: "Can I use AquaNet on a basic phone?",
            answer: "Yes! We provide USSD codes for basic phone users to access core features like price updates, weather alerts, and simple marketplace listings. Smartphone users get the full app experience."
          },
          {
            question: "How do payments work with M-Pesa?",
            answer: "All transactions are processed securely through M-Pesa. Buyers can pay instantly, and fishers receive payments directly to their M-Pesa accounts. We handle all the technical integration for a seamless experience."
          }
        ]
      },
      support: {
        title: "Need Help?",
        subtitle: "Our support team is here to assist you",
        phone: "Call Us",
        phoneNumber: "+254 700 123 456",
        email: "Email Support",
        emailAddress: "support@aquanet.co.ke",
        hours: "Support Hours",
        hoursText: "Mon-Sat: 6 AM - 8 PM EAT",
        office: "Head Office",
        officeAddress: "Mombasa Marine Center, Kilifi Road, Mombasa"
      }
    },
    sw: {
      faq: {
        title: "Maswali Yanayoulizwa Mara Kwa Mara",
        subtitle: "Pata majibu ya maswali ya kawaida kuhusu AquaNet Kenya",
        items: [
          {
            question: "Jinsi ya kujisajili kama mvuvi au mnunuzi?",
            answer: "Bonyeza kitufe cha 'Jiunge kama Mvuvi' au 'Jiunge kama Mnunuzi' kwenye ukurasa wetu wa nyumbani. Jaza fomu ya usajili na maelezo yako, chagua mkoa wako, na thibitisha nambari yako ya simu. Utapata ufikiaji wa dashibodi yako mara moja."
          },
          {
            question: "Je, AquaNet Kenya ni bure kutumia?",
            answer: "Ndio! AquaNet Kenya ni bure kabisa kwa wavuvi kutumia. Wanunuzi hulipa ada ndogo ya muamala tu wakati wanapomaliza ununuzi kupitia jukwaa letu. Hakuna ada za michango au malipo ya siri."
          },
          {
            question: "Mfumo wa hatari wa SOS unafanyaje kazi?",
            answer: "Kitufe cha SOS katika dashibodi yako ya mvuvi mara moja hutuma eneo lako la GPS kwa huduma za uokoaji wa baharini na mawasiliano ya dharura. Pia hutangaza tahadhari kwa vyombo vilivyo karibu kutumia mtandao wetu."
          },
          {
            question: "Je, ninaweza kutumia AquaNet kwenye simu ya kawaida?",
            answer: "Ndio! Tunatoa misimbo ya USSD kwa watumiaji wa simu za kawaida ili wafikie vipengele muhimu kama masasisho ya bei, tahadhari za hali ya hewa, na orodha rahisi za soko. Watumiaji wa simu mahiri wanapata uzoefu kamili wa programu."
          },
          {
            question: "Malipo yanafanyaje kazi na M-Pesa?",
            answer: "Miamala yote inachakatwa kwa usalama kupitia M-Pesa. Wanunuzi wanaweza kulipa mara moja, na wavuvi wanapokea malipo moja kwa moja kwenye akaunti zao za M-Pesa. Tunashughulikia uongezaji wote wa kiufundi kwa uzoefu laini."
          }
        ]
      },
      support: {
        title: "Unahitaji Msaada?",
        subtitle: "Timu yetu ya msaada iko hapa kukusaidia",
        phone: "Tupigie Simu",
        phoneNumber: "+254 700 123 456",
        email: "Msaada wa Barua Pepe",
        emailAddress: "support@aquanet.co.ke",
        hours: "Masaa ya Msaada",
        hoursText: "Jumanne-Jumamosi: 6 AM - 8 PM EAT",
        office: "Ofisi Kuu",
        officeAddress: "Mombasa Marine Center, Kilifi Road, Mombasa"
      }
    }
  };

  const currentContent = content[language];

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* FAQ Section */}
        <div className="mb-20">
          <div className="text-center mb-16 animate-fade-in">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <HelpCircle className="w-4 h-4 mr-2" />
              FAQ
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
              {currentContent.faq.title}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {currentContent.faq.subtitle}
            </p>
          </div>

          <Card className="max-w-4xl mx-auto animate-fade-in">
            <CardContent className="p-0">
              <Accordion type="single" collapsible className="w-full">
                {currentContent.faq.items.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border-b border-border/50">
                    <AccordionTrigger className="px-6 py-4 text-left hover:no-underline hover:bg-muted/50 transition-colors">
                      <span className="font-semibold">{item.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4 text-muted-foreground leading-relaxed">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>

        {/* Support Contact Section */}
        <div className="animate-fade-in">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">
              {currentContent.support.title}
            </h2>
            <p className="text-lg text-muted-foreground">
              {currentContent.support.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="group hover:shadow-ocean transition-all duration-300 hover:-translate-y-1 text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-ocean rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">{currentContent.support.phone}</h3>
                <p className="text-sm text-muted-foreground mb-3">{currentContent.support.phoneNumber}</p>
                <Button variant="outline" size="sm" className="w-full">
                  {language === 'en' ? 'Call Now' : 'Piga Simu Sasa'}
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-ocean transition-all duration-300 hover:-translate-y-1 text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-sunset rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">{currentContent.support.email}</h3>
                <p className="text-sm text-muted-foreground mb-3">{currentContent.support.emailAddress}</p>
                <Button variant="outline" size="sm" className="w-full">
                  {language === 'en' ? 'Send Email' : 'Tuma Barua Pepe'}
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-ocean transition-all duration-300 hover:-translate-y-1 text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-coastal rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform border border-primary/20">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{currentContent.support.hours}</h3>
                <p className="text-sm text-muted-foreground">{currentContent.support.hoursText}</p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-ocean transition-all duration-300 hover:-translate-y-1 text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-ocean rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">{currentContent.support.office}</h3>
                <p className="text-xs text-muted-foreground">{currentContent.support.officeAddress}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SupportSection;