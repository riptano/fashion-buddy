import { CATEGORIES, GENDERS } from "./consts";

export interface ProductType {
  _id: string;
  product_name: string;
  product_images: string;
  price: number;
  details: string;
  category: string;
  link: string;
  gender: string;
  $similarity: number;
}

type CategoryType = typeof CATEGORIES[number];
type GenderType = typeof GENDERS[number];

export interface Filters {
  categories: CategoryType[];
  gender: GenderType[];
}