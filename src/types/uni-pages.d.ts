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
       "/pages/weshares/address-management/index" |
       "/pages/weshares/booking/index" |
       "/pages/weshares/find-professionals/index" |
       "/pages/weshares/help-center/index" |
       "/pages/weshares/my/index" |
       "/pages/weshares/orders/detail" |
       "/pages/weshares/orders/index" |
       "/pages/weshares/orders/review" |
       "/pages/weshares/personal-center/index" |
       "/pages/weshares/personal-info/index" |
       "/pages/weshares/professional-details/index" |
       "/pages/weshares/professional-registration/index" |
       "/pages/weshares/professional-registration/register-page1" |
       "/pages/weshares/professional-registration/register-page2" |
       "/pages/weshares/professional-registration/register-page3" |
       "/pages/weshares/professional-registration/register-page4" |
       "/pages/weshares/professional-registration/status" |
       "/pages/weshares/professional-registration/success" |
       "/pages/weshares/qr-code/index" |
       "/pages/weshares/recommended-teacher/index" |
       "/pages/weshares/registration-complete/index" |
       "/pages/weshares/system-announcement/index" |
       "/pages/weshares/system-settings/index" |
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
