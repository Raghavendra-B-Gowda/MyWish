import { CheckCircle2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Logo } from "../layout/Navbar";
import { motion } from "framer-motion";

export function QrShowcase() {
  return (
    <section className="py-24 bg-secondary text-white overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Visual Side */}
          <div className="flex-1 relative w-full max-w-2xl lg:max-w-none min-h-[500px]">
            {/* The Certificate Context (blurred in background) */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="absolute left-0 top-1/2 -translate-y-1/2 w-3/4 aspect-[1.414/1] bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6 hidden md:flex flex-col rotate-[-5deg] origin-bottom-left"
            >
              <div className="flex-1 border-2 border-dashed border-white/20 rounded-lg p-6 flex flex-col justify-between opacity-50">
                <div className="h-6 w-32 bg-white/20 rounded mx-auto" />
                <div className="space-y-4 text-center">
                  <div className="h-4 w-24 bg-white/20 rounded mx-auto" />
                  <div className="h-8 w-64 bg-white/30 rounded mx-auto" />
                </div>
                <div className="flex justify-between items-end">
                  <div className="h-16 w-16 bg-white/20 rounded" />
                  <div className="h-4 w-32 bg-white/20 rounded" />
                </div>
              </div>
            </motion.div>

            {/* The Phone Overlay */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="relative md:absolute md:right-0 md:top-1/2 md:-translate-y-1/2 w-full max-w-[320px] mx-auto bg-[#0a0a0a] rounded-[2.5rem] border-[8px] border-white/10 shadow-2xl overflow-hidden aspect-[9/19]"
            >
              {/* Phone screen */}
              <div className="absolute inset-0 bg-background text-foreground overflow-y-auto no-scrollbar pt-12 pb-6 px-5">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#0a0a0a] rounded-b-xl z-20" />
                
                <div className="flex justify-center mb-8">
                  <Logo />
                </div>

                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10 mb-4">
                    <CheckCircle2 className="w-8 h-8 text-success" />
                  </div>
                  <h3 className="text-xl font-bold text-success">VERIFIED</h3>
                  <p className="text-sm text-muted-foreground mt-1">Certificate Authentic</p>
                </div>

                <div className="space-y-4 bg-muted/30 rounded-xl p-4">
                  <div>
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Name</p>
                    <p className="font-bold text-secondary">Romio</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Course</p>
                    <p className="font-medium">Full Stack Web Development</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Duration</p>
                    <p className="font-medium">3 Months</p>
                  </div>
                  <div className="pt-2 border-t border-border">
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Certificate ID</p>
                    <p className="font-mono text-sm">MW-2026-001245</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">Issue Date</p>
                    <p className="font-medium text-sm">09 August 2026</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Text Content */}
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary-foreground font-medium text-sm border border-primary/30">
              <ShieldCheck className="w-4 h-4" />
              Built-in Security
            </div>
            <h2 className="text-3xl md:text-5xl font-bold leading-tight">
              Every certificate comes with built-in verification.
            </h2>
            <p className="text-lg text-white/70 leading-relaxed">
              Every MyWish certificate receives a unique certificate ID and QR code. Anyone can scan the QR code to verify its authenticity instantly from any mobile device.
            </p>
            <div className="pt-4">
              <Button size="lg" className="h-12 px-8 bg-white text-secondary hover:bg-white/90" asChild>
                <Link to="/verify">Verify a Certificate</Link>
              </Button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
