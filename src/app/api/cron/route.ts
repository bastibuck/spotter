export const dynamic = "force-dynamic"; // static by default, unless reading the request

export const GET = async (request: Request) => {
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  const now = new Date();

  return new Response(`Cron ran at ${now.toDateString()}`);
};
