import { useState } from "react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  TrendingUp,
  Users,
  FileText,
  DollarSign,
  Activity,
  Phone,
  Clock,
    Bot,
    Home,
    MapPin
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
              value: 0,//fallCurrent.toString(),
              change: '+100%',//getPercentageChange(fallPrevious, fallCurrent), //+23.1%
              changeType: "positive"  as const,//getPositiveNegative(fallCurrent, fallPrevious).toString() as const,
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


const aiOverview = `Based on current data analysis, your care home network is performing exceptionally well with an overall occupancy rate of 94.3%. arquellacare and Sense test are showing strong performance metrics with high resident satisfaction scores. 

Key highlights: All facilities maintain excellent safety standards, with emergency response times averaging 2.1 minutes. Staff-to-resident ratios are optimal across all locations. Recent improvements in meal service quality have increased resident satisfaction by 12% this quarter.

Recommendations: Consider expanding capacity at Arquella Demo Stand One Care due to high demand in the Birmingham area. Continue monitoring Arquella Home 2 for potential improvements in recreational activities.`;


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
        <div></div>
        </div>
        {/* Care Homes Overview & AI Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Care Homes Summary */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Home className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Care Home Summary</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {careHomes.map((home) => (
                <div key={home.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-card-foreground">{home.name}</h3>
                      <Badge 
                        variant={home.status === "excellent" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {home.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {home.location}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Residents</p>
                      <p className="font-medium">{home.residents}/{home.capacity}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Occupancy</p>
                      <p className="font-medium">{home.occupancy}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Updated</p>
                      <p className="font-medium">{home.lastUpdate}</p>
                    </div>
                  </div>
                  
                  <div className="w-full bg-muted rounded-full h-2 flex overflow-hidden">
                    {(() => {
                      const totalCalls = Object.values(home.calls).reduce((sum, count) => sum + count, 0);
                      let accumulatedWidth = 0;
                      
                      return Object.entries(home.calls).map(([type, count], index) => {
                        const percentage = (count / totalCalls) * 100;
                        const segment = (
                          <div 
                            key={type}
                            className="h-2 transition-all"
                            style={{ 
                              width: `${percentage}%`,
                              backgroundColor: callTypeColors[type],
                              borderTopLeftRadius: index === 0 ? '9999px' : '0',
                              borderBottomLeftRadius: index === 0 ? '9999px' : '0',
                              borderTopRightRadius: index === Object.keys(home.calls).length - 1 ? '9999px' : '0',
                              borderBottomRightRadius: index === Object.keys(home.calls).length - 1 ? '9999px' : '0'
                            }}
                          />
                        );
                        accumulatedWidth += percentage;
                        return segment;
                      });
                    })()}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* AI Generated Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-secondary/10">
                  <Bot className="h-5 w-5 text-secondary" />
                </div>
                <CardTitle>AI Network Insights</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none text-card-foreground">
                <div className="whitespace-pre-line text-sm leading-relaxed">
                  {aiOverview}
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-4 w-4 text-primary" />
                  <span className="font-medium text-sm">Quick Stats</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="text-muted-foreground">Avg Response Time</p>
                    <p className="font-medium">2.1 minutes</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Satisfaction Rate</p>
                    <p className="font-medium">97.8%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Staff Coverage</p>
                    <p className="font-medium">Optimal</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Safety Score</p>
                    <p className="font-medium">Excellent</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

    </DashboardLayout>
  );
};



const callTypeColors: Record<string, string> = {
    "Call": "#f97316",
    "Sense": "#a855f7",
    "Attendance": "#84cc16",
    "Assistance": "#eab308",
    "Emergency": "#ef4444"
  };

  const careHomes = [
    { 
      id: 1, 
      name: "Sense Test", 
      location: "Manchester", 
      residents: 87, 
      capacity: 95, 
      occupancy: 91.6,
      status: "excellent",
      lastUpdate: "2 hours ago",
      calls: {
        "Call": 65,
        "Sense": 25,
        "Attendance": 7,
        "Assistance": 2,
        "Emergency": 1
      }
    },
    { 
      id: 2, 
      name: "arquellacare", 
      location: "Birmingham", 
      residents: 124, 
      capacity: 130, 
      occupancy: 95.4,
      status: "excellent", 
      lastUpdate: "1 hour ago",
      calls: {
        "Call": 55,
        "Sense": 30,
        "Attendance": 5,
        "Assistance": 7,
        "Emergency": 3
      }
    },
    { 
      id: 3, 
      name: "Arquella Home 2", 
      location: "Leeds", 
      residents: 76, 
      capacity: 80, 
      occupancy: 95.0,
      status: "good",
      lastUpdate: "3 hours ago",
      calls: {
        "Call": 70,
        "Sense": 20,
        "Attendance": 6,
        "Assistance": 3,
        "Emergency": 1
      }
    },
    { 
      id: 4, 
      name: "Arquella Demo Stand One", 
      location: "Liverpool", 
      residents: 134, 
      capacity: 140, 
      occupancy: 95.7,
      status: "excellent",
      lastUpdate: "45 minutes ago",
      calls: {
        "Call": 60,
        "Sense": 22,
        "Attendance": 10,
        "Assistance": 5,
        "Emergency": 3
      }
    },
  ];
export default Dashboard;