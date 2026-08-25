import { listProducts } from '@/modules/products/api';
import { QUERY_KEYS } from '@/shared/constants/query-keys';
import { useQuery } from '@tanstack/react-query';

export const useProductsQuery = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS],
    queryFn: listProducts,
    select: (result) => result.data.products,
  });
};
