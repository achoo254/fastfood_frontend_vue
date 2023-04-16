import { IAccount } from '../models/interface/IAccount';
import { apiClient } from '../http-common';

class AccountService {
  loginRequest(data: IAccount): Promise<any> {
    return apiClient('').post('/account/login', data);
  }
  registerRequest(data: IAccount): Promise<any> {
    return apiClient('').post('/account/create', data);
  }
  getAccountRequest(token: string): Promise<any> {
    return apiClient(token).get('/account');
  }
}

export default new AccountService();
