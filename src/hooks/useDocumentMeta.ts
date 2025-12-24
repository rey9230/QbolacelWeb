import { useEffect } from 'react';

interface DocumentMetaOptions {
  title: string;
  description?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  noIndex?: boolean;
}

const BASE_URL = 'https://qbolacel.com';
const DEFAULT_TITLE = 'Qbolacel - Recargas a Cuba y Marketplace';
const DEFAULT_DESCRIPTION = 'Envía recargas Cubacel y Nauta a Cuba al instante. Compra productos con entrega a domicilio en toda Cuba. Servicio rápido, seguro y confiable.';
const DEFAULT_IMAGE = `${BASE_URL}/og-image.jpg`;

export function useDocumentMeta(options: DocumentMetaOptions) {
  useEffect(() => {
    const {
      title,
      description = DEFAULT_DESCRIPTION,
      canonical,
      ogTitle,
      ogDescription,
      ogImage = DEFAULT_IMAGE,
      ogType = 'website',
      noIndex = false,
    } = options;

    // Set document title
    document.title = title ? `${title} | Qbolacel` : DEFAULT_TITLE;

    // Helper to update or create meta tag
    const setMeta = (name: string, content: string, property = false) => {
      const attr = property ? 'property' : 'name';
      let element = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Helper to update or create link tag
    const setLink = (rel: string, href: string) => {
      let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
      
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
    };

    // Meta description
    setMeta('description', description);

    // Robots
    if (noIndex) {
      setMeta('robots', 'noindex, nofollow');
    } else {
      setMeta('robots', 'index, follow');
    }

    // Canonical URL
    const canonicalUrl = canonical || window.location.href.split('?')[0];
    setLink('canonical', canonicalUrl);

    // Open Graph tags
    setMeta('og:title', ogTitle || title || DEFAULT_TITLE, true);
    setMeta('og:description', ogDescription || description, true);
    setMeta('og:image', ogImage, true);
    setMeta('og:type', ogType, true);
    setMeta('og:url', canonicalUrl, true);
    setMeta('og:site_name', 'Qbolacel', true);
    setMeta('og:locale', 'es_ES', true);

    // Twitter Card tags
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', ogTitle || title || DEFAULT_TITLE);
    setMeta('twitter:description', ogDescription || description);
    setMeta('twitter:image', ogImage);

    // Cleanup function to reset meta tags when component unmounts
    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, [options.title, options.description, options.canonical, options.ogTitle, options.ogDescription, options.ogImage, options.ogType, options.noIndex]);
}

export { BASE_URL, DEFAULT_TITLE, DEFAULT_DESCRIPTION };
