import { LandingPageTemplate } from "./LandingPageTemplate";
import { GraduationCap, ShieldCheck, Sparkles } from "lucide-react";

export default function CourseCertificateMaker() {
  const seo = {
    title: "Course Certificate Maker | Create Professional Certificates Online",
    description: "Create professional course completion certificates online with MyWish. Customize certificate details, add your organization information and generate a verification-ready certificate.",
    canonicalUrl: "/course-certificate-maker",
    schema: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "MyWish Course Certificate Maker",
      "applicationCategory": "BusinessApplication",
      "description": "Create professional course completion certificates online.",
      "operatingSystem": "All"
    }
  };

  const hero = {
    badge: "Course Completion Certificates",
    headline: <>Create <span className="text-primary">Professional Course Certificates</span> in Minutes</>,
    subheadline: "Design, generate, and verify beautiful course completion certificates for your students. Free, fast, and fully customizable.",
    ctaText: "Make a Course Certificate",
    imageAlt: "Course Certificate Maker Preview"
  };

  const features = [
    {
      title: "Academic Templates",
      description: "Choose from a variety of professional templates designed specifically for educational institutions, workshops, and online courses.",
      icon: <GraduationCap className="w-6 h-6" />
    },
    {
      title: "Instant Verification",
      description: "Every generated certificate comes with a unique ID and QR code, allowing employers to verify the credential instantly.",
      icon: <ShieldCheck className="w-6 h-6" />
    },
    {
      title: "Fully Customizable",
      description: "Add your organization's logo, adjust colors to match your brand, and include digital signatures from course directors.",
      icon: <Sparkles className="w-6 h-6" />
    }
  ];

  const benefits = [
    "Increase student satisfaction with high-quality digital credentials.",
    "Eliminate manual design work with our easy-to-use form.",
    "Prevent fraud with secure QR code verification.",
    "Export in high-resolution PDF format perfect for printing.",
    "Mobile-friendly creation process - generate certificates anywhere."
  ];

  return <LandingPageTemplate seo={seo} hero={hero} features={features} benefits={benefits} />;
}
