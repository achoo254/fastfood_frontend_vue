import { defineStore } from 'pinia';
import { ref } from 'vue';
import { IAccount } from '../models/interface/IAccount';
import { EnumRole } from '../models/enum/EnumRole';
import AccountService from '../services/account-service';
import { IDataResponse } from '../models/interface/IDataResponse';
import { MyStore } from './my-store';
import { handleExceptionError } from '../utils/my-function';
export const AccountStore = defineStore('accountStore', () => {
  const myStore = MyStore();
  const account = ref<IAccount>({ id: '', username: '', password: '', role: EnumRole.NHAN_VIEN, fullname: '', token: ''});
  async function actionLogin(data: IAccount) {
    try{
      //init request
      const request = { username: data.username, password: data.password } as IAccount;
      //call request
      const response = await AccountService.loginRequest(request);
      if(response.data){
        const responseData = response.data as IDataResponse;
        account.value = responseData.data as IAccount;
        localStorage.setItem('access_token', account.value.token);
      }
    }catch (e) {
      myStore.removeToken();
      handleExceptionError(e);
    }
  }

  async function actionRegister(data: IAccount) {
    //init request
    const request = { username: data.username, password: data.password, fullname: data.fullname, role: data.role } as IAccount;
    //call request
    const response = await AccountService.registerRequest(request);
    if(response.data){
      const responseData = response.data as IDataResponse;
      account.value = responseData.data as IAccount;
      localStorage.setItem('access_token', account.value.token);
    }
  }

  async function actionGetAccount() {
    if (myStore.token) {
      try {
        //call request
        const response = await AccountService.getAccountRequest(myStore.token);
        if (response.data) {
          const responseData = response.data as IDataResponse;
          account.value = responseData.data as IAccount;
          myStore.hasLogged = !!account.value.id;
          if (!myStore.hasLogged) {
            myStore.removeToken();
          }
        }
      } catch (e) {
        // Refresh token has expired or invalid
        myStore.removeToken();
        location.reload();
      }
    }
  }

  return{
    account,
    actionLogin,
    actionGetAccount,
    actionRegister,
  }
});
