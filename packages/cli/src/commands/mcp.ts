import { defineCommand } from "citty";
import { startMcpServer } from "#/mcp/mod.js";

export const mcpCommand = defineCommand({
  meta: { name: "mcp", description: "Start the MCP server on stdio" },
  args: {},
  async run() {
    try {
      await startMcpServer();
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      console.error(`Failed to start MCP server: ${message}`);
      process.exit(1);
    }
  },
});
