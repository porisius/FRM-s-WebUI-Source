import { InventoryItem } from "@/types/general";
import React from "react";

export function storage_inv(data: any) {
  let popup = {
    title: data["Name"],
    description: (
      <ul className="my-2 ml-6 list-disc [&>li]:mt-2">
        {data["Inventory"].map((item: InventoryItem) => {
          return (
            <li key={item.Name + item.ClassName + item.Amount}>
              {item.Name} - {item.Amount}
            </li>
          );
        })}
      </ul>
    ),
  };

  return {
    popup: popup,
  };
}
