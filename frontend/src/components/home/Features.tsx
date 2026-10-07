import { LayoutTemplate, PenTool, QrCode, DownloadCloud } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const FEATURES = [
  {
    icon: LayoutTemplate,
    title: "Professional Templates",
    description: "Choose from templates designed specifically for academic courses and corporate internships."
  },
  {
    icon: PenTool,
    title: "Easy Customization",
    description: "Customize text, fonts, colors, logos and more with our intuitive editor."
  },
  {
    icon: QrCode,
    title: "QR Code Verification",
    description: "Every certificate comes with a unique QR code for instant verification."
  },
  {
    icon: DownloadCloud,
    title: "Export & Share",
    description: "Download high-quality PDFs and share certificates anywhere."
  }
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-[#FAFAFC] dark:bg-background border-t border-border/10">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="secondary" className="mb-6 bg-primary/10 text-primary hover:bg-primary/20 border-none uppercase tracking-widest px-4 py-1.5 font-bold">
            FEATURES
          </Badge>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
            Everything You Need for <br />
            <span className="text-primary">Professional Recognition</span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-muted-foreground font-medium">
            Powerful features to help you create, customize, and manage course and internship certificates with ease.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                key={index} 
                className="p-5 md:p-8 rounded-2xl md:rounded-3xl bg-white dark:bg-secondary/40 shadow-xl shadow-slate-200/50 dark:shadow-none hover:shadow-2xl hover:shadow-slate-200/80 hover:-translate-y-1 transition-all duration-300 group border border-slate-100 dark:border-border/10 flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-0"
              >
                <div className="w-12 h-12 md:w-14 md:h-14 shrink-0 bg-primary/10 rounded-xl md:rounded-2xl flex items-center justify-center md:mb-8 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  <Icon className="w-6 h-6 md:w-7 md:h-7 text-primary group-hover:text-white transition-colors" />
                </div>
                <div className="text-left">
                  <h3 className="text-base md:text-xl font-bold text-slate-900 dark:text-white mb-1 md:mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-muted-foreground leading-relaxed font-medium text-xs md:text-sm">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
