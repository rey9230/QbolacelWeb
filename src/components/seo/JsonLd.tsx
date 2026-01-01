import { useEffect } from 'react';

interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  useEffect(() => {
    // Create or update the JSON-LD script
    const scriptId = `json-ld-${JSON.stringify(data['@type'])}`;
    let script = document.getElementById(scriptId) as HTMLScriptElement;
    
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    
    script.textContent = JSON.stringify(data);

    return () => {
      script?.remove();
    };
  }, [data]);

  return null;
}

// Schema.org Product
interface ProductSchemaProps {
  name: string;
  description: string;
  image: string | string[];
  price: number;
  currency: string;
  availability: 'InStock' | 'OutOfStock' | 'BackOrder';
  sku?: string;
  brand?: string;
  rating?: number;
  reviewCount?: number;
  url: string;
}

export function ProductSchema({
  name,
  description,
  image,
  price,
  currency,
  availability,
  sku,
  brand,
  rating,
  reviewCount,
  url,
}: ProductSchemaProps) {
  const availabilityMap = {
    InStock: 'https://schema.org/InStock',
    OutOfStock: 'https://schema.org/OutOfStock',
    BackOrder: 'https://schema.org/BackOrder',
  };

  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image: Array.isArray(image) ? image : [image],
    offers: {
      '@type': 'Offer',
      price: price.toFixed(2),
      priceCurrency: currency,
      availability: availabilityMap[availability],
      url,
      seller: {
        '@type': 'Organization',
        name: 'Qbolacel',
      },
    },
  };

  if (sku) data.sku = sku;
  if (brand) data.brand = { '@type': 'Brand', name: brand };
  
  if (rating && reviewCount) {
    data.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: rating.toFixed(1),
      reviewCount,
    };
  }

  return <JsonLd data={data} />;
}

// Schema.org Organization
export function OrganizationSchema() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Qbolacel',
    url: 'https://qbolacel.com',
    logo: 'https://qbolacel.com/logo.svg',
    description: 'Plataforma líder en recargas a Cuba y marketplace con entrega a domicilio.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Saint Petersburg',
      addressRegion: 'Florida',
      addressCountry: 'US',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-727-276-0465',
      email: 'soporte@qbolacel.com',
      contactType: 'customer service',
      availableLanguage: ['Spanish', 'English'],
    },
    sameAs: [
      'https://facebook.com/qbolacel',
      'https://instagram.com/qbolacel',
    ],
  };

  return <JsonLd data={data} />;
}

// Schema.org BreadcrumbList
interface BreadcrumbItem {
  name: string;
  url: string;
}

export function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return <JsonLd data={data} />;
}

// Schema.org FAQPage
interface FAQItem {
  question: string;
  answer: string;
}

export function FAQSchema({ items }: { items: FAQItem[] }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return <JsonLd data={data} />;
}

// Schema.org HowTo
interface HowToStep {
  name: string;
  text: string;
}

export function HowToSchema({
  name,
  description,
  image,
  steps,
}: {
  name: string;
  description: string;
  image?: string;
  steps: HowToStep[];
}) {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    step: steps.map((step) => ({
      '@type': 'HowToStep',
      name: step.name,
      text: step.text,
    })),
  };

  if (image) {
    data.image = image;
  }

  return <JsonLd data={data} />;
}

// Schema.org WebSite with SearchAction
export function WebsiteSchema() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Qbolacel',
    url: 'https://qbolacel.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://qbolacel.com/marketplace?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return <JsonLd data={data} />;
}

// Schema.org LocalBusiness
export function LocalBusinessSchema() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Qbolacel',
    image: 'https://qbolacel.com/logo.svg',
    telephone: '+1-727-276-0465',
    email: 'soporte@qbolacel.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Saint Petersburg',
      addressRegion: 'FL',
      addressCountry: 'US',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '10:00',
        closes: '14:00',
      },
    ],
    priceRange: '$$',
  };

  return <JsonLd data={data} />;
}
