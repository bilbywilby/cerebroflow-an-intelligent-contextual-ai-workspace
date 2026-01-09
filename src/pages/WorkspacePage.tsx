import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Send, Save, Database, Sparkles, Brain, Loader2, ArrowLeft } from 'lucide-react';
import { sessionApi } from '@/lib/api-client';
import { toast } from 'sonner';
export function WorkspacePage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [query, setQuery] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: session, isLoading, error } = useQuery({
    queryKey: ['session', sessionId],
    queryFn: () => sessionApi.get(sessionId!),
    enabled: !!sessionId,
  });
  const queryMutation = useMutation({
    mutationFn: ({ id, q }: { id: string; q: string }) => sessionApi.query(id, q),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session', sessionId] });
      setQuery('');
      toast.success('Memory indexed');
    },
    onError: (err) => {
      toast.error('Query failed: ' + err.message);
    }
  });
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [session?.interactions]);
  if (error) {
    return (
      <AppLayout container contentClassName="flex flex-col items-center justify-center py-32">
        <h2 className="text-2xl font-bold mb-4">Workspace Unavailable</h2>
        <Button onClick={() => navigate('/dashboard')}>Return to Dashboard</Button>
      </AppLayout>
    );
  }
  return (
    <AppLayout contentClassName="h-screen flex flex-col p-0 overflow-hidden bg-background">
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Main Interaction Area */}
        <div className="flex-1 flex flex-col min-w-0 border-r border-white/5 relative">
          <header className="p-4 border-b border-white/5 bg-background/50 backdrop-blur-md flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')} className="md:hidden">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <Brain className="w-6 h-6 text-primary" />
              <div className="min-w-0">
                {isLoading ? <Skeleton className="h-5 w-32" /> : <h2 className="font-bold truncate text-foreground">{session?.title}</h2>}
              </div>
              <Badge variant="outline" className="hidden sm:flex text-primary border-primary/30 animate-pulse">LMP Active</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <Save className="w-4 h-4 mr-2" /> Checkpoint
              </Button>
            </div>
          </header>
          <ScrollArea className="flex-1 p-4 lg:p-8">
            <div className="max-w-4xl mx-auto space-y-12 py-8">
              {isLoading ? (
                <div className="space-y-8">
                  <Skeleton className="h-20 w-2/3 ml-auto rounded-2xl" />
                  <Skeleton className="h-32 w-3/4 rounded-2xl" />
                </div>
              ) : (
                session?.interactions.map((interaction) => (
                  <div key={interaction.id} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex flex-col items-end gap-2">
                      <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-none px-5 py-4 max-w-[85%] text-sm shadow-lg leading-relaxed">
                        {interaction.userQuery}
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                        <Sparkles className="w-5 h-5 text-primary" />
                      </div>
                      <div className="bg-muted/30 backdrop-blur-sm rounded-2xl rounded-tl-none px-6 py-5 text-sm text-foreground/90 border border-border flex-1 shadow-sm leading-relaxed">
                        {interaction.aiResponse}
                      </div>
                    </div>
                  </div>
                ))
              )}
              {queryMutation.isPending && (
                <div className="flex gap-4 animate-pulse">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  </div>
                  <div className="bg-muted/20 rounded-2xl rounded-tl-none px-6 py-5 flex-1 border border-dashed">
                    Synthesizing intelligence...
                  </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>
          <div className="p-6 bg-background border-t border-border">
            <div className="max-w-4xl mx-auto relative group">
              <Textarea
                placeholder="Ask Cerebro anything... LMP will retrieve context automatically."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey && query.trim()) {
                    e.preventDefault();
                    queryMutation.mutate({ id: sessionId!, q: query });
                  }
                }}
                className="bg-muted border-input pr-14 min-h-[100px] max-h-[300px] resize-none focus:ring-primary rounded-2xl transition-all"
                disabled={queryMutation.isPending}
              />
              <Button
                size="icon"
                className="absolute right-3 bottom-3 bg-primary hover:bg-primary/90 rounded-xl h-10 w-10 shadow-lg"
                disabled={!query.trim() || queryMutation.isPending}
                onClick={() => queryMutation.mutate({ id: sessionId!, q: query })}
              >
                {queryMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </div>
            <p className="text-center text-[10px] text-muted-foreground mt-4 uppercase tracking-[0.2em] font-semibold opacity-50">
              Semantic retrieval nodes active • Persistence layer streaming
            </p>
          </div>
        </div>
        {/* Semantic Context Panel */}
        <aside className="w-full md:w-80 lg:w-96 bg-muted/20 backdrop-blur-sm p-6 overflow-y-auto hidden lg:block border-l border-border">
          <div className="flex items-center gap-2 mb-8 px-2 border-b border-border pb-4">
            <Database className="w-5 h-5 text-accent" />
            <h3 className="font-bold text-xs tracking-[0.2em] uppercase">Memory Retrieval</h3>
          </div>
          <div className="space-y-8">
            <section>
              <h4 className="text-[10px] font-bold text-muted-foreground uppercase mb-4 px-2 tracking-widest">Active Entities</h4>
              <div className="flex flex-wrap gap-2 px-1">
                <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/20">Protocol</Badge>
                <Badge variant="secondary" className="bg-accent/5 text-accent border-accent/20">LMP</Badge>
                <Badge variant="secondary" className="bg-purple-500/5 text-purple-400 border-purple-500/20">VectorEngine</Badge>
              </div>
            </section>
            <section>
              <h4 className="text-[10px] font-bold text-muted-foreground uppercase mb-4 px-2 tracking-widest">Retrieved Segments</h4>
              <div className="space-y-4">
                {isLoading ? (
                  [1, 2].map(i => <Skeleton key={i} className="h-20 w-full rounded-xl" />)
                ) : session?.interactions.length === 0 ? (
                  <div className="p-4 border border-dashed rounded-xl text-center text-xs text-muted-foreground">
                    No context retrieved yet
                  </div>
                ) : (
                  session?.interactions.slice(-2).flatMap(i => i.retrievedContext).map((ctx, idx) => (
                    <div key={idx} className="p-4 bg-background/50 border border-border rounded-xl text-xs text-muted-foreground leading-relaxed shadow-sm hover:border-primary/30 transition-colors">
                      "{ctx}"
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        </aside>
      </div>
    </AppLayout>
  );
}