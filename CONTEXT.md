# Full Stack FastAPI Template

本仓库（FastAPI + React 全栈应用）的统一术语表。只定义业务与领域概念，不记录实现细节。

## Language

**界面语言 (UI Language)**:
应用呈现给用户的语言，取值只能是 `en` 或 `zh-Hans`。使用文字子标签 `zh-Hans`（简体），不使用地区子标签 `zh-CN`。
_Avoid_: locale、语言环境、中文（指取值时写 `zh-Hans`）

**语言偏好 (Language Preference)**:
用户账户上记录界面语言**显式选择**的可空字段。未设置时界面语言每次跟随浏览器判定；浏览器自动判定的结果永不写入该字段。
_Avoid_: 语言设置、locale 字段

**语言判定 (Language Resolution)**:
从浏览器语言推导界面语言的规则：任何 `zh-*` 前缀（含繁体 `zh-TW`、`zh-HK`）→ `zh-Hans`；其余一切（含无法识别）→ 回退语言 `en`。

**受支持语言 (Supported Languages)**:
应用实际提供翻译目录的语言集合，当前为 {`en`, `zh-Hans`}，可扩展；界面语言的取值域与该集合一致。
