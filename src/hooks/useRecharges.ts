// Re-export from new useTopup hook for backward compatibility
export {
  useTopupProducts as useRechargeProducts,
  useTopupTransactions as useRechargeHistory,
  usePurchaseTopup as useCreateRecharge,
  type TopupProduct as RechargeProduct,
  type PurchaseTopupRequest as RechargeRequest,
} from "./useTopup";
