import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Target,
  Clock,
  Users,
  Eye,
  MousePointer
} from "lucide-react";

const Analytics = () => {
  const analyticsMetrics = [
    {
      title: "Page Views",
      value: "45,231",
      change: "+18.2%",
      changeType: "positive" as const,
      icon: Eye,
    },
    {
      title: "Unique Visitors",
      value: "12,847",
      change: "+12.5%",
      changeType: "positive" as const,
      icon: Users,
    },
    {
      title: "Conversion Rate",
      value: "3.24%",
      change: "-2.1%",
      changeType: "negative" as const,
      icon: Target,
    },
    {
      title: "Avg. Session Duration",
      value: "4m 32s",
      change: "+8.7%",
      changeType: "positive" as const,
      icon: Clock,
    },
  ];

  const topPages = [
    { page: "/dashboard", views: 12450, change: "+15%" },
    { page: "/reports", views: 8920, change: "+8%" },
    { page: "/analytics", views: 6780, change: "+22%" },
    { page: "/team", views: 4320, change: "-3%" },
    { page: "/users", views: 3890, change: "+12%" },
  ];

  const trafficSources = [
    { source: "Direct", visitors: 8450, percentage: 35 },
    { source: "Search Engines", visitors: 6780, percentage: 28 },
    { source: "Social Media", visitors: 4320, percentage: 18 },
    { source: "Email", visitors: 2890, percentage: 12 },
    { source: "Referrals", visitors: 1670, percentage: 7 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Arquella</h1>
          <p className="mt-2 text-muted-foreground">
            Track user behavior and platform performance
          </p>
        </div>

        {/* Analytics Metrics */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {analyticsMetrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Traffic Overview */}
          <div className="dashboard-card rounded-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/10">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-card-foreground">
                Traffic Overview
              </h2>
            </div>
            
            <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Interactive chart visualization</p>
                <p className="text-sm text-muted-foreground mt-1">Connect your analytics provider</p>
              </div>
            </div>
          </div>

          {/* Conversion Funnel */}
          <div className="dashboard-card rounded-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-secondary/10">
                <Target className="h-5 w-5 text-secondary" />
              </div>
              <h2 className="text-xl font-semibold text-card-foreground">
                Conversion Funnel
              </h2>
            </div>
            
            <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MousePointer className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Funnel analysis chart</p>
                <p className="text-sm text-muted-foreground mt-1">Track user journey steps</p>
              </div>
            </div>
          </div>
        </div>

        {/* Data Tables Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Pages */}
          <div className="dashboard-card rounded-lg p-6">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">
              Top Pages
            </h3>
            <div className="space-y-4">
              {topPages.map((page, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-medium text-card-foreground">
                      {page.page}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-muted-foreground">
                      {page.views.toLocaleString()} views
                    </div>
                    <div
                      className={`text-sm font-medium ${
                        page.change.startsWith('+') 
                          ? 'text-success' 
                          : 'text-destructive'
                      }`}
                    >
                      {page.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Traffic Sources */}
          <div className="dashboard-card rounded-lg p-6">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">
              Traffic Sources
            </h3>
            <div className="space-y-4">
              {trafficSources.map((source, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-card-foreground">
                      {source.source}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {source.visitors.toLocaleString()} ({source.percentage}%)
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${source.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="dashboard-card rounded-lg p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            Real-time Activity
          </h3>
          <div className="space-y-3">
            {[
              { user: "john@client.com", action: "Viewed Dashboard", time: "2 minutes ago", page: "/dashboard" },
              { user: "sarah@company.com", action: "Generated Report", time: "5 minutes ago", page: "/reports" },
              { user: "mike@startup.com", action: "Updated Profile", time: "8 minutes ago", page: "/profile" },
              { user: "emily@corp.com", action: "Accessed Analytics", time: "12 minutes ago", page: "/analytics" },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-card-foreground">
                      {activity.user}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {activity.action} • {activity.page}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {activity.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;