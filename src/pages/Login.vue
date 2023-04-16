<script setup lang="ts">
  import DarkModeSwitcher from '../components/DarkModeSwitcher';
  import MainColorSwitcher from '../components/MainColorSwitcher';
  import logoUrl from '../assets/images/logo.svg';
  import illustrationUrl from '../assets/images/illustration.svg';
  import { FormInput } from '../base-components/Form';
  import Button from '../base-components/Button';
  import { AccountStore } from '../stores/account-store';
  import { reactive } from 'vue';
  import { IAccount } from '../models/interface/IAccount';
  import router from '../router';
  import { tryCallRequest } from '../utils/my-function';
  import NotificationToastify from '../base-components/Custom/NotificationCustom/Main.vue';

  const accountStore = AccountStore();
  const formData = reactive({
    username: '',
    password: ''
  })

  async function actionLogin() {
    if (formData.username && formData.password) {
      //init request
      const request = { username: formData.username, password: formData.password } as IAccount;
      //call request
      await tryCallRequest(async () => {
        await accountStore.actionLogin(request);
        //redirect
        await router.push('/');
      });
    }
  }

</script>

<template>
  <div
    :class="[
      '-m-3 sm:-mx-8 p-3 sm:px-8 relative h-screen lg:overflow-hidden bg-primary xl:bg-white dark:bg-darkmode-800 xl:dark:bg-darkmode-600',
      'before:hidden before:xl:block before:content-[\'\'] before:w-[57%] before:-mt-[28%] before:-mb-[16%] before:-ml-[13%] before:absolute before:inset-y-0 before:left-0 before:transform before:rotate-[-4.5deg] before:bg-primary/20 before:rounded-[100%] before:dark:bg-darkmode-400',
      'after:hidden after:xl:block after:content-[\'\'] after:w-[57%] after:-mt-[20%] after:-mb-[13%] after:-ml-[13%] after:absolute after:inset-y-0 after:left-0 after:transform after:rotate-[-4.5deg] after:bg-primary after:rounded-[100%] after:dark:bg-darkmode-700',
    ]">
    <DarkModeSwitcher />
    <MainColorSwitcher />
    <div class="container relative z-10 sm:px-10">
      <div class="block grid-cols-2 gap-4 xl:grid">
        <!-- BEGIN: Login Info -->
        <div class="flex-col hidden min-h-screen xl:flex">
          <a href="" class="flex items-center pt-5 -intro-x">
            <img alt="Midone Tailwind HTML Admin Template" class="w-6" :src="logoUrl" />
            <span class="ml-3 text-lg text-white"> Gà Rán PyFC Việt Nam </span>
          </a>
          <div class="my-auto">
            <img alt="Midone Tailwind HTML Admin Template" class="w-1/2 -mt-16 -intro-x" :src="illustrationUrl" />
            <div class="mt-10 text-4xl font-medium leading-tight text-white -intro-x">
              Một vài cú nhấp chuột nữa để <br />
              đăng nhập vào tài khoản của bạn.
            </div>
            <div class="mt-5 text-lg text-white -intro-x text-opacity-70 dark:text-slate-400">
              Quản lý tất cả các tài khoản của bạn ở một nơi
            </div>
          </div>
        </div>
        <!-- END: Login Info -->
        <!-- BEGIN: Login Form -->
        <div class="flex h-screen py-5 my-10 xl:h-auto xl:py-0 xl:my-0">
          <div
            class="w-full px-5 py-8 mx-auto my-auto bg-white rounded-md shadow-md xl:ml-20 dark:bg-darkmode-600 xl:bg-transparent sm:px-8 xl:p-0 xl:shadow-none sm:w-3/4 lg:w-2/4 xl:w-auto">
            <h2 class="text-2xl font-bold text-center intro-x xl:text-3xl xl:text-left">Đăng nhập</h2>
            <div class="mt-2 text-center intro-x text-slate-400 xl:hidden">
              Một vài cú nhấp chuột nữa để đăng nhập vào tài khoản của bạn. Quản lý tất cả các tài khoản của bạn ở một nơi
            </div>
            <div class="mt-8 intro-x">
              <FormInput
                type="text"
                class="block px-4 py-3 intro-x login__input min-w-full xl:min-w-[350px]"
                placeholder="Username" v-model='formData.username' />
              <FormInput
                type="password"
                class="block px-4 py-3 mt-4 intro-x login__input min-w-full xl:min-w-[350px]"
                placeholder="Password" v-model='formData.password' />
            </div>
            <div class="mt-5 text-center intro-x xl:mt-8 xl:text-left">
              <Button variant="primary" class="w-full px-4 py-3 align-top xl:w-32 xl:mr-3" @click='actionLogin'> Đăng nhập </Button>
              <Button variant="outline-secondary" class="w-full px-4 py-3 mt-3 align-top xl:w-32 xl:mt-0" @click='router.push("/register")'>
                Đăng ký
              </Button>
            </div>
          </div>
        </div>
        <!-- END: Login Form -->
      </div>
    </div>
  </div>
  <notification-toastify/>
</template>
