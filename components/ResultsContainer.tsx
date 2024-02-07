import { ProductType } from "../utils/types";
import Product from "./Product";

interface Props {
  items: ProductType[];
}

const ResultsContainer = ({ items }: Props): JSX.Element => {

  return (
    <div>
      {items.map(item => (
        <Product key={item._id} item={item} />
      ))}
    </div>
  )
}

export default ResultsContainer;
