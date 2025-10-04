import { useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Trophy, Target, Users } from "lucide-react";

const Predictions = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    tournament: "",
    winner: "",
    topPlayer: "",
    killLeader: "",
    predictions: ""
  });

  const tournaments = [
    "Coppa Italia Fortnite 2024",
    "Weekly Italian Cup #47",
    "Torneo Solo Regional",
    "Duo Championship Italy"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Salva le predictions in localStorage
    const predictions = JSON.parse(localStorage.getItem("predictions") || "[]");
    predictions.push({
      ...formData,
      date: new Date().toISOString(),
      id: Date.now()
    });
    localStorage.setItem("predictions", JSON.stringify(predictions));

    toast({
      title: "Prediction Inviata! 🎉",
      description: "Le tue previsioni sono state registrate. Buona fortuna!",
    });

    // Reset form
    setFormData({
      username: "",
      email: "",
      tournament: "",
      winner: "",
      topPlayer: "",
      killLeader: "",
      predictions: ""
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-primary">
              Predictions Tornei
            </h1>
            <p className="text-xl text-muted-foreground">
              Invia le tue previsioni e sfida la community!
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Card className="bg-card/50 border-primary/20">
              <CardContent className="pt-6 text-center">
                <Trophy className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold">245</p>
                <p className="text-sm text-muted-foreground">Predictions Totali</p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-accent/20">
              <CardContent className="pt-6 text-center">
                <Target className="w-8 h-8 text-accent mx-auto mb-2" />
                <p className="text-2xl font-bold">78%</p>
                <p className="text-sm text-muted-foreground">Accuratezza Media</p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-gaming-cyan/20">
              <CardContent className="pt-6 text-center">
                <Users className="w-8 h-8 text-gaming-cyan mx-auto mb-2" />
                <p className="text-2xl font-bold">128</p>
                <p className="text-sm text-muted-foreground">Partecipanti Attivi</p>
              </CardContent>
            </Card>
          </div>

          <Card className="glow-primary">
            <CardHeader>
              <CardTitle className="text-2xl">Invia la Tua Prediction</CardTitle>
              <CardDescription>
                Compila il form con le tue previsioni per il torneo selezionato
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username *</Label>
                    <Input
                      id="username"
                      placeholder="Il tuo nickname"
                      value={formData.username}
                      onChange={(e) => handleChange("username", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="la-tua@email.com"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tournament">Seleziona Torneo *</Label>
                  <Select value={formData.tournament} onValueChange={(value) => handleChange("tournament", value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Scegli un torneo" />
                    </SelectTrigger>
                    <SelectContent>
                      {tournaments.map((tournament) => (
                        <SelectItem key={tournament} value={tournament}>
                          {tournament}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="winner">Vincitore Previsto *</Label>
                    <Input
                      id="winner"
                      placeholder="Nome team/player"
                      value={formData.winner}
                      onChange={(e) => handleChange("winner", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="topPlayer">Top Player</Label>
                    <Input
                      id="topPlayer"
                      placeholder="MVP del torneo"
                      value={formData.topPlayer}
                      onChange={(e) => handleChange("topPlayer", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="killLeader">Kill Leader</Label>
                    <Input
                      id="killLeader"
                      placeholder="Chi farà più kills"
                      value={formData.killLeader}
                      onChange={(e) => handleChange("killLeader", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="predictions">Note Aggiuntive</Label>
                  <Textarea
                    id="predictions"
                    placeholder="Aggiungi altre previsioni o commenti..."
                    value={formData.predictions}
                    onChange={(e) => handleChange("predictions", e.target.value)}
                    rows={4}
                  />
                </div>

                <Button type="submit" size="lg" className="w-full glow-accent">
                  Invia Prediction
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>Le tue predictions saranno visibili alla community dopo la revisione</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Predictions;