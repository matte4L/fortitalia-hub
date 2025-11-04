import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Trophy, Eye, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Predictions = () => {
  const { toast } = useToast();
  const [totalPredictions, setTotalPredictions] = useState(0);
  const [activeCampaign, setActiveCampaign] = useState<any>(null);
  const [formData, setFormData] = useState({
    username: "",
    twitchId: ""
  });
  const [customResponses, setCustomResponses] = useState<{[key: string]: string}>({});

  useEffect(() => {
    loadActiveCampaign();
    loadTotalPredictions();
  }, []);

  const loadTotalPredictions = async () => {
    try {
      const { count, error } = await supabase
        .from('predictions')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      setTotalPredictions(count || 0);
    } catch (error: any) {
      console.error('Error loading predictions count:', error);
    }
  };

  const loadActiveCampaign = async () => {
    try {
      const now = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('prediction_campaigns')
        .select('*, tournaments(name)')
        .lte('start_date', now)
        .gte('end_date', now)
        .eq('is_active', true)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setActiveCampaign({
          id: data.id,
          tournamentName: (data.tournaments as any)?.name || '',
          endDate: data.end_date,
          fields: data.fields
        });
      }
    } catch (error: any) {
      console.error('Error loading active campaign:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!activeCampaign) {
      toast({
        title: "Errore",
        description: "Nessuna prediction attiva al momento!",
        variant: "destructive"
      });
      return;
    }

    if (!formData.username || !formData.twitchId) {
      toast({
        title: "Errore",
        description: "Compila username e ID Twitch!",
        variant: "destructive"
      });
      return;
    }

    // Verifica campi required
    const missingRequired = (activeCampaign.fields as any)?.filter((f: any) => f.required && !customResponses[f.label]);
    if (missingRequired?.length > 0) {
      toast({
        title: "Errore",
        description: "Compila tutti i campi obbligatori!",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const { error } = await supabase
        .from('predictions')
        .insert([{
          campaign_id: activeCampaign.id,
          username: formData.username,
          twitch_id: formData.twitchId,
          responses: customResponses
        }]);
      
      if (error) throw error;
      
      await loadTotalPredictions();
      
      toast({
        title: "Prediction Inviata! 🎉",
        description: "Le tue previsioni sono state registrate. Buona fortuna!",
      });

      setFormData({ username: "", twitchId: "" });
      setCustomResponses({});
    } catch (error: any) {
      console.error('Error submitting prediction:', error);
      toast({
        title: "Errore",
        description: "Errore nell'invio della prediction",
        variant: "destructive"
      });
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCustomResponse = (label: string, value: string) => {
    setCustomResponses(prev => ({ ...prev, [label]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-primary">
              Predictions Tornei
            </h1>
            <p className="text-xl text-muted-foreground">
              Invia le tue previsioni e sfida la community!
            </p>
          </div>

          {!activeCampaign && (
            <Alert className="mb-8 border-yellow-500/50 bg-yellow-500/10">
              <AlertCircle className="h-4 w-4 text-yellow-500" />
              <AlertDescription className="text-yellow-500">
                Non ci sono predictions attive al momento. Torna più tardi!
              </AlertDescription>
            </Alert>
          )}

          {activeCampaign && (
            <Card className="mb-8 border-primary/50 bg-primary/5">
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">{activeCampaign.tournamentName}</h3>
                  <p className="text-sm text-muted-foreground">
                    Prediction attiva fino al {new Date(activeCampaign.endDate).toLocaleString('it-IT')}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-center mb-8">
            <Link to="/public-predictions">
              <Button variant="outline" className="gap-2">
                <Eye className="w-4 h-4" /> Vedi Tutte le Predictions
              </Button>
            </Link>
          </div>

          <div className="flex justify-center mb-8">
            <Card className="bg-card/50 border-primary/20 w-full max-w-xs">
              <CardContent className="pt-6 text-center">
                <Trophy className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold">{totalPredictions}</p>
                <p className="text-sm text-muted-foreground">Predictions Totali</p>
              </CardContent>
            </Card>
          </div>

          <Card className="glow-primary">
            <CardHeader>
            <CardTitle className="text-2xl">Invia la Tua Prediction</CardTitle>
              <CardDescription>
                {activeCampaign 
                  ? `Compila il form con le tue previsioni per ${activeCampaign.tournamentName}`
                  : "Nessuna prediction attiva al momento"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!activeCampaign ? (
                <div className="text-center py-12">
                  <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Nessuna prediction attiva. Le predictions saranno disponibili quando verrà attivata una nuova prediction.
                  </p>
                </div>
              ) : (
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
                      <Label htmlFor="twitchId">ID Twitch *</Label>
                      <Input
                        id="twitchId"
                        type="text"
                        placeholder="Il tuo ID Twitch"
                        value={formData.twitchId}
                        onChange={(e) => handleChange("twitchId", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {activeCampaign.fields?.map((field: any) => (
                    <div key={field.id} className="space-y-2">
                      <Label htmlFor={field.id}>
                        {field.label} {field.required && "*"}
                      </Label>
                      {field.type === "text" && (
                        <Input
                          id={field.id}
                          value={customResponses[field.label] || ""}
                          onChange={(e) => handleCustomResponse(field.label, e.target.value)}
                          required={field.required}
                        />
                      )}
                      {field.type === "textarea" && (
                        <Textarea
                          id={field.id}
                          value={customResponses[field.label] || ""}
                          onChange={(e) => handleCustomResponse(field.label, e.target.value)}
                          required={field.required}
                          rows={3}
                        />
                      )}
                      {field.type === "select" && (
                        <select
                          id={field.id}
                          value={customResponses[field.label] || ""}
                          onChange={(e) => handleCustomResponse(field.label, e.target.value)}
                          required={field.required}
                          className="w-full px-3 py-2 rounded-md border border-input bg-background"
                        >
                          <option value="">Seleziona...</option>
                          {field.options?.map((opt: string) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      )}
                    </div>
                  ))}

                  <Button type="submit" size="lg" className="w-full glow-accent">
                    Invia Prediction
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>Le tue predictions saranno visibili pubblicamente nella sezione Community</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Predictions;