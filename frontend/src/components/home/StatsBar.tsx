import { FileText, Users, ShieldCheck, Zap } from "lucide-react";
import { motion } from "framer-motion";

export function StatsBar() {
  const stats = [
    {
      icon: <FileText className="w-6 h-6 text-white" />,
      value: "Unlimited",
      label: "Certificates Created",
    },
    {
      icon: <Users className="w-6 h-6 text-white" />,
      value: "Growing",
      label: "Community",
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-white" />,
      value: "100%",
      label: "Secure & Reliable",
    },
    {
      icon: <Zap className="w-6 h-6 text-white" />,
      value: "Instant",
      label: "Generation",
    },
  ];

  return (
    <div className="relative z-20 container mx-auto px-4 -mt-20">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-[#121124] border border-white/5 rounded-2xl shadow-2xl p-8 lg:p-10"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
              <div className="flex-shrink-0 w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-primary/20 flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.2)]">
                {stat.icon}
              </div>
              <div className="min-w-0">
                <h4 className="text-xl lg:text-2xl font-bold text-white tracking-tight truncate">{stat.value}</h4>
                <p className="text-xs lg:text-sm text-white/60 truncate">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
