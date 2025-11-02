import { useEffect, useState } from "react";
import Header from "@/components/Header";
import TournamentCard from "@/components/TournamentCard";
import { Button } from "@/components/ui/button";
import { Tournament } from "@/lib/tournamentUtils";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const Tournaments = () => {
  const [tournamentData, setTournamentData] = useState<Tournament[]>([]);
  const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation();
  const { ref: gridRef, isVisible: gridVisible } = useScrollAnimation({ threshold: 0.05 });

  useEffect(() => {
    const loadData = () => {
      const savedTournaments = localStorage.getItem("tournaments_data");
      
      if (savedTournaments) {
        setTournamentData(JSON.parse(savedTournaments));
      } else {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        
        const initialTournaments: Tournament[] = [
          {
            id: "1",
            name: "Coppa Italia Fortnite 2024",
            date: tomorrow.toISOString().split('T')[0],
            time: "18:00",
            duration: 180,
            prizePool: "€10.000",
            registrationUrl: "#"
          },
          {
            id: "2",
            name: "Weekly Italian Cup #47",
            date: new Date().toISOString().split('T')[0],
            time: new Date().toTimeString().slice(0, 5),
            duration: 120,
            prizePool: "€500",
            liveUrl: "https://www.twitch.tv/fortnite"
          },
          {
            id: "3",
            name: "Torneo Solo Regional",
            date: nextWeek.toISOString().split('T')[0],
            time: "19:00",
            duration: 150,
            prizePool: "€2.000",
            registrationUrl: "#"
          },
          {
            id: "4",
            name: "Duo Championship Italy",
            date: nextWeek.toISOString().split('T')[0],
            time: "17:00",
            duration: 180,
            prizePool: "€5.000",
            registrationUrl: "#"
          }
        ];
        setTournamentData(initialTournaments);
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
              Tornei e Eventi
            </h1>
            <p className="text-xl text-muted-foreground">
              Partecipa ai tornei più competitivi d'Italia
            </p>
          </div>
          
          <div 
            ref={gridRef}
            className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6"
          >
            {tournamentData.map((tournament, index) => (
              <div
                key={index}
                className={`scroll-hidden-scale stagger-${(index % 6) + 1} ${
                  gridVisible ? 'scroll-visible-scale' : ''
                }`}
              >
                <TournamentCard {...tournament} />
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button size="lg" className="glow-accent">
              Vedi Calendario Completo
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Tournaments;