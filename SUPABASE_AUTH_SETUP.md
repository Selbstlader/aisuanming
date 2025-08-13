# Supabase 认证设置说明

## 禁用邮件确认设置

为了实现用户注册后自动登录（无需邮件确认），需要在 Supabase 控制台中进行以下设置：

### 步骤 1：登录 Supabase 控制台
1. 访问 [Supabase 控制台](https://supabase.com/dashboard)
2. 选择您的项目：`ajigflmwielsacynyypu`

### 步骤 2：配置认证设置
1. 在左侧导航栏中，点击 **Authentication**
2. 点击 **Settings** 选项卡
3. 在 **User Signups** 部分：
   - 确保 **Enable email confirmations** 选项是 **关闭** 状态
   - 确保 **Enable email change confirmations** 选项是 **关闭** 状态
4. 点击 **Save** 保存设置

### 步骤 3：验证设置
完成上述设置后，用户注册流程将：
1. 用户填写注册表单
2. 系统创建用户账户
3. 用户自动登录（无需邮件确认）
4. 用户可以立即使用应用功能

## 当前代码实现

代码已经修改为支持自动登录：

1. **注册函数**：`signUp` 函数在 `/src/lib/supabase.ts` 中
2. **用户记录创建**：注册成功后自动在 `public.users` 表中创建用户记录
3. **自动登录**：`useAuth` hook 中的 `register` 函数会在注册成功后自动设置用户状态
4. **页面跳转**：注册页面在成功后会自动跳转到主页

## 注意事项

- 禁用邮件确认会降低安全性，因为无法验证邮箱地址的有效性
- 建议在生产环境中考虑其他验证方式
- 如果需要重新启用邮件确认，可以在 Supabase 控制台中重新开启相关设置