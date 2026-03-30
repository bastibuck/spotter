import { notFound } from "next/navigation";

import AdminNav from "./_components/AdminNav";
import AdminSignInCard from "./_components/AdminSignInCard";
import { isAdminUser } from "~/server/admin";
import { getServerAuthSession } from "~/server/auth";

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerAuthSession();

  if (session === null) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-10rem)] max-w-5xl items-center justify-center px-4">
        <AdminSignInCard />
      </div>
    );
  }

  if (!(await isAdminUser(session.user.id))) {
    notFound();
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
      <div className="animate-fade-in-up text-center md:text-left">
        <div className="text-ocean-100 mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-1.5 text-xs font-semibold tracking-[0.24em] uppercase backdrop-blur-sm">
          <span className="bg-aqua-300 h-2 w-2 rounded-full shadow-[0_0_14px_rgba(103,232,249,0.9)]" />
          Private Admin
        </div>

        <p className="text-ocean-200/80 max-w-3xl text-lg leading-relaxed">
          Internal tools for reviewing incoming suggestions and maintaining the
          current spot catalog.
        </p>
      </div>

      <AdminNav />

      {children}
    </div>
  );
}
