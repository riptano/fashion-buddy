import { ProductType } from "@/utils/types";
import Link from "next/link";
import Image from "next/image";
import { Cart } from "react-bootstrap-icons";

interface Props {
  item: ProductType;
}

const Product = ({ item }: Props): JSX.Element => {
  const formatTitle = (str: string) => {
    return str.toLowerCase().replace(/\b\w/g, function (char) {
      return char.toUpperCase();
    });
  };

  return (
    <div className="flex w-full max-w-full">
      <img
        className="mr-2"
        src={item.product_images}
        alt={item.product_name}
        height={120}
        width={120}
      />
      <div className="flex flex-col justify-between p-4 overflow-x-hidden">
        <div>
          <h5 className="text-base font-semibold truncate mb-1">
            {formatTitle(item.product_name)}
          </h5>
          <p className="text-sm truncate-desc">{item.details}</p>
        </div>
        <div className="flex justify-center items-center gap-2">
          <p className="flex-1 text-lg font-bold">${item.price}</p>
          <div className="text-xs">
            <span className="py-2 px-3 rounded-full bg-white">
              {Math.round(item.$similarity * 1000) / 10}% Match
            </span>
          </div>
          <Link href={item.link} rel="noopener noreferrer" target="_blank">
            <button className="slime-background flex items-center text-xs rounded-full py-2 px-3">
              <Cart className="mr-1" />
              Buy
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Product;
