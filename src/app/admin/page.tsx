import AdminOverviewStatCard from "./_components/AdminOverviewStatCard";
import AdminSpotRankingCard from "./_components/AdminSpotRankingCard";
import AdminVerificationHealthCard from "./_components/AdminVerificationHealthCard";
import AdminZeroSubscriberCard from "./_components/AdminZeroSubscriberCard";
import { getAdminOverviewStats } from "~/server/adminStats";

function formatDecimal(value: number): string {
  return value.toFixed(1);
}

export default async function AdminIndexPage() {
  const stats = await getAdminOverviewStats();

  return (
    <div className="flex flex-col gap-8">
      <div className="animate-fade-in-up text-center md:text-left">
        <h1 className="mb-4 text-4xl font-bold md:text-5xl">
          <span className="from-aqua-300 to-ocean-200 bg-linear-to-r via-white bg-clip-text text-transparent">
            Overview
          </span>
        </h1>

        <p className="text-ocean-200/80 max-w-3xl text-lg leading-relaxed md:text-left">
          Quick snapshot of subscriber health and spot demand across all live
          spots.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminOverviewStatCard
          label="Verified Subscriptions"
          value={stats.totalVerifiedSubscriptions.toString()}
          description="Currently active verified subscriptions."
        />
        <AdminOverviewStatCard
          label="Unique Kiters"
          value={stats.uniqueKiters.toString()}
          description="Distinct kiters with at least one verified subscription."
        />
        <AdminOverviewStatCard
          label="Avg / Kiter"
          value={formatDecimal(stats.averageSubscriptionsPerKiter)}
          description="Average verified subscriptions per active kiter."
        />
        <AdminOverviewStatCard
          label="Median / Kiter"
          value={stats.medianSubscriptionsPerKiter.toString()}
          description="Middle verified portfolio size across active kiters."
        />
      </div>

      <AdminVerificationHealthCard
        totalUnverifiedSubscriptions={stats.totalUnverifiedSubscriptions}
        verificationRate={stats.verificationRate}
      />

      <section className="space-y-4">
        <div className="animate-fade-in-up text-center md:text-left">
          <h2 className="text-3xl font-bold text-white">Spot Distribution</h2>
          <p className="text-ocean-200/80 mt-2 max-w-3xl text-base leading-relaxed">
            A quick look at where subscriber demand is concentrated and which
            spots still need attention.
          </p>
        </div>

        <div className="grid gap-4 xl:grid-cols-3">
          <AdminSpotRankingCard
            title="Top Spots"
            description="Most followed spots right now."
            emptyMessage="No verified subscriptions yet, so there are no top spots to rank."
            spots={stats.topSpots}
          />
          <AdminSpotRankingCard
            title="Least Subscribed"
            description="Lowest demand among spots that already have at least one verified subscriber."
            emptyMessage="No active spots with verified subscribers yet."
            spots={stats.leastSubscribedSpots}
          />
          <AdminZeroSubscriberCard spots={stats.zeroSubscriberSpots} />
        </div>
      </section>
    </div>
  );
}
