import { ProductType } from "@/utils/types";
import Link from "next/link";
import Image from "next/image";
import { Cart } from "react-bootstrap-icons";

interface Props {
  item: ProductType;
};

const Product = ({ item }: Props): JSX.Element => {

  const formatTitle = (str: string) => {

    return str.toLowerCase().replace(/\b\w/g, function(char) {
      return char.toUpperCase();
    });
  }

  return (
    <div className="flex w-full pt-2">
      <Image className="mr-2" src={item.product_images} alt={item.product_name} height={125} width={125} />
      <div className="flex flex-col flex-1 justify-between p-4">
        <h5 className="text-base font-semibold">{formatTitle(item.product_name)}</h5>
        <p className="text-sm">{item.details}</p>
        <p className="text-lg font-bold">${item.price}</p>
        <div className="flex justify-between text-xs">
          <span className="p-2 rounded-full bg-white">{ Math.round(item.$similarity * 1000)/10 }% Match</span>
          <Link href={item.link} rel="noopener noreferrer" target="_blank">
            <button className="slime-background flex items-center p-2 gap-2 rounded-full">
              <Cart />
              Buy
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
};

export default Product;
