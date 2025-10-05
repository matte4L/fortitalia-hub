import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, Trash2, Eye, Download } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Prediction {
  username: string;
  email: string;
  tournament: string;
  winner: string;
  killLeader: string;
  notes?: string;
  timestamp: string;
}

const PredictionsManager = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [selectedPrediction, setSelectedPrediction] = useState<Prediction | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    loadPredictions();
  }, []);

  const loadPredictions = () => {
    const saved = localStorage.getItem("tournament_predictions");
    if (saved) {
      setPredictions(JSON.parse(saved));
    }
  };

  const handleDelete = (index: number) => {
    if (confirm("Eliminare questa prediction?")) {
      const updated = predictions.filter((_, i) => i !== index);
      localStorage.setItem("tournament_predictions", JSON.stringify(updated));
      setPredictions(updated);
      toast.success("Prediction eliminata!");
    }
  };

  const handleView = (prediction: Prediction) => {
    setSelectedPrediction(prediction);
    setIsDialogOpen(true);
  };

  const handleExport = () => {
    const csv = [
      ["Username", "Email", "Torneo", "Vincitore Previsto", "Kill Leader", "Note", "Data"],
      ...predictions.map(p => [
        p.username,
        p.email,
        p.tournament,
        p.winner,
        p.killLeader,
        p.notes || "",
        p.timestamp
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "predictions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Predictions esportate!");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Predictions Ricevute ({predictions.length})
            </CardTitle>
            {predictions.length > 0 && (
              <Button onClick={handleExport} variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Esporta CSV
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {predictions.length === 0 ? (
            <div className="text-center py-12">
              <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Nessuna prediction ancora. Gli utenti possono inviarle dalla pagina Predictions.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {predictions.map((prediction, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-card/50 rounded-lg border border-border hover:border-primary/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{prediction.username}</h3>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">{prediction.email}</span>
                    </div>
                    <div className="text-sm space-y-1">
                      <p className="text-muted-foreground">
                        <strong>Torneo:</strong> {prediction.tournament}
                      </p>
                      <p className="text-muted-foreground">
                        <strong>Vincitore:</strong> {prediction.winner} | <strong>Kill Leader:</strong> {prediction.killLeader}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(prediction.timestamp).toLocaleString('it-IT')}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => handleView(prediction)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Come Funziona</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            🎯 <strong>Raccolta Predictions:</strong> Gli utenti inviano le loro previsioni tramite 
            il form nella pagina /predictions. Ogni prediction include torneo, vincitore previsto, 
            kill leader e note opzionali.
          </p>
          <p>
            💾 <strong>Archiviazione:</strong> Le predictions vengono salvate in localStorage con 
            timestamp. Puoi visualizzarle, eliminarle o esportarle in CSV.
          </p>
          <p>
            📊 <strong>Analisi:</strong> Esporta i dati per analizzare le previsioni della community, 
            creare statistiche di accuratezza o identificare i migliori previsori.
          </p>
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mt-4">
            <p className="text-primary font-medium">
              💡 Consiglio: Dopo ogni torneo, confronta le predictions con i risultati reali per 
              premiare gli utenti più accurati e creare engagement.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Dialog per visualizzare prediction completa */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dettaglio Prediction</DialogTitle>
          </DialogHeader>
          {selectedPrediction && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Username</label>
                <p className="text-lg font-semibold">{selectedPrediction.username}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p>{selectedPrediction.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Torneo</label>
                <p>{selectedPrediction.tournament}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Vincitore Previsto</label>
                <p className="text-lg font-semibold text-primary">{selectedPrediction.winner}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Kill Leader</label>
                <p className="text-lg font-semibold text-accent">{selectedPrediction.killLeader}</p>
              </div>
              {selectedPrediction.notes && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Note Aggiuntive</label>
                  <p className="text-sm">{selectedPrediction.notes}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-muted-foreground">Data Invio</label>
                <p className="text-sm">{new Date(selectedPrediction.timestamp).toLocaleString('it-IT')}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PredictionsManager;
