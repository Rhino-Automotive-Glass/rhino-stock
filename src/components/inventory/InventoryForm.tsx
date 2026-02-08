"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { InventoryFormData } from "@/types/inventory";
import { EtiquetadoSearch } from "./EtiquetadoSearch";

const initialFormData: InventoryFormData = {
  etiquetado: "",
  ubicacion: "",
  unidades: 0,
};

export function InventoryForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<InventoryFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
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
    setIsSubmitting(true);
    setSubmitSuccess(false);
    setError(null);

    try {
      const response = await fetch("/api/inventory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error al guardar el registro");
      }

      setSubmitSuccess(true);
      setFormData(initialFormData);
      router.refresh();

      // Clear success message after 3 seconds
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar el registro");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    formData.etiquetado.trim() !== "" &&
    formData.ubicacion.trim() !== "" &&
    formData.unidades > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {submitSuccess && (
        <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-green-700 dark:text-green-300 font-medium">
              Registro guardado exitosamente
            </span>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-red-600 dark:text-red-400"
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
            <span className="text-red-700 dark:text-red-300 font-medium">
              {error}
            </span>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <label
          htmlFor="etiquetado"
          className="block text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Etiquetado
        </label>
        <EtiquetadoSearch
          value={formData.etiquetado}
          onChange={handleEtiquetadoChange}
          placeholder="Ej: FW04491"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Identificador de la pieza de vidrio
        </p>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="ubicacion"
          className="block text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Ubicacion
        </label>
        <input
          type="text"
          id="ubicacion"
          name="ubicacion"
          value={formData.ubicacion}
          onChange={handleChange}
          placeholder="Ej: Rack A-12, Estante 3"
          className="input-base"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Ubicacion fisica del articulo en el almacen
        </p>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="unidades"
          className="block text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          Unidades
        </label>
        <input
          type="number"
          id="unidades"
          name="unidades"
          value={formData.unidades}
          onChange={handleChange}
          min="0"
          placeholder="0"
          className="input-base"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Cantidad de unidades disponibles
        </p>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={!isFormValid || isSubmitting}
          className="btn btn-primary btn-md w-full"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
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
            "Guardar Registro"
          )}
        </button>
      </div>
    </form>
  );
}
