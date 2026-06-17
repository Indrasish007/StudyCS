// Dynamic SEO tag manager for StudyCS

export interface SeoProps {
  title: string;
  description: string;
  slug?: string;
  type?: "website" | "article";
  image?: string;
}

export function updateSeo({
  title,
  description,
  slug = "",
  type = "website",
  image = "",
}: SeoProps) {
  const fullTitle = `${title} | StudyCS`;
  document.title = fullTitle;

  // 1. Meta Description
  updateMetaTag("name", "description", description);

  // 2. Canonical URL
  const canonicalUrl = `${window.location.origin}${window.location.pathname}${slug ? `#/note/${slug}` : ""}`;
  updateLinkTag("canonical", canonicalUrl);

  // 3. OpenGraph Tags
  updateMetaTag("property", "og:title", fullTitle);
  updateMetaTag("property", "og:description", description);
  updateMetaTag("property", "og:type", type);
  updateMetaTag("property", "og:url", canonicalUrl);
  
  // Use a fallback or custom dynamic preview card image URL
  const previewImage = image || `${window.location.origin}/preview-card.png`;
  updateMetaTag("property", "og:image", previewImage);

  // 4. Twitter Cards
  updateMetaTag("name", "twitter:card", "summary_large_image");
  updateMetaTag("name", "twitter:title", fullTitle);
  updateMetaTag("name", "twitter:description", description);
  updateMetaTag("name", "twitter:image", previewImage);

  // 5. JSON-LD Schema Structured Data
  updateJsonLd(title, description, canonicalUrl, slug);
}

function updateMetaTag(attr: "name" | "property", val: string, content: string) {
  let element = document.querySelector(`meta[${attr}="${val}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attr, val);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

function updateLinkTag(rel: string, href: string) {
  let element = document.querySelector(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", rel);
    document.head.appendChild(element);
  }
  element.setAttribute("href", href);
}

function updateJsonLd(title: string, description: string, url: string, slug: string) {
  let scriptElement = document.getElementById("jsonld-structured-data") as HTMLScriptElement;
  if (!scriptElement) {
    scriptElement = document.createElement("script");
    scriptElement.id = "jsonld-structured-data";
    scriptElement.type = "application/ld+json";
    document.head.appendChild(scriptElement);
  }

  const schema = slug 
    ? {
        "@context": "https://schema.org",
        "@type": "Course",
        "name": title,
        "description": description,
        "provider": {
          "@type": "Organization",
          "name": "StudyCS Study Hub",
          "sameAs": window.location.origin
        },
        "url": url
      }
    : {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "StudyCS Study Hub",
        "description": description,
        "url": window.location.origin
      };

  scriptElement.text = JSON.stringify(schema, null, 2);
}
