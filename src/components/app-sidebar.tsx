import React from "react";
import { 
  LayoutDashboard, 
  MessageSquare, 
  History, 
  Brain, 
  Settings, 
  Sparkles, 
  Bookmark,
  ChevronRight,
  Plus
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { sessionApi } from "@/lib/api-client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarSeparator,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Skeleton } from "@/components/ui/skeleton";
export function AppSidebar(): JSX.Element {
  const location = useLocation();
  const { data: sessions, isLoading } = useQuery({
    queryKey: ['sessions'],
    queryFn: sessionApi.list
  });
  const recentSessions = sessions?.slice(0, 5) || [];
  const allCheckpoints = sessions?.flatMap(s => 
    (s.checkpoints || []).map(cp => ({ ...cp, sessionTitle: s.title, sessionId: s.id }))
  ).sort((a, b) => b.timestamp - a.timestamp).slice(0, 5) || [];
  return (
    <Sidebar className="border-r border-white/5 bg-black/40">
      <SidebarHeader className="p-4">
        <Link to="/" className="flex items-center gap-3 px-2">
          <div className="h-8 w-8 rounded-lg bg-indigo-500 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">CerebroFlow</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={location.pathname === "/dashboard"}>
                <Link to="/dashboard"><LayoutDashboard /> <span>Dashboard</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarSeparator className="bg-white/5" />
        <SidebarGroup>
          <SidebarGroupLabel className="text-indigo-400/50 uppercase tracking-widest text-[10px] font-bold">Recent Workspaces</SidebarGroupLabel>
          <SidebarMenu>
            {isLoading ? (
              <div className="px-4 space-y-2 py-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : recentSessions.length > 0 ? (
              recentSessions.map(session => (
                <SidebarMenuItem key={session.id}>
                  <SidebarMenuButton asChild isActive={location.pathname === `/workspace/${session.id}`}>
                    <Link to={`/workspace/${session.id}`}>
                      <MessageSquare className="w-4 h-4" />
                      <span className="truncate">{session.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))
            ) : (
              <div className="px-4 py-2 text-[10px] text-muted-foreground italic">No recent sessions</div>
            )}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarSeparator className="bg-white/5" />
        <SidebarGroup>
          <SidebarGroupLabel className="text-orange-400/50 uppercase tracking-widest text-[10px] font-bold">Memory Systems</SidebarGroupLabel>
          <SidebarMenu>
            <Collapsible className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton>
                    <Bookmark className="w-4 h-4" />
                    <span>Quick Checkpoints</span>
                    <ChevronRight className="ml-auto w-3 h-3 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {allCheckpoints.map(cp => (
                      <SidebarMenuSubItem key={cp.id}>
                        <SidebarMenuSubButton asChild>
                          <Link to={`/workspace/${cp.sessionId}`}>
                            <span className="truncate max-w-[140px]">{cp.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                    {allCheckpoints.length === 0 && (
                      <SidebarMenuSubItem>
                         <span className="px-2 py-1 text-[10px] text-muted-foreground italic">No checkpoints</span>
                      </SidebarMenuSubItem>
                    )}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={location.pathname === "/knowledge"}>
                <Link to="/knowledge"><Brain /> <span>Knowledge Base</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarSeparator className="bg-white/5" />
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="#"><Settings /> <span>Settings</span></a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 text-center">
        <div className="text-[10px] text-muted-foreground uppercase tracking-tighter opacity-40">Layered Memory Protocol v1.0</div>
      </SidebarFooter>
    </Sidebar>
  );
}