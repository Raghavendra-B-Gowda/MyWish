import { useCertificateStore } from "@/store/useCertificateStore";
import { QRCodeSVG } from "qrcode.react";
import { CompanyLogo, COMPANIES } from "./CompanyLogo";
import { CertificateBadge } from "./CertificateBadge";
import { generateVerificationUrl } from "@/utils/verification";

export function CertificatePreview({ demo = false, overrideData }: { demo?: boolean, overrideData?: any }) {
  const store = useCertificateStore();
  const data = overrideData || store.data;
  const generatedId = store.generatedId;
  const certId = demo ? "MW-2026-DEMO" : (overrideData?.id || generatedId || "MW-2026-XXXXXX");
  
  // Verification URL to be encoded in the QR code (strictly use current browser origin)
  const verificationUrl = generateVerificationUrl(certId, data);

  // Shared content helpers
  const DateBlock = ({ date, label }: { date: string, label: string }) => (
    <div className="text-center min-w-[80px] flex flex-col items-center">
      <div className="h-12 flex items-end justify-center mb-1 w-full">
        <p className="font-bold whitespace-nowrap" style={{ color: data.textColor, lineHeight: '1' }}>
          {date ? new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : "—"}
        </p>
      </div>
      <div className="h-px w-full my-1 opacity-20" style={{ backgroundColor: data.textColor }} />
      <p className="text-[10px] uppercase tracking-wider opacity-70 whitespace-nowrap" style={{ color: data.textColor }}>{label}</p>
    </div>
  );

  const SignatureBlock = ({ name, sig, label }: { name: string, sig?: string, label: string }) => {
    const font = data.directorSignatureFont || 'Great Vibes';
    return (
      <div className="text-center min-w-[120px] flex flex-col items-center">
        <div className="h-12 flex items-end justify-center mb-1 w-full relative">
          {sig ? (
            <img src={sig} alt="Signature" className="h-full object-contain mix-blend-multiply" style={{ filter: data.certificateColor !== '#FFFFFF' ? 'brightness(0)' : 'none' }} />
          ) : (
            <span className="text-2xl opacity-80 whitespace-nowrap" style={{ fontFamily: `'${font}', cursive`, color: data.textColor, lineHeight: '1' }}>{name}</span>
          )}
        </div>
        <div className="h-px w-full my-1 opacity-20" style={{ backgroundColor: data.textColor }} />
        <p className="text-[10px] uppercase tracking-wider opacity-70 whitespace-nowrap" style={{ color: data.textColor }}>{label}</p>
      </div>
    );
  };

  const StudentSignatureBlock = () => {
    // If 'ai' mode, we generate a cursive signature of the recipient name
    // If 'manual' mode, we leave it blank
    const sigName = data.studentSignatureMode === 'ai' ? (data.recipientName || "Student Name") : "";
    return (
      <div className="text-center min-w-[120px] flex flex-col items-center">
        <div className="h-12 flex items-end justify-center mb-1 w-full">
          <span className="text-2xl whitespace-nowrap" style={{ fontFamily: "'Qwigley', cursive", color: data.textColor, lineHeight: '1' }}>{sigName}</span>
        </div>
        <div className="h-px w-full my-1 opacity-20" style={{ backgroundColor: data.textColor }} />
        <p className="text-[10px] uppercase tracking-wider opacity-70 whitespace-nowrap" style={{ color: data.textColor }}>Student signature</p>
      </div>
    );
  };

  const QrBlock = ({ size = 64 }: { size?: number }) => (
    <div className="flex flex-col items-center">
      <QRCodeSVG 
        value={verificationUrl} 
        size={size} 
        bgColor="transparent" 
        fgColor={data.textColor} 
        level="L"
        className="opacity-90"
      />
      <p className="text-[10px] mt-2 font-bold tracking-widest opacity-80 whitespace-nowrap" style={{ color: data.textColor }}>CERTIFICATE ID</p>
      <p className="text-[9px] font-mono tracking-wider opacity-60 whitespace-nowrap" style={{ color: data.textColor }}>{certId}</p>
    </div>
  );

  const renderTemplate = () => {
    const renderBadge = (className = "absolute top-12 right-12 z-30", size = 96) => {
      if (!data.showBadge) return null;
      return (
        <div className={className}>
          <CertificateBadge 
            type={data.badgeType || 'seal'} 
            className="opacity-80 scale-110" 
            size={size}
          />
        </div>
      );
    };

    switch (data.templateId) {
      case "modern-blue":
        return (
          <div className="absolute inset-0 overflow-hidden shadow-inner">
            <div className="absolute top-0 right-0 w-full h-[300px] opacity-10" style={{ background: `linear-gradient(135deg, transparent 50%, ${data.accentColor} 50%)` }} />
            <div className="absolute bottom-0 left-0 w-full h-[200px] opacity-5" style={{ background: `linear-gradient(45deg, transparent 50%, ${data.accentColor} 50%)` }} />
            <div className="absolute inset-4 border-[12px] border-white z-10 shadow-sm" />
            <div className="absolute inset-0 border-[24px]" style={{ borderColor: data.textColor }} />
            <div className="relative z-20 flex flex-col h-full p-12">
              <div className="flex justify-between items-start mb-2">
                <CompanyLogo name={data.logoType} textColor={data.textColor} />
                <div className="text-right flex flex-col items-end gap-4">
                  <h2 className="text-xs font-bold tracking-[0.3em] uppercase opacity-80 mt-2 whitespace-nowrap" style={{ color: data.textColor }}>
                    {data.type === 'course' ? 'Certificate of Completion' : 'Certificate of Internship'}
                  </h2>
                  {renderBadge("")}
                </div>
              </div>
              
              <div className="flex-1 flex flex-col justify-center max-w-3xl">
                <p className="text-xs uppercase tracking-widest mb-2 opacity-70 font-semibold" style={{ color: data.textColor }}>This certifies that</p>
                <h3 className="text-7xl font-bold uppercase mb-4" style={{ color: data.textColor, fontFamily: data.font }}>
                  {data.recipientName || "Recipient Name"}
                </h3>
                <p className="text-base leading-relaxed" style={{ color: data.textColor }}>
                  has successfully completed {data.durationValue || "X"} {data.durationType} of {data.type === 'course' ? 'the course' : 'the internship'}:
                </p>
                <h4 className="text-2xl font-bold mb-2 leading-tight" style={{ color: data.textColor, fontFamily: data.font }}>
                  {data.type === 'course' ? data.courseName || "Course Name" : data.internshipRole || "Internship Role"}
                </h4>
                {data.description && <p className="text-xs opacity-70 leading-relaxed max-w-2xl font-medium" style={{ color: data.textColor }}>{data.description}</p>}
              </div>

              <div className="flex justify-between items-end mt-4">
                <div className="flex gap-8 items-end">
                  <DateBlock date={data.issueDate} label="Date of Issue" />
                  <SignatureBlock name={data.directorName || "Director"} sig={data.directorSignature} label="Director" />
                  <StudentSignatureBlock />
                </div>
                <div className="bg-white p-2 shadow-sm rounded-xl ring-1 ring-black/5">
                  <QrBlock size={64} />
                </div>
              </div>
            </div>
          </div>
        );

      case "premium-gold":
        return (
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-8 border-[2px]" style={{ borderColor: data.accentColor, outline: `4px solid ${data.accentColor}`, outlineOffset: '-10px' }} />
            
            <div className="absolute top-6 left-6 w-10 h-10 border-t-4 border-l-4" style={{ borderColor: data.accentColor }} />
            <div className="absolute top-6 right-6 w-10 h-10 border-t-4 border-r-4" style={{ borderColor: data.accentColor }} />
            <div className="absolute bottom-6 left-6 w-10 h-10 border-b-4 border-l-4" style={{ borderColor: data.accentColor }} />
            <div className="absolute bottom-6 right-6 w-10 h-10 border-b-4 border-r-4" style={{ borderColor: data.accentColor }} />
            {renderBadge("absolute top-16 right-16 z-30")}

            <div className="relative z-10 flex flex-col h-full items-center justify-between text-center px-16 py-12">
              <div className="w-full flex justify-center mt-2">
                <CompanyLogo name={data.logoType} className="justify-center" textColor={data.textColor} />
              </div>
              
              <div className="flex-1 flex flex-col items-center justify-center">
                <h2 className="text-3xl uppercase tracking-[0.4em] mb-4 font-bold" style={{ color: data.accentColor, fontFamily: data.font }}>
                  Certificate of {data.type === 'course' ? 'Completion' : 'Achievement'}
                </h2>
                <p className="text-sm italic opacity-80 mb-4" style={{ color: data.textColor }}>This is to certify that</p>
                
                <h2 className="text-7xl font-black mb-6 tracking-normal uppercase" style={{ color: data.textColor, fontFamily: data.font }}>
                  {data.recipientName || "Recipient Name"}
                </h2>
                
                <p className="text-base mb-12 opacity-80 max-w-lg mx-auto" style={{ color: data.textColor }}>
                  has successfully completed {data.durationValue || "X"} {data.durationType} as <strong style={{ color: data.accentColor }}>{data.type === 'course' ? data.courseName || "Course Name" : data.internshipRole || "Internship Role"}</strong>
                </p>
                {data.description && <p className="text-xs opacity-70 mt-1 max-w-2xl mx-auto italic" style={{ color: data.textColor }}>"{data.description}"</p>}
              </div>

              <div className="w-full flex justify-between items-end pb-2 px-4">
                <div className="flex-1 flex justify-start"><DateBlock date={data.issueDate} label="Date Issued" /></div>
                <div className="flex-1 flex justify-center gap-6">
                  <SignatureBlock name={data.directorName || "Director"} sig={data.directorSignature} label="Director" />
                  <StudentSignatureBlock />
                </div>
                <div className="flex-1 flex justify-end"><QrBlock size={64} /></div>
              </div>
            </div>
          </div>
        );

      case "internship":
        const internSidebarText = data.badgeType === 'academic' ? 'ACHIEVEMENT' : 'CERTIFIED';
        // Dynamic sizing: longer words get smaller text and tracking so they don't overflow
        const internTextSizeClass = internSidebarText.length > 9 ? 'text-xl tracking-[0.5em]' : 'text-2xl tracking-[0.8em]';
        return (
          <div className="absolute inset-0 flex shadow-inner">
            <div className="w-[100px] shrink-0 h-full relative flex flex-col items-center justify-between py-8 overflow-hidden" style={{ backgroundColor: data.accentColor }}>
              <div className="absolute inset-0 opacity-20 z-0" style={{ backgroundImage: 'radial-gradient(circle at center, white 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
              <div className="flex-1 flex items-center justify-center relative z-10 w-full pt-4">
                <p className={`text-white font-black opacity-30 whitespace-nowrap ${internTextSizeClass}`} style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>{internSidebarText}</p>
              </div>
              {renderBadge("relative z-20 mt-4", 72)}
            </div>
            <div className="w-3 shrink-0 h-full opacity-30" style={{ backgroundColor: data.textColor }}></div>
            
            <div className="flex-1 flex flex-col h-full p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 rounded-bl-full opacity-5" style={{ backgroundColor: data.accentColor }}></div>
              
              <div className="flex justify-between items-center mb-6">
                <CompanyLogo name={data.logoType} textColor={data.textColor} />
                <div className="flex items-center gap-6">
                  <h2 className="text-lg font-black uppercase tracking-widest" style={{ color: data.accentColor, fontFamily: data.font }}>
                    Internship Certificate
                  </h2>
                </div>
              </div>
              
              <div className="flex-1 flex flex-col justify-center">
                <p className="text-xs font-bold uppercase tracking-wider mb-2 opacity-50" style={{ color: data.textColor }}>Presented To</p>
                <h2 className="text-7xl font-black mb-6 tracking-normal uppercase" style={{ color: data.textColor, fontFamily: data.font }}>
                  {data.recipientName || "Recipient Name"}
                </h2>
                <div className="bg-white/50 p-6 rounded-2xl border mb-6" style={{ borderColor: `${data.textColor}10` }}>
                  <p className="text-base font-medium leading-relaxed opacity-80" style={{ color: data.textColor }}>
                    For successful completion of the {data.type === 'course' ? 'training' : 'internship'} program in the role of <strong style={{ color: data.accentColor }}>{data.type === 'course' ? data.courseName || "Course Name" : data.internshipRole || "Internship Role"}</strong>.
                  </p>
                  <p className="text-sm font-bold uppercase tracking-wider opacity-60 mt-4" style={{ color: data.textColor }}>Program Duration: {data.durationValue || "X"} {data.durationType}</p>
                </div>
                {data.description && <p className="text-xs opacity-70 mt-4 max-w-3xl leading-relaxed" style={{ color: data.textColor }}>{data.description}</p>}
              </div>

              <div className="flex justify-between items-end mt-6 pt-4 border-t" style={{ borderColor: `${data.textColor}15` }}>
                <DateBlock date={data.issueDate} label="Issuance Date" />
                <div className="flex gap-4 items-center">
                  <SignatureBlock name={data.directorName || "Director"} sig={data.directorSignature} label="Director" />
                  <StudentSignatureBlock />
                </div>
                <div className="flex items-center gap-3 bg-white shadow-sm p-2 rounded-xl border border-gray-100 ring-1 ring-black/5">
                  <div className="text-right">
                    <p className="text-[9px] font-bold uppercase tracking-widest opacity-60" style={{ color: data.textColor }}>Verified</p>
                    <p className="text-[9px] font-mono opacity-80 whitespace-nowrap" style={{ color: data.textColor }}>{certId}</p>
                  </div>
                   <QRCodeSVG value={verificationUrl} size={48} level="L" fgColor={data.textColor} />
                </div>
              </div>
            </div>
          </div>
        );

      case "minimal":
        return (
          <div className="absolute inset-0 p-10 shadow-inner">
            <div className="w-full h-full border-[1px] relative p-10 flex flex-col text-center items-center justify-between" style={{ borderColor: `${data.textColor}20` }}>
              {renderBadge("absolute top-8 right-8 z-30")}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6" style={{ backgroundColor: data.certificateColor || '#FFFFFF' }}>
                <CompanyLogo name={data.logoType} className="justify-center" textColor={data.textColor} />
              </div>
              
              <div className="flex-1 flex flex-col justify-center w-full">
                <p className="text-[10px] font-bold uppercase tracking-[0.5em] opacity-40 mb-6 mt-4" style={{ color: data.textColor }}>Certificate of {data.type}</p>
                
                <h3 className="text-6xl font-serif italic mb-4" style={{ color: data.textColor, fontFamily: data.font }}>
                  {data.recipientName || "Recipient Name"}
                </h3>
                
                <div className="w-16 h-[2px] mx-auto mb-6" style={{ backgroundColor: data.accentColor }}></div>

                <p className="text-base opacity-80 font-serif leading-relaxed" style={{ color: data.textColor }}>
                  Has successfully fulfilled the requirements and completed {data.durationValue || "X"} {data.durationType} of {data.type === 'course' ? data.courseName || "Course Name" : data.internshipRole || "Internship Role"}.
                </p>
                {data.description && <p className="text-xs opacity-50 max-w-xl mx-auto" style={{ color: data.textColor }}>{data.description}</p>}
              </div>
              
              <div className="w-full flex justify-between items-end px-8 pt-4">
                <div className="flex items-end gap-6">
                  <DateBlock date={data.issueDate} label="Date" />
                  <QrBlock size={56} />
                </div>
                <div className="flex gap-6 items-end">
                   <SignatureBlock name={data.directorName || "Director"} sig={data.directorSignature} label="Director" />
                   <StudentSignatureBlock />
                </div>
              </div>
            </div>
          </div>
        );

      case "tech-innovator":
        return (
          <div className="absolute inset-0 overflow-hidden shadow-inner flex flex-col">
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/3" style={{ backgroundColor: data.accentColor }} />
            <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-2xl opacity-10 translate-y-1/3 -translate-x-1/4" style={{ backgroundColor: data.accentColor }} />
            
            <div className="relative z-10 flex justify-between items-center px-12 py-8 border-b" style={{ borderColor: `${data.textColor}10` }}>
              <CompanyLogo name={data.logoType} textColor={data.textColor} />
              <div className="flex items-center gap-8 text-right">
                {renderBadge("")}
                <div>
                  <p className="text-xs font-mono opacity-50 tracking-widest uppercase mb-1" style={{ color: data.textColor }}>ID: {certId}</p>
                  <p className="text-xs font-mono opacity-50 tracking-widest uppercase" style={{ color: data.textColor }}>{data.type === 'course' ? 'COURSE' : 'INTERNSHIP'}</p>
                </div>
              </div>
            </div>

            <div className="relative z-10 flex-1 flex flex-col justify-center px-16 border-l-4 ml-8 my-4" style={{ borderColor: data.accentColor }}>
              <h2 className="text-lg font-mono mb-2" style={{ color: data.accentColor }}>// CERTIFICATE_GRANTED</h2>
              <h3 className="text-7xl font-black mb-4 uppercase tracking-tighter" style={{ color: data.textColor, fontFamily: data.font }}>
                {data.recipientName || "Recipient Name"}
              </h3>
              <p className="text-base opacity-80" style={{ color: data.textColor }}>
                &gt; successfully completed {data.durationValue || "X"} {data.durationType} of {data.type === 'course' ? data.courseName || "Course Name" : data.internshipRole || "Internship Role"}
              </p>
              {data.description && <p className="text-xs opacity-60 font-mono max-w-2xl leading-relaxed" style={{ color: data.textColor }}>/* {data.description} */</p>}
            </div>

            <div className="relative z-10 flex justify-between items-end px-12 pb-8 pt-4">
              <div className="flex gap-8 items-end">
                <DateBlock date={data.issueDate} label="Compiled Date" />
                <SignatureBlock name={data.directorName || "Director"} sig={data.directorSignature} label="Lead Instructor" />
                <StudentSignatureBlock />
              </div>
              <div className="flex items-center gap-4 bg-white/50 backdrop-blur-sm p-3 rounded-xl ring-1 ring-black/5">
                <div className="text-right">
                  <p className="text-[10px] font-mono opacity-60 uppercase" style={{ color: data.textColor }}>Scannable Hash</p>
                </div>
                <div className="p-2 rounded-lg shadow-sm" style={{ backgroundColor: `${data.textColor}10` }}>
                  <QrBlock size={56} />
                </div>
              </div>
            </div>
          </div>
        );

      case "academic-classic":
        return (
          <div className="absolute inset-0 shadow-inner flex p-8">
            <div className="w-full h-full border-[8px] flex relative" style={{ borderColor: data.accentColor, borderStyle: 'double' }}>
              
              <div className="w-[80px] shrink-0 h-full border-r-[3px] flex flex-col justify-center items-center relative overflow-hidden" style={{ borderColor: data.accentColor }}>
                <div className="absolute inset-0 opacity-10" style={{ backgroundColor: data.accentColor }} />
                <p className="transform -rotate-90 text-lg font-bold tracking-[0.3em] uppercase whitespace-nowrap opacity-20" style={{ color: data.textColor, fontFamily: data.font }}>
                  Official Document
                </p>
              </div>
              
              <div className="flex-1 flex flex-col h-full px-12 py-8 relative">
                <div className="flex justify-between items-start mb-4">
                  <CompanyLogo name={data.logoType} textColor={data.textColor} />
                  <div className="flex flex-col items-end gap-3">
                    <h2 className="text-xs font-bold uppercase tracking-[0.3em] opacity-60 text-right whitespace-nowrap" style={{ color: data.textColor }}>
                      Certificate of {data.type === 'course' ? 'Completion' : 'Excellence'}
                    </h2>
                    {renderBadge("")}
                  </div>
                </div>
                
                <div className="flex-1 flex flex-col justify-center items-center text-center">
                  <h3 className="text-7xl font-bold uppercase tracking-widest mb-6" style={{ color: data.textColor, fontFamily: data.font }}>
                    {data.recipientName || "Recipient Name"}
                  </h3>
                  <div className="w-24 h-[1px] mx-auto mb-6" style={{ backgroundColor: `${data.textColor}40` }}></div>
                  <p className="text-base leading-relaxed" style={{ color: data.textColor }}>
                    Has fulfilled the requirements and successfully completed the {data.type === 'course' ? data.courseName || "Course Name" : data.internshipRole || "Internship Role"} program, spanning a duration of {data.durationValue || "X"} {data.durationType}.
                  </p>
                  {data.description && <p className="text-xs opacity-70 mt-4 max-w-xl italic font-serif" style={{ color: data.textColor }}>{data.description}</p>}
                </div>

                <div className="flex justify-between items-end mt-4">
                  <DateBlock date={data.issueDate} label="Date of Award" />
                  <QrBlock size={56} />
                  <div className="flex gap-6">
                    <SignatureBlock name={data.directorName || "Director"} sig={data.directorSignature} label="Dean / Director" />
                    <StudentSignatureBlock />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "corporate-modern":
        return (
          <div className="absolute inset-0 overflow-hidden shadow-inner flex flex-col justify-between">
            <div className="h-4 w-full" style={{ backgroundColor: data.accentColor }} />
            
            <div className="flex-1 flex flex-col p-12">
              <div className="flex justify-between items-start mb-6">
                <CompanyLogo name={data.logoType} textColor={data.textColor} />
                {renderBadge("absolute top-8 right-12 z-30")}
                <div className="flex flex-col items-end gap-4 text-right">
                  <div>
                    <h2 className="text-xl font-bold uppercase tracking-wider mt-4" style={{ color: data.accentColor, fontFamily: data.font }}>
                      {data.type === 'course' ? 'Certificate of Completion' : 'Certificate of Internship'}
                    </h2>
                    <p className="text-xs font-semibold opacity-50 uppercase tracking-widest mt-1" style={{ color: data.textColor }}>ID: {certId}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 flex gap-12 items-center">
                <div className="w-2/3">
                  <p className="text-xs font-bold uppercase tracking-widest mb-2 opacity-50" style={{ color: data.textColor }}>Awarded To</p>
                  <h3 className="text-6xl font-serif italic font-bold mb-6" style={{ color: data.textColor, fontFamily: data.font }}>
                    {data.recipientName || "Recipient Name"}
                  </h3>
                  <p className="text-base italic opacity-80 leading-relaxed mb-10" style={{ color: data.textColor }}>
                    For the successful completion of {data.durationValue || "X"} {data.durationType} of {data.type === 'course' ? 'the following course:' : 'the internship role of:'}<br/>
                    <strong className="text-xl not-italic block mt-2" style={{ color: data.accentColor }}>{data.type === 'course' ? data.courseName || "Course Name" : data.internshipRole || "Internship Role"}</strong>
                  </p>
                  {data.description && <p className="text-xs opacity-70 leading-relaxed font-medium bg-black/5 p-4 rounded-lg" style={{ color: data.textColor }}>{data.description}</p>}
                </div>
                
                <div className="w-1/3 flex flex-col items-end justify-center gap-6 border-l pl-8" style={{ borderColor: `${data.textColor}15` }}>
                  <SignatureBlock name={data.directorName || "Director"} sig={data.directorSignature} label="Director" />
                  <StudentSignatureBlock />
                </div>
              </div>

              <div className="flex justify-between items-end mt-4 pt-4 border-t" style={{ borderColor: `${data.textColor}15` }}>
                <DateBlock date={data.issueDate} label="Date Issued" />
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold uppercase opacity-50 tracking-widest" style={{ color: data.textColor }}>Scan Verification</span>
                  <div className="bg-white p-1 rounded border shadow-sm">
                     <QrBlock size={48} />
                  </div>
                </div>
              </div>
            </div>

            <div className="h-16 w-full flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: data.accentColor }}>
               <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)', backgroundSize: '10px 10px', backgroundPosition: '0 0, 5px 5px' }} />
               <p className="text-xs font-bold uppercase tracking-[0.5em] text-white opacity-90 z-10">Official Recognition</p>
            </div>
          </div>
        );

      case "geometric-pulse":
        return (
          <div className="absolute inset-0 overflow-hidden shadow-inner flex flex-col justify-between z-10">
            {/* Geometric Orbs */}
            <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full mix-blend-multiply opacity-20" style={{ backgroundColor: data.accentColor, filter: 'blur(12px)' }} />
            <div className="absolute top-32 right-12 w-32 h-32 rounded-full mix-blend-multiply opacity-40" style={{ backgroundColor: data.accentColor }} />
            <div className="absolute bottom-16 -right-16 w-80 h-80 rounded-full mix-blend-multiply opacity-10" style={{ backgroundColor: data.accentColor, filter: 'blur(20px)' }} />
            <div className="absolute bottom-32 left-32 w-16 h-16 rounded-full mix-blend-multiply opacity-60" style={{ backgroundColor: data.accentColor }} />
            <div className="absolute top-1/2 left-1/4 w-8 h-8 rounded-full mix-blend-multiply opacity-80" style={{ backgroundColor: data.accentColor }} />
            <div className="absolute top-1/3 right-1/3 w-4 h-4 rounded-full mix-blend-multiply opacity-90" style={{ backgroundColor: data.accentColor }} />
            
            {/* Dots array */}
            <div className="absolute top-8 right-8 w-24 h-24 opacity-30" style={{ backgroundImage: `radial-gradient(${data.accentColor} 3px, transparent 3px)`, backgroundSize: '12px 12px' }} />
            <div className="absolute bottom-8 left-8 w-32 h-16 opacity-20" style={{ backgroundImage: `radial-gradient(${data.accentColor} 3px, transparent 3px)`, backgroundSize: '12px 12px' }} />

            <div className="relative z-20 flex-1 flex flex-col p-12">
              <div className="flex justify-between items-start mb-8">
                <CompanyLogo name={data.logoType} textColor={data.textColor} />
                <div className="flex items-center gap-6">
                  {renderBadge("")}
                  <div className="text-right">
                    <p className="text-[10px] font-bold tracking-[0.3em] uppercase opacity-50" style={{ color: data.textColor }}>ID: {certId}</p>
                    <h2 className="text-lg font-black uppercase tracking-widest mt-1" style={{ color: data.accentColor, fontFamily: data.font }}>
                      Certificate of {data.type === 'course' ? 'Completion' : 'Excellence'}
                    </h2>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 flex flex-col justify-center">
                <p className="text-sm font-bold uppercase tracking-[0.2em] mb-4 opacity-60" style={{ color: data.textColor }}>Awarded To</p>
                <h3 className="text-7xl font-black mb-6 tracking-tight" style={{ color: data.textColor, fontFamily: data.font }}>
                  {data.recipientName || "Recipient Name"}
                </h3>
                <div className="h-1 w-24 mb-6" style={{ backgroundColor: data.accentColor }} />
                <p className="text-base leading-relaxed opacity-80 max-w-2xl font-medium" style={{ color: data.textColor }}>
                  For successfully fulfilling the requirements and completing {data.durationValue || "X"} {data.durationType} of {data.type === 'course' ? data.courseName || "Course Name" : data.internshipRole || "Internship Role"}.
                </p>
                {data.description && <p className="text-xs opacity-60 mt-4 max-w-xl" style={{ color: data.textColor }}>{data.description}</p>}
              </div>

              <div className="flex justify-between items-end mt-8 border-t-2 pt-4" style={{ borderColor: `${data.textColor}10` }}>
                <DateBlock date={data.issueDate} label="Issue Date" />
                <div className="flex gap-8 items-center">
                  <SignatureBlock name={data.directorName || "Director"} sig={data.directorSignature} label="Director" />
                  <StudentSignatureBlock />
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-2 rounded-xl shadow-sm border" style={{ borderColor: `${data.textColor}10` }}>
                   <QrBlock size={64} />
                </div>
              </div>
            </div>
          </div>
        );
      case "geometric-orbit":
        return (
          <div className="absolute inset-0 overflow-hidden shadow-inner flex flex-col justify-between z-10">
            {/* Concentric Rings */}
            <div className="absolute -top-64 -left-64 w-[600px] h-[600px] rounded-full border-[40px] opacity-10" style={{ borderColor: data.accentColor }} />
            <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full border-[2px] opacity-20" style={{ borderColor: data.accentColor }} />
            <div className="absolute top-1/2 -right-48 w-96 h-96 rounded-full border-[10px] opacity-15" style={{ borderColor: data.accentColor }} />
            <div className="absolute -bottom-32 right-32 w-[400px] h-[400px] rounded-full border-[1px] opacity-30" style={{ borderColor: data.accentColor }} />
            <div className="absolute bottom-16 right-64 w-32 h-32 rounded-full border-[4px] border-dashed opacity-40" style={{ borderColor: data.accentColor }} />
            
            {/* Small solid planets */}
            <div className="absolute top-24 right-1/4 w-4 h-4 rounded-full opacity-80" style={{ backgroundColor: data.accentColor }} />
            <div className="absolute bottom-1/3 left-1/3 w-8 h-8 rounded-full opacity-50" style={{ backgroundColor: data.accentColor }} />
            <div className="absolute top-1/2 left-24 w-2 h-2 rounded-full opacity-100" style={{ backgroundColor: data.accentColor }} />

            <div className="relative z-20 flex-1 flex flex-col p-12 items-center text-center">
              <div className="w-full flex justify-between items-center mb-8">
                <CompanyLogo name={data.logoType} textColor={data.textColor} />
                {renderBadge("")}
              </div>
              
              <div className="flex-1 flex flex-col justify-center items-center w-full max-w-4xl mx-auto">
                <h2 className="text-xl font-bold uppercase tracking-[0.5em] mb-8" style={{ color: data.accentColor, fontFamily: data.font }}>
                  {data.type === 'course' ? 'Certificate of Completion' : 'Certificate of Excellence'}
                </h2>
                
                <h3 className="text-7xl font-bold mb-6 tracking-normal leading-tight" style={{ color: data.textColor, fontFamily: data.font }}>
                  {data.recipientName || "Recipient Name"}
                </h3>
                
                <div className="w-32 h-0.5 mb-8 opacity-20" style={{ backgroundColor: data.textColor }} />
                
                <p className="text-lg leading-relaxed opacity-80 max-w-2xl" style={{ color: data.textColor }}>
                  Is proudly presented this certificate for fulfilling the requirements of the {data.type === 'course' ? 'course' : 'internship'} program <strong style={{ color: data.accentColor }}>{data.type === 'course' ? data.courseName || "Course Name" : data.internshipRole || "Internship Role"}</strong> spanning {data.durationValue || "X"} {data.durationType}.
                </p>
                {data.description && <p className="text-sm opacity-60 mt-6 max-w-xl italic" style={{ color: data.textColor }}>{data.description}</p>}
              </div>

              <div className="w-full flex justify-between items-end mt-8 bg-white/50 backdrop-blur-md p-6 rounded-2xl shadow-sm border" style={{ borderColor: `${data.textColor}10` }}>
                <DateBlock date={data.issueDate} label="Recorded Date" />
                <div className="flex gap-12 items-center">
                  <SignatureBlock name={data.directorName || "Director"} sig={data.directorSignature} label="Director" />
                  <StudentSignatureBlock />
                </div>
                <QrBlock size={56} />
              </div>
            </div>
          </div>
        );

      case "geometric-blocks":
        return (
          <div className="absolute inset-0 overflow-hidden shadow-inner flex flex-col justify-between z-10">
            {/* Geometric Blocks */}
            <div className="absolute top-12 left-12 w-32 h-32 opacity-10 rotate-12" style={{ backgroundColor: data.accentColor }} />
            <div className="absolute -top-16 right-32 w-48 h-48 opacity-20 rotate-45 border-8" style={{ borderColor: data.accentColor }} />
            <div className="absolute bottom-24 -left-12 w-24 h-24 opacity-30 -rotate-12 border-4" style={{ borderColor: data.accentColor }} />
            <div className="absolute -bottom-32 right-12 w-64 h-64 opacity-15 rotate-3 border-2" style={{ borderColor: data.accentColor }} />
            <div className="absolute top-1/2 right-1/4 w-8 h-8 opacity-60 rotate-45" style={{ backgroundColor: data.accentColor }} />
            <div className="absolute top-1/3 left-1/3 w-4 h-4 opacity-80 rotate-12 border-2" style={{ borderColor: data.accentColor }} />
            
            {/* Grid dot fields */}
            <div className="absolute top-1/2 left-8 w-16 h-32 opacity-30" style={{ backgroundImage: `radial-gradient(${data.accentColor} 2px, transparent 2px)`, backgroundSize: '8px 8px' }} />
            <div className="absolute bottom-1/4 right-8 w-24 h-24 opacity-20" style={{ backgroundImage: `radial-gradient(${data.accentColor} 2px, transparent 2px)`, backgroundSize: '8px 8px' }} />

            <div className="relative z-20 flex-1 flex flex-col p-12">
              <div className="flex justify-between items-start mb-8 border-b-2 pb-6" style={{ borderColor: `${data.textColor}10` }}>
                <div className="flex items-center gap-6">
                  <CompanyLogo name={data.logoType} textColor={data.textColor} />
                  <div className="h-12 w-[2px] opacity-20" style={{ backgroundColor: data.textColor }} />
                  <div>
                    <h2 className="text-xl font-bold uppercase tracking-widest" style={{ color: data.accentColor, fontFamily: data.font }}>
                      {data.type === 'course' ? 'Certificate of Completion' : 'Certificate of Excellence'}
                    </h2>
                    <p className="text-[10px] font-bold tracking-[0.3em] uppercase opacity-50 mt-1" style={{ color: data.textColor }}>ID: {certId}</p>
                  </div>
                </div>
                {renderBadge("")}
              </div>
              
              <div className="flex-1 flex flex-col justify-center">
                <p className="text-sm font-bold uppercase tracking-[0.2em] mb-2 opacity-60" style={{ color: data.textColor }}>Awarded To</p>
                <h3 className="text-7xl font-black mb-6 tracking-normal uppercase" style={{ color: data.textColor, fontFamily: data.font }}>
                  {data.recipientName || "Recipient Name"}
                </h3>
                <p className="text-base leading-relaxed opacity-80 max-w-3xl font-medium p-6 bg-white/40 backdrop-blur-sm rounded-xl border-l-4" style={{ color: data.textColor, borderLeftColor: data.accentColor }}>
                  For successful participation and completion of the {data.type === 'course' ? 'course' : 'internship program'} titled <strong style={{ color: data.accentColor }}>{data.type === 'course' ? data.courseName || "Course Name" : data.internshipRole || "Internship Role"}</strong>, dedicating {data.durationValue || "X"} {data.durationType} to professional growth and development.
                </p>
                {data.description && <p className="text-xs opacity-60 mt-4 max-w-xl italic" style={{ color: data.textColor }}>{data.description}</p>}
              </div>

              <div className="flex justify-between items-end mt-8">
                <DateBlock date={data.issueDate} label="Issue Date" />
                <div className="flex gap-12 items-center">
                  <SignatureBlock name={data.directorName || "Director"} sig={data.directorSignature} label="Director" />
                  <StudentSignatureBlock />
                </div>
                <div className="bg-white p-2 rounded shadow-sm border border-slate-100">
                   <QrBlock size={64} />
                </div>
              </div>
            </div>
          </div>
        );
      case "angular-edge":
        return (
          <div className="absolute inset-0 overflow-hidden shadow-inner flex flex-col z-10">
            {/* Half-cut triangles on sides */}
            <div className="absolute top-0 left-0 w-64 h-full opacity-10" style={{ backgroundColor: data.accentColor, clipPath: 'polygon(0 0, 100% 0, 0 100%)' }} />
            <div className="absolute bottom-0 right-0 w-96 h-full opacity-20" style={{ backgroundColor: data.accentColor, clipPath: 'polygon(100% 100%, 100% 0, 0 100%)' }} />
            <div className="absolute top-0 right-0 w-32 h-32 opacity-80" style={{ backgroundColor: data.accentColor, clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }} />
            <div className="absolute bottom-0 left-0 w-48 h-48 opacity-60" style={{ backgroundColor: data.accentColor, clipPath: 'polygon(0 100%, 0 0, 100% 100%)' }} />
            
            <div className="relative z-20 flex-1 flex flex-col p-10 border-8 m-4" style={{ borderColor: `${data.textColor}08` }}>
              <div className="flex justify-between items-center mb-8 border-b-2 pb-4" style={{ borderColor: `${data.textColor}10` }}>
                <CompanyLogo name={data.logoType} textColor={data.textColor} />
                <div className="flex gap-4 items-center">
                   {renderBadge("", 72)}
                   <QrBlock size={48} />
                </div>
              </div>
              
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <h2 className="text-xl font-bold uppercase tracking-[0.4em] mb-2" style={{ color: data.accentColor, fontFamily: data.font }}>
                  {data.type === 'course' ? 'Certificate of Completion' : 'Certificate of Achievement'}
                </h2>
                <p className="text-xs uppercase tracking-widest opacity-50 mb-8" style={{ color: data.textColor }}>Officially Presented To</p>
                
                <h3 className="text-7xl font-black uppercase tracking-normal mb-8" style={{ color: data.textColor, fontFamily: data.font }}>
                  {data.recipientName || "Recipient Name"}
                </h3>
                
                <p className="text-sm font-medium leading-relaxed max-w-2xl opacity-80 bg-white/50 p-6 rounded-lg backdrop-blur-md" style={{ color: data.textColor, borderLeft: `4px solid ${data.accentColor}` }}>
                  Has successfully completed the {data.type === 'course' ? 'training program' : 'internship'} in <strong style={{ color: data.accentColor }}>{data.type === 'course' ? data.courseName || "Course Name" : data.internshipRole || "Internship Role"}</strong> over a duration of {data.durationValue || "X"} {data.durationType}.
                </p>
                {data.description && <p className="text-xs opacity-70 mt-6 max-w-2xl" style={{ color: data.textColor }}>{data.description}</p>}
              </div>

              <div className="flex justify-between items-end mt-8 px-8">
                <div className="flex gap-12">
                   <SignatureBlock name={data.directorName || "Director"} sig={data.directorSignature} label="Director" />
                   <StudentSignatureBlock />
                </div>
                <div className="text-right">
                  <DateBlock date={data.issueDate} label="Date Issued" />
                </div>
              </div>
            </div>
          </div>
        );

      case "hexagonal-lattice":
        const hexSidebarText = data.badgeType === 'academic' ? 'ACHIEVEMENT' : 'CERTIFIED';
        // Dynamic sizing: longer words get smaller text and tracking so they don't overflow
        const hexTextSizeClass = hexSidebarText.length > 9 ? 'text-xl tracking-[0.5em]' : 'text-2xl tracking-[0.8em]';
        return (
          <div className="absolute inset-0 overflow-hidden shadow-inner flex z-10">
            {/* Hexagon Side Panel */}
            <div className="w-1/4 h-full relative flex flex-col items-center justify-between py-12" style={{ backgroundColor: data.accentColor }}>
               <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='69' viewBox='0 0 40 69' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0L40 11.5v23L20 46 0 34.5v-23L20 0zm0 69L0 57.5v-23l20 11.5 20-11.5v23L20 69z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")` }} />
               <div className="flex-1 flex items-center justify-center relative z-10 w-full pt-4">
                 <p className={`text-white font-black opacity-30 whitespace-nowrap ${hexTextSizeClass}`} style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>{hexSidebarText}</p>
               </div>
               {renderBadge("relative z-20 mt-4", 72)}
            </div>
            
            {/* Floating Hexagons */}
            <div className="absolute top-12 right-24 w-16 h-16 opacity-10" style={{ backgroundColor: data.accentColor, clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }} />
            <div className="absolute bottom-24 right-12 w-24 h-24 opacity-5" style={{ backgroundColor: data.accentColor, clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }} />
            <div className="absolute top-1/2 right-48 w-8 h-8 opacity-20" style={{ backgroundColor: data.accentColor, clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }} />

            <div className="flex-1 flex flex-col p-12 relative">
              <div className="flex justify-between items-start mb-8">
                <CompanyLogo name={data.logoType} textColor={data.textColor} />
                <div className="bg-white p-2 rounded shadow-sm border border-slate-100">
                   <QrBlock size={56} />
                </div>
              </div>
              
              <div className="flex-1 flex flex-col justify-center">
                <div className="inline-block px-4 py-1 mb-6 rounded-full text-xs font-bold uppercase tracking-widest" style={{ backgroundColor: `${data.accentColor}15`, color: data.accentColor }}>
                  {data.type === 'course' ? 'Certificate of Completion' : 'Certificate of Excellence'}
                </div>
                
                <p className="text-xs uppercase tracking-widest opacity-50 mb-2" style={{ color: data.textColor }}>Presented To</p>
                <h3 className="text-6xl font-black mb-6 uppercase tracking-tight" style={{ color: data.textColor, fontFamily: data.font }}>
                  {data.recipientName || "Recipient Name"}
                </h3>
                
                <p className="text-base font-medium opacity-80 max-w-xl leading-relaxed mb-4" style={{ color: data.textColor }}>
                  For successfully completing {data.durationValue || "X"} {data.durationType} of the {data.type === 'course' ? 'course' : 'internship'} in <span className="font-bold" style={{ color: data.accentColor }}>{data.type === 'course' ? data.courseName || "Course Name" : data.internshipRole || "Internship Role"}</span>.
                </p>
                {data.description && <p className="text-xs opacity-60 max-w-lg border-l-2 pl-3 py-1" style={{ color: data.textColor, borderColor: data.accentColor }}>{data.description}</p>}
              </div>

              <div className="flex justify-between items-end mt-8 border-t pt-6" style={{ borderColor: `${data.textColor}10` }}>
                <DateBlock date={data.issueDate} label="Date" />
                <div className="flex gap-8">
                   <SignatureBlock name={data.directorName || "Director"} sig={data.directorSignature} label="Director" />
                   <StudentSignatureBlock />
                </div>
              </div>
            </div>
          </div>
        );

      case "abstract-wave":
        return (
          <div className="absolute inset-0 overflow-hidden shadow-inner flex flex-col z-10">
            {/* Abstract Waves */}
            <div className="absolute -top-[400px] -right-[200px] w-[800px] h-[800px] rounded-[40%] opacity-10 animate-[spin_60s_linear_infinite]" style={{ backgroundColor: data.accentColor }} />
            <div className="absolute -bottom-[400px] -left-[100px] w-[600px] h-[600px] rounded-[35%] opacity-15 animate-[spin_40s_linear_infinite_reverse]" style={{ backgroundColor: data.accentColor }} />
            
            <div className="absolute inset-8 border border-dashed rounded-3xl z-10" style={{ borderColor: `${data.textColor}30` }} />
            
            <div className="relative z-20 flex-1 flex flex-col p-12">
              <div className="flex justify-between items-center mb-6">
                <CompanyLogo name={data.logoType} textColor={data.textColor} />
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <h2 className="text-2xl font-bold italic" style={{ color: data.accentColor, fontFamily: data.font }}>
                      {data.type === 'course' ? 'Certificate of Completion' : 'Certificate of Internship'}
                    </h2>
                  </div>
                  {renderBadge("")}
                </div>
              </div>
              
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <p className="text-sm font-medium opacity-60 mb-6 uppercase tracking-widest" style={{ color: data.textColor }}>Proudly Presented To</p>
                <h3 className="text-7xl font-bold mb-8" style={{ color: data.textColor, fontFamily: data.font }}>
                  {data.recipientName || "Recipient Name"}
                </h3>
                <div className="w-12 h-1 mb-8 rounded-full" style={{ backgroundColor: data.accentColor }} />
                <p className="text-lg opacity-80 max-w-2xl leading-relaxed" style={{ color: data.textColor }}>
                  For outstanding performance and successful completion of {data.durationValue || "X"} {data.durationType} as <strong style={{ color: data.accentColor }}>{data.type === 'course' ? data.courseName || "Course Name" : data.internshipRole || "Internship Role"}</strong>.
                </p>
                {data.description && <p className="text-xs opacity-50 mt-6 max-w-lg mx-auto font-medium" style={{ color: data.textColor }}>{data.description}</p>}
              </div>

              <div className="flex justify-between items-end mt-8 bg-white/40 p-6 rounded-2xl backdrop-blur-md shadow-sm border border-white/50">
                <DateBlock date={data.issueDate} label="Date of Completion" />
                <div className="flex gap-10">
                   <SignatureBlock name={data.directorName || "Director"} sig={data.directorSignature} label="Program Director" />
                   <StudentSignatureBlock />
                </div>
                <QrBlock size={60} />
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="absolute inset-0 flex flex-col shadow-inner">
            {data.image && (
              <img 
                src={data.image} 
                alt="Template Background" 
                className="absolute inset-0 w-full h-full object-contain -z-10"
              />
            )}
            <div className="flex-1 flex flex-col h-full w-full p-12 z-10 justify-between items-center text-center">
              <div className="w-full flex justify-center mb-4 bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-sm inline-block max-w-sm">
                <CompanyLogo name={data.logoType} className="justify-center" textColor={data.textColor} />
              </div>
              
              <div className="flex-1 flex flex-col items-center justify-center max-w-3xl mx-auto bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-xl w-full">
                <h2 className="text-2xl uppercase tracking-widest mb-6 font-bold" style={{ color: data.accentColor, fontFamily: data.font }}>
                  {data.type === 'course' ? 'Certificate of Completion' : 'Certificate of Internship'}
                </h2>
                <h3 className="text-6xl font-bold mb-4" style={{ color: data.textColor, fontFamily: data.font }}>
                  {data.recipientName || "Recipient Name"}
                </h3>
                <p className="text-lg font-medium opacity-90 mb-4 max-w-2xl" style={{ color: data.textColor }}>
                  is hereby awarded this certificate for completing {data.durationValue || "X"} {data.durationType} of {data.type === 'course' ? data.courseName || "Course Name" : data.internshipRole || "Internship Role"}
                </p>
                {data.description && (
                  <p className="text-sm font-medium opacity-80 max-w-xl italic mt-4" style={{ color: data.textColor }}>
                    {data.description}
                  </p>
                )}
              </div>

              <div className="w-full flex justify-between items-end px-8 mt-auto pt-8 bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm">
                <DateBlock date={data.issueDate} label="Date" />
                <div className="flex gap-12 items-end">
                   <SignatureBlock name={data.directorName || "Director"} sig={data.directorSignature} label="Director" />
                   <StudentSignatureBlock />
                </div>
                <QrBlock size={72} />
              </div>
            </div>
          </div>
        );
    }
  };

  const renderBackgroundPattern = () => {
    const patternsToRender = data.backgroundPatterns?.length 
      ? data.backgroundPatterns 
      : (data.backgroundPattern && data.backgroundPattern !== 'none' ? [data.backgroundPattern] : []);

    if (patternsToRender.length === 0) return null;

    const opacity = 0.06; // Decreased darkness of base watermarks
    const hexColor = data.textColor?.replace('#', '') || '000000';

    return (
      <>
        {patternsToRender.map((patternId: string) => {
          if (patternId === 'company' || patternId === 'company-tiled') {
            const company = COMPANIES.find(c => c.id === data.logoType);
            if (company && company.image) {
              if (patternId === 'company-tiled') {
                return (
                  <div 
                    key={patternId}
                    className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-multiply z-0"
                    style={{ 
                      backgroundImage: `url(${company.image})`,
                      backgroundSize: '120px 120px',
                      backgroundRepeat: 'repeat',
                      backgroundPosition: 'center'
                    }}
                  />
                );
              }
              return (
                <div key={patternId} className="absolute inset-0 flex items-center justify-center opacity-[0.12] pointer-events-none mix-blend-multiply overflow-hidden z-0">
                  <img src={company.image} alt="" className="w-[40%] h-[40%] object-contain" />
                </div>
              );
            }
            return null;
          }

          let patternStyle: React.CSSProperties = {};
          switch (patternId) {
            case 'grid':
              patternStyle = {
                backgroundImage: `linear-gradient(${data.textColor} 1px, transparent 1px), linear-gradient(90deg, ${data.textColor} 1px, transparent 1px)`,
                backgroundSize: '40px 40px',
                opacity
              };
              break;
            case 'dots':
              patternStyle = {
                backgroundImage: `radial-gradient(${data.textColor} 2px, transparent 2px)`,
                backgroundSize: '30px 30px',
                backgroundPosition: '0 0, 15px 15px',
                opacity
              };
              break;
            case 'icons':
              patternStyle = {
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23${hexColor}' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                opacity
              };
              break;
            case 'ribbon':
              patternStyle = {
                backgroundImage: `url('/patterns/ribbon.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                opacity: 0.30
              };
              break;
          }

          return (
            <div 
              key={patternId}
              className="absolute inset-0 pointer-events-none mix-blend-multiply z-0" 
              style={patternStyle}
            />
          );
        })}
      </>
    );
  };

  return (
    <div 
      className="w-full aspect-[1.414/1] relative overflow-hidden shadow-2xl transition-colors duration-300 print:shadow-none print:border-none flex items-center justify-center" 
      style={{ backgroundColor: data.certificateColor }}
    >
      {renderBackgroundPattern()}
      {renderTemplate()}
    </div>
  );
}
