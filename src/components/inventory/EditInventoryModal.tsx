"use client";

import { useState, useCallback } from "react";
import { createPortal } from "react-dom";
import type { InventoryItem } from "@/types/inventory";
import { EtiquetadoSearch } from "./EtiquetadoSearch";

interface EditInventoryModalProps {
  item: InventoryItem;
  onClose: () => void;
  onSave: (data: Partial<InventoryItem>) => Promise<void>;
}

export function EditInventoryModal({
  item,
  onClose,
  onSave,
}: EditInventoryModalProps) {
  const [formData, setFormData] = useState({
    etiquetado: item.etiquetado,
    ubicacion: item.ubicacion,
    unidades: item.unidades,
    confirmacion: item.confirmacion,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "number" ? parseInt(value) || 0 : value,
    }));
  };

  const handleEtiquetadoChange = useCallback(
    (code: string) => {
      setFormData((prev) => ({
        ...prev,
        etiquetado: code,
      }));
    },
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      await onSave(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setIsSaving(false);
    }
  };

  const isFormValid =
    formData.etiquetado.trim() !== "" &&
    formData.ubicacion.trim() !== "" &&
    formData.unidades > 0;

  const modalContent = (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-lg transform rounded-xl bg-white dark:bg-gray-800 shadow-xl transition-all">
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Editar Registro
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
                <span className="text-sm text-red-700 dark:text-red-300">
                  {error}
                </span>
              </div>
            )}

            <div className="space-y-2">
              <label
                htmlFor="edit-etiquetado"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Etiquetado
              </label>
              <EtiquetadoSearch
                value={formData.etiquetado}
                onChange={handleEtiquetadoChange}
                placeholder="Ej: FW04491"
                id="edit-etiquetado"
                name="edit-etiquetado"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="edit-ubicacion"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Ubicacion
              </label>
              <input
                type="text"
                id="edit-ubicacion"
                name="ubicacion"
                value={formData.ubicacion}
                onChange={handleChange}
                className="input-base"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="edit-unidades"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Unidades
              </label>
              <input
                type="number"
                id="edit-unidades"
                name="unidades"
                value={formData.unidades}
                onChange={handleChange}
                min="0"
                className="input-base"
              />
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50">
              <input
                type="checkbox"
                id="edit-confirmacion"
                name="confirmacion"
                checked={formData.confirmacion}
                onChange={handleChange}
                className="mt-1 w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 focus:ring-2 cursor-pointer"
              />
              <div>
                <label
                  htmlFor="edit-confirmacion"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200 cursor-pointer"
                >
                  Confirmacion
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Marque esta casilla para confirmar la verificacion
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={!isFormValid || isSaving}
                className="btn btn-primary btn-md"
              >
                {isSaving ? (
                  <div className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4 text-white"
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
                    <span>Guardando...</span>
                  </div>
                ) : (
                  "Guardar Cambios"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  if (typeof document === "undefined") return null;

  return createPortal(modalContent, document.body);
}
