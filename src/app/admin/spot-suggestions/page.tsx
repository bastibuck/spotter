import SpotSuggestionAdminTable from "./_components/SpotSuggestionAdminTable";

export default function AdminSpotSuggestionsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="animate-fade-in-up text-center md:text-left">
        <h1 className="mb-4 text-4xl font-bold md:text-5xl">
          <span className="from-aqua-300 to-ocean-200 bg-linear-to-r via-white bg-clip-text text-transparent">
            Spot Suggestions
          </span>
        </h1>

        <p className="text-ocean-200/80 max-w-3xl text-lg leading-relaxed md:text-left">
          Review incoming suggestions, clear bad entries, and create production
          spots without leaving the queue.
        </p>
      </div>

      <SpotSuggestionAdminTable initialIncludeReviewed={false} />
    </div>
  );
}
