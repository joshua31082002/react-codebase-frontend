import apiClient from '@/config/api-client';
import type { Products } from '@/modules/products/types/products.types';
import { API_ROUTES } from '@/shared/constants/api-routes';

export const listProducts = async () => apiClient.get<Products>(API_ROUTES.PRODUCTS);
