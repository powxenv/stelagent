"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

const AGENT_PROMPT = "Read http://stecli.noval.me/AGENTS.md, then set it up for me.";

export function Hero() {
  return (
    <section className="inner pt-24 pb-28 md:pt-40 md:pb-40">
      <div className="max-w-3xl">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1.5 text-sm text-muted">
          <span className="inline-block h-2 w-2 rounded-full bg-success" />
          AI agent–ready
        </div>

        <h1 className="text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight mb-6">
          The agent-first CLI
          <br />
          for Stellar.
        </h1>

        <p className="text-lg md:text-xl text-muted leading-relaxed max-w-xl mb-10">
          Wallet, payments, markets, monitoring. All structured as agent skills. Point any AI at
          stecli and it knows what to do.
        </p>
      </div>

      <div className="mb-12">
        <p className="text-sm text-muted mb-3 font-medium">
          Copy this prompt. Paste it into any AI agent.
        </p>
        <CopyablePrompt />
      </div>

      <div className="rounded-2xl border border-border bg-surface overflow-hidden">
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
              <span className="text-success">npx</span> stecli wallet login -e you@example.com
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

function CopyablePrompt() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(AGENT_PROMPT);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = AGENT_PROMPT;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="group relative w-full cursor-pointer rounded-xl border border-border bg-surface-secondary text-left transition-colors hover:bg-surface-tertiary"
    >
      <div className="flex items-start gap-3 p-5">
        <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded bg-background">
          {copied ? (
            <Check className="h-3.5 w-3.5 text-success" />
          ) : (
            <Copy className="h-3.5 w-3.5 text-muted group-hover:text-foreground transition-colors" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-mono text-sm md:text-base text-foreground leading-relaxed break-words">
            {AGENT_PROMPT}
          </p>
          <p className="text-xs text-muted mt-1.5">
            {copied ? "Copied to clipboard" : "Click to copy"}
          </p>
        </div>
      </div>
    </button>
  );
}
