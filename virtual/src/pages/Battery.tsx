import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Battery as BatteryIcon, BatteryLow, Zap, AlertTriangle } from "lucide-react";

const Battery = () => {
  const batteryData = [
    {
      title: "Critical Devices",
      value: "3",
      change: "+1 from yesterday",
      changeType: "negative" as const,
      icon: AlertTriangle
    },
    {
      title: "Low Battery",
      value: "12",
      change: "+5% from yesterday", 
      changeType: "negative" as const,
      icon: BatteryLow
    },
    {
      title: "Normal Levels",
      value: "87",
      change: "-3% from yesterday",
      changeType: "positive" as const,
      icon: BatteryIcon
    },
    {
      title: "Charging",
      value: "24",
      change: "+8% from yesterday",
      changeType: "positive" as const,
      icon: Zap
    }
  ];

  const deviceList = [
    { name: "Sensor Alpha-01", level: 15, status: "critical", location: "Building A" },
    { name: "Monitor Beta-02", level: 8, status: "critical", location: "Building B" },
    { name: "Camera Gamma-03", level: 3, status: "critical", location: "Parking Lot" },
    { name: "Controller Delta-04", level: 25, status: "low", location: "Main Entrance" },
    { name: "Tracker Echo-05", level: 18, status: "low", location: "Warehouse" },
    { name: "Display Foxtrot-06", level: 22, status: "low", location: "Reception" }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical": return "text-destructive";
      case "low": return "text-warning";
      default: return "text-success";
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case "critical": return "bg-destructive-muted";
      case "low": return "bg-warning-muted";
      default: return "bg-success-muted";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Battery Levels</h1>
          <p className="text-muted-foreground mt-2">
            Monitor and manage device battery levels across your network
          </p>
        </div>

        {/* Battery Overview Cards */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {batteryData.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>

        {/* Device List */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Device Status</h3>
            <div className="space-y-4">
              {deviceList.map((device, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg border bg-card">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${getStatusBg(device.status)}`}>
                      <BatteryIcon className={`h-5 w-5 ${getStatusColor(device.status)}`} />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{device.name}</h4>
                      <p className="text-sm text-muted-foreground">{device.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-semibold ${getStatusColor(device.status)}`}>
                      {device.level}%
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-full ${getStatusBg(device.status)} ${getStatusColor(device.status)}`}>
                      {device.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Battery;