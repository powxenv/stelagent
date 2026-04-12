import { Wallet, Brain, Zap, Radio } from "lucide-react";

const features = [
  {
    icon: Wallet,
    title: "Agentic Wallet",
    description:
      "Login, manage, and transact on Stellar from your terminal. OTP authentication, balance checks, and transfers — no GUI needed.",
  },
  {
    icon: Brain,
    title: "AI Skills",
    description:
      "Skill-based architecture for agent discovery and routing. MCP-ready tools that any AI agent can invoke directly.",
  },
  {
    icon: Zap,
    title: "x402 Payments",
    description:
      "Pay per API request with the HTTP 402 protocol. Micropayments on Stellar — fast, cheap, and agent-native.",
  },
  {
    icon: Radio,
    title: "Real-time Monitoring",
    description:
      "Stream transactions, payments, and effects via Horizon SSE. Watch the network live, right from your terminal.",
  },
];

export function Features() {
  return (
    <section className="inner py-28">
      <div className="mb-16">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
          Everything you need
          <br />
          to work with Stellar.
        </h2>
        <p className="text-muted text-lg max-w-lg">
          One CLI. Wallet, payments, markets, monitoring, and agent integration.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-14">
        {features.map((feature) => (
          <div key={feature.title} className="flex flex-col gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-secondary">
              <feature.icon className="h-5 w-5 text-foreground" />
            </div>
            <h3 className="text-xl font-semibold tracking-tight">{feature.title}</h3>
            <p className="text-muted leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
