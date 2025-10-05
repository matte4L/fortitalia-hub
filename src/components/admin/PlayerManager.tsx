import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Edit2, Trash2, Save, X } from "lucide-react";
import { toast } from "sonner";

interface Player {
  id: string;
  name: string;
  nickname: string;
  role: string;
  team: string;
  image: string;
  wins: number;
  kd: string;
  tournaments: number;
  pr: number;
  earnings: string;
}

const PlayerManager = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Player, "id">>({
    name: "",
    nickname: "",
    role: "",
    team: "",
    image: "/placeholder.svg",
    wins: 0,
    kd: "0.0",
    tournaments: 0,
    pr: 0,
    earnings: "$0"
  });

  useEffect(() => {
    loadPlayers();
  }, []);

  const loadPlayers = () => {
    const saved = localStorage.getItem("players_data");
    if (saved) {
      setPlayers(JSON.parse(saved));
    } else {
      const initialPlayers: Player[] = [
        {
          id: "1",
          name: "Marco Rossi",
          nickname: "MRossi_FN",
          role: "IGL",
          team: "Team Italia",
          image: "/placeholder.svg",
          wins: 45,
          kd: "3.2",
          tournaments: 28,
          pr: 1250,
          earnings: "$15,000"
        }
      ];
      setPlayers(initialPlayers);
      localStorage.setItem("players_data", JSON.stringify(initialPlayers));
    }
  };

  const savePlayers = (updated: Player[]) => {
    localStorage.setItem("players_data", JSON.stringify(updated));
    setPlayers(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      const updated = players.map(item => 
        item.id === editingId ? { ...formData, id: editingId } : item
      );
      savePlayers(updated);
      toast.success("Player aggiornato!");
    } else {
      const newItem: Player = {
        ...formData,
        id: Date.now().toString(),
      };
      savePlayers([newItem, ...players]);
      toast.success("Player aggiunto!");
    }

    resetForm();
  };

  const handleEdit = (item: Player) => {
    setFormData({
      name: item.name,
      nickname: item.nickname,
      role: item.role,
      team: item.team,
      image: item.image,
      wins: item.wins,
      kd: item.kd,
      tournaments: item.tournaments,
      pr: item.pr,
      earnings: item.earnings
    });
    setEditingId(item.id);
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Sei sicuro di voler eliminare questo player?")) {
      const updated = players.filter(item => item.id !== id);
      savePlayers(updated);
      toast.success("Player eliminato!");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      nickname: "",
      role: "",
      team: "",
      image: "/placeholder.svg",
      wins: 0,
      kd: "0.0",
      tournaments: 0,
      pr: 0,
      earnings: "$0"
    });
    setEditingId(null);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Form */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {isEditing ? "Modifica Player" : "Aggiungi Nuovo Player"}
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Nome Completo</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Mario Rossi"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Nickname</label>
                  <Input
                    value={formData.nickname}
                    onChange={(e) => setFormData({...formData, nickname: e.target.value})}
                    placeholder="MarioRossi_FN"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Ruolo</label>
                  <Input
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    placeholder="IGL, Fragger, Support"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Team</label>
                  <Input
                    value={formData.team}
                    onChange={(e) => setFormData({...formData, team: e.target.value})}
                    placeholder="Nome Team"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">URL Immagine</label>
                <Input
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  placeholder="/placeholder.svg"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Vittorie</label>
                  <Input
                    type="number"
                    value={formData.wins}
                    onChange={(e) => setFormData({...formData, wins: parseInt(e.target.value) || 0})}
                    placeholder="0"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">K/D</label>
                  <Input
                    value={formData.kd}
                    onChange={(e) => setFormData({...formData, kd: e.target.value})}
                    placeholder="0.0"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Tornei</label>
                  <Input
                    type="number"
                    value={formData.tournaments}
                    onChange={(e) => setFormData({...formData, tournaments: parseInt(e.target.value) || 0})}
                    placeholder="0"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Power Ranking (PR)</label>
                  <Input
                    type="number"
                    value={formData.pr}
                    onChange={(e) => setFormData({...formData, pr: parseInt(e.target.value) || 0})}
                    placeholder="0"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Earnings</label>
                  <Input
                    value={formData.earnings}
                    onChange={(e) => setFormData({...formData, earnings: e.target.value})}
                    placeholder="$0"
                    required
                  />
                </div>
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

      {/* Lista Players */}
      <Card>
        <CardHeader>
          <CardTitle>Players ({players.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {players.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nessun player ancora. Aggiungine uno!
              </p>
            ) : (
              players.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-card/50 rounded-lg border border-border hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <img 
                      src={item.image} 
                      alt={item.nickname}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-lg">{item.nickname}</h3>
                      <p className="text-sm text-muted-foreground">{item.name}</p>
                      <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                        <span>{item.team}</span>
                        <span>•</span>
                        <span>{item.role}</span>
                        <span>•</span>
                        <span>PR: {item.pr}</span>
                        <span>•</span>
                        <span>{item.earnings}</span>
                      </div>
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

export default PlayerManager;
