import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  contactsApi, 
  type ContactDto, 
  type CreateContactRequest, 
  type UpdateContactRequest,
  type ContactListResponse 
} from "@/lib/api";
import { useAuthStore } from "@/stores/auth.store";
import { toast } from "sonner";

export function useContacts() {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ["contacts"],
    queryFn: async () => {
      const response = await contactsApi.getAll();
      return response;
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

export function useContact(id: string) {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ["contact", id],
    queryFn: async () => {
      const response = await contactsApi.getById(id);
      return response;
    },
    enabled: isAuthenticated && !!id,
  });
}

export function useCreateContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateContactRequest) => contactsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      toast.success("Contacto creado correctamente");
    },
    onError: (error: Error) => {
      toast.error("Error al crear el contacto", {
        description: error.message,
      });
    },
  });
}

export function useUpdateContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateContactRequest }) =>
      contactsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      toast.success("Contacto actualizado correctamente");
    },
    onError: (error: Error) => {
      toast.error("Error al actualizar el contacto", {
        description: error.message,
      });
    },
  });
}

export function useDeleteContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => contactsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      toast.success("Contacto eliminado correctamente");
    },
    onError: (error: Error) => {
      toast.error("Error al eliminar el contacto", {
        description: error.message,
      });
    },
  });
}

export function useSetDefaultContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => contactsApi.setDefault(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      toast.success("Contacto establecido como predeterminado");
    },
    onError: (error: Error) => {
      toast.error("Error al establecer contacto predeterminado", {
        description: error.message,
      });
    },
  });
}

export type { ContactDto, CreateContactRequest, UpdateContactRequest, ContactListResponse };
