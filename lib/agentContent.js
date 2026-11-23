export const SITE_URL = "https://notchloyalty.com";

export const PUBLIC_SITE_INFO = {
  name: "Notch",
  description:
    "Notch is a digital loyalty and growth platform for independent cafes in Egypt. Customers collect QR-based visit stamps and rewards, while cafes manage loyalty programs, online menus, and discovery.",
  email: "info@notchloyalty.com",
  areaServed: "Egypt",
};

export const PUBLIC_PAGES = [
  { title: "Home", url: `${SITE_URL}/` },
  { title: "About Notch", url: `${SITE_URL}/about` },
  { title: "Features", url: `${SITE_URL}/features` },
  { title: "How It Works", url: `${SITE_URL}/how-it-works` },
  { title: "Pricing", url: `${SITE_URL}/pricing` },
  { title: "Contact", url: `${SITE_URL}/contact` },
  { title: "Privacy Policy", url: `${SITE_URL}/privacy` },
  { title: "Terms of Service", url: `${SITE_URL}/terms` },
];

export const MCP_TOOL = {
  name: "get_public_information",
  title: "Get public Notch information",
  description:
    "Returns Notch's public business description, contact email, and links to public website pages. This tool is read-only.",
  inputSchema: {
    type: "object",
    properties: {},
    additionalProperties: false,
  },
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
  },
};

export const HOME_MARKDOWN = `# Notch

${PUBLIC_SITE_INFO.description}

- Website: ${SITE_URL}/
- About: ${SITE_URL}/about
- Features: ${SITE_URL}/features
- How it works: ${SITE_URL}/how-it-works
- Pricing: ${SITE_URL}/pricing
- Contact: ${SITE_URL}/contact
- Email: mailto:${PUBLIC_SITE_INFO.email}
- Privacy policy: ${SITE_URL}/privacy
- Terms of service: ${SITE_URL}/terms
`;
