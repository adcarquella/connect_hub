import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Settings, Bell, Shield, Database, Wifi, Monitor } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Configuration = () => {
  const configSections = [
    {
      title: "System Settings",
      description: "Configure core system parameters",
      icon: Settings,
      items: [
        { label: "Auto-refresh interval", type: "select", value: "30s", options: ["10s", "30s", "60s", "5min"] },
        { label: "Data retention period", type: "select", value: "90 days", options: ["30 days", "90 days", "180 days", "1 year"] },
        { label: "System timezone", type: "select", value: "UTC", options: ["UTC", "EST", "PST", "GMT"] }
      ]
    },
    {
      title: "Notifications",
      description: "Manage alert and notification preferences",
      icon: Bell,
      items: [
        { label: "Email notifications", type: "toggle", value: true },
        { label: "Push notifications", type: "toggle", value: false },
        { label: "Battery alerts", type: "toggle", value: true },
        { label: "System maintenance alerts", type: "toggle", value: true }
      ]
    },
    {
      title: "Security",
      description: "Configure security and access controls",
      icon: Shield,
      items: [
        { label: "Two-factor authentication", type: "toggle", value: false },
        { label: "Session timeout", type: "select", value: "4 hours", options: ["1 hour", "4 hours", "8 hours", "24 hours"] },
        { label: "API rate limiting", type: "toggle", value: true }
      ]
    },
    {
      title: "Database",
      description: "Database connection and backup settings",
      icon: Database,
      items: [
        { label: "Auto-backup", type: "toggle", value: true },
        { label: "Backup frequency", type: "select", value: "Daily", options: ["Hourly", "Daily", "Weekly"] },
        { label: "Connection pool size", type: "input", value: "10" }
      ]
    },
    {
      title: "Network",
      description: "Network and connectivity settings",
      icon: Wifi,
      items: [
        { label: "API endpoint", type: "input", value: "https://api.example.com" },
        { label: "Timeout duration", type: "select", value: "30s", options: ["10s", "30s", "60s", "120s"] },
        { label: "SSL verification", type: "toggle", value: true }
      ]
    },
    {
      title: "Display",
      description: "UI and display preferences",
      icon: Monitor,
      items: [
        { label: "Dark mode", type: "toggle", value: true },
        { label: "Compact view", type: "toggle", value: false },
        { label: "Animation effects", type: "toggle", value: true },
        { label: "Items per page", type: "select", value: "25", options: ["10", "25", "50", "100"] }
      ]
    }
  ];

  const renderConfigItem = (item: any, sectionIndex: number, itemIndex: number) => {
    const key = `${sectionIndex}-${itemIndex}`;
    
    switch (item.type) {
      case "toggle":
        return (
          <div className="flex items-center justify-between">
            <Label htmlFor={key} className="text-sm font-medium text-foreground">
              {item.label}
            </Label>
            <Switch id={key} defaultChecked={item.value} />
          </div>
        );
      
      case "select":
        return (
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              {item.label}
            </Label>
            <Select defaultValue={item.value}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {item.options?.map((option: string) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      
      case "input":
        return (
          <div className="space-y-2">
            <Label htmlFor={key} className="text-sm font-medium text-foreground">
              {item.label}
            </Label>
            <Input id={key} defaultValue={item.value} />
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Configuration</h1>
          <p className="text-muted-foreground mt-2">
            Manage system settings and preferences
          </p>
        </div>

        {/* Configuration Sections */}
        <div className="grid gap-6 lg:grid-cols-2">
          {configSections.map((section, sectionIndex) => {
            const Icon = section.icon;
            return (
              <Card key={sectionIndex} className="p-6 space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-primary-muted">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{section.title}</h3>
                    <p className="text-sm text-muted-foreground">{section.description}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {section.items.map((item, itemIndex) => (
                    <div key={itemIndex}>
                      {renderConfigItem(item, sectionIndex, itemIndex)}
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <Button variant="outline">
            Reset to Defaults
          </Button>
          <Button>
            Save Configuration
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Configuration;