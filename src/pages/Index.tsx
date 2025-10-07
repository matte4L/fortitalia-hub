import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import heroImage from "@/assets/hero-fortnite-italy.jpg";
import NewsCard from "@/components/NewsCard";
import TournamentCard from "@/components/TournamentCard";
import { toast } from "sonner";

const Index = () => {
  const [newsData, setNewsData] = useState<any[]>([]);
  const [tournamentData, setTournamentData] = useState<any[]>([]);
  const [email, setEmail] = useState("");

  useEffect(() => {
    // Carica news
    const savedNews = localStorage.getItem("news_data");
    if (savedNews) {
      setNewsData(JSON.parse(savedNews).slice(0, 3));
    }

    // Carica tornei
    const savedTournaments = localStorage.getItem("tournaments_data");
    if (savedTournaments) {
      setTournamentData(JSON.parse(savedTournaments).slice(0, 4));
    }
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Salva email newsletter
      const newsletters = JSON.parse(localStorage.getItem("newsletter_subscribers") || "[]");
      if (!newsletters.includes(email)) {
        newsletters.push(email);
        localStorage.setItem("newsletter_subscribers", JSON.stringify(newsletters));
        toast.success("Iscrizione completata! Grazie!");
        setEmail("");
      } else {
        toast.error("Email già registrata!");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Fortnite Italia Hero" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/70 to-background/90"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-6xl md:text-8xl font-bold mb-6">
            <span className="text-white drop-shadow-[0_0_20px_rgba(0,255,157,0.5)]">
              FORTNITE
            </span>
            <br />
            <span className="text-primary drop-shadow-[0_0_30px_rgba(0,255,100,0.8)]">ITALIA</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto drop-shadow-lg">
            Il punto di riferimento per la community competitiva italiana di Fortnite. 
            Notizie, tornei e tutto quello che serve per dominare!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/predictions">
              <Button size="lg" className="glow-primary">
                Invia le Tue Predictions
              </Button>
            </Link>
            <Link to="/tournaments">
              <Button size="lg" variant="outline" className="glow-accent">
                Guarda i Tornei Live
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
              Ultime Notizie
            </h2>
            <p className="text-xl text-muted-foreground">
              Resta aggiornato con le ultime novità dal mondo competitivo
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {newsData.map((article) => (
              <NewsCard key={article.id} {...article} />
            ))}
          </div>

          <div className="text-center">
            <Link to="/news">
              <Button variant="outline" size="lg">
                Vedi Tutte le Notizie
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Tournaments Section */}
      <section className="py-20 px-4 bg-card/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
              Tornei in Corso
            </h2>
            <p className="text-xl text-muted-foreground">
              Partecipa ai tornei più competitivi d'Italia
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {tournamentData.map((tournament) => (
              <TournamentCard key={tournament.id} {...tournament} />
            ))}
          </div>

          <div className="text-center">
            <Link to="/tournaments">
              <Button size="lg" className="glow-accent">
                Vedi Tutti i Tornei
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
            Iscriviti alla Newsletter
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Ricevi aggiornamenti settimanali su tornei, news e strategie direttamente nella tua casella email
          </p>
          
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="La tua email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1"
            />
            <Button type="submit" size="lg" className="glow-primary">
              Iscriviti
            </Button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-gradient-gaming rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">🇮🇹</span>
            </div>
            <h3 className="text-2xl font-bold text-primary">Fortnite Italia</h3>
          </div>
          <p className="text-muted-foreground mb-6">
            La community competitiva italiana di Fortnite
          </p>
          <div className="flex justify-center space-x-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Discord</a>
            <a href="#" className="hover:text-primary transition-colors">Twitter</a>
            <a href="#" className="hover:text-primary transition-colors">Instagram</a>
            <a href="#" className="hover:text-primary transition-colors">Twitch</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;