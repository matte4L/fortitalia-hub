import { useEffect, useState } from "react";
import Header from "@/components/Header";
import NewsCard from "@/components/NewsCard";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const News = () => {
  const [newsData, setNewsData] = useState<any[]>([]);
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { ref: gridRef, isVisible: gridVisible } = useScrollAnimation({ threshold: 0.05 });

  useEffect(() => {
    const loadData = () => {
      const savedNews = localStorage.getItem("news_data");
      
      if (savedNews) {
        setNewsData(JSON.parse(savedNews));
      } else {
        const initialNews = [
          {
            id: "1",
            title: "Nuova Stagione Fortnite: Tutto quello che devi sapere",
            excerpt: "La nuova stagione di Fortnite porta tante novità per i giocatori competitivi italiani. Scopri le nuove meccaniche e strategie...",
            date: "2 giorni fa",
            category: "Aggiornamenti",
            image: "/placeholder.svg"
          },
          {
            id: "2",
            title: "Team italiano vince il campionato europeo",
            excerpt: "Un incredibile successo per l'Italia nel panorama competitivo di Fortnite. Il team 'Gladiatori' conquista il primo posto...",
            date: "1 settimana fa",
            category: "Competitivo",
            image: "/placeholder.svg"
          },
          {
            id: "3",
            title: "Guida alle migliori strategie per la nuova mappa",
            excerpt: "Esplora i punti strategici della nuova mappa e domina i tuoi avversari con queste tecniche avanzate...",
            date: "3 giorni fa",
            category: "Guide",
            image: "/placeholder.svg"
          },
          {
            id: "4",
            title: "Annunciato nuovo torneo nazionale",
            excerpt: "In arrivo un grande torneo con prize pool da record. Scopri come iscriverti e partecipare...",
            date: "5 giorni fa",
            category: "Tornei",
            image: "/placeholder.svg"
          }
        ];
        setNewsData(initialNews);
      }
    };

    loadData();
    const handleFocus = () => loadData();
    window.addEventListener('focus', handleFocus);
    
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto">
          <div 
            ref={headerRef}
            className={`text-center mb-12 transition-all duration-700 ${
              headerVisible ? 'scroll-visible' : 'scroll-hidden'
            }`}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-primary">
              Ultime Notizie
            </h1>
            <p className="text-xl text-muted-foreground">
              Resta aggiornato con le ultime novità dal mondo competitivo
            </p>
          </div>
          
          <div 
            ref={gridRef}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {newsData.map((article, index) => (
              <div
                key={index}
                className={`scroll-hidden-scale stagger-${(index % 6) + 1} ${
                  gridVisible ? 'scroll-visible-scale' : ''
                }`}
              >
                <NewsCard {...article} />
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Carica Altre Notizie
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default News;