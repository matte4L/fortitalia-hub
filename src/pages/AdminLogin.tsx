import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Lock } from "lucide-react";

const AdminLogin = () => {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Password: admin123 (in produzione usa una password più sicura!)
  const ADMIN_PASSWORD = "admin123";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simula un piccolo delay per UX
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        // Salva token di sessione
        localStorage.setItem("admin_token", "logged_in");
        toast.success("Accesso effettuato!");
        navigate("/admin/dashboard");
      } else {
        toast.error("Password errata!");
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-gaming rounded-lg flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-3xl">Dashboard Admin</CardTitle>
          <CardDescription>
            Inserisci la password per accedere al pannello di controllo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-lg"
                autoFocus
              />
            </div>
            <Button
              type="submit"
              className="w-full glow-primary"
              disabled={isLoading || !password}
            >
              {isLoading ? "Accesso in corso..." : "Accedi"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
