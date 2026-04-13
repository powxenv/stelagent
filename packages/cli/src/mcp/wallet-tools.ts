import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { Result } from "better-result";
import { fetchWallet, fetchAddress } from "#/services/wallet-client.js";
import { getBalances } from "#/services/stellar.js";
import { transferXlm } from "#/services/stellar.js";
import { clearSession, loadSession } from "#/services/session.js";
import { formatWalletError, formatStellarError, formatSessionError } from "#/services/output.js";
import { stellarPublicKey, amountSchema } from "#/domain/validators.js";

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

export function registerWalletTools(server: McpServer): void {
  server.registerTool(
    "wallet_address",
    {
      description:
        "Get the logged-in wallet's public key, network, and email. Requires an active session (login via CLI first).",
      inputSchema: {},
    },
    async () => {
      const addressResult = await fetchAddress();
      if (Result.isError(addressResult)) return err(formatWalletError(addressResult.error));
      const addr = addressResult.value;
      return ok({ publicKey: addr.publicKey, network: addr.network, email: addr.email });
    },
  );

  server.registerTool(
    "wallet_balance",
    {
      description:
        "Get all asset balances for the logged-in wallet. Requires an active session (login via CLI first).",
      inputSchema: {},
    },
    async () => {
      const walletResult = await fetchWallet();
      if (Result.isError(walletResult)) return err(formatWalletError(walletResult.error));
      const wallet = walletResult.value;

      const balancesResult = await getBalances(wallet.publicKey, wallet.network);
      if (Result.isError(balancesResult)) return err(formatStellarError(balancesResult.error));

      return ok({ address: wallet.publicKey, email: wallet.email, balances: balancesResult.value });
    },
  );

  server.registerTool(
    "wallet_transfer",
    {
      description:
        "Send XLM from the logged-in wallet to another Stellar address. Requires an active session.",
      inputSchema: {
        destination: z.string().describe("Destination public key (G...)"),
        amount: z.string().describe("Amount in XLM (up to 7 decimal places)"),
      },
    },
    async ({ destination, amount }) => {
      const destValidation = stellarPublicKey.safeParse(destination);
      if (!destValidation.success)
        return err(
          `Invalid destination: ${destValidation.error.issues.map((i) => i.message).join(", ")}`,
        );

      const amountValidation = amountSchema.safeParse(amount);
      if (!amountValidation.success)
        return err(
          `Invalid amount: ${amountValidation.error.issues.map((i) => i.message).join(", ")}`,
        );

      const walletResult = await fetchWallet();
      if (Result.isError(walletResult)) return err(formatWalletError(walletResult.error));

      const result = await transferXlm(
        walletResult.value.secretKey,
        destination,
        amount,
        walletResult.value.network,
      );
      if (Result.isError(result)) return err(formatStellarError(result.error));

      return ok(result.value);
    },
  );

  server.registerTool(
    "wallet_logout",
    {
      description: "Clear the local wallet session.",
      inputSchema: {},
    },
    async () => {
      const sessionResult = loadSession();
      if (Result.isError(sessionResult)) return err(formatSessionError(sessionResult.error));

      const email = sessionResult.value.email;
      const clearResult = clearSession();
      if (Result.isError(clearResult)) return err(formatSessionError(clearResult.error));

      return ok({ loggedOut: true, email });
    },
  );
}
