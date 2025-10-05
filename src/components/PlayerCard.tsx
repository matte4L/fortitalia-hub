import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, DollarSign } from "lucide-react";

interface PlayerCardProps {
  name: string;
  nickname: string;
  role: string;
  image?: string;
  team?: string;
  pr?: number;
  earnings?: string;
}

const PlayerCard = ({ 
  name, 
  nickname, 
  role, 
  image, 
  team,
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
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg">
            <TrendingUp className="w-5 h-5 text-primary mb-2" />
            <span className="text-2xl font-bold text-primary">{pr}</span>
            <span className="text-xs text-muted-foreground font-medium">PR</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-muted/50 rounded-lg">
            <DollarSign className="w-5 h-5 text-accent mb-2" />
            <span className="text-2xl font-bold text-accent">{earnings}</span>
            <span className="text-xs text-muted-foreground font-medium">Earnings</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerCard;