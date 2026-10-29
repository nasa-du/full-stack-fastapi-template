import { Briefcase, Home, Users } from "lucide-react"
import { useTranslation } from "react-i18next"

import { SidebarAppearance } from "@/components/Common/Appearance"
import { SidebarLanguage } from "@/components/Common/Language"
import { Logo } from "@/components/Common/Logo"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"
import useAuth from "@/hooks/useAuth"
import { type Item, Main } from "./Main"
import { User } from "./User"

export function AppSidebar() {
  const { t } = useTranslation()
  const { user: currentUser } = useAuth()

  const items: Item[] = [
    { icon: Home, title: t("sidebar.dashboard"), path: "/" },
    { icon: Briefcase, title: t("sidebar.items"), path: "/items" },
  ]
  if (currentUser?.is_superuser) {
    items.push({ icon: Users, title: t("sidebar.admin"), path: "/admin" })
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-4 py-6 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:items-center">
        <Logo variant="responsive" />
      </SidebarHeader>
      <SidebarContent>
        <Main items={items} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarAppearance />
        <SidebarLanguage />
        <User user={currentUser} />
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar
