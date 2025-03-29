/* eslint-disable */
/* prettier-ignore */
// @ts-nocheck
// Generated by vite-plugin-uni-pages

interface NavigateToOptions {
  url: "/pages/weshares/index/index" |
       "/pages/about/about" |
       "/pages/index/index" |
       "/pages/my/index" |
       "/pages/weshares/index" |
       "/pages/weshares/time-schedule" |
       "/pages/shareinfo/aboutUs/aboutUs" |
       "/pages/shareinfo/account/account" |
       "/pages/shareinfo/account/setting" |
       "/pages/shareinfo/applyStudent/applyStudent" |
       "/pages/shareinfo/applyTeacher/applyTeacher" |
       "/pages/shareinfo/collectStudent/collectStudent" |
       "/pages/shareinfo/collectTeacher/collectTeacher" |
       "/pages/shareinfo/complaintStudent/complaintStudent" |
       "/pages/shareinfo/complaintTeacher/complaintTeacher" |
       "/pages/shareinfo/feedback/feedback" |
       "/pages/shareinfo/home/home" |
       "/pages/shareinfo/index/index" |
       "/pages/shareinfo/login/login" |
       "/pages/shareinfo/modifyStudent/modifyStudent" |
       "/pages/shareinfo/modifyTeacher/modifyTeacher" |
       "/pages/shareinfo/recommend/recommend" |
       "/pages/shareinfo/releaseStudent/releaseStudent" |
       "/pages/shareinfo/releaseTeacher/releaseTeacher" |
       "/pages/shareinfo/student-register/student-register" |
       "/pages/shareinfo/studentDetail/studentDetail" |
       "/pages/shareinfo/studentList/studentList" |
       "/pages/shareinfo/teacher-register/teacher-register" |
       "/pages/shareinfo/teacherDetail/teacherDetail" |
       "/pages/shareinfo/teacherList/teacherList" |
       "/pages/shareinfo/useHelp/useHelp" |
       "/pages/weshares/address-management/index" |
       "/pages/weshares/find-teachers/index" |
       "/pages/weshares/help-center/index" |
       "/pages/weshares/my/index" |
       "/pages/weshares/orders/detail" |
       "/pages/weshares/orders/index" |
       "/pages/weshares/orders/review" |
       "/pages/weshares/personal-center/index" |
       "/pages/weshares/personal-info/index" |
       "/pages/weshares/professional-registration/register-page1" |
       "/pages/weshares/qr-code/index" |
       "/pages/weshares/recommended-teacher/index" |
       "/pages/weshares/registration-complete/index" |
       "/pages/weshares/system-announcement/index" |
       "/pages/weshares/system-settings/index" |
       "/pages/weshares/teacher-details/index" |
       "/pages/weshares/teacher-registration/index" |
       "/pages/weshares/teacher-registration/register-page1" |
       "/pages/weshares/teacher-registration/register-page2" |
       "/pages/weshares/teacher-registration/register-page3" |
       "/pages/weshares/teacher-registration/register-page4" |
       "/pages/weshares/teacher-registration/success" |
       "/pages/weshares/upload-documents/index";
}
interface RedirectToOptions extends NavigateToOptions {}

interface SwitchTabOptions {
  url: "/pages/weshares/index/index" | "/pages/weshares/orders/index" | "/pages/weshares/personal-center/index"
}

type ReLaunchOptions = NavigateToOptions | SwitchTabOptions;

declare interface Uni {
  navigateTo(options: UniNamespace.NavigateToOptions & NavigateToOptions): void;
  redirectTo(options: UniNamespace.RedirectToOptions & RedirectToOptions): void;
  switchTab(options: UniNamespace.SwitchTabOptions & SwitchTabOptions): void;
  reLaunch(options: UniNamespace.ReLaunchOptions & ReLaunchOptions): void;
}
