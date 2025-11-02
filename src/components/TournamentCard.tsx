import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tournament, getTournamentStatus, formatTournamentDate } from "@/lib/tournamentUtils";

interface TournamentCardProps extends Tournament {}

const TournamentCard = (tournament: TournamentCardProps) => {
  const status = getTournamentStatus(tournament);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live':
        return 'bg-destructive';
      case 'upcoming':
        return 'bg-primary';
      case 'completed':
        return 'bg-muted';
      default:
        return 'bg-secondary';
    }
  };

  return (
    <Card className="hover-lift animate-scale-in">
      <CardHeader>
        <div className="flex justify-between items-start">
          <Badge className={getStatusColor(status)}>
            {status === 'live' ? 'LIVE' : status === 'upcoming' ? 'PROSSIMO' : 'COMPLETATO'}
          </Badge>
          <div className="text-right text-sm text-muted-foreground">
            <div>{formatTournamentDate(tournament.date)}</div>
            <div>{tournament.time}</div>
          </div>
        </div>
        <CardTitle className="text-xl text-primary">{tournament.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm">
          <span className="text-muted-foreground">Premio:</span>
          <div className="font-semibold text-accent text-xl">{tournament.prizePool}</div>
        </div>
        
        {status === 'upcoming' && tournament.registrationUrl && (
          <Button className="w-full glow-primary" asChild>
            <a href={tournament.registrationUrl} target="_blank" rel="noopener noreferrer">
              Registrati Ora
            </a>
          </Button>
        )}
        
        {status === 'live' && (
          <Button variant="destructive" className="w-full glow-accent" asChild>
            <a href={tournament.liveUrl || 'https://www.twitch.tv/fortnite'} target="_blank" rel="noopener noreferrer">
              Guarda Live
            </a>
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default TournamentCard;