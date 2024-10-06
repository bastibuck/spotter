import { api, HydrateClient } from "~/trpc/server";
import Spots from "./_components/Spots";

export default async function Home() {
  void api.spot.getAll.prefetch();

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-start bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            <span className="text-[hsl(280,100%,70%)]">Spotter</span>
          </h1>

          <p className="text-2xl text-white">
            Subscribe to spots and get notified when the wind is right.
          </p>

          <Spots />
        </div>
      </main>
    </HydrateClient>
  );
}
