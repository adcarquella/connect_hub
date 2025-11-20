import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { QuickActions } from "@/components/calls/QuickActions";
import { Calendar, Clock, MapPin, User, UserCheck } from "lucide-react";

interface Call {
  id: number;
  type: string;
  subType: string;
  location: string;
  category: string;
  status: string;
  startTime: string;
  endTime: string;
  duration: string;
  unit: string;
  residentName: string;
  staffMember: string;
  resultedInInjury: boolean;
  comments: string;
  quickActions: string[];
}

interface EditCallDialogProps {
  call: Call | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (call: Call) => void;
}

export const EditCallDialog = ({ call, open, onOpenChange, onSave }: EditCallDialogProps) => {
  const [formData, setFormData] = useState<Call | null>(null);

  useEffect(() => {
    if (call) {
      setFormData({ ...call });
    }
  }, [call]);

  if (!formData) return null;

  const handleSave = () => {
    onSave(formData);
  };

  const handleQuickActionToggle = (actionId: string) => {
    setFormData(prev => {
      if (!prev) return null;
      const actions = prev.quickActions.includes(actionId)
        ? prev.quickActions.filter(id => id !== actionId)
        : [...prev.quickActions, actionId];
      return { ...prev, quickActions: actions };
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Edit Call Details - {formData.residentName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Call Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Call Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{formData.type}</Badge>
                    <Badge variant="secondary" className="text-xs">{formData.subType}</Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    Location
                  </Label>
                  <div className="font-mono text-sm bg-muted p-2 rounded">
                    {formData.location}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Start Time
                  </Label>
                  <div className="text-sm bg-muted p-2 rounded">
                    {formData.startTime}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Duration</Label>
                  <div className="font-mono font-medium text-sm bg-muted p-2 rounded">
                    {formData.duration}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Staff and Outcome */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <UserCheck className="h-4 w-4" />
                Staff Response & Outcome
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="staffMember">Staff Member</Label>
                <Input
                  id="staffMember"
                  value={formData.staffMember}
                  onChange={(e) => setFormData(prev => prev ? { ...prev, staffMember: e.target.value } : null)}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="injury"
                  checked={formData.resultedInInjury}
                  onCheckedChange={(checked) => 
                    setFormData(prev => prev ? { ...prev, resultedInInjury: checked } : null)
                  }
                />
                <Label htmlFor="injury" className="text-sm font-medium">
                  Call resulted in injury
                </Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="comments">Comments & Notes</Label>
                <Textarea
                  id="comments"
                  placeholder="Add any relevant notes about this call..."
                  value={formData.comments}
                  onChange={(e) => setFormData(prev => prev ? { ...prev, comments: e.target.value } : null)}
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Quick Action Categories</CardTitle>
              <CardDescription>
                Select relevant care categories for this call
              </CardDescription>
            </CardHeader>
            <CardContent>
              <QuickActions
                selectedActions={formData.quickActions}
                onActionToggle={handleQuickActionToggle}
              />
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};