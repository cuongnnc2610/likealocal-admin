import { OrderItem } from './orderItem';
import { User } from './user';
import { ToursHost } from './toursHost';

export class Order {
  id: number;
  user_payment_address_id: number;
  remark: string;
  createdAt: string;
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

  order_id: number;
  tours_host_id: number;
  user_id: number;
  fullname: string;
  email: string;
  phone_number: string;
  country_id: number;
  number_of_people: number;
  price: number;
  coupon_id: number;
  discount: number;
  status: number;
  is_cancelled: boolean;
  is_paid_to_system: boolean;
  is_paid_to_host: boolean;
  toursHost: ToursHost = new ToursHost();
  user: User = new User();
}
