import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import Analytics from "./pages/Analytics";
import Team from "./pages/Team";
import Users from "./pages/Users";
import Battery from "./pages/Battery";
import Configuration from "./pages/Configuration";
import { SeniorLiving } from "./pages/SeniorLiving";
import { Move } from "./pages/Move";
import { FloorPlan } from "./pages/FloorPlan";
import Style from "./pages/Style";
import CallData from "./pages/CallData";
import CallList from "./pages/CallList";
import Insights from "./pages/Insights";
import Devices from "./pages/Devices";
import NotFound from "./pages/NotFound";
import CarePlan from "./pages/CarePlan";
import Examples from "./pages/Examples";
import { LiveCalls } from "./pages/LiveCalls";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/team" element={<Team />} />
            <Route path="/users" element={<Users />} />
              <Route path="/battery" element={<Battery />} />
              <Route path="/configuration" element={<Configuration />} />
              <Route path="/senior-living" element={<SeniorLiving />} />
              <Route path="/move" element={<Move />} />
              <Route path="/floor-plan" element={<FloorPlan />} />
              <Route path="/call-data" element={<CallData />} />
              <Route path="/call-list" element={<CallList />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="/devices" element={<Devices />} />
              <Route path="/style" element={<Style />} />
              <Route path="/care-plan" element={<CarePlan />} />
              <Route path="/examples" element={<Examples />} />
              <Route path="/live-calls" element={<LiveCalls />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
