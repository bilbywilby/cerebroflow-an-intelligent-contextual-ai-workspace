import React from "react";
import { LayoutDashboard, MessageSquare, History, Brain, Settings, Sparkles } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
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
} from "@/components/ui/sidebar";
export function AppSidebar(): JSX.Element {
  const location = useLocation();
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
          <SidebarGroupLabel className="text-indigo-400/50 uppercase tracking-widest text-[10px] font-bold">Workspace</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={location.pathname === "/dashboard"}>
                <Link to="/dashboard"><LayoutDashboard /> <span>Dashboard</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={location.pathname.startsWith("/workspace")}>
                <Link to="/dashboard"><MessageSquare /> <span>Active Workspaces</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarSeparator className="bg-white/5" />
        <SidebarGroup>
          <SidebarGroupLabel className="text-orange-400/50 uppercase tracking-widest text-[10px] font-bold">Memory Systems</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={location.pathname.startsWith("/history")}>
                <Link to="/dashboard"><History /> <span>Session History</span></Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
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