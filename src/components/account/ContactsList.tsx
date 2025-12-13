import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Phone,
  Plus,
  Edit2,
  Trash2,
  Star,
  Loader2,
  Save,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  useContacts,
  useCreateContact,
  useUpdateContact,
  useDeleteContact,
  useSetDefaultContact,
  type Contact,
  type CreateContactRequest,
} from "@/hooks/useContacts";
import { useProvinces, useMunicipalities } from "@/hooks/useLocations";
import { cn } from "@/lib/utils";

const emptyForm: CreateContactRequest = {
  name: "",
  phone: "",
  province_id: "",
  municipality_id: "",
  address: "",
  notes: "",
  is_default: false,
};

export function ContactsList() {
  const { data: contacts, isLoading } = useContacts();
  const { data: provinces } = useProvinces();
  const createContact = useCreateContact();
  const updateContact = useUpdateContact();
  const deleteContact = useDeleteContact();
  const setDefaultContact = useSetDefaultContact();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateContactRequest>(emptyForm);
  const [selectedProvinceId, setSelectedProvinceId] = useState<string>("");

  const { data: municipalities } = useMunicipalities(selectedProvinceId);

  const openCreateDialog = () => {
    setEditingContact(null);
    setFormData(emptyForm);
    setSelectedProvinceId("");
    setIsDialogOpen(true);
  };

  const openEditDialog = (contact: Contact) => {
    setEditingContact(contact);
    setFormData({
      name: contact.name,
      phone: contact.phone,
      province_id: contact.province_id,
      municipality_id: contact.municipality_id,
      address: contact.address,
      notes: contact.notes || "",
      is_default: contact.is_default || false,
    });
    setSelectedProvinceId(contact.province_id);
    setIsDialogOpen(true);
  };

  const handleProvinceChange = (value: string) => {
    setSelectedProvinceId(value);
    setFormData({ ...formData, province_id: value, municipality_id: "" });
  };

  const handleSubmit = () => {
    if (editingContact) {
      updateContact.mutate(
        { id: editingContact.id, data: formData },
        {
          onSuccess: () => {
            setIsDialogOpen(false);
            setEditingContact(null);
          },
        }
      );
    } else {
      createContact.mutate(formData, {
        onSuccess: () => {
          setIsDialogOpen(false);
        },
      });
    }
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteContact.mutate(deleteId, {
        onSuccess: () => {
          setDeleteId(null);
        },
      });
    }
  };

  const handleSetDefault = (id: string) => {
    setDefaultContact.mutate(id);
  };

  const isSubmitting = createContact.isPending || updateContact.isPending;
  const isFormValid =
    formData.name &&
    formData.phone &&
    formData.province_id &&
    formData.municipality_id &&
    formData.address;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Mis Contactos</h3>
            <p className="text-sm text-muted-foreground">
              Direcciones de entrega guardadas
            </p>
          </div>
          <Button onClick={openCreateDialog} className="gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Añadir Contacto</span>
          </Button>
        </div>

        {/* Contacts List */}
        {!contacts?.length ? (
          <div className="bg-card border border-border rounded-xl p-8 text-center">
            <div className="inline-flex p-4 rounded-full bg-muted mb-4">
              <MapPin className="h-8 w-8 text-muted-foreground" />
            </div>
            <h4 className="text-lg font-semibold mb-2">No tienes contactos</h4>
            <p className="text-muted-foreground mb-6">
              Añade direcciones de entrega para tus compras
            </p>
            <Button onClick={openCreateDialog} className="gap-2">
              <Plus className="h-4 w-4" />
              Añadir Primer Contacto
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <AnimatePresence mode="popLayout">
              {contacts.map((contact) => (
                <motion.div
                  key={contact.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={cn(
                    "bg-card border rounded-xl p-4 relative",
                    contact.is_default
                      ? "border-primary shadow-md"
                      : "border-border"
                  )}
                >
                  {contact.is_default && (
                    <Badge className="absolute -top-2 right-4 gap-1">
                      <Star className="h-3 w-3" />
                      Principal
                    </Badge>
                  )}

                  <div className="space-y-2">
                    <h4 className="font-semibold">{contact.name}</h4>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {contact.phone}
                    </p>
                    <p className="text-sm text-muted-foreground flex items-start gap-2">
                      <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>
                        {contact.address}
                        <br />
                        {contact.municipality_name}, {contact.province_name}
                      </span>
                    </p>
                    {contact.notes && (
                      <p className="text-sm text-muted-foreground italic">
                        "{contact.notes}"
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                    {!contact.is_default && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1 text-xs"
                        onClick={() => handleSetDefault(contact.id)}
                        disabled={setDefaultContact.isPending}
                      >
                        <Star className="h-3 w-3" />
                        Predeterminado
                      </Button>
                    )}
                    <div className="flex-1" />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => openEditDialog(contact)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => setDeleteId(contact.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingContact ? "Editar Contacto" : "Nuevo Contacto"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contact-name">Nombre completo</Label>
              <Input
                id="contact-name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Nombre del destinatario"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-phone">Teléfono</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="contact-phone"
                  className="pl-10"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="+53 5X XXX XXXX"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Provincia</Label>
                <Select
                  value={formData.province_id}
                  onValueChange={handleProvinceChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Provincia" />
                  </SelectTrigger>
                  <SelectContent>
                    {provinces?.map((province) => (
                      <SelectItem key={province.id} value={province.id}>
                        {province.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Municipio</Label>
                <Select
                  value={formData.municipality_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, municipality_id: value })
                  }
                  disabled={!selectedProvinceId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Municipio" />
                  </SelectTrigger>
                  <SelectContent>
                    {municipalities?.map((municipality) => (
                      <SelectItem key={municipality.id} value={municipality.id}>
                        {municipality.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-address">Dirección</Label>
              <Textarea
                id="contact-address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder="Calle, número, entre calles, reparto..."
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-notes">Notas (opcional)</Label>
              <Input
                id="contact-notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Indicaciones especiales para la entrega"
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !isFormValid}
              className="gap-2"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {editingContact ? "Guardar Cambios" : "Crear Contacto"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar contacto?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El contacto será eliminado
              permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteContact.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
