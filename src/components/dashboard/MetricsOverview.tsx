
import { 
  User, 
  Percent, 
  Clock, 
  DollarSign,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { MetricData } from "@/hooks/useDemoData";

interface MetricsOverviewProps {
  metrics: MetricData[];
  loading: boolean;
}

const MetricsOverview = ({ metrics, loading }: MetricsOverviewProps) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "user":
        return <User className="h-5 w-5 text-primary" />;
      case "percent":
        return <Percent className="h-5 w-5 text-accent" />;
      case "clock":
        return <Clock className="h-5 w-5 text-indigo-500" />;
      case "dollar":
        return <DollarSign className="h-5 w-5 text-green-500" />;
      default:
        return <User className="h-5 w-5 text-primary" />;
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="card-shadow">
            <CardContent className="p-6 flex items-center">
              <div className="w-full h-20 animate-pulse bg-secondary rounded-md"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <Card key={index} className="card-shadow">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-2">
              <span className="bg-primary/10 p-2 rounded-md">{getIcon(metric.icon)}</span>
              <div className={`flex items-center ${metric.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {metric.change >= 0 ? (
                  <TrendingUp className="h-4 w-4 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-1" />
                )}
                <span className="text-sm font-medium">
                  {Math.abs(metric.change)}%
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground">
                {metric.name}
              </h3>
              <p className="text-2xl font-bold">
                {metric.name.includes("Revenue") ? `$${metric.value.toLocaleString()}` :
                metric.name.includes("Rate") ? `${metric.value}%` :
                metric.name.includes("Avg") ? `${metric.value} min` :
                metric.value.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MetricsOverview;
