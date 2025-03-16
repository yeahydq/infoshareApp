/* eslint-disable */
/* prettier-ignore */
// @ts-nocheck
// Generated by vite-plugin-uni-pages

interface NavigateToOptions {
  url: "/pages/shareinfo/studentList/studentList" |
       "/pages/about/about" |
       "/pages/index/index" |
       "/pages/my/index" |
       "/pages/shareinfo/aboutUs/aboutUs" |
       "/pages/shareinfo/account/account" |
       "/pages/shareinfo/applyStudent/applyStudent" |
       "/pages/shareinfo/applyTeacher/applyTeacher" |
       "/pages/shareinfo/collectStudent/collectStudent" |
       "/pages/shareinfo/collectTeacher/collectTeacher" |
       "/pages/shareinfo/complaintStudent/complaintStudent" |
       "/pages/shareinfo/complaintTeacher/complaintTeacher" |
       "/pages/shareinfo/feedback/feedback" |
       "/pages/shareinfo/index/index" |
       "/pages/shareinfo/login/index" |
       "/pages/shareinfo/login/login" |
       "/pages/shareinfo/modifyStudent/modifyStudent" |
       "/pages/shareinfo/modifyTeacher/modifyTeacher" |
       "/pages/shareinfo/recommend/recommend" |
       "/pages/shareinfo/releaseStudent/releaseStudent" |
       "/pages/shareinfo/releaseTeacher/releaseTeacher" |
       "/pages/shareinfo/student-register/student-register" |
       "/pages/shareinfo/studentDetail/studentDetail" |
       "/pages/shareinfo/teacher-register/teacher-register" |
       "/pages/shareinfo/teacherDetail/teacherDetail" |
       "/pages/shareinfo/teacherList/teacherList" |
       "/pages/shareinfo/useHelp/useHelp";
}
interface RedirectToOptions extends NavigateToOptions {}

interface SwitchTabOptions {
  url: "/pages/shareinfo/studentList/studentList" | "/pages/shareinfo/recommend/recommend" | "/pages/shareinfo/account/account" | "/pages/about/about" | "/pages/my/index"
}

type ReLaunchOptions = NavigateToOptions | SwitchTabOptions;

declare interface Uni {
  navigateTo(options: UniNamespace.NavigateToOptions & NavigateToOptions): void;
  redirectTo(options: UniNamespace.RedirectToOptions & RedirectToOptions): void;
  switchTab(options: UniNamespace.SwitchTabOptions & SwitchTabOptions): void;
  reLaunch(options: UniNamespace.ReLaunchOptions & ReLaunchOptions): void;
}
