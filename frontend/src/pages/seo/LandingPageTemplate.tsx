import { SEO } from "@/components/layout/SEO";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Award, CheckCircle2 } from "lucide-react";
import { FAQ } from "@/components/home/FAQ";

interface LandingPageProps {
  seo: {
    title: string;
    description: string;
    canonicalUrl: string;
    schema: any;
  };
  hero: {
    badge: string;
    headline: React.ReactNode;
    subheadline: string;
    ctaText: string;
    imageAlt: string;
  };
  features: {
    title: string;
    description: string;
    icon: React.ReactNode;
  }[];
  benefits: string[];
}

export function LandingPageTemplate({ seo, hero, features, benefits }: LandingPageProps) {
  return (
    <div className="flex flex-col w-full bg-[#FAFAFC] dark:bg-background pt-24">
      <SEO {...seo} />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white dark:bg-[#0B0A11] border-b border-border">
        <div className="absolute inset-0 bg-grid-slate-100/[0.04] bg-[size:32px_32px] dark:bg-grid-white/[0.02]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary mb-8 font-medium text-sm">
            <Award className="w-4 h-4" />
            {hero.badge}
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-secondary dark:text-white mb-6 max-w-4xl">
            {hero.headline}
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            {hero.subheadline}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link to="/create">
              <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg font-semibold shadow-xl">
                {hero.ctaText}
              </Button>
            </Link>
            <Link to="/templates">
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg font-semibold bg-white dark:bg-transparent">
                View Templates
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-[#FAFAFC] dark:bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose MyWish?</h2>
            <p className="text-lg text-muted-foreground">Everything you need to create professional, verifiable certificates in minutes.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-white dark:bg-[#0E0C15] p-8 rounded-2xl border border-border shadow-sm hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits / Content Section */}
      <section className="py-24 bg-white dark:bg-[#0B0A11] border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Create Certificates That Stand Out</h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Whether you're an educational institution, a corporate trainer, or an organization hosting an internship program, providing a high-quality certificate adds significant value to your participants' experience.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                    <span className="text-foreground font-medium">{benefit}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-10">
                 <Link to="/create">
                   <Button className="h-12 px-8 font-semibold">Start Creating Now</Button>
                 </Link>
              </div>
            </div>
            <div className="lg:w-1/2">
              {/* Decorative visual or mockup could go here. For now, a stylized placeholder container */}
              <div className="aspect-[4/3] rounded-2xl bg-gradient-to-tr from-primary/20 to-blue-500/20 border-2 border-white/10 shadow-2xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 backdrop-blur-[2px]"></div>
                <Award className="w-32 h-32 text-primary opacity-50" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ />
    </div>
  );
}
