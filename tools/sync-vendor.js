#!/usr/bin/env node
/**
 * Web 端渲染器 → 小程序 vendor 同步脚本
 *
 * 用法：在仓库根目录执行  node tools/sync-vendor.js
 *
 * 做三件事：
 *  1. 复制 js/renderers.js、compare|quote|batch/*.js 到 miniprogram/vendor/
 *  2. 每个文件头部注入「var window = require('.../utils/env.js');」垫片
 *     （微信 AppService 沙箱中模块作用域无法定义全局 window，必须模块级注入）
 *  3. 加载 vendor 提取 40 模板注册表，重写 miniprogram/utils/schema.js 的 templates 区块
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const MP = path.join(ROOT, 'miniprogram');

function copyWithShim(src, dest, envPath) {
  let code = fs.readFileSync(src, 'utf8');
  code = "var window = require('" + envPath + "');\n" + code;
  fs.writeFileSync(dest, code);
}

copyWithShim(
  path.join(ROOT, 'js/renderers.js'),
  path.join(MP, 'vendor/renderers.js'),
  '../utils/env.js'
);

for (const dir of ['compare', 'quote', 'batch']) {
  const srcDir = path.join(ROOT, dir);
  const destDir = path.join(MP, 'vendor', dir);
  for (const f of fs.readdirSync(srcDir).filter((x) => x.endsWith('.js')).sort()) {
    copyWithShim(path.join(srcDir, f), path.join(destDir, f), '../../utils/env.js');
  }
}

// 加载 vendor 提取注册表（node 环境，shim 即 env.js 模块本身）
const shim = require(path.join(MP, 'utils/env.js'));
require(path.join(MP, 'vendor/index.js'));
const reg = shim.__get();

const templates = {};
for (const g of Object.keys(reg)) {
  templates[g] = {};
  for (const k of Object.keys(reg[g])) {
    templates[g][k] = { name: reg[g][k].name, tagline: reg[g][k].tagline };
  }
}

const schemaPath = path.join(MP, 'utils/schema.js');
let schema = fs.readFileSync(schemaPath, 'utf8');
const pattern = /const templates = \{[\s\S]*?\n\};/;
if (!pattern.test(schema)) {
  console.error('schema.js templates 区块未匹配，请检查文件格式');
  process.exit(1);
}
schema = schema.replace(pattern, 'const templates = ' + JSON.stringify(templates, null, 2) + ';');
fs.writeFileSync(schemaPath, schema);

const total = Object.values(templates).reduce((a, g) => a + Object.keys(g).length, 0);
console.log('同步完成：vendor 41 个文件已注入垫片，schema.js 已更新（' + total + ' 个模板）');
