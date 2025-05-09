import React, { useState } from 'react';
import DashboardLayout from "@/components/layouts/DashboardLayout";
import AnalyticsDashboard from "@/components/analytics/AnalyticsDashboard";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

const AnalyticsPage = () => {
  const [dashboardVariant, setDashboardVariant] = useState<'default' | 'innovation' | 'comprehensive'>('default');
  const [enableRealTime, setEnableRealTime] = useState<boolean>(true);

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Analytics</h1>
            <p className="text-muted-foreground">Choose your preferred analytics dashboard view</p>
          </div>
          <div className="flex gap-4 items-center">
            <Select 
              value={dashboardVariant} 
              onValueChange={(value: any) => setDashboardVariant(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select dashboard" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Standard</SelectItem>
                <SelectItem value="innovation">Innovation</SelectItem>
                <SelectItem value="comprehensive">Comprehensive</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant={enableRealTime ? "default" : "outline"} 
              onClick={() => setEnableRealTime(!enableRealTime)}
            >
              {enableRealTime ? "Real-Time: On" : "Real-Time: Off"}
            </Button>
          </div>
        </div>
        
        <AnalyticsDashboard 
          variant={dashboardVariant} 
          enableRealTime={enableRealTime} 
        />
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsPage;
