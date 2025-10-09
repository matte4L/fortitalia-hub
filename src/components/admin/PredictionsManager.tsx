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

interface PredictionField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select';
  options?: string[];
  required: boolean;
}

interface Prediction {
  username: string;
  twitchId: string;
  tournament: string;
  responses: { [fieldId: string]: string };
  timestamp: string;
}

interface PredictionCampaign {
  id: string;
  tournamentId: string;
  tournamentName: string;
  startDate: string;
  endDate: string;
  fields: PredictionField[];
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
  const [customFields, setCustomFields] = useState<PredictionField[]>([]);
  const [newField, setNewField] = useState<{ label: string; type: 'text' | 'textarea' | 'select'; required: boolean; options: string }>({ 
    label: "", 
    type: "text", 
    required: true, 
    options: "" 
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
    // Legacy migration - convert old format to new format
    const legacy = localStorage.getItem("predictions");
    if (legacy) {
      try {
        const legacyArr = JSON.parse(legacy);
        const migrated = legacyArr.map((p: any) => ({
          username: p.username || "",
          twitchId: p.twitchId || p.email || "N/D",
          tournament: p.tournament || "",
          responses: {
            "Vincitore": p.winner || "",
            "Kill Leader": p.killLeader || "",
            "Note": p.predictions || p.notes || ""
          },
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

  const handleAddField = () => {
    if (!newField.label) {
      toast.error("Inserisci un'etichetta per il campo");
      return;
    }

    const field: PredictionField = {
      id: Date.now().toString(),
      label: newField.label,
      type: newField.type,
      required: newField.required,
      options: newField.type === 'select' ? newField.options.split(',').map(o => o.trim()).filter(Boolean) : undefined
    };

    setCustomFields([...customFields, field]);
    setNewField({ label: "", type: "text", required: true, options: "" });
    toast.success("Campo aggiunto!");
  };

  const handleRemoveField = (fieldId: string) => {
    setCustomFields(customFields.filter(f => f.id !== fieldId));
  };

  const handleCreateCampaign = () => {
    if (!newCampaign.tournamentId || !newCampaign.startDate || !newCampaign.endDate) {
      toast.error("Compila tutti i campi della prediction");
      return;
    }

    if (customFields.length === 0) {
      toast.error("Aggiungi almeno un campo personalizzato");
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
      fields: customFields,
      createdAt: new Date().toISOString()
    };

    const updated = [...campaigns, campaign];
    localStorage.setItem("prediction_campaigns", JSON.stringify(updated));
    setCampaigns(updated);
    setIsCampaignDialogOpen(false);
    setNewCampaign({ tournamentId: "", startDate: "", endDate: "" });
    setCustomFields([]);
    toast.success("Prediction creata con successo!");
  };

  const handleDeleteCampaign = (campaignId: string) => {
    if (confirm("Eliminare questa prediction? Le prediction già inviate non saranno eliminate.")) {
      const updated = campaigns.filter(c => c.id !== campaignId);
      localStorage.setItem("prediction_campaigns", JSON.stringify(updated));
      setCampaigns(updated);
      toast.success("Prediction eliminata!");
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
    // Get all unique field names
    const allFieldNames = new Set<string>();
    predictions.forEach(p => {
      if (p.responses) {
        Object.keys(p.responses).forEach(key => allFieldNames.add(key));
      }
    });
    
    const fieldArray = Array.from(allFieldNames);
    const headers = ["Username", "ID Twitch", "Torneo", ...fieldArray, "Data"];
    
    const rows = predictions.map(p => [
      p.username,
      p.twitchId,
      p.tournament,
      ...fieldArray.map(field => (p.responses && p.responses[field]) || ""),
      p.timestamp
    ]);

    const csv = [headers, ...rows].map(row => row.join(",")).join("\n");

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
      {/* Gestione Predictions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Predictions Attive
            </CardTitle>
            <Button onClick={() => setIsCampaignDialogOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" /> Crea Prediction
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {campaigns.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Nessuna prediction attiva. Crea una prediction per permettere agli utenti di inviare le loro previsioni.
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
                      {prediction.responses && Object.entries(prediction.responses).map(([key, value]) => (
                        <p key={key} className="text-muted-foreground">
                          <strong>{key}:</strong> {value}
                        </p>
                      ))}
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

      {/* Dialog Crea Prediction */}
      <Dialog open={isCampaignDialogOpen} onOpenChange={setIsCampaignDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Crea Nuova Prediction</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
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
            <div className="grid grid-cols-2 gap-4">
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
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-4">Campi Personalizzati</h3>
              
              {customFields.length > 0 && (
                <div className="space-y-2 mb-4">
                  {customFields.map((field) => (
                    <div key={field.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{field.label}</p>
                        <p className="text-sm text-muted-foreground">
                          Tipo: {field.type} {field.required && "• Obbligatorio"}
                          {field.options && ` • Opzioni: ${field.options.join(", ")}`}
                        </p>
                      </div>
                      <Button size="icon" variant="ghost" onClick={() => handleRemoveField(field.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-3 p-4 bg-card/50 rounded-lg border">
                <div>
                  <Label>Etichetta Campo</Label>
                  <Input
                    placeholder="es. Chi vincerà il torneo?"
                    value={newField.label}
                    onChange={(e) => setNewField({...newField, label: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Tipo Campo</Label>
                    <Select value={newField.type} onValueChange={(value: any) => setNewField({...newField, type: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Testo Breve</SelectItem>
                        <SelectItem value="textarea">Testo Lungo</SelectItem>
                        <SelectItem value="select">Scelta Multipla</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newField.required}
                        onChange={(e) => setNewField({...newField, required: e.target.checked})}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Campo obbligatorio</span>
                    </label>
                  </div>
                </div>
                {newField.type === 'select' && (
                  <div>
                    <Label>Opzioni (separate da virgola)</Label>
                    <Input
                      placeholder="Opzione 1, Opzione 2, Opzione 3"
                      value={newField.options}
                      onChange={(e) => setNewField({...newField, options: e.target.value})}
                    />
                  </div>
                )}
                <Button onClick={handleAddField} variant="outline" className="w-full">
                  <Plus className="w-4 h-4 mr-2" /> Aggiungi Campo
                </Button>
              </div>
            </div>

            <div className="flex gap-2 justify-end border-t pt-4">
              <Button variant="outline" onClick={() => setIsCampaignDialogOpen(false)}>Annulla</Button>
              <Button onClick={handleCreateCampaign}>Crea Prediction</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog per visualizzare prediction */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
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
                <label className="text-sm font-medium text-muted-foreground">ID Twitch</label>
                <p>{selectedPrediction.twitchId}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Torneo</label>
                <p>{selectedPrediction.tournament}</p>
              </div>
              {selectedPrediction.responses && Object.entries(selectedPrediction.responses).map(([key, value]) => (
                <div key={key}>
                  <label className="text-sm font-medium text-muted-foreground">{key}</label>
                  <p className="text-lg font-semibold">{value}</p>
                </div>
              ))}
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
