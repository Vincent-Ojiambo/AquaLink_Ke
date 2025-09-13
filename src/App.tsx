import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import TestEnv from "./components/TestEnv";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import FisherDashboard from "./pages/FisherDashboard";
import BuyerDashboard from "./pages/BuyerDashboard";
import Safety from "./pages/Safety";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import { SafetyFAB } from "./components/SafetyFAB";
import { AuthProvider } from '@/hooks/use-auth';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/fisher-dashboard" element={<FisherDashboard />} />
          <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
          <Route path="/safety" element={<Safety />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="/test-env" element={<TestEnv />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
          <SafetyFAB />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
