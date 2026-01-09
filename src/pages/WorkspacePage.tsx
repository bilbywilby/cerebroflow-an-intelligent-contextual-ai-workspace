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
import { Send, Database, Sparkles, Brain, Loader2, ArrowLeft, History, Zap, ShieldCheck } from 'lucide-react';
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
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [session?.interactions]);
  return (
    <AppLayout contentClassName="h-screen flex flex-col p-0 overflow-hidden bg-background">
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <div className="flex-1 flex flex-col min-w-0 border-r border-white/5 relative">
          <header className="p-4 border-b border-white/5 bg-background/50 backdrop-blur-md flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <Brain className="w-6 h-6 text-primary" />
              <div className="min-w-0">
                <h2 className="font-bold truncate text-foreground">{session?.title}</h2>
              </div>
              <AnimatePresence>
                {session?.agentMode && (
                  <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
                    <Badge className="bg-indigo-500 shadow-glow animate-pulse">Agent Active</Badge>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Agent Mode</span>
                <Switch 
                  checked={session?.agentMode || false} 
                  onCheckedChange={(v) => toggleAgentMutation.mutate(v)}
                />
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate(`/history/${sessionId}`)} className="hidden md:flex">
                <History className="w-4 h-4 mr-2" /> Audit Trail
              </Button>
            </div>
          </header>
          <ScrollArea className="flex-1 p-4 lg:p-8">
            <div className="max-w-4xl mx-auto space-y-12 py-8">
              {session?.interactions.map((interaction) => (
                <div key={interaction.id} className="space-y-6">
                  <div className="flex flex-col items-end gap-2">
                    <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-none px-5 py-4 max-w-[85%] text-sm shadow-lg">
                      {interaction.userQuery}
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                      {interaction.agentic ? <Zap className="w-5 h-5 text-indigo-400" /> : <Sparkles className="w-5 h-5 text-primary" />}
                    </div>
                    <div className="space-y-3 flex-1">
                      <div className="bg-muted/30 backdrop-blur-sm rounded-2xl rounded-tl-none px-6 py-5 text-sm text-foreground/90 border border-border shadow-sm">
                        {interaction.aiResponse}
                      </div>
                      {interaction.metadata?.provenance && (
                        <div className="flex flex-wrap gap-2">
                          {interaction.metadata.provenance.map((p, idx) => (
                            <Badge key={idx} variant="outline" className="text-[9px] uppercase font-mono tracking-tighter opacity-70 border-white/10">
                              [{p.layer}:{p.nodeId} sim:{p.similarity}]
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>
          <div className="p-6 bg-background border-t border-border">
            <div className="max-w-4xl mx-auto relative">
              <Textarea
                placeholder={session?.agentMode ? "Agent Synthesis engaged. Describe complex multi-context tasks..." : "Ask Cerebro anything..."}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey && query.trim()) {
                    e.preventDefault();
                    queryMutation.mutate({ id: sessionId!, q: query, agent: session?.agentMode || false });
                  }
                }}
                className="bg-muted border-input pr-14 min-h-[100px] rounded-2xl transition-all focus:ring-indigo-500"
              />
              <Button
                size="icon"
                className="absolute right-3 bottom-3 bg-primary hover:bg-indigo-600 rounded-xl shadow-lg h-10 w-10"
                disabled={!query.trim() || queryMutation.isPending}
                onClick={() => queryMutation.mutate({ id: sessionId!, q: query, agent: session?.agentMode || false })}
              >
                {queryMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
        <aside className="w-80 lg:w-96 bg-muted/20 backdrop-blur-sm p-6 overflow-y-auto hidden lg:block border-l border-border">
          <div className="flex items-center gap-2 mb-8 px-2 border-b border-border pb-4">
            <Database className="w-5 h-5 text-accent" />
            <h3 className="font-bold text-xs tracking-[0.2em] uppercase">Provenance Console</h3>
          </div>
          <div className="space-y-6">
            <section className="bg-black/40 p-4 rounded-xl border border-white/5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Active Reasoning</span>
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              </div>
              <p className="text-[11px] font-mono text-indigo-400 leading-relaxed">
                [LMP_SYS] Weighted Centroid Norm active.<br/>
                [NODE_RETRIEVAL] SCANNING Semantic Meta-Layers...<br/>
                [SIM_ACC] 0.942 accuracy goal met.
              </p>
            </section>
            <section className="space-y-4">
              <h4 className="text-[10px] font-bold text-muted-foreground uppercase px-2 tracking-widest">Contextual Trace</h4>
              {session?.interactions.slice(-3).reverse().map((int, i) => (
                <div key={i} className="p-3 bg-white/5 rounded-lg border border-white/5 space-y-2">
                   <div className="text-[9px] font-bold text-indigo-300">INTERACTION_{int.id.slice(0,4)}</div>
                   {int.metadata?.provenance?.map((p, pi) => (
                     <div key={pi} className="flex justify-between text-[10px] text-muted-foreground">
                        <span>{p.layer}</span>
                        <span className="font-mono text-accent">S:{p.similarity}</span>
                     </div>
                   ))}
                </div>
              ))}
            </section>
          </div>
        </aside>
      </div>
    </AppLayout>
  );
}