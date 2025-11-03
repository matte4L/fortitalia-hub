import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { user, isAdmin, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user && isAdmin) {
        navigate("/admin/dashboard");
      } else if (user && !isAdmin) {
        navigate("/auth");
      }
    }
  }, [user, isAdmin, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <Lock className="w-12 h-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
            <p className="text-muted-foreground">Caricamento...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-gaming rounded-lg flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl">Accesso Admin</CardTitle>
          <CardDescription>
            Devi effettuare il login per accedere alla dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            Vai alla pagina di autenticazione per accedere.
          </p>
          <button
            onClick={() => navigate("/auth")}
            className="text-primary hover:underline"
          >
            Vai al Login →
          </button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
