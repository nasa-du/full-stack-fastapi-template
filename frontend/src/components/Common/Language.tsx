import { Languages } from "lucide-react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import type { UiLanguage } from "@/i18n/language"
import { useUiLanguage } from "@/i18n/useUiLanguage"

type LanguageOption = {
  value: UiLanguage | null
  label: string
  testid: string
}

function useLanguageOptions(): LanguageOption[] {
  const { t } = useTranslation()
  return [
    { value: null, label: t("language.auto"), testid: "language-auto" },
    { value: "zh-Hans", label: t("language.chinese"), testid: "language-zh" },
    { value: "en", label: t("language.english"), testid: "language-en" },
  ]
}

export const SidebarLanguage = () => {
  const { isMobile } = useSidebar()
  const { t } = useTranslation()
  const { preference, setLanguage } = useUiLanguage()
  const options = useLanguageOptions()

  return (
    <SidebarMenuItem>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            tooltip={t("language.title")}
            data-testid="language-button"
          >
            <Languages className="size-4 text-muted-foreground" />
            <span>{t("language.title")}</span>
            <span className="sr-only">{t("language.toggleSr")}</span>
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side={isMobile ? "top" : "right"}
          align="end"
          className="w-(--radix-dropdown-menu-trigger-width) min-w-56"
        >
          {options.map((option) => (
            <DropdownMenuItem
              key={option.testid}
              data-testid={option.testid}
              onClick={() => setLanguage(option.value)}
            >
              <Languages className="mr-2 h-4 w-4" />
              {option.label}
              {option.value === preference && (
                <span className="ml-auto text-xs text-muted-foreground">✓</span>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  )
}

export const AuthLanguage = () => {
  const { t } = useTranslation()
  const { preference, setLanguage } = useUiLanguage()
  const options = useLanguageOptions()

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button data-testid="language-button" variant="outline" size="icon">
          <Languages className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">{t("language.toggleSr")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {options.map((option) => (
          <DropdownMenuItem
            key={option.testid}
            data-testid={option.testid}
            onClick={() => setLanguage(option.value)}
          >
            {option.label}
            {option.value === preference && (
              <span className="ml-auto text-xs text-muted-foreground">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
