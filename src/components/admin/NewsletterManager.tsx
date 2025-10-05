import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Trash2, Download } from "lucide-react";
import { toast } from "sonner";

const NewsletterManager = () => {
  const [subscribers, setSubscribers] = useState<string[]>([]);

  useEffect(() => {
    loadSubscribers();
  }, []);

  const loadSubscribers = () => {
    const saved = localStorage.getItem("newsletter_subscribers");
    if (saved) {
      setSubscribers(JSON.parse(saved));
    }
  };

  const handleDelete = (email: string) => {
    if (confirm(`Rimuovere ${email} dalla newsletter?`)) {
      const updated = subscribers.filter(sub => sub !== email);
      localStorage.setItem("newsletter_subscribers", JSON.stringify(updated));
      setSubscribers(updated);
      toast.success("Iscritto rimosso!");
    }
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," + subscribers.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "newsletter_subscribers.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Lista esportata!");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Iscritti alla Newsletter ({subscribers.length})
            </CardTitle>
            {subscribers.length > 0 && (
              <Button onClick={handleExport} variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Esporta CSV
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {subscribers.length === 0 ? (
            <div className="text-center py-12">
              <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Nessun iscritto ancora. Gli utenti possono iscriversi dalla homepage.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {subscribers.map((email, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-card/50 rounded-lg border border-border hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{email}</span>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDelete(email)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
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
            📧 <strong>Raccolta Email:</strong> Gli utenti si iscrivono tramite il form nella homepage.
            Le email vengono salvate in localStorage.
          </p>
          <p>
            💾 <strong>Gestione:</strong> Puoi visualizzare tutti gli iscritti, rimuoverli singolarmente
            o esportare l'intera lista in formato CSV.
          </p>
          <p>
            📤 <strong>Invio Email:</strong> Per inviare newsletter, esporta la lista e usala con un 
            servizio di email marketing (Mailchimp, SendGrid, etc.).
          </p>
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mt-4">
            <p className="text-primary font-medium">
              💡 Consiglio: Per automazioni avanzate, considera l'integrazione con servizi come 
              Mailchimp API o Zapier per inviare email automatiche.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewsletterManager;
