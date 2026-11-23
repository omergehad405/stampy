"use client";

import { useEffect } from "react";
import { MCP_TOOL, PUBLIC_PAGES, PUBLIC_SITE_INFO } from "@/lib/agentContent";

export default function MarketingAgentTools() {
  useEffect(() => {
    const modelContext =
      window.navigator.modelContext || document.modelContext;

    if (!modelContext?.registerTool) {
      return;
    }

    const controller = new AbortController();
    modelContext
      .registerTool(
        {
          ...MCP_TOOL,
          execute: async () => ({
            business: PUBLIC_SITE_INFO,
            pages: PUBLIC_PAGES,
          }),
        },
        { signal: controller.signal },
      )
      .catch((error) => {
        if (!controller.signal.aborted) {
          console.error("Could not register Notch's WebMCP tool.", error);
        }
      });

    return () => controller.abort();
  }, []);

  return null;
}
