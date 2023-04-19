import { apiClient } from '../http-common';
import { ICategory } from '../models/interface/ICategory';

class CategoryService {
  getCategoriesRequest(token: string): Promise<any> {
    return apiClient(token).get('/category');
  }
  getCategoryRequest(token: string, category_id: string): Promise<any> {
    return apiClient(token).get('/category/' + category_id);
  }
  createCategoryRequest(token: string, data: ICategory): Promise<any> {
    return apiClient(token).post('/category/create', data);
  }
  updateCategoryRequest(token: string, data: ICategory): Promise<any> {
    return apiClient(token).put('/category/' + data.id, data);
  }

  deleteCategoryRequest(token: string, data: ICategory): Promise<any> {
    return apiClient(token).delete('/category/' + data.id);
  }
}

export default new CategoryService();
