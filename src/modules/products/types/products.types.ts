export interface Products {
  products?: Product[];
}

export interface Product {
  id?: number;
  title?: string;
  description?: string;
  category?: string;
  price?: number;
}
