import { defineCommand } from "citty";
import { Horizon } from "@stellar/stellar-sdk";
import type { Network } from "#/domain/types.js";

const HORIZON_URLS: Record<Network, string> = {
  testnet: process.env.STECLI_HORIZON_TESTNET_URL ?? "https://horizon-testnet.stellar.org",
  pubnet: process.env.STECLI_HORIZON_PUBNET_URL ?? "https://horizon-mainnet.stellar.org",
};

export const monitorTransactions = defineCommand({
  meta: { name: "transactions", description: "Stream transactions for an account in real-time" },
  args: {
    address: {
      type: "positional",
      description: "Stellar public key (G...)",
      required: true,
    },
    network: {
      type: "string",
      alias: ["n"],
      description: "Network: testnet or pubnet",
      default: "testnet",
    },
    cursor: {
      type: "string",
      alias: ["c"],
      description: "Start from this cursor (default: 'now' for new events)",
      default: "now",
    },
  },
  async run({ args }) {
    const network = args.network as Network;
    if (network !== "testnet" && network !== "pubnet") {
      console.log(
        JSON.stringify(
          { ok: false, error: "Invalid network. Must be 'testnet' or 'pubnet'." },
          null,
          2,
        ),
      );
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const server: any = new Horizon.Server(HORIZON_URLS[network]);
    let builder = server.transactions().forAccount(args.address as string);
    if (args.cursor && args.cursor !== "now") {
      builder = builder.cursor(args.cursor as string);
    }
    console.log(
      JSON.stringify(
        {
          ok: true,
          data: {
            message: `Streaming transactions for ${args.address} on ${network}... Press Ctrl+C to stop.`,
          },
        },
        null,
        2,
      ),
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const es: () => void = builder.stream({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onmessage: (tx: any) => {
        const entry = {
          id: tx.id as string,
          hash: tx.hash as string,
          createdAt: tx.created_at as string,
          source: tx.source_account as string,
          successful: tx.successful as boolean,
          feeCharged: tx.fee_charged as string | number,
          operationCount: tx.operation_count as number,
        };
        console.log(JSON.stringify({ ok: true, data: entry }));
      },
      onerror: (error: unknown) => {
        console.log(
          JSON.stringify({
            ok: false,
            error: `Stream error: ${error instanceof Error ? error.message : String(error)}`,
          }),
        );
      },
    });
    await new Promise<void>((resolve) => {
      process.on("SIGINT", () => {
        es();
        resolve();
      });
    });
  },
});
