import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, QrCode, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Verify() {
  const [certId, setCertId] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const navigate = useNavigate();

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (certId.trim()) {
      navigate(`/verify/${certId.trim()}`);
    }
  };

  useEffect(() => {
    if (!isScanning) return;
    
    let html5QrCode: any;
    let isComponentMounted = true;
    
    const startScan = async () => {
      const { Html5Qrcode } = await import('html5-qrcode');
      html5QrCode = new Html5Qrcode("reader");
      
      try {
        await html5QrCode.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText: string) => {
            if (html5QrCode.isScanning) {
              html5QrCode.stop().then(() => {
                if (isComponentMounted) {
                  setIsScanning(false);
                  const urlParts = decodedText.split('/');
                  const id = urlParts[urlParts.length - 1];
                  navigate(`/verify/${id}`);
                }
              }).catch(() => {});
            }
          },
          () => {}
        );
      } catch (err) {
        console.error("Error starting scanner", err);
        if (isComponentMounted) {
          alert("Could not access camera. Please ensure you are on a secure context (HTTPS/localhost) and have granted camera permissions.");
          setIsScanning(false);
        }
      }
    };
    
    startScan();

    return () => {
      isComponentMounted = false;
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().catch(() => {});
      }
    };
  }, [isScanning, navigate]);

  useEffect(() => {
    // Hide MyWish branding from the browser tab on the verification page
    document.title = "Verify Certificate";
    const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    if (link) {
      link.href = "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🔍</text></svg>";
    }

    // Restore on unmount
    return () => {
      document.title = "MyWish | Professional Certificates";
      if (link) {
        link.href = "/logo.png";
      }
    };
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-muted/20 flex items-center justify-center py-16">
      <div className="container mx-auto px-4 max-w-xl">
        <div className="bg-white dark:bg-secondary/40 rounded-3xl p-8 md:p-12 shadow-xl border border-border dark:border-border/10 text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <Search className="w-10 h-10 text-primary" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
            Verify Your Certificate
          </h1>
          <p className="text-muted-foreground text-lg mb-10">
            Enter the Certificate ID to verify the authenticity of a credential.
          </p>

          {!isScanning ? (
            <>
              <form onSubmit={handleVerify} className="space-y-6">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="e.g. MW-2026-254956"
                    className="h-14 pl-4 pr-12 text-lg text-center font-mono shadow-sm"
                    value={certId}
                    onChange={(e) => setCertId(e.target.value)}
                  />
                </div>
                
                <Button type="submit" size="lg" className="w-full h-14 text-lg">
                  Verify Certificate
                </Button>
              </form>

              <div className="mt-8 pt-8 border-t">
                <p className="text-sm text-muted-foreground mb-4">Or scan a QR code on a physical certificate</p>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full h-14 text-lg gap-2"
                  onClick={() => setIsScanning(true)}
                >
                  <QrCode className="w-5 h-5" /> Scan QR Code
                </Button>
              </div>
            </>
          ) : (
            <div className="animate-in fade-in zoom-in duration-300">
              <div id="reader" className="w-full max-w-sm mx-auto overflow-hidden rounded-2xl border-4 border-primary/20 mb-6 bg-black"></div>
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full h-14 text-lg gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => setIsScanning(false)}
              >
                <X className="w-5 h-5" /> Cancel Scanning
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
