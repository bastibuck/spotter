import Spots from "./_components/Spots";

export default function Home() {
  return (
    <>
      <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
        <span className="text-[hsl(280,100%,70%)]">Spotter</span>
      </h1>

      <p className="text-2xl text-white">
        Subscribe to spots and get notified when the wind is right.
      </p>

      <Spots />
    </>
  );
}
