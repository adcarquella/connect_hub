import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, UserCheck, MapPin, Activity } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

interface Room {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'bedroom' | 'lounge' | 'office' | 'kitchen' | 'bathroom' | 'common';
}

interface Person {
  id: string;
  name: string;
  type: 'resident' | 'carer';
  x: number;
  y: number;
  room: string;
  trail: { x: number; y: number; timestamp: number }[];
}

const floorPlanData: Room[] = [
  { id: 'lobby', name: 'LOBBY', x: 50, y: 50, width: 120, height: 80, type: 'common' },
  { id: 'lounge1', name: 'LOUNGE 1', x: 250, y: 20, width: 180, height: 120, type: 'lounge' },
  { id: 'lounge2', name: 'LOUNGE 2', x: 450, y: 20, width: 150, height: 100, type: 'lounge' },
  { id: 'office', name: 'OFFICE', x: 620, y: 20, width: 100, height: 80, type: 'office' },
  { id: 'staffroom', name: 'STAFF ROOM', x: 50, y: 150, width: 150, height: 100, type: 'office' },
  { id: 'bedroom8', name: 'BEDROOM 8', x: 220, y: 150, width: 100, height: 80, type: 'bedroom' },
  { id: 'bedroom1', name: 'BEDROOM 1', x: 340, y: 150, width: 100, height: 80, type: 'bedroom' },
  { id: 'diningroom', name: 'DINING ROOM', x: 460, y: 140, width: 160, height: 120, type: 'common' },
  { id: 'conservatory', name: 'CONSERVATORY', x: 640, y: 180, width: 120, height: 100, type: 'lounge' },
  { id: 'bedroom2', name: 'BEDROOM 2', x: 50, y: 270, width: 120, height: 100, type: 'bedroom' },
  { id: 'kitchenette', name: 'KITCHENETTE', x: 190, y: 250, width: 100, height: 80, type: 'kitchen' },
  { id: 'serverroom', name: 'SERVER ROOM', x: 380, y: 280, width: 100, height: 70, type: 'office' },
  { id: 'kitchen', name: 'KITCHEN', x: 500, y: 280, width: 100, height: 70, type: 'kitchen' },
  { id: 'bedroom3', name: 'BEDROOM 3', x: 50, y: 390, width: 120, height: 100, type: 'bedroom' },
  { id: 'bedroom4', name: 'BEDROOM 4', x: 50, y: 510, width: 120, height: 100, type: 'bedroom' },
  { id: 'bedroom5', name: 'BEDROOM 5', x: 190, y: 510, width: 120, height: 100, type: 'bedroom' },
  { id: 'storeroom', name: 'STORE ROOM', x: 400, y: 450, width: 160, height: 120, type: 'common' },
];

const initialPeople: Person[] = [
  { id: '1', name: 'Sarah Johnson', type: 'resident', x: 100, y: 200, room: 'bedroom8', trail: [] },
  { id: '2', name: 'Mary Smith', type: 'resident', x: 400, y: 180, room: 'bedroom1', trail: [] },
  { id: '3', name: 'John Davis', type: 'resident', x: 100, y: 320, room: 'bedroom2', trail: [] },
  { id: '4', name: 'Nurse Alice', type: 'carer', x: 300, y: 200, room: 'lounge1', trail: [] },
  { id: '5', name: 'Carer Bob', type: 'carer', x: 520, y: 200, room: 'diningroom', trail: [] },
];

export const Move = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [people, setPeople] = useState<Person[]>(initialPeople);
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 800;
    const height = 650;
    
    svg.attr("width", width).attr("height", height);

    // Create floor plan rooms
    const roomsGroup = svg.append("g").attr("class", "rooms");
    
    roomsGroup.selectAll(".room")
      .data(floorPlanData)
      .enter()
      .append("rect")
      .attr("class", "room")
      .attr("x", d => d.x)
      .attr("y", d => d.y)
      .attr("width", d => d.width)
      .attr("height", d => d.height)
      .attr("fill", d => {
        switch (d.type) {
          case 'bedroom': return 'hsl(var(--primary-muted))';
          case 'lounge': return 'hsl(var(--secondary-muted))';
          case 'office': return 'hsl(var(--warning-muted))';
          case 'kitchen': return 'hsl(var(--success-muted))';
          default: return 'hsl(var(--accent))';
        }
      })
      .attr("stroke", "hsl(var(--border))")
      .attr("stroke-width", 2)
      .attr("rx", 4);

    // Add room labels
    roomsGroup.selectAll(".room-label")
      .data(floorPlanData)
      .enter()
      .append("text")
      .attr("class", "room-label")
      .attr("x", d => d.x + d.width / 2)
      .attr("y", d => d.y + d.height / 2)
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("fill", "hsl(var(--foreground))")
      .attr("font-size", "12px")
      .attr("font-weight", "500")
      .text(d => d.name);

    // Create trails group (behind people)
    const trailsGroup = svg.append("g").attr("class", "trails");
    
    // Create people group
    const peopleGroup = svg.append("g").attr("class", "people");

    // Update people and trails
    updateVisualization();

  }, [people]);

  const updateVisualization = () => {
    if (!svgRef.current) return;
    
    const svg = d3.select(svgRef.current);
    
    // Update trails
    const trailsGroup = svg.select(".trails");
    trailsGroup.selectAll(".trail").remove();
    
    people.forEach(person => {
      if (person.trail.length > 1) {
        const line = d3.line<{ x: number; y: number; timestamp: number }>()
          .x(d => d.x)
          .y(d => d.y)
          .curve(d3.curveCatmullRom);

        const trail = trailsGroup.append("path")
          .datum(person.trail)
          .attr("class", "trail")
          .attr("d", line)
          .attr("fill", "none")
          .attr("stroke", person.type === 'resident' ? 'hsl(var(--primary))' : 'hsl(var(--warning))')
          .attr("stroke-width", 3)
          .attr("opacity", 0.6);

        // Add fade effect to trail
        const pathLength = (trail.node() as SVGPathElement)?.getTotalLength() || 0;
        trail
          .attr("stroke-dasharray", pathLength + " " + pathLength)
          .attr("stroke-dashoffset", pathLength)
          .transition()
          .duration(1000)
          .attr("stroke-dashoffset", 0);
      }
    });

    // Update people icons
    const peopleGroup = svg.select(".people");
    const peopleSelection = peopleGroup.selectAll(".person")
      .data(people, (d: any) => d.id);

    const peopleEnter = peopleSelection.enter()
      .append("g")
      .attr("class", "person")
      .attr("transform", d => `translate(${d.x}, ${d.y})`);

    // Add circle background
    peopleEnter.append("circle")
      .attr("r", 12)
      .attr("fill", d => d.type === 'resident' ? 'hsl(var(--primary))' : 'hsl(var(--warning))')
      .attr("stroke", "hsl(var(--background))")
      .attr("stroke-width", 2);

    // Add icon (simplified as text)
    peopleEnter.append("text")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("fill", "hsl(var(--primary-foreground))")
      .attr("font-size", "12px")
      .attr("font-weight", "bold")
      .text(d => d.type === 'resident' ? 'R' : 'C');

    // Add name label
    peopleEnter.append("text")
      .attr("class", "person-name")
      .attr("x", 0)
      .attr("y", 25)
      .attr("text-anchor", "middle")
      .attr("fill", "hsl(var(--foreground))")
      .attr("font-size", "10px")
      .text(d => d.name);

    // Update existing people
    peopleSelection.merge(peopleEnter)
      .attr("transform", d => `translate(${d.x}, ${d.y})`)
      .style("cursor", "pointer")
      .on("click", (event, d) => {
        setSelectedPerson(selectedPerson === d.id ? null : d.id);
      });

    peopleSelection.exit().remove();
  };

  const startSimulation = () => {
    if (isSimulationRunning) return;
    
    setIsSimulationRunning(true);
    
    const interval = setInterval(() => {
      setPeople(currentPeople => {
        return currentPeople.map(person => {
          // Add some random movement
          const newX = Math.max(20, Math.min(760, person.x + (Math.random() - 0.5) * 40));
          const newY = Math.max(20, Math.min(620, person.y + (Math.random() - 0.5) * 40));
          
          // Add to trail (keep last 20 positions)
          const newTrail = [...person.trail, { x: person.x, y: person.y, timestamp: Date.now() }]
            .slice(-20);
          
          return {
            ...person,
            x: newX,
            y: newY,
            trail: newTrail
          };
        });
      });
    }, 2000);

    // Stop simulation after 30 seconds
    setTimeout(() => {
      clearInterval(interval);
      setIsSimulationRunning(false);
    }, 30000);
  };

  const stopSimulation = () => {
    setIsSimulationRunning(false);
  };

  const clearTrails = () => {
    setPeople(currentPeople => 
      currentPeople.map(person => ({ ...person, trail: [] }))
    );
  };

  const selectedPersonData = people.find(p => p.id === selectedPerson);
  const residents = people.filter(p => p.type === 'resident');
  const carers = people.filter(p => p.type === 'carer');

  return (
    <DashboardLayout>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Movement Tracking</h1>
          <p className="text-muted-foreground">ARQUELLA - DINNINGTON GRANGE Floor Plan</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={startSimulation} 
            disabled={isSimulationRunning}
            className="glass-button"
          >
            <Activity className="w-4 h-4 mr-2" />
            {isSimulationRunning ? 'Running...' : 'Start Simulation'}
          </Button>
          <Button 
            onClick={stopSimulation} 
            disabled={!isSimulationRunning}
            variant="outline"
          >
            Stop
          </Button>
          <Button onClick={clearTrails} variant="outline">
            Clear Trails
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Floor Plan - First Floor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative bg-accent/50 rounded-lg p-4 overflow-auto">
                <svg ref={svgRef} className="border border-border rounded-lg bg-background/80" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Residents</span>
                <Badge variant="secondary">{residents.length}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Carers</span>
                <Badge variant="outline">{carers.length}</Badge>
              </div>
              <div className="pt-2 border-t">
                <span className="text-xs text-muted-foreground">
                  Click on any person to view details
                </span>
              </div>
            </CardContent>
          </Card>

          {selectedPersonData && (
            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5" />
                  Selected Person
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-medium">{selectedPersonData.name}</p>
                  <Badge 
                    variant={selectedPersonData.type === 'resident' ? 'default' : 'secondary'}
                    className="mt-1"
                  >
                    {selectedPersonData.type}
                  </Badge>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Position:</span>
                    <span>({selectedPersonData.x.toFixed(0)}, {selectedPersonData.y.toFixed(0)})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Trail Points:</span>
                    <span>{selectedPersonData.trail.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Room:</span>
                    <span className="capitalize">{selectedPersonData.room}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle>Legend</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-primary/20 border border-primary/30" />
                <span className="text-sm">Bedrooms</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-secondary/20 border border-secondary/30" />
                <span className="text-sm">Lounges</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-warning/20 border border-warning/30" />
                <span className="text-sm">Office Areas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-success/20 border border-success/30" />
                <span className="text-sm">Kitchen Areas</span>
              </div>
              <div className="pt-2 border-t space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-primary" />
                  <span className="text-sm">Residents</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-warning" />
                  <span className="text-sm">Carers</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </DashboardLayout>
  );
};
