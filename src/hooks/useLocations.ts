import { useQuery } from "@tanstack/react-query";
import { locationsApi } from "@/lib/api";

export function useProvinces() {
  return useQuery({
    queryKey: ["provinces"],
    queryFn: () => locationsApi.getProvinces(),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}

export function useMunicipalities(provinceId: string) {
  return useQuery({
    queryKey: ["municipalities", provinceId],
    queryFn: () => locationsApi.getMunicipalities(provinceId),
    enabled: !!provinceId,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}
