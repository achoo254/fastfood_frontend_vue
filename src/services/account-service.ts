import { IAccount } from '../models/interface/IAccount';
import { apiClient } from '../http-common';
import { ICategory } from '../models/interface/ICategory';

class AccountService {
  loginRequest(data: IAccount): Promise<any> {
    return apiClient('').post('/account/login', data);
  }
  registerRequest(data: IAccount): Promise<any> {
    return apiClient('').post('/account/register', data);
  }
  getAccountRequest(token: string): Promise<any> {
    return apiClient(token).get('/account');
  }
  getAccountCrudRequest(token: string, account_id: string): Promise<any> {
    return apiClient(token).get('/account/' + account_id);
  }
  getAccountsRequest(token: string): Promise<any> {
    return apiClient(token).get('/accounts');
  }
  createAccountRequest(token: string, data: IAccount): Promise<any> {
    return apiClient(token).post('/account/create', data);
  }
  updateAccountRequest(token: string, data: IAccount): Promise<any> {
    return apiClient(token).put('/account/' + data.id, data);
  }
  deleteAccountRequest(token: string, data: IAccount): Promise<any> {
    return apiClient(token).delete('/account/' + data.id);
  }
}

export default new AccountService();
