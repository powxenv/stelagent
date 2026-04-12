import { defineCommand } from "citty";
import { Horizon } from "@stellar/stellar-sdk";
import type { Network } from "#/domain/types.js";

const HORIZON_URLS: Record<Network, string> = {
  testnet: process.env.STECLI_HORIZON_TESTNET_URL ?? "https://horizon-testnet.stellar.org",
  pubnet: process.env.STECLI_HORIZON_PUBNET_URL ?? "https://horizon-mainnet.stellar.org",
};

export const monitorEffects = defineCommand({
  meta: { name: "effects", description: "Stream effects for an account in real-time" },
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
    let builder = server.effects().forAccount(args.address as string);
    if (args.cursor && args.cursor !== "now") {
      builder = builder.cursor(args.cursor as string);
    }
    console.log(
      JSON.stringify(
        {
          ok: true,
          data: {
            message: `Streaming effects for ${args.address} on ${network}... Press Ctrl+C to stop.`,
          },
        },
        null,
        2,
      ),
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const es: () => void = builder.stream({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onmessage: (ef: any) => {
        const entry = {
          id: ef.id as string,
          account: ef.account as string,
          type: ef.type as string,
          createdAt: ef.created_at as string,
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
