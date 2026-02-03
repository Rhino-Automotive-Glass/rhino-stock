-- Create inventory table for storing glass inventory items
CREATE TABLE public.inventory (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  etiquetado TEXT NOT NULL,
  ubicacion TEXT NOT NULL,
  unidades INTEGER NOT NULL DEFAULT 0,
  confirmacion BOOLEAN NOT NULL DEFAULT false,
  etiquetado_por TEXT NOT NULL,
  ubicado_por TEXT NOT NULL,
  contado_por TEXT NOT NULL,
  confirmado_por TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups by etiquetado
CREATE INDEX idx_inventory_etiquetado ON public.inventory(etiquetado);

-- Create index for faster lookups by ubicacion
CREATE INDEX idx_inventory_ubicacion ON public.inventory(ubicacion);

-- Create indexes for user tracking fields
CREATE INDEX idx_inventory_etiquetado_por ON public.inventory(etiquetado_por);
CREATE INDEX idx_inventory_ubicado_por ON public.inventory(ubicado_por);
CREATE INDEX idx_inventory_contado_por ON public.inventory(contado_por);
CREATE INDEX idx_inventory_confirmado_por ON public.inventory(confirmado_por);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_inventory_updated_at
  BEFORE UPDATE ON public.inventory
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (optional - uncomment if you want auth-based access)
-- ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;

-- RLS Policy for public access (for now, allowing all operations)
-- Uncomment and modify these if you add authentication later
-- CREATE POLICY "Allow all access to inventory"
--   ON public.inventory
--   FOR ALL
--   USING (true)
--   WITH CHECK (true);
