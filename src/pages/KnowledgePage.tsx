import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Zap, 
  RefreshCcw, 
  Database, 
  Trash2, 
  Layers, 
  Activity,
  BarChart3
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
const mockChartData = [
  { name: 'Mon', retention: 85, density: 40 },
  { name: 'Tue', retention: 78, density: 45 },
  { name: 'Wed', retention: 92, density: 55 },
  { name: 'Thu', retention: 88, density: 62 },
  { name: 'Fri', retention: 81, density: 68 },
  { name: 'Sat', retention: 95, density: 75 },
  { name: 'Sun', retention: 89, density: 82 },
];
export function KnowledgePage() {
  return (
    <AppLayout container>
      <div className="space-y-12">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/10 pb-10">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold">Knowledge Management</h1>
            <p className="text-muted-foreground text-lg">Tune the Layered Memory Protocol (LMP) parameters.</p>
          </div>
          <div className="flex gap-4">
            <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 text-center min-w-[120px]">
              <div className="text-2xs font-bold text-indigo-400 uppercase tracking-widest mb-1">Health</div>
              <div className="text-2xl font-extrabold">98.4%</div>
            </div>
            <div className="p-4 bg-orange-500/10 rounded-2xl border border-orange-500/20 text-center min-w-[120px]">
              <div className="text-2xs font-bold text-orange-400 uppercase tracking-widest mb-1">Density</div>
              <div className="text-2xl font-extrabold">4.2GB</div>
            </div>
          </div>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Controls */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="glass-panel border-white/5">
              <CardHeader className="border-b border-white/5">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-indigo-400" />
                  <CardTitle>Memory Retention Metrics</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      stroke="#888888" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <YAxis 
                      stroke="#888888" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#000', border: '1px solid #ffffff10', borderRadius: '12px' }}
                      itemStyle={{ color: '#6366f1' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="retention" 
                      stroke="#6366f1" 
                      strokeWidth={3} 
                      dot={{ fill: '#6366f1', strokeWidth: 2 }} 
                      activeDot={{ r: 8 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="density" 
                      stroke="#f97316" 
                      strokeWidth={2} 
                      strokeDasharray="5 5"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="glass-panel border-white/5">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Trash2 className="w-4 h-4 text-destructive" />
                    Auto-Pruning
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Enabled</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Aggression</span>
                        <span>Medium</span>
                      </div>
                      <Slider defaultValue={[45]} max={100} step={1} />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="glass-panel border-white/5">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="w-4 h-4 text-orange-400" />
                    Temporal Decay
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Dynamic Decay</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Decay Half-life</span>
                        <span>48 Hours</span>
                      </div>
                      <Slider defaultValue={[70]} max={100} step={1} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          {/* Sidebar Stats */}
          <div className="space-y-6">
            <Card className="glass-panel border-white/5 bg-indigo-500/5">
              <CardHeader>
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-indigo-400">System Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: 'Active Layers', value: '5', icon: Layers },
                  { label: 'Semantic Nodes', value: '1,420', icon: Brain },
                  { label: 'DB Connections', value: 'Healthy', icon: Database },
                  { label: 'Sync Status', value: 'Live', icon: RefreshCcw },
                ].map((stat, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-3">
                      <stat.icon className="w-4 h-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{stat.label}</span>
                    </div>
                    <span className="text-xs font-bold text-foreground">{stat.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
            <div className="p-6 rounded-3xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-center space-y-4">
               <BarChart3 className="w-10 h-10 text-muted-foreground/30" />
               <div>
                  <h4 className="font-bold text-sm">Context Retention Analysis</h4>
                  <p className="text-xs text-muted-foreground px-4">Detailed analysis of how your specific workspaces are performing over long durations.</p>
               </div>
               <Badge className="bg-white/5 text-foreground hover:bg-white/10 cursor-pointer">Upgrade to Pro</Badge>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}