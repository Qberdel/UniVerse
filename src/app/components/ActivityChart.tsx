import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card } from './ui/card';

interface ActivityChartProps {
  data: Array<{
    month: string;
    rating: number;
    applications: number;
  }>;
  title: string;
}

export function ActivityChart({ data, title }: ActivityChartProps) {
  return (
    <Card className="p-4 sm:p-6">
      <h3 className="mb-4 text-base sm:text-lg">{title}</h3>
      <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorRating" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorApplications" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="month"
            stroke="hsl(var(--muted-foreground))"
            fontSize={10}
            className="sm:text-xs"
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={10}
            className="sm:text-xs"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--popover))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              fontSize: '12px'
            }}
          />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
          <Area
            type="monotone"
            dataKey="rating"
            stroke="hsl(var(--chart-1))"
            fillOpacity={1}
            fill="url(#colorRating)"
            name="Рейтинг"
          />
          <Area
            type="monotone"
            dataKey="applications"
            stroke="hsl(var(--chart-2))"
            fillOpacity={1}
            fill="url(#colorApplications)"
            name="Заявки"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}
