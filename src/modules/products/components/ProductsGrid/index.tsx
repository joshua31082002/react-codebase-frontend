import { useProductsQuery } from '@/modules/products/hooks/useProductsQuery';
import styles from './ProductsGrid.module.scss';
import ProductCard from '@/modules/products/components/ProductCard';

const ProductsGrid = () => {
  const { data: products } = useProductsQuery();

  return (
    <div className={styles['grid-container']}>
      {products?.map((product) => (
        <ProductCard product={product} />
      ))}
    </div>
  );
};

export default ProductsGrid;
