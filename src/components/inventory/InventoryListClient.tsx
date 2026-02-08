"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { InventoryItem } from "@/types/inventory";
import { InventoryTable } from "./InventoryTable";

interface InventoryListClientProps {
  initialItems: InventoryItem[];
  currentUserEmail: string;
  isAdmin?: boolean;
  canVerify?: boolean;
}

export function InventoryListClient({ initialItems, currentUserEmail, isAdmin, canVerify }: InventoryListClientProps) {
  const router = useRouter();
  const [items, setItems] = useState<InventoryItem[]>(initialItems);

  const handleUpdate = async (id: string, data: Partial<InventoryItem>) => {
    const response = await fetch(`/api/inventory/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Error updating item");
    }

    const updatedItem = await response.json();
    setItems((prev) =>
      prev.map((item) => (item.id === id ? updatedItem : item))
    );
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    const response = await fetch(`/api/inventory/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Error deleting item");
    }

    setItems((prev) => prev.filter((item) => item.id !== id));
    router.refresh();
  };

  const handleToggleVerified = async (id: string, verified: boolean) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;

    await handleUpdate(id, {
      confirmado_por: verified ? "pending" : null,
    });
  };

  return (
    <InventoryTable
      items={items}
      currentUserEmail={currentUserEmail}
      isAdmin={isAdmin}
      canVerify={canVerify}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
      onToggleVerified={handleToggleVerified}
    />
  );
}
