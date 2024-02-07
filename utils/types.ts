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