import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldAlert, Lock } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const login = useAuthStore((s) => s.login);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(password);
    if (success) {
      navigate("/admin");
    } else {
      setError(true);
      setPassword("");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFC] dark:bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center"
        >
          <img src="/logo.png" alt="MyWish Admin" className="h-20 w-auto object-contain drop-shadow-md" />
        </motion.div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 dark:text-white flex items-center justify-center gap-2">
          <Lock className="w-8 h-8 text-primary" />
          Admin Login
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600 dark:text-muted-foreground">
          Restricted access for system administrators
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-secondary/40 py-8 px-4 shadow-xl shadow-slate-200/50 dark:shadow-none sm:rounded-3xl sm:px-10 border border-slate-100 dark:border-border/10"
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Admin Password
              </label>
              <div className="mt-1 relative">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(false);
                  }}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    error 
                      ? 'border-red-300 dark:border-red-900/50 focus:ring-red-500 focus:border-red-500' 
                      : 'border-slate-300 dark:border-border/30 focus:ring-primary focus:border-primary'
                  } rounded-xl shadow-sm placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none sm:text-sm h-12 bg-white dark:bg-[#0e0c15] text-slate-900 dark:text-white`}
                  placeholder="Enter admin password"
                />
              </div>
              {error && (
                <motion.p 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1"
                >
                  <ShieldAlert className="w-4 h-4" /> Incorrect password. Please try again.
                </motion.p>
              )}
            </div>

            <div>
              <Button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary h-12"
              >
                Sign in to Dashboard
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
