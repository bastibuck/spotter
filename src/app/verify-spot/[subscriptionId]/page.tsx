import Link from "next/link";
import { redirect } from "next/navigation";
import { api } from "~/trpc/server";

const VerifySubscriptionPage = async ({
  params,
}: {
  params: { subscriptionId: string };
}) => {
  const subscription = await api.subscription.get({
    id: params.subscriptionId,
  });

  if (!subscription) {
    return redirect("/404"); // TODO! add more specific error handling
  }

  await api.subscription.verify({ subscriptionId: params.subscriptionId });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">
        Subscription to {subscription.spot.name} verified
      </h1>

      <Link href={`/`}>Back to home</Link>
    </div>
  );
};

export default VerifySubscriptionPage;