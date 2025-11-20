import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Monitor, Smartphone, UserPlus, X } from "lucide-react";
import { toast } from "sonner";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useSiteWebSocket, SiteMessage, CallData, DeviceStatus } from "../hooks/useSiteWebSocket";
import CallData from "./CallData";


interface Room {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: "bedroom" | "ensuite" | "common";
}

interface Carer {
  id: string;
  name: string;
  x: number;
  y: number;
  color: string;
}

const ROOMS: Room[] = [
  { id: "r1", name: "Bedroom 1", x: 50, y: 50, width: 140, height: 160, type: "bedroom" },
  { id: "r2", name: "En Suite 1", x: 50, y: 220, width: 140, height: 80, type: "ensuite" },
  { id: "r3", name: "Bedroom 6", x: 200, y: 50, width: 130, height: 80, type: "bedroom" },
  { id: "r4", name: "Mobile 1", x: 50, y: 310, width: 140, height: 90, type: "common" },
  { id: "r5", name: "Bedroom 2", x: 50, y: 410, width: 130, height: 90, type: "bedroom" },
  { id: "r6", name: "En Suite 2", x: 190, y: 410, width: 100, height: 90, type: "ensuite" },
];

export const Demo = () => {
  const [carers, setCarers] = useState<Carer[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newCarerName, setNewCarerName] = useState("");
  const [draggedCarer, setDraggedCarer] = useState<Carer | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [messageDialog, setMessageDialog] = useState<{
    show: boolean;
    carer: string;
    room: string;
  }>({ show: false, carer: "", room: "" });
  const [liveCalls, setLiveCalls] = useState<Record<string, CallData>>(null);

    const [username, setUsername] = useState<string>("alice");
    const [sitecode, setSitecode] = useState<string>("sensetest");
 
    const { messages } = useSiteWebSocket(username, sitecode);


  const handleCreateCarer = () => {
    if (!newCarerName.trim()) return;
    
    const colors = ["#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899"];
    const newCarer: Carer = {
      id: `c${Date.now()}`,
      name: newCarerName,
      x: 20,
      y: 20,
      color: colors[carers.length % colors.length],
    };
    
    setCarers([...carers, newCarer]);
    setNewCarerName("");
    setShowCreateDialog(false);
    toast.success(`Carer "${newCarerName}" created`);
  };

  const handleCarerMouseDown = (carer: Carer) => {
    setDraggedCarer(carer);
    setIsDragging(true);
  };

  const handleSvgMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!isDragging || !draggedCarer) return;

    const svg = event.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Update carer position
    setCarers(
      carers.map((c) =>
        c.id === draggedCarer.id ? { ...c, x: Math.max(0, x - 15), y: Math.max(0, y - 15) } : c
      )
    );
  };

  const handleSvgMouseUp = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!isDragging || !draggedCarer) return;

    const svg = event.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Check if dropped on a room
    const droppedRoom = ROOMS.find(
      (room) =>
        x >= room.x &&
        x <= room.x + room.width &&
        y >= room.y &&
        y <= room.y + room.height
    );

    if (droppedRoom) {
        alert("Raise call")
    //   setMessageDialog({
    //     show: true,
    //     carer: draggedCarer.name,
    //     room: droppedRoom.name,
    //   });
    }

    setIsDragging(false);
    setDraggedCarer(null);
  };

  const handleRemoveCarer = (id: string) => {
    const carer = carers.find((c) => c.id === id);
    setCarers(carers.filter((c) => c.id !== id));
    toast.info(`Carer "${carer?.name}" removed`);
  };

  const getRoomColor = (type: string) => {
    if (type === "ensuite") return "hsl(var(--primary) / 0.2)";
    if (type === "common") return "hsl(var(--accent))";
    return "hsl(var(--muted))";
  };

  useEffect(()=>{
    let listMessages = messages.reverse();

    listMessages = listMessages.filter(l=>((l.sitecode)));

    if (listMessages.length > 0){
        const calls = listMessages[0].update.liveCalls;
        setLiveCalls(calls);
    }
    

    console.log(listMessages);

  }, [messages])


  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Site Demo</h1>
            <p className="text-muted-foreground">
              Interactive floor plan with drag and drop carer management
            </p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
            <UserPlus className="w-4 h-4" />
            Add Carer
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - Device Displays */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="border-primary/20 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b">
                <div className="flex items-center gap-2">
                  <Monitor className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">Team Display</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <PanelDisplay calls={liveCalls} />
              </CardContent>
            </Card>

            <Card className="border-primary/20 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">Mobile Handset</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <MobileDisplay calls={liveCalls} />
              </CardContent>
            </Card>

            {/* Active Carers List */}
            {carers.length > 0 && (
              <Card className="border-primary/20 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b">
                  <CardTitle className="text-lg">Active Carers</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    {carers.map((carer) => (
                      <div
                        key={carer.id}
                        className="flex items-center justify-between p-2 bg-muted/50 rounded-md"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: carer.color }}
                          />
                          <span className="text-sm font-medium">{carer.name}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveCarer(carer.id)}
                          className="h-6 w-6 p-0"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Floor Plan */}
          <div className="lg:col-span-3">
            <Card className="border-primary/20 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 border-b">
                <CardTitle>Floor Plan</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Click rooms for details • Drag and drop carers to assign locations
                </p>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="bg-background border-2 border-border rounded-lg p-4 overflow-auto">
                  <svg
                    id="floor-plan"
                    viewBox="0 0 600 550"
                    className="w-full h-auto"
                    style={{ minHeight: "500px" }}
                    onMouseMove={handleSvgMouseMove}
                    onMouseUp={handleSvgMouseUp}
                    onMouseLeave={handleSvgMouseUp}
                  >
                    {/* Room rectangles */}
                    {ROOMS.map((room) => (
                      <g key={room.id}>
                        <rect
                          x={room.x}
                          y={room.y}
                          width={room.width}
                          height={room.height}
                          fill={getRoomColor(room.type)}
                          stroke="hsl(var(--border))"
                          strokeWidth="2"
                          className="cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => {
                            toast.info(`Room: ${room.name}`, {
                              description: `Type: ${room.type}`,
                            });
                          }}
                        />
                        <text
                          x={room.x + room.width / 2}
                          y={room.y + room.height / 2}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="text-sm font-medium pointer-events-none"
                          fill="hsl(var(--foreground))"
                        >
                          {room.name}
                        </text>
                      </g>
                    ))}

                    {/* Carer markers */}
                    {carers.map((carer) => (
                      <g
                        key={carer.id}
                        transform={`translate(${carer.x}, ${carer.y})`}
                        className="cursor-move"
                        onMouseDown={() => handleCarerMouseDown(carer)}
                        style={{ cursor: isDragging && draggedCarer?.id === carer.id ? 'grabbing' : 'grab' }}
                      >
                        <circle
                          cx={15}
                          cy={15}
                          r={15}
                          fill={carer.color}
                          stroke="white"
                          strokeWidth="3"
                          className="drop-shadow-lg"
                        />
                        <text
                          x={15}
                          y={15}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="text-xs font-bold pointer-events-none"
                          fill="white"
                        >
                          {carer.name.substring(0, 2).toUpperCase()}
                        </text>
                      </g>
                    ))}
                  </svg>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Create Carer Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Carer</DialogTitle>
            <DialogDescription>
              Add a new carer to the floor plan. You can drag and drop them to assign locations.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="carer-name">Carer Name</Label>
              <Input
                id="carer-name"
                placeholder="Enter carer name"
                value={newCarerName}
                onChange={(e) => setNewCarerName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreateCarer()}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateCarer} disabled={!newCarerName.trim()}>
              Create Carer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Room Assignment Message Dialog */}
      <Dialog open={messageDialog.show} onOpenChange={(open) => setMessageDialog({ ...messageDialog, show: open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Carer Assigned to Room</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-foreground">
              <span className="font-semibold">{messageDialog.carer}</span> has been assigned to{" "}
              <span className="font-semibold text-primary">{messageDialog.room}</span>
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              The system has recorded this assignment and will track the carer's location.
            </p>
          </div>
          <DialogFooter>
            <Button onClick={() => setMessageDialog({ ...messageDialog, show: false })}>
              Acknowledge
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};


const PanelDisplay =({calls})=>{
    console.log("panelDisplay", calls);
    if ((calls!==null) && (Object.keys(calls).length>0)) {

        return (
            <div>

                {
                    Object.values(calls).map(call=>{
                        console.log(call);
                        return(
                            <div>
                                {call.callType}
                            </div>
                        )
                    })
                }                

            </div>
        );

    }

    return (
        <div className="flex items-center justify-center h-32 bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/20">
                  <div className="text-center">
                    <p className="text-4xl font-light text-muted-foreground/60">arquella</p>
                    <p className="text-xs text-muted-foreground mt-1">Display Screen</p>
                  </div>
                </div>
    );
}

const MobileDisplay=({calls})=>{

        console.log("panelDisplay", calls);
    if ((calls!==null) && (Object.keys(calls).length>0)) {

        return (
            <div>

                {
                    Object.values(calls).map(call=>{
                        console.log(call);
                        return(
                            <div>
                                {call.callType}
                            </div>
                        )
                    })
                }                

            </div>
        );

    }

    return (
        <div className="flex items-center justify-center h-48 bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/20">
                  <div className="text-center">
                    <p className="text-3xl font-light text-muted-foreground/60">arquella</p>
                    <p className="text-xs text-muted-foreground mt-1">Mobile Device</p>
                  </div>
        </div>
    )
}