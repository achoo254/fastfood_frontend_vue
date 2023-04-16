<script setup lang="ts">
  import { computed, onMounted } from 'vue';
  import Lucide from '../../base-components/Lucide';
  import logoUrl from '../../assets/images/logo.svg';
  import Breadcrumb from '../../base-components/Breadcrumb';
  import { Menu } from '../../base-components/Headless';
  import fakerData from '../../utils/faker';
  import { AccountStore } from '../../stores/account-store';
  import { IAccount } from '../../models/interface/IAccount';
  import router from '../../router';
  import NotificationToastify from '../../base-components/Custom/NotificationCustom/Main.vue';
  import { MyStore } from '../../stores/my-store';

  const accountStore = AccountStore();
  const myStore = MyStore();
  const account = computed(() => accountStore.account as IAccount);

  async function actionLogout() {
    myStore.removeToken();
    //redirect
    await router.push('/login');
  }

  onMounted(() => {
    if (!account.value.id) {
      router.push('/login');
    }
  });
</script>

<template>
  <!-- BEGIN: Top Bar -->
  <div
    class="top-bar-boxed h-[70px] z-[51] relative border-b border-white/[0.08] mt-12 md:-mt-5 -mx-3 sm:-mx-8 px-3 sm:px-8 md:pt-0 mb-12">
    <div class="flex items-center h-full">
      <!-- BEGIN: Logo -->
      <RouterLink :to="{ name: 'side-menu-point-of-sale' }" class="hidden -intro-x md:flex">
        <img alt="Icewall Tailwind HTML Admin Template" class="w-6" :src="logoUrl" />
        <span class="ml-3 text-lg text-white"> Gà Rán PyFC Việt Nam </span>
      </RouterLink>
      <!-- END: Logo -->
      <!-- BEGIN: Breadcrumb -->
      <Breadcrumb light class="h-full md:ml-10 md:pl-10 md:border-l border-white/[0.08] mr-auto -intro-x">
        <Breadcrumb.Link to="/">Menu Gà Rán | PyFC Việt Nam</Breadcrumb.Link>
      </Breadcrumb>
      <!-- END: Breadcrumb -->
      <!-- BEGIN: Account Menu -->
      <Menu>
        <Menu.Button class="block w-8 h-8 overflow-hidden scale-110 rounded-full shadow-lg image-fit zoom-in intro-x">
          <img alt="Midone Tailwind HTML Admin Template" :src="fakerData[9].photos[0]" />
        </Menu.Button>
        <Menu.Items
          class="w-56 mt-px relative bg-primary/80 before:block before:absolute before:bg-black before:inset-0 before:rounded-md before:z-[-1] text-white">
          <Menu.Header class="font-normal">
            <div class="font-medium">{{ account.fullname }}</div>
            <div class="text-xs text-white/70 mt-0.5 dark:text-slate-500">
              {{ account.role }}
            </div>
          </Menu.Header>
          <Menu.Divider class="bg-white/[0.08]" />
          <Menu.Item class="hover:bg-white/5" @click='actionLogout'>
            <Lucide icon="ToggleRight" class="w-4 h-4 mr-2" />
            Logout
          </Menu.Item>
        </Menu.Items>
      </Menu>
      <!-- END: Account Menu -->
    </div>
  </div>
  <notification-toastify />
  <!-- END: Top Bar -->
</template>
