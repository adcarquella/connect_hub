import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Phone, PhoneCall } from "lucide-react";
import { CallTimeline } from "@/components/timeline/CallTimeline";

// Mock data based on the image structure
const callData = [
  {
    id: 1,
    type: "Sense",
    subType: "Sense",
    location: "BEDROOM 5",
    category: "THORPE",
    status: "active",
    startTime: "11/09/2025 00:48:44",
    endTime: "11/09/2025 00:49:08",
    duration: "00:00:23",
    unit: "Room Unit"
  },
  {
    id: 2,
    type: "Sense",
    subType: "Sense", 
    location: "BEDROOM 17",
    category: "THORPE",
    status: "active",
    startTime: "11/09/2025 00:47:24",
    endTime: "11/09/2025 00:47:39",
    duration: "00:00:15",
    unit: "Room Unit"
  },
  {
    id: 3,
    type: "Sense",
    subType: "Sense",
    location: "BEDROOM 12", 
    category: "CLEE",
    status: "active",
    startTime: "11/09/2025 00:46:15",
    endTime: "11/09/2025 00:46:24",
    duration: "00:00:09",
    unit: "Room Unit"
  },
  {
    id: 4,
    type: "Room unit",
    subType: "Call",
    location: "BEDROOM 24",
    category: "CLEE", 
    status: "warning",
    startTime: "11/09/2025 00:45:16",
    endTime: "11/09/2025 00:46:37",
    duration: "00:01:20",
    unit: "Room Unit"
  },
  {
    id: 5,
    type: "Room unit",
    subType: "Call Attendance",
    location: "BEDROOM 12",
    category: "CLEE",
    status: "completed",
    startTime: "11/09/2025 00:44:43",
    endTime: "11/09/2025 00:46:07", 
    duration: "00:01:16",
    unit: "Room Unit"
  },
  {
    id: 6,
    type: "Sense",
    subType: "Sense",
    location: "BEDROOM 10",
    category: "THORPE",
    status: "active",
    startTime: "11/09/2025 00:43:30",
    endTime: "11/09/2025 00:48:41",
    duration: "00:05:10",
    unit: "Room Unit"
  },
  {
    id: 7,
    type: "Sense", 
    subType: "Sense",
    location: "BEDROOM 12",
    category: "THORPE",
    status: "active",
    startTime: "11/09/2025 00:38:55",
    endTime: "11/09/2025 00:40:21",
    duration: "00:01:26",
    unit: "Room Unit"
  },
  {
    id: 8,
    type: "Sense",
    subType: "Sense", 
    location: "BEDROOM 4",
    category: "CLEE",
    status: "active",
    startTime: "11/09/2025 00:10:26",
    endTime: "11/09/2025 00:10:48",
    duration: "00:00:22",
    unit: "Room Unit"
  }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return <Badge className="bg-primary text-primary-foreground">Active</Badge>;
    case "warning": 
      return <Badge className="bg-warning text-warning-foreground">Warning</Badge>;
    case "completed":
      return <Badge className="bg-success text-success-foreground">Completed</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

const CallData = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Call Data</h1>
            <p className="text-muted-foreground">
              Monitor and manage call data across all units
            </p>
          </div>
          <div className="flex items-center gap-2">
            <PhoneCall className="h-5 w-5 text-primary" />
            <span className="text-sm text-muted-foreground">
              {callData.length} total calls
            </span>
          </div>
        </div>

        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-primary" />
              Recent Call Activity
            </CardTitle>
            <CardDescription>
              Real-time monitoring of room calls and sensor alerts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Type</TableHead>
                    <TableHead>Sub Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Start Time</TableHead>
                    <TableHead>End Time</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Unit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {callData.map((call) => (
                    <TableRow key={call.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{call.type}</TableCell>
                      <TableCell>{call.subType}</TableCell>
                      <TableCell className="font-mono text-sm">{call.location}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {call.category}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(call.status)}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {call.startTime}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {call.endTime}
                      </TableCell>
                      <TableCell className="font-mono text-sm font-medium">
                        {call.duration}
                      </TableCell>
                      <TableCell className="text-sm">{call.unit}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Example Timeline - Group calls by journey/location for demo */}
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle>Call Journey Timeline</CardTitle>
            <CardDescription>
              Example timeline showing related calls grouped by journey ID
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CallTimeline 
              calls={callData.slice(0, 4)} 
              className="mb-4"
            />
            <CallTimeline 
              calls={callData.slice(4, 8)} 
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CallData;