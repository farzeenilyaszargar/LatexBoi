import Editor from "./editor";
import { SITE_URL, SITE_DESCRIPTION } from "./seo";

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org", "@graph": [
      { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: "Unleaf", url: SITE_URL, inLanguage: "en", description: SITE_DESCRIPTION },
      { "@type": "WebApplication", "@id": `${SITE_URL}/#app`, name: "Unleaf", url: SITE_URL, description: SITE_DESCRIPTION,
        applicationCategory: "ProductivityApplication", operatingSystem: "Any", browserRequirements: "Requires JavaScript and a modern web browser",
        isAccessibleForFree: true, offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        featureList: ["LaTeX command autocomplete", "Live document preview", "Local browser draft saving", "PDF export", "Light and dark themes"],
        image: `${SITE_URL}/unleaf-social.png` },
    ],
  };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} /><Editor /></>;
}
