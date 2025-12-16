# WeChat Mini Program Toolbox

一个原生微信小程序“工具箱”示例：首页九宫格导航 + 计算器 + 单位换算 + 二维码页面（占位）。

## 运行方式（微信开发者工具）

1. 安装微信开发者工具
2. 打开微信开发者工具 → 导入项目
3. 项目目录选择本仓库根目录
4. 修改 [project.config.json](project.config.json) 里的 `appid`
	- 没有 AppID 也可以先用 `touristappid` 预览部分能力
5. 点击编译 / 预览

## 已包含页面

- 首页：/pages/index/index
- 计算器：/package-tools/pages/calculator/index
- 单位换算：/package-tools/pages/unit-convert/index
- 二维码：/package-tools/pages/qr-generator/index（当前为框架占位，下一步可接入 canvas 二维码库）

## 下一步建议

- 把工具页做成分包（subpackages），工具多了首屏更快
- 二维码页接入“小程序可用”的二维码库（canvas 渲染），并支持保存到相册

