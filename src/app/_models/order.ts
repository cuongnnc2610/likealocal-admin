import { OrderItem } from './orderItem';

export class Order {
  id: number;
  user_id: number;
  user_payment_address_id: number;
  remark: string;
  createdAt: string;
  user: {
    email: string,
    name: string,
  };
  user_payment_address: {
    id: number,
    user_id: number,
    name: string,
    phone_number: string,
    postal_code: string,
    address: string,
  };
  total_usd_price: number;
  total_jpy_price: number;
  items: OrderItem[];
}
