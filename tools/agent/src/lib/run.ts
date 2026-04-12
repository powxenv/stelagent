import { Effect } from "effect";
import { AppLive } from "#/layers/app-layer.js";

export function runApp<A, E, R>(program: Effect.Effect<A, E, R>): Promise<A> {
  return Effect.runPromise(Effect.provide(program, AppLive) as Effect.Effect<A, E, never>);
}
