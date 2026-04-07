import { Badge } from "~/components/ui/Badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/Card";

interface AdminVerificationHealthCardProps {
  totalUnverifiedSubscriptions: number;
  verificationRate: number;
}

export default function AdminVerificationHealthCard({
  totalUnverifiedSubscriptions,
  verificationRate,
}: AdminVerificationHealthCardProps) {
  return (
    <Card>
      <CardHeader className="mb-3 gap-3 md:flex md:flex-row md:items-start md:justify-between">
        <div>
          <CardTitle className="text-2xl">Verification Health</CardTitle>
          <CardDescription className="text-base">
            Pending email confirmations are kept separate from active subscriber
            metrics.
          </CardDescription>
        </div>

        <Badge variant="warning" className="self-start text-xs">
          {totalUnverifiedSubscriptions} pending
        </Badge>
      </CardHeader>

      <CardContent className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/4 p-4">
          <p className="text-ocean-200/70 text-xs font-semibold tracking-[0.24em] uppercase">
            Unverified Subscriptions
          </p>
          <p className="mt-3 text-3xl font-bold text-white">
            {totalUnverifiedSubscriptions}
          </p>
          <p className="text-ocean-200/70 mt-2 text-sm">
            Signup attempts waiting for email confirmation.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/4 p-4">
          <p className="text-ocean-200/70 text-xs font-semibold tracking-[0.24em] uppercase">
            Verification Rate
          </p>
          <p className="mt-3 text-3xl font-bold text-white">
            {verificationRate}%
          </p>
          <p className="text-ocean-200/70 mt-2 text-sm">
            Share of all subscriptions that are currently verified.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
