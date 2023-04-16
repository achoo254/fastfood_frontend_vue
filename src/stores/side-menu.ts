import { defineStore } from "pinia";
import { Icon } from "../base-components/Lucide/Lucide.vue";

export interface Menu {
  icon: Icon;
  title: string;
  pageName?: string;
  subMenu?: Menu[];
  ignore?: boolean;
}

export interface SideMenuState {
  menu: Array<Menu | "divider">;
}

export const useSideMenuStore = defineStore("sideMenu", {
  state: (): SideMenuState => ({
    menu: [
      {
        icon: "Menu",
        pageName: "side-menu-point-of-sale",
        title: "Thực đơn",
      },
      {
        icon: "Activity",
        pageName: "side-menu-transactions",
        title: "Hóa đơn",
        subMenu: [
          {
            icon: "DollarSign",
            pageName: "side-menu-transaction-list",
            title: "Giao dịch",
          },
        ],
      },
    ],
  }),
});
