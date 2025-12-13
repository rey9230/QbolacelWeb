import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useProvinces, useMunicipalities } from "@/hooks/useLocations";
import { useLocationStore } from "@/stores/location.store";

interface LocationSelectorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLocationSelected?: (municipality: string, province: string) => void;
  allowClose?: boolean;
  redirectOnClose?: string;
}

export function LocationSelectorModal({
  open,
  onOpenChange,
  onLocationSelected,
  allowClose = false,
  redirectOnClose,
}: LocationSelectorModalProps) {
  const navigate = useNavigate();
  const { setLocation } = useLocationStore();
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [selectedMunicipality, setSelectedMunicipality] = useState<string>("");

  const { data: provinces = [], isLoading: loadingProvinces } = useProvinces();
  const { data: municipalities = [], isLoading: loadingMunicipalities } = useMunicipalities(selectedProvince);

  // Reset municipality when province changes
  useEffect(() => {
    setSelectedMunicipality("");
  }, [selectedProvince]);

  const handleClose = () => {
    onOpenChange(false);
    if (redirectOnClose) {
      navigate(redirectOnClose);
    }
  };

  const handleConfirm = () => {
    if (selectedMunicipality && selectedProvince) {
      setLocation(selectedMunicipality, selectedProvince);
      onLocationSelected?.(selectedMunicipality, selectedProvince);
      onOpenChange(false);
    }
  };

  const isValid = selectedProvince && selectedMunicipality;

  return (
    <Dialog open={open} onOpenChange={allowClose ? handleClose : undefined}>
      <DialogContent 
        className="sm:max-w-md"
        onPointerDownOutside={allowClose ? undefined : (e) => e.preventDefault()}
        onEscapeKeyDown={allowClose ? undefined : (e) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <MapPin className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-center">
            Selecciona tu ubicación
          </DialogTitle>
          <DialogDescription className="text-center">
            Para mostrarte los productos disponibles en tu zona, necesitamos saber dónde te encuentras.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Province Select */}
          <div className="space-y-2">
            <Label htmlFor="province">Provincia</Label>
            <Select
              value={selectedProvince}
              onValueChange={setSelectedProvince}
              disabled={loadingProvinces}
            >
              <SelectTrigger id="province">
                <SelectValue placeholder={loadingProvinces ? "Cargando..." : "Selecciona provincia"} />
              </SelectTrigger>
              <SelectContent>
                {provinces.map((province) => (
                  <SelectItem key={province} value={province}>
                    {province}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Municipality Select */}
          <div className="space-y-2">
            <Label htmlFor="municipality">Municipio</Label>
            <Select
              value={selectedMunicipality}
              onValueChange={setSelectedMunicipality}
              disabled={!selectedProvince || loadingMunicipalities}
            >
              <SelectTrigger id="municipality">
                <SelectValue 
                  placeholder={
                    !selectedProvince 
                      ? "Primero selecciona provincia" 
                      : loadingMunicipalities 
                        ? "Cargando..." 
                        : "Selecciona municipio"
                  } 
                />
              </SelectTrigger>
              <SelectContent>
                {municipalities.map((municipality) => (
                  <SelectItem key={municipality} value={municipality}>
                    {municipality}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          {allowClose && (
            <Button variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
          )}
          <Button 
            onClick={handleConfirm} 
            disabled={!isValid}
            className="flex-1"
          >
            Confirmar ubicación
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
