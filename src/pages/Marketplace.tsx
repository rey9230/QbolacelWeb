import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Search, Filter, SlidersHorizontal, X, MapPin, Loader2, Tag, ChevronDown, ShoppingBag, Truck, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductGrid } from "@/components/products/ProductGrid";
import { useAuthStore } from "@/stores/auth.store";
import { useLocationStore } from "@/stores/location.store";
import { useProfile } from "@/hooks/useProfile";
import { LocationSelectorModal } from "@/components/location/LocationSelectorModal";
import { LocationContactSelector } from "@/components/checkout/LocationContactSelector";
import { ContactDto, useContacts } from "@/hooks/useContacts";
import { useProducts, useCategories } from "@/hooks/useProducts";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { capitalizeWords, cn } from "@/lib/utils";

const Marketplace = () => {
  useDocumentMeta({
    title: 'Marketplace - Productos para Cuba',
    description: 'Compra electrodomésticos, tecnología, alimentos y más con entrega a domicilio en toda Cuba. Productos de calidad a los mejores precios.',
    ogType: 'website',
  });
  const { isAuthenticated } = useAuthStore();
  const { municipality, province, hasLocation, setLocation } = useLocationStore();
  const { data: profile } = useProfile();
  const { data: contactsData } = useContacts();
  
  // Search and filters
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState("popular");
  const [showFilters, setShowFilters] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  // Price range filter
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [appliedPriceRange, setAppliedPriceRange] = useState<[number, number] | null>(null);
  
  // Tag filter
  const [selectedTag, setSelectedTag] = useState<string>("");
  
  const loadMoreRef = useRef<HTMLDivElement>(null);
  
  // Location modals
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showContactSelector, setShowContactSelector] = useState(false);
  const [selectedContact, setSelectedContact] = useState<ContactDto | null>(null);

  // Load default contact automatically for authenticated users
  useEffect(() => {
    if (isAuthenticated && contactsData?.contacts && contactsData.contacts.length > 0 && !selectedContact) {
      const defaultContact = contactsData.contacts.find(c => c.isDefault) || contactsData.contacts[0];
      setSelectedContact(defaultContact);
    }
  }, [isAuthenticated, contactsData, selectedContact]);

  // Available tags (could be fetched from API in the future)
  const availableTags = [
    "oferta",
    "nuevo",
    "popular",
    "exclusivo",
    "limitado",
  ];

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Map frontend sort values to backend sort format
  const sortMapping: Record<string, string> = {
    'popular': 'salesCount:desc',
    'newest': 'createdAt:desc',
    'price-asc': 'price:asc',
    'price-desc': 'price:desc',
  };

  // Fetch products with cursor pagination
  const { 
    data: productsData, 
    isLoading: productsLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useProducts({
    limit: 20,
    q: debouncedSearch || undefined,
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
    priceMin: appliedPriceRange ? appliedPriceRange[0] : undefined,
    priceMax: appliedPriceRange ? appliedPriceRange[1] : undefined,
    tag: selectedTag || undefined,
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

  // Infinite scroll observer
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const [target] = entries;
    if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
      rootMargin: '100px',
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [handleObserver]);

  // Current location/contact display info - ONLY municipality and province, capitalized
  const locationDisplay = (() => {
    if (isAuthenticated && selectedContact) {
      return {
        municipality: capitalizeWords(selectedContact.municipality),
        province: selectedContact.province || profile?.province || province,
      };
    }
    if (isAuthenticated && profile?.municipality) {
      return {
        municipality: capitalizeWords(profile.municipality),
        province: profile.province || province,
      };
    }
    return {
      municipality: capitalizeWords(municipality),
      province: province,
    };
  })();

  const hasLocationData = !!(locationDisplay.municipality && locationDisplay.province);

  // Flatten paginated data
  const products = productsData?.pages.flatMap(page => page.data) || [];

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleApplyPriceFilter = () => {
    setAppliedPriceRange(priceRange);
  };

  const handleClearPriceFilter = () => {
    setPriceRange([0, 500]);
    setAppliedPriceRange(null);
  };

  const handleTagClick = (tag: string) => {
    setSelectedTag(selectedTag === tag ? "" : tag);
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory('all');
    setPriceRange([0, 500]);
    setAppliedPriceRange(null);
    setSelectedTag("");
  };

  const hasActiveFilters = selectedCategory !== 'all' || debouncedSearch || appliedPriceRange || selectedTag;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-primary py-12 lg:py-16">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4"
              >
                Marketplace Cuba
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-white/90 text-lg lg:text-xl max-w-xl"
              >
                Electrodomésticos, tecnología, alimentos y más con entrega a domicilio
              </motion.p>
              
              {/* Location Badge */}
              {hasLocationData && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-6 inline-flex flex-col items-start gap-2"
                >
                  <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-white">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">
                      {isAuthenticated && selectedContact ? (
                        <>
                          <span className="font-semibold">{selectedContact.fullName}</span>
                          <span className="text-white/80"> — {locationDisplay.municipality}, {locationDisplay.province}</span>
                        </>
                      ) : (
                        <>
                          Entregas en <span className="font-semibold">{locationDisplay.municipality}, {locationDisplay.province}</span>
                        </>
                      )}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 pl-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (isAuthenticated) setShowContactSelector(true);
                        else setShowLocationModal(true);
                      }}
                      className="text-white/85 text-sm underline hover:text-white"
                    >
                      Cambiar
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right Stats */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="flex gap-4 lg:gap-6"
            >
              <div className="flex flex-col items-center bg-white/10 backdrop-blur-sm rounded-xl p-4 lg:p-6 border border-white/20">
                <ShoppingBag className="h-8 w-8 text-white mb-2" />
                <span className="text-2xl lg:text-3xl font-bold text-white">500+</span>
                <span className="text-white/80 text-sm">Productos</span>
              </div>
              <div className="flex flex-col items-center bg-white/10 backdrop-blur-sm rounded-xl p-4 lg:p-6 border border-white/20">
                <Truck className="h-8 w-8 text-white mb-2" />
                <span className="text-2xl lg:text-3xl font-bold text-white">Cuba</span>
                <span className="text-white/80 text-sm">Entregas</span>
              </div>
              <div className="hidden sm:flex flex-col items-center bg-white/10 backdrop-blur-sm rounded-xl p-4 lg:p-6 border border-white/20">
                <Package className="h-8 w-8 text-white mb-2" />
                <span className="text-2xl lg:text-3xl font-bold text-white">24h</span>
                <span className="text-white/80 text-sm">Envío rápido</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="sticky top-16 z-30 bg-background border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-2 space-y-2">
          {/* Row 1: Search + Sort + Clear */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-9"
              />
            </div>

            <div className="flex items-center gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[160px] h-9">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Ordenar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Más populares</SelectItem>
                  <SelectItem value="newest">Más recientes</SelectItem>
                  <SelectItem value="price-asc">Precio: menor a mayor</SelectItem>
                  <SelectItem value="price-desc">Precio: mayor a menor</SelectItem>
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllFilters}
                  className="h-9 text-destructive border-destructive/30 hover:bg-destructive/10"
                >
                  <X className="h-4 w-4 mr-1" />
                  Limpiar
                </Button>
              )}
            </div>
          </div>

          {/* Row 2: Categories (always visible, horizontal scroll) */}
          <div className="rounded-lg border border-border/50 bg-muted/30 px-2 py-2">
            <div className="flex gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryClick("all")}
                className="h-7 text-xs"
              >
                Todas
              </Button>
              {categories?.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleCategoryClick(category.id)}
                  className="h-7 text-xs whitespace-nowrap"
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Row 3: Price Range + Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {/* Price Range */}
            <div className="rounded-lg border border-border/50 bg-muted/30 px-2 py-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-foreground">Precio (USD)</span>
                {appliedPriceRange && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearPriceFilter}
                    className="h-7 px-2 text-muted-foreground"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="space-y-1 mt-1">
                <Slider
                  value={priceRange}
                  onValueChange={(value) => setPriceRange(value as [number, number])}
                  min={0}
                  max={500}
                  step={5}
                  className="w-full"
                />
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="h-7 text-xs w-24"
                    min={0}
                  />
                  <span className="text-muted-foreground text-xs">—</span>
                  <Input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="h-7 text-xs w-24"
                  />
                  <Button
                    size="sm"
                    onClick={handleApplyPriceFilter}
                    className="h-7 px-3"
                    disabled={
                      appliedPriceRange?.[0] === priceRange[0] &&
                      appliedPriceRange?.[1] === priceRange[1]
                    }
                  >
                    Aplicar
                  </Button>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="rounded-lg border border-border/50 bg-muted/30 px-2 py-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs font-medium text-foreground">Etiquetas</span>
                </div>
                {selectedTag && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedTag("")}
                    className="h-7 px-2 text-muted-foreground"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {availableTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTag === tag ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer capitalize h-6 px-2 text-[11px]",
                      selectedTag === tag
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    )}
                    onClick={() => handleTagClick(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-sm text-muted-foreground">Filtros activos:</span>
            {selectedCategory !== 'all' && (
              <Badge variant="secondary" className="gap-1">
                {categories?.find(c => c.id === selectedCategory)?.name || selectedCategory}
                <button onClick={() => setSelectedCategory('all')}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {debouncedSearch && (
              <Badge variant="secondary" className="gap-1">
                "{debouncedSearch}"
                <button onClick={() => setSearchQuery("")}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {appliedPriceRange && (
              <Badge variant="secondary" className="gap-1">
                ${appliedPriceRange[0]} - ${appliedPriceRange[1]}
                <button onClick={handleClearPriceFilter}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {selectedTag && (
              <Badge variant="secondary" className="gap-1 capitalize">
                {selectedTag}
                <button onClick={() => setSelectedTag("")}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-destructive hover:text-destructive"
            >
              Limpiar todo
            </Button>
          </div>
        )}

        {/* Results Info */}
        <p className="text-sm text-muted-foreground mb-6">
          {products.length} productos encontrados{hasNextPage && '+'}
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

            {/* Infinite Scroll Trigger */}
            <div ref={loadMoreRef} className="py-8 flex justify-center">
              {isFetchingNextPage && (
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              )}
              {!hasNextPage && products.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  No hay más productos
                </p>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              No se encontraron productos
            </p>
            <Button
              variant="outline"
              onClick={clearAllFilters}
            >
              Limpiar filtros
            </Button>
          </div>
        )}
      </main>

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
          // Keep "location" in sync too (used for marketplace headers/context).
          if (contact.municipality && contact.province) {
            setLocation(contact.municipality, contact.province);
          }
          setShowContactSelector(false);
        }}
        onSelectLocation={(m, p) => {
          // User wants only a zone, not a saved contact.
          setSelectedContact(null);
          setLocation(m, p);
          setShowContactSelector(false);
        }}
        selectedContactId={selectedContact?.id}
        redirectOnClose={userHasLocation ? undefined : "/"}
      />
    </div>
  );
};

export default Marketplace;
