import { useEffect, useState } from "react";
import Header from "@/components/Header";
import TournamentCard from "@/components/TournamentCard";
import { Button } from "@/components/ui/button";

const Tournaments = () => {
  const [tournamentData, setTournamentData] = useState<any[]>([]);

  useEffect(() => {
    const loadData = () => {
      const savedTournaments = localStorage.getItem("tournaments_data");
      
      if (savedTournaments) {
        setTournamentData(JSON.parse(savedTournaments));
      } else {
        const initialTournaments = [
          {
            id: "1",
            name: "Coppa Italia Fortnite 2024",
            date: "15 Gen 2024",
            time: "18:00 CET",
            prizePool: "€10.000",
            participants: "256/256",
            status: "upcoming",
            registrationUrl: "#"
          },
          {
            id: "2",
            name: "Weekly Italian Cup #47",
            date: "Oggi",
            time: "20:00 CET",
            prizePool: "€500",
            participants: "128/128",
            status: "live",
            liveUrl: "https://www.twitch.tv/fortnite"
          },
          {
            id: "3",
            name: "Torneo Solo Regional",
            date: "20 Gen 2024",
            time: "19:00 CET",
            prizePool: "€2.000",
            participants: "64/128",
            status: "upcoming",
            registrationUrl: "#"
          },
          {
            id: "4",
            name: "Duo Championship Italy",
            date: "25 Gen 2024",
            time: "17:00 CET",
            prizePool: "€5.000",
            participants: "45/64",
            status: "upcoming",
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
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-primary">
              Tornei e Eventi
            </h1>
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
      </main>
    </div>
  );
};

export default Tournaments;