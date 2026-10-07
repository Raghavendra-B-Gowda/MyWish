import { Hero } from "@/components/home/Hero";
import { StatsBar } from "@/components/home/StatsBar";
import { Features } from "@/components/home/Features";
import { HowItWorks } from "@/components/home/HowItWorks";
import { CtaBanner } from "@/components/home/CtaBanner";
import { FAQ } from "@/components/home/FAQ";
import { SEO } from "@/components/layout/SEO";

export default function Home() {
  return (
    <div className="flex flex-col w-full bg-[#FAFAFC] dark:bg-background">
      <SEO canonicalUrl="/" />
      <Hero />
      <StatsBar />
      <Features />
      <HowItWorks />
      <FAQ />
      <CtaBanner />
    </div>
  );
}
