import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Target, Users, TrendingUp, DollarSign } from "lucide-react";

interface PlayerCardProps {
  name: string;
  nickname: string;
  role: string;
  image?: string;
  team?: string;
  wins?: number;
  kd?: string;
  tournaments?: number;
  pr?: number;
  earnings?: string;
}

const PlayerCard = ({ 
  name, 
  nickname, 
  role, 
  image, 
  team,
  wins = 0,
  kd = "0.0",
  tournaments = 0,
  pr = 0,
  earnings = "$0"
}: PlayerCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 hover:glow-accent cursor-pointer overflow-hidden">
      <div className="aspect-square w-full overflow-hidden bg-muted">
        <img 
          src={image || "/placeholder.svg"} 
          alt={nickname}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
        />
      </div>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <Badge variant="secondary" className="bg-gradient-gaming text-white border-0">
            {role}
          </Badge>
          {team && (
            <span className="text-xs text-muted-foreground font-semibold">{team}</span>
          )}
        </div>
        <h3 className="text-2xl font-bold text-primary">{nickname}</h3>
        <p className="text-sm text-muted-foreground">{name}</p>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="flex flex-col items-center">
            <Trophy className="w-4 h-4 text-primary mb-1" />
            <span className="text-lg font-bold">{wins}</span>
            <span className="text-xs text-muted-foreground">Vittorie</span>
          </div>
          <div className="flex flex-col items-center">
            <Target className="w-4 h-4 text-accent mb-1" />
            <span className="text-lg font-bold">{kd}</span>
            <span className="text-xs text-muted-foreground">K/D</span>
          </div>
          <div className="flex flex-col items-center">
            <Users className="w-4 h-4 text-gaming-cyan mb-1" />
            <span className="text-lg font-bold">{tournaments}</span>
            <span className="text-xs text-muted-foreground">Tornei</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Power Rank</p>
              <p className="text-sm font-bold">{pr}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-accent" />
            <div>
              <p className="text-xs text-muted-foreground">Earnings</p>
              <p className="text-sm font-bold">{earnings}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerCard;