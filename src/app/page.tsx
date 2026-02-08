import Link from "next/link";
import { InventoryForm } from "@/components/inventory";
import { UserMenu } from "@/components/UserMenu";
import { createClient } from "@/app/lib/supabase/server";
import { getCurrentUser } from "@/app/lib/auth/user";

export default async function Home() {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);

  // Format role name for display
  const roleDisplay = user.roleName
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Rhino Stock
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Sistema de Inventario
              </p>
            </div>
          </div>
          <UserMenu />
        </div>
      </header>

      <div className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            Bienvenido <span className="font-semibold">{user.email}</span> - <span className="font-medium">{roleDisplay}</span>
          </p>
        </div>
      </div>

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Registro de Inventario
            </h2>
            <Link
              href="/lista-inventario"
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-2 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 10h16M4 14h16M4 18h16"
                />
              </svg>
              Ver Inventario
            </Link>
          </div>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Complete los siguientes campos para registrar una pieza de vidrio automotriz
          </p>
          <hr className="mt-4 border-gray-200 dark:border-gray-700" />
        </div>
        <div className="card p-6 md:p-8">
          <InventoryForm />
        </div>
      </main>

      <footer className="border-t border-gray-200 dark:border-gray-700 mt-auto">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Rhino Stock - Gestion de Inventario
          </p>
        </div>
      </footer>
    </div>
  );
}
