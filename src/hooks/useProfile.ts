import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi, type UserProfile, type UpdateProfileRequest } from "@/lib/api";
import { useAuthStore } from "@/stores/auth.store";
import { toast } from "sonner";

export function useProfile() {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ["profile"],
    queryFn: () => authApi.me(),
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => authApi.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Perfil actualizado correctamente");
    },
    onError: (error: Error) => {
      toast.error("Error al actualizar el perfil", {
        description: error.message,
      });
    },
  });
}

export type { UserProfile, UpdateProfileRequest };
