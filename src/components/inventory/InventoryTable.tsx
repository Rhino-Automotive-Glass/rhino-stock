"use client";

import { useState } from "react";
import type { InventoryItem } from "@/types/inventory";
import { EditInventoryModal } from "./EditInventoryModal";

interface InventoryTableProps {
  items: InventoryItem[];
  currentUserEmail: string;
  isAdmin?: boolean;
  canVerify?: boolean;
  onUpdate: (id: string, data: Partial<InventoryItem>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onToggleVerified: (id: string, verified: boolean) => Promise<void>;
}

export function InventoryTable({
  items,
  currentUserEmail,
  isAdmin,
  canVerify,
  onUpdate,
  onDelete,
  onToggleVerified,
}: InventoryTableProps) {
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [verifyingIds, setVerifyingIds] = useState<string[]>([]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Está seguro que desea eliminar este registro?")) {
      setDeletingId(id);
      try {
        await onDelete(id);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleSaveEdit = async (data: Partial<InventoryItem>) => {
    if (editingItem) {
      await onUpdate(editingItem.id, data);
      setEditingItem(null);
    }
  };

  const handleVerifyToggle = async (id: string, verified: boolean) => {
    if (verifyingIds.includes(id)) return;

    setVerifyingIds((prev) => [...prev, id]);
    try {
      await onToggleVerified(id, verified);
    } finally {
      setVerifyingIds((prev) => prev.filter((verifyingId) => verifyingId !== id));
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
          No hay registros
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Comienza agregando un nuevo registro de inventario.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Etiquetado
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Ubicacion
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Unidades
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Verified
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Responsables
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Fecha
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {items.map((item) => {
              const hasBothCounts = item.unidades != null && item.unidades_2 != null;
              const hasCountMismatch = hasBothCounts && item.unidades !== item.unidades_2;

              return (
              <tr
                key={item.id}
                className={`transition-colors ${
                  hasCountMismatch
                    ? "bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30"
                    : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {item.etiquetado}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {item.ubicacion}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {isAdmin ? (
                    <div className="flex items-center justify-center gap-1.5">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200">
                        {item.unidades ?? "—"}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200">
                        {item.unidades_2 ?? "—"}
                      </span>
                      {hasCountMismatch && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300">
                          ‼️
                        </span>
                      )}
                    </div>
                  ) : item.unidades != null ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200">
                      {item.unidades}
                    </span>
                  ) : item.unidades_2 != null ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200">
                      {item.unidades_2}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      —
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {verifyingIds.includes(item.id) ? (
                    <div className="inline-flex items-center justify-center h-5 w-5">
                      <svg
                        className="animate-spin h-5 w-5 text-blue-600 dark:text-blue-400"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        aria-label="Updating verification"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        />
                      </svg>
                    </div>
                  ) : (
                    <input
                      type="checkbox"
                      checked={!!item.confirmado_por}
                      onChange={(e) => handleVerifyToggle(item.id, e.target.checked)}
                      disabled={!canVerify}
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      aria-label="Mark as verified"
                    />
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-gray-500 dark:text-gray-400">Etiquetado:</span>
                      <span className="font-medium text-gray-700 dark:text-gray-200">
                        {item.etiquetado_por}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-gray-500 dark:text-gray-400">Ubicado:</span>
                      <span className="font-medium text-gray-700 dark:text-gray-200">
                        {item.ubicado_por}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-gray-500 dark:text-gray-400">Contado:</span>
                      <span className="font-medium text-gray-700 dark:text-gray-200">
                        {item.contado_por}
                      </span>
                    </div>
                    {item.contado_por_2 && (
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-gray-500 dark:text-gray-400">Contado 2:</span>
                        <span className="font-medium text-gray-700 dark:text-gray-200">
                          {item.contado_por_2}
                        </span>
                      </div>
                    )}
                    {item.confirmado_por && (
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-gray-500 dark:text-gray-400">Confirmado:</span>
                        <span className="font-medium text-green-600 dark:text-green-400">
                          {item.confirmado_por}
                        </span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(item.created_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setEditingItem(item)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                      aria-label="Edit item"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={deletingId === item.id}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors disabled:opacity-50"
                      aria-label="Delete item"
                    >
                      {deletingId === item.id ? (
                        <svg
                          className="animate-spin h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            );
            })}
          </tbody>
        </table>
      </div>

      {editingItem && (
        <EditInventoryModal
          item={editingItem}
          isCreator={editingItem.contado_por === currentUserEmail}
          onClose={() => setEditingItem(null)}
          onSave={handleSaveEdit}
        />
      )}
    </>
  );
}
