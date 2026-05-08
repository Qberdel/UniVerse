import { Card } from './ui/card';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    positive: boolean;
  };
  description?: string;
}

export function StatsCard({ title, value, icon: Icon, trend, description }: StatsCardProps) {
  return (
    <Card className="p-3 sm:p-4 lg:p-6">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm text-muted-foreground mb-1 truncate">{title}</p>
          <h3 className="text-xl sm:text-2xl lg:text-3xl mb-1 truncate">{value}</h3>
          {description && (
            <p className="text-xs text-muted-foreground truncate hidden sm:block">{description}</p>
          )}
          {trend && (
            <div className={`text-xs sm:text-sm mt-1 sm:mt-2 ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.positive ? '↑' : '↓'} {trend.value}%
              <span className="hidden sm:inline"> за месяц</span>
            </div>
          )}
        </div>
        <div className="flex-shrink-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          </div>
        </div>
      </div>
    </Card>
  );
}
