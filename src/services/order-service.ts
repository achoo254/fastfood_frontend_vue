import { apiClient } from '../http-common';
import { IOrder } from '../models/interface/IOrder';

class OrderService {
  createOrderRequest(data: IOrder, token: string): Promise<any> {
    return apiClient(token).post('/order/create', data);
  }
  updateOrderRequest(data: IOrder, token: string): Promise<any> {
    return apiClient(token).post('/order/' + data.id, data);
  }
  getOrdersRequest(token: string): Promise<any> {
    return apiClient(token).get('/order');
  }
}

export default new OrderService();
