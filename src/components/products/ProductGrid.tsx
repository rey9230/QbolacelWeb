import { ProductCard, Product } from "./ProductCard";

interface ProductGridProps {
  products: Product[];
  showPromoBanner?: boolean;
}

export function ProductGrid({ products, showPromoBanner = true }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
