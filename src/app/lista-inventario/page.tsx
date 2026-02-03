import Link from "next/link";
import { ThemeToggle } from "@/components/theme";
import { InventoryListClient } from "@/components/inventory";
import { createClient } from "@/app/lib/supabase/server";
import type { InventoryItem } from "@/types/inventory";

async function getInventory(): Promise<InventoryItem[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("inventory")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching inventory:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching inventory:", error);
    return [];
  }
}

export default async function ListaInventario() {
  const inventory = await getInventory();

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
          <ThemeToggle />
        </div>
      </header>

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
          <InventoryListClient initialItems={inventory} />
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
