<script setup lang='ts'>
  import Lucide from '../../base-components/Lucide/Lucide.vue';
  import {
    FormInput,
    FormInline,
    FormLabel,
  } from '../../base-components/Form';
  import { Dialog } from '../../base-components/Headless';
  import Button from '../../base-components/Button';
  import { computed, onMounted, reactive, ref } from 'vue';
  import { showToastMessage, tryCallRequest } from '../../utils/my-function';
  import { useRoute } from 'vue-router';
  import { AccountStore } from '../../stores/account-store';
  import { IAccount } from '../../models/interface/IAccount';
  import { EnumRole } from '../../models/enum/EnumRole';
  import FormSelect from '../../base-components/Form/FormSelect.vue';

  //dattqh
  const accountStore = AccountStore();
  const confirmSaveModal = ref(false);
  const confirmSaveRef = ref();
  const route = useRoute();
  const account_id = route.params ? route.params.account_id as string : '';
  const accountCrud = computed(() => accountStore.accountCrud as IAccount);
  const formData = reactive({
    username: '',
    fullname: '',
    password: '',
    role: EnumRole.NHAN_VIEN as string,
  });

  async function actionCreateAccount() {
    if (formData.username && formData.fullname && formData.password && formData.role) {
      //init request
      const request = {
        username: formData.username,
        fullname: formData.fullname,
        password: formData.password,
        role: formData.role,
      } as IAccount;
      //call request
      await tryCallRequest(async () => {
        await accountStore.actionCreateAccount(request);
        //close modal success
        confirmSaveModal.value = false;
        //alert success
        showToastMessage();
        //reset value
        formData.username = '';
        formData.fullname = '';
        formData.password = '';
        formData.role = EnumRole.NHAN_VIEN as string;
      });
    } else {
      showToastMessage('Vui lòng nhập đủ thông tin', true);
    }
  }

  async function actionUpdateAccount() {
    if (formData.fullname && account_id) {
      //init request
      const request = {
        id: account_id,
        fullname: formData.fullname,
        password: formData.password,
        role: formData.role,
      } as IAccount;
      //call request
      await tryCallRequest(async () => {
        await accountStore.actionUpdateAccount(request);
        //close modal success
        confirmSaveModal.value = false;
        //alert success
        showToastMessage();
      });
    }
  }

  async function actionSaveAccount() {
    if (account_id) {
      await actionUpdateAccount();
    } else {
      await actionCreateAccount();
    }
  }

  onMounted(async () => {
    //Neu updated thi goi request find one
    if (account_id) {
      //init request
      await accountStore.actionGetAccountCrud(String(account_id));
      //set value to formdata
      formData.username = accountCrud.value.username;
      formData.fullname = accountCrud.value.fullname;
      formData.role = accountCrud.value.role;
    }
  });
</script>

<template>
  <div class='flex items-center mt-8 intro-y'>
    <h2 class='mr-auto text-lg font-medium'>Quản Lý Tài Khoản Chi Tiết</h2>
  </div>
  <div class='grid grid-cols-11 pb-20 mt-5 gap-x-6'>
    <div class='col-span-11 intro-y 2xl:col-span-7'>
      <!-- BEGIN: Account Information -->
      <div class='p-5 mt-5 intro-y box'>
        <div
          class='p-5 border rounded-md border-slate-200/60 dark:border-darkmode-400'
        >
          <div
            class='flex items-center pb-5 text-base font-medium border-b border-slate-200/60 dark:border-darkmode-400'
          >
            <Lucide icon='ChevronDown' class='w-4 h-4 mr-2' />
            Thông Tin Tài Khoản
          </div>
          <div class='mt-5'>
            <FormInline
              class='flex-col items-start pt-5 mt-5 xl:flex-row first:mt-0 first:pt-0'
            >
              <FormLabel class='xl:w-64 xl:!mr-10'>
                <div class='text-left'>
                  <div class='flex items-center'>
                    <div class='font-medium'>Tài Khoản</div>
                    <div
                      class='ml-2 px-2 py-0.5 bg-slate-200 text-slate-600 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md'>
                      Bắt Buộc
                    </div>
                  </div>
                  <div class='mt-3 text-xs leading-relaxed text-slate-500'>
                    Tài khoản đã được lưu sẽ không thể thay đổi lại được nữa.
                  </div>
                </div>
              </FormLabel>
              <div class='flex-1 w-full mt-3 xl:mt-0'>
                <FormInput
                  v-model='formData.username'
                  id='account-username'
                  type='text'
                  placeholder='Tài khoản'
                />
              </div>
            </FormInline>
            <FormInline
              class='flex-col items-start pt-5 mt-5 xl:flex-row first:mt-0 first:pt-0'
            >
              <FormLabel class='xl:w-64 xl:!mr-10'>
                <div class='text-left'>
                  <div class='flex items-center'>
                    <div class='font-medium'>Họ tên</div>
                    <div
                      class='ml-2 px-2 py-0.5 bg-slate-200 text-slate-600 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md'>
                      Bắt Buộc
                    </div>
                  </div>
                </div>
              </FormLabel>
              <div class='flex-1 w-full mt-3 xl:mt-0'>
                <FormInput
                  v-model='formData.fullname'
                  id='account-fullname'
                  type='text'
                  placeholder='Họ tên'
                />
              </div>
            </FormInline>
            <FormInline
              class='flex-col items-start pt-5 mt-5 xl:flex-row first:mt-0 first:pt-0'
            >
              <FormLabel class='xl:w-64 xl:!mr-10'>
                <div class='text-left'>
                  <div class='flex items-center'>
                    <div class='font-medium'>Mật khẩu</div>
                    <div
                      class='ml-2 px-2 py-0.5 bg-slate-200 text-slate-600 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md'>
                      Bắt Buộc khi tạo mới
                    </div>
                  </div>
                </div>
              </FormLabel>
              <div class='flex-1 w-full mt-3 xl:mt-0'>
                <FormInput
                  v-model='formData.password'
                  id='account-password'
                  type='password'
                  placeholder='Mật khẩu'
                />
              </div>
            </FormInline>
            <FormInline
              class='flex-col items-start pt-5 mt-5 xl:flex-row first:mt-0 first:pt-0'
            >
              <FormLabel class='xl:w-64 xl:!mr-10'>
                <div class='text-left'>
                  <div class='flex items-center'>
                    <div class='font-medium'>Phân Quyền</div>
                    <div
                      class='ml-2 px-2 py-0.5 bg-slate-200 text-slate-600 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md'>
                      Bắt Buộc
                    </div>
                  </div>
                </div>
              </FormLabel>
              <div class='flex-1 w-full mt-3 xl:mt-0'>
                <FormSelect id="role" name='role' v-model='formData.role'>
                  <option value='Quản lý'>
                    Quản lý
                  </option>
                  <option value='Nhân viên'>
                    Nhân viên
                  </option>
                </FormSelect>
              </div>
            </FormInline>
            <FormInline
              class='flex-col items-start pt-5 mt-5 xl:flex-row first:mt-0 first:pt-0'
            >
              <div class='flex-1 w-full mt-3 xl:mt-0 xl:text-right'>
                <Button variant='primary' class='w-44' @click='confirmSaveModal = true'
                        :disabled='!formData.username'>
                  <Lucide icon='Plus' class='w-4 h-4 mr-2' />
                  Xong
                </Button>
              </div>
            </FormInline>
          </div>
        </div>
      </div>
      <!-- END: Account Information -->
    </div>
  </div>
  <!-- BEGIN: Modal Content -->
  <Dialog :open='confirmSaveModal' @close='confirmSaveModal = false'
          :initialFocus='confirmSaveRef'>
    <Dialog.Panel>
      <div class='p-5 text-center'>
        <Lucide icon='AlertCircle' class='w-16 h-16 mx-auto mt-3 text-danger' />
        <div class='mt-5 text-3xl'>Bạn chắc chắn không?</div>
        <div class='mt-2 text-slate-500'>
          Bạn thực sự muốn lưu tài khoản này? <br />
          Tiến trình này không thể quay lại.
        </div>
      </div>
      <div class='px-5 pb-8 text-center'>
        <Button type='button' variant='outline-secondary' @click='confirmSaveModal = false' class='w-24 mr-1'>
          Bỏ qua
        </Button>
        <Button type='button' variant='primary' class='w-24' ref='{confirmSaveRef}'
                @click='actionSaveAccount'>
          Lưu lại
        </Button>
      </div>
    </Dialog.Panel>
  </Dialog>
  <!-- END: Modal Content -->
</template>

<style scoped>

</style>
