"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function AdminSignOut() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
    >
      <LogOut size={16} />
      Sair
    </button>
  );
}
