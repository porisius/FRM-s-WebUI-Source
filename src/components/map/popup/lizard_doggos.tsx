import React from "react";
import { LizardDoggo } from "@/types/lizard_doggo";

export function lizard_doggos(data: LizardDoggo) {
  let popup = {
    title: data.Name,
    description: (
      <ul className="my-2 ml-6 list-disc [&>li]:mt-2">
        {data["Inventory"].map((item) => {
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
