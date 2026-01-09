import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { History, ArrowRight, Trash2, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { sessionApi } from '@/lib/api-client';
import { CreateSessionDialog } from '@/components/CreateSessionDialog';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
export function DashboardPage() {
  const queryClient = useQueryClient();
  const { data: sessions, isLoading, error } = useQuery({
    queryKey: ['sessions'],
    queryFn: sessionApi.list,
  });
  const deleteMutation = useMutation({
    mutationFn: sessionApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      toast.success('Workspace deleted');
    },
    onError: (err) => {
      toast.error('Failed to delete workspace: ' + err.message);
    }
  });
  return (
    <AppLayout container>
      <div className="space-y-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-10">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold text-foreground">Workspace Dashboard</h1>
            <p className="text-muted-foreground text-lg">Persistent intelligence across your sessions.</p>
          </div>
          <CreateSessionDialog />
        </div>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="glass-panel h-64">
                <CardHeader className="space-y-2">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-destructive/5 rounded-3xl border border-destructive/10">
            <p className="text-destructive font-medium">Failed to load workspaces.</p>
            <Button variant="ghost" className="mt-4" onClick={() => queryClient.invalidateQueries({ queryKey: ['sessions'] })}>Retry</Button>
          </div>
        ) : sessions?.length === 0 ? (
          <div className="text-center py-32 glass-panel">
            <h3 className="text-xl font-semibold mb-2">No active workspaces</h3>
            <p className="text-muted-foreground mb-8">Create your first intelligence session to get started.</p>
            <CreateSessionDialog />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions?.map((session) => (
              <Card key={session.id} className="glass-panel group hover:bg-white/10 transition-all border-white/10 flex flex-col">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                      <History className="w-5 h-5 text-indigo-400" />
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
                      onClick={() => {
                        if (confirm('Delete this workspace forever?')) {
                          deleteMutation.mutate(session.id);
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <CardTitle className="text-xl font-bold truncate pr-4">{session.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{formatDistanceToNow(session.lastAccessed)} ago</span>
                    </div>
                    <div className="flex justify-between text-2xs uppercase tracking-widest opacity-60">
                      <span>Interactions</span>
                      <span>{session.interactions?.length || 0}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="secondary" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all" asChild>
                    <Link to={`/workspace/${session.id}`}>
                      Resume Session <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}