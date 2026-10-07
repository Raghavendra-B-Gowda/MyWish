import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Award } from "lucide-react";
import { motion } from "framer-motion";

export function CtaBanner() {
  return (
    <section className="pb-24 pt-12 bg-[#FAFAFC] dark:bg-background/50">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-primary rounded-3xl p-8 md:p-12 shadow-2xl shadow-primary/30 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden"
        >
          {/* Background decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />

          <div className="flex items-center gap-6 relative z-10 w-full md:w-auto">
            <div className="hidden md:flex w-20 h-24 bg-white rounded-lg flex-col items-center justify-center p-2 shadow-inner relative transform -rotate-6">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mb-2">
                <Award className="w-6 h-6 text-amber-500" />
              </div>
              <div className="w-12 h-1 bg-slate-200 rounded-full mb-1" />
              <div className="w-8 h-1 bg-slate-200 rounded-full" />
              
              {/* Ribbon tails */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                <div className="w-2 h-4 bg-amber-500 clip-ribbon-left" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)' }} />
                <div className="w-2 h-4 bg-amber-500 clip-ribbon-right" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)' }} />
              </div>
            </div>

            <div className="text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Ready to create amazing certificates?
              </h2>
              <p className="text-white/80 font-medium">
                Join thousands of users who trust MyWish Certificate Maker.
              </p>
            </div>
          </div>

          <div className="relative z-10 w-full md:w-auto">
            <Button size="lg" className="w-full md:w-auto bg-white text-primary hover:bg-slate-50 font-bold px-8 h-14 rounded-xl text-base shadow-lg" asChild>
              <Link to="/templates" className="flex items-center gap-2">
                Get Started for Free <ArrowRight className="w-5 h-5 ml-1" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
