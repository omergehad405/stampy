import { MCP_TOOL, SITE_URL } from "@/lib/agentContent";

const card = {
  $schema: "https://static.modelcontextprotocol.io/schemas/mcp-server-card/v1.json",
  version: "1.0",
  protocolVersion: "2025-06-18",
  serverInfo: {
    name: "notch-public-info",
    title: "Notch Public Information",
    version: "1.0.0",
  },
  description:
    "Read-only public information about Notch, a digital loyalty and growth platform for independent cafes in Egypt.",
  iconUrl: `${SITE_URL}/logo.png`,
  documentationUrl: `${SITE_URL}/about`,
  transport: {
    type: "streamable-http",
    endpoint: `${SITE_URL}/mcp`,
  },
  capabilities: {
    tools: { listChanged: false },
  },
  instructions:
    "Use the get_public_information tool to retrieve Notch's public business details, contact email, and website links. No account data or write operations are available.",
  tools: [MCP_TOOL],
};

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Cache-Control": "public, max-age=3600",
};

export function GET() {
  return Response.json(card, { headers });
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers });
}
