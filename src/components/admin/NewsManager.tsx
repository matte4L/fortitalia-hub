import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit2, Trash2, Save, X } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
}

const NewsManager = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<NewsItem, "id">>({
    title: "",
    excerpt: "",
    date: "",
    category: "",
    image: "/placeholder.svg"
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNews(data || []);
    } catch (error: any) {
      console.error('Error loading news:', error);
      toast.error("Errore nel caricamento delle notizie");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        const { error } = await supabase
          .from('news')
          .update(formData)
          .eq('id', editingId);

        if (error) throw error;
        toast.success("Notizia aggiornata!");
      } else {
        const { error } = await supabase
          .from('news')
          .insert([formData]);

        if (error) throw error;
        toast.success("Notizia aggiunta!");
      }

      await loadNews();
      resetForm();
    } catch (error: any) {
      console.error('Error saving news:', error);
      toast.error(error.message || "Errore nel salvataggio");
    }
  };

  const handleEdit = (item: NewsItem) => {
    setFormData({
      title: item.title,
      excerpt: item.excerpt,
      date: item.date,
      category: item.category,
      image: item.image
    });
    setEditingId(item.id);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Sei sicuro di voler eliminare questa notizia?")) {
      try {
        const { error } = await supabase
          .from('news')
          .delete()
          .eq('id', id);

        if (error) throw error;
        
        await loadNews();
        toast.success("Notizia eliminata!");
      } catch (error: any) {
        console.error('Error deleting news:', error);
        toast.error("Errore nell'eliminazione");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      excerpt: "",
      date: "",
      category: "",
      image: "/placeholder.svg"
    });
    setEditingId(null);
    setIsEditing(false);
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
              {isEditing ? "Modifica Notizia" : "Aggiungi Nuova Notizia"}
            </CardTitle>
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Nuova
              </Button>
            )}
          </div>
        </CardHeader>
        {isEditing && (
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Titolo</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Titolo della notizia"
                  required
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Estratto</label>
                <Textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                  placeholder="Breve descrizione..."
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Data</label>
                  <Input
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    placeholder="es. 2 giorni fa"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Categoria</label>
                  <Input
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    placeholder="es. Aggiornamenti"
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
          <CardTitle>Notizie Pubblicate ({news.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {news.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nessuna notizia ancora. Aggiungine una!
              </p>
            ) : (
              news.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-card/50 rounded-lg border border-border hover:border-primary/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{item.title}</h3>
                      <Badge variant="outline">{item.category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {item.excerpt}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{item.date}</p>
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

export default NewsManager;
