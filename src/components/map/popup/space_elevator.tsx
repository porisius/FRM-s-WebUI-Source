import { colors } from "@/lib/constants";
import React from "react";
import { SpaceElevator } from "@/types/space-elevator";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";

export function space_elevator(data: SpaceElevator) {
  let fully_upgraded_color = data.FullyUpgraded ? colors.green : colors.red;
  let upgrade_ready_color = data.UpgradeReady ? colors.green : colors.red;

  let popup_color =
    data.FullyUpgraded || data.UpgradeReady ? colors.green : colors.red;
  let popup = {
    title: data.Name,
    description: (
      <div>
        <ul className="ml-6 list-disc [&>li]:mt-2">
          {data.CurrentPhase.map((item) => (
            <li key={item.ClassName + data["ID"]}>
              {item.Name} {item.Amount}/{item.TotalCost}
            </li>
          ))}
        </ul>
        <div className={"flex flex-col gap-1"}>
          <Badge
            style={{
              backgroundColor: `hsla(${fully_upgraded_color}, 0.2)`,
              borderColor: `hsl(${fully_upgraded_color})`,
              color: `hsl(${fully_upgraded_color})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            className={"w-full justify-center border relative inline-flex"}
            variant={"outline"}
          >
            {data.FullyUpgraded ? (
              <Check className="size-4 absolute left-[5px]" />
            ) : (
              <X className="size-4 absolute left-[5px]" />
            )}
            {data.FullyUpgraded ? "Fully Upgraded 🎉" : "Not Fully Upgraded"}
          </Badge>
          <Badge
            style={{
              backgroundColor: `hsla(${upgrade_ready_color}, 0.2)`,
              borderColor: `hsl(${upgrade_ready_color})`,
              color: `hsl(${upgrade_ready_color})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            className={"w-full justify-center border relative inline-flex"}
            variant={"outline"}
          >
            {data.UpgradeReady ? (
              <Check className="size-4 absolute left-[5px]" />
            ) : (
              <X className="size-4 absolute left-[5px]" />
            )}
            {data.UpgradeReady ? "Upgrade Ready" : "Upgrade Not Ready"}
          </Badge>
        </div>
      </div>
    ),
  };

  return {
    popup: popup,
    popup_color: popup_color,
  };
}
