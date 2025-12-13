import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductCard, Product } from "@/components/products/ProductCard";

const featuredProducts: Product[] = [
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
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function MarketplacePreview() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-2xl md:text-3xl font-bold">
                Marketplace
              </h2>
              <Badge variant="new">Nuevo</Badge>
            </div>
            <p className="text-muted-foreground">
              Productos destacados con entrega a toda Cuba
            </p>
          </div>
          
          <Button asChild variant="outline" className="gap-2">
            <Link to="/marketplace">
              Ver catálogo completo
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {featuredProducts.map((product) => (
            <motion.div key={product.id} variants={itemVariants}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
