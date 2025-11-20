import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
  const { isAuthenticated, isLoading, error } = useAuth0();

  // Handle Auth0 loading state
  if (isLoading) {
    return <Loading />; // or a full-screen spinner
  }

  if (error) {
    return <div>Oops... {error.message}</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* If user is authenticated, go to LiveCalls, otherwise Welcome */}
        <Route
          path="/"
          element={isAuthenticated ? <Dashboard /> : <Welcome />}
        />
      <Route
          path="/live"
          element={isAuthenticated ? <LiveCalls /> : <Welcome />}
        />

        {/* Protected routes - you can guard them using Navigate */}
        <Route
          path="/reports"
          element={isAuthenticated ? <Reports /> : <Navigate to="/" />}
        />
        <Route
          path="/analytics"
          element={isAuthenticated ? <Analytics /> : <Navigate to="/" />}
        />
        <Route
          path="/team"
          element={isAuthenticated ? <Team /> : <Navigate to="/" />}
        />
        <Route
          path="/users"
          element={isAuthenticated ? <Users /> : <Navigate to="/" />}
        />
        <Route
          path="/battery"
          element={isAuthenticated ? <Battery /> : <Navigate to="/" />}
        />
        <Route
          path="/configuration"
          element={isAuthenticated ? <Configuration /> : <Navigate to="/" />}
        />
        <Route
          path="/senior-living"
          element={isAuthenticated ? <SeniorLiving /> : <Navigate to="/" />}
        />
        <Route
          path="/move"
          element={isAuthenticated ? <Move /> : <Navigate to="/" />}
        />
        <Route
          path="/floor-plan"
          element={isAuthenticated ? <FloorPlan /> : <Navigate to="/" />}
        />
        <Route
          path="/call-data"
          element={isAuthenticated ? <CallData /> : <Navigate to="/" />}
        />
        <Route
          path="/call-list"
          element={isAuthenticated ? <CallList /> : <Navigate to="/" />}
        />
        <Route
          path="/insights"
          element={isAuthenticated ? <Insights /> : <Navigate to="/" />}
        />
        <Route
          path="/devices"
          element={isAuthenticated ? <Devices /> : <Navigate to="/" />}
        />
        <Route
          path="/style"
          element={isAuthenticated ? <Style /> : <Navigate to="/" />}
        />
        <Route
          path="/care-plan"
          element={isAuthenticated ? <CarePlan /> : <Navigate to="/" />}
        />
        <Route
          path="/examples"
          element={isAuthenticated ? <Examples /> : <Navigate to="/" />}
        />
        <Route
          path="/live-calls"
          element={isAuthenticated ? <LiveCalls /> : <Navigate to="/" />}
        />
        <Route
          path="/sense"
          element={isAuthenticated ? <Sense /> : <Navigate to="/" />}
        />

        {/* Catch all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
