import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NotFound from "./pages/NotFound";
import { useAuth0 } from "@auth0/auth0-react";
import Loading from "./components/layout/Loading";
import Welcome from "./pages/Welcome";
import { Demo } from "./pages/Demo";

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
          element={isAuthenticated ? <Demo /> : <Welcome />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
