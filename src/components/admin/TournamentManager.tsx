import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Edit2, Trash2, Save, X } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";

interface Tournament {
  id: string;
  name: string;
  game: string;
  date: string;
  time: string;
  prize: string;
  status: 'upcoming' | 'live' | 'completed';
  registration_url?: string;
  live_url?: string;
}

const TournamentManager = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Tournament, "id">>({
    name: "",
    game: "Fortnite",
    date: "",
    time: "",
    prize: "",
    status: "upcoming",
    registration_url: "",
    live_url: ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTournaments();
  }, []);

  const loadTournaments = async () => {
    try {
      const { data, error } = await supabase
        .from('tournaments')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      setTournaments(data || []);
    } catch (error: any) {
      console.error('Error loading tournaments:', error);
      toast.error("Errore nel caricamento dei tornei");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        const { error } = await supabase
          .from('tournaments')
          .update(formData)
          .eq('id', editingId);

        if (error) throw error;
        toast.success("Torneo aggiornato!");
      } else {
        const { error } = await supabase
          .from('tournaments')
          .insert([formData]);

        if (error) throw error;
        toast.success("Torneo aggiunto!");
      }

      await loadTournaments();
      resetForm();
    } catch (error: any) {
      console.error('Error saving tournament:', error);
      toast.error(error.message || "Errore nel salvataggio");
    }
  };

  const handleEdit = (item: Tournament) => {
    setFormData({
      name: item.name,
      game: item.game,
      date: item.date,
      time: item.time,
      prize: item.prize,
      status: item.status,
      registration_url: item.registration_url || "",
      live_url: item.live_url || ""
    });
    setEditingId(item.id);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Sei sicuro di voler eliminare questo torneo?")) {
      try {
        const { error } = await supabase
          .from('tournaments')
          .delete()
          .eq('id', id);

        if (error) throw error;
        
        await loadTournaments();
        toast.success("Torneo eliminato!");
      } catch (error: any) {
        console.error('Error deleting tournament:', error);
        toast.error("Errore nell'eliminazione");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      game: "Fortnite",
      date: "",
      time: "",
      prize: "",
      status: "upcoming",
      registration_url: "",
      live_url: ""
    });
    setEditingId(null);
    setIsEditing(false);
  };

  const getStatusBadge = (status: string) => {
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

    return <Badge variant={variants[status as keyof typeof variants]}>{labels[status as keyof typeof labels]}</Badge>;
  };

  if (loading) {
    return <div className="text-center py-8">Caricamento...</div>;
  }

  return (
    <div className="space-y-6">
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
                  <label className="text-sm font-medium mb-2 block">Data</label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Ora</label>
                  <Input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Status</label>
                  <Select value={formData.status} onValueChange={(value: any) => setFormData({...formData, status: value})}>
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
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Prize Pool</label>
                <Input
                  value={formData.prize}
                  onChange={(e) => setFormData({...formData, prize: e.target.value})}
                  placeholder="es. €10.000"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">URL Registrazione (opzionale)</label>
                <Input
                  value={formData.registration_url}
                  onChange={(e) => setFormData({...formData, registration_url: e.target.value})}
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">URL Live Stream (opzionale)</label>
                <Input
                  value={formData.live_url}
                  onChange={(e) => setFormData({...formData, live_url: e.target.value})}
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
                      <p>📅 {new Date(item.date).toLocaleDateString('it-IT')} • ⏰ {item.time}</p>
                      <p>💰 {item.prize}</p>
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
