export interface InventoryItem {
  id: string;
  etiquetado: string;
  ubicacion: string;
  unidades: number | null;
  unidades_2: number | null;
  etiquetado_por: string;
  ubicado_por: string;
  contado_por: string;
  contado_por_2: string | null;
  confirmado_por: string | null;
  created_at: string;
  updated_at: string;
}

export interface InventoryFormData {
  etiquetado: string;
  ubicacion: string;
  unidades: number;
}
