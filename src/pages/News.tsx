import { useEffect, useState } from "react";
import Header from "@/components/Header";
import NewsCard from "@/components/NewsCard";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ScrollReveal";
import { supabase } from "@/integrations/supabase/client";

const News = () => {
  const [newsData, setNewsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setNewsData(data || []);
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
                Ultime Notizie
              </h1>
              <p className="text-xl text-muted-foreground">
                Resta aggiornato con le ultime novità dal mondo competitivo
              </p>
            </div>
          </ScrollReveal>
          
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Caricamento...</p>
            </div>
          ) : newsData.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nessuna notizia disponibile.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newsData.map((article, index) => (
                <ScrollReveal key={article.id} delay={index * 50} direction="scale">
                  <NewsCard {...article} />
                </ScrollReveal>
              ))}
            </div>
          )}
          
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