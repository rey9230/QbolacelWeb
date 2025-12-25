import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Phone,
  Plus,
  Star,
  Loader2,
  ChevronLeft,
  Check,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useContacts,
  useCreateContact,
  type ContactDto,
  type CreateContactRequest,
} from "@/hooks/useContacts";
import { useProvinces, useMunicipalities } from "@/hooks/useLocations";
import { cn } from "@/lib/utils";

interface LocationContactSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (contact: ContactDto) => void;
  selectedContactId?: string;
  redirectOnClose?: string;
}

type View = "list" | "create";

const emptyForm: CreateContactRequest = {
  fullName: "",
  phone: "",
  street: "",
  betweenStreets: "",
  municipality: "",
  isDefault: false,
};

export function LocationContactSelector({
  open,
  onOpenChange,
  onSelect,
  selectedContactId,
  redirectOnClose,
}: LocationContactSelectorProps) {
  const navigate = useNavigate();
  const {
    data: contactsData,
    isLoading: isLoadingContacts,
    isError: isContactsError,
    error: contactsError,
  } = useContacts();
  const { data: provinces, isLoading: isLoadingProvinces } = useProvinces();
  const createContact = useCreateContact();

  const [view, setView] = useState<View>("list");
  const [formData, setFormData] = useState<CreateContactRequest>(emptyForm);
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [localSelectedId, setLocalSelectedId] = useState<string | undefined>(selectedContactId);

  const { data: municipalities, isLoading: isLoadingMunicipalities } = useMunicipalities(selectedProvince);

  const contacts = contactsData?.contacts || [];
  const defaultContactId = contactsData?.defaultContactId;

  // Auto-select default contact when dialog opens
  useEffect(() => {
    if (open && !selectedContactId && defaultContactId) {
      setLocalSelectedId(defaultContactId);
    } else if (open && selectedContactId) {
      setLocalSelectedId(selectedContactId);
    }
  }, [open, selectedContactId, defaultContactId]);

  // Reset view when dialog closes
  useEffect(() => {
    if (!open) {
      setView("list");
      setFormData(emptyForm);
      setSelectedProvince("");
    }
  }, [open]);

  const handleProvinceChange = (value: string) => {
    setSelectedProvince(value);
    setFormData({ ...formData, municipality: "" });
  };

  const handleCreateContact = () => {
    createContact.mutate(formData, {
      onSuccess: (newContact) => {
        setView("list");
        setLocalSelectedId(newContact.id);
        setFormData(emptyForm);
        setSelectedProvince("");
      },
    });
  };

  const handleClose = () => {
    onOpenChange(false);
    if (redirectOnClose) {
      navigate(redirectOnClose);
    }
  };

  const handleConfirmSelection = () => {
    const selectedContact = contacts.find((c) => c.id === localSelectedId);
    if (selectedContact) {
      onSelect(selectedContact);
      onOpenChange(false);
    }
  };

  const isFormValid =
    formData.fullName.trim() &&
    formData.phone.trim() &&
    formData.street.trim() &&
    formData.municipality;

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) handleClose();
      }}
    >
      <DialogContent className="max-w-lg max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {view === "create" && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 -ml-2"
                onClick={() => setView("list")}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
            {view === "list" ? "Seleccionar Dirección" : "Nueva Dirección"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto -mx-6 px-6">
          <AnimatePresence mode="wait">
            {view === "list" ? (
              <motion.div
                key="list"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-3"
              >
                {isLoadingContacts ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : isContactsError ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      No se pudieron cargar tus direcciones.
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {(contactsError as Error | undefined)?.message ?? ""}
                    </p>
                  </div>
                ) : contacts.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="inline-flex p-4 rounded-full bg-muted mb-4">
                      <MapPin className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground mb-4">
                      No tienes direcciones guardadas
                    </p>
                    <Button onClick={() => setView("create")} className="gap-2">
                      <Plus className="h-4 w-4" />
                      Añadir Primera Dirección
                    </Button>
                  </div>
                ) : (
                  <>
                    {contacts.map((contact) => (
                      <div
                        key={contact.id}
                        onClick={() => setLocalSelectedId(contact.id)}
                        className={cn(
                          "p-4 rounded-xl border-2 cursor-pointer transition-all",
                          localSelectedId === contact.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-muted-foreground/50"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={cn(
                              "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5",
                              localSelectedId === contact.id
                                ? "border-primary bg-primary"
                                : "border-muted-foreground/30"
                            )}
                          >
                            {localSelectedId === contact.id && (
                              <Check className="h-3 w-3 text-primary-foreground" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold truncate">
                                {contact.fullName}
                              </h4>
                              {contact.isDefault && (
                                <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
                                  <Star className="h-3 w-3 fill-current" />
                                  Principal
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {contact.street}
                              {contact.betweenStreets && `, ${contact.betweenStreets}`}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {contact.municipality}
                              {contact.province ? `, ${contact.province}` : ""}
                            </p>
                            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                              <Phone className="h-3 w-3" />
                              {contact.phone}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}

                    <Button
                      variant="outline"
                      className="w-full gap-2 mt-4"
                      onClick={() => setView("create")}
                    >
                      <Plus className="h-4 w-4" />
                      Añadir Nueva Dirección
                    </Button>
                  </>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="create"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nombre completo *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="fullName"
                      className="pl-10"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      placeholder="Juan Pérez García"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      className="pl-10"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="+53 5 1234567"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Provincia *</Label>
                    <Select
                      value={selectedProvince}
                      onValueChange={handleProvinceChange}
                      disabled={isLoadingProvinces}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        {provinces?.map((province) => (
                          <SelectItem key={province} value={province}>
                            {province}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Municipio *</Label>
                    <Select
                      value={formData.municipality}
                      onValueChange={(value) =>
                        setFormData({ ...formData, municipality: value })
                      }
                      disabled={!selectedProvince || isLoadingMunicipalities}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent>
                        {municipalities?.map((municipality) => (
                          <SelectItem key={municipality} value={municipality}>
                            {municipality}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="street">Calle y número *</Label>
                  <Input
                    id="street"
                    value={formData.street}
                    onChange={(e) =>
                      setFormData({ ...formData, street: e.target.value })
                    }
                    placeholder="Calle 23 #456"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="betweenStreets">Entre calles (opcional)</Label>
                  <Input
                    id="betweenStreets"
                    value={formData.betweenStreets}
                    onChange={(e) =>
                      setFormData({ ...formData, betweenStreets: e.target.value })
                    }
                    placeholder="entre 4 y 6"
                  />
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox
                    id="isDefault"
                    checked={formData.isDefault}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, isDefault: checked === true })
                    }
                  />
                  <Label
                    htmlFor="isDefault"
                    className="text-sm font-normal cursor-pointer"
                  >
                    Establecer como dirección predeterminada
                  </Label>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <DialogFooter className="mt-4">
          {view === "list" ? (
            <>
              <Button variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button
                onClick={handleConfirmSelection}
                disabled={!localSelectedId}
                className="gap-2"
              >
                <Check className="h-4 w-4" />
                Seleccionar
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setView("list")}>
                Cancelar
              </Button>
              <Button
                onClick={handleCreateContact}
                disabled={!isFormValid || createContact.isPending}
                className="gap-2"
              >
                {createContact.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                Guardar Dirección
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
