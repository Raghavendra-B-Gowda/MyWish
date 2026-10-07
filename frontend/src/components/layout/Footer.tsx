import { Link } from "react-router-dom";
import { Logo } from "./Navbar";
import { useCertificateStore } from "@/store/useCertificateStore";

export function Footer() {
  const activeCompanyOverride = useCertificateStore((s) => s.activeCompanyOverride);
  // If hidden (loading cert), show nothing for company name. If loaded, show company name. Otherwise MyWish.
  const companyName = activeCompanyOverride?.hidden ? "" : (activeCompanyOverride?.name ?? "MyWish");

  return (
    <footer className="border-t border-border/10 bg-white dark:bg-[#0B0A11]">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4 md:col-span-1">
            <Logo />
            <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
              Create beautiful course and internship certificates, add secure QR verification, and share credentials instantly.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground mb-4">Product</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/templates" className="text-muted-foreground hover:text-primary transition-colors">Templates</Link></li>
              <li><Link to="/create" className="text-muted-foreground hover:text-primary transition-colors">Create Certificate</Link></li>
              <li><Link to="/verify" className="text-muted-foreground hover:text-primary transition-colors">Verify Certificate</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Help & Legal</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} {companyName}. All rights reserved.</p>
          <div className="flex mt-4 md:mt-0 items-center gap-2">
            <p>Made by Certificate Developer</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
