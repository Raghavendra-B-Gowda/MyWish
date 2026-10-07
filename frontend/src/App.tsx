import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { useAuthStore } from "./store/useAuthStore";

import Home from "./pages/Home";
import Templates from "./pages/Templates";
import Create from "./pages/Create";
import Verify from "./pages/Verify";
import VerifyDetail from "./pages/VerifyDetail";
import Success from "./pages/Success";
import Dashboard from "./pages/Dashboard";
import Companies from "./pages/Companies";
import AdminLogin from "./pages/AdminLogin";
import NotFound from "./pages/NotFound";
import CourseCertificateMaker from "./pages/seo/CourseCertificateMaker";
import InternshipCertificateMaker from "./pages/seo/InternshipCertificateMaker";
import GeneralCertificateMaker from "./pages/seo/GeneralCertificateMaker";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import { TermsPopup } from "./components/layout/TermsPopup";
import { InitialLoader } from "./components/layout/InitialLoader";
import { AdminLayout } from "./components/layout/AdminLayout";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthStore();
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
}

function AppContent() {
  // checkAuth is deliberately not called on mount so the user must log in on every refresh.

  const location = useLocation();
  const isVerifyPage = location.pathname.startsWith('/verify');
  const isAdminPage = location.pathname.startsWith('/admin');
  
  // Start loading only if we are not on the verify page initially
  const [isLoading, setIsLoading] = useState(!isVerifyPage);

  useEffect(() => {
    if (isVerifyPage) {
      setIsLoading(false);
      return;
    }

    if (isLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isVerifyPage, isLoading]);

  // Handle scroll behavior when switching tabs or using hash links
  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const id = location.hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100); // Small delay to ensure rendering is complete
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.pathname, location.hash]);

  return (
    <>
      {isLoading && !isVerifyPage && <InitialLoader />}
      <div className={`flex flex-col min-h-screen bg-background text-foreground font-sans ${isLoading ? 'hidden' : ''}`}>
        {!isAdminPage && <TermsPopup />}
        {!isAdminPage && <Navbar />}
        <main className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/certificate-maker" element={<GeneralCertificateMaker />} />
            <Route path="/course-certificate-maker" element={<CourseCertificateMaker />} />
            <Route path="/course-completion-certificate" element={<CourseCertificateMaker />} />
            <Route path="/internship-certificate-maker" element={<InternshipCertificateMaker />} />
            <Route path="/internship-completion-certificate" element={<InternshipCertificateMaker />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/create" element={<Create />} />
            <Route path="/certificate/success" element={<Success />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/verify/:id" element={<VerifyDetail />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/dashboard" element={<Navigate to="/admin" replace />} />
            <Route path="/dashboard/*" element={<Navigate to="/admin" replace />} />
            <Route path="/admin/*" element={
              <ProtectedRoute>
                <AdminLayout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/companies" element={<Companies />} />
                    <Route path="*" element={<Dashboard />} />
                  </Routes>
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        {!isAdminPage && <Footer />}
      </div>
    </>
  );
}

function App() {
  return (
    <HelmetProvider>
      <Router>
        <AppContent />
      </Router>
    </HelmetProvider>
  );
}

export default App;

