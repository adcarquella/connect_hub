import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useSiteWebSocket, SiteMessage, CallData } from "../hooks/useSiteWebSocket";
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
import { SiteFeed } from "@/components/SiteFeed";



// Mock data for device status
const deviceStatuses = [
  {
    id: 1,
    resident: "Mrs. Johnson",
    room: "124A",
    status: "fall_detected",
    location: "bathroom",
    lastUpdate: new Date(Date.now() - 1 * 60 * 1000),
    batteryLevel: 85,
    lightLevel: 25
  },
  {
    id: 2,
    resident: "Mr. Williams",
    room: "108B",
    status: "in_bed",
    location: "bedroom",
    lastUpdate: new Date(Date.now() - 3 * 60 * 1000),
    batteryLevel: 92,
    lightLevel: 25
  },
  {
    id: 3,
    resident: "Ms. Davis",
    room: "203C",
    status: "in_chair",
    location: "living_area",
    lastUpdate: new Date(Date.now() - 2 * 60 * 1000),
    batteryLevel: 76,
    lightLevel: 25
  },
  {
    id: 4,
    resident: "Mr. Thompson",
    room: "156D",
    status: "fall_risk",
    location: "bathroom",
    lastUpdate: new Date(Date.now() - 4 * 60 * 1000),
    batteryLevel: 68,
    lightLevel: 25
  },
  {
    id: 5,
    resident: "Mrs. Anderson",
    room: "189E",
    status: "in_room",
    location: "bedroom",
    lastUpdate: new Date(Date.now() - 1 * 60 * 1000),
    batteryLevel: 94,
    lightLevel: 25
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

const getCallTypeBadge = (status: string) => {
  switch (status) {
    case "Attendance":
      return <Badge variant="attendance">{status}</Badge>;
    case "call":
      return <Badge variant="call">Pending</Badge>;
    case "emergency":
      return <Badge variant="emergency">Assigned</Badge>;
    case "accessory":
      return <Badge variant="accessory">Active</Badge>;
    case "sense":
      return <Badge variant="sense">Pending</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};







export const LiveCalls = () => {

  const [currentTime, setCurrentTime] = useState(new Date());
  const [username, setUsername] = useState<string>("alice");
  const [sitecode, setSitecode] = useState<string>("sensetest");
  const { messages } = useSiteWebSocket(username, sitecode);
  const [activeCalls, setActiveCalls] = useState<ActiveCall[]>([]);


  function normalizeCall(id: string, call: CallData): ActiveCall {
    return {
      id,
      callType: call.callType,
      room: call.room,
      zone: call.zone,
      start: new Date(call.start),
      priority: "high", // TODO: derive properly
    };
  }


  useEffect(() => {
    console.log(messages);
    if (messages.length === 0) return;

    const raw = messages.at(-1);
    if (!raw) return;

    let latestMessage: SiteMessage;
    try {
      latestMessage = raw as SiteMessage; // ✅ raw is string
    } catch (e) {
      console.error("Invalid WebSocket payload", e);
      return;
    }

    if (!latestMessage.update?.liveCalls) return;

    const arr: ActiveCall[] = Object.entries(latestMessage.update.liveCalls)
      .map(([id, call]) => normalizeCall(id, call));

    setActiveCalls(arr);
  }, [messages]);

  const formatDuration = (timestamp: Date) => {
    try {
      const diff = Math.floor((currentTime.getTime() - timestamp.getTime()) / 1000);
      const minutes = Math.floor(diff / 60);
      const seconds = diff % 60;
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    catch (e) {
      return `00:00}`;
    }

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
            <CardContent className="space-y-3">
              {activeCalls.map((call) => {
                const colors = getCallTypeColors(call.callType);
                return (
                  <div 
                    key={call.id} 
                    className="relative overflow-hidden rounded-xl flex items-center gap-0 bg-white dark:bg-gray-800"
                  >
                    {/* Vertical Room Label */}
                    <div 
                      className="w-12 h-24 flex items-center justify-center text-white font-semibold text-xs"
                      style={{
                        background: getCallTypeGradient(call.callType),
                        writingMode: 'vertical-rl',
                        textOrientation: 'mixed'
                      }}
                    >
                      {call.room}
                    </div>

                    {/* Circular Progress Indicator */}
                    <div className="relative w-20 h-24 flex items-center justify-center">
                      <svg className="w-16 h-16 transform -rotate-90">
                        {/* Background circle */}
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          stroke="currentColor"
                          strokeWidth="3"
                          fill="none"
                          className="text-gray-200 dark:text-gray-700"
                        />
                        {/* Progress circle */}
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          stroke={`url(#gradient-call-${call.id})`}
                          strokeWidth="3"
                          fill="none"
                          strokeDasharray={`${(call.lightLevel / 100) * 176} 176`}
                          strokeLinecap="round"
                        />
                        <defs>
                          <linearGradient id={`gradient-call-${call.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style={{ stopColor: colors.start }} />
                            <stop offset="100%" style={{ stopColor: colors.end }} />
                          </linearGradient>
                        </defs>
                      </svg>
                      {/* Icon in center */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Phone className="h-5 w-5 text-foreground" />
                      </div>
                    </div>

                    {/* Status Section */}
                    <div className="flex-1 py-3">
                      <div className="text-xs text-muted-foreground mb-1">Status</div>
                      <div className="text-xl font-bold" style={{
                        background: getCallTypeGradient(call.callType),
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                      }}>
                        {call.room}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">{call.zone}</div>
                    </div>

                    {/* Duration Section */}
                    <div className="px-4 py-3 text-right">
                      <div className="text-xs text-muted-foreground mb-1">Duration</div>
                      <div className="text-lg font-semibold text-foreground">
                        {formatDuration(call.start)}
                      </div>
                    </div>
                  </div>
                );
              })}
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
            <CardContent className="space-y-3">
              {deviceStatuses.map((device) => (
                <div 
                  key={device.id} 
                  className="relative overflow-hidden rounded-xl flex items-center gap-0 bg-white dark:bg-gray-800"
                >
                  {/* Vertical Room Label */}
                  <div 
                    className="w-12 h-24 flex items-center justify-center text-white font-semibold text-xs"
                    style={{
                      background: getLightGradient(device.lightLevel),
                      writingMode: 'vertical-rl',
                      textOrientation: 'mixed'
                    }}
                  >
                    {device.room}
                  </div>

                  {/* Circular Progress Indicator */}
                  <div className="relative w-20 h-24 flex items-center justify-center">
                    <svg className="w-16 h-16 transform -rotate-90">
                      {/* Background circle */}
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="none"
                        className="text-gray-200 dark:text-gray-700"
                      />
                      {/* Progress circle */}
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="url(#gradient-device-${device.id})"
                        strokeWidth="3"
                        fill="none"
                        strokeDasharray={`${(device.lightLevel / 100) * 176} 176`}
                        strokeLinecap="round"
                      />
                      <defs>
                        <linearGradient id={`gradient-device-${device.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" style={{ stopColor: device.lightLevel <= 40 ? '#0C5A6B' : device.lightLevel <= 60 ? '#2A739C' : device.lightLevel <= 80 ? '#7ACAE2' : '#7CC43A' }} />
                          <stop offset="100%" style={{ stopColor: device.lightLevel <= 40 ? '#2A739C' : device.lightLevel <= 60 ? '#7ACAE2' : device.lightLevel <= 80 ? '#7CC43A' : '#A3D866' }} />
                        </linearGradient>
                      </defs>
                    </svg>
                    {/* Icon in center */}
                    <div className="absolute inset-0 flex items-center justify-center text-foreground">
                      {getStatusIcon(device.status)}
                    </div>
                  </div>

                  {/* Status Section */}
                  <div className="flex-1 py-3">
                    <div className="text-xs text-muted-foreground mb-1">Status</div>
                    <div className="text-xl font-bold capitalize" style={{
                      background: getLightGradient(device.lightLevel),
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}>
                      {device.status.replace('_', ' ')}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{device.resident}</div>
                  </div>

                  {/* Battery/Duration Section */}
                  <div className="px-4 py-3 text-right">
                    <div className="text-xs text-muted-foreground mb-1">Battery</div>
                    <div className="text-lg font-semibold text-foreground flex items-center gap-1 justify-end">
                      <Zap className="h-4 w-4" />
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
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
                                             <iframe 
                title="MoveLiveView" 
                id="iiwariframe" 
                src="https://app.iiwari.cloud/arquella/map/018c6d7d-1963-f4b1-db9d-9640263c65a2?token=c7G7EEDQV0HzNHDTgSgRD9awXx4zX5HrxpyUqKWr7coO3xoI9v3N5LpefXgHU10QaGovZhWAJgqAdysDBr&amp;touch=1" 
                style={{height: "80vh", width: "1200px"}}
                //style="margin-left: 2.5%; margin-top: 10px; align-self: center; height: 80vh; width: 1200px; margin-right: 10px;"
                ></iframe>
              

            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};




// Frontend shape (normalized)
type ActiveCall = {
  id: string | number;
  callType: string;
  room: string;
  zone?: string;
  priority?: "high" | "medium" | "low";
  start: Date;
  lightLevel?:number
};


// Get solid colors for SVG gradients based on call type
const getCallTypeColors = (type: string) => {
  switch (type) {
    case "emergency":
      return { start: '#c93838', end: '#e66060' };
    case "call":
      return { start: '#f5814e', end: '#f9a67a' };
    case "sense":
      return { start: '#914397', end: '#b366b8' };
    case "attendance":
      return { start: '#94ca66', end: '#b3d98a' };
    case "accessory":
      return { start: '#914397', end: '#b366b8' };
    case "assistance":
      return { start: '#f8da3c', end: '#fae870' };
    case "carecall":
      return { start: '#e11583', end: '#ee4ca3' };
    case "visit":
      return { start: '#01573e', end: '#028060' };
    case "all":
      return { start: '#4cc1bd', end: '#72d1ce' };
    default:
      return { start: '#2A739C', end: '#7ACAE2' };
  }
};

// Generate gradient based on light level (1-100) for device status
const getLightGradient = (lightLevel: number) => {
  // Arquella brand colors in HSL
  const darkTeal = '191 80% 23%';     // #0C5A6B
  const darkerBlue = '200 57% 39%';   // #2A739C
  const primaryGreen = '88 55% 50%';  // #7CC43A
  const lighterBlue = '196 67% 68%';  // #7ACAE2
  const lighterGreen = '85 59% 63%';  // #A3D866

  // Map light level to gradient
  if (lightLevel <= 20) {
    // Very dark: Dark teal to darker blue
    return `linear-gradient(135deg, hsl(${darkTeal}) 0%, hsl(${darkerBlue}) 100%)`;
  } else if (lightLevel <= 40) {
    // Dark: Darker blue to dark teal
    return `linear-gradient(135deg, hsl(${darkerBlue}) 0%, hsl(${darkTeal}) 100%)`;
  } else if (lightLevel <= 60) {
    // Medium: Darker blue to lighter blue
    return `linear-gradient(135deg, hsl(${darkerBlue}) 0%, hsl(${lighterBlue}) 100%)`;
  } else if (lightLevel <= 80) {
    // Bright: Lighter blue to primary green
    return `linear-gradient(135deg, hsl(${lighterBlue}) 0%, hsl(${primaryGreen}) 100%)`;
  } else {
    // Very bright: Primary green to lighter green
    return `linear-gradient(135deg, hsl(${primaryGreen}) 0%, hsl(${lighterGreen}) 100%)`;
  }
};


// Generate gradient based on call type
const getCallTypeGradient = (type: string) => {
  switch (type) {
    case "emergency":
      return 'linear-gradient(135deg, hsl(0 84% 45%) 0%, hsl(0 84% 60%) 100%)'; // red
    case "call":
      return 'linear-gradient(135deg, hsl(20 90% 63%) 0%, hsl(20 90% 75%) 100%)'; // orange
    case "sense":
      return 'linear-gradient(135deg, hsl(290 42% 40%) 0%, hsl(290 42% 55%) 100%)'; // purple
    case "attendance":
      return 'linear-gradient(135deg, hsl(88 47% 59%) 0%, hsl(88 47% 70%) 100%)'; // green
    case "accessory":
      return 'linear-gradient(135deg, hsl(290 42% 40%) 0%, hsl(290 42% 55%) 100%)'; // purple
    case "assistance":
      return 'linear-gradient(135deg, hsl(48 94% 60%) 0%, hsl(48 94% 75%) 100%)'; // yellow
    case "carecall":
      return 'linear-gradient(135deg, hsl(326 83% 48%) 0%, hsl(326 83% 63%) 100%)'; // pink
    case "visit":
      return 'linear-gradient(135deg, hsl(162 98% 17%) 0%, hsl(162 98% 30%) 100%)'; // dark green
    case "all":
      return 'linear-gradient(135deg, hsl(178 51% 52%) 0%, hsl(178 51% 65%) 100%)'; // teal
    default:
      return 'linear-gradient(135deg, hsl(200 57% 39%) 0%, hsl(196 67% 68%) 100%)'; // default blue
  }
};