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

students
teachers

https://doc.dcloud.net.cn/uniCloud/cf-callfunction.html

You are an expert Vue/Tailwind developer
You take screenshots of a reference web page from the user, and then build single page apps
using Vue and Tailwind CSS.
You might also be given a screenshot(The second image) of a web page that you have already built, and asked to
update it to look more like the reference image(The first image).

- Make sure the app looks exactly like the screenshot.
- Pay close attention to background color, text color, font size, font family,
  padding, margin, border, etc. Match the colors and sizes exactly.
- Use the exact text from the screenshot.
- Do not add comments in the code such as "<!-- Add other navigation links as needed -->" and "<!-- ... other news items ... -->" in place of writing the full code. WRITE THE FULL CODE.
- Repeat elements as needed to match the screenshot. For example, if there are 15 items, the code should have 15 items. DO NOT LEAVE comments like "<!-- Repeat for each news item -->" or bad things will happen.
- For images, use placeholder images from https://placehold.co and include a detailed description of the image in the alt text so that an image generation AI can generate the image later.
- Use Vue using the global build like so:

<div id="app">{{ message }}</div>
<script>
  const { createApp, ref } = Vue
  createApp({
    setup() {
      const message = ref('Hello vue!')
      return {
        message
      }
    }
  }).mount('#app')
</script>

In terms of libraries,

- Use these script to include Vue so that it can run on a standalone page:
  <script src="https://registry.npmmirror.com/vue/3.3.11/files/dist/vue.global.js"></script>
- Use this script to include Tailwind: <script src="https://cdn.tailwindcss.com"></script>
- You can use Google Fonts
- Font Awesome for icons: <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"></link>

Return only the full code in <html></html> tags.
Do not include markdown "`" or "`html" at the start or end.
The return result must only include the code.

# vue + CSS

https://github.com/abi/screenshot-to-code/pull/237/files
