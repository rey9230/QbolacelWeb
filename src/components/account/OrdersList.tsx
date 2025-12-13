import { useState } from "react";
import { motion } from "framer-motion";
import {
  Package,
  Loader2,
  ShoppingBag,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  Eye,
  AlertCircle,
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

const statusConfig: Record<string, {
  label: string;
  icon: typeof Clock;
  variant: "default" | "secondary" | "destructive" | "outline";
  color: string;
}> = {
  CREATED: {
    label: "Creada",
    icon: Clock,
    variant: "secondary",
    color: "text-muted-foreground",
  },
  PROCESSING: {
    label: "Procesando",
    icon: Package,
    variant: "default",
    color: "text-primary",
  },
  READY_FOR_DELIVERY: {
    label: "Lista para envío",
    icon: Package,
    variant: "default",
    color: "text-primary",
  },
  ASSIGNED_TO_DELIVERY: {
    label: "Asignada",
    icon: Truck,
    variant: "default",
    color: "text-primary",
  },
  IN_TRANSIT: {
    label: "En tránsito",
    icon: Truck,
    variant: "default",
    color: "text-primary",
  },
  OUT_FOR_DELIVERY: {
    label: "En reparto",
    icon: Truck,
    variant: "default",
    color: "text-primary",
  },
  DELIVERED: {
    label: "Entregada",
    icon: CheckCircle,
    variant: "default",
    color: "text-green-500",
  },
  CANCELED: {
    label: "Cancelada",
    icon: XCircle,
    variant: "destructive",
    color: "text-destructive",
  },
  FAILED_DELIVERY: {
    label: "Entrega fallida",
    icon: AlertCircle,
    variant: "destructive",
    color: "text-destructive",
  },
};

const defaultStatus = {
  label: "Desconocido",
  icon: Clock,
  variant: "secondary" as const,
  color: "text-muted-foreground",
};

export function OrdersList() {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const { data: orders, isLoading } = useOrders();
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

  if (!orders?.length) {
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
        {orders.map((order) => {
          const status = statusConfig[order.status] || defaultStatus;
          const StatusIcon = status.icon;

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
                    <p className="font-semibold">
                      Orden #{order.orderSku || order.id.slice(0, 8)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.createdAtFormatted}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="font-bold text-primary">
                      ${order.grandTotal?.toFixed(2) || "0.00"} {order.currency || "USD"}
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
            </div>
          );
        })}
      </motion.div>

      {/* Order Detail Dialog */}
      <Dialog
        open={!!selectedOrderId}
        onOpenChange={() => setSelectedOrderId(null)}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Orden #{orderDetail?.orderSku || orderDetail?.id?.slice(0, 8) || "..."}
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
                <Badge variant={(statusConfig[orderDetail.status] || defaultStatus).variant}>
                  {(statusConfig[orderDetail.status] || defaultStatus).label}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {orderDetail.createdAtFormatted}
                </span>
              </div>

              {/* Items */}
              <div className="space-y-3">
                <h4 className="font-semibold">Productos ({orderDetail.items.length})</h4>
                {orderDetail.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                      <Package className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">
                        Producto: {item.productId.slice(0, 8)}...
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Cantidad: {item.qty}
                      </p>
                    </div>
                    <p className="font-semibold">
                      ${item.unitPrice.toFixed(2)} {item.currency}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              {orderDetail.totals && (
                <div className="space-y-2 pt-4 border-t border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${orderDetail.totals.subtotal.toFixed(2)}</span>
                  </div>
                  {orderDetail.totals.shipping !== undefined && orderDetail.totals.shipping > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Envío</span>
                      <span>${orderDetail.totals.shipping.toFixed(2)}</span>
                    </div>
                  )}
                  {orderDetail.totals.fees !== undefined && orderDetail.totals.fees > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Comisiones</span>
                      <span>${orderDetail.totals.fees.toFixed(2)}</span>
                    </div>
                  )}
                  {orderDetail.totals.discount !== undefined && orderDetail.totals.discount > 0 && (
                    <div className="flex justify-between text-sm text-green-500">
                      <span>Descuento</span>
                      <span>-${orderDetail.totals.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
                    <span>Total</span>
                    <span className="text-primary">
                      ${orderDetail.totals.grandTotal.toFixed(2)} {orderDetail.totals.currency}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
