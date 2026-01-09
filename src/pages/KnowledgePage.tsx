import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap, RefreshCcw, Database, Layers, Sparkles, Wand2, Lightbulb } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { knowledgeApi } from '@/lib/api-client';
import { motion, AnimatePresence } from 'framer-motion';
export function KnowledgePage() {
  const queryClient = useQueryClient();
  const { data: stats } = useQuery({ queryKey: ['knowledge-stats'], queryFn: knowledgeApi.getStats });
  const { data: ideas, isLoading } = useQuery({ queryKey: ['idea-burst'], queryFn: knowledgeApi.getIdeaBurst });
  const refreshIdeasMutation = useMutation({
    mutationFn: knowledgeApi.getIdeaBurst,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['idea-burst'] });
    }
  });
  return (
    <AppLayout container>
      <div className="space-y-12">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/10 pb-10">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold">Knowledge Dashboard</h1>
            <p className="text-muted-foreground text-lg">Memory retention & synthesis engine status.</p>
          </div>
          <div className="flex gap-4">
            <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 text-center min-w-[120px]">
              <div className="text-2xs font-bold text-indigo-400 uppercase tracking-widest mb-1">Health</div>
              <div className="text-2xl font-extrabold">{stats?.health || 98.4}%</div>
            </div>
            <div className="p-4 bg-orange-500/10 rounded-2xl border border-orange-500/20 text-center min-w-[120px]">
              <div className="text-2xs font-bold text-orange-400 uppercase tracking-widest mb-1">Density</div>
              <div className="text-2xl font-extrabold">{stats?.density || '4.2GB'}</div>
            </div>
          </div>
        </header>
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-indigo-400" />
              <h2 className="text-2xl font-bold">Agentic Idea Burst</h2>
            </div>
            <Button 
              variant="outline" 
              className="rounded-full border-indigo-500/30 hover:bg-indigo-500/10"
              onClick={() => refreshIdeasMutation.mutate()}
              disabled={refreshIdeasMutation.isPending}
            >
              <Wand2 className={`w-4 h-4 mr-2 ${refreshIdeasMutation.isPending ? 'animate-spin' : ''}`} />
              SCAMPER Tweak
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {isLoading ? Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="h-48 rounded-3xl bg-white/5 animate-pulse" />
              )) : ideas?.map((idea, idx) => (
                <motion.div
                  key={idea.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card className="glass-panel border-white/5 h-full hover:border-indigo-500/50 transition-colors group">
                    <CardHeader>
                      <Badge variant="secondary" className="w-fit mb-2 bg-indigo-500/10 text-indigo-300 border-indigo-500/20">
                        {idea.category}
                      </Badge>
                      <CardTitle className="text-lg group-hover:text-indigo-300 transition-colors">{idea.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground leading-relaxed">{idea.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="glass-panel border-white/5">
              <CardHeader className="border-b border-white/5">
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-indigo-400" />
                  <CardTitle>Memory Retention Metrics</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[
                    { name: 'M', r: 85, d: 40 }, { name: 'T', r: 78, d: 45 }, 
                    { name: 'W', r: 92, d: 55 }, { name: 'T', r: 88, d: 62 }, 
                    { name: 'F', r: 81, d: 68 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #ffffff10' }} />
                    <Line type="monotone" dataKey="r" stroke="#6366f1" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card className="glass-panel border-white/5 bg-indigo-500/5">
              <CardHeader>
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-indigo-400">System Architecture</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: 'LMP Layers', value: '5/5', icon: Layers },
                  { label: 'Vector Nodes', value: stats?.nodes || '1,420', icon: Brain },
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
          </div>
        </div>
      </div>
    </AppLayout>
  );
}