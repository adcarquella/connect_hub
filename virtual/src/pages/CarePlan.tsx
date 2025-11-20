import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  Edit, 
  AlertTriangle, 
  Plus, 
  User, 
  Heart, 
  Droplets,
  Clock,
  CheckCircle,
  XCircle,
  HelpCircle
} from "lucide-react";

interface CareItem {
  id: string;
  category: string;
  status: "complete" | "incomplete" | "pending";
  priority: "high" | "medium" | "low";
  notes?: string;
}

interface UrineRecord {
  id: string;
  time: string;
  amount: string;
  color: string;
  consistency: string;
  continent: boolean;
  pad: boolean;
}

const CarePlan = () => {
  const [careNotes, setCareNotes] = useState("Patient initial exam completed - admitted following worsening breathing");
  const [careItems, setCareItems] = useState<CareItem[]>([
    { id: "1", category: "Personal Care and Continence", status: "incomplete", priority: "medium" },
    { id: "2", category: "Continence", status: "incomplete", priority: "low" },
  ]);
  
  const [urineRecords, setUrineRecords] = useState<UrineRecord[]>([
    { id: "1", time: "08:00", amount: "250ml", color: "Yellow", consistency: "Normal", continent: true, pad: false },
    { id: "2", time: "12:30", amount: "180ml", color: "Light Yellow", consistency: "Normal", continent: true, pad: false },
  ]);

  const resident = {
    name: "Ben Johnson",
    preferredName: "Ben",
    dob: "15/06/1947",
    age: "77 years 11 months 22 days",
    id: "UN-234567",
    room: "Room 02"
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "complete":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "incomplete":
        return <XCircle className="h-4 w-4 text-destructive" />;
      case "pending":
        return <HelpCircle className="h-4 w-4 text-warning" />;
      default:
        return <HelpCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-destructive text-destructive-foreground";
      case "medium":
        return "bg-warning text-warning-foreground";
      case "low":
        return "bg-success text-success-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Care Plan</h1>
        </div>

        {/* Resident Profile */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-primary text-primary-foreground text-lg">BJ</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h2 className="text-xl font-semibold">{resident.name}</h2>
                  <p className="text-sm text-muted-foreground">ID: {resident.id}</p>
                  <p className="text-sm text-muted-foreground">{resident.room}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge className={getPriorityColor("high")}>DS - High</Badge>
                <Button size="sm" variant="outline">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Name: {resident.name}</p>
                <p className="text-sm font-medium">Preferred Name: {resident.preferredName}</p>
                <p className="text-sm font-medium">D.O.B: {resident.dob}</p>
                <p className="text-sm font-medium">Age: {resident.age}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Full Personal Information
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* General Care Notes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              General Care Notes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Patient initial exam"
              value={careNotes}
              onChange={(e) => setCareNotes(e.target.value)}
              className="min-h-[100px]"
            />
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Note
            </Button>
          </CardContent>
        </Card>

        {/* Actions & Incidents */}
        <Card className="border-warning/50 bg-warning/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Actions & Incidents
              <Badge variant="secondary">Action Required</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {careItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-card rounded-lg border">
                <div className="flex items-center gap-3">
                  {getStatusIcon(item.status)}
                  <span className="font-medium">{item.category}</span>
                  <Badge className={getPriorityColor(item.priority)} variant="secondary">
                    {item.priority}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground capitalize">{item.status}</span>
                  <Button size="sm" variant="ghost">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Urine Monitoring */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplets className="h-5 w-5 text-blue-500" />
              Urine
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-6 gap-4 text-sm font-medium text-muted-foreground border-b pb-2">
                <span>Care Task</span>
                <span>OHCG Task</span>
                <span>Task Information</span>
                <span>Completed Allocation</span>
                <span>Time Period</span>
                <span>Carer Comment</span>
              </div>
              
              {urineRecords.map((record) => (
                <div key={record.id} className="grid grid-cols-6 gap-4 text-sm items-center py-2 border-b">
                  <div className="flex items-center gap-2">
                    <Checkbox />
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <span>{record.time}</span>
                  <div className="space-y-1">
                    <p>Amount: {record.amount}</p>
                    <p>Color: {record.color}</p>
                    <p>Consistency: {record.consistency}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={record.continent ? "secondary" : "destructive"}>
                      {record.continent ? "Continent" : "Incontinent"}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline">24hr Collection</Badge>
                  </div>
                  <Button size="sm" variant="outline">View Comments</Button>
                </div>
              ))}
              
              <Button variant="outline" size="sm" className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Add Row
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Bowels Monitoring */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-green-500" />
              Bowels
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Frequency: Constipated; one, sometimes digestion in bowel movements</p>
              
              <div className="grid grid-cols-6 gap-4 text-sm font-medium text-muted-foreground border-b pb-2">
                <span>Care Task</span>
                <span>OHCG Task</span>
                <span>Task Information</span>
                <span>Completed Allocation</span>
                <span>Time Period</span>
                <span>Carer Comment</span>
              </div>
              
              <div className="grid grid-cols-6 gap-4 text-sm items-center py-2 border-b">
                <div className="flex items-center gap-2">
                  <Checkbox />
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
                <span>Morning</span>
                <div className="space-y-1">
                  <p>Bristol Chart: 4</p>
                  <p>Amount: Normal</p>
                </div>
                <div className="flex gap-2">
                  <Badge variant="secondary">Completed</Badge>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline">Daily Record</Badge>
                </div>
                <Button size="sm" variant="outline">View Comments</Button>
              </div>
              
              <Button variant="outline" size="sm" className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Add Row
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CarePlan;