import { Category } from './category';
import { Transport } from './transport';
import { City } from './city';
import { User } from './user';

export class Tour {
    tour_id: number;
    name: string;
    description: string;
    sale_price: number;
    city: City = new City();
    category: Category = new Category();
    transport: Transport = new Transport();
    host: User = new User();
    createdAt?: string;
    updatedAt?: string;
}
  