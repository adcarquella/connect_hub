import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Phone, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  User, 
  Activity,
  Bed,
  Armchair,
  Home,
  Heart,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data for active calls
const activeCalls = [
  {
    id: 1,
    type: "Emergency Call",
    resident: "Mrs. Johnson",
    room: "124A",
    location: "Bathroom",
    priority: "high",
    duration: "2:15",
    status: "active",
    timestamp: new Date(Date.now() - 2 * 60 * 1000)
  },
  {
    id: 2,
    type: "Nurse Call",
    resident: "Mr. Williams", 
    room: "108B",
    location: "Bedside",
    priority: "medium",
    duration: "5:32",
    status: "pending",
    timestamp: new Date(Date.now() - 5 * 60 * 1000)
  },
  {
    id: 3,
    type: "Bathroom Assist",
    resident: "Ms. Davis",
    room: "203C", 
    location: "Bed",
    priority: "low",
    duration: "8:45",
    status: "assigned",
    timestamp: new Date(Date.now() - 8 * 60 * 1000)
  }
];

// Mock data for device status
const deviceStatuses = [
  {
    id: 1,
    resident: "Mrs. Johnson",
    room: "124A",
    status: "fall_detected",
    location: "bathroom",
    lastUpdate: new Date(Date.now() - 1 * 60 * 1000),
    batteryLevel: 85
  },
  {
    id: 2,
    resident: "Mr. Williams",
    room: "108B", 
    status: "in_bed",
    location: "bedroom",
    lastUpdate: new Date(Date.now() - 3 * 60 * 1000),
    batteryLevel: 92
  },
  {
    id: 3,
    resident: "Ms. Davis",
    room: "203C",
    status: "in_chair",
    location: "living_area", 
    lastUpdate: new Date(Date.now() - 2 * 60 * 1000),
    batteryLevel: 76
  },
  {
    id: 4,
    resident: "Mr. Thompson",
    room: "156D",
    status: "fall_risk",
    location: "bathroom",
    lastUpdate: new Date(Date.now() - 4 * 60 * 1000),
    batteryLevel: 68
  },
  {
    id: 5,
    resident: "Mrs. Anderson",
    room: "189E",
    status: "in_room",
    location: "bedroom",
    lastUpdate: new Date(Date.now() - 1 * 60 * 1000),
    batteryLevel: 94
  }
];

// Mock floor plan rooms
const floorPlanRooms = [
  { id: "124A", name: "Mrs. Johnson", x: 50, y: 100, width: 80, height: 60, status: "emergency", type: "bedroom" },
  { id: "108B", name: "Mr. Williams", x: 200, y: 100, width: 80, height: 60, status: "call", type: "bedroom" },
  { id: "203C", name: "Ms. Davis", x: 350, y: 100, width: 80, height: 60, status: "normal", type: "bedroom" },
  { id: "156D", name: "Mr. Thompson", x: 50, y: 200, width: 80, height: 60, status: "warning", type: "bedroom" },
  { id: "189E", name: "Mrs. Anderson", x: 200, y: 200, width: 80, height: 60, status: "normal", type: "bedroom" },
  { id: "NURSE", name: "Nurses Station", x: 350, y: 200, width: 80, height: 60, status: "active", type: "station" },
  { id: "COMMON", name: "Common Area", x: 125, y: 300, width: 200, height: 80, status: "normal", type: "common" }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "in_bed":
      return <Bed className="h-4 w-4" />;
    case "in_chair":
      return <Armchair className="h-4 w-4" />;
    case "in_room":
      return <Home className="h-4 w-4" />;
    case "fall_risk":
      return <AlertTriangle className="h-4 w-4 text-orange-500" />;
    case "fall_detected":
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    default:
      return <Activity className="h-4 w-4" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "fall_detected":
    case "emergency":
      return "bg-red-500";
    case "fall_risk":
    case "warning":
      return "bg-orange-500"; 
    case "call":
      return "bg-blue-500";
    case "active":
      return "bg-green-500";
    default:
      return "bg-gray-400";
  }
};

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case "high":
      return <Badge variant="destructive">High</Badge>;
    case "medium":
      return <Badge variant="default">Medium</Badge>;
    case "low":
      return <Badge variant="secondary">Low</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return <Badge variant="destructive">Active</Badge>;
    case "pending":
      return <Badge variant="default">Pending</Badge>;
    case "assigned":
      return <Badge variant="secondary">Assigned</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

export const LiveCalls = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDuration = (timestamp: Date) => {
    const diff = Math.floor((currentTime.getTime() - timestamp.getTime()) / 1000);
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Live Call Monitor</h1>
            <p className="text-muted-foreground">
              Real-time monitoring of active calls and resident status
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Last updated: {currentTime.toLocaleTimeString()}</span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                  <Phone className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{activeCalls.length}</p>
                  <p className="text-sm text-muted-foreground">Active Calls</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {deviceStatuses.filter(d => d.status === "fall_risk" || d.status === "fall_detected").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Fall Alerts</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{deviceStatuses.length}</p>
                  <p className="text-sm text-muted-foreground">Monitored Residents</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <Activity className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {Math.round(deviceStatuses.reduce((acc, d) => acc + d.batteryLevel, 0) / deviceStatuses.length)}%
                  </p>
                  <p className="text-sm text-muted-foreground">Avg Battery</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Calls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Active Calls
              </CardTitle>
              <CardDescription>Calls currently requiring attention</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeCalls.map((call) => (
                <div key={call.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{call.resident}</span>
                      {getPriorityBadge(call.priority)}
                      {getStatusBadge(call.status)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {call.room} - {call.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDuration(call.timestamp)}
                      </span>
                    </div>
                    <div className="text-sm font-medium">{call.type}</div>
                  </div>
                  <Button size="sm" variant={call.priority === "high" ? "destructive" : "default"}>
                    Respond
                  </Button>
                </div>
              ))}
              {activeCalls.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No active calls at this time
                </div>
              )}
            </CardContent>
          </Card>

          {/* Device Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Device Status
              </CardTitle>
              <CardDescription>Current status of all monitoring devices</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {deviceStatuses.map((device) => (
                <div key={device.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(device.status)}
                    <div>
                      <div className="font-medium">{device.resident}</div>
                      <div className="text-sm text-muted-foreground">{device.room}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium capitalize">
                      {device.status.replace('_', ' ')}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Zap className="h-3 w-3" />
                      {device.batteryLevel}%
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Floor Plan */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Live Floor Plan
            </CardTitle>
            <CardDescription>Real-time view of facility layout and room statuses</CardDescription>
          </CardHeader>
          <CardContent>
             <iframe 
                title="MoveLiveView" 
                id="iiwariframe" 
                src="https://app.iiwari.cloud/arquella/map/018c6d7d-1963-f4b1-db9d-9640263c65a2?token=c7G7EEDQV0HzNHDTgSgRD9awXx4zX5HrxpyUqKWr7coO3xoI9v3N5LpefXgHU10QaGovZhWAJgqAdysDBr&amp;touch=1" 
                style={{height: "80vh", width: "1200px"}}
                //style="margin-left: 2.5%; margin-top: 10px; align-self: center; height: 80vh; width: 1200px; margin-right: 10px;"
                ></iframe>

          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};