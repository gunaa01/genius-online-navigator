
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { ChartData } from "@/hooks/useDemoData";

interface AnalyticsPanelProps {
  visitors: ChartData[];
  revenue: ChartData[];
  loading: boolean;
}

const AnalyticsPanel = ({ visitors, revenue, loading }: AnalyticsPanelProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <Card key={i} className="card-shadow">
            <CardHeader>
              <CardTitle className="text-lg">Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-60 animate-pulse bg-secondary rounded-md"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="card-shadow">
        <CardHeader className="pb-0">
          <CardTitle className="text-lg">Visitor Traffic</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={visitors}
                margin={{
                  top: 10,
                  right: 10,
                  bottom: 0,
                  left: -10,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary)/0.2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between items-center mt-2">
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">+12.5%</span> from last week
            </div>
            <button className="text-sm text-primary underline">View details</button>
          </div>
        </CardContent>
      </Card>
      
      <Card className="card-shadow">
        <CardHeader className="pb-0">
          <CardTitle className="text-lg">Revenue Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={revenue}
                margin={{
                  top: 10,
                  right: 10,
                  bottom: 0,
                  left: -10,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                <Bar dataKey="value" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-between items-center mt-2">
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">+14.2%</span> from last week
            </div>
            <button className="text-sm text-primary underline">View details</button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsPanel;
