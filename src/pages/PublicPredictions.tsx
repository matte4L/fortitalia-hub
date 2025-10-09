import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Target, Trophy, Crosshair } from "lucide-react";

interface Prediction {
  username: string;
  twitchId: string;
  tournament: string;
  winner: string;
  killLeader: string;
  notes?: string;
  timestamp: string;
}

const PublicPredictions = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [filterTournament, setFilterTournament] = useState<string>("");

  useEffect(() => {
    loadPredictions();
    
    const handleStorage = () => loadPredictions();
    window.addEventListener("storage", handleStorage);
    window.addEventListener("focus", handleStorage);
    
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("focus", handleStorage);
    };
  }, []);

  const loadPredictions = () => {
    const saved = localStorage.getItem("tournament_predictions");
    if (saved) {
      const parsed = JSON.parse(saved);
      setPredictions(parsed.sort((a: Prediction, b: Prediction) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ));
    }
  };

  const filteredPredictions = filterTournament
    ? predictions.filter(p => p.tournament === filterTournament)
    : predictions;

  const tournaments = Array.from(new Set(predictions.map(p => p.tournament)));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-primary">
              Predictions Community
            </h1>
            <p className="text-xl text-muted-foreground">
              Tutte le predictions della community
            </p>
          </div>

          {tournaments.length > 0 && (
            <div className="flex justify-center mb-8">
              <Select value={filterTournament} onValueChange={setFilterTournament}>
                <SelectTrigger className="w-[300px]">
                  <SelectValue placeholder="Filtra per torneo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tutti i Tornei</SelectItem>
                  {tournaments.map(t => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {filteredPredictions.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Nessuna prediction disponibile al momento.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {filteredPredictions.map((prediction, index) => (
                <Card key={index} className="hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-primary" />
                        <span className="text-lg">{prediction.username}</span>
                      </div>
                      <span className="text-xs text-muted-foreground font-normal">
                        {new Date(prediction.timestamp).toLocaleDateString('it-IT')}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Torneo</p>
                      <p className="font-semibold">{prediction.tournament}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-primary/10 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Trophy className="w-4 h-4 text-primary" />
                          <p className="text-xs text-muted-foreground">Vincitore</p>
                        </div>
                        <p className="font-bold text-primary">{prediction.winner}</p>
                      </div>

                      <div className="bg-accent/10 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Crosshair className="w-4 h-4 text-accent" />
                          <p className="text-xs text-muted-foreground">Kill Leader</p>
                        </div>
                        <p className="font-bold text-accent">{prediction.killLeader}</p>
                      </div>
                    </div>

                    {prediction.notes && (
                      <div className="bg-muted/50 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">Note</p>
                        <p className="text-sm">{prediction.notes}</p>
                      </div>
                    )}

                    <div className="text-xs text-muted-foreground">
                      ID Twitch: {prediction.twitchId}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PublicPredictions;
