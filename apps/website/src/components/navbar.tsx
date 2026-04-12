import { Terminal, Github } from "lucide-react";

export function Navbar() {
  return (
    <nav className="inner flex items-center justify-between py-6">
      <a href="/" className="flex items-center gap-2.5 no-underline">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-foreground">
          <Terminal className="h-4 w-4 text-background" strokeWidth={2.5} />
        </div>
        <span className="text-lg font-semibold tracking-tight text-foreground">stecli</span>
      </a>
      <div className="flex items-center gap-6">
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted hover:text-foreground transition-colors"
        >
          <Github className="h-5 w-5" />
        </a>
      </div>
    </nav>
  );
}
