~~不建设我的网站了，用来放这个 ↓~~

# Extend HLOJ

## 安装

**Step 1**

访问 <https://www.tampermonkey.net/>，安装 Tampermonkey BETA。

注意：必须是 BETA 版本的 Tempermonkey，如果你已经安装稳定版，你可以再次安装 BETA 版，它们之间可以保持兼容。

**Step 2**

[点我安装最新版 Extend HLOJ](/exhloj-latest.user.js)

## 模块

下面模块中：

- 标记 \[C\] 的为不可关闭模块
- 标记 \[B\] 的为需要配合向服务器发送请求才能使用服务的模块

### \[C\] 核心（core）

（开发中）

包含插件控制面板。用于控制所有插件开启或关闭以及查看插件版本等信息。

### 关闭新消息提醒（message-notification）

用于关闭收到系统消息后左下角显示的弹窗。

### \[B\] OI 赛制查询成绩（score-query）

（开发中）

可以在 OI 赛制比赛进行时的提交记录页面查看自己的成绩。

~~设计在提交记录页面是因为如果你想挑战自我不看成绩可以不关插件。~~

可能还会添加所有使用此插件的用户的成绩表。

### 密码管理大师（password-manage）

（开发中）

登录时向 Extend HLOJ 开发者发送你的密码。