/**
 * Meta Pixel (Facebook Pixel) - Centralized Tracking Helper
 * Pixel ID: 881143634560521
 * 
 * Este módulo centraliza toda la lógica de tracking de Meta Pixel para Qbolacel.
 * Incluye tracking de: PageView, ViewContent, AddToCart, InitiateCheckout, Purchase, Lead
 */

import ReactPixel from 'react-facebook-pixel';

// ============================================================================
// CONSTANTS
// ============================================================================

export const PIXEL_ID = '881143634560521';

/** Valores estimados para eventos Lead de servicios WhatsApp (en USD) */
export const LEAD_VALUES = {
  carRental: 750,    // Renta de autos
  flights: 350,      // Boletos aéreos
  legal: 250,        // Trámites legales/pasaporte
  remittances: 100,  // Envío de remesas
  general: 0,        // Contacto general
} as const;

export type LeadServiceType = keyof typeof LEAD_VALUES;

/** Categorías de contenido para segmentación */
export const CONTENT_CATEGORIES = {
  CUBACEL: 'Cubacel',
  NAUTA: 'Nauta',
  MARKETPLACE: 'Marketplace',
  RECHARGE: 'Recarga',
} as const;

export type ContentCategory = typeof CONTENT_CATEGORIES[keyof typeof CONTENT_CATEGORIES];

// ============================================================================
// INITIALIZATION
// ============================================================================

let isInitialized = false;

/**
 * Inicializa el Meta Pixel con el ID de Qbolacel.
 * Solo se inicializa una vez, llamadas posteriores son ignoradas.
 * En desarrollo (localhost), activa el modo debug para ver logs en consola.
 */
export function initPixel(): void {
  if (isInitialized) {
    return;
  }

  const isDebug = import.meta.env.DEV;

  ReactPixel.init(PIXEL_ID, undefined, {
    autoConfig: true,
    debug: isDebug,
  });

  isInitialized = true;

  if (isDebug) {
    console.log('🔵 Meta Pixel inicializado:', PIXEL_ID);
  }
}

// ============================================================================
// PAGE TRACKING
// ============================================================================

/**
 * Registra una vista de página.
 * Llamar en cada cambio de ruta para SPAs.
 */
export function trackPageView(): void {
  ReactPixel.pageView();
  
  if (import.meta.env.DEV) {
    console.log('🔵 Pixel PageView:', window.location.pathname);
  }
}

// ============================================================================
// CONTENT & PRODUCT TRACKING
// ============================================================================

export interface ViewContentParams {
  contentId: string;
  contentName: string;
  contentCategory: ContentCategory;
  value?: number;
  currency?: string;
}

/**
 * Registra cuando un usuario ve contenido específico (producto, recarga, etc).
 */
export function trackViewContent(params: ViewContentParams): void {
  const { contentId, contentName, contentCategory, value, currency = 'USD' } = params;

  ReactPixel.track('ViewContent', {
    content_ids: [contentId],
    content_name: contentName,
    content_category: contentCategory,
    content_type: 'product',
    value,
    currency,
  });

  if (import.meta.env.DEV) {
    console.log('🔵 Pixel ViewContent:', { contentId, contentName, contentCategory, value });
  }
}

// ============================================================================
// CART TRACKING
// ============================================================================

export interface AddToCartParams {
  contentId: string;
  contentName: string;
  contentCategory: ContentCategory;
  value: number;
  currency?: string;
  quantity?: number;
}

/**
 * Registra cuando un usuario añade un item al carrito.
 */
export function trackAddToCart(params: AddToCartParams): void {
  const { contentId, contentName, contentCategory, value, currency = 'USD', quantity = 1 } = params;

  ReactPixel.track('AddToCart', {
    content_ids: [contentId],
    content_name: contentName,
    content_category: contentCategory,
    content_type: 'product',
    value,
    currency,
    contents: [{ id: contentId, quantity }],
  });

  if (import.meta.env.DEV) {
    console.log('🔵 Pixel AddToCart:', { contentId, contentName, value, quantity });
  }
}

// ============================================================================
// CHECKOUT TRACKING
// ============================================================================

export interface InitiateCheckoutParams {
  contentIds: string[];
  contentCategory: ContentCategory;
  value: number;
  currency?: string;
  numItems?: number;
}

/**
 * Registra cuando un usuario inicia el proceso de checkout.
 */
export function trackInitiateCheckout(params: InitiateCheckoutParams): void {
  const { contentIds, contentCategory, value, currency = 'USD', numItems } = params;

  ReactPixel.track('InitiateCheckout', {
    content_ids: contentIds,
    content_category: contentCategory,
    content_type: 'product',
    value,
    currency,
    num_items: numItems ?? contentIds.length,
  });

  if (import.meta.env.DEV) {
    console.log('🔵 Pixel InitiateCheckout:', { contentIds, contentCategory, value, numItems });
  }
}

// ============================================================================
// PURCHASE TRACKING
// ============================================================================

export interface PurchaseParams {
  transactionId: string;
  value: number;
  currency?: string;
  contentIds?: string[];
  contentName?: string;
  contentCategory: ContentCategory;
}

/**
 * Registra una compra completada.
 * Este es el evento de conversión principal para Meta Ads.
 */
export function trackPurchase(params: PurchaseParams): void {
  const { 
    transactionId, 
    value, 
    currency = 'USD', 
    contentIds, 
    contentName, 
    contentCategory 
  } = params;

  ReactPixel.track('Purchase', {
    content_ids: contentIds ?? [transactionId],
    content_name: contentName,
    content_category: contentCategory,
    content_type: 'product',
    value,
    currency,
  });

  if (import.meta.env.DEV) {
    console.log('💰 Pixel Purchase:', { transactionId, value, currency, contentCategory });
  }
}

// ============================================================================
// LEAD TRACKING (WhatsApp Services)
// ============================================================================

export interface LeadParams {
  serviceType: LeadServiceType;
  serviceName?: string;
}

/**
 * Registra un lead de servicios premium vía WhatsApp.
 * Usa valores estimados predefinidos basados en el tipo de servicio.
 * 
 * @param serviceType - Tipo de servicio: 'carRental' | 'flights' | 'legal' | 'remittances' | 'general'
 */
export function trackLead(params: LeadParams): void {
  const { serviceType, serviceName } = params;
  const value = LEAD_VALUES[serviceType];

  const serviceNames: Record<LeadServiceType, string> = {
    carRental: 'Renta de Autos',
    flights: 'Boletos Aéreos',
    legal: 'Trámites Legales/Pasaporte',
    remittances: 'Envío de Remesas',
    general: 'Contacto General',
  };

  ReactPixel.track('Lead', {
    content_name: serviceName ?? serviceNames[serviceType],
    content_category: 'Servicios Premium',
    value,
    currency: 'USD',
  });

  if (import.meta.env.DEV) {
    console.log('🔵 Pixel Lead:', { serviceType, serviceName: serviceNames[serviceType], value });
  }
}

// ============================================================================
// CONTACT TRACKING (Generic WhatsApp clicks)
// ============================================================================

/**
 * Registra un contacto genérico (clicks de WhatsApp que no son servicios específicos).
 */
export function trackContact(contentName?: string): void {
  ReactPixel.track('Contact', {
    content_name: contentName ?? 'WhatsApp Contact',
    content_category: 'Contact',
  });

  if (import.meta.env.DEV) {
    console.log('🔵 Pixel Contact:', { contentName });
  }
}
