import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface TournamentCardProps {
  name: string;
  date: string;
  time: string;
  prizePool: string;
  participants: string;
  status: 'upcoming' | 'live' | 'completed';
  registrationUrl?: string;
  liveUrl?: string;
}

const TournamentCard = ({ 
  name, 
  date, 
  time, 
  prizePool, 
  participants, 
  status, 
  registrationUrl,
  liveUrl 
}: TournamentCardProps) => {
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
    <Card className="hover:shadow-lg transition-all duration-300 hover:glow-accent">
      <CardHeader>
        <div className="flex justify-between items-start">
          <Badge className={getStatusColor(status)}>
            {status === 'live' ? 'LIVE' : status === 'upcoming' ? 'PROSSIMO' : 'COMPLETATO'}
          </Badge>
          <div className="text-right text-sm text-muted-foreground">
            <div>{date}</div>
            <div>{time}</div>
          </div>
        </div>
        <CardTitle className="text-xl text-primary">{name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Premio:</span>
            <div className="font-semibold text-accent">{prizePool}</div>
          </div>
          <div>
            <span className="text-muted-foreground">Partecipanti:</span>
            <div className="font-semibold">{participants}</div>
          </div>
        </div>
        
        {status === 'upcoming' && registrationUrl && (
          <Button className="w-full glow-primary" asChild>
            <a href={registrationUrl} target="_blank" rel="noopener noreferrer">
              Registrati Ora
            </a>
          </Button>
        )}
        
        {status === 'live' && (
          <Button variant="destructive" className="w-full glow-accent" asChild>
            <a href={liveUrl || 'https://www.twitch.tv/fortnite'} target="_blank" rel="noopener noreferrer">
              Guarda Live
            </a>
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default TournamentCard;