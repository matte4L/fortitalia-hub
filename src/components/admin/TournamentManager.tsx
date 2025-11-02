import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Edit2, Trash2, Save, X } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Tournament, getTournamentStatus, TournamentStatus } from "@/lib/tournamentUtils";

const TournamentManager = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Tournament, "id">>({
    name: "",
    date: "",
    time: "",
    duration: 180,
    prizePool: "",
    registrationUrl: "",
    liveUrl: ""
  });

  useEffect(() => {
    loadTournaments();
  }, []);

  const loadTournaments = () => {
    const saved = localStorage.getItem("tournaments_data");
    if (saved) {
      setTournaments(JSON.parse(saved));
    } else {
      // Dati iniziali di esempio
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const initialTournaments: Tournament[] = [
        {
          id: "1",
          name: "Coppa Italia Fortnite 2024",
          date: tomorrow.toISOString().split('T')[0],
          time: "18:00",
          duration: 180,
          prizePool: "€10.000",
          registrationUrl: "#"
        },
        {
          id: "2",
          name: "Weekly Italian Cup #47",
          date: new Date().toISOString().split('T')[0],
          time: new Date().toTimeString().slice(0, 5),
          duration: 120,
          prizePool: "€500",
          liveUrl: "https://www.twitch.tv/fortnite"
        }
      ];
      setTournaments(initialTournaments);
      localStorage.setItem("tournaments_data", JSON.stringify(initialTournaments));
    }
  };

  const saveTournaments = (updated: Tournament[]) => {
    localStorage.setItem("tournaments_data", JSON.stringify(updated));
    setTournaments(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      const updated = tournaments.map(item => 
        item.id === editingId ? { ...formData, id: editingId } : item
      );
      saveTournaments(updated);
      toast.success("Torneo aggiornato!");
    } else {
      const newItem: Tournament = {
        ...formData,
        id: Date.now().toString(),
      };
      saveTournaments([newItem, ...tournaments]);
      toast.success("Torneo aggiunto!");
    }

    resetForm();
  };

  const handleEdit = (item: Tournament) => {
    setFormData({
      name: item.name,
      date: item.date,
      time: item.time,
      duration: item.duration,
      prizePool: item.prizePool,
      registrationUrl: item.registrationUrl || "",
      liveUrl: item.liveUrl || ""
    });
    setEditingId(item.id);
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Sei sicuro di voler eliminare questo torneo?")) {
      const updated = tournaments.filter(item => item.id !== id);
      saveTournaments(updated);
      toast.success("Torneo eliminato!");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      date: "",
      time: "",
      duration: 180,
      prizePool: "",
      registrationUrl: "",
      liveUrl: ""
    });
    setEditingId(null);
    setIsEditing(false);
  };

  const getStatusBadge = (status: TournamentStatus) => {
    const variants = {
      upcoming: "default",
      live: "destructive",
      completed: "secondary"
    } as const;
    
    const labels = {
      upcoming: "PROSSIMO",
      live: "LIVE",
      completed: "COMPLETATO"
    };

    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Form */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {isEditing ? "Modifica Torneo" : "Aggiungi Nuovo Torneo"}
            </CardTitle>
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Nuovo
              </Button>
            )}
          </div>
        </CardHeader>
        {isEditing && (
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Nome Torneo</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Nome del torneo"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Data Inizio</label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Ora Inizio</label>
                  <Input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Durata (minuti)</label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value) || 180})}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Prize Pool</label>
                <Input
                  value={formData.prizePool}
                  onChange={(e) => setFormData({...formData, prizePool: e.target.value})}
                  placeholder="es. €10.000"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">URL Registrazione (opzionale)</label>
                <Input
                  value={formData.registrationUrl}
                  onChange={(e) => setFormData({...formData, registrationUrl: e.target.value})}
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">URL Live Stream (opzionale)</label>
                <Input
                  value={formData.liveUrl}
                  onChange={(e) => setFormData({...formData, liveUrl: e.target.value})}
                  placeholder="https://www.twitch.tv/..."
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="gap-2">
                  <Save className="w-4 h-4" />
                  {editingId ? "Salva Modifiche" : "Aggiungi"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm} className="gap-2">
                  <X className="w-4 h-4" />
                  Annulla
                </Button>
              </div>
            </form>
          </CardContent>
        )}
      </Card>

      {/* Lista Tornei */}
      <Card>
        <CardHeader>
          <CardTitle>Tornei ({tournaments.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tournaments.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nessun torneo ancora. Aggiungine uno!
              </p>
            ) : (
              tournaments.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-card/50 rounded-lg border border-border hover:border-primary/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      {getStatusBadge(getTournamentStatus(item))}
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>📅 {new Date(item.date).toLocaleDateString('it-IT')} • ⏰ {item.time}</p>
                      <p>⏱️ Durata: {item.duration} min • 💰 {item.prizePool}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => handleEdit(item)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TournamentManager;
