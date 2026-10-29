import i18n from "i18next"
import { initReactI18next } from "react-i18next"

import { getInitialUiLanguage, type UiLanguage } from "./language"
import en from "./locales/en.json"
import zhHans from "./locales/zh-Hans.json"

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    "zh-Hans": { translation: zhHans },
  },
  lng: getInitialUiLanguage(),
  fallbackLng: "en",
  // React 已对插值内容转义
  interpolation: { escapeValue: false },
  returnEmptyString: false,
})

document.documentElement.lang = i18n.language

export function applyUiLanguage(language: UiLanguage): void {
  void i18n.changeLanguage(language)
  document.documentElement.lang = language
}

export { i18n }
