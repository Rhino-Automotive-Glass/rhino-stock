import Link from "next/link";
import { InventoryListClient } from "@/components/inventory";
import { UserMenu } from "@/components/UserMenu";
import { createClient } from "@/app/lib/supabase/server";
import { getCurrentUser } from "@/app/lib/auth/user";
import type { InventoryItem } from "@/types/inventory";

async function getInventoryAndUser(): Promise<{ items: InventoryItem[]; email: string; isAdmin: boolean; canVerify: boolean; roleName: string }> {
  try {
    const supabase = await createClient();

    const [currentUser, { data, error }] = await Promise.all([
      getCurrentUser(supabase),
      supabase
        .from("inventory")
        .select("*")
        .order("created_at", { ascending: false }),
    ]);

    if (error) {
      console.error("Error fetching inventory:", error);
      return { items: [], email: currentUser.email, isAdmin: currentUser.isAdmin, canVerify: currentUser.canVerify, roleName: currentUser.roleName };
    }

    // Admins see both counters; regular users only see their own
    const items = currentUser.isAdmin ? (data || []) : (data || []).map((item: InventoryItem) => ({
      ...item,
      unidades: item.contado_por === currentUser.email ? item.unidades : null,
      unidades_2: item.contado_por_2 === currentUser.email ? item.unidades_2 : null,
    }));

    return { items, email: currentUser.email, isAdmin: currentUser.isAdmin, canVerify: currentUser.canVerify, roleName: currentUser.roleName };
  } catch (error) {
    console.error("Error fetching inventory:", error);
    return { items: [], email: "Unknown", isAdmin: false, canVerify: false, roleName: "viewer" };
  }
}

export default async function ListaInventario() {
  const { items: inventory, email: currentUserEmail, isAdmin, canVerify, roleName } = await getInventoryAndUser();

  // Format role name for display
  const roleDisplay = roleName
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
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
            </Link>
          </div>
          <UserMenu />
        </div>
      </header>

      <div className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            Bienvenido <span className="font-semibold">{currentUserEmail}</span> - <span className="font-medium">{roleDisplay}</span>
          </p>
        </div>
      </div>

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Lista de Inventario
              </h2>
              <p className="mt-1 text-gray-600 dark:text-gray-400">
                {inventory.length} {inventory.length === 1 ? "registro" : "registros"} en total
              </p>
            </div>
            <Link
              href="/"
              className="btn btn-primary btn-md flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Agregar
            </Link>
          </div>
          <InventoryListClient initialItems={inventory} currentUserEmail={currentUserEmail} isAdmin={isAdmin} canVerify={canVerify} />
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
