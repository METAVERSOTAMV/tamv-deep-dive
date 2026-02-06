import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import DreamweaveSpaces from "./pages/DreamweaveSpaces";
import DevHub from "./pages/DevHub";
import Districts from "./pages/Districts";
import SystemStatus from "./pages/SystemStatus";
import TAMVOmniverso from "./pages/TAMVOmniverso";
import Feed from "./pages/Feed";
import Guardian from "./pages/Guardian";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/devhub" element={<DevHub />} />
          <Route path="/status" element={<SystemStatus />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/guardian" element={<Guardian />} />
          <Route path="/district/:districtId" element={<Districts />} />
          <Route path="/omniverso" element={<TAMVOmniverso />} />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dreamweave" 
            element={
              <ProtectedRoute>
                <DreamweaveSpaces />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
