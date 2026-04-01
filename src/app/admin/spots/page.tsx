import AdminSpotTable from "./_components/AdminSpotTable";

export default function AdminSpotsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="animate-fade-in-up text-center md:text-left">
        <h1 className="mb-4 text-4xl font-bold md:text-5xl">
          <span className="from-aqua-300 to-ocean-200 bg-linear-to-r via-white bg-clip-text text-transparent">
            Spots
          </span>
        </h1>

        <p className="text-ocean-200/80 max-w-3xl text-lg leading-relaxed md:text-left">
          Manage the live spot catalog, create new locations, and update or
          remove existing entries.
        </p>
      </div>

      <AdminSpotTable />
    </div>
  );
}
