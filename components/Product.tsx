import { ProductType } from "@/utils/types";
import Link from "next/link";
import Image from "next/image";
import { Cart } from "react-bootstrap-icons";

interface Props {
  item: ProductType;
};

const Product = ({ item }: Props): JSX.Element => {

  return (
    <div className="flex w-full pt-2">
      <Image className="mr-2" src={item.product_images} alt={item.product_name} height={125} width={125} />
      <div className="flex flex-col flex-1 justify-between p-4">
        <Link href={item.link}>{item.product_name}</Link>
        <p>{item.details}</p>
        <p>${item.price}</p>
        <div className="flex justify-between">
          <span className="p-2 radius-full">{ Math.round(item.$similarity * 1000)/10 }% Match</span>
          <button className="flex items-center p-2 radius-full">
            <Cart />
            Buy
          </button>
        </div>
      </div>
    </div>
  )
};

export default Product;
