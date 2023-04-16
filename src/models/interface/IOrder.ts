import { IProduct } from './IProduct';
import { IAccount } from './IAccount';

export interface IOrder{
  id: string;
  account: IAccount;
  table: string;
  count_person: number;
  products: IProduct[];
  status: string;
  total_amount: number;
  final_amount: number;
  created: string;
}
