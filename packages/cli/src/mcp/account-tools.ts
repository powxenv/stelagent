import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { Result } from "better-result";
import { getAccountDetails, getTransactions, getPayments, getEffects } from "#/services/horizon.js";
import { formatHorizonError } from "#/services/output.js";
import type { Network } from "#/domain/types.js";
import { stellarPublicKey } from "#/domain/validators.js";

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

const addressParam = z.string().describe("Stellar public key (G...)");
const networkParam = z.enum(["testnet", "pubnet"]).default("testnet").describe("Stellar network");
const limitParam = z.number().int().min(1).max(200).default(10).describe("Max records to return");
const cursorParam = z.string().optional().describe("Pagination cursor");
const orderParam = z.enum(["asc", "desc"]).default("desc").describe("Sort order");

export function registerAccountTools(server: McpServer): void {
  server.registerTool(
    "account_details",
    {
      description:
        "Get detailed account information from Horizon: balances, signers, thresholds, flags, and more.",
      inputSchema: {
        address: addressParam,
        network: networkParam,
      },
    },
    async ({ address, network }) => {
      const validation = stellarPublicKey.safeParse(address);
      if (!validation.success)
        return err(`Invalid address: ${validation.error.issues.map((i) => i.message).join(", ")}`);

      const result = await getAccountDetails(address, parseNetwork(network));
      if (Result.isError(result)) return err(formatHorizonError(result.error));
      return ok(result.value);
    },
  );

  server.registerTool(
    "account_transactions",
    {
      description: "Get transaction history for a Stellar account from Horizon.",
      inputSchema: {
        address: addressParam,
        network: networkParam,
        limit: limitParam,
        cursor: cursorParam,
        order: orderParam,
      },
    },
    async ({ address, network, limit, cursor, order }) => {
      const validation = stellarPublicKey.safeParse(address);
      if (!validation.success)
        return err(`Invalid address: ${validation.error.issues.map((i) => i.message).join(", ")}`);

      const result = await getTransactions(address, parseNetwork(network), {
        limit,
        cursor,
        order,
      });
      if (Result.isError(result)) return err(formatHorizonError(result.error));
      return ok({ address, count: result.value.length, transactions: result.value });
    },
  );

  server.registerTool(
    "account_payments",
    {
      description: "Get payment history for a Stellar account from Horizon.",
      inputSchema: {
        address: addressParam,
        network: networkParam,
        limit: limitParam,
        cursor: cursorParam,
        order: orderParam,
      },
    },
    async ({ address, network, limit, cursor, order }) => {
      const validation = stellarPublicKey.safeParse(address);
      if (!validation.success)
        return err(`Invalid address: ${validation.error.issues.map((i) => i.message).join(", ")}`);

      const result = await getPayments(address, parseNetwork(network), {
        limit,
        cursor,
        order,
      });
      if (Result.isError(result)) return err(formatHorizonError(result.error));
      return ok({ address, count: result.value.length, payments: result.value });
    },
  );

  server.registerTool(
    "account_effects",
    {
      description: "Get effects history for a Stellar account from Horizon.",
      inputSchema: {
        address: addressParam,
        network: networkParam,
        limit: limitParam,
        cursor: cursorParam,
      },
    },
    async ({ address, network, limit, cursor }) => {
      const validation = stellarPublicKey.safeParse(address);
      if (!validation.success)
        return err(`Invalid address: ${validation.error.issues.map((i) => i.message).join(", ")}`);

      const result = await getEffects(address, parseNetwork(network), {
        limit,
        cursor,
      });
      if (Result.isError(result)) return err(formatHorizonError(result.error));
      return ok({ address, count: result.value.length, effects: result.value });
    },
  );
}
