import { defineStore } from 'pinia';
import { ref } from 'vue';
import { IDataResponse } from '../models/interface/IDataResponse';
import { ICategory } from '../models/interface/ICategory';
import CategoryService from '../services/category-service';
import { MyStore } from './my-store';
export const CategoryStore = defineStore('categoryStore', () => {
  const categories = ref<ICategory[]>([]);
  const myStore = MyStore();
  async function actionGetCategories() {
    //call request
    const response = await CategoryService.getCategoriesRequest(myStore.token);
    if(response.data){
      const responseData = response.data as IDataResponse;
      categories.value = responseData.data as ICategory[];
    }
  }

  return{
    categories,
    actionGetCategories,
  }
});
