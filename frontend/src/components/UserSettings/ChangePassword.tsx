import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import type { TFunction } from "i18next"
import { useMemo } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { z } from "zod"

import { type UpdatePassword, UsersService } from "@/client"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { LoadingButton } from "@/components/ui/loading-button"
import { PasswordInput } from "@/components/ui/password-input"
import useCustomToast from "@/hooks/useCustomToast"
import { handleError } from "@/utils"

const buildFormSchema = (t: TFunction) =>
  z
    .object({
      current_password: z
        .string()
        .min(1, { message: t("validation.passwordRequired") })
        .min(8, { message: t("validation.passwordMinLength") }),
      new_password: z
        .string()
        .min(1, { message: t("validation.passwordRequired") })
        .min(8, { message: t("validation.passwordMinLength") }),
      confirm_password: z
        .string()
        .min(1, { message: t("validation.passwordConfirmationRequired") }),
    })
    .refine((data) => data.new_password === data.confirm_password, {
      message: t("validation.passwordsDontMatch"),
      path: ["confirm_password"],
    })

type FormData = z.infer<ReturnType<typeof buildFormSchema>>

const ChangePassword = () => {
  const { t } = useTranslation()
  const { showSuccessToast, showErrorToast } = useCustomToast()
  const schema = useMemo(() => buildFormSchema(t), [t])

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
    criteriaMode: "all",
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  })

  const mutation = useMutation({
    mutationFn: (data: UpdatePassword) =>
      UsersService.updatePasswordMe({ body: data }),
    onSuccess: () => {
      showSuccessToast(t("settings.passwordUpdatedToast"))
      form.reset()
    },
    onError: handleError.bind(showErrorToast),
  })

  const onSubmit = async (data: FormData) => {
    mutation.mutate(data)
  }

  return (
    <div className="max-w-md">
      <h3 className="text-lg font-semibold py-4">
        {t("settings.changePasswordTitle")}
      </h3>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="current_password"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>{t("settings.currentPassword")}</FormLabel>
                <FormControl>
                  <PasswordInput
                    data-testid="current-password-input"
                    placeholder="••••••••"
                    aria-invalid={fieldState.invalid}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="new_password"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>{t("settings.newPassword")}</FormLabel>
                <FormControl>
                  <PasswordInput
                    data-testid="new-password-input"
                    placeholder="••••••••"
                    aria-invalid={fieldState.invalid}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirm_password"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>{t("common.confirmPassword")}</FormLabel>
                <FormControl>
                  <PasswordInput
                    data-testid="confirm-password-input"
                    placeholder="••••••••"
                    aria-invalid={fieldState.invalid}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <LoadingButton
            type="submit"
            loading={mutation.isPending}
            className="self-start"
          >
            {t("settings.updatePassword")}
          </LoadingButton>
        </form>
      </Form>
    </div>
  )
}

export default ChangePassword
