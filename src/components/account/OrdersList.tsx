import { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Package,
  ChevronRight,
  Loader2,
  ShoppingBag,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useOrders, useOrder } from "@/hooks/useOrders";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const statusConfig = {
  pending: {
    label: "Pendiente",
    icon: Clock,
    variant: "secondary" as const,
    color: "text-muted-foreground",
  },
  processing: {
    label: "Procesando",
    icon: Package,
    variant: "default" as const,
    color: "text-primary",
  },
  shipped: {
    label: "Enviado",
    icon: Truck,
    variant: "default" as const,
    color: "text-info",
  },
  delivered: {
    label: "Entregado",
    icon: CheckCircle,
    variant: "default" as const,
    color: "text-success",
  },
  cancelled: {
    label: "Cancelado",
    icon: XCircle,
    variant: "destructive" as const,
    color: "text-destructive",
  },
};

const paymentStatusConfig = {
  pending: { label: "Pendiente", variant: "secondary" as const },
  paid: { label: "Pagado", variant: "default" as const },
  failed: { label: "Fallido", variant: "destructive" as const },
  refunded: { label: "Reembolsado", variant: "outline" as const },
};

export function OrdersList() {
  const [page, setPage] = useState(1);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const { data: ordersData, isLoading } = useOrders(page);
  const { data: orderDetail, isLoading: detailLoading } = useOrder(
    selectedOrderId || ""
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!ordersData?.data?.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border rounded-xl p-8 text-center"
      >
        <div className="inline-flex p-4 rounded-full bg-muted mb-4">
          <ShoppingBag className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No tienes órdenes aún</h3>
        <p className="text-muted-foreground mb-6">
          Cuando realices una compra, tus órdenes aparecerán aquí
        </p>
        <Button asChild>
          <Link to="/marketplace">Explorar Marketplace</Link>
        </Button>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        {ordersData.data.map((order) => {
          const status = statusConfig[order.status];
          const StatusIcon = status.icon;
          const paymentStatus = paymentStatusConfig[order.payment_status];

          return (
            <div
              key={order.id}
              className="bg-card border border-border rounded-xl p-4 md:p-6 hover:border-primary/30 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={cn("p-2 rounded-lg bg-muted", status.color)}>
                    <StatusIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold">Orden #{order.order_number}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(order.created_at), "d 'de' MMMM, yyyy", {
                        locale: es,
                      })}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant={status.variant}>{status.label}</Badge>
                      <Badge variant={paymentStatus.variant}>
                        Pago: {paymentStatus.label}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="font-bold text-primary">
                      ${order.totals.total.toFixed(2)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedOrderId(order.id)}
                  >
                    <Eye className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Products Preview */}
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {order.items.slice(0, 4).map((item, index) => (
                    <div
                      key={index}
                      className="relative flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-muted"
                    >
                      <img
                        src={item.product_image}
                        alt={item.product_name}
                        className="w-full h-full object-cover"
                      />
                      {item.quantity > 1 && (
                        <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                          {item.quantity}
                        </span>
                      )}
                    </div>
                  ))}
                  {order.items.length > 4 && (
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-sm font-medium text-muted-foreground">
                      +{order.items.length - 4}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Pagination */}
        {ordersData.meta && ordersData.meta.last_page > 1 && (
          <div className="flex items-center justify-center gap-2 pt-4">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Anterior
            </Button>
            <span className="text-sm text-muted-foreground">
              Página {page} de {ordersData.meta.last_page}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page === ordersData.meta.last_page}
              onClick={() => setPage(page + 1)}
            >
              Siguiente
            </Button>
          </div>
        )}
      </motion.div>

      {/* Order Detail Dialog */}
      <Dialog
        open={!!selectedOrderId}
        onOpenChange={() => setSelectedOrderId(null)}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Orden #{orderDetail?.data?.order_number || "..."}
            </DialogTitle>
          </DialogHeader>

          {detailLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : orderDetail ? (
            <div className="space-y-6">
              {/* Status */}
              <div className="flex items-center gap-4">
                <Badge variant={statusConfig[orderDetail.data.status].variant}>
                  {statusConfig[orderDetail.data.status].label}
                </Badge>
                <Badge
                  variant={paymentStatusConfig[orderDetail.data.payment_status].variant}
                >
                  Pago: {paymentStatusConfig[orderDetail.data.payment_status].label}
                </Badge>
              </div>

              {/* Items */}
              <div className="space-y-3">
                <h4 className="font-semibold">Productos</h4>
                {orderDetail.data.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg"
                  >
                    <img
                      src={item.product_image}
                      alt={item.product_name}
                      className="w-14 h-14 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.product_name}</p>
                      <p className="text-sm text-muted-foreground">
                        Cantidad: {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold">${item.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>

              {/* Shipping */}
              <div className="space-y-2">
                <h4 className="font-semibold">Dirección de envío</h4>
                <div className="p-4 bg-muted/50 rounded-lg text-sm">
                  <p className="font-medium">{orderDetail.data.shipping_address.name}</p>
                  <p className="text-muted-foreground">
                    {orderDetail.data.shipping_address.phone}
                  </p>
                  <p className="text-muted-foreground mt-1">
                    {orderDetail.data.shipping_address.address}
                  </p>
                  <p className="text-muted-foreground">
                    {orderDetail.data.shipping_address.municipality},{" "}
                    {orderDetail.data.shipping_address.province}
                  </p>
                </div>
              </div>

              {/* Totals */}
              <div className="space-y-2 pt-4 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${orderDetail.data.totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Envío</span>
                  <span>${orderDetail.data.totals.shipping.toFixed(2)}</span>
                </div>
                {orderDetail.data.totals.tax > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Impuestos</span>
                    <span>${orderDetail.data.totals.tax.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
                  <span>Total</span>
                  <span className="text-primary">
                    ${orderDetail.data.totals.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
