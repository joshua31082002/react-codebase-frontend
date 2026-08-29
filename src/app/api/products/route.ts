import { getProducts } from "@/services/product.service";

export function GET() {
  return Response.json({ products: getProducts() });
}
