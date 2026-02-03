export interface InventoryItem {
  id: string;
  etiquetado: string;
  ubicacion: string;
  unidades: number;
  confirmacion: boolean;
  etiquetado_por: string;
  ubicado_por: string;
  contado_por: string;
  confirmado_por: string | null;
  created_at: string;
  updated_at: string;
}

export interface InventoryFormData {
  etiquetado: string;
  ubicacion: string;
  unidades: number;
  confirmacion: boolean;
}

export interface InventoryCreatePayload extends InventoryFormData {
  etiquetado_por: string;
  ubicado_por: string;
  contado_por: string;
  confirmado_por: string | null;
}
