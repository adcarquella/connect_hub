import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import { useAuth0 } from "@auth0/auth0-react";
import Loading from "./components/layout/Loading";
import Welcome from "./pages/Welcome";
import Sense from "./pages/Sense";

const AppRoutes = () => {

    const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();

    /*
  if (!isAuthenticated) loginWithRedirect();
  const { isLoading, error } = useAuth0();
  
    if (error) {
      return <div>Oops... {error.message}</div>;
    }
  
    if (isLoading) {
      return <Loading />;
    }
      */
  
  //      if (!isAuthenticated) {
  //      loginWithRedirect(); // Redirect to Auth0 login page
   //     return null; // or a loading spinner while redirecting
    //  }
  
      
  //          <Route path="/" element={(!isAuthenticated)?<Welcome />:<Dashboard />} />
  //          <Route path="/" element={<Dashboard />} />

  //    console.log(user);
  return (

    <BrowserRouter>
      <Routes>
        {<Route path="/" element={(!isAuthenticated)?<Welcome />:<Dashboard />} />}
        {//<Route path="/" element={<Dashboard />} />
}
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
        <Route path="/call-data" element={<CallData />} />
        <Route path="/sense" element={<Sense />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>

  );
}

export default AppRoutes;
