import { GroupPart } from './groupPart';

export interface Part {
  id: number;
  part_id: number;
  code_number: string;
  name: string;
  usd_price: number;
  jpy_price: number;
  parts_image_number: number;
  quantity: number;
  is_deleted?: string;
  group_part?: GroupPart;
  remark?: string
}



