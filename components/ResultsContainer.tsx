import { ProductType } from "../utils/types";
import Product from "./Product";

interface Props {
  items: ProductType[];
}

const ResultsContainer = ({ items }: Props): JSX.Element => {

  return (
    <>
      <h2>Results</h2>
      <div className="flex flex-col items-center overflow-y-auto w-full divide-y divide-black p-4">
        
        {items.map(item => (
          <Product key={item._id} item={item} />
        ))}
      </div>
    </>
  )
}

export default ResultsContainer;
