import { useState } from "react";
import Header from "@/components/Header";
import PlayerCard from "@/components/PlayerCard";
import { Button } from "@/components/ui/button";

const Players = () => {
  const [playersData] = useState<any[]>([
    {
      name: "Marco Rossi",
      nickname: "ITA_Phantom",
      role: "Pro Player",
      team: "Team Italia",
      image: "/placeholder.svg",
      wins: 47,
      kd: "3.8",
      tournaments: 125
    },
    {
      name: "Luca Bianchi",
      nickname: "LegendBianchi",
      role: "Competitivo",
      team: "Gladiatori",
      image: "/placeholder.svg",
      wins: 38,
      kd: "3.2",
      tournaments: 98
    },
    {
      name: "Sofia Romano",
      nickname: "QueenRomano",
      role: "Pro Player",
      team: "Team Italia",
      image: "/placeholder.svg",
      wins: 52,
      kd: "4.1",
      tournaments: 142
    },
    {
      name: "Giovanni Conti",
      nickname: "GioKing",
      role: "Content Creator",
      team: "Indipendente",
      image: "/placeholder.svg",
      wins: 29,
      kd: "2.9",
      tournaments: 76
    },
    {
      name: "Alessandro Verdi",
      nickname: "AlexPro",
      role: "Pro Player",
      team: "Gladiatori",
      image: "/placeholder.svg",
      wins: 41,
      kd: "3.5",
      tournaments: 110
    },
    {
      name: "Francesca Neri",
      nickname: "FranQueen",
      role: "Competitivo",
      team: "Team Italia",
      image: "/placeholder.svg",
      wins: 35,
      kd: "3.1",
      tournaments: 89
    }
  ]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-primary">
              Top Player Italiani
            </h1>
            <p className="text-xl text-muted-foreground">
              I migliori giocatori competitivi della scena italiana
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {playersData.map((player, index) => (
              <PlayerCard key={index} {...player} />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="glow-primary">
              Vedi Classifica Completa
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Players;