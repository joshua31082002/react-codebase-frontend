import ProductsGrid from '@/modules/products/components/ProductsGrid';
import styles from './ProductsPage.module.scss';

const ProductsPage = () => {
  return (
    <div className={styles['products-page']}>
      <ProductsGrid />
    </div>
  );
};

export default ProductsPage;
