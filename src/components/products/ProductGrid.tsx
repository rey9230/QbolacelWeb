import { ProductCard } from "./ProductCard";
import { Product } from "@/lib/api";
import { cn } from "@/lib/utils";

interface ProductGridProps {
  products: Product[];
  showPromoBanner?: boolean;
  viewMode?: "grid" | "list";
}

export function ProductGrid({ products, showPromoBanner = true, viewMode = "grid" }: ProductGridProps) {
  return (
    <div className={cn(
      viewMode === "grid" 
        ? "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6"
        : "flex flex-col gap-3"
    )}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} viewMode={viewMode} />
      ))}
    </div>
  );
}
