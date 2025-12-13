import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { productsApi, categoriesApi, type ProductFilters, type Product, type Category, type CursorPageResponse, type ProductDetailResponse } from "@/lib/api";

// Infinite scroll hook using cursor pagination
export function useProducts(filters: Omit<ProductFilters, 'cursor'> = {}) {
  return useInfiniteQuery({
    queryKey: ["products", filters],
    queryFn: ({ pageParam }) => productsApi.getAll({ ...filters, cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useProduct(id: string, similarLimit = 4) {
  return useQuery({
    queryKey: ["product", id, similarLimit],
    queryFn: () => productsApi.getById(id, similarLimit),
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

export type { Product, Category, ProductFilters, CursorPageResponse, ProductDetailResponse };
