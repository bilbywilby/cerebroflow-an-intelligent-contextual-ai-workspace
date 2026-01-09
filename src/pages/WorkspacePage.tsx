import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Send, Save, Database, Sparkles, Brain } from 'lucide-react';
import { MOCK_SESSIONS, MOCK_INTERACTIONS } from '@shared/mock-data';
export function WorkspacePage() {
  const { sessionId } = useParams();
  const session = MOCK_SESSIONS.find(s => s.id === sessionId);
  const [query, setQuery] = useState('');
  return (
    <AppLayout contentClassName="h-screen flex flex-col p-0">
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Main Interaction Area */}
        <div className="flex-1 flex flex-col min-w-0 border-r border-white/5">
          <header className="p-4 border-b border-white/5 bg-black/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain className="w-6 h-6 text-indigo-400" />
              <h2 className="font-bold truncate">{session?.title || 'Active Session'}</h2>
              <Badge variant="outline" className="hidden sm:flex text-indigo-400 border-indigo-500/30">LMP Active</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-white">
                <Save className="w-4 h-4 mr-2" /> Checkpoint
              </Button>
            </div>
          </header>
          <ScrollArea className="flex-1 p-4">
            <div className="max-w-3xl mx-auto space-y-8 py-8">
              {MOCK_INTERACTIONS.filter(i => i.sessionId === sessionId).map((interaction) => (
                <div key={interaction.id} className="space-y-6">
                  <div className="flex flex-col items-end gap-2">
                    <div className="bg-indigo-600 text-white rounded-2xl rounded-tr-none px-4 py-3 max-w-[85%] text-sm shadow-lg">
                      {interaction.userQuery}
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div className="bg-white/5 rounded-2xl rounded-tl-none px-5 py-4 text-sm text-foreground/90 border border-white/5 flex-1 shadow-xl">
                      {interaction.aiResponse}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="p-6 bg-black/40 border-t border-white/5">
            <div className="max-w-3xl mx-auto relative">
              <Textarea 
                placeholder="Ask Cerebro anything... LMP will retrieve context automatically."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="bg-white/5 border-white/10 pr-12 min-h-[100px] resize-none focus:ring-indigo-500 rounded-xl"
              />
              <Button 
                size="icon" 
                className="absolute right-2 bottom-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg h-9 w-9"
                disabled={!query.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-center text-2xs text-muted-foreground mt-4 uppercase tracking-tighter opacity-50">
              Episodic & Semantic layers actively indexing interaction
            </p>
          </div>
        </div>
        {/* Semantic Context Panel */}
        <aside className="w-full md:w-80 bg-black/40 p-4 overflow-y-auto hidden lg:block">
          <div className="flex items-center gap-2 mb-6 px-2">
            <Database className="w-5 h-5 text-orange-500" />
            <h3 className="font-bold text-sm tracking-widest uppercase">Memory Retrieval</h3>
          </div>
          <div className="space-y-6">
            <section>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-3 px-2">Key Entities</h4>
              <div className="flex flex-wrap gap-2 px-1">
                <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/20">Protocol</Badge>
                <Badge className="bg-orange-500/10 text-orange-400 border-orange-500/20 hover:bg-orange-500/20">LMP</Badge>
                <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/20">Context</Badge>
              </div>
            </section>
            <section>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-3 px-2">Retrieved Context</h4>
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div key={i} className="p-3 bg-white/5 border border-white/5 rounded-xl text-xs text-muted-foreground leading-relaxed">
                    "Retrieved from episodic layer: User requested clarification on memory pruning logic in session 2."
                  </div>
                ))}
              </div>
            </section>
          </div>
        </aside>
      </div>
    </AppLayout>
  );
}