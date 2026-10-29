export type UiLanguage = "en" | "zh-Hans"

export const SUPPORTED_LANGUAGES: readonly UiLanguage[] = ["en", "zh-Hans"]
export const FALLBACK_LANGUAGE: UiLanguage = "en"

// 未登录时显式选择的临时存储：仅在登录/注册上行写入账户前生效（见 docs/adr/0001）
const ANON_LANGUAGE_STORAGE_KEY = "ui-language"

// 语言判定（Language Resolution，见 CONTEXT.md）：任何 zh-* → zh-Hans，其余 → en
export function resolveUiLanguage(locales: readonly string[]): UiLanguage {
  return locales.some((tag) => tag.toLowerCase().startsWith("zh"))
    ? "zh-Hans"
    : FALLBACK_LANGUAGE
}

export function getBrowserUiLanguage(): UiLanguage {
  if (typeof navigator === "undefined") return FALLBACK_LANGUAGE
  return resolveUiLanguage(navigator.languages ?? [navigator.language])
}

export function getStoredUiLanguage(): UiLanguage | null {
  const value = localStorage.getItem(ANON_LANGUAGE_STORAGE_KEY)
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(value ?? "")
    ? (value as UiLanguage)
    : null
}

export function storeUiLanguage(language: UiLanguage): void {
  localStorage.setItem(ANON_LANGUAGE_STORAGE_KEY, language)
}

export function clearStoredUiLanguage(): void {
  localStorage.removeItem(ANON_LANGUAGE_STORAGE_KEY)
}

// 应用启动时（账户信息加载前）的初始语言
export function getInitialUiLanguage(): UiLanguage {
  return getStoredUiLanguage() ?? getBrowserUiLanguage()
}
