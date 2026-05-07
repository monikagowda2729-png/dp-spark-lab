import { Link, useRouterState } from "@tanstack/react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  BookOpen,
  Eye,
  GitCompareArrows,
  BarChart3,
  LineChart,
  GraduationCap,
} from "lucide-react";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "About DP", url: "/about-dp", icon: BookOpen },
  { title: "Problem Visualizer", url: "/visualizer", icon: Eye },
  { title: "Algorithm Comparison", url: "/comparison", icon: GitCompareArrows },
  { title: "Complexity Analysis", url: "/complexity", icon: BarChart3 },
  { title: "Performance", url: "/performance", icon: LineChart },
  { title: "Learning Resources", url: "/learning", icon: GraduationCap },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const currentPath = useRouterState({
    select: (s) => s.location.pathname,
  });

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarContent className="pt-4">
        <div className="px-4 pb-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-primary/20 pulse-neon shrink-0">
            <Eye className="w-5 h-5 text-primary" />
          </div>
          {!collapsed && (
            <div>
              <h2 className="text-sm font-bold gradient-text">DP Visualizer</h2>
              <p className="text-[10px] text-muted-foreground">Algorithm Lab</p>
            </div>
          )}
        </div>
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground text-[10px] uppercase tracking-wider">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={currentPath === item.url}
                    className="transition-all duration-200"
                  >
                    <Link to={item.url} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span className="text-sm">{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
