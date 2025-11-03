import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, Newspaper, Trophy, Users, Target } from "lucide-react";
import { toast } from "sonner";
import NewsManager from "@/components/admin/NewsManager";
import TournamentManager from "@/components/admin/TournamentManager";
import PlayerManager from "@/components/admin/PlayerManager";
import PredictionsManager from "@/components/admin/PredictionsManager";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isAdmin, loading } = useAuth();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      toast.error("Accesso non autorizzato!");
      navigate("/admin");
    }
  }, [user, isAdmin, loading, navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logout effettuato!");
    navigate("/");
  };

  if (loading || !user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-gaming rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">🇮🇹</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary">Dashboard Admin</h1>
              <p className="text-sm text-muted-foreground">Gestisci il tuo sito</p>
            </div>
          </div>
          <Button variant="destructive" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="news" className="space-y-6">
          <TabsList className="grid w-full max-w-4xl mx-auto grid-cols-4 h-auto">
            <TabsTrigger value="news" className="gap-2">
              <Newspaper className="w-4 h-4" />
              Notizie
            </TabsTrigger>
            <TabsTrigger value="tournaments" className="gap-2">
              <Trophy className="w-4 h-4" />
              Tornei
            </TabsTrigger>
            <TabsTrigger value="players" className="gap-2">
              <Users className="w-4 h-4" />
              Players
            </TabsTrigger>
            <TabsTrigger value="predictions" className="gap-2">
              <Target className="w-4 h-4" />
              Predictions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="news">
            <NewsManager />
          </TabsContent>

          <TabsContent value="tournaments">
            <TournamentManager />
          </TabsContent>

          <TabsContent value="players">
            <PlayerManager />
          </TabsContent>

          <TabsContent value="predictions">
            <PredictionsManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
