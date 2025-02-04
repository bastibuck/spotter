import Link from "next/link";
import { redirect } from "next/navigation";
import { api } from "~/trpc/server";

const UnsubscribeAllSpotsPage = async (props: {
  params: Promise<{ kiterId: string }>;
}) => {
  const params = await props.params;
  const deletions = api.subscription
    .unsubscribeAll({
      kiterId: params.kiterId,
    })
    .then((res) => res)
    .catch(() => {
      redirect("/404");
    });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">{deletions} subscriptions removed</h1>

      <Link href={`/`}>Back to home</Link>
    </div>
  );
};

export default UnsubscribeAllSpotsPage;
