#!/usr/bin/env python3
"""vendor 渲染器注入 window 垫片 + schema.js 内联模板数据"""
import glob

# 1) vendor 渲染器头部注入 var window = require(...)
injections = {'vendor/renderers.js': '../utils/env.js'}
for d in ['compare', 'quote', 'batch']:
    for f in sorted(glob.glob('vendor/%s/*.js' % d)):
        injections[f] = '../../utils/env.js'

count = 0
for path, envpath in injections.items():
    with open(path, encoding='utf-8') as fp:
        s = fp.read()
    if s.startswith('var window ='):
        continue
    s = "var window = require('%s');\n" % envpath + s
    with open(path, 'w', encoding='utf-8') as fp:
        fp.write(s)
    count += 1
print('injected:', count, 'vendor files')

# 2) schema.js 内联 templates 数据（消除 require('./templates.js') 依赖）
with open('utils/templates.js', encoding='utf-8') as fp:
    tpl_src = fp.read()
data_part = tpl_src.split('module.exports = ', 1)[1].rsplit(';', 1)[0].strip()

with open('utils/schema.js', encoding='utf-8') as fp:
    schema = fp.read()
old_line = "const templates = require('./templates.js');"
assert old_line in schema, 'schema.js require line not found'
schema = schema.replace(old_line, 'const templates = ' + data_part + ';')
with open('utils/schema.js', 'w', encoding='utf-8') as fp:
    fp.write(schema)
print('schema.js templates inlined, length:', len(schema))
