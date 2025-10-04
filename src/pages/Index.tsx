import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-fortnite-italy.jpg";

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