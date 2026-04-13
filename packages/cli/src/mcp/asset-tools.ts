import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { Result } from "better-result";
import { getAssets, getOrderbook, getFeeStats } from "#/services/horizon.js";
import { formatHorizonError } from "#/services/output.js";
import type { Network } from "#/domain/types.js";

function ok<T>(data: T) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify({ ok: true, data }, null, 2) }],
  };
}

function err(message: string) {
  return {
    content: [
      { type: "text" as const, text: JSON.stringify({ ok: false, error: message }, null, 2) },
    ],
  };
}

function parseNetwork(value: string): Network {
  return value === "pubnet" ? "pubnet" : "testnet";
}

const networkParam = z.enum(["testnet", "pubnet"]).default("testnet").describe("Stellar network");
const limitParam = z.number().int().min(1).max(200).default(10).describe("Max records to return");

function parseAssetInput(input: string): {
  assetType: string;
  assetCode?: string;
  assetIssuer?: string;
} {
  if (input === "native" || input === "XLM") return { assetType: "native" };
  const parts = input.split(":");
  if (parts.length !== 2)
    throw new Error(`Invalid asset format: "${input}". Use "native" or "CODE:ISSUER".`);
  return {
    assetType: parts[0].length <= 4 ? "credit_alphanum4" : "credit_alphanum12",
    assetCode: parts[0],
    assetIssuer: parts[1],
  };
}

export function registerAssetTools(server: McpServer): void {
  server.registerTool(
    "assets_search",
    {
      description: "Search for assets on Stellar. Filter by asset code and/or issuer.",
      inputSchema: {
        network: networkParam,
        code: z.string().optional().describe("Filter by asset code (e.g. USDC)"),
        issuer: z.string().optional().describe("Filter by asset issuer (G...)"),
        limit: limitParam,
      },
    },
    async ({ network, code, issuer, limit }) => {
      const result = await getAssets(parseNetwork(network), {
        limit,
        code,
        issuer,
      });
      if (Result.isError(result)) return err(formatHorizonError(result.error));
      return ok({ count: result.value.length, assets: result.value });
    },
  );

  server.registerTool(
    "assets_orderbook",
    {
      description: "View the order book (bids and asks) for a pair of assets on Stellar.",
      inputSchema: {
        selling: z.string().describe("Selling asset: 'native' for XLM, or 'CODE:ISSUER'"),
        buying: z.string().describe("Buying asset: 'native' for XLM, or 'CODE:ISSUER'"),
        network: networkParam,
        limit: limitParam,
      },
    },
    async ({ selling, buying, network, limit }) => {
      try {
        const sellingAsset = parseAssetInput(selling);
        const buyingAsset = parseAssetInput(buying);
        const result = await getOrderbook(sellingAsset, buyingAsset, parseNetwork(network), {
          limit,
        });
        if (Result.isError(result)) return err(formatHorizonError(result.error));
        return ok(result.value);
      } catch (e: unknown) {
        return err(e instanceof Error ? e.message : String(e));
      }
    },
  );

  server.registerTool(
    "fee_stats",
    {
      description: "Get current fee statistics from the Stellar network.",
      inputSchema: {
        network: networkParam,
      },
    },
    async ({ network }) => {
      const result = await getFeeStats(parseNetwork(network));
      if (Result.isError(result)) return err(formatHorizonError(result.error));
      return ok(result.value);
    },
  );
}
