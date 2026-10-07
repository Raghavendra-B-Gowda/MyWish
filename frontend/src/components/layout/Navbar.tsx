import { Link, useLocation } from "react-router-dom";
import { Menu, X, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCertificateStore } from "@/store/useCertificateStore";
import { useThemeStore } from "@/store/useThemeStore";
import { usePWAInstall } from "@/hooks/usePWAInstall";

export function Logo() {
  const activeCompanyOverride = useCertificateStore((s) => s.activeCompanyOverride);
  const location = useLocation();

  const isVerifyPage = location.pathname.startsWith('/verify');

  if (isVerifyPage) {
    if (activeCompanyOverride?.name) {
      return (
        <Link to="/" className="flex items-center gap-2.5">
          {activeCompanyOverride.image ? (
            <img
              src={activeCompanyOverride.image}
              alt={activeCompanyOverride.name}
              className="h-9 w-auto object-contain shrink-0"
            />
          ) : (
            <div className="relative flex items-center justify-center w-8 h-8 bg-primary rounded-md shadow-sm text-white font-bold text-sm">
              {activeCompanyOverride.name.charAt(0)}
            </div>
          )}
          <span className="font-bold text-xl tracking-tight text-foreground">
            {activeCompanyOverride.name}
          </span>
        </Link>
      );
    }
    return <div className="w-28 h-8" />;
  }

  return (
    <Link to="/" className="flex items-center gap-2">
      <img src="/logo.png" alt="MyWish" className="h-10 w-auto object-contain" />
    </Link>
  );
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useThemeStore();
  const { triggerInstall } = usePWAInstall();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Templates", href: "/templates" },
    { name: "Create", href: "/create" },
    { name: "Verify", href: "/verify" },
    { name: "Features", href: "/#features" },
    { name: "How It Works", href: "/#how-it-works" },
  ];

  const isActive = (path: string) => {
    if (path === "/" && location.pathname !== "/") return false;
    if (path.startsWith("/#")) return false; // Simple logic for anchor links
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/10 bg-background/90 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 text-foreground">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Logo />

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center space-x-8">
          <div className="flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary relative group py-2 ${
                  isActive(link.href) ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.name}
                {/* Underline effect like in the image for active link */}
                {isActive(link.href) && (
                   <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full"></div>
                )}
              </Link>
            ))}
          </div>
          
          <div className="flex items-center space-x-4 pl-4">
            <button onClick={toggleTheme} className="p-2 text-muted-foreground hover:text-foreground rounded-full bg-secondary/50 transition-colors">
              {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
            <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25" asChild>
              <Link to="/templates">Get Started</Link>
            </Button>
          </div>
        </div>

        {/* Mobile Nav Toggle */}
        <button
          className="lg:hidden p-2 text-foreground"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden border-b border-border/10 bg-background px-4 py-4 space-y-4">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className={`text-base font-medium ${
                  isActive(link.href) ? "text-primary" : "text-foreground hover:text-primary"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="h-px bg-border/20 my-2" />
            <div className="flex flex-col gap-3 w-full">
              <Button className="w-full" asChild>
                <Link to="/templates" onClick={() => setIsOpen(false)}>Get Started</Link>
              </Button>
              <Button 
                variant="outline" 
                className="w-full border-primary/50 text-primary hover:bg-primary/10" 
                onClick={() => {
                  setIsOpen(false);
                  triggerInstall();
                }}
              >
                Download App (Mobile Only)
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
