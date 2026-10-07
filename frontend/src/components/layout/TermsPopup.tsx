import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export function TermsPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const hasShown = useRef(false);

  useEffect(() => {
    const isVerifyPage = location.pathname.startsWith('/verify');
    
    // Only show if not on verify page, and we haven't shown it yet in this session
    if (!isVerifyPage && !hasShown.current) {
      setIsOpen(true);
      hasShown.current = true;
    }
  }, [location.pathname]);

  const handleAccept = () => {
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-background text-foreground max-w-lg w-full rounded-2xl shadow-2xl p-6 md:p-8 animate-in fade-in zoom-in duration-300 relative">
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-bold mb-4 pr-8">Welcome to MyWish</h2>
        
        <div className="space-y-4 text-sm text-muted-foreground mb-6">
          <p>
            Before you start creating professional certificates, please review our terms of service.
          </p>
          <div className="bg-muted p-4 rounded-xl space-y-3">
            <h3 className="font-semibold text-foreground">Important Legal Notice</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Certificates generated here are strictly for authorized usage.</li>
              <li>You must ensure that all inputted data is accurate and verifiable.</li>
              <li>Do not use this service to create misleading or fraudulent credentials.</li>
              <li>MyWish is not liable for the misuse of generated certificates.</li>
            </ul>
          </div>
          <p>
            By continuing, you agree to our <Link to="/terms" onClick={() => setIsOpen(false)} className="text-primary hover:underline font-medium">Terms and Conditions</Link> and <Link to="/privacy" onClick={() => setIsOpen(false)} className="text-primary hover:underline font-medium">Privacy Policy</Link>.
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="default" onClick={handleAccept} className="w-full sm:w-auto">
            I Accept and Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
