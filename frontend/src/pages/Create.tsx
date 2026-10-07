import { useState, useEffect, useRef } from "react";
import { useCertificateStore } from "@/store/useCertificateStore";
import { CertificatePreview } from "@/components/certificate/CertificatePreview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckCircle2, ChevronRight, Loader2, Sparkles, Download, Image, FileText, ExternalLink, Award, GraduationCap, Building2, Grid3X3, AlignJustify, Waves, Shapes } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { TEMPLATES } from "@/config/templates";
import { useCompanyStore } from "@/store/useCompanyStore";
import { COMPANIES } from "@/components/certificate/CompanyLogo";
const STEPS = ["Details", "Signatures", "Design", "Preview", "Download"];
const FONTS = ["Inter", "Playfair Display", "Roboto Mono", "Merriweather", "Outfit", "Lora", "Montserrat", "Cinzel"];
import { generateVerificationUrl } from "@/utils/verification";

export default function Create() {
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const { data, updateData, generateCertificate, generatedId, isLoading, error, reset } = useCertificateStore();
  const navigate = useNavigate();

  // Fetch Companies
  const { fetchCompanies, companies: dynamicCompanies } = useCompanyStore();
  const allCompanies = [...COMPANIES, ...dynamicCompanies.map(c => ({ id: c.id, name: c.name, image: c.logo || '' }))];
  
  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  // Mobile preview toggle
  const [showMobilePreview] = useState(false);

  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = marqueeRef.current;
    if (!container || currentStep !== 3) return;
    
    let animationId: number;
    let isHovered = false;
    
    const scroll = () => {
      if (!isHovered && container) {
        container.scrollLeft += 1;
        if (container.scrollLeft >= container.scrollWidth / 2) {
          container.scrollLeft = 0;
        }
      }
      animationId = requestAnimationFrame(scroll);
    };
    
    animationId = requestAnimationFrame(scroll);
    
    const handleEnter = () => { isHovered = true; };
    const handleLeave = () => { isHovered = false; };
    
    container.addEventListener('mouseenter', handleEnter);
    container.addEventListener('mouseleave', handleLeave);
    container.addEventListener('touchstart', handleEnter, { passive: true });
    container.addEventListener('touchend', handleLeave, { passive: true });
    
    return () => {
      cancelAnimationFrame(animationId);
      container.removeEventListener('mouseenter', handleEnter);
      container.removeEventListener('mouseleave', handleLeave);
      container.removeEventListener('touchstart', handleEnter);
      container.removeEventListener('touchend', handleLeave);
    };
  }, [currentStep]);

  // Scale state for responsive preview
  const [previewScale, setPreviewScale] = useState(1);
  const previewWrapperRef = useRef<HTMLDivElement>(null);
  
  const [livePreviewScale, setLivePreviewScale] = useState(1);
  const livePreviewWrapperRef = useRef<HTMLDivElement>(null);

  // Copy link state
  const [copied, setCopied] = useState(false);
  const handleCopyLink = () => {
    const verificationUrl = generateVerificationUrl(generatedId || "", data);
    navigator.clipboard.writeText(verificationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Update scale on resize
  useEffect(() => {
    const updateScale = () => {
      if (previewWrapperRef.current) {
        // The fixed width of the certificate is 850px
        const availableWidth = previewWrapperRef.current.clientWidth;
        setPreviewScale(availableWidth / 850);
      }
      if (livePreviewWrapperRef.current) {
        const availableWidth = livePreviewWrapperRef.current.clientWidth;
        setLivePreviewScale(availableWidth / 850);
      }
    };
    
    updateScale();
    const observer = new ResizeObserver(updateScale);
    if (previewWrapperRef.current) observer.observe(previewWrapperRef.current);
    if (livePreviewWrapperRef.current) observer.observe(livePreviewWrapperRef.current);
    window.addEventListener('resize', updateScale);
    
    // Force an update after the container CSS transition completes (500ms)
    const timeoutId = setTimeout(updateScale, 550);
    
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateScale);
      clearTimeout(timeoutId);
    };
  }, [currentStep, showMobilePreview]); // Update when step changes or sidebar toggles

  useEffect(() => {
    const templateParam = searchParams.get('template');
    if (!templateParam) {
      navigate('/templates', { replace: true });
      return;
    }
    
    updateData({ templateId: templateParam });
    // Apply default colors for this template if they exist
    const template = TEMPLATES.find(t => t.id === templateParam);
    if (template) {
      updateData({ 
        certificateColor: template.defaultColors?.certificateColor || '#FFFFFF',
        accentColor: template.defaultColors?.accentColor || '#1769E0',
        textColor: template.defaultColors?.textColor || '#0B1F3A',
        font: template.defaultFont || 'Inter',
        image: template.image // Store the image so CertificatePreview can access it
      });
    }
    setCurrentStep(1);
  }, [searchParams, updateData, navigate]);

  const handleNext = async () => {
    if (currentStep === 4) {
      setCurrentStep(5);
      await generateCertificate();
    } else {
      setCurrentStep(prev => Math.min(prev + 1, 5));
      window.scrollTo(0, 0);
    }
  };
  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo(0, 0);
  };


  const handleDownloadImage = async () => {
    try {
      const html2canvas = (await import('html2canvas')).default;
      const el = document.getElementById('certificate-preview-root');
      if (!el) return;
      
      const canvas = await html2canvas(el, { 
        scale: 3, 
        useCORS: true, 
        backgroundColor: null 
      });
      
      const link = document.createElement('a');
      link.download = `certificate-${generatedId}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error("Image download failed:", error);
      alert("Failed to download image. If you added a custom template image, ensure it is placed in the 'frontend/public' folder to avoid security restrictions.");
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');
      const el = document.getElementById('certificate-preview-root');
      if (!el) return;
      
      const canvas = await html2canvas(el, { 
        scale: 3, 
        useCORS: true, 
        backgroundColor: null 
      });
      
      const imgData = canvas.toDataURL('image/png');
      // A4 landscape
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, 'PNG', 0, 0, pdfW, pdfH);
      pdf.save(`certificate-${generatedId}.pdf`);
    } catch (error) {
      console.error("PDF download failed:", error);
      alert("Failed to download PDF. If you added a custom template image, ensure it is placed in the 'frontend/public' folder to avoid security restrictions.");
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // Details
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-2xl font-bold text-secondary mb-1">Enter certificate details</h2>
              <p className="text-muted-foreground text-sm">Fill out the basic information for the recipient.</p>
            </div>
            
            <div className="space-y-6">
              <div className="bg-muted/30 p-4 rounded-xl border border-border">
                <Label className="mb-4 block text-base font-semibold">Certificate Type</Label>
                <RadioGroup 
                  value={data.type} 
                  onValueChange={(val: any) => updateData({ type: val, badgeType: val === 'course' ? 'academic' : 'seal' })}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <div className={`flex items-center space-x-2 border p-4 rounded-lg flex-1 cursor-pointer transition-colors ${data.type === 'course' ? 'border-primary bg-primary/5' : 'bg-white dark:bg-[#0E0C15]'}`} onClick={() => updateData({ type: 'course', badgeType: 'academic' })}>
                    <RadioGroupItem value="course" id="course" />
                    <Label htmlFor="course" className="cursor-pointer font-medium">Course Completion</Label>
                  </div>
                  <div className={`flex items-center space-x-2 border p-4 rounded-lg flex-1 cursor-pointer transition-colors ${data.type === 'internship' ? 'border-primary bg-primary/5' : 'bg-white dark:bg-[#0E0C15]'}`} onClick={() => updateData({ type: 'internship', badgeType: 'seal' })}>
                    <RadioGroupItem value="internship" id="internship" />
                    <Label htmlFor="internship" className="cursor-pointer font-medium">Internship</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label htmlFor="recipient" className="text-sm font-semibold">Recipient Name</Label>
                <p className="text-xs text-muted-foreground">Enter the full name exactly as it should appear.</p>
                <Input 
                  id="recipient" 
                  value={data.recipientName} 
                  onChange={e => updateData({ recipientName: e.target.value })}
                  placeholder="e.g. Romio"
                  className="h-12 text-lg"
                />
              </div>

              {data.type === 'course' ? (
                <div className="space-y-3">
                  <Label htmlFor="courseName" className="text-sm font-semibold">Course Name</Label>
                  <Input 
                    id="courseName" 
                    value={data.courseName || ''} 
                    onChange={e => updateData({ courseName: e.target.value })}
                    placeholder="e.g. Full Stack Web Development"
                    className="h-12"
                  />
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    <Label htmlFor="internshipRole" className="text-sm font-semibold">Internship Role</Label>
                    <Input 
                      id="internshipRole" 
                      value={data.internshipRole || ''} 
                      onChange={e => updateData({ internshipRole: e.target.value })}
                      placeholder="e.g. Frontend Engineering Intern"
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="department" className="text-sm font-semibold">Department (Optional)</Label>
                    <Input 
                      id="department" 
                      value={data.department || ''} 
                      onChange={e => updateData({ department: e.target.value })}
                      placeholder="e.g. Product Engineering"
                      className="h-12"
                    />
                  </div>
                </>
              )}



              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Completion Time</Label>
                  <div className="flex bg-muted p-1 rounded-lg">
                    <button 
                      className={`flex-1 text-sm py-2 rounded-md transition-colors ${data.durationType === 'hours' ? 'bg-white text-slate-900 dark:bg-slate-800 dark:text-white shadow-sm font-medium' : 'text-muted-foreground'}`}
                      onClick={() => updateData({ durationType: 'hours' })}
                    >
                      Hours
                    </button>
                    <button 
                      className={`flex-1 text-sm py-2 rounded-md transition-colors ${data.durationType === 'months' ? 'bg-white text-slate-900 dark:bg-slate-800 dark:text-white shadow-sm font-medium' : 'text-muted-foreground'}`}
                      onClick={() => updateData({ durationType: 'months' })}
                    >
                      Months
                    </button>
                  </div>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="durationValue" className="text-sm font-semibold">Number of {data.durationType === 'hours' ? 'Hours' : 'Months'}</Label>
                  <Input 
                    id="durationValue" 
                    value={data.durationValue} 
                    onChange={e => updateData({ durationValue: e.target.value })}
                    placeholder={data.durationType === 'hours' ? 'e.g. 40' : 'e.g. 3'}
                    className="h-11"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="issueDate" className="text-sm font-semibold">Issue Date</Label>
                  <Input 
                    id="issueDate" 
                    type="date"
                    value={data.issueDate} 
                    onChange={e => updateData({ issueDate: e.target.value })}
                    className="h-11"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-sm font-semibold">Recipient Email</Label>
                  <Input 
                    id="email" 
                    type="email"
                    value={data.email} 
                    onChange={e => updateData({ email: e.target.value })}
                    placeholder="For verification"
                    className="h-11"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2: // Signatures
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-secondary mb-1">Signatures</h2>
                <p className="text-muted-foreground text-sm">Add the Director and Student signatures for validation.</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => {
                updateData({ directorName: "Dr. Arjun Rao", directorSignatureFont: 'Great Vibes', directorSignature: '', studentSignatureMode: 'ai' });
              }} className="gap-2">
                <Sparkles className="w-4 h-4 text-primary" /> Demo Details
              </Button>
            </div>
            
            <div className="space-y-8">
              <div className="bg-slate-50 dark:bg-slate-900/40 p-6 rounded-2xl border border-border">
                <h3 className="font-bold text-lg mb-4">Director / Issuer</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { name: "Dr. Arjun Rao", font: "Mrs Saint Delafield" },
                    { name: "Priya Sharma", font: "Herr Von Muellerhoff" },
                    { name: "Rahul Mehta", font: "Qwigley" },
                    { name: "Ananya Iyer", font: "Pinyon Script" }
                  ].map((director) => (
                    <div 
                      key={director.name}
                      onClick={() => updateData({ directorName: director.name, directorSignatureFont: director.font, directorSignature: '' })}
                      className={`p-4 border rounded-xl cursor-pointer flex flex-col items-center justify-center transition-all ${data.directorName === director.name ? 'border-primary ring-2 ring-primary bg-primary/5 dark:bg-primary/10' : 'bg-white dark:bg-[#0E0C15] hover:border-border/80'}`}
                    >
                      <div className="h-16 flex items-end justify-center mb-2 w-full">
                        <span style={{ fontFamily: `'${director.font}', cursive` }} className="text-3xl text-secondary whitespace-nowrap overflow-hidden text-ellipsis px-2 leading-none pb-2">
                          {director.name}
                        </span>
                      </div>
                      <div className="h-px w-full my-2 bg-border" />
                      <p className="text-sm font-semibold text-secondary">{director.name}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/40 p-6 rounded-2xl border border-border">
                <h3 className="font-bold text-lg mb-4">Student Signature</h3>
                <div className="space-y-4">
                  <RadioGroup 
                    value={data.studentSignatureMode} 
                    onValueChange={(val: any) => updateData({ studentSignatureMode: val })}
                    className="flex flex-col gap-3"
                  >
                    <div className={`flex items-center space-x-3 border p-4 rounded-lg cursor-pointer transition-colors ${data.studentSignatureMode === 'ai' ? 'border-primary bg-primary/5 dark:bg-primary/10' : 'bg-white dark:bg-[#0E0C15]'}`} onClick={() => updateData({ studentSignatureMode: 'ai' })}>
                      <RadioGroupItem value="ai" id="ai" />
                      <div>
                        <Label htmlFor="ai" className="cursor-pointer font-medium block mb-1">Make my AI Signature</Label>
                        <p className="text-xs text-muted-foreground">Automatically generates a cursive signature using the recipient's name.</p>
                      </div>
                    </div>
                    <div className={`flex items-center space-x-3 border p-4 rounded-lg cursor-pointer transition-colors ${data.studentSignatureMode === 'manual' ? 'border-primary bg-primary/5 dark:bg-primary/10' : 'bg-white dark:bg-[#0E0C15]'}`} onClick={() => updateData({ studentSignatureMode: 'manual' })}>
                      <RadioGroupItem value="manual" id="manual" />
                      <div>
                        <Label htmlFor="manual" className="cursor-pointer font-medium block mb-1">Sign manually after print</Label>
                        <p className="text-xs text-muted-foreground">Leaves a blank line for the student to sign with a pen later.</p>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
          </div>
        );

      case 3: // Design
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-2xl font-bold text-secondary mb-1">Design Customization</h2>
              <p className="text-muted-foreground text-sm">Tweak the colors, fonts, and brand to match your certificate.</p>
            </div>
            
            <div className="grid grid-cols-2 gap-6 pt-4 border-t">
              <div className="space-y-3">
                <Label>Accent Color</Label>
                <div className="flex items-center gap-3">
                  <input type="color" value={data.accentColor} onChange={e => updateData({ accentColor: e.target.value })} className="w-12 h-12 rounded cursor-pointer border-0 p-0" />
                  <Input value={data.accentColor} onChange={e => updateData({ accentColor: e.target.value })} className="uppercase font-mono text-sm" />
                </div>
              </div>
              <div className="space-y-3">
                <Label>Text Color</Label>
                <div className="flex items-center gap-3">
                  <input type="color" value={data.textColor} onChange={e => updateData({ textColor: e.target.value })} className="w-12 h-12 rounded cursor-pointer border-0 p-0" />
                  <Input value={data.textColor} onChange={e => updateData({ textColor: e.target.value })} className="uppercase font-mono text-sm" />
                </div>
              </div>
              <div className="space-y-3 col-span-2">
                <Label>Background / Certificate Color</Label>
                <div className="flex items-center gap-3">
                  <input type="color" value={data.certificateColor} onChange={e => updateData({ certificateColor: e.target.value })} className="w-12 h-12 rounded cursor-pointer border-0 p-0" />
                  <Input value={data.certificateColor} onChange={e => updateData({ certificateColor: e.target.value })} className="uppercase font-mono text-sm" />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t">
              <Label>Typography</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {FONTS.map(font => (
                  <div 
                    key={font}
                    className={`border rounded-lg p-3 text-center cursor-pointer transition-colors ${data.font === font ? 'border-primary bg-primary/5 text-primary font-bold' : 'hover:border-border/80'}`}
                    onClick={() => updateData({ font })}
                    style={{ fontFamily: font }}
                  >
                    {font}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t">
              <div className="flex flex-col gap-1">
                <Label className="text-base font-semibold text-secondary">Company Logo</Label>
                <p className="text-xs text-muted-foreground">Select the company logo to appear on the certificate.</p>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {allCompanies
                  .filter(company => company.name.toLowerCase() !== 'google')
                  .map(company => (
                  <div 
                    key={company.id}
                    className={`border rounded-xl p-2 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${data.logoType === company.id ? 'border-primary bg-primary/5 ring-2 ring-primary/20 shadow-sm' : 'hover:border-primary/50 bg-slate-50/50 dark:bg-slate-900/50'}`}
                    onClick={() => updateData({ logoType: company.id })}
                  >
                    {company.image ? (
                      <div className="h-8 w-full flex items-center justify-center">
                        <img src={company.image} alt={company.name} className="max-h-full max-w-full object-contain mix-blend-multiply dark:mix-blend-screen" />
                      </div>
                    ) : (
                      <Building2 className={`w-6 h-6 ${data.logoType === company.id ? 'text-primary' : 'text-slate-500'}`} />
                    )}
                    <span className="text-xs font-medium text-center truncate w-full px-1" title={company.name}>{company.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t">
              <div className="flex flex-col gap-1">
                <Label className="text-base font-semibold text-secondary">Official Badge</Label>
                <p className="text-xs text-muted-foreground">Choose a premium seal, academic badge, or leave it blank.</p>
              </div>
              
              <div className="grid grid-cols-3 gap-3 mt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <div 
                  className={`border rounded-xl p-3 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${!data.showBadge || data.badgeType === 'none' ? 'border-primary bg-primary/5 ring-2 ring-primary/20 shadow-sm' : 'hover:border-primary/50 bg-slate-50/50'}`}
                  onClick={() => updateData({ badgeType: 'none', showBadge: false })}
                >
                  <div className={`p-2 rounded-full ${!data.showBadge || data.badgeType === 'none' ? 'bg-primary/10' : 'bg-slate-200'}`}>
                    <div className="w-5 h-5 rounded-full border-2 border-dashed border-current opacity-50"></div>
                  </div>
                  <span className="text-xs font-medium">None</span>
                </div>
                <div 
                  className={`border rounded-xl p-3 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${data.showBadge && data.badgeType === 'seal' ? 'border-primary bg-primary/5 ring-2 ring-primary/20 shadow-sm' : 'hover:border-primary/50 bg-slate-50/50'}`}
                  onClick={() => updateData({ badgeType: 'seal', showBadge: true })}
                >
                  <div className={`p-2 rounded-full ${data.showBadge && data.badgeType === 'seal' ? 'bg-primary/10' : 'bg-slate-200'}`}>
                    <Award className={`w-5 h-5 ${data.showBadge && data.badgeType === 'seal' ? 'text-primary' : 'text-slate-500'}`} />
                  </div>
                  <span className="text-xs font-medium text-center">Premium Seal</span>
                </div>
                <div 
                  className={`border rounded-xl p-3 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${data.showBadge && data.badgeType === 'academic' ? 'border-primary bg-primary/5 ring-2 ring-primary/20 shadow-sm' : 'hover:border-primary/50 bg-slate-50/50'}`}
                  onClick={() => updateData({ badgeType: 'academic', showBadge: true })}
                >
                  <div className={`p-2 rounded-full ${data.showBadge && data.badgeType === 'academic' ? 'bg-primary/10' : 'bg-slate-200'}`}>
                    <GraduationCap className={`w-5 h-5 ${data.showBadge && data.badgeType === 'academic' ? 'text-primary' : 'text-slate-500'}`} />
                  </div>
                  <span className="text-xs font-medium text-center">Academic Cap</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t">
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1">
                  <Label className="text-base font-semibold text-secondary">Background Watermark / Pattern</Label>
                  <p className="text-xs text-muted-foreground">Add a subtle background overlay to the certificate.</p>
                </div>
                <div className="flex items-center gap-2 mt-1 animate-in fade-in">
                  <span className="text-xs font-medium text-muted-foreground">Combine Patterns</span>
                  <button 
                    onClick={() => updateData({ combineWatermarks: !data.combineWatermarks })}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${data.combineWatermarks ? 'bg-primary' : 'bg-slate-200'}`}
                  >
                    <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${data.combineWatermarks ? 'translate-x-4' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <div 
                  className={`border rounded-xl p-3 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${(!data.backgroundPatterns || data.backgroundPatterns.length === 0) ? 'border-primary bg-primary/5 ring-2 ring-primary/20 shadow-sm' : 'hover:border-primary/50 bg-slate-50/50'}`}
                  onClick={() => updateData({ backgroundPatterns: [] })}
                >
                  <div className={`p-2 rounded-full ${(!data.backgroundPatterns || data.backgroundPatterns.length === 0) ? 'bg-primary/10' : 'bg-slate-200'}`}>
                    <div className="w-5 h-5 rounded-full border-2 border-dashed border-current opacity-50"></div>
                  </div>
                  <span className="text-xs font-medium">None</span>
                </div>
                
                {[
                  { id: 'company', icon: Building2, label: 'Company Logo' },
                  { id: 'grid', icon: Grid3X3, label: 'Grid' },
                  { id: 'dots', icon: AlignJustify, label: 'Dots' },
                  { id: 'icons', icon: Shapes, label: 'Icons' },
                  { id: 'ribbon', icon: Waves, label: 'Ribbon' }
                ].map(pattern => {
                  const isActive = data.backgroundPatterns?.includes(pattern.id);
                  return (
                    <div 
                      key={pattern.id}
                      className={`border rounded-xl p-3 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${isActive ? 'border-primary bg-primary/5 ring-2 ring-primary/20 shadow-sm' : 'hover:border-primary/50 bg-slate-50/50'}`}
                      onClick={() => {
                        let newPatterns = data.backgroundPatterns || [];
                        if (data.combineWatermarks) {
                          if (isActive) {
                            newPatterns = newPatterns.filter(p => p !== pattern.id);
                          } else {
                            // If they select company and company-tiled is selected, remove company-tiled, and vice versa
                            if (pattern.id === 'company') newPatterns = newPatterns.filter(p => p !== 'company-tiled');
                            if (pattern.id === 'company-tiled') newPatterns = newPatterns.filter(p => p !== 'company');
                            newPatterns = [...newPatterns, pattern.id];
                          }
                        } else {
                          newPatterns = [pattern.id];
                        }
                        updateData({ backgroundPatterns: newPatterns });
                      }}
                    >
                      <div className={`p-2 rounded-full ${isActive ? 'bg-primary/10' : 'bg-slate-200'}`}>
                        <pattern.icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-slate-500'}`} />
                      </div>
                      <span className="text-xs font-medium text-center">{pattern.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 4: // Preview - user reviews before generating
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-secondary mb-1">Preview Your Certificate</h2>
              <p className="text-muted-foreground text-sm">
                Review your certificate carefully. Click <strong>"Generate Certificate"</strong> when you're ready.
              </p>
            </div>
            <div 
              ref={previewWrapperRef}
              className="w-full max-w-4xl mx-auto shadow-2xl rounded-xl overflow-hidden ring-1 ring-border relative"
              style={{ height: 850 / 1.414 * previewScale }}
            >
              <div 
                id="certificate-preview-root" 
                className="w-[850px] aspect-[1.414/1] origin-top-left absolute top-0 left-0 bg-white"
                style={{ transform: `scale(${previewScale})` }}
              >
                <CertificatePreview />
              </div>
            </div>
          </div>
        );

      case 5: // Success
        if (isLoading) {
          return (
            <div className="space-y-6 text-center py-20 flex flex-col items-center">
              <Loader2 className="w-16 h-16 text-primary animate-spin mb-4" />
              <h2 className="text-2xl font-bold">Creating your certificate...</h2>
              <p className="text-muted-foreground">Securing on the database and generating verification links.</p>
            </div>
          );
        }
        if (error) {
          return (
            <div className="space-y-6 text-center py-12">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-destructive/10 mb-4">
                <span className="text-destructive text-3xl font-bold">!</span>
              </div>
              <h2 className="text-3xl font-bold">Error</h2>
              <p className="text-muted-foreground">{error}</p>
              <Button onClick={() => setCurrentStep(4)}>Go Back & Retry</Button>
            </div>
          );
        }

        return (
          <div className="animate-in fade-in zoom-in-95 duration-500 max-w-4xl mx-auto">

            {/* Header */}
            <div className="text-center pb-8">
              <h2 className="text-4xl font-extrabold text-secondary tracking-tight mb-2">Your Certificate is Ready!</h2>
              <p className="text-muted-foreground text-lg">
                Your certificate has been successfully generated and verified.
              </p>
            </div>

            {/* Certificate Preview */}
            <div 
              ref={currentStep === 5 ? previewWrapperRef : undefined}
              className="w-full shadow-2xl rounded-2xl overflow-hidden ring-1 ring-border mb-8 relative"
              style={{ height: 850 / 1.414 * previewScale }}
            >
              <div 
                id="certificate-preview-root" 
                className="w-[850px] aspect-[1.414/1] origin-top-left absolute top-0 left-0 bg-white"
                style={{ transform: `scale(${previewScale})` }}
              >
                <CertificatePreview />
              </div>
            </div>

            {/* Verification Section */}
            <div className="bg-slate-50 dark:bg-[#0B0A11] border border-border dark:border-border/10 rounded-2xl p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
              <div className="flex-1 space-y-4 w-full">
                <div className="flex items-center gap-2 text-success font-bold">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Certificate Verified</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Certificate ID</p>
                    <p className="font-mono font-medium text-secondary">{generatedId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Verification</p>
                    <div className="flex items-center gap-1.5 text-secondary font-medium">
                      <CheckCircle2 className="w-4 h-4 text-success" /> QR Verification Enabled
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
                <Button
                  variant="outline"
                  className="h-11 px-5 border-border text-secondary hover:bg-muted font-medium w-full sm:w-auto"
                  onClick={handleCopyLink}
                >
                  {copied ? (
                    <span className="text-success flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Verification link copied!</span>
                  ) : (
                    "Copy Verification Link"
                  )}
                </Button>
                <Button
                  className="h-11 px-5 gap-2 bg-primary hover:bg-primary/90 text-white font-medium w-full sm:w-auto"
                  asChild
                >
                  <a href={generateVerificationUrl(generatedId || "", data)} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4" /> View Verification
                  </a>
                </Button>
              </div>
            </div>

            {/* Download Section */}
            <div className="bg-white dark:bg-secondary/40 border border-border dark:border-border/10 rounded-2xl overflow-hidden shadow-sm mb-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-border">
                {/* PDF Download */}
                <div className="p-8 flex flex-col items-center text-center gap-4 hover:bg-slate-50 dark:hover:bg-secondary/60 transition-colors">
                  <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-2">
                    <FileText className="w-8 h-8 text-red-500" />
                  </div>
                  <div>
                    <p className="font-bold text-secondary text-xl mb-1">Download Certificate</p>
                    <p className="text-muted-foreground text-sm">High-quality printable PDF</p>
                  </div>
                  <Button
                    onClick={handleDownloadPDF}
                    className="w-full h-12 text-base font-bold gap-2 bg-secondary hover:bg-secondary/90 text-white mt-2"
                  >
                    <Download className="w-5 h-5" /> Download PDF
                  </Button>
                </div>

                {/* Image Download */}
                <div className="p-8 flex flex-col items-center text-center gap-4 hover:bg-slate-50 dark:hover:bg-secondary/60 transition-colors">
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-2">
                    <Image className="w-8 h-8 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-bold text-secondary text-xl mb-1">Download Certificate</p>
                    <p className="text-muted-foreground text-sm">High-quality PNG/JPG</p>
                  </div>
                  <Button
                    onClick={handleDownloadImage}
                    variant="outline"
                    className="w-full h-12 text-base font-bold gap-2 border-2 border-border text-secondary hover:bg-muted mt-2"
                  >
                    <Download className="w-5 h-5" /> Download Image
                  </Button>
                </div>
              </div>
            </div>

            {/* Footer action */}
            <div className="text-center pb-8">
              <Button variant="secondary" className="h-12 px-8 font-bold" onClick={() => { reset(); navigate('/create'); }}>
                Create Another Certificate
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-muted/10 relative">
      <div className="max-w-[1600px] mx-auto">
        
        {/* Top Progress Bar */}
        <div className="border-b border-border/10 bg-white dark:bg-[#0B0A11] sticky top-0 z-40 shadow-sm">
          <div className="px-4 py-4 md:py-6 overflow-x-auto hide-scrollbar">
            <div className="flex items-center justify-between min-w-[600px] max-w-4xl mx-auto pb-6">
              {STEPS.map((step, index) => {
                const stepNumber = index + 1;
                const isCompleted = currentStep > stepNumber;
                const isCurrent = currentStep === stepNumber;
                
                return (
                  <div key={step} className="flex items-center flex-1 last:flex-none">
                    <div 
                      className="flex items-center relative cursor-pointer"
                      onClick={() => {
                        if (stepNumber <= 4) {
                          setCurrentStep(stepNumber);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                      }}
                    >
                      <div 
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 z-10 relative ${
                          isCompleted ? 'bg-success text-white' : 
                          isCurrent ? 'bg-primary text-white shadow-md ring-4 ring-primary/20' : 'bg-slate-100 dark:bg-secondary border border-border text-slate-500 dark:text-muted-foreground'
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : stepNumber}
                      </div>
                      <span 
                        className={`absolute -bottom-7 left-1/2 -translate-x-1/2 text-xs font-semibold whitespace-nowrap transition-colors duration-300 ${
                          isCurrent ? 'text-primary' : 'text-muted-foreground'
                        }`}
                      >
                        {step}
                      </span>
                    </div>
                    {index < STEPS.length - 1 && (
                      <div className="flex-1 px-2 md:px-4">
                        <div className={`h-1 w-full rounded-full transition-colors duration-500 ${isCompleted ? 'bg-success' : 'bg-muted'}`} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Layout */}
        <div className="flex flex-col lg:flex-row w-full">
          
          {/* Main Form Area */}
          <div className={`w-full ${currentStep < 5 ? 'lg:w-1/2' : 'lg:w-full'} block p-4 md:p-8 lg:p-12 transition-all duration-500`}>
            <div className={`max-w-2xl mx-auto ${currentStep === 5 ? 'max-w-4xl' : ''}`}>
              
              {renderStepContent()}
              
              {/* Navigation Buttons (hide on success) */}
              {currentStep < 5 && (
                <div className="flex justify-between items-center mt-12 pt-8 border-t">
                  <Button 
                    variant="outline" 
                    onClick={handlePrev}
                    disabled={currentStep === 1}
                    className="h-12 px-6"
                  >
                    Back
                  </Button>
                  

                  <Button 
                    onClick={handleNext}
                    className="h-12 px-8 bg-secondary hover:bg-secondary/90 text-white"
                  >
                    {currentStep === 4 ? "Generate Certificate" : "Continue"}
                    {currentStep < 4 && <ChevronRight className="w-4 h-4 ml-2" />}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Side-by-Side Live Preview - show alongside steps 1-3 */}
          {currentStep < 5 && (
            <div className={`w-full lg:w-1/2 border-l border-border dark:border-border/10 bg-slate-50/50 dark:bg-[#0B0A11] p-4 md:p-8 lg:p-12 lg:sticky lg:top-[5rem] lg:h-[calc(100vh-5rem)] flex-col justify-center overflow-y-auto hide-scrollbar transition-all duration-500 flex`}>
              <div className="max-w-2xl w-full mx-auto space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-secondary dark:text-white text-lg">Live Preview</h3>
                  <div className="bg-white dark:bg-[#0E0C15] px-3 py-1 text-xs font-mono border dark:border-border/20 rounded-full text-muted-foreground flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-success animate-pulse" /> Auto-updating
                  </div>
                </div>
                
                <div 
                ref={livePreviewWrapperRef}
                className="w-full shadow-2xl rounded-xl overflow-hidden ring-1 ring-border bg-white dark:bg-[#0E0C15] sticky top-12 relative"
                style={{ height: 850 / 1.414 * livePreviewScale }}
              >
                <div 
                  className="w-[850px] aspect-[1.414/1] origin-top-left absolute top-0 left-0"
                  style={{ transform: `scale(${livePreviewScale})` }}
                >
                  <CertificatePreview />
                </div>
              </div>
                
                <p className="text-center text-sm text-muted-foreground italic mb-6">
                  This preview updates instantly as you type.
                </p>
                

              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
