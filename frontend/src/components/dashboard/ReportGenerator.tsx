
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Download, 
  Plus,
  BarChart,
  Share2,
  Megaphone
} from "lucide-react";
import { Report } from "@/hooks/useDemoData";

interface ReportGeneratorProps {
  reports: Report[];
  loading: boolean;
}

const ReportGenerator = ({ reports, loading }: ReportGeneratorProps) => {
  if (loading) {
    return (
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle className="text-lg">Loading...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-full h-16 animate-pulse bg-secondary rounded-md"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getReportIcon = (type: string) => {
    switch (type) {
      case "analytics":
        return <BarChart className="h-4 w-4" />;
      case "social":
        return <Share2 className="h-4 w-4" />;
      case "ads":
        return <Megaphone className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <Card className="card-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg flex items-center">
          <FileText className="h-5 w-5 mr-2 text-primary" />
          Reports
        </CardTitle>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" /> Generate Report
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report.id} className="flex justify-between items-center p-4 bg-secondary/50 rounded-lg">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  {getReportIcon(report.type)}
                </div>
                <div className="ml-4">
                  <p className="font-medium">{report.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Generated on {new Date(report.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Button variant="link">View All Reports</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportGenerator;
