import { Country } from './country';

export class City {
    cityId: number;
    country: Country = new Country();
    name: string;
    image: string;
    createdAt?: string;
    updatedAt?: string;
}
  