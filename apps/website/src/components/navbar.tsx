import { StecliLogo } from "./logo";

export function Navbar() {
  return (
    <nav className="inner flex items-center justify-between py-6">
      <div className="flex items-center gap-2.5">
        <StecliLogo className="h-8 w-8" />
        <span className="text-lg font-semibold tracking-tight text-foreground">stecli</span>
      </div>
      <div className="flex items-center gap-6 text-sm text-muted">
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground transition-colors"
        >
          GitHub
        </a>
        <a
          href="https://developers.stellar.org"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground transition-colors"
        >
          Stellar Docs
        </a>
      </div>
    </nav>
  );
}
