import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export function SafetyFAB() {
  const navigate = useNavigate();

  const handleSOSClick = () => {
    navigate('/safety');
    // Scroll to the SOS section if needed
    setTimeout(() => {
      const sosSection = document.getElementById('sos-section');
      if (sosSection) {
        sosSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={handleSOSClick}
        className="rounded-full h-14 w-14 bg-red-600 hover:bg-red-700 text-white shadow-lg flex items-center justify-center"
        aria-label="Emergency SOS"
      >
        <AlertTriangle className="h-6 w-6" />
      </Button>
    </div>
  );
}
