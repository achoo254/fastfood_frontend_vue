import { defineStore } from 'pinia';
import { ref } from 'vue';
import { IDataResponse } from '../models/interface/IDataResponse';
import { IOrder } from '../models/interface/IOrder';
import OrderService from '../services/order-service';
import { showToastMessage } from '../utils/my-function';
import { IProduct } from '../models/interface/IProduct';
import { MyStore } from './my-store';
export const OrderStore = defineStore('orderStore', () => {
  const orders = ref<IOrder[]>([]);
  const orderCreating = ref<IOrder>({id: ''} as IOrder);
  const myStore = MyStore();
  async function actionCreateOrder(data: IOrder) {
    //call request
    const response = await OrderService.createOrderRequest(data, myStore.token);
    if(response.data){
      const responseData = response.data as IDataResponse;
      orderCreating.value = responseData.data as IOrder;
    }
  }

  async function actionGetOrders() {
    //call request
    const response = await OrderService.getOrdersRequest(myStore.token);
    if(response.data){
      const responseData = response.data as IDataResponse;
      orders.value = responseData.data as IOrder[];
    }
  }

  async function actionUpdateOrder(data: IOrder) {
    if(data.id){
      //call request
      await OrderService.updateOrderRequest(data, myStore.token);
    }
    else{
      showToastMessage('Dữ liệu không chính xác', true);
    }
  }

  function resetOrderCreating(){
    orderCreating.value = {id: '', status: '', table: '', products: [] as IProduct[], final_amount: 0, total_amount: 0, count_person: 0} as IOrder;
  }

  return{
    orders,
    orderCreating,
    actionCreateOrder,
    actionUpdateOrder,
    resetOrderCreating,
    actionGetOrders,
  }
});
