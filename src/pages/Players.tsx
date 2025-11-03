import { useState, useEffect } from "react";
import Header from "@/components/Header";
import PlayerCard from "@/components/PlayerCard";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ScrollReveal";
import { supabase } from "@/integrations/supabase/client";

const Players = () => {
  const [playersData, setPlayersData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlayers();
  }, []);

  const loadPlayers = async () => {
    try {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .order('pr', { ascending: false });

      if (error) throw error;
      setPlayersData(data || []);
    } catch (error) {
      console.error('Error loading players:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-6xl font-bold mb-4 text-primary">
                Top Player Italiani
              </h1>
              <p className="text-xl text-muted-foreground">
                I migliori giocatori competitivi della scena italiana
              </p>
            </div>
          </ScrollReveal>
          
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Caricamento players...</p>
            </div>
          ) : playersData.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nessun player disponibile al momento.</p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {playersData.map((player, index) => (
                  <ScrollReveal key={player.id} delay={index * 50} direction="scale">
                    <PlayerCard {...player} />
                  </ScrollReveal>
                ))}
              </div>
              
              <div className="text-center mt-12">
                <Button variant="outline" size="lg" className="glow-primary">
                  Vedi Classifica Completa
                </Button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Players;