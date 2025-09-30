import { useState } from "react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { useToast } from "@/hooks/use-toast";
import {
  TrendingUp,
  Users,
  FileText,
  DollarSign,
  Activity,
  Phone,
  Clock
} from "lucide-react";

import { sendEncryptedData } from "../api/apiClient";
import { useEffect } from "react";


const Dashboard = () => {

  const { toast } = useToast();

  const [nurseCallData, setNurseCallData] = useState([])
  /*[
  {
      "SiteID": 105,
      "SiteName": "Sense Test",
      "CallCount": 340
    }
  ]
*/

  const [metrics, setMetrics] = useState([
    {
      title: "Total Calls",
      value: "18,430",
      change: "+12.5%",
      changeType: "positive" as const,
      icon: Phone,
    },
    {
      title: "",
      value: "",
      change: "",
      changeType: "positive" as const,
      icon: Users,
    },
    {
      title: "",
      value: "",
      change: "", //+23.1%
      changeType: "positive" as const,
      icon: FileText,
    },
    {
      title: "",
      value: "",
      change: "",
      changeType: "positive" as const,
      icon: Clock,
    },
  ]);

  const recentActivity = [
    { id: 1, client: "Acme Corp", action: "Generated Q4 Report", time: "2 minutes ago" },
    { id: 2, client: "TechStart Inc", action: "Updated team permissions", time: "15 minutes ago" },
    { id: 3, client: "Global Solutions", action: "New user invited", time: "1 hour ago" },
    { id: 4, client: "Innovation Labs", action: "Report shared", time: "2 hours ago" },
  ];



  useEffect(() => {

    sendEncryptedData("dashboard/summary", {}).then(d => {

      if (d.TotalCalls) setNurseCallData(d.TotalCalls);
      
      if (d.CallsBreakdown) {

        function getCallData(callObject, callType) {
          const callArray = callObject[callType];
          if (!callArray) return ["", ""];
          let current = 0;
          let previous = 0;

          callArray.forEach(callData => {
            current += parseInt(callData.current_month_calls);
            previous += parseInt(callData.previous_month_calls);
          });
          return [current, previous];
        }

        function getPercentageChange(previous, current) {
          if (previous === 0) {
            // Avoid division by zero
            return current === 0 ? '0%' : '+100%';
          }
          
          const change = ((current - previous) / previous) * 100;
          const sign = change >= 0 ? '+' : ''; // Add '+' for positive change
          return `${sign}${change.toFixed(1)}%`; // Round to 1 decimal place
        }

        const grouped = d.CallsBreakdown.reduce((acc, item) => {
          const key = item.call_type;
          if (!acc[key]) acc[key] = [];
          acc[key].push(item);
          return acc;
        }, {});
        console.log(grouped);

        const [emergencyCurrent, emergencyPrevious] = getCallData(grouped, "Emergency");
        const [fallCurrent, fallPrevious] = getCallData(grouped, "Fall");
        const [senseCurrent, sensePrevious] = getCallData(grouped, "Sense");

        function getPositiveNegative(previous, current){
          if (previous > current) return "negative";
          return "positive";
        }

        
        setMetrics(

          [
            {
              title: "Total Calls",
              value: "18,430",
              change: "+12.5%",
              changeType: "positive" as const,
              icon: Phone,
            },
            {
              title: "Emergency Calls",
              value: emergencyCurrent.toString(),
              change: getPercentageChange(emergencyPrevious, emergencyCurrent),
              changeType: getPositiveNegative(emergencyCurrent, ).toString() as const,
              icon: Users,
            },
            {
              title: "Fall",
              value: fallCurrent.toString(),
              change: getPercentageChange(fallPrevious, fallCurrent), //+23.1%
              changeType: getPositiveNegative(fallCurrent, fallPrevious).toString() as const,
              icon: FileText,
            },
            {
              title: "Sense",
              value: senseCurrent.toString(),
              change: getPercentageChange(sensePrevious, senseCurrent), //+23.1%
              changeType: getPositiveNegative(senseCurrent, sensePrevious).toString() as const,
              icon: FileText,
            },
          ]
        )
      }

    }).catch(e => {
      toast({ title: "Dashboard Error", description: e.toString() });
      console.log(e)
    }
    );

  }, [1 === 1]);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            Monitor your client insights and team performance
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="dashboard-card rounded-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-secondary/10">
                  <TrendingUp className="h-5 w-5 text-secondary" />
                </div>
                <h2 className="text-xl font-semibold text-card-foreground">
                  Site Calls
                </h2>
              </div>

              <div className="h-64 p-4 overflow-y-auto">
                <div className="space-y-4">
                  {nurseCallData.map((item, index) => {
                    const maxCalls = Math.max(...nurseCallData.map(d => d.CallCount));
                    const percentage = (item.CallCount / maxCalls) * 100;

                    return (
                      <div key={index} className="flex items-center gap-4">
                        <div className="w-20 text-sm font-medium text-right">
                          {item.SiteName}
                        </div>
                        <div className="flex-1 bg-muted rounded-full h-6 relative">
                          <div
                            className="bg-primary h-full rounded-full flex items-center justify-end pr-2"
                            style={{ width: `${percentage}%` }}
                          >
                            <span className="text-xs text-primary-foreground font-medium">
                              {item.CallCount}
                            </span>
                          </div>
                        </div>
                        {/*
                        <div className="text-xs text-muted-foreground w-16">
                          {item.avgTime}min avg
                        </div>
                        */}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Recent Activity */}
            <div className="dashboard-card rounded-lg p-6">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">

              </h3>
              <div className="space-y-4">
                
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                    <div className="flex-1">
                      
                      <p className="text-sm font-medium text-card-foreground">

                      </p>
                      <p className="text-sm text-muted-foreground">

                      </p>
                      <p className="text-xs text-muted-foreground mt-1">

                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;