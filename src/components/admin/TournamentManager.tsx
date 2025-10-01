import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit2, Trash2, Save, X } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface Tournament {
  id: string;
  name: string;
  date: string;
  time: string;
  prizePool: string;
  participants: string;
  status: "upcoming" | "live" | "completed";
  registrationUrl?: string;
  liveUrl?: string;
}

const TournamentManager = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Tournament, "id">>({
    name: "",
    date: "",
    time: "",
    prizePool: "",
    participants: "",
    status: "upcoming",
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
      const initialTournaments: Tournament[] = [
        {
          id: "1",
          name: "Coppa Italia Fortnite 2024",
          date: "15 Gen 2024",
          time: "18:00 CET",
          prizePool: "€10.000",
          participants: "256/256",
          status: "upcoming",
          registrationUrl: "#"
        },
        {
          id: "2",
          name: "Weekly Italian Cup #47",
          date: "Oggi",
          time: "20:00 CET",
          prizePool: "€500",
          participants: "128/128",
          status: "live",
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
      prizePool: item.prizePool,
      participants: item.participants,
      status: item.status,
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
      prizePool: "",
      participants: "",
      status: "upcoming",
      registrationUrl: "",
      liveUrl: ""
    });
    setEditingId(null);
    setIsEditing(false);
  };

  const getStatusBadge = (status: Tournament["status"]) => {
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Data</label>
                  <Input
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    placeholder="es. 15 Gen 2024"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Ora</label>
                  <Input
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    placeholder="es. 18:00 CET"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                  <label className="text-sm font-medium mb-2 block">Partecipanti</label>
                  <Input
                    value={formData.participants}
                    onChange={(e) => setFormData({...formData, participants: e.target.value})}
                    placeholder="es. 256/256"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Stato</label>
                <Select
                  value={formData.status}
                  onValueChange={(value: Tournament["status"]) => 
                    setFormData({...formData, status: value})
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upcoming">Prossimo</SelectItem>
                    <SelectItem value="live">Live</SelectItem>
                    <SelectItem value="completed">Completato</SelectItem>
                  </SelectContent>
                </Select>
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
                      {getStatusBadge(item.status)}
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>📅 {item.date} • ⏰ {item.time}</p>
                      <p>💰 {item.prizePool} • 👥 {item.participants}</p>
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
