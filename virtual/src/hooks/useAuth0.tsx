import { useAuth0 } from "@auth0/auth0-react";

const enableAuth = import.meta.env.VITE_ENABLE_AUTH === "true";

export const useAuth = () => {
  // ✅ Always call the hook
  const auth0 = useAuth0();

  if (!enableAuth) {
    // Mock values for local dev
    return {
      isAuthenticated: true,
      user: { name: "Local Dev User", email: "dev@local.test" },
      loginWithRedirect: () => console.log("Mock login"),
      logout: () => console.log("Mock logout"),
      isLoading: false,
    };
  }

  // Use real Auth0 values
  return auth0;
};
