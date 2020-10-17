import { City } from './city';
import { Order } from './order';
import { Tour } from './tour';
import { Level } from './level';
import { UsersLanguage } from './usersLanguage';

export class User {
  id: number;
  name: string;
  company: string;
  country_id: number;  
  role_id: number;
  postal_code: string;
  address: string;
  token?: string;
  data: any;

  user_id: number;
  email: string;
  user_name: string;
  level_id: number;
  is_tour_guide: boolean;
  avatar: string;
  introduction_video: string;
  self_introduction: string;
  city_id: number;
  phone_number: string;
  is_verified: boolean;
  createdAt: string;
  level: Level = new Level();
  city: City = new City();
  usersLanguages: UsersLanguage[] = [];
  languages: string;
  orders: Order[] = [];
  tours: Tour[]= [];
}
