pnpm i
pnpm dev
pnpm dev:mp-weixin

pnpm dev:mp-weixin > output.log 2>&1

git commit -m "type:docs subject:文档变更"
git commit -m "feat: 新增校验commit信息、eslint规范提示、自动格式化代码"

type:docs
subject:文档变更

📃 docs:

git commit -m 'fix(scope): fix ie6 margin bug'
git commit -m 'docs: update readme'
git commit -m 'fix: update readme'
git commit -m 'feat: add basic pages'

import { getTime } from '@service/util/util.ts'

import { getTime } from '@service/util/util'

feat: add basic pages

修改这个页面为， 显示个人基本信息， 包括下面字段：
name,
phone,
address:
avatarUrl,
nickName,
manager

    并且允许用户修改， 比如最下面有修改按钮， 用户按下修改按钮后， 所有的选选项变成可修改， 再在旁边添加一个提交按钮

https://cloud.tencent.com/developer/article/2225434

    db.collection('db1').doc('1ef3c513623c6c890cdeaa5142ca382e')
    .update({
      data: {
       age:44
      },

把这个vue 的script 部分改为 ： lang="ts" setup
