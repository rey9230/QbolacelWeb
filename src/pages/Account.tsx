import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  User,
  Package,
  MapPin,
  LogOut,
  ChevronRight,
  Phone,
  Mail,
  Edit2,
  Save,
  X,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useAuthStore } from "@/stores/auth.store";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { useProvinces, useMunicipalities } from "@/hooks/useLocations";
import { OrdersList } from "@/components/account/OrdersList";
import { ContactsList } from "@/components/account/ContactsList";
import { authApi } from "@/lib/api";
import { toast } from "sonner";

export default function Account() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuthStore();
  const { data: profile, isLoading: profileLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const { data: provinces } = useProvinces();

  const [isEditing, setIsEditing] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    municipality: "",
    address: "",
  });

  const { data: municipalities } = useMunicipalities(selectedProvince);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        phone: profile.phone || "",
        municipality: profile.municipality || "",
        address: profile.address || "",
      });
      setSelectedProvince(profile.province || "");
    }
  }, [profile]);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      // Ignore logout errors
    }
    logout();
    navigate("/");
    toast.success("Sesión cerrada correctamente");
  };

  const handleSaveProfile = () => {
    updateProfile.mutate(formData, {
      onSuccess: () => {
        setIsEditing(false);
      },
    });
  };

  const handleProvinceChange = (value: string) => {
    setSelectedProvince(value);
    setFormData({ ...formData, municipality: "" });
  };

  if (!isAuthenticated) {
    return null;
  }

  // Province and municipality are now strings directly
  const provinceName = selectedProvince;
  const municipalityName = formData.municipality;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Mi Cuenta</h1>
              <p className="text-muted-foreground">
                Gestiona tu perfil, órdenes y contactos
              </p>
            </div>
            <Button
              variant="outline"
              className="gap-2 text-destructive hover:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </Button>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid grid-cols-3 w-full max-w-md">
              <TabsTrigger value="profile" className="gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Perfil</span>
              </TabsTrigger>
              <TabsTrigger value="orders" className="gap-2">
                <Package className="h-4 w-4" />
                <span className="hidden sm:inline">Órdenes</span>
              </TabsTrigger>
              <TabsTrigger value="contacts" className="gap-2">
                <MapPin className="h-4 w-4" />
                <span className="hidden sm:inline">Contactos</span>
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Información Personal</h2>
                  {!isEditing ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit2 className="h-4 w-4" />
                      Editar
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setIsEditing(false);
                          if (profile) {
                            setFormData({
                              name: profile.name || "",
                              phone: profile.phone || "",
                              municipality: profile.municipality || "",
                              address: profile.address || "",
                            });
                          }
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        className="gap-2"
                        onClick={handleSaveProfile}
                        disabled={updateProfile.isPending}
                      >
                        {updateProfile.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                        Guardar
                      </Button>
                    </div>
                  )}
                </div>

                {profileLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Avatar & Email */}
                    <div className="flex items-center gap-4 pb-6 border-b border-border">
                      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-lg">{profile?.name || "Usuario"}</p>
                        <p className="text-muted-foreground flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {profile?.email}
                        </p>
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid gap-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nombre completo</Label>
                          {isEditing ? (
                            <Input
                              id="name"
                              value={formData.name}
                              onChange={(e) =>
                                setFormData({ ...formData, name: e.target.value })
                              }
                              placeholder="Tu nombre"
                            />
                          ) : (
                            <p className="text-foreground py-2">{profile?.name || "-"}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Teléfono</Label>
                          {isEditing ? (
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                id="phone"
                                className="pl-10"
                                value={formData.phone}
                                onChange={(e) =>
                                  setFormData({ ...formData, phone: e.target.value })
                                }
                                placeholder="+1 XXX XXX XXXX"
                              />
                            </div>
                          ) : (
                            <p className="text-foreground py-2 flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              {profile?.phone || "-"}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Provincia</Label>
                          {isEditing ? (
                            <Select
                              value={selectedProvince}
                              onValueChange={handleProvinceChange}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar provincia" />
                              </SelectTrigger>
                              <SelectContent>
                                {provinces?.map((province) => (
                                  <SelectItem key={province} value={province}>
                                    {province}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <p className="text-foreground py-2">{provinceName || "-"}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label>Municipio</Label>
                          {isEditing ? (
                            <Select
                              value={formData.municipality}
                              onValueChange={(value) =>
                                setFormData({ ...formData, municipality: value })
                              }
                              disabled={!selectedProvince}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar municipio" />
                              </SelectTrigger>
                              <SelectContent>
                                {municipalities?.map((municipality) => (
                                  <SelectItem key={municipality} value={municipality}>
                                    {municipality}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <p className="text-foreground py-2">{municipalityName || "-"}</p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address">Dirección</Label>
                        {isEditing ? (
                          <Input
                            id="address"
                            value={formData.address}
                            onChange={(e) =>
                              setFormData({ ...formData, address: e.target.value })
                            }
                            placeholder="Calle, número, entre calles..."
                          />
                        ) : (
                          <p className="text-foreground py-2 flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            {profile?.address || "-"}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders">
              <OrdersList />
            </TabsContent>

            {/* Contacts Tab */}
            <TabsContent value="contacts">
              <ContactsList />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
}
