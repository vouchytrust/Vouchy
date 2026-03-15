import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import OnboardingPage from "./pages/OnboardingPage";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import TestimonialsPage from "./pages/dashboard/TestimonialsPage";
import SpacesPage from "./pages/dashboard/SpacesPage";
import WidgetLabPage from "./pages/dashboard/WidgetLabPage";
import SettingsPage from "./pages/dashboard/SettingsPage";
import CollectionPage from "./pages/CollectionPage";
import EmbedWidgetPage from "./pages/EmbedWidgetPage";
import ViewTestimonialsPage from "./pages/ViewTestimonialsPage";
import ShortEmbedRedirect from "./pages/ShortEmbedRedirect";
import TrustPage from "./pages/TrustPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import NotFound from "./pages/NotFound";
import AdminLayout from "./layouts/AdminLayout";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminSpaces from "./pages/admin/AdminSpaces";
import AdminTestimonials from "./pages/admin/AdminTestimonials";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

import { useLocation } from "react-router-dom";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});

function AppRoutes() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/collect/:slug" element={<CollectionPage />} />
            <Route path="/embed/:slug" element={<EmbedWidgetPage />} />
            <Route path="/e/:slug" element={<ShortEmbedRedirect />} />
            <Route path="/view/:slug" element={<ViewTestimonialsPage />} />
            <Route path="/trust/:slug" element={<TrustPage />} />
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
          <Analytics />
          <SpeedInsights />
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
