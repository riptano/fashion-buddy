import { ProductType } from "@/utils/types";
import Link from "next/link";
import Image from "next/image";

interface Props {
  item: ProductType;
};

const Product = ({ item }: Props): JSX.Element => {

  return (
    <div className="flex">
      <Image className="mr-2" src={item.product_images} alt={item.product_name} height={150} width={100} />
      <div className="flex flex-col flex-1">
        <Link href={item.link}>{item.product_name}</Link>
        <p>{item.details}</p>
        <p>{item.price}</p>
        <div className="flex ">
          <span>{item.$similarity * 100}%</span>
          <button>Buy</button>
        </div>
      </div>
    </div>
  )
};

export default Product;
