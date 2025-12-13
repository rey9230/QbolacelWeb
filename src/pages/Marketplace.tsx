import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, SlidersHorizontal, Smartphone, X, MapPin, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Product } from "@/components/products/ProductCard";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/stores/auth.store";
import { useLocationStore } from "@/stores/location.store";
import { useProfile } from "@/hooks/useProfile";
import { LocationSelectorModal } from "@/components/location/LocationSelectorModal";
import { LocationContactSelector } from "@/components/checkout/LocationContactSelector";
import { ContactDto } from "@/hooks/useContacts";

// Sample products data
const allProducts: Product[] = [
  {
    id: "1",
    name: "Combo Familiar Premium",
    description: "Arroz, aceite, pasta y más productos esenciales",
    price: 89.99,
    currency: "USD",
    image: "https://images.unsplash.com/photo-1543168256-418811576931?w=400&h=400&fit=crop",
    stock: 15,
    vendor_id: "v1",
    vendor_name: "Tienda Cuba",
    category: "Alimentos",
    isPopular: true,
  },
  {
    id: "2",
    name: "Kit de Aseo Personal",
    description: "Jabón, champú, pasta dental y más",
    price: 45.50,
    currency: "USD",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop",
    stock: 23,
    vendor_id: "v2",
    vendor_name: "Productos Cubanos",
    category: "Higiene",
    isNew: true,
  },
  {
    id: "3",
    name: "Electrodoméstico Multifunción",
    description: "Licuadora, procesador y batidora en uno",
    price: 159.00,
    currency: "USD",
    image: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=400&h=400&fit=crop",
    stock: 8,
    vendor_id: "v3",
    vendor_name: "ElectroCuba",
    category: "Electrodomésticos",
  },
  {
    id: "4",
    name: "Pack Medicamentos Básicos",
    description: "Analgésicos, vitaminas y suplementos",
    price: 65.00,
    currency: "USD",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop",
    stock: 50,
    vendor_id: "v4",
    vendor_name: "FarmaCuba",
    category: "Salud",
    isPopular: true,
  },
  {
    id: "5",
    name: "Ropa Casual Unisex",
    description: "Camisetas, shorts y accesorios",
    price: 55.00,
    currency: "USD",
    image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&h=400&fit=crop",
    stock: 30,
    vendor_id: "v5",
    vendor_name: "ModaCuba",
    category: "Ropa",
    isNew: true,
  },
  {
    id: "6",
    name: "Set de Cocina Completo",
    description: "Ollas, sartenes y utensilios",
    price: 125.00,
    currency: "USD",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop",
    stock: 12,
    vendor_id: "v1",
    vendor_name: "Tienda Cuba",
    category: "Hogar",
  },
  {
    id: "7",
    name: "Combo Bebé Premium",
    description: "Pañales, leche y productos para bebé",
    price: 95.00,
    currency: "USD",
    image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=400&fit=crop",
    stock: 20,
    vendor_id: "v2",
    vendor_name: "Productos Cubanos",
    category: "Bebé",
    isPopular: true,
  },
  {
    id: "8",
    name: "Teléfono Móvil Básico",
    description: "Smartphone económico con buena batería",
    price: 199.00,
    currency: "USD",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop",
    stock: 5,
    vendor_id: "v3",
    vendor_name: "ElectroCuba",
    category: "Electrónica",
  },
];

const categories = [
  "Todos",
  "Alimentos",
  "Higiene",
  "Electrodomésticos",
  "Salud",
  "Ropa",
  "Hogar",
  "Bebé",
  "Electrónica",
];

const Marketplace = () => {
  const { isAuthenticated } = useAuthStore();
  const { municipality, province, hasLocation } = useLocationStore();
  const { data: profile } = useProfile();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [sortBy, setSortBy] = useState("popular");
  const [showFilters, setShowFilters] = useState(false);
  
  // Location modals
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showContactSelector, setShowContactSelector] = useState(false);
  const [selectedContact, setSelectedContact] = useState<ContactDto | null>(null);

  // Determine if user needs to select location
  const userHasLocation = isAuthenticated 
    ? !!(selectedContact || profile?.municipality || municipality) 
    : hasLocation();

  // Show location modal on mount if no location
  useEffect(() => {
    if (!userHasLocation) {
      if (isAuthenticated) {
        setShowContactSelector(true);
      } else {
        setShowLocationModal(true);
      }
    }
  }, [userHasLocation, isAuthenticated]);

  // Current location/contact display info
  const displayInfo = (() => {
    if (isAuthenticated && selectedContact) {
      return {
        name: selectedContact.fullName,
        location: `${selectedContact.municipality}, ${selectedContact.province}`,
      };
    }
    if (isAuthenticated && profile?.municipality) {
      return {
        name: profile.name,
        location: `${profile.municipality}, ${profile.province}`,
      };
    }
    return {
      name: null,
      location: municipality && province ? `${municipality}, ${province}` : null,
    };
  })();

  // Filter and sort products
  const filteredProducts = allProducts
    .filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "Todos" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "newest":
          return a.isNew ? -1 : 1;
        default: // popular
          return a.isPopular ? -1 : 1;
      }
    });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Recharge Promo */}
              <div className="card-elevated p-5 gradient-card border border-primary/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="gradient-primary rounded-lg p-2">
                    <Smartphone className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">Recargas Móvil</h3>
                    <p className="text-xs text-muted-foreground">Desde $5</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Envía saldo a Cuba en segundos
                </p>
                <Button variant="gradient" size="sm" className="w-full" asChild>
                  <Link to="/recargas">Descargar App</Link>
                </Button>
              </div>

              {/* Categories */}
              <div className="card-elevated p-5">
                <h3 className="font-semibold mb-4">Categorías</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedCategory === category
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Search, Location and Filters Bar */}
            <div className="flex flex-col gap-4 mb-6">
              {/* Location indicator row */}
              {displayInfo.location && (
                <button
                  onClick={() => isAuthenticated ? setShowContactSelector(true) : setShowLocationModal(true)}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors self-start"
                >
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>Entrega en:</span>
                  {displayInfo.name && (
                    <>
                      <span className="font-medium text-foreground">{displayInfo.name}</span>
                      <span>•</span>
                    </>
                  )}
                  <span className="text-foreground">{displayInfo.location}</span>
                  <span className="text-primary underline">Cambiar</span>
                </button>
              )}
              
              {/* Search and filters row */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar productos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Más populares</SelectItem>
                    <SelectItem value="newest">Más recientes</SelectItem>
                    <SelectItem value="price-asc">Precio: menor a mayor</SelectItem>
                    <SelectItem value="price-desc">Precio: mayor a menor</SelectItem>
                  </SelectContent>
                </Select>

                {/* Mobile Filter Toggle */}
                <Button
                  variant="outline"
                  className="lg:hidden"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                </Button>
              </div>
            </div>

            {/* Mobile Filters */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden mb-6"
              >
                <div className="card-elevated p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Categorías</h3>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setShowFilters(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <Badge
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Active Filters */}
            {(selectedCategory !== "Todos" || searchQuery) && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="text-sm text-muted-foreground">Filtros:</span>
                {selectedCategory !== "Todos" && (
                  <Badge variant="secondary" className="gap-1">
                    {selectedCategory}
                    <button onClick={() => setSelectedCategory("Todos")}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {searchQuery && (
                  <Badge variant="secondary" className="gap-1">
                    "{searchQuery}"
                    <button onClick={() => setSearchQuery("")}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
              </div>
            )}

            {/* Results Count */}
            <p className="text-sm text-muted-foreground mb-6">
              {filteredProducts.length} productos encontrados
            </p>

            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
              <ProductGrid products={filteredProducts} />
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  No se encontraron productos
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("Todos");
                  }}
                >
                  Limpiar filtros
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />

      {/* Location Modal for non-authenticated users */}
      <LocationSelectorModal
        open={showLocationModal}
        onOpenChange={setShowLocationModal}
        allowClose={userHasLocation}
        redirectOnClose={userHasLocation ? undefined : "/"}
      />

      {/* Contact Selector for authenticated users */}
      <LocationContactSelector
        open={showContactSelector}
        onOpenChange={setShowContactSelector}
        onSelect={(contact) => {
          setSelectedContact(contact);
          setShowContactSelector(false);
        }}
        selectedContactId={selectedContact?.id}
        redirectOnClose={userHasLocation ? undefined : "/"}
      />
    </div>
  );
};

export default Marketplace;
