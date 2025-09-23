import { Button } from "@/components/ui/button";

const Header = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-card/80 backdrop-blur-sm border-b border-border">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-gaming rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">🇮🇹</span>
          </div>
          <h1 className="text-xl font-bold text-primary">Fortnite Italia</h1>
        </div>
        
        <div className="hidden md:flex items-center space-x-6">
          <button 
            onClick={() => scrollToSection('home')}
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            Home
          </button>
          <button 
            onClick={() => scrollToSection('news')}
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            Notizie
          </button>
          <button 
            onClick={() => scrollToSection('tournaments')}
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            Tornei
          </button>
          <Button variant="outline" className="glow-primary">
            Unisciti alla Community
          </Button>
        </div>
      </nav>
    </header>
  );
};

export default Header;