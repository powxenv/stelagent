import { Button } from "@heroui/react";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="inner pt-20 pb-28 md:pt-36 md:pb-40">
      <div className="max-w-3xl">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1.5 text-sm text-muted">
          <span className="inline-block h-2 w-2 rounded-full bg-success" />
          Built for Stellar
        </div>

        <h1 className="text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight mb-6">
          The CLI for
          <br />
          Stellar.
        </h1>

        <p className="text-lg md:text-xl text-muted leading-relaxed max-w-xl mb-10">
          Agentic wallet, AI-native skills, and x402 micropayments — all from your terminal.
          Interact with the Stellar network like never before.
        </p>

        <div className="flex flex-wrap gap-3">
          <Button
            variant="primary"
            size="lg"
            className="font-semibold"
            onPress={() => {
              window.scrollTo({
                top: document.getElementById("get-started")?.offsetTop ?? 0,
                behavior: "smooth",
              });
            }}
          >
            Get Started
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="lg" className="font-semibold">
            View on GitHub
          </Button>
        </div>
      </div>

      <div className="mt-20 rounded-2xl border border-border bg-surface overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-3.5 border-b border-border">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-border" />
            <div className="h-3 w-3 rounded-full bg-border" />
            <div className="h-3 w-3 rounded-full bg-border" />
          </div>
          <span className="ml-2 text-xs text-muted font-mono">terminal</span>
        </div>
        <div className="p-6 font-mono text-sm leading-7">
          <div className="flex gap-3">
            <span className="text-muted select-none">$</span>
            <span>
              <span className="text-success">npx</span> @stecli/cli wallet login -e you@example.com
            </span>
          </div>
          <div className="flex gap-3">
            <span className="text-muted select-none">$</span>
            <span>
              <span className="text-success">stecli</span> wallet balance
            </span>
          </div>
          <div className="flex gap-3 opacity-70">
            <span className="text-muted select-none" />
            <span className="text-muted">
              {"{"}"ok": true, "data": {"{"}"XLM": "1248.31"{"}"}
              {"}"}
            </span>
          </div>
          <div className="flex gap-3">
            <span className="text-muted select-none">$</span>
            <span>
              <span className="text-success">stecli</span> account details GDXXX...
            </span>
          </div>
          <div className="flex gap-3">
            <span className="text-muted select-none">$</span>
            <span>
              <span className="text-success">stecli</span> pay https://api.example.com/premium
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
