-- Add second counter for dual-blind counting
-- unidades_2: second person's count (set by the editor)
-- contado_por_2: who provided the second count
ALTER TABLE public.inventory
  ADD COLUMN unidades_2 INTEGER DEFAULT NULL,
  ADD COLUMN contado_por_2 TEXT DEFAULT NULL;

-- Create index for the new user tracking field
CREATE INDEX idx_inventory_contado_por_2 ON public.inventory(contado_por_2);
