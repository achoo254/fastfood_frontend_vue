import { defineStore } from "pinia";
import { Icon } from "../base-components/Lucide/Lucide.vue";

export interface Menu {
  icon: Icon;
  title: string;
  pageName?: string;
  subMenu?: Menu[];
  ignore?: boolean;
}

export interface TopMenuState {
  menu: Array<Menu>;
}

export const useTopMenuStore = defineStore("topMenu", {
  state: (): TopMenuState => ({
    menu: [
      {
        icon: "Home",
        pageName: "side-menu-point-of-sale",
        title: "Trang Chủ",
      },
      {
        icon: "Box",
        pageName: "top-menu-menu-layout",
        title: "Quản Lý",
        subMenu: [
          {
            icon: "Menu",
            pageName: "top-menu-category-list",
            title: "Danh Mục",
          },
          {
            icon: "Users",
            pageName: "top-menu-account-list",
            title: "Tài Khoản",
          },
        ],
      },
    ],
  }),
});
