import { defineCommand } from "citty";
import { Result } from "better-result";
import { z } from "zod";
import { runApp } from "#/lib/run.js";
import { printResult, type OutputFormat } from "#/services/output.js";
import { requestOtp } from "#/services/auth.js";
import { networkArg, formatArg, parseNetwork, parseFormat } from "#/lib/args.js";
import { emailSchema } from "#/domain/validators.js";

function formatZodError(e: z.ZodError): string {
  return e.issues.map((issue) => issue.message).join(", ");
}

export const walletLogin = defineCommand({
  meta: {
    name: "login",
    description: "Request an OTP code be sent to your email",
  },
  args: {
    email: {
      type: "string",
      alias: ["e"],
      description: "Your email address",
      required: true,
    },
    network: networkArg,
    format: formatArg,
  },
  async run({ args }) {
    const email = String(args.email ?? "");
    const networkResult = parseNetwork(String(args.network ?? "testnet"));
    const format: OutputFormat = parseFormat(String(args.format ?? "json"));

    if (Result.isError(networkResult)) {
      printResult(Result.err(networkResult.error._tag), "json");
      return;
    }

    const validation = Result.try({
      try: () => emailSchema.parse(email),
      catch: (e: unknown) => e,
    });
    if (Result.isError(validation)) {
      const msg =
        validation.error instanceof z.ZodError
          ? formatZodError(validation.error)
          : validation.error instanceof Error
            ? validation.error.message
            : String(validation.error);
      printResult(Result.err(msg), format);
      return;
    }

    await runApp(
      "wallet login",
      async () => {
        const otpResponseResult = await requestOtp(email);
        if (Result.isError(otpResponseResult)) {
          throw new Error(`Could not reach auth server: ${otpResponseResult.error.cause}`);
        }

        const otpResponse = otpResponseResult.value;
        if (!otpResponse || !otpResponse.ok) {
          throw new Error("Failed to send OTP email");
        }

        return { message: otpResponse.message };
      },
      format,
    );
  },
});
