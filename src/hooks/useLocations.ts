import { useQuery } from "@tanstack/react-query";
import { geoApi } from "@/lib/api";

export function useProvinces() {
  return useQuery({
    queryKey: ["provinces"],
    queryFn: async () => {
      const response = await geoApi.getProvinces();
      return response.provinces;
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours - static data
  });
}

export function useMunicipalities(province?: string) {
  return useQuery({
    queryKey: ["municipalities", province],
    queryFn: async () => {
      const response = await geoApi.getMunicipalities(province);
      return response.municipalities;
    },
    enabled: !!province,
    staleTime: 1000 * 60 * 60 * 24,
  });
}
