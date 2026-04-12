import { Button } from "@heroui/react";
import { ArrowRight } from "lucide-react";

export function GetStarted() {
  return (
    <section id="get-started" className="inner py-28">
      <div className="max-w-2xl">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
          Get started in seconds.
        </h2>
        <p className="text-muted text-lg leading-relaxed mb-10">
          No install required. Run it directly with npx. Always the latest version.
        </p>

        <div className="rounded-xl border border-border bg-surface p-5 mb-8">
          <code className="text-sm md:text-base font-mono">
            <span className="text-muted">$</span> <span className="text-success">npx</span>{" "}
            @stecli/cli wallet login -e you@example.com
          </code>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button variant="primary" size="lg" className="font-semibold">
            Read the Docs
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="lg" className="font-semibold">
            View on GitHub
          </Button>
        </div>
      </div>
    </section>
  );
}
