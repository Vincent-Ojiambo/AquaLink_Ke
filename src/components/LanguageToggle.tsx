import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

interface LanguageToggleProps {
  language: 'en' | 'sw';
  onLanguageChange: (language: 'en' | 'sw') => void;
}

const LanguageToggle = ({ language, onLanguageChange }: LanguageToggleProps) => {
  return (
    <div className="fixed top-4 right-4 z-50">
      <Button
        variant="coastal"
        size="sm"
        onClick={() => onLanguageChange(language === 'en' ? 'sw' : 'en')}
        className="group shadow-lg"
      >
        <Globe className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
        {language === 'en' ? 'Kiswahili' : 'English'}
      </Button>
    </div>
  );
};

export default LanguageToggle;