import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from "recharts";
import { 
  TrendingUp, 
  Clock, 
  Calendar, 
  AlertTriangle,
  Phone,
  Timer,
  Activity
} from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";

// Mock data based on the screenshots
const durationBreakdown = [
  { duration: "0-3 mins", calls: 1202, percentage: "73.16%" },
  { duration: "3-5 mins", calls: 166, percentage: "10.10%" },
  { duration: "5-10 mins", calls: 174, percentage: "10.59%" },
  { duration: "greater than 10 mins", calls: 101, percentage: "6.15%" }
];

const callsByDay = [
  { day: "2025-09-11", calls: 120 },
  { day: "2025-09-10", calls: 240 },
  { day: "2025-09-09", calls: 280 },
  { day: "2025-09-08", calls: 190 },
  { day: "2025-09-07", calls: 180 },
  { day: "2025-09-06", calls: 170 },
  { day: "2025-09-05", calls: 220 },
  { day: "2025-09-04", calls: 290 },
  { day: "2025-09-03", calls: 250 }
];

const emergencyResponseTimes = [
  { date: "09-11", time: 0.5 },
  { date: "09-10", time: 0.4 },
  { date: "09-09", time: 0.52 },
  { date: "09-08", time: 0.48 },
  { date: "09-07", time: 0.35 },
  { date: "09-06", time: 0.45 },
  { date: "09-05", time: 0.6 },
  { date: "09-04", time: 0.55 }
];

const callsByRoom = [
  { room: "BEDROOM 5", calls: 95 },
  { room: "BEDROOM 17", calls: 87 },
  { room: "BEDROOM 12", calls: 210 },
  { room: "BEDROOM 24", calls: 45 },
  { room: "BEDROOM 10", calls: 67 },
  { room: "BEDROOM 4", calls: 78 },
  { room: "BEDROOM 8", calls: 56 },
  { room: "BEDROOM 15", calls: 89 },
  { room: "BEDROOM 3", calls: 34 },
  { room: "BEDROOM 7", calls: 112 }
];

const callsAllData = [
  { name: "Call", value: 65, color: "#f97316" },
  { name: "Sense", value: 25, color: "#a855f7" },
  { name: "Attendance", value: 7, color: "#84cc16" },
  { name: "Assistance", value: 2, color: "#eab308" },
  { name: "Emergency", value: 1, color: "#ef4444" }
];

const callsByOriginData = [
  { name: "Call", value: 55, color: "#f97316" },
  { name: "Emergency", value: 3, color: "#ef4444" },
  { name: "Sense", value: 30, color: "#a855f7" },
  { name: "Assistance", value: 7, color: "#eab308" },
  { name: "Attendance", value: 5, color: "#84cc16" }
];

const proactiveReactiveData = [
  { name: "Reactive", value: 85, color: "#f97316" },
  { name: "Proactive", value: 15, color: "#06b6d4" }
];

const emergencyNonEmergencyData = [
  { name: "Non Emergency", value: 97, color: "#14b8a6" },
  { name: "Emergency", value: 3, color: "#ef4444" }
];

const callsByMonth = [
  { month: "September", call: 900, sense: 600, attendance: 200, assistance: 100, emergency: 43 }
];

const callsByZone = [
  { zone: "CLEE", call: 650, sense: 180, attendance: 120, assistance: 50 },
  { zone: "HAVEN", call: 250, sense: 50, attendance: 30, assistance: 15 },
  { zone: "THORPE", call: 50, sense: 270, attendance: 15, assistance: 8 },
  { zone: "STREET", call: 20, sense: 5, attendance: 3, assistance: 2 }
];

const COLORS = ["#f97316", "#a855f7", "#84cc16", "#eab308", "#ef4444", "#06b6d4", "#14b8a6"];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel p-3 border border-border/50 rounded-lg">
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {`${entry.dataKey}: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const Insights = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Call Insights</h1>
            <p className="text-muted-foreground">
              Comprehensive analytics and insights for call data
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <span className="text-sm text-muted-foreground font-mono">
              2025/09/04 → 2025/09/11
            </span>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Calls"
            value="1643"
            change=""
            changeType="neutral"
            icon={Phone}
            className="col-span-1"
          />
          <MetricCard
            title="Busiest Time of Day"
            value="8am"
            change=""
            changeType="neutral"
            icon={Clock}
            className="col-span-1"
          />
          <MetricCard
            title="Average Initial Response Time"
            value="00:02:28"
            change=""
            changeType="neutral"
            icon={Timer}
            className="col-span-1"
          />
          <MetricCard
            title="Busiest Day"
            value="04 Sep 2025"
            change=""
            changeType="neutral"
            icon={Calendar}
            className="col-span-1"
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Duration Breakdown */}
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle>Duration Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Call Duration</TableHead>
                    <TableHead>Number of Calls</TableHead>
                    <TableHead>Percentage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {durationBreakdown.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{item.duration}</TableCell>
                      <TableCell>{item.calls}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{item.percentage}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* All Calls Pie Chart */}
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle>All Calls</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={callsAllData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                  >
                    {callsAllData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {callsAllData.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Calls by Origin Pie Chart */}
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle>Calls by Origin</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={callsByOriginData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                  >
                    {callsByOriginData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {callsByOriginData.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Proactive vs Reactive */}
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle>Proactive v Reactive</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={proactiveReactiveData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                  >
                    {proactiveReactiveData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 flex justify-center gap-6">
                {proactiveReactiveData.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Emergency vs Non Emergency */}
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle>Emergency V Non Emergency</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={emergencyNonEmergencyData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                  >
                    {emergencyNonEmergencyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 flex justify-center gap-6">
                {emergencyNonEmergencyData.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 3 */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Calls by Day */}
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle>Calls by Day</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={callsByDay}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="day" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickFormatter={(value) => value.split('-')[2]}
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="calls" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Emergency Response Times */}
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Emergency Average Response Times
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={emergencyResponseTimes}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12}
                    domain={[0, 1]}
                  />
                  <Tooltip 
                    content={<CustomTooltip />}
                    formatter={(value: any) => [`${value} min`, 'Response Time']}
                  />
                  <Bar dataKey="time" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Calls by Room */}
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle>Calls by Room</CardTitle>
            <CardDescription>Call distribution across different rooms</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={callsByRoom} margin={{ bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="room" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="calls" fill="#a855f7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bottom Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Calls by Month */}
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle>Calls by Month</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={callsByMonth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="call" 
                    stackId="1" 
                    stroke="#f97316" 
                    fill="#f97316" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="sense" 
                    stackId="1" 
                    stroke="#a855f7" 
                    fill="#a855f7" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="attendance" 
                    stackId="1" 
                    stroke="#84cc16" 
                    fill="#84cc16" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="assistance" 
                    stackId="1" 
                    stroke="#eab308" 
                    fill="#eab308" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="emergency" 
                    stackId="1" 
                    stroke="#ef4444" 
                    fill="#ef4444" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Calls by Zone */}
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle>Calls by Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={callsByZone}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="zone" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="call" stackId="a" fill="#f97316" />
                  <Bar dataKey="sense" stackId="a" fill="#a855f7" />
                  <Bar dataKey="attendance" stackId="a" fill="#84cc16" />
                  <Bar dataKey="assistance" stackId="a" fill="#eab308" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Insights;