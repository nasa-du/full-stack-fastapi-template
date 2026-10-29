import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "@tanstack/react-router"
import { useEffect } from "react"

import { UsersService } from "@/client"
import useAuth, { isLoggedIn } from "@/hooks/useAuth"
import { applyUiLanguage, i18n } from "./i18n"
import {
  clearStoredUiLanguage,
  getBrowserUiLanguage,
  getStoredUiLanguage,
  storeUiLanguage,
  type UiLanguage,
} from "./language"

// 当前生效语言 + 偏好来源（自动=跟随浏览器），并按登录状态选择写入目标：
// 已登录 → 账户字段（PATCH /users/me），未登录 → 本地临时存储
export function useUiLanguage() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const loggedIn = isLoggedIn()

  const language = (i18n.language as UiLanguage) || getBrowserUiLanguage()
  const preference: UiLanguage | null = loggedIn
    ? ((user?.language as UiLanguage | undefined) ?? null)
    : getStoredUiLanguage()

  const setLanguage = async (value: UiLanguage | null) => {
    if (isLoggedIn()) {
      await UsersService.updateUserMe({ body: { language: value } })
      await queryClient.invalidateQueries({ queryKey: ["currentUser"] })
      applyUiLanguage(value ?? getBrowserUiLanguage())
    } else if (value) {
      storeUiLanguage(value)
      applyUiLanguage(value)
    } else {
      clearStoredUiLanguage()
      applyUiLanguage(getBrowserUiLanguage())
    }
  }

  return { language, preference, setLanguage }
}

// 挂载一次的隐形组件：把生效语言同步到 i18next/<html lang>，
// 并在登录后把登录前的显式选择上行写入账户（见 docs/adr/0001）
export function UiLanguageController() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const { user } = useAuth()

  // 语言切换后刷新路由，让 head() 中的页面标题重新计算
  useEffect(() => {
    const handler = () => router.invalidate()
    i18n.on("languageChanged", handler)
    return () => i18n.off("languageChanged", handler)
  }, [router])

  useEffect(() => {
    if (!isLoggedIn()) {
      applyUiLanguage(getStoredUiLanguage() ?? getBrowserUiLanguage())
      return
    }
    if (!user) return

    const stored = getStoredUiLanguage()
    if (stored && stored !== user.language) {
      applyUiLanguage(stored)
      void UsersService.updateUserMe({ body: { language: stored } })
        .then(() => {
          clearStoredUiLanguage()
          queryClient.invalidateQueries({ queryKey: ["currentUser"] })
        })
        .catch(() => {})
      return
    }
    if (stored) {
      clearStoredUiLanguage()
    }
    applyUiLanguage((user.language as UiLanguage) ?? getBrowserUiLanguage())
  }, [user, queryClient])

  return null
}
