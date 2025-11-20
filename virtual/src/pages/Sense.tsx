import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Bed, Armchair, Bath, DoorOpen, Clock } from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { sendEncryptedData } from "@/api/apiClient";

const iconMap: Record<string, any> = {
  Bed,
  Armchair,
  Bath,
  DoorOpen,
  Clock,
};

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
  if (hours > 0) return `${hours}:${minutes.toString().padStart(2, "0")}`;
  return `${minutes} min`;
};

const formatTime = (date: Date) =>
  date.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

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

  const [timelineData, setTimelineData] = useState<any[]>([]);
  const [activityData, setActivityData] = useState<any[]>([]);
  const [dailySummary, setDailySummary] = useState<any[]>([]);
  const [weeklyTrend, setWeeklyTrend] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchData() {
    await sendEncryptedData("/sense/dashboard/data/get", { residentId: selectedResident, date: selectedDate });
  }

  // Fetch data from API
  useEffect(() => {

    const fetchData = async () => {
      console.log("Fetching data for resident:", selectedResident, "date:", selectedDate);
      setLoading(true);
      setError(null);
      try {
        
        const data = await sendEncryptedData("sense/dashboard/data/get", { residentId: selectedResident, date: selectedDate });

        console.log("Fetched data:", data);
        if (!data) throw new Error(`API Error: ${data.status}`);
        const parsedTimeline = data.timelineData.map((row: any) => ({
          ...row,
          segments: row.segments.map((s: any) => ({
            ...s,
            startTime: new Date(s.startTime),
            endTime: new Date(s.endTime),
          })),
        }));

        const parsedDaily = data.dailySummary.map((d: any) => ({
          ...d,
          icon: iconMap[d.icon] || Clock,
        }));

        setTimelineData(parsedTimeline);
        setActivityData(data.activityData);
        setDailySummary(parsedDaily);
        setWeeklyTrend(data.weeklyTrend);
      } catch (err: any) {
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-[60vh] items-center justify-center text-lg text-muted-foreground">
          Loading Sense dashboard...
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex h-[60vh] items-center justify-center text-red-500">
          Error: {error}
        </div>
      </DashboardLayout>
    );
  }

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
          {dailySummary.map((item, i) => {
            const Icon = item.icon;
            return (
              <Card key={i}>
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
              <TooltipProvider>
                <div className="space-y-1">
                  {timelineData.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex items-center gap-3">
                      <div className="w-32 text-sm font-medium text-muted-foreground flex-shrink-0">
                        {row.name}
                      </div>
                      <div className="relative h-8 flex-1 rounded border bg-muted/20">
                        {row.segments.map((segment: any, segIndex: number) => {
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
                                      <p className="text-xs text-muted-foreground">{formatTime(segment.startTime)}</p>
                                      <p className="text-xs text-muted-foreground">{formatTime(segment.endTime)}</p>
                                      <p className="text-xs font-medium">Level: {segment.level}</p>
                                      <p className="text-xs font-medium">Duration: {formatDuration(segment.startTime, segment.endTime)}</p>
                                    </>
                                  ) : (
                                    <>
                                      <p className="text-xs text-muted-foreground">{formatTime(segment.startTime)}</p>
                                      <p className="text-xs text-muted-foreground">
                                        {getStatusLabel(segment.status)} - {formatTime(segment.endTime)}
                                      </p>
                                      <p className="text-xs font-medium">Duration: {formatDuration(segment.startTime, segment.endTime)}</p>
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
                {dailySummary.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: item.color }} />
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
