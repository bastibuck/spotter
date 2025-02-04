import Link from "next/link";
import MySpotsForm from "./_components/MySpotsForm";

export default function MySpots() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start bg-linear-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="absolute top-4 left-4">
        <Link href="/">← Back</Link>
      </div>

      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          <span className="text-[hsl(280,100%,70%)]">My spots</span>
        </h1>

        <p className="text-2xl text-white">
          Enter your email to receive an email with all your spots.
        </p>

        <MySpotsForm />
      </div>
    </main>
  );
}
