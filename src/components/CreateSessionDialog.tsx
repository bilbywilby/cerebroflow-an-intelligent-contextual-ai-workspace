import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { sessionApi } from "@/lib/api-client";
import { toast } from "sonner";
export function CreateSessionDialog() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: sessionApi.create,
    onSuccess: (newSession) => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      setOpen(false);
      setTitle('');
      toast.success('Workspace created successfully');
      navigate(`/workspace/${newSession.id}`);
    },
    onError: (err) => {
      toast.error('Failed to create workspace: ' + err.message);
    }
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    mutation.mutate(title.trim());
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="btn-gradient px-6 py-6 h-auto">
          <Plus className="w-5 h-5 mr-2" /> New Workspace
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] glass-panel border-white/10">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">New AI Workspace</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Define the context for your new intelligence session.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-6">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">Workspace Title</label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Project Cerebro Research"
                className="bg-muted/50 border-input"
                autoFocus
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 font-bold py-6"
              disabled={mutation.isPending || !title.trim()}
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Initializing LMP...
                </>
              ) : (
                'Create Workspace'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}