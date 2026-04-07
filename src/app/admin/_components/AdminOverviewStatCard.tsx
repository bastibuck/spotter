import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/Card";

interface AdminOverviewStatCardProps {
  label: string;
  value: string;
  description: string;
}

export default function AdminOverviewStatCard({
  label,
  value,
  description,
}: AdminOverviewStatCardProps) {
  return (
    <Card>
      <CardHeader className="mb-3">
        <p className="text-ocean-200/70 text-xs font-semibold tracking-[0.24em] uppercase">
          {label}
        </p>
      </CardHeader>
      <CardContent className="space-y-2">
        <CardTitle className="text-4xl font-bold tracking-tight">
          {value}
        </CardTitle>
        <CardDescription className="mt-0 text-sm leading-relaxed">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}
