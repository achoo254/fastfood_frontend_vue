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
  const accountCrud = ref<IAccount>({id: ''} as IAccount);
  const accounts = ref<IAccount[]>([]);
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

  async function actionGetAccountCrud(account_id: string) {
    //call request
    const response = await AccountService.getAccountCrudRequest(myStore.token, account_id);
    if(response.data){
      const responseData = response.data as IDataResponse;
      accountCrud.value = responseData.data as IAccount;
    }
  }

  async function actionGetAccounts() {
    //call request
    const response = await AccountService.getAccountsRequest(myStore.token);
    if(response.data){
      const responseData = response.data as IDataResponse;
      accounts.value = responseData.data as IAccount[];
    }
  }

  async function actionCreateAccount(data: IAccount) {
    if(myStore.token){
      //call request
      await AccountService.createAccountRequest(myStore.token, data);
    }
  }

  async function actionUpdateAccount(data: IAccount) {
    if(myStore.token){
      //call request
      await AccountService.updateAccountRequest(myStore.token, data);
    }
  }

  async function actionDeleteAccount(data: IAccount) {
    if(myStore.token){
      //call request
      await AccountService.deleteAccountRequest(myStore.token, data);
    }
  }

  return{
    account,
    accounts,
    accountCrud,
    actionLogin,
    actionGetAccount,
    actionRegister,
    actionGetAccounts,
    actionCreateAccount,
    actionUpdateAccount,
    actionDeleteAccount,
    actionGetAccountCrud,
  }
});
