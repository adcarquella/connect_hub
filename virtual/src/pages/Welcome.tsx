import { Button } from "@/components/ui/button";
import { useAuth0  } from "@auth0/auth0-react";
//import { useAuth } from "@/hooks/useAuth0";

const Welcome = () => {
  
  const { loginWithRedirect } = useAuth0();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-6 max-w-md mx-auto px-6">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-foreground">Arquella Connect</h1>
          <h2 className="text-2xl font-semibold text-foreground">Welcome to Arquella Connect</h2>
          <p className="text-muted-foreground">
            Please log in to your account.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            variant="outline" 
             onClick={()=>loginWithRedirect()}
            className="text-card-foreground border-border hover:bg-muted"
          >
            Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
