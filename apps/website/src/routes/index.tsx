import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "#/components/navbar";
import { Hero } from "#/components/hero";
import { Features } from "#/components/features";
import { Commands } from "#/components/commands";
import { GetStarted } from "#/components/get-started";
import { Footer } from "#/components/footer";
import { Divider } from "#/components/divider";

export const Route = createFileRoute("/")({ component: App });

function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Divider />
      <Features />
      <Divider />
      <Commands />
      <Divider />
      <GetStarted />
      <Footer />
    </div>
  );
}
