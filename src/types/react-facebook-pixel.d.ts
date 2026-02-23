declare module 'react-facebook-pixel' {
  export interface PixelOptions {
    autoConfig?: boolean;
    debug?: boolean;
  }

  export interface AdvancedMatching {
    em?: string;
    fn?: string;
    ln?: string;
    ph?: string;
    ge?: string;
    db?: string;
    ct?: string;
    st?: string;
    zp?: string;
    country?: string;
  }

  export type StandardEvent =
    | 'AddPaymentInfo'
    | 'AddToCart'
    | 'AddToWishlist'
    | 'CompleteRegistration'
    | 'Contact'
    | 'CustomizeProduct'
    | 'Donate'
    | 'FindLocation'
    | 'InitiateCheckout'
    | 'Lead'
    | 'PageView'
    | 'Purchase'
    | 'Schedule'
    | 'Search'
    | 'StartTrial'
    | 'SubmitApplication'
    | 'Subscribe'
    | 'ViewContent';

  export interface EventData {
    content_category?: string;
    content_ids?: string[];
    content_name?: string;
    content_type?: string;
    contents?: Array<{ id: string; quantity: number }>;
    currency?: string;
    num_items?: number;
    predicted_ltv?: number;
    search_string?: string;
    status?: string;
    value?: number;
    [key: string]: unknown;
  }

  const ReactPixel: {
    init(
      pixelId: string,
      advancedMatching?: AdvancedMatching,
      options?: PixelOptions
    ): void;
    pageView(): void;
    track(event: StandardEvent, data?: EventData): void;
    trackSingle(pixelId: string, event: StandardEvent, data?: EventData): void;
    trackCustom(event: string, data?: EventData): void;
    trackSingleCustom(pixelId: string, event: string, data?: EventData): void;
    fbq: (...args: unknown[]) => void;
  };

  export default ReactPixel;
}
