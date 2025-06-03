import React from "react";
import { BoolBadge } from "@/components/map/popup";
import { HubTerminal } from "@/types/hub-terminal";

export function hub(data: HubTerminal) {
  let popup = {
    title: data.Name,
    description: (
      <div>
        <ul className="my-2 ml-6 list-disc [&>li]:mt-2">
          <li>Current Active Schematic: {data.SchNam}</li>
          <li>Time till Drone Ship returns: {data.ShipReturn}</li>
        </ul>
        <div className={"gap-1 flex flex-col"}>
          <BoolBadge bool={data.ShipDock} text={"Is Drone Ship in HUB"} />
        </div>
      </div>
    ),
  };

  return {
    popup: popup,
  };
}
