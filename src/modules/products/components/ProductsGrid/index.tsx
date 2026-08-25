import { useProductsQuery } from '@/modules/products/hooks/useProductsQuery';
import styles from './ProductsGrid.module.scss';
import ProductCard from '@/modules/products/components/ProductCard';
import ConditionalRender from '@/shared/components/ui/ConditionalRender';
import Spin from '@/shared/components/ui/Spin';

const ProductsGrid = () => {
  const { data: products, isLoading } = useProductsQuery();

  return (
    <ConditionalRender
      condition={isLoading}
      children={
        <div className={styles['loader']}>
          <Spin size='large' />
        </div>
      }
      fallback={
        <div className={styles['grid-container']}>
          {products?.map((product) => (
            <ProductCard product={product} />
          ))}
        </div>
      }
    />
  );
};

export default ProductsGrid;
