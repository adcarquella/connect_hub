import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Bed, Armchair, Bath, DoorOpen, Clock, TrendingUp } from "lucide-react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const activityData = [
  { time: "00:00", status: "in-bed", duration: 120 },
  { time: "02:00", status: "in-bed", duration: 120 },
  { time: "04:00", status: "in-bed", duration: 120 },
  { time: "06:00", status: "in-bed", duration: 60 },
  { time: "07:00", status: "in-bathroom", duration: 15 },
  { time: "07:15", status: "in-chair", duration: 90 },
  { time: "08:45", status: "out-of-room", duration: 45 },
  { time: "09:30", status: "in-chair", duration: 120 },
  { time: "11:30", status: "out-of-room", duration: 60 },
  { time: "12:30", status: "in-chair", duration: 90 },
  { time: "14:00", status: "in-bed", duration: 60 },
  { time: "15:00", status: "in-chair", duration: 120 },
  { time: "17:00", status: "in-bathroom", duration: 20 },
  { time: "17:20", status: "in-chair", duration: 100 },
  { time: "19:00", status: "out-of-room", duration: 45 },
  { time: "19:45", status: "in-chair", duration: 75 },
  { time: "21:00", status: "in-bathroom", duration: 15 },
  { time: "21:15", status: "in-bed", duration: 165 },
];

const dailySummary = [
  { location: "In Bed", hours: 12.5, color: "hsl(var(--chart-1))", icon: Bed },
  { location: "In Chair", hours: 8.0, color: "hsl(var(--chart-2))", icon: Armchair },
  { location: "In Bathroom", hours: 0.8, color: "hsl(var(--chart-3))", icon: Bath },
  { location: "Out of Room", hours: 2.7, color: "hsl(var(--chart-4))", icon: DoorOpen },
];

const weeklyTrend = [
  { day: "Mon", inBed: 13, inChair: 7, inBathroom: 1, outOfRoom: 3 },
  { day: "Tue", inBed: 12, inChair: 8, inBathroom: 0.5, outOfRoom: 3.5 },
  { day: "Wed", inBed: 14, inChair: 6, inBathroom: 1, outOfRoom: 3 },
  { day: "Thu", inBed: 12.5, inChair: 8, inBathroom: 0.8, outOfRoom: 2.7 },
  { day: "Fri", inBed: 11, inChair: 9, inBathroom: 1.2, outOfRoom: 2.8 },
  { day: "Sat", inBed: 13.5, inChair: 7, inBathroom: 0.8, outOfRoom: 2.7 },
  { day: "Sun", inBed: 14, inChair: 6.5, inBathroom: 0.9, outOfRoom: 2.6 },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "in-bed": return "hsl(var(--chart-1))";
    case "in-chair": return "hsl(var(--chart-2))";
    case "in-bathroom": return "hsl(var(--chart-3))";
    case "out-of-room": return "hsl(var(--chart-4))";
    default: return "hsl(var(--muted))";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "in-bed": return "In Bed";
    case "in-chair": return "In Chair";
    case "in-bathroom": return "In Bathroom";
    case "out-of-room": return "Out of Room";
    default: return status;
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "in-bed": return Bed;
    case "in-chair": return Armchair;
    case "in-bathroom": return Bath;
    case "out-of-room": return DoorOpen;
    default: return Clock;
  }
};

export default function Sense() {
  const [selectedResident, setSelectedResident] = useState("resident-1");
  const [selectedDate, setSelectedDate] = useState("today");

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Sense</h1>
            <p className="text-muted-foreground">
              Track resident activities and location insights throughout the day
            </p>
          </div>
          <div className="flex gap-2">
            <Select value={selectedResident} onValueChange={setSelectedResident}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select resident" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="resident-1">Sarah Johnson</SelectItem>
                <SelectItem value="resident-2">Robert Smith</SelectItem>
                <SelectItem value="resident-3">Mary Williams</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedDate} onValueChange={setSelectedDate}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Select date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Daily Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {dailySummary.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.location}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{item.location}</CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{item.hours}h</div>
                  <p className="text-xs text-muted-foreground">
                    {((item.hours / 24) * 100).toFixed(0)}% of day
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Activity Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Activity Timeline</CardTitle>
            <CardDescription>Visual timeline of resident location throughout the day</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Timeline visualization */}
              <div className="relative h-24 w-full rounded-lg border bg-muted/20 p-2">
                <div className="flex h-full w-full items-center">
                  {activityData.map((activity, index) => {
                    const widthPercent = (activity.duration / (24 * 60)) * 100;
                    const Icon = getStatusIcon(activity.status);
                    return (
                      <div
                        key={index}
                        className="group relative flex h-full items-center justify-center border-r border-background transition-all hover:opacity-80"
                        style={{
                          width: `${widthPercent}%`,
                          backgroundColor: getStatusColor(activity.status),
                        }}
                      >
                        <Icon className="h-4 w-4 text-white opacity-0 group-hover:opacity-100" />
                        <div className="absolute -bottom-8 left-1/2 hidden -translate-x-1/2 transform whitespace-nowrap text-xs group-hover:block">
                          {activity.time} - {getStatusLabel(activity.status)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* Time markers */}
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>00:00</span>
                <span>06:00</span>
                <span>12:00</span>
                <span>18:00</span>
                <span>24:00</span>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-4 pt-4">
                {dailySummary.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.location} className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-sm"
                        style={{ backgroundColor: item.color }}
                      />
                      <Icon className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">{item.location}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Charts Row */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* Weekly Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Trend</CardTitle>
              <CardDescription>Hours spent in each location over the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="inBed" name="In Bed" stackId="a" fill="hsl(var(--chart-1))" />
                  <Bar dataKey="inChair" name="In Chair" stackId="a" fill="hsl(var(--chart-2))" />
                  <Bar dataKey="inBathroom" name="In Bathroom" stackId="a" fill="hsl(var(--chart-3))" />
                  <Bar dataKey="outOfRoom" name="Out of Room" stackId="a" fill="hsl(var(--chart-4))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Time Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Time Distribution</CardTitle>
              <CardDescription>Percentage breakdown of daily activities</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={dailySummary}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ location, hours }) => `${location}: ${hours}h`}
                    outerRadius={100}
                    fill="hsl(var(--primary))"
                    dataKey="hours"
                  >
                    {dailySummary.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity Log */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity Log</CardTitle>
            <CardDescription>Detailed activity transitions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {activityData.slice(-8).reverse().map((activity, index) => {
                const Icon = getStatusIcon(activity.status);
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="rounded-full p-2"
                        style={{ backgroundColor: getStatusColor(activity.status) + "20" }}
                      >
                        <Icon className="h-4 w-4" style={{ color: getStatusColor(activity.status) }} />
                      </div>
                      <div>
                        <p className="font-medium">{getStatusLabel(activity.status)}</p>
                        <p className="text-sm text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                    <Badge variant="outline">{activity.duration} min</Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
