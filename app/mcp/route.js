import { MCP_TOOL, PUBLIC_PAGES, PUBLIC_SITE_INFO, SITE_URL } from "@/lib/agentContent";

const PROTOCOL_VERSION = "2025-06-18";
const SERVER_INFO = {
  name: "notch-public-info",
  title: "Notch Public Information",
  version: "1.0.0",
};

function responseHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, MCP-Protocol-Version",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Cache-Control": "no-store",
  };
}

function jsonResponse(body, status = 200) {
  return Response.json(body, { status, headers: responseHeaders() });
}

function rpcError(id, code, message, status = 200) {
  return jsonResponse(
    { jsonrpc: "2.0", id, error: { code, message } },
    status,
  );
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: responseHeaders() });
}

export async function POST(request) {
  const contentType = request.headers.get("content-type") || "";
  const accept = request.headers.get("accept") || "";

  if (!contentType.toLowerCase().includes("application/json")) {
    return new Response("Expected an application/json request.", {
      status: 415,
      headers: responseHeaders(),
    });
  }

  if (!accept.includes("application/json") && !accept.includes("*/*")) {
    return new Response("This endpoint responds with application/json.", {
      status: 406,
      headers: responseHeaders(),
    });
  }

  let message;
  try {
    message = await request.json();
  } catch {
    return rpcError(null, -32700, "Parse error.", 400);
  }

  if (
    !message ||
    Array.isArray(message) ||
    message.jsonrpc !== "2.0" ||
    typeof message.method !== "string"
  ) {
    return rpcError(null, -32600, "Invalid Request.", 400);
  }

  const hasId = Object.prototype.hasOwnProperty.call(message, "id");
  if (!hasId) {
    return new Response(null, { status: 202, headers: responseHeaders() });
  }

  const id = message.id;
  const params =
    message.params && typeof message.params === "object" && !Array.isArray(message.params)
      ? message.params
      : {};

  if (message.method === "initialize") {
    return jsonResponse({
      jsonrpc: "2.0",
      id,
      result: {
        protocolVersion: PROTOCOL_VERSION,
        capabilities: { tools: { listChanged: false } },
        serverInfo: SERVER_INFO,
        instructions:
          "This public, read-only MCP server returns general information and links for Notch. It does not access customer or cafe accounts.",
      },
    });
  }

  if (message.method === "ping") {
    return jsonResponse({ jsonrpc: "2.0", id, result: {} });
  }

  if (message.method === "tools/list") {
    return jsonResponse({
      jsonrpc: "2.0",
      id,
      result: {
        tools: [MCP_TOOL],
      },
    });
  }

  if (message.method === "tools/call") {
    if (params.name !== MCP_TOOL.name) {
      return jsonResponse({
        jsonrpc: "2.0",
        id,
        result: {
          content: [{ type: "text", text: `Unknown tool: ${String(params.name || "")}` }],
          isError: true,
        },
      });
    }

    const args = params.arguments ?? {};
    if (
      !args ||
      typeof args !== "object" ||
      Array.isArray(args) ||
      Object.keys(args).length > 0
    ) {
      return rpcError(id, -32602, "The tool accepts no arguments.");
    }

    return jsonResponse({
      jsonrpc: "2.0",
      id,
      result: {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                business: PUBLIC_SITE_INFO,
                website: SITE_URL,
                pages: PUBLIC_PAGES,
              },
              null,
              2,
            ),
          },
        ],
        isError: false,
      },
    });
  }

  return rpcError(id, -32601, `Method not found: ${message.method}`);
}
