import { useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Settings, Wifi, Thermometer, Shield, Home, Link, Unlink, Eye, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface Device {
  id: string;
  type: "room_unit" | "sensor" | "controller";
  name: string;
  zone: string;
  code: string;
  groupId: string;
  linkedDevices?: string[];
}

interface DeviceGroup {
  id: string;
  name: string;
  devices: Device[];
}

const initialDevices: Device[] = [
  { id: "1", type: "room_unit", name: "Living Room Unit", zone: "Zone A", code: "001", groupId: "group1", linkedDevices: ["2"] },
  { id: "2", type: "sensor", name: "Temperature Sensor 1", zone: "Zone A", code: "002", groupId: "group1", linkedDevices: ["1", "3"] },
  { id: "3", type: "controller", name: "Main Controller", zone: "Zone A", code: "003", groupId: "group1", linkedDevices: ["2"] },
  { id: "4", type: "room_unit", name: "Bedroom Unit", zone: "Zone B", code: "004", groupId: "group2", linkedDevices: ["5"] },
  { id: "5", type: "sensor", name: "Humidity Sensor", zone: "Zone B", code: "005", groupId: "group2", linkedDevices: ["4"] },
  { id: "6", type: "room_unit", name: "Kitchen Unit", zone: "Zone C", code: "006", groupId: "unassigned", linkedDevices: [] },
  { id: "7", type: "sensor", name: "Motion Sensor", zone: "Zone C", code: "007", groupId: "unassigned", linkedDevices: [] },
];

const initialGroups: DeviceGroup[] = [
  { id: "group1", name: "Zone A Devices", devices: [] },
  { id: "group2", name: "Zone B Devices", devices: [] },
  { id: "unassigned", name: "Unassigned Devices", devices: [] },
];

const getDeviceIcon = (type: Device["type"]) => {
  switch (type) {
    case "room_unit":
      return <Home className="h-4 w-4" />;
    case "sensor":
      return <Thermometer className="h-4 w-4" />;
    case "controller":
      return <Shield className="h-4 w-4" />;
  }
};

const getDeviceTypeColor = (type: Device["type"]) => {
  switch (type) {
    case "room_unit":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "sensor":
      return "bg-green-500/20 text-green-400 border-green-500/30";
    case "controller":
      return "bg-purple-500/20 text-purple-400 border-purple-500/30";
  }
};

export default function Devices() {
  const [devices, setDevices] = useState<Device[]>(initialDevices);
  const [groups, setGroups] = useState<DeviceGroup[]>(initialGroups);
  const [newDevice, setNewDevice] = useState<Partial<Device>>({
    type: "room_unit",
    name: "",
    zone: "",
    code: "",
    groupId: "unassigned",
  });
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [linkingMode, setLinkingMode] = useState(false);
  const { toast } = useToast();

  // Organize devices by groups
  const organizedGroups = groups.map(group => ({
    ...group,
    devices: devices.filter(device => device.groupId === group.id),
  }));

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    // Update the device's groupId
    setDevices(prev =>
      prev.map(device =>
        device.id === draggableId
          ? { ...device, groupId: destination.droppableId }
          : device
      )
    );

    toast({
      title: "Device moved",
      description: "Device has been moved to a new group successfully.",
    });
  };

  const addDevice = () => {
    if (!newDevice.name || !newDevice.zone || !newDevice.code) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const device: Device = {
      id: Date.now().toString(),
      type: newDevice.type as Device["type"],
      name: newDevice.name,
      zone: newDevice.zone,
      code: newDevice.code,
      groupId: newDevice.groupId || "unassigned",
      linkedDevices: [],
    };

    setDevices(prev => [...prev, device]);
    setNewDevice({
      type: "room_unit",
      name: "",
      zone: "",
      code: "",
      groupId: "unassigned",
    });

    toast({
      title: "Device added",
      description: "New device has been added successfully.",
    });
  };

  const handleDeviceClick = (deviceId: string) => {
    if (!linkingMode) {
      setSelectedDevice(selectedDevice === deviceId ? null : deviceId);
      return;
    }

    if (selectedDevice && selectedDevice !== deviceId) {
      linkDevices(selectedDevice, deviceId);
      setSelectedDevice(null);
      setLinkingMode(false);
    } else {
      setSelectedDevice(deviceId);
    }
  };

  const linkDevices = (device1Id: string, device2Id: string) => {
    setDevices(prev => prev.map(device => {
      if (device.id === device1Id) {
        const linkedDevices = device.linkedDevices || [];
        if (!linkedDevices.includes(device2Id)) {
          return { ...device, linkedDevices: [...linkedDevices, device2Id] };
        }
      }
      if (device.id === device2Id) {
        const linkedDevices = device.linkedDevices || [];
        if (!linkedDevices.includes(device1Id)) {
          return { ...device, linkedDevices: [...linkedDevices, device1Id] };
        }
      }
      return device;
    }));

    toast({
      title: "Devices linked",
      description: "Devices have been successfully linked together.",
    });
  };

  const unlinkDevice = (deviceId: string, linkedDeviceId: string) => {
    setDevices(prev => prev.map(device => {
      if (device.id === deviceId) {
        return {
          ...device,
          linkedDevices: (device.linkedDevices || []).filter(id => id !== linkedDeviceId)
        };
      }
      if (device.id === linkedDeviceId) {
        return {
          ...device,
          linkedDevices: (device.linkedDevices || []).filter(id => id !== deviceId)
        };
      }
      return device;
    }));

    toast({
      title: "Devices unlinked",
      description: "Devices have been successfully unlinked.",
    });
  };

  const getLinkedDeviceNames = (deviceId: string) => {
    const device = devices.find(d => d.id === deviceId);
    if (!device?.linkedDevices) return [];
    
    return device.linkedDevices.map(linkedId => {
      const linkedDevice = devices.find(d => d.id === linkedId);
      return linkedDevice?.name || "Unknown Device";
    });
  };

  const getAllDeviceLinks = () => {
    const links: Array<{ device1: Device; device2: Device }> = [];
    const processedPairs = new Set<string>();

    devices.forEach(device => {
      if (device.linkedDevices && device.linkedDevices.length > 0) {
        device.linkedDevices.forEach(linkedId => {
          const linkedDevice = devices.find(d => d.id === linkedId);
          if (linkedDevice) {
            const pairKey = [device.id, linkedId].sort().join('-');
            if (!processedPairs.has(pairKey)) {
              links.push({ device1: device, device2: linkedDevice });
              processedPairs.add(pairKey);
            }
          }
        });
      }
    });

    return links;
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Device Management</h1>
            <p className="text-muted-foreground">
              Configure and organize your room units, sensors, and controllers
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={linkingMode ? "default" : "outline"}
              onClick={() => {
                setLinkingMode(!linkingMode);
                setSelectedDevice(null);
              }}
              className="flex items-center gap-2"
            >
              <Link className="h-4 w-4" />
              {linkingMode ? "Exit Linking Mode" : "Link Devices"}
            </Button>
            {selectedDevice && (
              <Button
                variant="outline"
                onClick={() => setSelectedDevice(null)}
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                View Details
              </Button>
            )}
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  View Links ({getAllDeviceLinks().length})
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Device Links Overview</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {getAllDeviceLinks().length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Link className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No device links configured</p>
                      <p className="text-sm">Use the "Link Devices" mode to connect devices together</p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {getAllDeviceLinks().map((link, index) => (
                        <Card key={index} className="border-border/50 bg-card/50">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50">
                                  {getDeviceIcon(link.device1.type)}
                                  <span className="font-medium">{link.device1.name}</span>
                                  <Badge variant="outline" className={`text-xs ${getDeviceTypeColor(link.device1.type)}`}>
                                    {link.device1.type.replace('_', ' ')}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-2 text-orange-400">
                                  <div className="h-px bg-orange-400 w-8"></div>
                                  <Link className="h-4 w-4" />
                                  <div className="h-px bg-orange-400 w-8"></div>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50">
                                  {getDeviceIcon(link.device2.type)}
                                  <span className="font-medium">{link.device2.name}</span>
                                  <Badge variant="outline" className={`text-xs ${getDeviceTypeColor(link.device2.type)}`}>
                                    {link.device2.type.replace('_', ' ')}
                                  </Badge>
                                </div>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => unlinkDevice(link.device1.id, link.device2.id)}
                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                              >
                                <Unlink className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="mt-3 pt-3 border-t border-border/50">
                              <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                                <div>
                                  <span className="font-medium">Zone:</span> {link.device1.zone} | <span className="font-medium">Code:</span> {link.device1.code}
                                </div>
                                <div>
                                  <span className="font-medium">Zone:</span> {link.device2.zone} | <span className="font-medium">Code:</span> {link.device2.code}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Add New Device */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add New Device
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <div>
                <Label htmlFor="type">Type</Label>
                <Select
                  value={newDevice.type}
                  onValueChange={(value: Device["type"]) =>
                    setNewDevice(prev => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="room_unit">Room Unit</SelectItem>
                    <SelectItem value="sensor">Sensor</SelectItem>
                    <SelectItem value="controller">Controller</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newDevice.name}
                  onChange={(e) =>
                    setNewDevice(prev => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Device name"
                />
              </div>
              <div>
                <Label htmlFor="zone">Zone</Label>
                <Input
                  id="zone"
                  value={newDevice.zone}
                  onChange={(e) =>
                    setNewDevice(prev => ({ ...prev, zone: e.target.value }))
                  }
                  placeholder="Zone name"
                />
              </div>
              <div>
                <Label htmlFor="code">Code</Label>
                <Input
                  id="code"
                  value={newDevice.code}
                  onChange={(e) =>
                    setNewDevice(prev => ({ ...prev, code: e.target.value }))
                  }
                  placeholder="001"
                />
              </div>
              <div>
                <Label htmlFor="group">Group</Label>
                <Select
                  value={newDevice.groupId}
                  onValueChange={(value) =>
                    setNewDevice(prev => ({ ...prev, groupId: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {groups.map(group => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button onClick={addDevice} className="w-full">
                  Add Device
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Device Groups */}
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {organizedGroups.map(group => (
              <Card key={group.id} className="border-border/50 bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{group.name}</span>
                    <Badge variant="secondary" className="bg-muted/50">
                      {group.devices.length} devices
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Droppable droppableId={group.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`min-h-[200px] space-y-2 p-2 rounded-lg border-2 border-dashed transition-colors ${
                          snapshot.isDraggingOver
                            ? "border-primary/50 bg-primary/5"
                            : "border-border/30 bg-muted/10"
                        }`}
                      >
                        {group.devices.map((device, index) => {
                          const isSelected = selectedDevice === device.id;
                          const isLinked = (device.linkedDevices?.length || 0) > 0;
                          const linkedNames = getLinkedDeviceNames(device.id);
                          
                          return (
                            <Draggable key={device.id} draggableId={device.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  onClick={(e) => {
                                    if (linkingMode) {
                                      e.stopPropagation();
                                      handleDeviceClick(device.id);
                                    }
                                  }}
                                  className={`p-3 rounded-lg border transition-all ${
                                    linkingMode ? "cursor-pointer" : "cursor-move"
                                  } ${
                                    snapshot.isDragging
                                      ? "shadow-lg scale-105 bg-card/90"
                                      : "hover:shadow-md hover:bg-card/80"
                                  } ${
                                    isSelected
                                      ? "border-primary bg-primary/10"
                                      : isLinked
                                      ? "border-orange-500/50 bg-orange-500/5"
                                      : "border-border/50 bg-card"
                                  }`}
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                      {getDeviceIcon(device.type)}
                                      <span className="font-medium text-sm">{device.name}</span>
                                      {isLinked && (
                                        <Link className="h-3 w-3 text-orange-400" />
                                      )}
                                      {linkingMode && isSelected && (
                                        <Badge variant="secondary" className="text-xs">
                                          Selected
                                        </Badge>
                                      )}
                                    </div>
                                    <Badge
                                      variant="outline"
                                      className={`text-xs ${getDeviceTypeColor(device.type)}`}
                                    >
                                      {device.type.replace('_', ' ')}
                                    </Badge>
                                  </div>
                                  <Separator className="my-2 bg-border/50" />
                                  <div className="text-xs text-muted-foreground space-y-1">
                                    <div className="flex justify-between">
                                      <span>Zone:</span>
                                      <span>{device.zone}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Code:</span>
                                      <span className="font-mono">{device.code}</span>
                                    </div>
                                    {isLinked && (
                                      <div className="pt-2 border-t border-border/50 mt-2">
                                        <div className="flex items-center gap-1 mb-2">
                                          <Link className="h-3 w-3 text-orange-400" />
                                          <span className="text-orange-400 font-medium text-xs">Linked to:</span>
                                        </div>
                                        <div className="space-y-1">
                                          {device.linkedDevices?.map((linkedId, idx) => {
                                            const linkedDevice = devices.find(d => d.id === linkedId);
                                            if (!linkedDevice) return null;
                                            
                                            return (
                                              <div key={idx} className="flex items-center justify-between p-2 rounded bg-orange-500/5 border border-orange-500/20">
                                                <div className="flex items-center gap-2">
                                                  {getDeviceIcon(linkedDevice.type)}
                                                  <span className="text-xs font-medium">{linkedDevice.name}</span>
                                                  <Badge variant="outline" className="text-xs bg-orange-500/10 text-orange-400 border-orange-500/30">
                                                    {linkedDevice.code}
                                                  </Badge>
                                                </div>
                                                <button
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    unlinkDevice(device.id, linkedId);
                                                  }}
                                                  className="text-red-400 hover:text-red-300 p-1"
                                                >
                                                  <Unlink className="h-3 w-3" />
                                                </button>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                        {group.devices.length === 0 && (
                          <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
                            Drag devices here
                          </div>
                        )}
                      </div>
                    )}
                  </Droppable>
                </CardContent>
              </Card>
            ))}
          </div>
        </DragDropContext>

        {linkingMode && (
          <Card className="border-primary/50 bg-primary/5 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-primary">
                  <Link className="h-4 w-4" />
                  <span className="font-medium">
                    {selectedDevice 
                      ? `Selected: ${devices.find(d => d.id === selectedDevice)?.name} - Click another device to create a link` 
                      : "Click on a device to start linking"}
                  </span>
                </div>
                {selectedDevice && (
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/30">
                    Linking Mode Active
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Links Overview */}
        {getAllDeviceLinks().length > 0 && !linkingMode && (
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Link className="h-5 w-5 text-orange-400" />
                  <span>Active Device Links</span>
                </div>
                <Badge variant="secondary" className="bg-orange-500/10 text-orange-400 border-orange-500/30">
                  {getAllDeviceLinks().length} connections
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {getAllDeviceLinks().slice(0, 6).map((link, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 border border-orange-500/20">
                    <div className="flex items-center gap-1 text-xs">
                      {getDeviceIcon(link.device1.type)}
                      <span className="font-medium truncate max-w-[80px]">{link.device1.name}</span>
                    </div>
                    <ArrowRight className="h-3 w-3 text-orange-400 flex-shrink-0" />
                    <div className="flex items-center gap-1 text-xs">
                      {getDeviceIcon(link.device2.type)}
                      <span className="font-medium truncate max-w-[80px]">{link.device2.name}</span>
                    </div>
                  </div>
                ))}
                {getAllDeviceLinks().length > 6 && (
                  <div className="flex items-center justify-center p-2 rounded-lg bg-muted/30 border border-border/30 text-xs text-muted-foreground">
                    +{getAllDeviceLinks().length - 6} more links
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Device Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-blue-500/20 text-blue-400">
                  <Home className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {devices.filter(d => d.type === "room_unit").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Room Units</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-green-500/20 text-green-400">
                  <Thermometer className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {devices.filter(d => d.type === "sensor").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Sensors</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-purple-500/20 text-purple-400">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {devices.filter(d => d.type === "controller").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Controllers</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-orange-500/20 text-orange-400">
                  <Link className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {devices.filter(d => (d.linkedDevices?.length || 0) > 0).length}
                  </p>
                  <p className="text-sm text-muted-foreground">Linked Devices</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}