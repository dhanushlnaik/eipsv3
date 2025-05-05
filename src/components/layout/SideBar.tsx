// components/app-sidebar.tsx
'use client';

import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from '@/components/ui/sidebar';
import { getLucideIcon } from '@/lib/utils';

const sidebarItems = {
  "/": [
    { title: "Overview", url: "#overview", icon: "Info" },
    { title: "Team", url: "#team", icon: "Users" },
    { title: "Contact", url: "#contact", icon: "Mail" },
  ],
  "/docs": [
    { title: "Getting Started", url: "#start", icon: "Rocket" },
    { title: "Installation", url: "#install", icon: "Download" },
    { title: "Usage", url: "#usage", icon: "BookOpen" },
  ],
};


export function AppSidebar() {
  const pathname = usePathname();
  const items = pathname && pathname in sidebarItems ? sidebarItems[pathname as keyof typeof sidebarItems] : [];

  return (
    <Sidebar collapsible='icon'>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>On this page</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-3">
                      {getLucideIcon(item.icon)}
                      <span className="truncate">{item.title}</span>
                    </a>
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
