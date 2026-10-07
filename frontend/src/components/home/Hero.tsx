import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { QrCode, ArrowRight, LayoutTemplate, ScanLine, Download, ShieldCheck, Grid2X2 } from "lucide-react";

const getFormattedDate = () => {
  const date = new Date();
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();
  
  const suffix = (day % 10 === 1 && day !== 11) ? 'st' :
                 (day % 10 === 2 && day !== 12) ? 'nd' :
                 (day % 10 === 3 && day !== 13) ? 'rd' : 'th';
                 
  return `${day}${suffix} ${month} ${year}`;
};

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background pt-12 md:pt-20 pb-32 lg:pb-48 text-foreground z-10">
      {/* Background gradients for that deep premium feel */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-8">
          
          {/* Left Text Content */}
          <div className="flex-1 text-center lg:text-left space-y-8 w-full max-w-2xl lg:max-w-none mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge variant="outline" className="mb-8 border-primary/30 text-primary/80 bg-primary/5 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider">
                Course & Internship Certificate Maker
              </Badge>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]">
                Create Professional<br />
                <span className="text-primary drop-shadow-[0_0_15px_rgba(139,92,246,0.5)]">Course & Internship</span><br />
                Certificates Online
              </h1>
              
              <p className="mt-6 text-lg text-muted-foreground/90 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Design professional certificates for educational programs and corporate internships in minutes. Generate secure PDFs, unique IDs, and scannable QR codes instantly.
              </p>
              
              <div className="md:hidden mt-6 bg-primary/10 border border-primary/20 rounded-lg p-3 text-sm text-primary/90 flex items-start gap-2 text-left mx-auto max-w-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>
                <p>For the best certificate design experience, we recommend using a desktop device.</p>
              </div>
            </motion.div>

            {/* Mini Feature Blocks */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-wrap justify-center lg:justify-start gap-4 py-2"
            >
              <div className="flex items-center gap-3 bg-slate-50 dark:bg-secondary/50 border border-slate-200/80 dark:border-border/50 rounded-xl px-4 py-3 min-w-[160px]">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <LayoutTemplate className="w-5 h-5" />
                </div>
                <div className="text-left leading-tight">
                  <p className="text-sm font-semibold text-slate-900 dark:text-foreground">Modern</p>
                  <p className="text-xs text-slate-500 dark:text-muted-foreground">Templates</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-slate-50 dark:bg-secondary/50 border border-slate-200/80 dark:border-border/50 rounded-xl px-4 py-3 min-w-[160px]">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <ScanLine className="w-5 h-5" />
                </div>
                <div className="text-left leading-tight">
                  <p className="text-sm font-semibold text-slate-900 dark:text-foreground">QR Code</p>
                  <p className="text-xs text-slate-500 dark:text-muted-foreground">Verification</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-slate-50 dark:bg-secondary/50 border border-slate-200/80 dark:border-border/50 rounded-xl px-4 py-3 min-w-[160px]">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <Download className="w-5 h-5" />
                </div>
                <div className="text-left leading-tight">
                  <p className="text-sm font-semibold text-slate-900 dark:text-foreground">Export</p>
                  <p className="text-xs text-slate-500 dark:text-muted-foreground">High Quality</p>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-2"
            >
              <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-base font-semibold shadow-[0_0_20px_rgba(139,92,246,0.3)] bg-primary hover:bg-primary/90 text-white rounded-xl" asChild>
                <Link to="/create" className="flex items-center gap-2">
                  Create Your Certificate <ArrowRight className="w-5 h-5 ml-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-base font-semibold border-slate-200 dark:border-border/50 bg-slate-100 dark:bg-secondary/30 hover:bg-slate-200 dark:hover:bg-secondary/80 text-slate-900 dark:text-foreground rounded-xl shadow-sm" asChild>
                <Link to="/templates" className="flex items-center gap-2">
                  View Templates <Grid2X2 className="w-5 h-5 ml-1" />
                </Link>
              </Button>
            </motion.div>

            {/* Trust badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex items-center justify-center lg:justify-start gap-2 text-sm text-muted-foreground font-medium pt-4"
            >
              <ShieldCheck className="w-5 h-5 text-primary" />
              <span>Trusted by 1000+ Users</span>
            </motion.div>
          </div>

          {/* Right Visual - Certificate Presentation */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex-1 w-full max-w-2xl lg:max-w-none relative mt-8 lg:mt-0"
          >
            {/* The Certificate 3D Wrapper */}
            <div className="relative w-full aspect-[1.414/1] perspective-1000">
              {/* Outer glow */}
              <div className="absolute inset-0 bg-primary/20 blur-[50px] rounded-[2rem] transform -rotate-2 scale-105" />
              
              {/* The Certificate Card */}
              <div className="absolute inset-0 bg-[#0B0A11] rounded-2xl shadow-2xl border border-border/30 overflow-hidden transform rotate-2 hover:rotate-0 transition-transform duration-500 flex flex-col p-8 md:p-10 z-10" style={{ transformStyle: 'preserve-3d' }}>
                
                {/* Gold Inner Border */}
                <div className="absolute inset-4 border border-[#C6A87C]/30 rounded-lg pointer-events-none flex" />
                <div className="absolute inset-5 border border-[#C6A87C]/20 rounded-md pointer-events-none flex" />
                
                {/* Decorative corners */}
                <div className="absolute top-4 left-4 w-12 h-12 border-t border-l border-[#C6A87C] rounded-tl-lg" />
                <div className="absolute top-4 right-4 w-12 h-12 border-t border-r border-[#C6A87C] rounded-tr-lg" />
                <div className="absolute bottom-4 left-4 w-12 h-12 border-b border-l border-[#C6A87C] rounded-bl-lg" />
                <div className="absolute bottom-4 right-4 w-12 h-12 border-b border-r border-[#C6A87C] rounded-br-lg" />

                {/* Top Section */}
                <div className="flex justify-between items-start relative z-10 w-full mb-6">
                  <div className="w-20" /> {/* Spacer */}
                  <div className="flex items-center gap-2 text-[#C6A87C]">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" x2="4" y1="22" y2="15" /></svg>
                    <span className="font-bold text-lg tracking-tight text-white">MyWish</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="bg-white p-1 rounded-sm">
                      <QrCode className="w-12 h-12 text-black" />
                    </div>
                    <span className="text-[8px] text-[#C6A87C] mt-1 uppercase tracking-wider">Verify Certificate</span>
                  </div>
                </div>

                {/* Main Content */}
                <div className="text-center space-y-6 relative z-10 flex-1 flex flex-col justify-center">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-serif tracking-[0.15em] text-white uppercase mb-2">Certificate</h2>
                    <div className="flex items-center justify-center gap-4">
                      <div className="h-[1px] w-12 bg-[#C6A87C]/50" />
                      <span className="text-[10px] tracking-[0.3em] text-[#C6A87C] uppercase">Of Achievement</span>
                      <div className="h-[1px] w-12 bg-[#C6A87C]/50" />
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                    <p className="text-xs text-white/70">Proudly Presented To</p>
                    <h3 className="text-5xl md:text-6xl text-[#C6A87C] py-2" style={{ fontFamily: "'Great Vibes', cursive, serif" }}>Romio</h3>
                    <p className="text-sm font-medium text-white/80 max-w-md mx-auto leading-relaxed px-4">
                      For successfully completing the Web Development Workshop and demonstrating excellent skills and dedication.
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-end relative z-10 mt-auto pt-8">
                  <div className="text-center pb-2">
                    <p className="text-sm text-white mb-1">{getFormattedDate()}</p>
                    <div className="h-[1px] w-32 bg-[#C6A87C]/50 my-1" />
                    <p className="text-[10px] text-[#C6A87C] uppercase tracking-widest">Date</p>
                  </div>
                  
                  <div className="relative flex justify-center -mb-4">
                    {/* Simplified Gold Medal Icon */}
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FFE5B4] via-[#D4AF37] to-[#AA7C11] border-4 border-[#151520] shadow-lg flex items-center justify-center relative z-10">
                      <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white/90"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                      </div>
                    </div>
                    {/* Ribbons */}
                    <div className="absolute -bottom-6 w-12 h-16 bg-red-700 -z-10 clip-ribbon-left transform -rotate-12 translate-x-3 shadow-md" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)' }} />
                    <div className="absolute -bottom-6 w-12 h-16 bg-red-800 -z-10 clip-ribbon-right transform rotate-12 -translate-x-3 shadow-md" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)' }} />
                  </div>

                  <div className="text-center pb-2">
                    <div className="text-2xl text-white mb-1" style={{ fontFamily: "'Great Vibes', cursive, serif" }}>MyWish Team</div>
                    <div className="h-[1px] w-32 bg-[#C6A87C]/50 my-1" />
                    <p className="text-[10px] text-[#C6A87C] uppercase tracking-widest">Organizer</p>
                  </div>
                </div>
              </div>
            </div>


          </motion.div>

        </div>
      </div>
    </section>
  );
}
