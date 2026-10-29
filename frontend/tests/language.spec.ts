import { expect, test } from "@playwright/test"
import { createUser } from "./utils/privateApi.ts"
import { randomEmail, randomPassword } from "./utils/random.ts"
import { logInUser } from "./utils/user.ts"

test.describe("zh-CN browser", () => {
  test.use({ locale: "zh-CN", storageState: { cookies: [], origins: [] } })

  test("login page renders in Simplified Chinese by detection", async ({
    page,
  }) => {
    await page.goto("/login")

    await expect(page.getByText("登录你的账户")).toBeVisible()

    // 浏览器自动判定的结果不落盘（ADR 0001：只有显式选择才写入）
    const stored = await page.evaluate(() =>
      localStorage.getItem("ui-language"),
    )
    expect(stored).toBeNull()
  })
})

test.describe("en-US browser", () => {
  test.use({ locale: "en-US", storageState: { cookies: [], origins: [] } })

  test("login page language can be switched to Chinese explicitly", async ({
    page,
  }) => {
    await page.goto("/login")
    await expect(page.getByText("Login to your account")).toBeVisible()

    await page.getByTestId("language-button").click()
    await page.getByTestId("language-zh").click()

    await expect(page.getByText("登录你的账户")).toBeVisible()
    await expect(page).toHaveTitle("登录 - FastAPI Template")

    // 未登录的显式选择存本地，等待登录/注册时上行
    const stored = await page.evaluate(() =>
      localStorage.getItem("ui-language"),
    )
    expect(stored).toBe("zh-Hans")
  })

  test("switching back to Auto follows the browser language again", async ({
    page,
  }) => {
    await page.goto("/login")

    await page.getByTestId("language-button").click()
    await page.getByTestId("language-zh").click()
    await expect(page.getByText("登录你的账户")).toBeVisible()
    // 标题刷新意味着路由失效（router.invalidate）已完成
    await expect(page).toHaveTitle("登录 - FastAPI Template")
    // 菜单关闭动画期间 Radix 仍会吞掉触发器的点击，等内容卸载后再打开
    await expect(page.getByTestId("language-auto")).toHaveCount(0)

    await page.getByTestId("language-button").click()
    await page.getByTestId("language-auto").click()

    await expect(page.getByText("Login to your account")).toBeVisible()
  })
})

test.describe("authenticated language switching", () => {
  test.use({ locale: "en-US", storageState: { cookies: [], origins: [] } })

  test("sidebar switcher persists the choice on the account", async ({
    page,
  }) => {
    const email = randomEmail()
    const password = randomPassword()
    await createUser({ email, password })
    await logInUser(page, email, password)

    await page.goto("/items")
    await expect(page.getByText("Create and manage your items")).toBeVisible()

    // 切到中文
    await page.getByTestId("language-button").click()
    await page.getByTestId("language-zh").click()

    await expect(page.getByText("创建并管理你的条目")).toBeVisible()
    await expect(page.locator("html")).toHaveAttribute("lang", "zh-Hans")

    // 刷新后仍是中文（en 浏览器下由账户偏好驱动）
    await page.reload()
    await expect(page.getByText("创建并管理你的条目")).toBeVisible()

    // 切回"自动"应恢复浏览器语言
    await page.getByTestId("language-button").click()
    await page.getByTestId("language-auto").click()

    await expect(page.getByText("Create and manage your items")).toBeVisible()
    await expect(page.locator("html")).toHaveAttribute("lang", "en")
  })
})
