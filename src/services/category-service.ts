import { apiClient } from '../http-common';

class CategoryService {
  getCategoriesRequest(token: string): Promise<any> {
    return apiClient(token).get('/category');
  }
}

export default new CategoryService();
