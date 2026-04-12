import { Terminal } from "lucide-react";

export function Footer() {
  return (
    <footer className="inner py-8 border-t border-border">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-surface-secondary">
            <Terminal className="h-3 w-3 text-foreground" />
          </div>
          <span className="text-sm text-muted">stecli — Agent-first CLI for Stellar</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-muted">
          <a
            href="https://stellar.org"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            Stellar
          </a>
          <a
            href="https://developers.stellar.org"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            Horizon API
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
