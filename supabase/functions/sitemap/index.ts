import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const API_BASE_URL = 'https://api.qbolacel.com/api/v1';
const SITE_URL = 'https://qbolacel.com';

interface Product {
  id: string;
  slug: string;
  updatedAt?: string;
  createdAt?: string;
}

interface ProductsResponse {
  items: Product[];
  nextCursor?: string;
}

async function fetchAllProducts(): Promise<Product[]> {
  const allProducts: Product[] = [];
  let cursor: string | undefined = undefined;
  
  try {
    do {
      const url = new URL(`${API_BASE_URL}/products`);
      url.searchParams.set('limit', '100');
      if (cursor) {
        url.searchParams.set('cursor', cursor);
      }
      
      const response = await fetch(url.toString());
      
      if (!response.ok) {
        console.error('Failed to fetch products:', response.status, response.statusText);
        break;
      }
      
      const data: ProductsResponse = await response.json();
      allProducts.push(...data.items);
      cursor = data.nextCursor;
      
      console.log(`Fetched ${data.items.length} products, total: ${allProducts.length}, nextCursor: ${cursor || 'none'}`);
    } while (cursor);
    
  } catch (error) {
    console.error('Error fetching products:', error);
  }
  
  return allProducts;
}

function generateSitemap(products: Product[]): string {
  const today = new Date().toISOString().split('T')[0];
  
  // Static pages
  const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'daily' },
    { url: '/marketplace', priority: '0.9', changefreq: 'daily' },
    { url: '/recargas', priority: '0.9', changefreq: 'weekly' },
    { url: '/nosotros', priority: '0.6', changefreq: 'monthly' },
    { url: '/contacto', priority: '0.6', changefreq: 'monthly' },
    { url: '/faq', priority: '0.7', changefreq: 'monthly' },
    { url: '/terminos', priority: '0.3', changefreq: 'yearly' },
    { url: '/privacidad', priority: '0.3', changefreq: 'yearly' },
  ];
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

  // Add static pages
  for (const page of staticPages) {
    xml += `  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
  }
  
  // Add product pages
  for (const product of products) {
    const lastmod = product.updatedAt 
      ? new Date(product.updatedAt).toISOString().split('T')[0]
      : product.createdAt 
        ? new Date(product.createdAt).toISOString().split('T')[0]
        : today;
    
    xml += `  <url>
    <loc>${SITE_URL}/productos/${product.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
  }
  
  xml += `</urlset>`;
  
  return xml;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting sitemap generation...');
    
    const products = await fetchAllProducts();
    console.log(`Total products fetched: ${products.length}`);
    
    const sitemap = generateSitemap(products);
    
    return new Response(sitemap, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate sitemap' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
