import { useQuery } from "@tanstack/react-query";
import { locationsApi, type Province, type Municipality } from "@/lib/api";

export function useProvinces() {
  return useQuery({
    queryKey: ["provinces"],
    queryFn: async () => {
      const response = await locationsApi.getProvinces();
      return response.data;
    },
    staleTime: 1000 * 60 * 60 * 24,
  });
}

export function useMunicipalities(provinceId: string) {
  return useQuery({
    queryKey: ["municipalities", provinceId],
    queryFn: async () => {
      const response = await locationsApi.getMunicipalities(provinceId);
      return response.data;
    },
    enabled: !!provinceId,
    staleTime: 1000 * 60 * 60 * 24,
  });
}

export type { Province, Municipality };
