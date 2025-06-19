
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

const queryClient = new QueryClient();

const AppContent = () => {
  const { role } = useUser();

  if (!role) {
    return <RoleSelection />;
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
