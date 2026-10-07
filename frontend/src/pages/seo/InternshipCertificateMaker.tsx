import { LandingPageTemplate } from "./LandingPageTemplate";
import { Briefcase, ShieldCheck, Star } from "lucide-react";

export default function InternshipCertificateMaker() {
  const seo = {
    title: "Internship Certificate Maker | Create Internship Certificates Online",
    description: "Generate professional internship completion certificates online. Add your company logo, customize details, and issue verifiable certificates for your interns.",
    canonicalUrl: "/internship-certificate-maker",
    schema: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "MyWish Internship Certificate Maker",
      "applicationCategory": "BusinessApplication",
      "description": "Create professional internship completion certificates online.",
      "operatingSystem": "All"
    }
  };

  const hero = {
    badge: "Internship Certificates",
    headline: <>Issue <span className="text-primary">Professional Internship Certificates</span> Instantly</>,
    subheadline: "Reward your interns with verifiable, corporate-grade certificates. Customize with your brand logo, authorized signatures, and unique verification IDs.",
    ctaText: "Make an Internship Certificate",
    imageAlt: "Internship Certificate Maker Preview"
  };

  const features = [
    {
      title: "Corporate Templates",
      description: "Access modern, clean templates designed specifically for corporate environments, industrial training, and technical internships.",
      icon: <Briefcase className="w-6 h-6" />
    },
    {
      title: "Built-in Verification",
      description: "Enhance your company's credibility. Each certificate has a unique ID and QR code, allowing future employers to verify the internship.",
      icon: <ShieldCheck className="w-6 h-6" />
    },
    {
      title: "Brand Integration",
      description: "Upload your company logo, match the certificate accent colors to your brand, and create a seamless professional experience.",
      icon: <Star className="w-6 h-6" />
    }
  ];

  const benefits = [
    "Provide tangible value to interns completing their program.",
    "Save HR time with our quick, intuitive certificate generator.",
    "Protect your company's reputation with secure, verifiable documents.",
    "Generate high-resolution PDFs ready for professional printing.",
    "Completely free to use with no hidden watermarks."
  ];

  return <LandingPageTemplate seo={seo} hero={hero} features={features} benefits={benefits} />;
}
