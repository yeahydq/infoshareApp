recommend ： 智能匹配页面： 首页？

- studentList : 显示市场学生的需求列表， 对老师来说是主页

  - studentDetail ： 学生的需求显示

    - complaintStudent 老师投诉学生页面

  - applyStudent : 貌似是老师添加学生的页面

- teacherList： 显示市场老师的列表, index page for student

  - teacherDetail : 老师细节
    - complaintTeacher ： 学生投诉老师页面
  - applyTeacher ： 主动向教师发送申请

- account : 我的页面

  - student-register: 家长填写学生需求
  - teacher-register： 老师填写个人简介
  - 我的收藏
    - collectStudent : 显示收藏学生
    - collectTeacher ： 显示收藏教师
  - 我的发布

    - modifyStudent : 发布补习要求
      - releaseStudent ： 显示学生的需求？
    - modifyTeacher ： 修改老师的信息资质
      - releaseTeacher : 显示老师的个人介绍

  - 关于系统
    - aboutUs: :关于我们
  - useHelp： 使用帮助

    - feedback： 对系统的反馈

  - 我的申请
    - applyStudent : 貌似是老师添加学生的页面
    - applyTeacher ： 主动向教师发送申请

## TODO List

### Bug Fixes

- **TimeSchedule组件月份切换问题**: TimeSchedule.vue组件中的月份切换功能（前进/后退按钮）在切换月份时存在兼容性问题，需要修复以确保日期选择在90天范围内正常工作。当前尝试通过以下方法未能解决：
  - 改变@tap为@click事件
  - 替换picker组件为简化的月份显示
  - 调整日期计算和格式化方法
  - 直接修改currentDate变量

### Features

- 完善全局样式和主题
- 优化移动端适配
