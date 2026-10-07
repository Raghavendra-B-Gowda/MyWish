import { CheckCircle2, Download, Link as LinkIcon, Share2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CertificatePreview } from "@/components/certificate/CertificatePreview";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

export default function Success() {
  const [previewScale, setPreviewScale] = useState(1);
  const previewWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateScale = () => {
      if (previewWrapperRef.current) {
        const availableWidth = previewWrapperRef.current.clientWidth;
        setPreviewScale(availableWidth / 850);
      }
    };
    
    const timer = setTimeout(updateScale, 50);
    window.addEventListener('resize', updateScale);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateScale);
    };
  }, []);
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-muted/20 py-16">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success/10 mb-6">
            <CheckCircle2 className="w-10 h-10 text-success" />
          </div>
          <h1 className="text-4xl font-bold text-secondary mb-4">Certificate Created</h1>
          <p className="text-lg text-muted-foreground max-w-lg">
            Your certificate has been successfully generated. It is now permanently verifiable.
          </p>
          <div className="mt-6 flex items-center gap-2 bg-white px-4 py-2 rounded-lg border shadow-sm">
            <span className="text-sm font-medium text-muted-foreground">Certificate ID:</span>
            <span className="font-mono font-bold text-foreground">MW-2026-001245</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="flex-1 w-full bg-white p-4 md:p-8 rounded-2xl border shadow-sm overflow-hidden flex justify-center">
            <div 
              ref={previewWrapperRef}
              className="w-full shadow-2xl rounded-xl ring-1 ring-border relative"
              style={{ height: 850 / 1.414 * previewScale }}
            >
              <div 
                className="w-[850px] aspect-[1.414/1] origin-top-left absolute top-0 left-0 bg-white"
                style={{ transform: `scale(${previewScale})` }}
              >
                <CertificatePreview />
              </div>
            </div>
          </div>

          <div className="w-full lg:w-80 shrink-0 space-y-6">
            <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
              <h3 className="font-bold text-lg border-b pb-2">Actions</h3>
              
              <Button className="w-full justify-start gap-3" size="lg">
                <Download className="w-5 h-5" /> Download PDF
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3" size="lg">
                <Download className="w-5 h-5" /> Download PNG
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3" size="lg">
                <Share2 className="w-5 h-5" /> Share Certificate
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3" size="lg">
                <LinkIcon className="w-5 h-5" /> Copy Verification Link
              </Button>
            </div>

            <div className="bg-primary/5 p-6 rounded-2xl border border-primary/20 text-center">
              <ShieldCheck className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-bold mb-2">Built-in Verification</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Anyone can verify this certificate using its unique ID or QR code.
              </p>
              <Button variant="link" asChild className="text-primary font-semibold">
                <Link to="/verify/MW-2026-001245">View Verification Page &rarr;</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
