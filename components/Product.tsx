import { ProductType } from "@/utils/types";
import Link from "next/link";
import Image from "next/image";

interface Props {
  item: ProductType;
};

const Product = ({ item }: Props): JSX.Element => {

  return (
    <div className="flex">
      <Image src={item.product_images} alt={item.product_name} height={150} width={100} />
      <div className="flex flex-col flex-1">
        <Link href={item.link}>{item.product_name}</Link>
        <p>{item.details}</p>
        <p>{item.price}</p>
        <p>{item.$similarity}</p>
      </div>
    </div>
  )
};

export default Product;
