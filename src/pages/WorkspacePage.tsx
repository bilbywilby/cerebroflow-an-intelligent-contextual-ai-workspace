import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Send, Database, Sparkles, Brain, Loader2, ArrowLeft, History, 
  Zap, ShieldCheck, Terminal, Activity, Info 
} from 'lucide-react';
import { sessionApi } from '@/lib/api-client';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
export function WorkspacePage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [query, setQuery] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: session, isLoading } = useQuery({
    queryKey: ['session', sessionId],
    queryFn: () => sessionApi.get(sessionId!),
    enabled: !!sessionId,
  });
  const queryMutation = useMutation({
    mutationFn: ({ id, q, agent }: { id: string; q: string; agent: boolean }) => sessionApi.query(id, q, agent),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session', sessionId] });
      setQuery('');
      toast.success('LMP context updated');
    }
  });
  const toggleAgentMutation = useMutation({
    mutationFn: (active: boolean) => sessionApi.setAgentMode(sessionId!, active),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['session', sessionId] })
  });
  const checkpointMutation = useMutation({
    mutationFn: (interactionId: string) => sessionApi.createCheckpoint(sessionId!, `Checkpoint ${new Date().toLocaleTimeString()}`, interactionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      toast.success('State checkpoint captured');
    }
  });
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [session?.interactions]);
  return (
    <AppLayout contentClassName="h-screen flex flex-col p-0 overflow-hidden bg-background">
      <div className="flex-1 grid grid-cols-12 overflow-hidden">
        {/* Primary Interaction Column */}
        <div className="col-span-12 lg:col-span-8 xl:col-span-9 flex flex-col min-w-0 border-r border-white/5 relative bg-background/30 backdrop-blur-sm">
          <header className="p-4 border-b border-white/5 bg-background/50 backdrop-blur-md flex items-center justify-between z-10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                <Brain className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="min-w-0">
                <h2 className="font-bold truncate text-foreground text-sm uppercase tracking-widest">{session?.title || 'Loading Workspace...'}</h2>
              </div>
              <AnimatePresence>
                {session?.agentMode && (
                  <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
                    <Badge className="bg-indigo-500 shadow-glow animate-pulse text-[10px] py-0 px-2 border-none">Agent v1.0.13</Badge>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">Context Fusion</span>
                <Switch
                  checked={session?.agentMode || false}
                  onCheckedChange={(v) => toggleAgentMutation.mutate(v)}
                />
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate(`/history/${sessionId}`)} className="text-xs h-8">
                <History className="w-3.5 h-3.5 mr-2" /> Audit Trail
              </Button>
            </div>
          </header>
          <ScrollArea className="flex-1 p-4 lg:p-8">
            <div className="max-w-4xl mx-auto space-y-10 py-4">
              {isLoading ? (
                <div className="space-y-8">
                  <Skeleton className="h-24 w-3/4 ml-auto rounded-2xl" />
                  <Skeleton className="h-48 w-full rounded-2xl" />
                </div>
              ) : session?.interactions.map((interaction) => (
                <motion.div 
                  key={interaction.id} 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="group space-y-4"
                >
                  <div className="flex flex-col items-end gap-2">
                    <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-none px-5 py-4 max-w-[85%] text-sm shadow-lg">
                      {interaction.userQuery}
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                      {interaction.agentic ? <Zap className="w-5 h-5 text-indigo-400" /> : <Sparkles className="w-5 h-5 text-primary" />}
                    </div>
                    <div className="space-y-3 flex-1">
                      <div className="bg-muted/30 backdrop-blur-sm rounded-2xl rounded-tl-none px-6 py-5 text-sm text-foreground/90 border border-border shadow-sm group-hover:border-indigo-500/30 transition-colors relative">
                        {interaction.aiResponse}
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="absolute -right-12 top-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => checkpointMutation.mutate(interaction.id)}
                        >
                          <ShieldCheck className="w-4 h-4 text-indigo-400" />
                        </Button>
                      </div>
                      {interaction.metadata?.provenance && (
                        <div className="flex flex-wrap gap-2">
                          {interaction.metadata.provenance.map((p, idx) => (
                            <Badge key={idx} variant="outline" className="text-[9px] uppercase font-mono tracking-tighter opacity-70 bg-black/20 border-white/5">
                              [{p.layer}:{p.nodeId} s:{p.similarity}]
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>
          <div className="p-6 bg-background/50 border-t border-white/5">
            <div className="max-w-4xl mx-auto relative group">
              <Textarea
                placeholder={session?.agentMode ? "Agent Mode Engaged: Multi-context synthesis active..." : "Query CerebroFlow Memory Layers..."}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey && query.trim()) {
                    e.preventDefault();
                    queryMutation.mutate({ id: sessionId!, q: query, agent: session?.agentMode || false });
                  }
                }}
                className="bg-muted/50 border-white/10 pr-14 min-h-[100px] rounded-2xl transition-all focus:ring-indigo-500/50 resize-none group-hover:border-white/20"
              />
              <Button
                size="icon"
                className="absolute right-3 bottom-3 bg-indigo-500 hover:bg-indigo-600 rounded-xl shadow-glow h-10 w-10 transition-all active:scale-95"
                disabled={!query.trim() || queryMutation.isPending}
                onClick={() => queryMutation.mutate({ id: sessionId!, q: query, agent: session?.agentMode || false })}
              >
                {queryMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
        {/* Command Center Console (Aside) */}
        <aside className="col-span-12 lg:col-span-4 xl:col-span-3 bg-black/20 backdrop-blur-xl p-6 overflow-y-auto border-l border-white/5 hidden lg:flex flex-col gap-8">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-indigo-400" />
              <h3 className="font-bold text-[10px] tracking-[0.2em] uppercase text-muted-foreground">System Console</h3>
            </div>
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse shadow-glow" />
          </div>
          <section className="space-y-4">
            <div className="flex items-center gap-2 px-2">
              <Activity className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Context Telemetry</span>
            </div>
            <div className="bg-black/40 p-4 rounded-xl border border-white/5 font-mono text-[10px] space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fusion Stability</span>
                <span className="text-green-400">0.982</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Memory Drift</span>
                <span className="text-indigo-400">0.003λ</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Vector Density</span>
                <span className="text-orange-400">4.2GB</span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-indigo-500" 
                  initial={{ width: "0%" }}
                  animate={{ width: "85%" }}
                  transition={{ duration: 2 }}
                />
              </div>
            </div>
          </section>
          <section className="space-y-4">
             <div className="flex items-center gap-2 px-2">
              <Database className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Active Trace</span>
            </div>
            <ScrollArea className="h-64">
              <div className="space-y-3">
                {session?.interactions.slice(-5).reverse().map((int, i) => (
                  <div key={i} className="p-3 bg-white/5 rounded-lg border border-white/5 hover:border-indigo-500/20 transition-colors group cursor-default">
                    <div className="flex justify-between items-center mb-2">
                       <span className="text-[9px] font-bold text-indigo-300">TRX_{int.id.slice(0,4).toUpperCase()}</span>
                       <span className="text-[8px] text-muted-foreground">{(int.metadata?.relevance || 0)}% REL</span>
                    </div>
                    <div className="space-y-1">
                      {int.metadata?.provenance?.map((p, pi) => (
                        <div key={pi} className="flex justify-between text-[8px] text-muted-foreground group-hover:text-foreground/70 transition-colors">
                           <span>{p.layer}</span>
                           <span className="font-mono text-indigo-400/60">S:{p.similarity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </section>
          <div className="mt-auto p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 space-y-3">
            <div className="flex items-center gap-2">
              <Info className="w-3 h-3 text-indigo-400" />
              <span className="text-[9px] font-bold text-indigo-300 uppercase">LMP Integrity</span>
            </div>
            <p className="text-[9px] text-muted-foreground leading-relaxed">
              Consensus achieved across 1,420 meta-nodes. Layered memory protocol (LMP) operating within 0.942 accuracy parameters.
            </p>
          </div>
        </aside>
      </div>
    </AppLayout>
  );
}