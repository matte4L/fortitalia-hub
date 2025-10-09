import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Target, Trash2, Eye, Download, Plus, Edit, Calendar } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Prediction {
  username: string;
  twitchId: string;
  tournament: string;
  winner: string;
  killLeader: string;
  notes?: string;
  timestamp: string;
}

interface PredictionCampaign {
  id: string;
  tournamentId: string;
  tournamentName: string;
  startDate: string;
  endDate: string;
  createdAt: string;
}

const PredictionsManager = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [campaigns, setCampaigns] = useState<PredictionCampaign[]>([]);
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [selectedPrediction, setSelectedPrediction] = useState<Prediction | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCampaignDialogOpen, setIsCampaignDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editForm, setEditForm] = useState<Prediction | null>(null);
  const [filterTournament, setFilterTournament] = useState<string>("");
  const [newCampaign, setNewCampaign] = useState({
    tournamentId: "",
    startDate: "",
    endDate: ""
  });

  useEffect(() => {
    loadPredictions();
    loadCampaigns();
    loadTournaments();
  }, []);

  const loadTournaments = () => {
    const saved = localStorage.getItem("tournaments_data");
    if (saved) {
      setTournaments(JSON.parse(saved));
    }
  };

  const loadCampaigns = () => {
    const saved = localStorage.getItem("prediction_campaigns");
    if (saved) {
      setCampaigns(JSON.parse(saved));
    }
  };

  const loadPredictions = () => {
    const saved = localStorage.getItem("tournament_predictions");
    if (saved) {
      setPredictions(JSON.parse(saved));
      return;
    }
    const legacy = localStorage.getItem("predictions");
    if (legacy) {
      try {
        const legacyArr = JSON.parse(legacy);
        const migrated = legacyArr.map((p: any) => ({
          username: p.username || "",
          twitchId: p.twitchId || p.email || "N/D",
          tournament: p.tournament || "",
          winner: p.winner || "",
          killLeader: p.killLeader || "",
          notes: p.predictions || p.notes || "",
          timestamp: p.timestamp || p.date || new Date().toISOString(),
        }));
        localStorage.setItem("tournament_predictions", JSON.stringify(migrated));
        setPredictions(migrated);
      } catch (e) {
        setPredictions([]);
      }
    } else {
      setPredictions([]);
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
    setIsEditMode(false);
    setIsDialogOpen(true);
  };

  const handleEdit = (prediction: Prediction) => {
    setEditForm(prediction);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const handleCreateNew = () => {
    setEditForm({
      username: "",
      twitchId: "",
      tournament: "",
      winner: "",
      killLeader: "",
      notes: "",
      timestamp: "", // empty means new
    });
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (editForm) {
      if (!editForm.username || !editForm.twitchId || !editForm.tournament || !editForm.winner) {
        toast.error("Compila i campi obbligatori: Username, ID Twitch, Torneo, Vincitore");
        return;
      }
      const existsIndex = predictions.findIndex((p) => p.timestamp === editForm.timestamp && editForm.timestamp);
      let updated = [...predictions];
      if (existsIndex !== -1) {
        updated[existsIndex] = editForm;
      } else {
        const toAdd = { ...editForm, timestamp: new Date().toISOString() };
        updated = [toAdd, ...updated];
      }
      localStorage.setItem("tournament_predictions", JSON.stringify(updated));
      setPredictions(updated);
      toast.success("Prediction salvata!");
      setIsDialogOpen(false);
      setEditForm(null);
    }
  };

  const handleCreateCampaign = () => {
    if (!newCampaign.tournamentId || !newCampaign.startDate || !newCampaign.endDate) {
      toast.error("Compila tutti i campi della campagna");
      return;
    }

    const tournament = tournaments.find(t => t.id === newCampaign.tournamentId);
    if (!tournament) {
      toast.error("Torneo non trovato");
      return;
    }

    const campaign: PredictionCampaign = {
      id: Date.now().toString(),
      tournamentId: newCampaign.tournamentId,
      tournamentName: tournament.name,
      startDate: newCampaign.startDate,
      endDate: newCampaign.endDate,
      createdAt: new Date().toISOString()
    };

    const updated = [...campaigns, campaign];
    localStorage.setItem("prediction_campaigns", JSON.stringify(updated));
    setCampaigns(updated);
    setIsCampaignDialogOpen(false);
    setNewCampaign({ tournamentId: "", startDate: "", endDate: "" });
    toast.success("Campagna creata con successo!");
  };

  const handleDeleteCampaign = (campaignId: string) => {
    if (confirm("Eliminare questa campagna? Le prediction già inviate non saranno eliminate.")) {
      const updated = campaigns.filter(c => c.id !== campaignId);
      localStorage.setItem("prediction_campaigns", JSON.stringify(updated));
      setCampaigns(updated);
      toast.success("Campagna eliminata!");
    }
  };

  const handleResetCounter = () => {
    if (confirm("Resettare il contatore delle predictions? Questo non eliminerà le predictions esistenti.")) {
      toast.success("Il contatore riflette sempre il numero reale di predictions!");
    }
  };

  const handleClearAll = () => {
    if (confirm("Eliminare TUTTE le predictions? Questa azione non può essere annullata!")) {
      localStorage.setItem("tournament_predictions", JSON.stringify([]));
      setPredictions([]);
      toast.success("Tutte le predictions sono state eliminate!");
    }
  };

  // Sync con invii da altre pagine/schede
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "tournament_predictions") loadPredictions();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const handleExport = () => {
    const csv = [
      ["Username", "ID Twitch", "Torneo", "Vincitore Previsto", "Kill Leader", "Note", "Data"],
      ...predictions.map(p => [
        p.username,
        p.twitchId,
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

  const getActiveCampaign = () => {
    const now = new Date();
    return campaigns.find(c => {
      const start = new Date(c.startDate);
      const end = new Date(c.endDate);
      return now >= start && now <= end;
    });
  };

  const filteredPredictions = filterTournament && filterTournament !== "all"
    ? predictions.filter(p => p.tournament === filterTournament)
    : predictions;

  return (
    <div className="space-y-6">
      {/* Gestione Campagne */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Campagne Prediction
            </CardTitle>
            <Button onClick={() => setIsCampaignDialogOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" /> Crea Campagna
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {campaigns.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Nessuna campagna attiva. Crea una campagna per permettere agli utenti di inviare predictions.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {campaigns.map((campaign) => {
                const now = new Date();
                const start = new Date(campaign.startDate);
                const end = new Date(campaign.endDate);
                const isActive = now >= start && now <= end;
                const isUpcoming = now < start;
                const isExpired = now > end;

                return (
                  <div
                    key={campaign.id}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      isActive ? 'bg-primary/10 border-primary' : 'bg-card/50 border-border'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{campaign.tournamentName}</h3>
                        <span className={`text-xs px-2 py-1 rounded ${
                          isActive ? 'bg-primary text-primary-foreground' :
                          isUpcoming ? 'bg-blue-500/20 text-blue-500' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {isActive ? 'ATTIVA' : isUpcoming ? 'PROSSIMA' : 'SCADUTA'}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p><strong>Inizio:</strong> {new Date(campaign.startDate).toLocaleString('it-IT')}</p>
                        <p><strong>Fine:</strong> {new Date(campaign.endDate).toLocaleString('it-IT')}</p>
                      </div>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDeleteCampaign(campaign.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Predictions Ricevute */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Predictions Ricevute ({predictions.length})
            </CardTitle>
            <div className="flex items-center gap-2 flex-wrap">
              <Select value={filterTournament} onValueChange={setFilterTournament}>
                <SelectTrigger className="w-[220px]"><SelectValue placeholder="Filtro Torneo" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutti i Tornei</SelectItem>
                  {Array.from(new Set(predictions.map(p => p.tournament))).map(t => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleCreateNew} variant="default" className="gap-2">
                <Plus className="w-4 h-4" /> Crea Prediction
              </Button>
              {predictions.length > 0 && (
                <>
                  <Button onClick={handleExport} variant="outline" className="gap-2">
                    <Download className="w-4 h-4" /> Esporta CSV
                  </Button>
                  <Button onClick={handleClearAll} variant="destructive" className="gap-2">
                    <Trash2 className="w-4 h-4" /> Elimina Tutto
                  </Button>
                </>
              )}
            </div>
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
              {filteredPredictions.map((prediction, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-card/50 rounded-lg border border-border hover:border-primary/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{prediction.username}</h3>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">{prediction.twitchId}</span>
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
                      variant="outline"
                      onClick={() => handleEdit(prediction)}
                    >
                      <Edit className="w-4 h-4" />
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

      {/* Dialog Crea Campagna */}
      <Dialog open={isCampaignDialogOpen} onOpenChange={setIsCampaignDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Crea Nuova Campagna Prediction</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Torneo</Label>
              <Select value={newCampaign.tournamentId} onValueChange={(value) => setNewCampaign({...newCampaign, tournamentId: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona un torneo" />
                </SelectTrigger>
                <SelectContent>
                  {tournaments.map(t => (
                    <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Data e Ora Inizio</Label>
              <Input
                type="datetime-local"
                value={newCampaign.startDate}
                onChange={(e) => setNewCampaign({...newCampaign, startDate: e.target.value})}
              />
            </div>
            <div>
              <Label>Data e Ora Fine</Label>
              <Input
                type="datetime-local"
                value={newCampaign.endDate}
                onChange={(e) => setNewCampaign({...newCampaign, endDate: e.target.value})}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsCampaignDialogOpen(false)}>Annulla</Button>
              <Button onClick={handleCreateCampaign}>Crea Campagna</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog per visualizzare/modificare prediction */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Modifica Prediction" : "Dettaglio Prediction"}</DialogTitle>
          </DialogHeader>
          {isEditMode && editForm ? (
            <div className="space-y-4">
              <div>
                <Label>Username</Label>
                <Input 
                  value={editForm.username} 
                  onChange={(e) => setEditForm({...editForm, username: e.target.value})}
                />
              </div>
              <div>
                <Label>ID Twitch</Label>
                <Input 
                  value={editForm.twitchId} 
                  onChange={(e) => setEditForm({...editForm, twitchId: e.target.value})}
                />
              </div>
              <div>
                <Label>Torneo</Label>
                <Input 
                  value={editForm.tournament} 
                  onChange={(e) => setEditForm({...editForm, tournament: e.target.value})}
                />
              </div>
              <div>
                <Label>Vincitore Previsto</Label>
                <Input 
                  value={editForm.winner} 
                  onChange={(e) => setEditForm({...editForm, winner: e.target.value})}
                />
              </div>
              <div>
                <Label>Kill Leader</Label>
                <Input 
                  value={editForm.killLeader} 
                  onChange={(e) => setEditForm({...editForm, killLeader: e.target.value})}
                />
              </div>
              <div>
                <Label>Note Aggiuntive</Label>
                <Textarea 
                  value={editForm.notes || ""} 
                  onChange={(e) => setEditForm({...editForm, notes: e.target.value})}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Annulla</Button>
                <Button onClick={handleSaveEdit}>Salva Modifiche</Button>
              </div>
            </div>
          ) : selectedPrediction && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Username</label>
                <p className="text-lg font-semibold">{selectedPrediction.username}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">ID Twitch</label>
                <p>{selectedPrediction.twitchId}</p>
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
