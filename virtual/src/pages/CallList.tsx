import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, Edit, Eye } from "lucide-react";
import { EditCallDialog } from "@/components/calls/EditCallDialog";

// Extended call data with more details for editing
const callListData = [
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
    unit: "Room Unit",
    residentName: "John Smith",
    staffMember: "Sarah Johnson",
    resultedInInjury: false,
    comments: "",
    quickActions: []
  },
  {
    id: 2,
    type: "Room unit",
    subType: "Call",
    location: "BEDROOM 17",
    category: "THORPE",
    status: "completed",
    startTime: "11/09/2025 00:47:24",
    endTime: "11/09/2025 00:47:39", 
    duration: "00:00:15",
    unit: "Room Unit",
    residentName: "Mary Wilson",
    staffMember: "Mike Davis",
    resultedInInjury: false,
    comments: "Resident needed assistance to bathroom",
    quickActions: ["continence"]
  },
  {
    id: 3,
    type: "Sense",
    subType: "Fall Alert",
    location: "BEDROOM 12",
    category: "CLEE",
    status: "warning", 
    startTime: "11/09/2025 00:46:15",
    endTime: "11/09/2025 00:46:24",
    duration: "00:00:09",
    unit: "Room Unit",
    residentName: "Robert Brown",
    staffMember: "Lisa Chen",
    resultedInInjury: true,
    comments: "Minor fall, resident checked by nurse. Small bruise on arm.",
    quickActions: ["personal-care", "moving-handling"]
  }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return <Badge className="bg-primary text-primary-foreground">Active</Badge>;
    case "warning":
      return <Badge className="bg-destructive text-destructive-foreground">Warning</Badge>;
    case "completed":
      return <Badge className="bg-emerald-500 text-white">Completed</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

const CallList = () => {
  const [selectedCall, setSelectedCall] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [callData, setCallData] = useState(callListData);

  const handleEditCall = (call: any) => {
    setSelectedCall(call);
    setIsEditDialogOpen(true);
  };

  const handleSaveCall = (updatedCall: any) => {
    setCallData(prev => prev.map(call => 
      call.id === updatedCall.id ? updatedCall : call
    ));
    setIsEditDialogOpen(false);
    setSelectedCall(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Call Management</h1>
            <p className="text-muted-foreground">
              View and edit call records with detailed information
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-primary" />
            <span className="text-sm text-muted-foreground">
              {callData.length} total calls
            </span>
          </div>
        </div>

        <Card className="glass-panel">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-primary" />
              Call Records
            </CardTitle>
            <CardDescription>
              Manage call details, add notes, and track outcomes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Resident</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Staff</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Injury</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {callData.map((call) => (
                    <TableRow key={call.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{call.residentName}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{call.type}</div>
                          <div className="text-xs text-muted-foreground">{call.subType}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{call.location}</TableCell>
                      <TableCell>{getStatusBadge(call.status)}</TableCell>
                      <TableCell className="text-sm">{call.staffMember}</TableCell>
                      <TableCell className="font-mono text-sm font-medium">
                        {call.duration}
                      </TableCell>
                      <TableCell>
                        {call.resultedInInjury ? (
                          <Badge variant="destructive" className="text-xs">Injury</Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">No Injury</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditCall(call)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <EditCallDialog
          call={selectedCall}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSave={handleSaveCall}
        />
      </div>
    </DashboardLayout>
  );
};

export default CallList;