import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export interface CallRecord {
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
  journeyId?: string;
}

interface CallTimelineProps {
  calls: CallRecord[];
  className?: string;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-primary";
    case "warning":
      return "bg-warning";
    case "completed":
      return "bg-success";
    default:
      return "bg-secondary";
  }
};

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

export const CallTimeline: React.FC<CallTimelineProps> = ({ calls, className }) => {
  const [selectedCall, setSelectedCall] = useState<CallRecord | null>(null);

  if (!calls || calls.length === 0) {
    return (
      <div className={cn("p-4 text-center text-muted-foreground", className)}>
        No call data available
      </div>
    );
  }

  // Sort calls by start time to create proper timeline
  const sortedCalls = [...calls].sort((a, b) => 
    new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );

  // Calculate timeline positioning
  const firstCall = sortedCalls[0];
  const lastCall = sortedCalls[sortedCalls.length - 1];
  const totalTimespan = new Date(lastCall.endTime).getTime() - new Date(firstCall.startTime).getTime();

  return (
    <Card className={cn("glass-panel", className)}>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Journey Timeline</span>
            <span className="text-muted-foreground">{calls.length} calls</span>
          </div>
          
          {/* Timeline Bar */}
          <div className="relative h-12 bg-muted/20 rounded-lg overflow-hidden">
            <div className="absolute inset-0 flex items-center">
              {sortedCalls.map((call, index) => {
                const callStart = new Date(call.startTime).getTime();
                const callEnd = new Date(call.endTime).getTime();
                const callDuration = callEnd - callStart;
                
                // Calculate position and width as percentages
                const startPercent = totalTimespan > 0 
                  ? ((callStart - new Date(firstCall.startTime).getTime()) / totalTimespan) * 100 
                  : (index / sortedCalls.length) * 100;
                
                const widthPercent = totalTimespan > 0 
                  ? (callDuration / totalTimespan) * 100
                  : 100 / sortedCalls.length;

                return (
                  <Popover key={call.id}>
                    <PopoverTrigger asChild>
                      <div
                        className={cn(
                          "absolute h-8 rounded transition-all duration-200 cursor-pointer border-2 border-background",
                          getStatusColor(call.status),
                          "hover:scale-105 hover:z-10 hover:shadow-md"
                        )}
                        style={{
                          left: `${startPercent}%`,
                          width: `${Math.max(widthPercent, 2)}%`, // Minimum width for visibility
                        }}
                        onClick={() => setSelectedCall(call)}
                      />
                    </PopoverTrigger>
                    <PopoverContent className="w-80" align="center">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">{call.type}</h4>
                          {getStatusBadge(call.status)}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-muted-foreground">Sub Type:</span>
                            <div className="font-medium">{call.subType}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Location:</span>
                            <div className="font-medium">{call.location}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Category:</span>
                            <div className="font-medium">{call.category}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Duration:</span>
                            <div className="font-medium font-mono">{call.duration}</div>
                          </div>
                        </div>

                        <div className="space-y-2 text-xs">
                          <div>
                            <span className="text-muted-foreground">Start:</span>
                            <div className="font-mono">{call.startTime}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">End:</span>
                            <div className="font-mono">{call.endTime}</div>
                          </div>
                        </div>

                        <div className="pt-2 border-t">
                          <span className="text-xs text-muted-foreground">Unit: {call.unit}</span>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                );
              })}
            </div>
          </div>

          {/* Timeline Labels */}
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{new Date(firstCall.startTime).toLocaleTimeString()}</span>
            <span>{new Date(lastCall.endTime).toLocaleTimeString()}</span>
          </div>

          {/* Quick Stats */}
          <div className="flex gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Active ({sortedCalls.filter(c => c.status === 'active').length})</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-warning rounded-full"></div>
              <span>Warning ({sortedCalls.filter(c => c.status === 'warning').length})</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span>Completed ({sortedCalls.filter(c => c.status === 'completed').length})</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};