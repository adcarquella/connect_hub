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
  const [zoneSummaryData, setZoneSummaryData] = useState([]);
  const [zonesList, setZonesList] = useState([]);


  const [metrics, setMetrics] = useState([
    {
      title: "...",
      value: "...",
      change: "...",
      changeType: "positive" as const,
      icon: Phone,
    },
    {
      title: "...",
      value: "...",
      change: "...",
      changeType: "positive" as const,
      icon: Users,
    },
    {
      title: "...",
      value: "...",
      change: "...",
      changeType: "positive" as const,
      icon: FileText,
    },
    {
      title: "...",
      value: "...",
      change: "...",
      changeType: "positive" as const,
      icon: Clock,
    },
  ]);

  const JourneyFromZoneGrouping = ({ journeyGroup }) => {

    console.log([journeyGroup]);
    const totalCalls = journeyGroup.reduce((sum, item) => sum + item.TotalCalls, 0);
    let accumulatedWidth = 0;

    const rtn = journeyGroup.map((journeyCall, index) => {
      const percentage = (journeyCall.TotalCalls / totalCalls) * 100;

      const segment = (
        <div
          key={journeyCall.Zone + index}
          className="h-2 transition-all"
          style={{
            width: `${percentage}%`,
            backgroundColor: callTypeColors[journeyCall["Call Type"]],
            borderTopLeftRadius: index === 0 ? '9999px' : '0',
            borderBottomLeftRadius: index === 0 ? '9999px' : '0',
            borderTopRightRadius: (index === journeyCall.length - 1) ? '9999px' : '0',
            borderBottomRightRadius: index === journeyCall.length - 1 ? '9999px' : '0'
          }}
        />
      );
      accumulatedWidth += percentage;
      return segment;
    })

    return <>{rtn}</>;
  }



  useEffect(() => {

    sendEncryptedData("dashboard/summary", {}).then(d => {

      console.log("dbData", d);

      if (d.TotalCalls) setNurseCallData(d.TotalCalls);



      if (d.CallsByZone) {
        const tmpZonesList = d.CallsByZone.reduce((acc, item) => {
          const key = item.Zone;
          if (!acc[key]) acc[key] = [];
          acc[key].push(item);
          return acc;
        }, {});

        setZoneSummaryData(tmpZonesList);
      }

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

        function getPositiveNegative(previous, current) {
          if (previous > current) return "negative";
          return "positive";
        }

        if (d.CallsBreakdown) {

          function totalUpGroup(list, field) {
            return list.reduce((sum, item) => sum + Number(item[field] || 0), 0);
          }
          function calculatePercentageChange(current, previous) {
            if (!previous || previous === 0) {
              // Avoid division by zero — if there's no previous data
              return "+0%";
            }

            const change = ((current - previous) / previous) * 100;
            const formatted = `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`;
            return formatted;
          }

          function getTotals(list, callType){
            const callList = breakdown.filter(b=>b.call_type===callType);
            const total = (callList[0]) ? callList[0]["current_month_calls"] : 0;
            const prevTotal = (callList[0]) ? callList[0]["previous_month_calls"] : 0;
            const diff = calculatePercentageChange(total, prevTotal);

            return [total, prevTotal, diff];
          }

          const breakdown = d.CallsBreakdown;

          const callsTotal = totalUpGroup(breakdown, "current_month_calls");
          const previousTotal = totalUpGroup(breakdown, "previous_month_calls");

          const objTotalCalls = {
            title: "Total Calls",
            value: callsTotal,
            change: calculatePercentageChange(callsTotal, previousTotal),
            changeType: "positive" as const,
            icon: Phone,
          };

          const [emergencyTotal, prevEmergencyTotal, emergencyDiff] = getTotals(breakdown, "Emergency");

          const objEmergencyCalls = {
            title: "Emergency Calls",
            value: emergencyTotal.toString() + " ",
            change: emergencyDiff,
            changeType: 0,//getPositiveNegative(emergencyCurrent,).toString() as const,
            icon: Users,
          };

          const objFall = {
            title: "Fall",
            value: 0,//fallCurrent.toString(),
            change: '+100%',//getPercentageChange(fallPrevious, fallCurrent), //+23.1%
            changeType: "positive" as const,//getPositiveNegative(fallCurrent, fallPrevious).toString() as const,
            icon: FileText,
          };


          const [senseTotal, prevSenseTotal, senseDiff] = getTotals(breakdown, "Sense");

          const objSense = {
            title: "Sense",
            value: senseTotal,
            change: senseDiff,
            changeType: 0,//getPositiveNegative(senseCurrent, sensePrevious).toString() as const,
            icon: FileText,
          };

          const metricsArray = [];
          metricsArray.push(objTotalCalls);
          metricsArray.push(objEmergencyCalls);
          metricsArray.push(objFall);
          metricsArray.push(objSense);



          setMetrics(metricsArray);


        }

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
            Site summary for the current calendar month
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
              <CardTitle>Zone Summary</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.keys(zoneSummaryData).map((home) => {

              const homeCalls = zoneSummaryData[home];
              const zoneTotal = homeCalls.reduce((sum, item) => sum + item.TotalCalls, 0);
              const emergencyCalls = homeCalls.filter(c => c["Call Type"] === "Emergency");
              const emergencyTotal = (emergencyCalls.length > 0) ? emergencyCalls[0].TotalCalls : 0;

              return (
                <div
                  //key={home.id}
                  className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-card-foreground">{home}</h3>

                      <Badge
                        //variant={home.status === "excellent" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {//home.status
                        }
                      </Badge>

                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {
                        //home.location
                      }
                    </div>

                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Calls</p>
                      <p className="font-medium">{
                        zoneTotal
                        /*home.residents}/{home.capacity*/
                      }</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Emergency</p>
                      <p className="font-medium">{
                        emergencyTotal
                      }</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Updated</p>
                      <p className="font-medium">{
                        //home.lastUpdate
                      }
                      </p>
                    </div>
                  </div>


                  <div className="w-full bg-muted rounded-full h-2 flex overflow-hidden">
                    <JourneyFromZoneGrouping journeyGroup={zoneSummaryData[home]} />
                  </div>

                </div>
              )
            }
            )}


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
  "Call": "#F5814E",
  "Sense": "#904499",
  "Attendance": "#84cc16",
  "Assistance": "#eab308",
  "Emergency": "#ED1849"
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