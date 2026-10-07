import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  LogOut,
  ChevronDown
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate } from "react-router-dom";

interface AdminSidebarProps {
  onClose?: () => void;
}

export function AdminSidebar({ onClose }: AdminSidebarProps) {
  const location = useLocation();
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
    if (onClose) onClose();
  };

  const isActive = (path: string) => {
    if (path === "/admin" && location.pathname === "/admin") return true;
    if (path !== "/admin" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const mainNav = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  ];

  const secondaryNav: any[] = [];

  return (
    <div className="flex flex-col h-full bg-[#0B0A11] border-r border-border/10 text-slate-300 w-full sm:w-[250px]">
      {/* Brand Header */}
      <div className="h-20 flex items-center px-6 border-b border-border/10 shrink-0">
        <Link to="/admin" onClick={onClose} className="flex items-center gap-3 group">
          <img src="/logo.png" alt="MyWish Logo" className="h-12 w-auto object-contain" />
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-6 scrollbar-none">
        
        {/* Main Nav */}
        <div className="space-y-1">
          {mainNav.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  active 
                    ? "bg-primary/10 text-primary" 
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                }`}
              >
                <item.icon className={`w-5 h-5 ${active ? "text-primary" : "text-slate-500"}`} />
                {item.name}
              </Link>
            );
          })}
        </div>

        <div className="h-px bg-border/10 mx-3"></div>

        {/* Secondary Nav */}
        <div className="space-y-1">
          {secondaryNav.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  active 
                    ? "bg-primary/10 text-primary" 
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                }`}
              >
                <item.icon className={`w-5 h-5 ${active ? "text-primary" : "text-slate-500"}`} />
                {item.name}
              </Link>
            );
          })}
        </div>

      </div>

      {/* Profile Section */}
      <div className="p-4 border-t border-border/10 shrink-0">
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/5 cursor-pointer transition-colors group">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-purple-400 flex items-center justify-center text-white font-bold shrink-0">
            RB
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">Raghavendra Gowda</p>
            <p className="text-xs text-slate-400 truncate">Administrator</p>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-500 group-hover:text-slate-300" />
        </div>
        <button 
          onClick={handleLogout}
          className="w-full mt-2 flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </div>
  );
}
