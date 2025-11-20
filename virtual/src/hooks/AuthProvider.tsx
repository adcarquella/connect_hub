import React from "react";
import { Auth0Provider } from "@auth0/auth0-react";

const enableAuth = import.meta.env.VITE_ENABLE_AUTH === "true";

interface Props {
  children: React.ReactNode;
}

export const AppAuthProvider: React.FC<Props> = ({ children }) => {
  if (!enableAuth) {
    // When Auth is disabled, just return children directly
    return <>{children}</>;
  }

  const domain = import.meta.env.VITE_AUTH0_DOMAIN!;
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID!;
  const redirectUri = window.location.origin;

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
      }}
    >
      {children}
    </Auth0Provider>
  );
};
