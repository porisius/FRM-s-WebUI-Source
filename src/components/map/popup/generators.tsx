import React from "react";
import { BoolBadge } from "@/components/map/popup";

export function generators(data: any) {
  let popup = {
    title: data["Name"],
    description: (
      <div>
        <ul className="my-2 ml-6 list-disc [&>li]:mt-2">
          <li>Base Prod: {data["BaseProd"]}MW</li>
          <li>Fuel Amount: {data["FuelAmount"]}</li>
        </ul>
        <div className={"gap-1 flex flex-col"}>
          <BoolBadge bool={data["IsFullSpeed"]} text={"Is Full Speed"} />
          <BoolBadge bool={data["CanStart"]} text={"Can Start"} />
        </div>
      </div>
    ),
  };

  return {
    popup: popup,
  };
}
