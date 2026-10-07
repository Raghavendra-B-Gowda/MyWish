import { LayoutTemplate, PenTool, CloudDownload, ShieldCheck, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const STEPS = [
  {
    num: "01",
    icon: LayoutTemplate,
    title: "Choose Template",
    desc: "Select a template that fits your needs."
  },
  {
    num: "02",
    icon: PenTool,
    title: "Customize",
    desc: "Edit the content, add logos, change colors & fonts."
  },
  {
    num: "03",
    icon: CloudDownload,
    title: "Generate & Download",
    desc: "Generate your certificate and download as PDF."
  },
  {
    num: "04",
    icon: ShieldCheck,
    title: "Verify",
    desc: "Share and verify authenticity using the QR code."
  }
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-[#FAFAFC] dark:bg-background border-t border-border/10">
      <div className="container mx-auto px-4 text-center">
        <Badge variant="secondary" className="mb-6 bg-primary/10 text-primary hover:bg-primary/20 border-none uppercase tracking-widest px-4 py-1.5 font-bold">
          HOW IT WORKS
        </Badge>
        
        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-20 tracking-tight">
          Create Certificate in <span className="text-primary">4 Simple Steps</span>
        </h2>

        <div className="relative max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="flex flex-col md:flex-row items-center w-full md:w-auto">
                {/* Step Card */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="relative flex flex-row md:flex-col items-center p-5 md:p-8 rounded-2xl md:rounded-3xl bg-white dark:bg-secondary/40 border border-slate-100 dark:border-border/10 shadow-lg shadow-slate-200/40 dark:shadow-none hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300 w-full md:w-[240px] group gap-4 md:gap-0"
                >
                  {/* Step Number Badge */}
                  <div className="hidden md:flex absolute top-4 left-4 w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/20 items-center justify-center text-xs font-bold text-primary group-hover:scale-110 transition-transform">
                    {step.num}
                  </div>
                  
                  {/* Icon */}
                  <div className="w-12 h-12 md:w-16 md:h-16 shrink-0 rounded-xl md:rounded-2xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center md:mb-6 group-hover:bg-primary/5 transition-colors relative">
                    <div className="md:hidden absolute -top-2 -left-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                      {parseInt(step.num)}
                    </div>
                    <Icon className="w-6 h-6 md:w-8 md:h-8 text-primary/70 group-hover:text-primary transition-colors" />
                  </div>
                  
                  <div className="text-left md:text-center flex-1">
                    <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white mb-1 md:mb-3">{step.title}</h3>
                    <p className="text-slate-600 dark:text-muted-foreground text-xs md:text-sm leading-relaxed md:px-2 font-medium">
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
                
                {/* Chevron connecting arrows (Desktop) */}
                {idx !== STEPS.length - 1 && (
                  <div className="hidden md:flex px-6 items-center justify-center text-slate-300 dark:text-slate-700">
                    <ChevronRight className="w-8 h-8" />
                  </div>
                )}
                
                {/* Down arrow (Mobile) */}
                {idx !== STEPS.length - 1 && (
                  <div className="md:hidden py-2 flex items-center justify-center text-slate-300 dark:text-slate-700 w-full">
                    <ChevronRight className="w-6 h-6 rotate-90" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
