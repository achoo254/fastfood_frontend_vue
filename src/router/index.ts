import { createRouter, createWebHistory } from "vue-router";
import SideMenu from "../layouts/SideMenu/SideMenu.vue";
import TransactionList from "../pages/TransactionList.vue";
import TransactionDetail from "../pages/TransactionDetail.vue";
import PointOfSale from "../pages/PointOfSale.vue";
import Login from "../pages/Login.vue";
import Register from "../pages/Register.vue";
import ErrorPage from "../pages/ErrorPage.vue";
import CategoryList from '../pages/admin/CategoryList.vue';
import { AccountStore } from '../stores/account-store';
import { MyStore } from '../stores/my-store';
import { handleExceptionError } from '../utils/my-function';
import { EnumRole } from '../models/enum/EnumRole';
import TopMenu from '../layouts/TopMenu/TopMenu.vue';
import CategorySave from '../pages/admin/CategorySave.vue';
import AccountList from '../pages/admin/AccountList.vue';
import AccountSave from '../pages/admin/AccountSave.vue';

const routes = [
  {
    path: "/",
    component: SideMenu,
    meta: { requiresAuth: true },
    children: [
      {
        path: "/",
        name: "side-menu-point-of-sale",
        component: PointOfSale,
      },
      {
        path: "transaction-list",
        name: "side-menu-transaction-list",
        component: TransactionList,
      },
      {
        path: "transaction-detail",
        name: "side-menu-transaction-detail",
        component: TransactionDetail,
      },
    ],
  },
  {
    path: '/admin',
    name: 'admin',
    component: TopMenu,
    meta: { requiresAdminAuth: true },
    children: [
      {
        path: "",
        name: "top-menu-category-list",
        component: CategoryList,
      },
      {
        path: "save-category",
        name: "top-menu-create-category",
        component: CategorySave,
      },
      {
        path: "save-category/:category_id",
        name: "top-menu-edit-category",
        component: CategorySave,
      },
      {
        path: "account-list",
        name: "top-menu-account-list",
        component: AccountList,
      },
      {
        path: "save-account",
        name: "top-menu-create-account",
        component: AccountSave,
      },
      {
        path: "save-account/:account_id",
        name: "top-menu-edit-account",
        component: AccountSave,
      },
    ]
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/register",
    name: "register",
    component: Register,
  },
  {
    path: "/error-page",
    name: "error-page",
    component: ErrorPage,
  },
  {
    path: "/:pathMatch(.*)*",
    component: ErrorPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 };
  },
});

router.beforeEach(async (to, _from, next) => {
  //init value
  const myStore = MyStore();
  const accountStore = AccountStore();
  //get token
  myStore.getToken();
  //check 1 lan gui request ve server xem jwt hop le ko
  if (!myStore.hasLogged) {
    try {
      //require token
      if (myStore.token) {
        //get user
        await accountStore.actionGetAccount();
      }
    } catch (e) {
      myStore.removeToken();
      handleExceptionError(e);
    }
  }
  //Check nếu đang truy cập route admin
  const arrays = to.path.split('/');
  const pathAdmin = arrays.some((value) => value === 'admin');
  if (pathAdmin) {
    //nếu giá trị rỗng thì chuyển route về login
    if ((to.matched.some((record) => record.meta.requiresAdminAuth) && !myStore.token) || accountStore.account.role !== EnumRole.QUAN_LY) {
      next('/login');
    }
    //nếu co jwt hop le check dang vao route login ko, neu dung thi redirect ve trang chu admin
    else if (myStore.token && to.path === '/login') {
      next('/');
    }
    //Cho phép truy cập khac binh thuong
    else {
      //next route
      next();
    }
  }
  else{
    //nếu giá trị rỗng thì chuyển route về login
    if (to.matched.some((record) => record.meta.requiresAuth) && !myStore.token) {
      next('/login');
    }
    //nếu co jwt hop le check dang vao route login ko, neu dung thi redirect ve trang chu admin
    else if (myStore.token && to.path === '/login') {
      next('/');
    }
    //Cho phép truy cập khac binh thuong
    else {
      //next route
      next();
    }
  }
});

export default router;
