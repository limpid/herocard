# 星风暴人物卡片生成器 · 微信小程序

本目录为微信小程序版本，与 Web 端（仓库根目录）共用同一套 Canvas 渲染器源码（`vendor/` 下 41 个文件与 Web 端逐字节一致），Web 端体验不受任何影响。

## 目录结构

```
miniprogram/
├── project.config.json      # 开发者工具项目配置（appid 需替换为你自己的）
├── app.json / app.js        # 小程序入口（启动时加载全部渲染器）
├── pages/
│   ├── index/               # 主页：4 分类 + 40 模板网格，支持分享直达
│   └── editor/              # 通用编辑页：表单 + 实时预览 + 保存相册 + 分享
├── utils/
│   ├── env.js               # window 垫片（让渲染器零修改运行在小程序）
│   ├── schema.js            # 模板清单 + 4 类表单字段与默认值
│   ├── canvas.js            # canvas 2d 初始化 / 图片加载 / 保存相册
│   └── templates.json       # 40 模板注册表（自动生成）
└── vendor/                  # 渲染器（与 Web 端同源，勿手工修改）
    ├── renderers.js         # 单人介绍 10 模板 + 公共 helpers
    ├── compare/  quote/  batch/
    └── index.js             # 渲染器汇总入口
```

## 发布步骤

1. **注册小程序账号**：[mp.weixin.qq.com](https://mp.weixin.qq.com) → 注册 → 主体选「个人」即可（纯本地渲染，无需服务器与备案域名）
2. **获取 AppID**：管理后台 → 开发管理 → 开发设置 → AppID
3. **导入项目**：微信开发者工具 → 导入 → 选择本 `miniprogram/` 目录 → 填入 AppID（当前为游客模式占位 `touristappid`）
4. **真机预览**：工具内点「预览」扫码，在手机上完整体验
5. **上传发布**：点「上传」→ 填版本号 → 后台「提交审核」（类目建议：工具 → 图片/截图处理）
6. **开通流量主**（可选）：累计独立访客 1000 后可开通，激励视频建议挂在「保存到相册」环节

## 分享场景

- 主页与编辑页均支持「转发给好友」和「分享到朋友圈」
- 编辑页分享卡片直达对应模板：`/pages/editor/editor?g=compare&t=vote`
- 朋友圈打开走 query 参数自动还原模板

## 与 Web 端同步渲染器

Web 端更新 `js/renderers.js` 或 `compare|quote|batch/*.js` 后，重新复制到 `vendor/` 并重新生成注册表：

```bash
cp js/renderers.js miniprogram/vendor/renderers.js
cp compare/*.js miniprogram/vendor/compare/
cp quote/*.js miniprogram/vendor/quote/
cp batch/*.js miniprogram/vendor/batch/
# 然后在 miniprogram/ 下用 node 重新生成 utils/templates.json（见 utils/env.js 用法）
```

## 已知平台差异

- `ctx.filter = 'blur(...)'`（照片缩小后的背景模糊）在小程序 canvas 2d 中不生效，自动降级为无模糊背景，主体渲染不受影响
- 字体使用系统字体（Web 端的 Noto Sans SC 由小程序运行时自动回退）
