
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider, useUser } from "./contexts/UserContext";
import Layout from "./components/Layout";
import StudentDashboard from "./pages/StudentDashboard";
import VendorDashboard from "./pages/VendorDashboard";
import Search from "./pages/Search";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import RestaurantDetail from "./pages/RestaurantDetail";
import RoleSelection from "./components/RoleSelection";
import AuthDialog from "./components/AuthDialog";

const queryClient = new QueryClient();

const AppContent = () => {
  const { user, role, isAuthenticated, showAuthDialog, setShowAuthDialog, loading } = useUser();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center mb-4 mx-auto">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <p className="text-orange-600 font-semibold">Loading SnappyEats...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !role) {
    return (
      <>
        <RoleSelection />
        <AuthDialog isOpen={showAuthDialog} onClose={() => setShowAuthDialog(false)} />
      </>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {role === 'student' ? (
          <Route path="/" element={<Layout />}>
            <Route index element={<StudentDashboard />} />
            <Route path="search" element={<Search />} />
            <Route path="orders" element={<Orders />} />
            <Route path="profile" element={<Profile />} />
            <Route path="restaurant/:id" element={<RestaurantDetail />} />
          </Route>
        ) : (
          <Route path="/" element={<VendorDashboard />} />
        )}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <UserProvider>
        <AppContent />
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
