import { defineStore } from 'pinia';
import { ref } from 'vue';
import { IDataResponse } from '../models/interface/IDataResponse';
import { ICategory } from '../models/interface/ICategory';
import CategoryService from '../services/category-service';
import { MyStore } from './my-store';
import { IAccount } from '../models/interface/IAccount';

export const CategoryStore = defineStore('categoryStore', () => {
  const categories = ref<ICategory[]>([]);
  const category = ref<ICategory>();
  const myStore = MyStore();
  async function actionGetCategories() {
    //call request
    const response = await CategoryService.getCategoriesRequest(myStore.token);
    if(response.data){
      const responseData = response.data as IDataResponse;
      categories.value = responseData.data as ICategory[];
    }
  }

  async function actionCreateCategory(data: ICategory) {
    if(myStore.token){
      //call request
      await CategoryService.createCategoryRequest(myStore.token, data);
    }
  }

  async function actionUpdateCategory(data: ICategory) {
    if(myStore.token){
      //call request
      await CategoryService.updateCategoryRequest(myStore.token, data);
    }
  }

  async function actionDeleteCategory(data: ICategory) {
    if(myStore.token){
      //call request
      await CategoryService.deleteCategoryRequest(myStore.token, data);
    }
  }

  async function actionGetCategory(category_id: string) {
    //call request
    const response = await CategoryService.getCategoryRequest(myStore.token, category_id);
    if(response.data){
      const responseData = response.data as IDataResponse;
      category.value = responseData.data as ICategory;
    }
  }

  return{
    categories,
    category,
    actionGetCategories,
    actionGetCategory,
    actionCreateCategory,
    actionUpdateCategory,
    actionDeleteCategory,
  }
});
