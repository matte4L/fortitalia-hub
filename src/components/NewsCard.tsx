import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface NewsCardProps {
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image?: string;
}

const NewsCard = ({ title, excerpt, date, category, image }: NewsCardProps) => {
  return (
    <Card className="hover-lift animate-fade-in cursor-pointer">
      {image && (
        <div className="aspect-video w-full overflow-hidden rounded-t-lg">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      <CardHeader>
        <div className="flex justify-between items-start">
          <Badge variant="secondary" className="mb-2">
            {category}
          </Badge>
          <span className="text-sm text-muted-foreground">{date}</span>
        </div>
        <CardTitle className="text-lg hover:text-primary transition-colors">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{excerpt}</p>
      </CardContent>
    </Card>
  );
};

export default NewsCard;