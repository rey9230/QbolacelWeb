import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "María García",
    location: "Miami, FL",
    rating: 5,
    text: "Increíble servicio. Mi familia recibe las recargas en segundos. Lo uso cada semana.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
  },
  {
    name: "Carlos Rodríguez",
    location: "Madrid, España",
    rating: 5,
    text: "El marketplace es fantástico. Pude enviar un combo de alimentos a mi madre sin problemas.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
  },
  {
    name: "Ana Martínez",
    location: "Houston, TX",
    rating: 5,
    text: "Uso Qbolacel desde hace 2 años. Nunca he tenido un problema. 100% recomendado.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function TestimonialsSection() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Lo que dicen nuestros usuarios
          </h2>
          <p className="text-muted-foreground">
            Miles de familias confían en Qbolacel
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6"
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.name}
              variants={itemVariants}
              className="relative bg-card border border-border rounded-2xl p-6"
            >
              {/* Quote Icon */}
              <Quote className="absolute top-4 right-4 h-8 w-8 text-muted-foreground/20" />
              
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-warning fill-warning" />
                ))}
              </div>
              
              {/* Quote */}
              <p className="text-foreground mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>
              
              {/* Author */}
              <div className="flex items-center gap-3">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
