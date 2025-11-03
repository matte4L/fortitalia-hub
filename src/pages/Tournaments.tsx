import { useEffect, useState } from "react";
import Header from "@/components/Header";
import TournamentCard from "@/components/TournamentCard";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ScrollReveal";
import { supabase } from "@/integrations/supabase/client";

const Tournaments = () => {
  const [tournamentData, setTournamentData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data, error } = await supabase
          .from('tournaments')
          .select('*')
          .order('date', { ascending: false });

        if (error) throw error;
        setTournamentData(data || []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h1 className="text-5xl md:text-6xl font-bold mb-4 text-primary">
                Tornei e Eventi
              </h1>
              <p className="text-xl text-muted-foreground">
                Partecipa ai tornei più competitivi d'Italia
              </p>
            </div>
          </ScrollReveal>
          
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Caricamento...</p>
            </div>
          ) : tournamentData.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nessun torneo disponibile.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
              {tournamentData.map((tournament, index) => (
                <ScrollReveal key={tournament.id} delay={index * 50} direction="scale">
                  <TournamentCard {...tournament} />
                </ScrollReveal>
              ))}
            </div>
          )}
          
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