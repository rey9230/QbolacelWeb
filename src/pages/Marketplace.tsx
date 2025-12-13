import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Search, Filter, SlidersHorizontal, Smartphone, X, MapPin, Loader2, Tag } from "lucide-react";
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

const Marketplace = () => {
  const { isAuthenticated } = useAuthStore();
  const { municipality, province, hasLocation } = useLocationStore();
  const { data: profile } = useProfile();
  
  // Search and filters
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState("popular");
  const [showFilters, setShowFilters] = useState(false);
  
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

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-4">
              {/* Price Range Filter */}
              <div className="card-elevated p-4">
                <h3 className="font-semibold mb-3 text-sm">Precio (USD)</h3>
                <div className="space-y-3">
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
                      className="h-7 text-xs"
                      min={0}
                    />
                    <span className="text-muted-foreground text-xs">-</span>
                    <Input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="h-7 text-xs"
                    />
                    <Button 
                      size="sm" 
                      onClick={handleApplyPriceFilter}
                      className="h-7 px-2 text-xs"
                    >
                      OK
                    </Button>
                  </div>
                </div>
              </div>

              {/* Tags Filter */}
              <div className="card-elevated p-4">
                <h3 className="font-semibold mb-3 text-sm flex items-center gap-2">
                  <Tag className="h-3.5 w-3.5" />
                  Etiquetas
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {availableTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={selectedTag === tag ? "default" : "outline"}
                      className="cursor-pointer capitalize text-xs py-0.5"
                      onClick={() => handleTagClick(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div className="card-elevated p-4">
                <h3 className="font-semibold mb-3 text-sm">Categorías</h3>
                {categoriesLoading ? (
                  <div className="flex justify-center py-2">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <div className="space-y-1">
                    <button
                      onClick={() => handleCategoryClick('all')}
                      className={`w-full text-left px-2.5 py-1.5 rounded-md text-sm transition-colors ${
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
                        className={`w-full text-left px-2.5 py-1.5 rounded-md text-sm transition-colors ${
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
                  {hasActiveFilters && (
                    <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                      !
                    </Badge>
                  )}
                </Button>
              </div>
            </div>

            {/* Mobile Filters */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden mb-6 space-y-4"
              >
                {/* Categories */}
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

                {/* Price Range - Mobile */}
                <div className="card-elevated p-4">
                  <h3 className="font-semibold mb-4">Rango de Precio</h3>
                  <div className="space-y-4">
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
                        className="h-8 text-sm"
                        placeholder="Mín"
                      />
                      <span className="text-muted-foreground">-</span>
                      <Input
                        type="number"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                        className="h-8 text-sm"
                        placeholder="Máx"
                      />
                      <Button size="sm" onClick={handleApplyPriceFilter}>
                        OK
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Tags - Mobile */}
                <div className="card-elevated p-4">
                  <h3 className="font-semibold mb-4">Etiquetas</h3>
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={selectedTag === tag ? "default" : "outline"}
                        className="cursor-pointer capitalize"
                        onClick={() => handleTagClick(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Active Filters */}
            {hasActiveFilters && (
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
              {products.length} productos{hasNextPage && '+'}
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
