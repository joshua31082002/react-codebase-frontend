import type { Product } from '@/modules/products/types/products.types';
import styles from './ProductCard.module.scss';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className={styles['product-card']}>
      <h3 className={styles['product-card__title']}>{product.title}</h3>
      <p className={styles['product-card__description']}>{product.description}</p>
      <div className={styles['product-card__category-container']}>
        <div className={styles['product-card__category-container__tag']}>{product.category}</div>
      </div>
    </div>
  );
};

export default ProductCard;
