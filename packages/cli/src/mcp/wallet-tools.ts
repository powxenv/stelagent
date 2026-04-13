import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { Result } from "better-result";
import { fetchWallet, fetchAddress, createWallet } from "#/services/wallet-client.js";
import { getBalances, transferXlm } from "#/services/stellar.js";
import { requestOtp, verifyOtp } from "#/services/auth.js";
import { saveSession, clearSession, loadSession } from "#/services/session.js";
import { formatWalletError, formatStellarError, formatSessionError } from "#/services/output.js";
import { stellarPublicKey, amountSchema, emailSchema, otpSchema } from "#/domain/validators.js";

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

function parseNetwork(value: string) {
  return value === "pubnet" ? "pubnet" : "testnet";
}

function formatZodIssues(issues: z.ZodIssue[]): string {
  return issues.map((i) => i.message).join(", ");
}

export function registerWalletTools(server: McpServer): void {
  server.registerTool(
    "wallet_login",
    {
      description:
        "Request an OTP code be sent to the user's email. After calling this, use wallet_verify with the code the user provides. Does NOT require an active session.",
      inputSchema: {
        email: z.string().describe("User's email address"),
      },
    },
    async ({ email }) => {
      const validation = emailSchema.safeParse(email);
      if (!validation.success)
        return err(`Invalid email: ${formatZodIssues(validation.error.issues)}`);

      const result = await requestOtp(email);
      if (Result.isError(result)) return err(`Could not reach auth server: ${result.error.cause}`);

      const response = result.value;
      if (!response || !response.ok) return err("Failed to send OTP email");

      return ok({ message: response.message });
    },
  );

  server.registerTool(
    "wallet_verify",
    {
      description:
        "Verify an OTP code and create or recover the wallet. The session is saved locally so subsequent tools (wallet_address, wallet_balance, wallet_transfer, etc.) work without re-authentication.",
      inputSchema: {
        email: z.string().describe("Must match the email used in wallet_login"),
        otp: z.string().describe("OTP code from email"),
        network: z.enum(["testnet", "pubnet"]).default("testnet").describe("Stellar network"),
      },
    },
    async ({ email, otp, network }) => {
      const emailValidation = emailSchema.safeParse(email);
      if (!emailValidation.success)
        return err(`Invalid email: ${formatZodIssues(emailValidation.error.issues)}`);

      const otpValidation = otpSchema.safeParse(otp);
      if (!otpValidation.success)
        return err(`Invalid OTP: ${formatZodIssues(otpValidation.error.issues)}`);

      const verifyResult = await verifyOtp(email, otp);
      if (Result.isError(verifyResult))
        return err(`OTP verification failed: ${verifyResult.error.cause}`);

      const verifyResponse = verifyResult.value;
      if (!verifyResponse.verified) return err("OTP verification failed.");

      const sessionResult = saveSession(verifyResponse.token, verifyResponse.email);
      if (Result.isError(sessionResult)) return err(formatSessionError(sessionResult.error));

      const walletResult = await createWallet(parseNetwork(network));
      if (Result.isError(walletResult)) return err(formatWalletError(walletResult.error));

      const wallet = walletResult.value;
      return ok({
        wallet: {
          email: wallet.email,
          publicKey: wallet.publicKey,
          network: wallet.network,
          createdAt: wallet.createdAt,
        },
      });
    },
  );

  server.registerTool(
    "wallet_address",
    {
      description:
        "Get the logged-in wallet's public key, network, and email. Requires an active session.",
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
      description: "Get all asset balances for the logged-in wallet. Requires an active session.",
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
        return err(`Invalid destination: ${formatZodIssues(destValidation.error.issues)}`);

      const amountValidation = amountSchema.safeParse(amount);
      if (!amountValidation.success)
        return err(`Invalid amount: ${formatZodIssues(amountValidation.error.issues)}`);

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
