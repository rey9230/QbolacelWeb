import { useQuery } from "@tanstack/react-query";
import { productsApi, categoriesApi, type ProductFilters, type Product, type Category } from "@/lib/api";

export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: () => productsApi.getAll(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => productsApi.getById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesApi.getAll(),
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}

export type { Product, Category, ProductFilters };
