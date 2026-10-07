import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TEMPLATES } from "@/config/templates";
import { CertificatePreview } from "@/components/certificate/CertificatePreview";

export default function Templates() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-muted/20 py-16">
      <div className="container mx-auto px-4">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl font-bold text-secondary mb-4">Certificate Templates</h1>
          <p className="text-lg text-muted-foreground">
            Step 1: Select a professional template below to start creating your custom certificate.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-12 max-w-7xl mx-auto">
          {TEMPLATES.map(template => (
              <div key={template.id} className="bg-white dark:bg-secondary/40 rounded-3xl border border-border dark:border-border/10 shadow-sm overflow-hidden group flex flex-col hover:shadow-xl dark:hover:shadow-none hover:-translate-y-1 transition-all duration-300">
                
                {/* Live Preview Wrapper */}
                <div className="w-full h-[280px] sm:h-[320px] bg-muted/10 p-6 flex items-center justify-center border-b border-border dark:border-border/10 overflow-hidden relative">
                  <div className="w-full h-full relative group-hover:scale-105 group-hover:drop-shadow-2xl drop-shadow-md transition-all duration-500 origin-center flex items-center justify-center">
                    <div className="w-[850px] shrink-0 origin-center" style={{ transform: 'scale(0.37)' }}>
                      <CertificatePreview 
                        demo={true} 
                        overrideData={{
                          templateId: template.id,
                          recipientName: "Jonathan A. Davies",
                          courseName: "Advanced Digital Marketing",
                          internshipRole: "Frontend Developer",
                          type: template.category === "Internship" ? "internship" : "course",
                          issueDate: new Date().toISOString(),
                          durationValue: "6",
                          durationType: "months",
                          directorName: "Dr. Eleanor Vance",
                          certificateColor: template.defaultColors?.certificateColor || "#FFFFFF",
                          accentColor: template.defaultColors?.accentColor || "#1769E0",
                          textColor: template.defaultColors?.textColor || "#0B1F3A",
                          font: template.defaultFont || "Inter",
                          logoType: "mywish",
                          studentSignatureMode: "ai"
                        }} 
                      />
                    </div>
                  </div>
                </div>

                <div className="p-8 flex flex-col items-start bg-transparent flex-1">
                  <h3 className="font-bold text-2xl text-secondary mb-2">{template.name}</h3>
                  <p className="text-sm text-muted-foreground mb-8">
                    {template.category} {template.description && <span className="opacity-60 hidden sm:inline"> • {template.description}</span>}
                  </p>
                  
                  <div className="flex w-full gap-4 mt-auto">
                    <Button asChild className="flex-1 h-12 text-md shadow-md hover:shadow-lg transition-all">
                      <Link to={`/create?template=${template.id}`}>Use Template</Link>
                    </Button>
                  </div>
                </div>

              </div>
            ))}
        </div>

      </div>
    </div>
  );
}
