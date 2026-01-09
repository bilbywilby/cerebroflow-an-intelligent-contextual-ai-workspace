import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Plus, History, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MOCK_SESSIONS } from '@shared/mock-data';
export function DashboardPage() {
  return (
    <AppLayout container>
      <div className="space-y-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Workspace Dashboard</h1>
            <p className="text-muted-foreground">Manage your active intelligence sessions.</p>
          </div>
          <Button className="btn-gradient px-6 py-6 h-auto">
            <Plus className="w-5 h-5 mr-2" /> New Workspace
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_SESSIONS.map((session) => (
            <Card key={session.id} className="glass-panel group hover:bg-white/10 transition-all border-white/10">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                    <History className="w-5 h-5 text-indigo-400" />
                  </div>
                  <span className="text-xs text-muted-foreground">ID: {session.id.split('-')[0]}</span>
                </div>
                <CardTitle className="text-xl font-bold">{session.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Created:</span>
                    <span>{new Date(session.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Active:</span>
                    <span>{new Date(session.lastAccessed).toLocaleTimeString()}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full group-hover:bg-indigo-500 group-hover:text-white transition-colors" asChild>
                  <Link to={`/workspace/${session.id}`}>
                    Resume Session <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}