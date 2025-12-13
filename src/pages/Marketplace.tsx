import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, SlidersHorizontal, Smartphone, X, MapPin, Loader2 } from "lucide-react";
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
import { Link } from "react-router-dom";
import { useAuthStore } from "@/stores/auth.store";
import { useLocationStore } from "@/stores/location.store";
import { useProfile } from "@/hooks/useProfile";
import { LocationSelectorModal } from "@/components/location/LocationSelectorModal";
import { LocationContactSelector } from "@/components/checkout/LocationContactSelector";
import { ContactDto } from "@/hooks/useContacts";
import { useProducts, useCategories } from "@/hooks/useProducts";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const Marketplace = () => {
  const { isAuthenticated } = useAuthStore();
  const { municipality, province, hasLocation } = useLocationStore();
  const { data: profile } = useProfile();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState("popular");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;
  
  // Location modals
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showContactSelector, setShowContactSelector] = useState(false);
  const [selectedContact, setSelectedContact] = useState<ContactDto | null>(null);

  // Map frontend sort values to backend sort format
  const sortMapping: Record<string, string> = {
    'popular': 'salesCount:desc',
    'newest': 'createdAt:desc',
    'price-asc': 'price:asc',
    'price-desc': 'price:desc',
  };

  // Fetch products from API
  const { data: productsData, isLoading: productsLoading } = useProducts({
    page: currentPage,
    pageSize,
    q: searchQuery || undefined,
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
    sort: sortMapping[sortBy] || undefined,
  });

  // Fetch categories from API
  const { data: categories, isLoading: categoriesLoading } = useCategories();

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

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, sortBy]);

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

  const products = productsData?.data || [];
  const totalPages = productsData?.totalPages || 1;
  const totalCount = productsData?.totalCount || 0;

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

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
                {categoriesLoading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={() => handleCategoryClick('all')}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedCategory === 'all'
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      Todos
                    </button>
                    {categories?.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategoryClick(category.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedCategory === category.id
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                )}
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
                    <Badge
                      variant={selectedCategory === 'all' ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => handleCategoryClick('all')}
                    >
                      Todos
                    </Badge>
                    {categories?.map((category) => (
                      <Badge
                        key={category.id}
                        variant={selectedCategory === category.id ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => handleCategoryClick(category.id)}
                      >
                        {category.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Active Filters */}
            {(selectedCategory !== 'all' || searchQuery) && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="text-sm text-muted-foreground">Filtros:</span>
                {selectedCategory !== 'all' && (
                  <Badge variant="secondary" className="gap-1">
                    {categories?.find(c => c.id === selectedCategory)?.name || selectedCategory}
                    <button onClick={() => setSelectedCategory('all')}>
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
              {totalCount} productos encontrados
            </p>

            {/* Loading State */}
            {productsLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : products.length > 0 ? (
              <>
                {/* Product Grid */}
                <ProductGrid products={products} />

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious 
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                        
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum: number;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          
                          return (
                            <PaginationItem key={pageNum}>
                              <PaginationLink
                                onClick={() => setCurrentPage(pageNum)}
                                isActive={currentPage === pageNum}
                                className="cursor-pointer"
                              >
                                {pageNum}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        })}
                        
                        <PaginationItem>
                          <PaginationNext 
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  No se encontraron productos
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory('all');
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
