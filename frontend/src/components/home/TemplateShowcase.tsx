import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const TEMPLATES = [
  { id: "modern-1", name: "Modern Tech", category: "Course", style: "Modern", color: "bg-blue-50 border-blue-200" },
  { id: "elegant-1", name: "Classic Elegance", category: "Achievement", style: "Elegant", color: "bg-stone-50 border-stone-200" },
  { id: "corp-1", name: "Corporate Standard", category: "Internship", style: "Corporate", color: "bg-slate-50 border-slate-200" },
  { id: "academic-1", name: "University Scholar", category: "Course", style: "Academic", color: "bg-amber-50 border-amber-200" },
  { id: "minimal-1", name: "Clean Minimal", category: "Participation", style: "Minimal", color: "bg-zinc-50 border-zinc-200" },
  { id: "luxury-1", name: "Gold Excellence", category: "Achievement", style: "Luxury", color: "bg-yellow-50 border-yellow-200" },
  { id: "tech-1", name: "Developer Pro", category: "Course", style: "Technology", color: "bg-indigo-50 border-indigo-200" },
  { id: "prof-1", name: "Professional Trust", category: "Internship", style: "Professional", color: "bg-sky-50 border-sky-200" },
];

export function TemplateShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -400, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 400, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-24 bg-muted/30 overflow-hidden relative">
      <div className="container mx-auto px-4 mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
            Choose a certificate you'll be proud to share.
          </h2>
          <p className="text-lg text-muted-foreground">
            Explore professional designs for courses, internships, training and achievements.
          </p>
        </div>
        <div className="flex gap-2 shrink-0 hidden md:flex">
          <Button variant="outline" size="icon" onClick={scrollLeft} className="rounded-full shadow-sm bg-white hover:bg-muted">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button variant="outline" size="icon" onClick={scrollRight} className="rounded-full shadow-sm bg-white hover:bg-muted">
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div 
        ref={containerRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory px-4 md:px-8 pb-8 no-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* Placeholder spacer for container alignment */}
        <div className="w-[calc((100vw-1280px)/2)] shrink-0 hidden xl:block" />

        {TEMPLATES.map((template, index) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="snap-center shrink-0 w-[85vw] md:w-[400px] lg:w-[450px] group relative"
          >
            {/* Template Card */}
            <div className={`aspect-[1.414/1] rounded-xl border ${template.color} shadow-sm transition-all duration-300 group-hover:shadow-xl relative overflow-hidden flex flex-col items-center justify-center p-8`}>
               {/* Mock visual elements for certificates */}
               <div className="w-16 h-16 rounded-full bg-black/5 mb-4" />
               <div className="h-4 w-3/4 bg-black/10 rounded mb-8" />
               <div className="h-8 w-5/6 bg-black/15 rounded mb-4" />
               <div className="h-3 w-1/2 bg-black/10 rounded" />
               
               <div className="absolute bottom-6 left-6 right-6 flex justify-between">
                 <div className="w-12 h-12 bg-black/5 rounded-md" />
                 <div className="w-24 h-8 bg-black/5 rounded" />
               </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-secondary/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-6 text-white text-center">
                <h3 className="text-xl font-bold mb-2">{template.name}</h3>
                <p className="text-sm text-white/80 mb-6">{template.category} • {template.style}</p>
                <Button 
                  onClick={() => navigate(`/create?template=${template.id}`)}
                  className="bg-primary hover:bg-primary/90 text-white w-full sm:w-auto"
                >
                  Use This Template
                </Button>
              </div>
            </div>
          </motion.div>
        ))}

        <div className="w-[calc((100vw-1280px)/2)] shrink-0 hidden xl:block" />
      </div>

      {/* Mobile controls */}
      <div className="flex justify-center gap-4 mt-4 md:hidden">
        <Button variant="outline" size="icon" onClick={scrollLeft} className="rounded-full shadow-sm bg-white">
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <Button variant="outline" size="icon" onClick={scrollRight} className="rounded-full shadow-sm bg-white">
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </section>
  );
}
