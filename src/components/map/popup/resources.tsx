import { purityColors } from "@/lib/constants";
import { ResourceNode } from "@/types/resource-node";
import { Badge } from "@/components/ui/badge";
import React from "react";
import { BoolBadge } from "@/components/map/popup";

export function resources(data: ResourceNode) {
  let popup_color = purityColors[data["Purity"] as string];
  let popup = {
    title: `${data["Name"]} Resource Node`,
    description: (
      <div>
        <Badge
          style={{
            backgroundColor: `hsla(${popup_color}, 0.2)`,
            borderColor: `hsl(${popup_color})`,
            color: `hsl(${popup_color})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          className={"w-full justify-center border relative inline-flex"}
          variant={"outline"}
        >
          {data["Purity"]}
        </Badge>
        <BoolBadge bool={data["Exploited"]} text={"Exploited"} />
      </div>
    ),
  };

  return {
    popup: popup,
    popup_color: popup_color,
  };
}
