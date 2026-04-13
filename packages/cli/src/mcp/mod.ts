import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerWalletTools } from "./wallet-tools.js";
import { registerAccountTools } from "./account-tools.js";
import { registerAssetTools } from "./asset-tools.js";
import { registerPaymentTools } from "./payment-tools.js";

export async function startMcpServer(): Promise<void> {
  const server = new McpServer(
    { name: "stelagent", version: "0.1.0" },
    {
      instructions: [
        "Stelagent MCP server for Stellar blockchain operations.",
        "Authentication flow: 1) wallet_login (sends OTP to email) → 2) wallet_verify (verifies OTP, creates session and wallet). After verify, all other wallet tools work.",
        "Account, asset, and fee tools are public and require no authentication — only a Stellar public key or network parameter.",
        "All tools return { ok: true, data } on success or { ok: false, error } on failure.",
        "Network defaults to 'testnet'. Use 'pubnet' for mainnet.",
      ].join("\n"),
    },
  );

  registerWalletTools(server);
  registerAccountTools(server);
  registerAssetTools(server);
  registerPaymentTools(server);

  const transport = new StdioServerTransport();
  await server.connect(transport);
}
