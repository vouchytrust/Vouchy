import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

// Lazy-loaded pages for faster initial load
const LandingPage = lazy(() => import("./pages/LandingPage"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const OnboardingPage = lazy(() => import("./pages/OnboardingPage"));
const DashboardLayout = lazy(() => import("./layouts/DashboardLayout"));
const DashboardHome = lazy(() => import("./pages/dashboard/DashboardHome"));
const TestimonialsPage = lazy(() => import("./pages/dashboard/TestimonialsPage"));
const SpacesPage = lazy(() => import("./pages/dashboard/SpacesPage"));
const WidgetLabPage = lazy(() => import("./pages/dashboard/WidgetLabPage"));
const SettingsPage = lazy(() => import("./pages/dashboard/SettingsPage"));
const CollectionPage = lazy(() => import("./pages/CollectionPage"));
const EmbedWidgetPage = lazy(() => import("./pages/EmbedWidgetPage"));
const ViewTestimonialsPage = lazy(() => import("./pages/ViewTestimonialsPage"));
const ShortEmbedRedirect = lazy(() => import("./pages/ShortEmbedRedirect"));
const TrustPage = lazy(() => import("./pages/TrustPage"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminLayout = lazy(() => import("./layouts/AdminLayout"));
const AdminOverview = lazy(() => import("./pages/admin/AdminOverview"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminSpaces = lazy(() => import("./pages/admin/AdminSpaces"));
const AdminTestimonials = lazy(() => import("./pages/admin/AdminTestimonials"));
const AdminProtectedRoute = lazy(() => import("./components/AdminProtectedRoute"));

import { useLocation } from "react-router-dom";

function AppRoutes() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/onboarding" element={<OnboardingPage />} />
              <Route path="/collect/:slug" element={<CollectionPage />} />
              <Route path="/c/:slug" element={<CollectionPage />} />
              <Route path="/embed/:slug" element={<EmbedWidgetPage />} />
              <Route path="/e/:slug" element={<ShortEmbedRedirect />} />
              <Route path="/view/:slug" element={<ViewTestimonialsPage />} />
              <Route path="/trust/:slug" element={<TrustPage />} />
              <Route path="/t/:slug" element={<TrustPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                <Route index element={<DashboardHome />} />
                <Route path="testimonials" element={<TestimonialsPage />} />
                <Route path="spaces" element={<SpacesPage />} />
                <Route path="widgets" element={<WidgetLabPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>

              <Route path="/admin" element={<AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>}>
                <Route index element={<AdminOverview />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="spaces" element={<AdminSpaces />} />
                <Route path="testimonials" element={<AdminTestimonials />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <Analytics />
          <SpeedInsights />
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

const App = () => {
  const isEmbed = window.location.pathname.startsWith("/embed/") || window.location.pathname.startsWith("/e/");

  if (isEmbed) {
    return (
      <BrowserRouter>
        <ThemeProvider>
          <Suspense fallback={null}>
            <Routes>
              <Route path="/embed/:slug" element={<EmbedWidgetPage />} />
              <Route path="/e/:slug" element={<ShortEmbedRedirect />} />
            </Routes>
          </Suspense>
        </ThemeProvider>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;
