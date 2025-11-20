import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Trash2, User } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface MetricData {
  label: string;
  value: number;
  max: number;
  color: string;
  icon: string;
}

interface InjuryMark {
  id: string;
  x: number;
  y: number;
  view: 'front' | 'back';
  details: {
    description: string;
    date: Date;
    doctor: string;
    notes: string;
    severity: 'minor' | 'moderate' | 'severe';
  };
}

const BodyDiagram = () => {
  const [injuries, setInjuries] = useState<InjuryMark[]>([]);
  const [selectedView, setSelectedView] = useState<'front' | 'back'>('front');
  const [selectedInjury, setSelectedInjury] = useState<InjuryMark | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newInjury, setNewInjury] = useState<Partial<InjuryMark>>({});

  const handleBodyClick = (event: React.MouseEvent<SVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    const injury: InjuryMark = {
      id: Date.now().toString(),
      x,
      y,
      view: selectedView,
      details: {
        description: '',
        date: new Date(),
        doctor: '',
        notes: '',
        severity: 'minor'
      }
    };

    setNewInjury(injury);
    setIsDialogOpen(true);
  };

  const saveInjury = () => {
    if (newInjury.id) {
      setInjuries(prev => [...prev, newInjury as InjuryMark]);
      setNewInjury({});
      setIsDialogOpen(false);
    }
  };

  const deleteInjury = (id: string) => {
    setInjuries(prev => prev.filter(injury => injury.id !== id));
    setSelectedInjury(null);
  };

  const updateInjuryDetail = (field: string, value: any) => {
    setNewInjury(prev => ({
      ...prev,
      details: {
        ...prev.details,
        [field]: value
      }
    }));
  };

  const currentInjuries = injuries.filter(injury => injury.view === selectedView);

  // More realistic human body silhouette SVG paths
  const frontBodyPath = `
    M 50 8
    C 46 8 43 11 43 15
    C 43 19 46 22 50 22
    C 54 22 57 19 57 15
    C 57 11 54 8 50 8 Z
    
    M 50 22
    C 48 22 46 24 46 26
    L 46 32
    C 44 34 42 36 40 38
    L 38 42
    C 36 44 34 46 32 48
    L 32 52
    C 30 54 28 56 28 60
    L 28 78
    C 28 82 30 84 32 86
    L 34 90
    C 36 92 38 94 40 96
    L 42 100
    C 44 102 46 104 48 106
    L 50 108
    C 52 106 54 104 56 102
    L 58 100
    C 60 98 62 96 64 94
    L 66 90
    C 68 88 70 86 70 82
    L 70 78
    C 70 74 68 72 66 70
    L 64 66
    C 62 64 60 62 58 60
    L 56 56
    C 54 54 52 52 50 50
    C 48 52 46 54 44 56
    L 42 60
    C 40 62 38 64 36 66
    L 34 70
    C 32 72 30 74 30 78
    L 30 82
    C 30 86 32 88 34 90
    L 36 94
    C 38 96 40 98 42 100
    L 44 104
    C 46 106 48 108 50 110
    C 52 108 54 106 56 104
    L 58 100
    C 60 98 62 96 64 94
    L 66 90
    C 68 88 70 86 70 82
    L 70 60
    C 72 56 74 54 76 52
    L 78 48
    C 80 46 82 44 84 42
    L 86 38
    C 88 36 90 34 92 32
    L 92 26
    C 92 24 90 22 88 22
    L 50 22
    
    M 30 108
    L 28 140
    C 28 144 26 148 24 152
    L 22 156
    C 20 160 18 164 18 168
    L 18 185
    C 18 189 20 193 24 193
    C 28 193 32 189 32 185
    L 32 168
    C 32 164 34 160 36 156
    L 38 152
    C 40 148 42 144 42 140
    L 44 108
    
    M 70 108
    L 72 140
    C 72 144 74 148 76 152
    L 78 156
    C 80 160 82 164 82 168
    L 82 185
    C 82 189 80 193 76 193
    C 72 193 68 189 68 185
    L 68 168
    C 68 164 66 160 64 156
    L 62 152
    C 60 148 58 144 58 140
    L 56 108
  `;
  
  const backBodyPath = `
    M 50 8
    C 46 8 43 11 43 15
    C 43 19 46 22 50 22
    C 54 22 57 19 57 15
    C 57 11 54 8 50 8 Z
    
    M 50 22
    C 48 22 46 24 46 26
    L 46 32
    C 44 34 42 36 40 38
    L 38 42
    C 36 44 34 46 32 48
    L 32 52
    C 30 54 28 56 28 60
    L 28 78
    C 28 82 30 84 32 86
    L 34 90
    C 36 92 38 94 40 96
    L 42 100
    C 44 102 46 104 48 106
    L 50 108
    C 52 106 54 104 56 102
    L 58 100
    C 60 98 62 96 64 94
    L 66 90
    C 68 88 70 86 70 82
    L 70 60
    C 72 56 74 54 76 52
    L 78 48
    C 80 46 82 44 84 42
    L 86 38
    C 88 36 90 34 92 32
    L 92 26
    C 92 24 90 22 88 22
    L 50 22
    
    M 30 108
    L 28 140
    C 28 144 26 148 24 152
    L 22 156
    C 20 160 18 164 18 168
    L 18 185
    C 18 189 20 193 24 193
    C 28 193 32 189 32 185
    L 32 168
    C 32 164 34 160 36 156
    L 38 152
    C 40 148 42 144 42 140
    L 44 108
    
    M 70 108
    L 72 140
    C 72 144 74 148 76 152
    L 78 156
    C 80 160 82 164 82 168
    L 82 185
    C 82 189 80 193 76 193
    C 72 193 68 189 68 185
    L 68 168
    C 68 164 66 160 64 156
    L 62 152
    C 60 148 58 144 58 140
    L 56 108
  `;
  
  // Simplified, cleaner human silhouette
  const simpleFrontPath = "M50 5 C45 5 42 8 42 12 C42 16 45 19 50 19 C55 19 58 16 58 12 C58 8 55 5 50 5 Z M50 19 L48 22 C45 25 42 28 40 32 L35 40 C32 45 30 50 30 55 L30 85 C30 88 28 90 25 92 L20 95 C18 96 16 98 16 101 L16 140 C16 143 15 145 12 147 L8 150 C6 152 5 155 5 158 L5 185 C5 188 7 190 10 190 C13 190 15 188 15 185 L15 165 C15 162 17 160 20 160 C23 160 25 162 25 165 L25 185 C25 188 27 190 30 190 C33 190 35 188 35 185 L35 150 C35 147 37 145 40 145 L45 145 C48 145 50 143 50 140 L50 95 C50 92 52 90 55 92 L60 95 C62 96 64 98 64 101 L64 140 C64 143 65 145 68 147 L72 150 C74 152 75 155 75 158 L75 185 C75 188 77 190 80 190 C83 190 85 188 85 185 L85 165 C85 162 87 160 90 160 C93 160 95 162 95 165 L95 185 C95 188 97 190 100 190 C103 190 105 188 105 185 L105 158 C105 155 104 152 102 150 L98 147 C95 145 94 143 94 140 L94 101 C94 98 92 96 90 95 L85 92 C82 90 80 88 80 85 L80 55 C80 50 78 45 75 40 L70 32 C68 28 65 25 62 22 L60 19 C58 19 55 19 55 12 C55 8 58 16 58 12 C58 8 55 5 50 5";
  
  const simpleBackPath = "M50 5 C45 5 42 8 42 12 C42 16 45 19 50 19 C55 19 58 16 58 12 C58 8 55 5 50 5 Z M50 19 L48 22 C45 25 42 28 40 32 L35 40 C32 45 30 50 30 55 L30 85 C30 88 28 90 25 92 L20 95 C18 96 16 98 16 101 L16 140 C16 143 15 145 12 147 L8 150 C6 152 5 155 5 158 L5 185 C5 188 7 190 10 190 C13 190 15 188 15 185 L15 165 C15 162 17 160 20 160 C23 160 25 162 25 165 L25 185 C25 188 27 190 30 190 C33 190 35 188 35 185 L35 150 C35 147 37 145 40 145 L45 145 C48 145 50 143 50 140 L50 95 C50 92 52 90 55 92 L60 95 C62 96 64 98 64 101 L64 140 C64 143 65 145 68 147 L72 150 C74 152 75 155 75 158 L75 185 C75 188 77 190 80 190 C83 190 85 188 85 185 L85 165 C85 162 87 160 90 160 C93 160 95 162 95 165 L95 185 C95 188 97 190 100 190 C103 190 105 188 105 185 L105 158 C105 155 104 152 102 150 L98 147 C95 145 94 143 94 140 L94 101 C94 98 92 96 90 95 L85 92 C82 90 80 88 80 85 L80 55 C80 50 78 45 75 40 L70 32 C68 28 65 25 62 22 L60 19 C58 19 55 19 55 12 C55 8 58 16 58 12 C58 8 55 5 50 5";

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Body Injury Tracker
          <Badge variant="outline" className="text-xs">Click to mark injuries</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 justify-center">
          <Button
            variant={selectedView === 'front' ? 'default' : 'outline'}
            onClick={() => setSelectedView('front')}
            size="sm"
          >
            Front View
          </Button>
          <Button
            variant={selectedView === 'back' ? 'default' : 'outline'}
            onClick={() => setSelectedView('back')}
            size="sm"
          >
            Back View
          </Button>
        </div>

        <div className="flex justify-center">
          <div className="relative">
            <svg
              width="200"
              height="400"
              viewBox="0 0 100 200"
              className="border border-border rounded-lg bg-muted/20 cursor-crosshair"
              onClick={handleBodyClick}
            >
              {/* Body silhouette */}
              <path
                d={selectedView === 'front' ? simpleFrontPath : simpleBackPath}
                fill="hsl(var(--muted))"
                stroke="hsl(var(--border))"
                strokeWidth="1"
              />
              
              {/* Injury markers */}
              {currentInjuries.map((injury) => (
                <circle
                  key={injury.id}
                  cx={injury.x}
                  cy={injury.y}
                  r="2"
                  fill="hsl(var(--destructive))"
                  stroke="white"
                  strokeWidth="1"
                  className="cursor-pointer hover:r-3 transition-all"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedInjury(injury);
                  }}
                />
              ))}
            </svg>
            
            {/* Injury count */}
            <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded-full px-2 py-1 text-xs">
              {currentInjuries.length} injuries
            </div>
          </div>
        </div>

        {/* Injury list */}
        {injuries.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Recorded Injuries</h3>
            <div className="grid gap-2 max-h-32 overflow-y-auto">
              {injuries.map((injury) => (
                <div key={injury.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{injury.details.description || 'Unlabeled injury'}</p>
                    <p className="text-xs text-muted-foreground">
                      {injury.view} view • {format(injury.details.date, 'MMM d, yyyy')}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteInjury(injury.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Injury details dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Injury Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newInjury.details?.description || ''}
                  onChange={(e) => updateInjuryDetail('description', e.target.value)}
                  placeholder="e.g., Bruise on shoulder"
                />
              </div>

              <div>
                <Label>Date of Injury</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !newInjury.details?.date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newInjury.details?.date ? 
                        format(newInjury.details.date, "PPP") : 
                        <span>Pick a date</span>
                      }
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={newInjury.details?.date}
                      onSelect={(date) => updateInjuryDetail('date', date)}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="doctor">Doctor Seen</Label>
                <Input
                  id="doctor"
                  value={newInjury.details?.doctor || ''}
                  onChange={(e) => updateInjuryDetail('doctor', e.target.value)}
                  placeholder="Dr. Smith"
                />
              </div>

              <div>
                <Label htmlFor="severity">Severity</Label>
                <select
                  id="severity"
                  className="w-full p-2 border border-border rounded-md bg-background"
                  value={newInjury.details?.severity || 'minor'}
                  onChange={(e) => updateInjuryDetail('severity', e.target.value)}
                >
                  <option value="minor">Minor</option>
                  <option value="moderate">Moderate</option>
                  <option value="severe">Severe</option>
                </select>
              </div>

              <div>
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={newInjury.details?.notes || ''}
                  onChange={(e) => updateInjuryDetail('notes', e.target.value)}
                  placeholder="Additional details, treatment notes..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={saveInjury} className="flex-1">
                  Save Injury
                </Button>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

const ResidentSummary = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  
  const metricsData: MetricData[] = [
    { label: "Fluids", value: 75, max: 100, color: "hsl(var(--primary))", icon: "💧" },
    { label: "Calls", value: 3, max: 10, color: "hsl(var(--secondary))", icon: "📞" },
    { label: "Falls", value: 0, max: 5, color: "hsl(var(--accent))", icon: "⚠️" },
    { label: "Medication", value: 90, max: 100, color: "hsl(var(--success))", icon: "💊" },
    { label: "Sleep", value: 85, max: 100, color: "hsl(var(--info))", icon: "😴" },
    { label: "Activity", value: 65, max: 100, color: "hsl(var(--warning))", icon: "🚶" }
  ];

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 300;
    const height = 300;
    const centerX = width / 2;
    const centerY = height / 2;
    const innerRadius = 60;
    const outerRadius = 120;

    svg.attr("width", width).attr("height", height);

    const angleStep = (2 * Math.PI) / metricsData.length;
    
    metricsData.forEach((metric, index) => {
      const startAngle = index * angleStep - Math.PI / 2;
      const endAngle = startAngle + angleStep * 0.8; // Leave gap between segments
      
      // Background arc
      const backgroundArc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius)
        .startAngle(startAngle)
        .endAngle(startAngle + angleStep * 0.8);

      svg.append("path")
        .attr("d", backgroundArc as any)
        .attr("transform", `translate(${centerX}, ${centerY})`)
        .attr("fill", "hsl(var(--muted))")
        .attr("opacity", 0.2);

      // Progress arc
      const progressAngle = startAngle + (endAngle - startAngle) * (metric.value / metric.max);
      const progressArc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius)
        .startAngle(startAngle)
        .endAngle(progressAngle);

      svg.append("path")
        .attr("d", progressArc as any)
        .attr("transform", `translate(${centerX}, ${centerY})`)
        .attr("fill", metric.color)
        .attr("opacity", 0.8);

      // Label position
      const labelAngle = startAngle + (endAngle - startAngle) / 2;
      const labelRadius = outerRadius + 20;
      const labelX = centerX + Math.cos(labelAngle) * labelRadius;
      const labelY = centerY + Math.sin(labelAngle) * labelRadius;

      // Icon
      svg.append("text")
        .attr("x", labelX)
        .attr("y", labelY - 8)
        .attr("text-anchor", "middle")
        .attr("font-size", "16px")
        .text(metric.icon);

      // Label
      svg.append("text")
        .attr("x", labelX)
        .attr("y", labelY + 8)
        .attr("text-anchor", "middle")
        .attr("font-size", "10px")
        .attr("fill", "hsl(var(--foreground))")
        .text(metric.label);

      // Value
      svg.append("text")
        .attr("x", labelX)
        .attr("y", labelY + 20)
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("fill", metric.color)
        .attr("font-weight", "bold")
        .text(`${metric.value}${metric.label === "Calls" || metric.label === "Falls" ? "" : "%"}`);
    });

  }, []);

  return (
    <Card className="w-fit mx-auto">
      <CardHeader className="text-center pb-4">
        <CardTitle className="flex items-center gap-2 justify-center">
          <span>Resident Summary</span>
          <Badge variant="outline" className="text-xs">Live</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="relative">
        <div className="relative">
          <svg ref={svgRef} className="block" />
          {/* Avatar in center */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Avatar className="w-16 h-16 border-4 border-background shadow-lg">
              <AvatarImage src="/placeholder.svg" alt="Resident" />
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                JD
              </AvatarFallback>
            </Avatar>
            <div className="text-center mt-2">
              <p className="font-semibold text-sm">John Doe</p>
              <p className="text-xs text-muted-foreground">Room 204</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const MetricCard = ({ title, value, subtitle, color }: {
  title: string;
  value: string;
  subtitle: string;
  color: string;
}) => (
  <Card>
    <CardContent className="p-4">
      <div className="flex items-center gap-3">
        <div 
          className="w-3 h-3 rounded-full" 
          style={{ backgroundColor: color }}
        />
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const Examples = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard Components</h1>
          <p className="text-muted-foreground">Example dashboard components for resident monitoring</p>
        </div>

        <div className="grid gap-8">
          {/* Resident Summary Component */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Resident Summary</h2>
            <div className="flex justify-center">
              <ResidentSummary />
            </div>
          </section>

          {/* Body Injury Tracker */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Body Injury Tracker</h2>
            <BodyDiagram />
          </section>

          {/* Additional Metric Cards */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Quick Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Daily Hydration"
                value="1.2L"
                subtitle="Target: 1.5L"
                color="hsl(var(--primary))"
              />
              <MetricCard
                title="Emergency Calls"
                value="2"
                subtitle="Last 24 hours"
                color="hsl(var(--destructive))"
              />
              <MetricCard
                title="Medication Compliance"
                value="95%"
                subtitle="This week"
                color="hsl(var(--success))"
              />
              <MetricCard
                title="Activity Score"
                value="78"
                subtitle="Above average"
                color="hsl(var(--info))"
              />
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Examples;