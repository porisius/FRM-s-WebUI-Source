import React from "react";
import { PowerSlugs } from "@/types/power-slug";
import { classNameColors } from "@/lib/constants";

export function slugs(data: PowerSlugs) {
  let popup_color =
    classNameColors[data.ClassName as keyof typeof classNameColors] ??
    "229deg,13%,52%";
  let popup = {
    title: (
      <div>
        {
          {
            BP_Crystal_C: "MK1",
            BP_Crystal_mk2_C: "MK2",
            BP_Crystal_mk3_C: "MK3",
          }[data.ClassName as string]
        }
        {" Power Slug"}
      </div>
    ),
  };

  return {
    popup: popup,
    popup_color: popup_color,
  };
}
