import { TrendingUp, MapPin, Users, Coins, Award } from 'lucide-react';
import { Link } from 'react-router';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface UniversityCardProps {
  id: number;
  rank: number;
  name: string;
  location: string;
  activeCoins: number;
  students: number;
  avgAK: number;
  trend: number;
  specialties: string[];
  imageUrl?: string;
}

export function UniversityCard({
  id,
  rank,
  name,
  location,
  activeCoins,
  students,
  avgAK,
  trend,
  specialties,
  imageUrl
}: UniversityCardProps) {
  return (
    <Card className="p-4 sm:p-6 hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        <div className="flex-shrink-0 flex sm:block justify-between items-center sm:items-start">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground text-2xl sm:text-3xl">
            #{rank}
          </div>

          {/* Mobile AK display */}
          <div className="sm:hidden text-right">
            <div className="flex items-center gap-2 mb-1">
              <Coins className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="text-xl">{activeCoins.toLocaleString()}</span>
            </div>
            <div className="text-xs text-muted-foreground">АК</div>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="mb-2 pr-2 sm:pr-4 line-clamp-2 sm:truncate">{name}</h3>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{students.toLocaleString()} студентов</span>
                </div>
              </div>
            </div>

            {/* Desktop AK display */}
            <div className="hidden sm:block text-right flex-shrink-0 ml-4">
              <div className="flex items-center gap-2 mb-1">
                <Coins className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="text-2xl">{activeCoins.toLocaleString()}</span>
              </div>
              <div className="text-xs text-muted-foreground">АК</div>
              <div className={`flex items-center gap-1 text-sm justify-end ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                <TrendingUp className={`w-4 h-4 ${trend < 0 ? 'rotate-180' : ''}`} />
                {Math.abs(trend)}%
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-3 text-sm sm:text-base">
            <Award className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <span className="text-sm truncate">Средний АК: {avgAK.toLocaleString()}</span>

            {/* Mobile trend display */}
            <div className={`sm:hidden flex items-center gap-1 text-xs ml-auto ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              <TrendingUp className={`w-3 h-3 ${trend < 0 ? 'rotate-180' : ''}`} />
              {Math.abs(trend)}%
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4">
            {specialties.slice(0, 3).map((specialty, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {specialty}
              </Badge>
            ))}
            {specialties.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{specialties.length - 3}
              </Badge>
            )}
          </div>

          <div className="flex gap-2">
            <Link to={`/university/${id}`} className="flex-1 sm:flex-none">
              <Button size="sm" variant="default" className="w-full sm:w-auto">Подробнее</Button>
            </Link>
            <Button size="sm" variant="outline" className="flex-1 sm:flex-none" asChild>
              <Link to="/compare">Сравнить</Link>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
