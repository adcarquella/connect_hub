import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, TrendingUp, TrendingDown, Users, AlertTriangle, Activity, Clock } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const fallTrendData = [
  { month: "Mar 1", actual: 45, prediction: 43 },
  { month: "Mar 8", actual: 42, prediction: 44 },
  { month: "Mar 15", actual: 48, prediction: 46 },
  { month: "Mar 22", actual: 52, prediction: 50 },
  { month: "Mar 29", actual: 49, prediction: 53 },
  { month: "Apr 5", actual: 55, prediction: 56 },
  { month: "Apr 12", actual: 58, prediction: 59 },
  { month: "Apr 19", actual: null, prediction: 62 },
  { month: "Apr 26", actual: null, prediction: 65 },
];

const riskByRegionData = [
  { region: "Salthouse Haven", risk: "High", value: 85, baseline: 60 },
  { region: "Banksfield", risk: "Medium", value: 45, baseline: 55 },
  { region: "Bartonbrook", risk: "Low", value: 25, baseline: 50 },
  { region: "Berwick House", risk: "Medium", value: 35, baseline: 45 },
];

const responseTimeData = [
  { region: "Salhouse Haven", baseline: 8, responseTime: 12 },
  { region: "Banksfield", baseline: 6, responseTime: 25 },
  { region: "Bartonbrook", baseline: 7, responseTime: 15 },
  { region: "Berwick House", baseline: 8, responseTime: 18 },
];

const presenceData = [
  { name: "Out of Room", value: 32.5, color: "#f97316" },
  { name: "In Bed", value: 31.3, color: "#06b6d4" },
  { name: "In Chair", value: 18.8, color: "#84cc16" },
  { name: "In Bathroom", value: 12.9, color: "#8b5cf6" },
  { name: "Room Entry", value: 4.6, color: "#ef4444" },
];

export const SeniorLiving = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [timeFilter, setTimeFilter] = useState("This Month");

  const metricCards = [
    {
      title: "High Risk Sites",
      value: "7",
      subtitle: "of 30",
      change: "17%",
      changeType: "negative" as const,
      icon: AlertTriangle,
      color: "text-destructive"
    },
    {
      title: "Total Falls",
      value: "602",
      change: "18%",
      changeType: "negative" as const,
      icon: TrendingDown,
      color: "text-muted-foreground"
    },
    {
      title: "Fall with Injuries",
      value: "361",
      change: "3%",
      changeType: "negative" as const,
      icon: AlertTriangle,
      color: "text-destructive"
    },
    {
      title: "Fall without Injuries",
      value: "241",
      change: "3%",
      changeType: "positive" as const,
      icon: Activity,
      color: "text-success"
    },
    {
      title: "Frequent Fallers",
      value: "22",
      change: "20%",
      changeType: "positive" as const,
      icon: Users,
      color: "text-primary"
    },
    {
      title: "New Fallers",
      value: "58",
      change: "12%",
      changeType: "negative" as const,
      icon: TrendingUp,
      color: "text-warning"
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Data insights and intelligence</h1>
            <p className="text-muted-foreground mt-1">Fall risk monitoring and resident safety dashboard</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search Sites"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="This Week">This Week</SelectItem>
                <SelectItem value="This Month">This Month</SelectItem>
                <SelectItem value="This Quarter">This Quarter</SelectItem>
                <SelectItem value="This Year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {metricCards.map((metric, index) => (
            <Card key={index} className="glass-panel">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <metric.icon className={`h-4 w-4 ${metric.color}`} />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold">{metric.value}</span>
                    {metric.subtitle && (
                      <span className="text-sm text-muted-foreground">{metric.subtitle}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge
                      variant={metric.changeType === "positive" ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {metric.changeType === "positive" ? "+" : ""}{metric.change}
                    </Badge>
                    <span className="text-xs text-muted-foreground">previous month</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Fall Risk by Regions */}
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Fall Risk by Site
                <div className="flex items-center gap-2 ml-auto">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <span className="text-sm text-muted-foreground">Average</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart data={riskByRegionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="region"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    />
                    <YAxis
                      domain={[0, 100]}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }}
                    />
                    <Scatter
                      dataKey="value"
                      fill="hsl(var(--primary))"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-between text-sm mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-destructive rounded"></div>
                  <span>High</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-warning rounded"></div>
                  <span>Medium</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-success rounded"></div>
                  <span>Low</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Risk Trend */}
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Risk Trend
                <span className="text-sm text-muted-foreground">Prediction</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={fallTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="actual"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                      connectNulls={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="prediction"
                      stroke="hsl(var(--destructive))"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ fill: "hsl(var(--destructive))", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Average Response Time by Site */}
          <Card className="glass-panel lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-4">
                Average Response Time by Site
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-primary rounded"></div>
                    <span>Baseline</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-secondary rounded"></div>
                    <span>Response time</span>
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={responseTimeData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      type="number"
                      domain={[0, 60]}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    />
                    <YAxis
                      type="category"
                      dataKey="region"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }}
                    />
                    <Bar dataKey="baseline" fill="hsl(var(--primary))" radius={4} />
                    <Bar dataKey="responseTime" fill="hsl(var(--secondary))" radius={4} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {/* AI Insights Section */}
              <div className="mt-6 border-t border-border pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-1.5 rounded-lg bg-gradient-to-r from-primary/20 to-secondary/20">
                    <TrendingUp className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold gradient-text">AI Insights for Action</h3>
                  {/*<Badge variant="secondary" className="text-xs ml-auto">
                    Generated 2 min ago
                  </Badge>*/}
                </div>

                <div className="space-y-3">
                  {/*
                  <div className="p-4 rounded-lg bg-gradient-to-r from-primary/5 to-transparent border border-primary/20">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-destructive mt-2 animate-pulse"></div>
                      <div>
                        <p className="text-sm font-medium text-foreground mb-1">High Priority Alert</p>
                        <p className="text-sm text-muted-foreground">
                          <strong>Insight 1: </strong>62% of fall/near-fall events occurred
                          between 22:00–06:00; 48% were within 3 minutes of a bed-exit and on the route
                          to the bathroom
                          <br />
                          <strong>Suggested action: </strong>Add motion-activated
                          lighting/nightlights, schedule pre-sleep toileting, move evening diuretic
                          dosing earlier when clinically appropriate, and consider a “guided path”
                          (contrast tape, floor arrows).

                        </p>
                      </div>
                    </div>
                  </div>
*/}
                  <div className="p-4 rounded-lg bg-gradient-to-r from-warning/5 to-transparent border border-warning/20">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-warning mt-2"></div>
                      <div>
                        <p className="text-sm font-medium text-foreground mb-1">Risk Trend Analysis</p>
                        <p className="text-sm text-muted-foreground">
                                  <strong>Insight 1: </strong>62% of fall/near-fall events occurred
                          between 22:00–06:00; 48% were within 3 minutes of a bed-exit and on the route
                          to the bathroom
                          <br />
                          <strong>Suggested action: </strong>Add motion-activated
                          lighting/nightlights, schedule pre-sleep toileting, move evening diuretic
                          dosing earlier when clinically appropriate, and consider a “guided path”
                          (contrast tape, floor arrows).
                        </p>
                      </div>
                    </div>
                  </div>

<div className="p-4 rounded-lg bg-gradient-to-r from-warning/5 to-transparent border border-warning/20">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-warning mt-2"></div>
                      <div>
                        <p className="text-sm font-medium text-foreground mb-1">Risk Trend Analysis</p>
                        <p className="text-sm text-muted-foreground">
                          <strong>Insight 2:</strong> In 23% of residents, bed-exit to
bathroom-entry time {">"}75 seconds at night (baseline ~40–50s). Heat-maps show
micro-stumble flags at door thresholds and around loose floor mats.

<br />
<strong>Suggested action:</strong> Remove loose rugs, add
high-contrast threshold tape, install grab bars on the bed-to-bathroom route,
and trial a 2-week “transfer coach” round during high-risk hours..
                        </p>
                      </div>
                    </div>
                  </div>



                  {/*
                  <div className="p-4 rounded-lg bg-gradient-to-r from-secondary/5 to-transparent border border-secondary/20">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-secondary mt-2"></div>
                      <div>
                        <p className="text-sm font-medium text-foreground mb-1">Response Time Optimization</p>
                        <p className="text-sm text-muted-foreground">
                          Banksfield site showing 67% slower response times. Staff allocation review recommended
                          for peak hours (2-4 PM).
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-gradient-to-r from-success/5 to-transparent border border-success/20">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-success mt-2"></div>
                      <div>
                        <p className="text-sm font-medium text-foreground mb-1">Positive Trend</p>
                        <p className="text-sm text-muted-foreground">
                          Bartonbrook showing 15% improvement in fall prevention. Current protocols
                          should be replicated across other sites.
                        </p>
                      </div>
                    </div>
                  </div>
                  */}
                </div>

                <div className="mt-4 p-3 rounded-lg bg-muted/30 border border-border">
                  <p className="text-xs text-muted-foreground text-center">
                    💡 AI-powered insights are generated from resident activity patterns, historical data, and predictive analytics.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sidebar Metrics */}
          <div className="space-y-4">
            <Card className="glass-panel">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Out of Room</h3>
                    <p className="text-2xl font-bold">64%</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-secondary/10">
                      <Activity className="h-5 w-5 text-secondary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Bathroom presence</p>
                      <p className="font-semibold">22%</p>
                    </div>

                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-warning/10">
                      <Clock className="h-5 w-5 text-warning" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Bedroom presence</p>
                      <p className="font-semibold">14%</p>
                    </div>
                  </div>



                </div>
              </CardContent>
            </Card>

            {/* Average Presence Pie Chart */}
            <Card className="glass-panel">
              <CardHeader>
                <CardTitle>Average Presence (In Hours)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={presenceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        dataKey="value"
                      >
                        {presenceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px"
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2 mt-4">
                  {presenceData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        ></div>
                        <span>{item.name}</span>
                      </div>
                      <span className="font-medium">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};