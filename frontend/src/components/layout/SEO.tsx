import { Helmet } from "react-helmet-async";
import { SEO_CONFIG } from "@/config/seo";

interface SEOProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  type?: "website" | "article";
  image?: string;
  schema?: any;
}

export function SEO({ 
  title, 
  description, 
  canonicalUrl, 
  type = "website",
  image,
  schema
}: SEOProps) {
  const pageTitle = title ? `${title} | ${SEO_CONFIG.SITE_NAME}` : SEO_CONFIG.DEFAULT_TITLE;
  const pageDescription = description || SEO_CONFIG.DEFAULT_DESCRIPTION;
  const fullCanonicalUrl = canonicalUrl ? `${SEO_CONFIG.SITE_URL}${canonicalUrl}` : SEO_CONFIG.SITE_URL;
  const ogImage = image || `${SEO_CONFIG.SITE_URL}/og-image.png`; // Fallback to a default OG image if you add one

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      {canonicalUrl && <link rel="canonical" href={fullCanonicalUrl} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullCanonicalUrl} />
      <meta property="twitter:title" content={pageTitle} />
      <meta property="twitter:description" content={pageDescription} />
      <meta property="twitter:image" content={ogImage} />

      {/* Schema.org Structured Data */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}
