import Header from "@/components/Header";
import NewsCard from "@/components/NewsCard";
import TournamentCard from "@/components/TournamentCard";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-fortnite-italy.jpg";

// Sample news data - easily editable
const newsData = [
  {
    title: "Nuova Stagione Fortnite: Tutto quello che devi sapere",
    excerpt: "La nuova stagione di Fortnite porta tante novità per i giocatori competitivi italiani. Scopri le nuove meccaniche e strategie...",
    date: "2 giorni fa",
    category: "Aggiornamenti",
    image: "/placeholder.svg"
  },
  {
    title: "Team italiano vince il campionato europeo",
    excerpt: "Un incredibile successo per l'Italia nel panorama competitivo di Fortnite. Il team 'Gladiatori' conquista il primo posto...",
    date: "1 settimana fa",
    category: "Competitivo",
    image: "/placeholder.svg"
  },
  {
    title: "Guida alle migliori strategie per la Season 5",
    excerpt: "I pro player italiani condividono i loro segreti per dominare nella nuova stagione. Tattiche avanzate e consigli esclusivi...",
    date: "2 settimane fa",
    category: "Guide",
    image: "/placeholder.svg"
  }
];

// Sample tournament data - easily editable
const tournamentData = [
  {
    name: "Coppa Italia Fortnite 2024",
    date: "15 Gen 2024",
    time: "18:00 CET",
    prizePool: "€10.000",
    participants: "256/256",
    status: "upcoming" as const,
    registrationUrl: "#"
  },
  {
    name: "Weekly Italian Cup #47",
    date: "Oggi",
    time: "20:00 CET",
    prizePool: "€500",
    participants: "128/128",
    status: "live" as const
  },
  {
    name: "Pro Scrim Tournament",
    date: "20 Gen 2024",
    time: "19:00 CET", 
    prizePool: "€2.000",
    participants: "64/64",
    status: "upcoming" as const,
    registrationUrl: "#"
  },
  {
    name: "Italian Championship Finals",
    date: "8 Gen 2024",
    time: "17:00 CET",
    prizePool: "€25.000",
    participants: "32/32",
    status: "completed" as const
  }
];

const Index = () => {
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
          <div className="absolute inset-0 bg-background/60"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-6xl md:text-8xl font-bold mb-6">
            <span className="gradient-gaming bg-clip-text text-transparent">
              FORTNITE
            </span>
            <br />
            <span className="text-primary">ITALIA</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Il punto di riferimento per la community competitiva italiana di Fortnite. 
            Notizie, tornei e tutto quello che serve per dominare!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="glow-primary">
              Unisciti alla Community
            </Button>
            <Button size="lg" variant="outline" className="glow-accent">
              Guarda i Tornei Live
            </Button>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section id="news" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
              Ultime Notizie
            </h2>
            <p className="text-xl text-muted-foreground">
              Resta aggiornato con le ultime novità dal mondo competitivo
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsData.map((article, index) => (
              <NewsCard key={index} {...article} />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Vedi Tutte le Notizie
            </Button>
          </div>
        </div>
      </section>

      {/* Tournaments Section */}
      <section id="tournaments" className="py-20 px-4 bg-card/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
              Tornei e Eventi
            </h2>
            <p className="text-xl text-muted-foreground">
              Partecipa ai tornei più competitivi d'Italia
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
            {tournamentData.map((tournament, index) => (
              <TournamentCard key={index} {...tournament} />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button size="lg" className="glow-accent">
              Vedi Calendario Completo
            </Button>
          </div>
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