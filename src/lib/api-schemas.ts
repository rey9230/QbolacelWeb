import { z } from 'zod';

// ============ COMMON SCHEMAS ============

export const MoneySchema = z.object({
  amount: z.number(),
  currency: z.string(),
});

export const PromotionSchema = z.object({
  type: z.string(),
  amount: z.number(),
  startsAt: z.string().optional(),
  endsAt: z.string().optional(),
});

// ============ AUTH SCHEMAS ============

export const AuthTokenResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  tokenType: z.string(),
});

export const UserProfileSchema = z.object({
  id: z.string(),
  userName: z.string(),
  email: z.string(),
  phone: z.string().optional(),
  avatar: z.string().optional(),
  province: z.string().optional(),
  municipality: z.string().optional(),
  address: z.string().optional(),
  roles: z.array(z.string()).optional(),
  location: z.string().nullable().optional(),
});

// ============ CONTACT SCHEMAS ============

export const ContactDtoSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  phone: z.string(),
  street: z.string(),
  betweenStreets: z.string().nullish(),
  municipality: z.string(),
  province: z.string(),
  isDefault: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const ContactListResponseSchema = z.object({
  contacts: z.array(ContactDtoSchema),
  total: z.number(),
  defaultContactId: z.string().nullish(),
});

// ============ PRODUCT SCHEMAS ============

export const ProductSchema = z.object({
  id: z.string(),
  sku: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullish(),
  price: MoneySchema,
  stock: z.number(),
  stockStatus: z.enum(['IN_STOCK', 'OUT_OF_STOCK', 'BACKORDER']),
  categoryIds: z.array(z.string()),
  pictures: z.array(z.string()),
  primaryImage: z.string().nullish(),
  attributes: z.record(z.string()).nullish(),
  isPublished: z.boolean(),
  isFeatured: z.boolean(),
  metaTitle: z.string().nullish(),
  metaDescription: z.string().nullish(),
  tags: z.array(z.string()),
  promotions: z.array(PromotionSchema),
  relatedProductIds: z.array(z.string()),
  upsellProductIds: z.array(z.string()),
  agencyId: z.string().nullish(),
  salesCount: z.number(),
  rating: z.number(),
  reviewsCount: z.number(),
});

export const ProductDetailResponseSchema = z.object({
  product: ProductSchema,
  similar: z.array(ProductSchema),
});

export const CursorPageResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    success: z.boolean(),
    limit: z.number(),
    nextCursor: z.string().nullable(),
    data: z.array(itemSchema),
  });

// ============ CATEGORY SCHEMAS ============

export const CategorySchema = z.object({
  id: z.string(),
  code: z.string().nullish(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullish(),
  hasChild: z.boolean(),
  iconUrl: z.string().nullish(),
  pictures: z.array(z.string()),
  parentId: z.string().nullish(),
  order: z.number(),
  isActive: z.boolean(),
});

// ============ CART SCHEMAS ============

export const CartProductInfoSchema = z.object({
  name: z.string(),
  slug: z.string(),
  sku: z.string(),
  description: z.string().nullish(),
  primaryImage: z.string().nullish(),
  pictures: z.array(z.string()),
  stock: z.number(),
  stockStatus: z.enum(['IN_STOCK', 'OUT_OF_STOCK', 'BACKORDER']),
  isPublished: z.boolean(),
  agencyId: z.string().nullish(),
  agencyName: z.string().nullish(),
  categoryIds: z.array(z.string()),
  tags: z.array(z.string()),
  attributes: z.record(z.string()).nullish(),
  salesCount: z.number(),
  rating: z.number(),
  reviewsCount: z.number(),
});

export const CartItemDtoSchema = z.object({
  itemId: z.string(),
  productId: z.string(),
  qty: z.number(),
  unitPrice: z.number(),
  currency: z.string(),
  meta: z.record(z.string()).optional(),
  product: CartProductInfoSchema.optional(),
});

export const CartTotalsSchema = z.object({
  subtotal: z.number(),
  currency: z.string(),
  totalItems: z.number(),
  uniqueProducts: z.number(),
});

export const CartDtoSchema = z.object({
  id: z.string(),
  items: z.array(CartItemDtoSchema),
  totals: CartTotalsSchema,
  updatedAt: z.string(),
});

// ============ ORDER SCHEMAS ============

export const OrderSummarySchema = z.object({
  id: z.string(),
  orderSku: z.string().nullable(),
  status: z.string(),
  grandTotal: z.number().nullable(),
  currency: z.string().nullable(),
  createdAt: z.string(),
  createdAtFormatted: z.string(),
});

export const OrderSchema = z.object({
  id: z.string(),
  orderSku: z.string().nullable(),
  status: z.string(),
  items: z.array(z.object({
    productId: z.string(),
    qty: z.number(),
    unitPrice: z.number(),
    currency: z.string(),
  })),
  totals: z.object({
    subtotal: z.number(),
    shipping: z.number().optional(),
    fees: z.number().optional(),
    discount: z.number().optional(),
    grandTotal: z.number(),
    currency: z.string(),
  }).nullable(),
  createdAt: z.string(),
  createdAtFormatted: z.string(),
});

// ============ GEOGRAPHY SCHEMAS ============

export const ProvinceListResponseSchema = z.object({
  provinces: z.array(z.string()),
  total: z.number(),
});

export const MunicipalityListResponseSchema = z.object({
  municipalities: z.array(z.string()),
  province: z.string().nullable(),
  total: z.number(),
});

export const ProvinceOfMunicipalityResponseSchema = z.object({
  municipality: z.string(),
  province: z.string().nullable(),
  found: z.boolean(),
});

// ============ TOPUP SCHEMAS ============

export const TopupProductSchema = z.object({
  id: z.string(),
  sku: z.string(),
  slug: z.string(),
  name: z.string(),
  shortDescription: z.string().nullish(),
  description: z.string().nullish(),
  country: z.string(),
  operator: z.string(),
  productType: z.string(),
  salePrice: z.number(),
  saleCurrency: z.string(),
  originalPrice: z.number().nullish(),
  receiveValue: z.number().nullish(),
  receiveCurrency: z.string().nullish(),
  isVariableAmount: z.boolean(),
  minAmount: z.number().nullish(),
  maxAmount: z.number().nullish(),
  amountStep: z.number().nullish(),
  suggestedAmounts: z.array(z.number()).nullish(),
  isFeatured: z.boolean(),
  isPromotion: z.boolean(),
  promotionLabel: z.string().nullish(),
  promotionEndsAt: z.string().nullish(),
  imageUrl: z.string().nullish(),
  iconUrl: z.string().nullish(),
  validity: z.string().nullish(),
  tags: z.array(z.string()),
});

export const TopupTransactionSchema = z.object({
  id: z.string(),
  productId: z.string(),
  productSku: z.string(),
  productName: z.string(),
  accountNumber: z.string(),
  accountType: z.string(),
  country: z.string(),
  operator: z.string(),
  salePrice: z.number(),
  saleCurrency: z.string(),
  receiveValue: z.number().nullish(),
  receiveCurrency: z.string().nullish(),
  status: z.enum(['PENDING', 'PROCESSING', 'SUCCESS', 'FAILED']),
  statusMessage: z.string().nullish(),
  providerId: z.string(),
  providerTransactionId: z.string().nullish(),
  deliveredValue: z.number().nullish(),
  deliveredCurrency: z.string().nullish(),
  deliveredAt: z.string().nullish(),
  createdAt: z.string(),
  completedAt: z.string().nullish(),
});

export const PurchaseTopupResponseSchema = z.object({
  transactionId: z.string(),
  status: z.enum(['PENDING', 'PROCESSING', 'SUCCESS', 'FAILED']),
  productId: z.string(),
  productName: z.string(),
  accountNumber: z.string(),
  salePrice: z.number(),
  saleCurrency: z.string(),
  receiveValue: z.number().nullish(),
  receiveCurrency: z.string().nullish(),
  providerId: z.string(),
  providerTransactionId: z.string().nullish(),
  message: z.string().nullish(),
  createdAt: z.string(),
});

// ============ UNIFIED CHECKOUT SCHEMAS ============

export const TransactionStatusSchema = z.enum([
  'CREATED',
  'PENDING_PAYMENT',
  'PROCESSING',
  'COMPLETED',
  'FAILED',
  'CANCELLED',
  'EXPIRED',
]);

export const PaymentProviderSchema = z.enum(['TROPIPAY', 'PAYPAL', 'STRIPE']);

export const CheckoutResponseSchema = z.object({
  transactionId: z.string(),
  transactionSku: z.string(),
  status: TransactionStatusSchema,
  paymentUrl: z.string().nullable(),
  shortUrl: z.string().nullable(),
  expiresAt: z.string().nullable(),
  provider: PaymentProviderSchema,
  amount: z.number(),
  currency: z.string(),
  isDirectCharge: z.boolean(),
});

export const TransactionStatusResponseSchema = z.object({
  transactionId: z.string(),
  transactionSku: z.string(),
  status: TransactionStatusSchema,
  amount: z.number(),
  currency: z.string(),
  provider: PaymentProviderSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
  completedAt: z.string().nullish(),
  failureReason: z.string().nullish(),
});

// ============ PAYMENT METHODS SCHEMAS ============

export const CardBrandSchema = z.enum(['VISA', 'MASTERCARD', 'AMEX', 'DISCOVER', 'OTHER']);

export const SavedPaymentMethodSchema = z.object({
  id: z.string(),
  displayName: z.string(),
  last4: z.string(),
  brand: CardBrandSchema,
  expMonth: z.number(),
  expYear: z.number(),
  isDefault: z.boolean(),
  isExpired: z.boolean(),
});

// ============ SIMPLE RESPONSE SCHEMAS ============

export const MessageResponseSchema = z.object({
  message: z.string(),
});

// Validation helper that logs errors in development
export function validateApiResponse<T>(schema: z.ZodSchema<T>, data: unknown, context: string): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error(`[API Validation Error] ${context}:`, error.errors);
    }
    throw error;
  }
}
