import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  ArrowLeft, 
  Clock, 
  ChevronRight, 
  MessageCircle, 
  Database,
  Calendar
} from 'lucide-react';
import { sessionApi } from '@/lib/api-client';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
export function HistoryPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { data: session, isLoading, error } = useQuery({
    queryKey: ['session', sessionId],
    queryFn: () => sessionApi.get(sessionId!),
    enabled: !!sessionId,
  });
  if (error) {
    return (
      <AppLayout container contentClassName="flex flex-col items-center justify-center py-32">
        <h2 className="text-2xl font-bold mb-4">History Unavailable</h2>
        <Button onClick={() => navigate('/dashboard')}>Return to Dashboard</Button>
      </AppLayout>
    );
  }
  return (
    <AppLayout container>
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="flex items-center justify-between border-b border-white/10 pb-8">
          <div className="space-y-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="pl-0 text-muted-foreground hover:text-foreground"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <h1 className="text-4xl font-bold tracking-tight">Episodic Timeline</h1>
            {isLoading ? (
              <Skeleton className="h-4 w-48" />
            ) : (
              <p className="text-muted-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Audit trail for session: <span className="text-foreground font-medium">{session?.title}</span>
              </p>
            )}
          </div>
          <Badge variant="outline" className="px-4 py-1 text-xs uppercase tracking-widest border-indigo-500/30 text-indigo-400">
            Memory Layer: Episodic
          </Badge>
        </div>
        {isLoading ? (
          <div className="space-y-12 relative before:absolute before:inset-0 before:left-4 before:w-px before:bg-white/10">
            {[1, 2, 3].map(i => (
              <div key={i} className="pl-12 relative">
                <div className="absolute left-3 top-0 w-3 h-3 rounded-full bg-muted border border-border -translate-x-1/2" />
                <Skeleton className="h-32 w-full rounded-2xl" />
              </div>
            ))}
          </div>
        ) : !session?.interactions || session.interactions.length === 0 ? (
          <div className="text-center py-20 glass-panel border-dashed">
            <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <h3 className="text-lg font-medium text-muted-foreground">No interactions recorded yet.</h3>
          </div>
        ) : (
          <div className="space-y-12 relative before:absolute before:inset-0 before:left-4 before:w-px before:bg-white/10">
            {session.interactions.map((interaction, idx) => (
              <motion.div 
                key={interaction.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="pl-12 relative group"
              >
                <div className="absolute left-3 top-0 w-3 h-3 rounded-full bg-indigo-500 ring-4 ring-indigo-500/20 -translate-x-1/2 z-10" />
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground uppercase tracking-widest">
                    <Clock className="w-3 h-3" />
                    {format(interaction.timestamp, 'MMM d, yyyy • HH:mm:ss')}
                  </div>
                  <Card className="glass-panel border-white/5 overflow-hidden transition-all hover:border-indigo-500/30">
                    <CardContent className="p-0">
                      <div className="p-6 space-y-6">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-tighter">
                            <MessageCircle className="w-3 h-3" /> User Prompt
                          </div>
                          <p className="text-sm leading-relaxed text-foreground/90">
                            {interaction.userQuery}
                          </p>
                        </div>
                        <div className="space-y-3 pl-4 border-l-2 border-indigo-500/30">
                          <div className="flex items-center gap-2 text-orange-400 font-bold text-xs uppercase tracking-tighter">
                            <ChevronRight className="w-3 h-3" /> AI Synthesis
                          </div>
                          <p className="text-sm leading-relaxed text-muted-foreground italic">
                            {interaction.aiResponse}
                          </p>
                        </div>
                      </div>
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="context" className="border-t border-white/5 px-6">
                          <AccordionTrigger className="text-2xs uppercase tracking-[0.2em] font-bold text-muted-foreground py-4 hover:no-underline">
                            <div className="flex items-center gap-2">
                              <Database className="w-3 h-3" />
                              Semantic Context Hits ({interaction.retrievedContext.length})
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pb-6 pt-2">
                            <div className="space-y-3">
                              {interaction.retrievedContext.map((ctx, cidx) => (
                                <div key={cidx} className="p-3 bg-white/5 rounded-lg text-xs text-muted-foreground leading-relaxed border border-white/5">
                                  {ctx}
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}