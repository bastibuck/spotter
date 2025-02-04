import Spots from "./_components/Spots";

export const revalidate = 3600; // revalidate every hour

export default function SpotsPage() {
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
