import Link from "next/link";
import { redirect } from "next/navigation";
import { api } from "~/trpc/server";

const VerifySubscriptionPage = async (
  props: {
    params: Promise<{ subscriptionId: string }>;
  }
) => {
  const params = await props.params;
  const name = api.subscription
    .verify({ subscriptionId: params.subscriptionId })
    .then((res) => res.name)
    .catch(() => {
      redirect("/404");
    });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Subscription to {name} verified</h1>

      <Link href={`/`}>Back to home</Link>
    </div>
  );
};

export default VerifySubscriptionPage;
