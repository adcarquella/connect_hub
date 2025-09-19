import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

import { 
  Save, 
  Upload, 
  Plus, 
  Edit, 
  Trash2, 
  Home, 
  Wifi, 
  Thermometer, 
  Camera,
  Zap,
  Settings
} from "lucide-react";
import { toast } from "sonner";

interface FloorPlanItem {
  id: string;
  type: 'room' | 'sensor' | 'panel' | 'point';
  name: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  properties: Record<string, any>;
}

interface FloorPlan {
  id: string;
  name: string;
  floor: number;
  items: FloorPlanItem[];
  metadata: {
    created: string;
    modified: string;
    version: string;
  };
}

const DEVICE_TYPES = {
  sensor: { icon: Thermometer, color: 'hsl(var(--primary))', label: 'Sensor' },
  camera: { icon: Camera, color: 'hsl(var(--warning))', label: 'Camera' },
  wifi: { icon: Wifi, color: 'hsl(var(--success))', label: 'WiFi Point' },
  panel: { icon: Zap, color: 'hsl(var(--destructive))', label: 'Control Panel' },
  point: { icon: Settings, color: 'hsl(var(--secondary))', label: 'Access Point' }
};

export const FloorPlan = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [floorPlan, setFloorPlan] = useState<FloorPlan>({
    id: 'floor-1',
    name: 'Ground Floor',
    floor: 1,
    items: [],
    metadata: {
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
      version: '1.0'
    }
  });
  
  const [selectedTool, setSelectedTool] = useState<'select' | 'room' | 'sensor' | 'camera' | 'wifi' | 'panel' | 'point'>('select');
  const [selectedItem, setSelectedItem] = useState<FloorPlanItem | null>(null);
  const [isDrawingRoom, setIsDrawingRoom] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 800;
    const height = 600;
    
    svg.attr("width", width).attr("height", height);

    // Create grid pattern
    const defs = svg.append("defs");
    const pattern = defs.append("pattern")
      .attr("id", "grid")
      .attr("width", 20)
      .attr("height", 20)
      .attr("patternUnits", "userSpaceOnUse");

    pattern.append("path")
      .attr("d", "M 20 0 L 0 0 0 20")
      .attr("fill", "none")
      .attr("stroke", "hsl(var(--border))")
      .attr("stroke-width", 0.5)
      .attr("opacity", 0.3);

    // Add grid background
    svg.append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "url(#grid)")
      .attr("class", "grid-background");

    // Create main groups
    const roomsGroup = svg.append("g").attr("class", "rooms");
    const devicesGroup = svg.append("g").attr("class", "devices");

    // Handle canvas clicks
    svg.on("click", (event) => {
      if (selectedTool === 'select') return;
      
      const [x, y] = d3.pointer(event);
      
      if (selectedTool === 'room') {
        if (!isDrawingRoom) {
          setDragStart({ x, y });
          setIsDrawingRoom(true);
        }
      } else {
        // Add device/point
        addItem(selectedTool, x, y);
      }
    });

    // Handle mouse move for room drawing
    svg.on("mousemove", (event) => {
      if (isDrawingRoom && dragStart) {
        const [x, y] = d3.pointer(event);
        updateRoomPreview(dragStart.x, dragStart.y, x - dragStart.x, y - dragStart.y);
      }
    });

    // Handle room completion
    svg.on("mouseup", (event) => {
      if (isDrawingRoom && dragStart) {
        const [x, y] = d3.pointer(event);
        const width = Math.abs(x - dragStart.x);
        const height = Math.abs(y - dragStart.y);
        
        if (width > 20 && height > 20) {
          addRoom(
            Math.min(dragStart.x, x),
            Math.min(dragStart.y, y),
            width,
            height
          );
        }
        
        setIsDrawingRoom(false);
        setDragStart(null);
        svg.select(".room-preview").remove();
      }
    });

    renderFloorPlan();
  }, [floorPlan, selectedTool]);

  const updateRoomPreview = (x: number, y: number, width: number, height: number) => {
    const svg = d3.select(svgRef.current);
    
    svg.select(".room-preview").remove();
    
    svg.append("rect")
      .attr("class", "room-preview")
      .attr("x", x)
      .attr("y", y)
      .attr("width", Math.abs(width))
      .attr("height", Math.abs(height))
      .attr("fill", "hsl(var(--primary))")
      .attr("fill-opacity", 0.2)
      .attr("stroke", "hsl(var(--primary))")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "5,5");
  };

  const renderFloorPlan = () => {
    if (!svgRef.current) return;
    
    const svg = d3.select(svgRef.current);
    const roomsGroup = svg.select(".rooms");
    const devicesGroup = svg.select(".devices");

    // Clear existing items
    roomsGroup.selectAll(".floor-item").remove();
    devicesGroup.selectAll(".floor-item").remove();

    // Render rooms
    const rooms = floorPlan.items.filter(item => item.type === 'room');
    roomsGroup.selectAll(".room")
      .data(rooms)
      .enter()
      .append("g")
      .attr("class", "floor-item room")
      .each(function(d) {
        const group = d3.select(this);
        
        // Room rectangle
        group.append("rect")
          .attr("x", d.x)
          .attr("y", d.y)
          .attr("width", d.width || 100)
          .attr("height", d.height || 100)
          .attr("fill", "hsl(var(--accent))")
          .attr("stroke", "hsl(var(--border))")
          .attr("stroke-width", 2)
          .attr("rx", 4)
          .style("cursor", "pointer");

        // Room label
        group.append("text")
          .attr("x", d.x + (d.width || 100) / 2)
          .attr("y", d.y + (d.height || 100) / 2)
          .attr("text-anchor", "middle")
          .attr("alignment-baseline", "middle")
          .attr("fill", "hsl(var(--foreground))")
          .attr("font-size", "12px")
          .attr("font-weight", "500")
          .text(d.name)
          .style("pointer-events", "none");

        group.on("click", (event) => {
          event.stopPropagation();
          setSelectedItem(d);
        });
      });

    // Render devices and points
    const devices = floorPlan.items.filter(item => item.type !== 'room');
    devicesGroup.selectAll(".device")
      .data(devices)
      .enter()
      .append("g")
      .attr("class", "floor-item device")
      .attr("transform", d => `translate(${d.x}, ${d.y})`)
      .each(function(d) {
        const group = d3.select(this);
        const deviceType = DEVICE_TYPES[d.type as keyof typeof DEVICE_TYPES];
        
        // Device circle
        group.append("circle")
          .attr("r", 15)
          .attr("fill", deviceType?.color || 'hsl(var(--muted))')
          .attr("stroke", "hsl(var(--background))")
          .attr("stroke-width", 2)
          .style("cursor", "pointer");

        // Device icon (simplified as text)
        group.append("text")
          .attr("text-anchor", "middle")
          .attr("alignment-baseline", "middle")
          .attr("fill", "white")
          .attr("font-size", "10px")
          .attr("font-weight", "bold")
          .text(d.type.charAt(0).toUpperCase())
          .style("pointer-events", "none");

        // Device label
        group.append("text")
          .attr("x", 0)
          .attr("y", 25)
          .attr("text-anchor", "middle")
          .attr("fill", "hsl(var(--foreground))")
          .attr("font-size", "10px")
          .text(d.name)
          .style("pointer-events", "none");

        group.on("click", (event) => {
          event.stopPropagation();
          setSelectedItem(d);
        });

        // Make devices draggable
        group.call(d3.drag<SVGGElement, FloorPlanItem>()
          .on("drag", (event, d) => {
            d.x = event.x;
            d.y = event.y;
            group.attr("transform", `translate(${d.x}, ${d.y})`);
            updateFloorPlan();
          })
        );
      });
  };

  const addRoom = (x: number, y: number, width: number, height: number) => {
    const newRoom: FloorPlanItem = {
      id: `room-${Date.now()}`,
      type: 'room',
      name: `Room ${floorPlan.items.filter(i => i.type === 'room').length + 1}`,
      x,
      y,
      width,
      height,
      properties: {
        roomType: 'general',
        capacity: 1,
        description: ''
      }
    };

    setFloorPlan(prev => ({
      ...prev,
      items: [...prev.items, newRoom],
      metadata: { ...prev.metadata, modified: new Date().toISOString() }
    }));

    setSelectedTool('select');
    toast("Room added successfully!");
  };

  const addItem = (type: string, x: number, y: number) => {
    const deviceType = DEVICE_TYPES[type as keyof typeof DEVICE_TYPES];
    
    const newItem: FloorPlanItem = {
      id: `${type}-${Date.now()}`,
      type: type as FloorPlanItem['type'],
      name: `${deviceType?.label || type} ${floorPlan.items.filter(i => i.type === type).length + 1}`,
      x,
      y,
      properties: {
        status: 'active',
        description: '',
        ...(type === 'sensor' && { sensorType: 'temperature', range: 10 }),
        ...(type === 'camera' && { resolution: '1080p', fieldOfView: 90 }),
        ...(type === 'wifi' && { ssid: 'Network', range: 50 }),
        ...(type === 'panel' && { panelType: 'control', zones: 1 })
      }
    };

    setFloorPlan(prev => ({
      ...prev,
      items: [...prev.items, newItem],
      metadata: { ...prev.metadata, modified: new Date().toISOString() }
    }));

    toast(`${deviceType?.label || 'Item'} added successfully!`);
  };

  const updateFloorPlan = () => {
    setFloorPlan(prev => ({
      ...prev,
      metadata: { ...prev.metadata, modified: new Date().toISOString() }
    }));
  };

  const updateItem = (updatedItem: FloorPlanItem) => {
    setFloorPlan(prev => ({
      ...prev,
      items: prev.items.map(item => item.id === updatedItem.id ? updatedItem : item),
      metadata: { ...prev.metadata, modified: new Date().toISOString() }
    }));
    setSelectedItem(updatedItem);
    toast("Item updated successfully!");
  };

  const deleteItem = (itemId: string) => {
    setFloorPlan(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId),
      metadata: { ...prev.metadata, modified: new Date().toISOString() }
    }));
    setSelectedItem(null);
    toast("Item deleted successfully!");
  };

  const saveFloorPlan = () => {
    const jsonData = JSON.stringify(floorPlan, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${floorPlan.name.replace(/\s+/g, '-').toLowerCase()}-floor-plan.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast("Floor plan saved successfully!");
  };

  const loadFloorPlan = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const loadedPlan = JSON.parse(e.target?.result as string);
        setFloorPlan(loadedPlan);
        toast("Floor plan loaded successfully!");
      } catch (error) {
        toast("Error loading floor plan. Please check the file format.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <DashboardLayout>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Floor Plan Editor</h1>
          <p className="text-muted-foreground">Design and configure your facility layout</p>
        </div>
        <div className="flex gap-2">
          <input
            type="file"
            accept=".json"
            onChange={loadFloorPlan}
            className="hidden"
            id="load-floor-plan"
          />
          <Button
            variant="outline"
            onClick={() => document.getElementById('load-floor-plan')?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            Load
          </Button>
          <Button onClick={saveFloorPlan} className="glass-button">
            <Save className="w-4 h-4 mr-2" />
            Save Plan
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="w-5 h-5" />
                {floorPlan.name} - Interactive Editor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Tool Palette */}
                <div className="flex flex-wrap gap-2 p-3 bg-accent/50 rounded-lg">
                  <Button
                    variant={selectedTool === 'select' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedTool('select')}
                  >
                    Select
                  </Button>
                  <Button
                    variant={selectedTool === 'room' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedTool('room')}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Room
                  </Button>
                  {Object.entries(DEVICE_TYPES).map(([key, device]) => {
                    const IconComponent = device.icon;
                    return (
                      <Button
                        key={key}
                        variant={selectedTool === key ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedTool(key as any)}
                      >
                        <IconComponent className="w-4 h-4 mr-1" />
                        {device.label}
                      </Button>
                    );
                  })}
                </div>

                {/* Canvas */}
                <div className="relative bg-background border border-border rounded-lg overflow-hidden">
                  <svg ref={svgRef} className="w-full" />
                </div>

                {selectedTool === 'room' && (
                  <div className="text-sm text-muted-foreground bg-info/10 p-3 rounded-lg">
                    Click and drag to create a room
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {/* Floor Plan Info */}
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle>Floor Plan Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor="plan-name">Plan Name</Label>
                <Input
                  id="plan-name"
                  value={floorPlan.name}
                  onChange={(e) => setFloorPlan(prev => ({
                    ...prev,
                    name: e.target.value,
                    metadata: { ...prev.metadata, modified: new Date().toISOString() }
                  }))}
                />
              </div>
              <div>
                <Label htmlFor="floor-number">Floor Number</Label>
                <Input
                  id="floor-number"
                  type="number"
                  value={floorPlan.floor}
                  onChange={(e) => setFloorPlan(prev => ({
                    ...prev,
                    floor: parseInt(e.target.value) || 1,
                    metadata: { ...prev.metadata, modified: new Date().toISOString() }
                  }))}
                />
              </div>
              <div className="pt-2 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Items:</span>
                  <Badge variant="secondary">{floorPlan.items.length}</Badge>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-muted-foreground">Rooms:</span>
                  <Badge variant="outline">{floorPlan.items.filter(i => i.type === 'room').length}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Selected Item Editor */}
          {selectedItem && (
            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Edit Item</span>
                  <div className="flex gap-1">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit {selectedItem.name}</DialogTitle>
                        </DialogHeader>
                        <ItemEditor
                          item={selectedItem}
                          onUpdate={updateItem}
                          onDelete={deleteItem}
                        />
                      </DialogContent>
                    </Dialog>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteItem(selectedItem.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="text-sm font-medium">{selectedItem.name}</span>
                  <Badge variant="secondary" className="ml-2">
                    {selectedItem.type}
                  </Badge>
                </div>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Position:</span>
                    <span>({selectedItem.x.toFixed(0)}, {selectedItem.y.toFixed(0)})</span>
                  </div>
                  {selectedItem.width && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Size:</span>
                      <span>{selectedItem.width.toFixed(0)} × {selectedItem.height?.toFixed(0)}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Items List */}
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle>Floor Plan Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {floorPlan.items.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                      selectedItem?.id === item.id ? 'bg-primary/20' : 'hover:bg-accent'
                    }`}
                    onClick={() => setSelectedItem(item)}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: item.type === 'room' ? 'hsl(var(--accent))' : 
                            DEVICE_TYPES[item.type as keyof typeof DEVICE_TYPES]?.color || 'hsl(var(--muted))'
                        }}
                      />
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {item.type}
                    </Badge>
                  </div>
                ))}
                {floorPlan.items.length === 0 && (
                  <div className="text-center text-muted-foreground text-sm py-4">
                    No items added yet. Use the tools above to start building your floor plan.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </DashboardLayout>
  );
};

// Item Editor Component
interface ItemEditorProps {
  item: FloorPlanItem;
  onUpdate: (item: FloorPlanItem) => void;
  onDelete: (itemId: string) => void;
}

const ItemEditor = ({ item, onUpdate, onDelete }: ItemEditorProps) => {
  const [editedItem, setEditedItem] = useState<FloorPlanItem>({ ...item });

  const handleSave = () => {
    onUpdate(editedItem);
  };

  const updateProperty = (key: string, value: any) => {
    setEditedItem(prev => ({
      ...prev,
      properties: { ...prev.properties, [key]: value }
    }));
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="item-name">Name</Label>
        <Input
          id="item-name"
          value={editedItem.name}
          onChange={(e) => setEditedItem(prev => ({ ...prev, name: e.target.value }))}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="item-x">X Position</Label>
          <Input
            id="item-x"
            type="number"
            value={editedItem.x}
            onChange={(e) => setEditedItem(prev => ({ ...prev, x: parseFloat(e.target.value) || 0 }))}
          />
        </div>
        <div>
          <Label htmlFor="item-y">Y Position</Label>
          <Input
            id="item-y"
            type="number"
            value={editedItem.y}
            onChange={(e) => setEditedItem(prev => ({ ...prev, y: parseFloat(e.target.value) || 0 }))}
          />
        </div>
      </div>

      {item.type === 'room' && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="room-width">Width</Label>
            <Input
              id="room-width"
              type="number"
              value={editedItem.width || 100}
              onChange={(e) => setEditedItem(prev => ({ ...prev, width: parseFloat(e.target.value) || 100 }))}
            />
          </div>
          <div>
            <Label htmlFor="room-height">Height</Label>
            <Input
              id="room-height"
              type="number"
              value={editedItem.height || 100}
              onChange={(e) => setEditedItem(prev => ({ ...prev, height: parseFloat(e.target.value) || 100 }))}
            />
          </div>
        </div>
      )}

      {/* Dynamic properties based on item type */}
      {item.type === 'room' && (
        <>
          <div>
            <Label htmlFor="room-type">Room Type</Label>
            <Select 
              value={editedItem.properties.roomType} 
              onValueChange={(value) => updateProperty('roomType', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bedroom">Bedroom</SelectItem>
                <SelectItem value="lounge">Lounge</SelectItem>
                <SelectItem value="kitchen">Kitchen</SelectItem>
                <SelectItem value="bathroom">Bathroom</SelectItem>
                <SelectItem value="office">Office</SelectItem>
                <SelectItem value="general">General</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="room-capacity">Capacity</Label>
            <Input
              id="room-capacity"
              type="number"
              value={editedItem.properties.capacity || 1}
              onChange={(e) => updateProperty('capacity', parseInt(e.target.value) || 1)}
            />
          </div>
        </>
      )}

      {item.type === 'sensor' && (
        <>
          <div>
            <Label htmlFor="sensor-type">Sensor Type</Label>
            <Select 
              value={editedItem.properties.sensorType} 
              onValueChange={(value) => updateProperty('sensorType', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="temperature">Temperature</SelectItem>
                <SelectItem value="humidity">Humidity</SelectItem>
                <SelectItem value="motion">Motion</SelectItem>
                <SelectItem value="door">Door</SelectItem>
                <SelectItem value="smoke">Smoke</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="sensor-range">Range (meters)</Label>
            <Input
              id="sensor-range"
              type="number"
              value={editedItem.properties.range || 10}
              onChange={(e) => updateProperty('range', parseFloat(e.target.value) || 10)}
            />
          </div>
        </>
      )}

      <div>
        <Label htmlFor="item-description">Description</Label>
        <Textarea
          id="item-description"
          value={editedItem.properties.description || ''}
          onChange={(e) => updateProperty('description', e.target.value)}
          placeholder="Add a description for this item..."
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button onClick={handleSave} className="flex-1">
          Save Changes
        </Button>
        <Button 
          variant="destructive" 
          onClick={() => onDelete(item.id)}
        >
          Delete Item
        </Button>
      </div>
    </div>
  );
};