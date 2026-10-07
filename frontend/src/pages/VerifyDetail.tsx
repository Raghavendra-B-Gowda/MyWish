import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { CheckCircle2, XCircle, Download, Share2, Loader2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CertificatePreview } from "@/components/certificate/CertificatePreview";
import { COMPANIES } from "@/components/certificate/CompanyLogo";
import { useCertificateStore } from "@/store/useCertificateStore";
import { API_URL } from "@/config/api";

const getCompanyName = (certData: any) => {
  if (certData.company) return certData.company.name;
  if (certData.organization && certData.organization.trim()) return certData.organization.trim();
  if (!certData.logoType || certData.logoType === 'mywish') return 'MyWish';
  return COMPANIES.find(c => c.id === certData.logoType)?.name || certData.logoType;
};

export default function VerifyDetail() {
  const { id } = useParams();
  const [certData, setCertData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const setActiveCompanyOverride = useCertificateStore((s) => s.setActiveCompanyOverride);

  // Scale state for responsive preview
  const [previewScale, setPreviewScale] = useState(1);
  const previewWrapperRef = useRef<HTMLDivElement>(null);

  // Update scale on resize
  useEffect(() => {
    const updateScale = () => {
      if (previewWrapperRef.current) {
        // The fixed width of the certificate is 850px
        const availableWidth = previewWrapperRef.current.clientWidth;
        setPreviewScale(availableWidth / 850);
      }
    };
    
    // Slight delay to ensure DOM is ready
    const timer = setTimeout(updateScale, 50);
    window.addEventListener('resize', updateScale);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateScale);
    };
  }, [certData]);

  // Immediately hide MyWish branding when this page mounts
  useEffect(() => {
    setActiveCompanyOverride({ hidden: true });
    return () => {
      // Restore default MyWish branding on unmount
      setActiveCompanyOverride(null);
    };
  }, [setActiveCompanyOverride]);

  useEffect(() => {
    if (id) {
      if (API_URL) {
        // Query the actual database via backend
        fetch(`${API_URL}/api/certificates/${id}`)
          .then(res => {
            if (!res.ok) throw new Error("Not found");
            return res.json();
          })
          .then(data => {
            setCertData(data);
            setLoading(false);
          })
          .catch(() => {
            setError(true);
            setLoading(false);
          });
      } else {
        // No backend: show a generic verified state using the store data
        const storeData = useCertificateStore.getState().data;
        if (storeData.recipientName) {
          setCertData({ ...storeData, id, status: 'ACTIVE' });
        } else {
          setError(true);
        }
        setLoading(false);
      }
    }
  }, [id]);

  // Once cert data is loaded, reveal the company branding
  useEffect(() => {
    if (certData) {
      const name = getCompanyName(certData);
      const companyImage = certData.company?.logo || COMPANIES.find(c => c.id === certData.logoType)?.image;
      
      setActiveCompanyOverride({
        name,
        image: companyImage
      });

      // Override browser tab title and favicon
      document.title = `${name} Certificate Verification`;
      if (companyImage) {
        let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
        if (!link) {
          link = document.createElement('link');
          link.rel = 'icon';
          document.head.appendChild(link);
        }
        link.href = companyImage;
      }
    } else {
      document.title = "Verification - MyWish";
    }

    return () => {
      // Restore on unmount
      document.title = "MyWish Certificate Platform";
      const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (link) {
        link.href = "/logo.png";
      }
    };
  }, [certData, setActiveCompanyOverride]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');
      const el = document.getElementById('verification-certificate-preview');
      if (!el) return;
      
      const canvas = await html2canvas(el, { 
        scale: 3, 
        useCORS: true, 
        backgroundColor: null,
        onclone: (clonedDoc) => {
          const clonedEl = clonedDoc.getElementById('verification-certificate-preview');
          if (clonedEl) {
            clonedEl.style.transform = 'none';
          }
        }
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
      pdf.addImage(imgData, 'PNG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
      pdf.save(`certificate-${id}.pdf`);
    } catch (err) {
      console.error(err);
      alert("Failed to download certificate.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-[#F7F9FC]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // INVALID CERTIFICATE
  if (error || !certData) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-[#F7F9FC]">
        <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-sm border border-border">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-6">
            <XCircle className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold mb-2 text-[#0B1F3A]">Verification Failed</h1>
          <p className="text-slate-600 mb-6">We couldn't verify this certificate. It may be invalid, expired, or have an incorrect ID.</p>
          <Button asChild className="w-full h-12 text-sm font-bold bg-[#0B1F3A] hover:bg-[#0B1F3A]/90">
            <Link to="/verify">Try Another ID</Link>
          </Button>
        </div>
      </div>
    );
  }

  const isRevoked = certData.status === "Revoked";
  const companyName = getCompanyName(certData);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${companyName} Certificate`,
          text: `Check out my verified certificate from ${companyName}!`,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Error sharing", err);
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#F7F9FC] py-16">
      <Helmet>
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className="container mx-auto px-4 max-w-4xl space-y-8">
        
        {/* Verification Header */}
        {!isRevoked && (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 bg-green-50 text-green-600 ring-8 ring-green-50/50">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 text-green-600">
              ✓ Certificate Verified
            </h1>
            <p className="text-muted-foreground text-lg max-w-lg mx-auto">
              Certificate is authentic and was issued through {companyName}.
            </p>
          </div>
        )}
        
        {/* Actual Preview */}
        <div className="bg-white border border-border p-4 md:p-8 flex justify-center rounded-2xl shadow-sm relative">
          <div 
            ref={previewWrapperRef}
            className="w-full shadow-2xl rounded-xl overflow-hidden ring-1 ring-border relative"
            style={{ height: 850 / 1.414 * previewScale }}
          >
            <div 
              id="verification-certificate-preview" 
              className={`w-[850px] aspect-[1.414/1] origin-top-left absolute top-0 left-0 bg-white ${isRevoked ? 'blur-lg opacity-30 select-none pointer-events-none' : ''}`}
              style={{ transform: `scale(${previewScale})` }}
            >
              <CertificatePreview overrideData={isRevoked ? { ...certData, recipientName: "REDACTED", email: "REDACTED", courseName: "REDACTED", internshipRole: "REDACTED", directorName: "REDACTED" } : certData} />
            </div>
            
            {isRevoked && (
              <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/10 backdrop-blur-sm p-4 md:p-6 text-center overflow-y-auto">
                <div className="inline-flex items-center justify-center w-16 h-16 md:w-24 md:h-24 rounded-full mb-4 md:mb-6 bg-red-50 text-red-500 ring-8 ring-red-500/20 shadow-2xl shrink-0">
                  <XCircle className="w-8 h-8 md:w-12 md:h-12" />
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight mb-2 md:mb-4 text-red-600 uppercase drop-shadow-md">
                  Certificate Revoked
                </h1>
                <p className="text-slate-800 text-sm sm:text-base md:text-xl font-bold max-w-lg mx-auto bg-white/90 p-3 md:p-4 rounded-xl shadow-lg border-2 border-red-100">
                  This certificate has been revoked by the issuer and is no longer valid. The underlying data has been hidden.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Verification Information Card */}
        {!isRevoked && (
          <div className="bg-white rounded-2xl p-6 md:p-8 border shadow-sm">
            <h3 className="text-lg font-bold text-[#0B1F3A] border-b pb-4 mb-6">Verification Information</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-6">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Certificate ID</p>
                <p className="font-mono font-bold text-[#0B1F3A]">{id}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Verification</p>
                <div className="flex items-center gap-1.5 text-[#0B1F3A] font-bold">
                  <CheckCircle2 className="w-4 h-4 text-green-600" /> QR Verification Enabled
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Status</p>
                <div className="flex items-center gap-1.5 font-bold text-green-600">
                  <CheckCircle2 className="w-4 h-4" /> Valid
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Recipient Name</p>
                <p className="font-bold text-[#0B1F3A]">{certData.recipientName}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">{certData.type === 'course' ? 'Course' : 'Internship'}</p>
                <p className="font-medium text-slate-600">{certData.courseName || certData.internshipRole}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Duration</p>
                <p className="font-medium text-slate-600">{certData.durationValue} {certData.durationType}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Email</p>
                <p className="font-medium text-slate-600">{certData.email.replace(/(.{2})(.*)(?=@)/, "$1********")}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Issue Date</p>
                <p className="font-medium text-slate-600">{certData.issueDate}</p>
              </div>

              {certData.completionDate && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Completion Date</p>
                  <p className="font-medium text-slate-600">{certData.completionDate}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Director</p>
                <p className="font-medium text-slate-600">{certData.directorName}</p>
              </div>

              {certData.description && (
                <div className="sm:col-span-2">
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Description</p>
                  <p className="font-medium text-slate-600 italic text-sm">{certData.description}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className={`grid grid-cols-1 gap-4 ${!isRevoked ? 'sm:grid-cols-2 md:grid-cols-4' : 'max-w-xs mx-auto'}`}>
          {!isRevoked && (
            <>
              <Button 
                className="w-full h-12 text-sm font-bold bg-[#1769E0] hover:bg-[#1769E0]/90 text-white shadow-sm"
                onClick={handleCopyLink}
              >
                {copied ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied ? "Link Copied!" : "Copy Verification Link"}
              </Button>
              <Button 
                variant="outline" 
                className="w-full h-12 text-sm font-bold text-[#0B1F3A] bg-white shadow-sm"
                onClick={handleDownload}
              >
                <Download className="w-4 h-4 mr-2" /> View / Download
              </Button>
              <Button 
                variant="outline" 
                className="w-full h-12 text-sm font-bold text-[#0B1F3A] bg-white shadow-sm"
                onClick={handleShare}
              >
                <Share2 className="w-4 h-4 mr-2" /> Share Certificate
              </Button>
            </>
          )}
          <Button 
            variant={isRevoked ? "default" : "secondary"}
            className={`w-full h-12 text-sm font-bold shadow-sm ${isRevoked ? 'bg-[#0B1F3A] hover:bg-[#0B1F3A]/90 text-white' : ''}`} 
            asChild
          >
            <Link to="/verify">Verify Another</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
