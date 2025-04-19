
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface DataImport {
  id: number;
  filename: string;
  type: string;
  size: string;
  importDate: string;
  status: "completed" | "processing" | "failed";
  records: number | null;
}

interface DataImportTabProps {
  dataImports: DataImport[];
  onImportData: () => void;
}

const DataImportTab = ({ 
  dataImports, 
  onImportData 
}: DataImportTabProps) => {
  return (
    <Card className="card-shadow mb-8">
      <CardHeader>
        <CardTitle className="text-lg">Data Import</CardTitle>
        <CardDescription>
          Import data from CSV, Excel, or JSON files
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="border-2 border-dashed border-secondary rounded-lg p-10 text-center">
          <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Drag & Drop Files</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Supported formats: CSV, Excel, JSON
          </p>
          <Button onClick={onImportData}>
            Select Files
          </Button>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">Recent Imports</h3>
          <div className="rounded-md border">
            <div className="grid grid-cols-12 bg-secondary/50 p-3 font-medium text-sm">
              <div className="col-span-3">Filename</div>
              <div className="col-span-2">Type</div>
              <div className="col-span-2">Size</div>
              <div className="col-span-2">Import Date</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-1">Records</div>
            </div>
            {dataImports.map((item) => (
              <div key={item.id} className="grid grid-cols-12 py-4 px-3 border-t">
                <div className="col-span-3 font-medium">{item.filename}</div>
                <div className="col-span-2">{item.type}</div>
                <div className="col-span-2">{item.size}</div>
                <div className="col-span-2 text-sm text-muted-foreground">
                  {new Date(item.importDate).toLocaleDateString()}
                </div>
                <div className="col-span-2">
                  {item.status === "completed" ? (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Completed</Badge>
                  ) : item.status === "processing" ? (
                    <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Processing</Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Failed</Badge>
                  )}
                </div>
                <div className="col-span-1">
                  {item.records !== null ? item.records.toLocaleString() : "-"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataImportTab;
