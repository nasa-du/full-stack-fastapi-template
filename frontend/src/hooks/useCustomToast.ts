import { toast } from "sonner"

import { i18n } from "@/i18n/i18n"

const useCustomToast = () => {
  const showSuccessToast = (description: string) => {
    toast.success(i18n.t("toasts.successTitle"), {
      description,
    })
  }

  const showErrorToast = (description: string) => {
    toast.error(i18n.t("toasts.errorTitle"), {
      description,
    })
  }

  return { showSuccessToast, showErrorToast }
}

export default useCustomToast
