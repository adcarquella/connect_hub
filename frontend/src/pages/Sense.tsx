import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Bed, Armchair, Bath, DoorOpen, Clock, TrendingUp } from "lucide-react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from "recharts";

// Timeline data with detailed breakdown for each sensor/location
const timelineData = [
  {
    name: "Bed",
    segments: [
      { start: "00:00", end: "06:30", status: "in-bed", startTime: new Date("2025-10-15T00:00:00"), endTime: new Date("2025-10-15T06:30:00") },
      { start: "06:30", end: "07:00", status: "off", startTime: new Date("2025-10-15T06:30:00"), endTime: new Date("2025-10-15T07:00:00") },
      { start: "14:00", end: "15:00", status: "in-bed", startTime: new Date("2025-10-15T14:00:00"), endTime: new Date("2025-10-15T15:00:00") },
      { start: "21:15", end: "23:59", status: "in-bed", startTime: new Date("2025-10-15T21:15:00"), endTime: new Date("2025-10-15T23:59:00") },
    ],
  },
  {
    name: "Chair",
    segments: [
      { start: "07:15", end: "08:45", status: "in-chair", startTime: new Date("2025-10-15T07:15:00"), endTime: new Date("2025-10-15T08:45:00") },
      { start: "09:30", end: "11:30", status: "in-chair", startTime: new Date("2025-10-15T09:30:00"), endTime: new Date("2025-10-15T11:30:00") },
      { start: "12:30", end: "14:00", status: "in-chair", startTime: new Date("2025-10-15T12:30:00"), endTime: new Date("2025-10-15T14:00:00") },
      { start: "15:00", end: "17:00", status: "in-chair", startTime: new Date("2025-10-15T15:00:00"), endTime: new Date("2025-10-15T17:00:00") },
      { start: "17:20", end: "19:00", status: "in-chair", startTime: new Date("2025-10-15T17:20:00"), endTime: new Date("2025-10-15T19:00:00") },
      { start: "19:45", end: "21:00", status: "in-chair", startTime: new Date("2025-10-15T19:45:00"), endTime: new Date("2025-10-15T21:00:00") },
    ],
  },
  {
    name: "Bathroom",
    segments: [
      { start: "07:00", end: "07:15", status: "in-bathroom", startTime: new Date("2025-10-15T07:00:00"), endTime: new Date("2025-10-15T07:15:00") },
      { start: "17:00", end: "17:20", status: "in-bathroom", startTime: new Date("2025-10-15T17:00:00"), endTime: new Date("2025-10-15T17:20:00") },
      { start: "21:00", end: "21:15", status: "in-bathroom", startTime: new Date("2025-10-15T21:00:00"), endTime: new Date("2025-10-15T21:15:00") },
    ],
  },
  {
    name: "Room Presence",
    segments: [
      { start: "08:45", end: "09:30", status: "out-of-room", startTime: new Date("2025-10-15T08:45:00"), endTime: new Date("2025-10-15T09:30:00") },
      { start: "11:30", end: "12:30", status: "out-of-room", startTime: new Date("2025-10-15T11:30:00"), endTime: new Date("2025-10-15T12:30:00") },
      { start: "19:00", end: "19:45", status: "out-of-room", startTime: new Date("2025-10-15T19:00:00"), endTime: new Date("2025-10-15T19:45:00") },
    ],
  },
  {
    name: "Light Level V2",
    type: "numeric",
    segments: [
      { start: "00:00", end: "06:00", status: "light-off", level: 0, startTime: new Date("2025-10-15T00:00:00"), endTime: new Date("2025-10-15T06:00:00") },
      { start: "06:00", end: "07:00", status: "light-dim", level: 150, startTime: new Date("2025-10-15T06:00:00"), endTime: new Date("2025-10-15T07:00:00") },
      { start: "07:00", end: "09:00", status: "light-on", level: 312, startTime: new Date("2025-10-15T07:00:00"), endTime: new Date("2025-10-15T09:00:00") },
      { start: "09:00", end: "17:00", status: "light-on", level: 312, startTime: new Date("2025-10-15T09:00:00"), endTime: new Date("2025-10-15T17:00:00") },
      { start: "17:00", end: "19:00", status: "light-dim", level: 200, startTime: new Date("2025-10-15T17:00:00"), endTime: new Date("2025-10-15T19:00:00") },
      { start: "19:00", end: "21:00", status: "light-on", level: 312, startTime: new Date("2025-10-15T19:00:00"), endTime: new Date("2025-10-15T21:00:00") },
      { start: "21:00", end: "22:00", status: "light-dim", level: 100, startTime: new Date("2025-10-15T21:00:00"), endTime: new Date("2025-10-15T22:00:00") },
      { start: "22:00", end: "23:59", status: "light-off", level: 0, startTime: new Date("2025-10-15T22:00:00"), endTime: new Date("2025-10-15T23:59:00") },
    ],
  },
];

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
    case "off": return "hsl(var(--muted))";
    case "light-off": return "#1a1a1a";
    case "light-dim": return "#eab308";
    case "light-on": return "#fbbf24";
    default: return "hsl(var(--muted))";
  }
};

const formatDuration = (start: Date, end: Date) => {
  const diffMs = end.getTime() - start.getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  }
  return `${minutes} min`;
};

const formatTime = (date: Date) => {
  return date.toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
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
              {/* Timeline visualization with multiple rows */}
              <TooltipProvider>
                <div className="space-y-1">
                  {timelineData.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex items-center gap-3">
                      <div className="w-32 text-sm font-medium text-muted-foreground flex-shrink-0">
                        {row.name}
                      </div>
                      <div className="relative h-8 flex-1 rounded border bg-muted/20">
                        {row.segments.map((segment, segIndex) => {
                          // Calculate position and width based on 24-hour day
                          const startHour = segment.startTime.getHours() + segment.startTime.getMinutes() / 60;
                          const endHour = segment.endTime.getHours() + segment.endTime.getMinutes() / 60;
                          const left = (startHour / 24) * 100;
                          const width = ((endHour - startHour) / 24) * 100;
                          
                          return (
                            <Tooltip key={segIndex}>
                              <TooltipTrigger asChild>
                                <div
                                  className="absolute top-0 h-full cursor-pointer transition-opacity hover:opacity-90"
                                  style={{
                                    left: `${left}%`,
                                    width: `${width}%`,
                                    backgroundColor: getStatusColor(segment.status),
                                  }}
                                />
                              </TooltipTrigger>
                              <TooltipContent side="top" className="max-w-xs">
                                <div className="space-y-1">
                                  <p className="font-semibold">{row.name}</p>
                                  {row.type === "numeric" && segment.level !== undefined ? (
                                    <>
                                      <p className="text-xs text-muted-foreground">
                                        {formatTime(segment.startTime)}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {formatTime(segment.endTime)}
                                      </p>
                                      <p className="text-xs font-medium">
                                        Level: {segment.level}
                                      </p>
                                      <p className="text-xs font-medium">
                                        Duration: {formatDuration(segment.startTime, segment.endTime)}
                                      </p>
                                    </>
                                  ) : (
                                    <>
                                      <p className="text-xs text-muted-foreground">
                                        {formatTime(segment.startTime)}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {getStatusLabel(segment.status)} - {formatTime(segment.endTime)}
                                      </p>
                                      <p className="text-xs font-medium">
                                        Duration: {formatDuration(segment.startTime, segment.endTime)}
                                      </p>
                                    </>
                                  )}
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </TooltipProvider>
              
              {/* Time markers */}
              <div className="flex justify-between text-xs text-muted-foreground pl-[8.5rem]">
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
                  <RechartsTooltip
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
                  <RechartsTooltip
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
