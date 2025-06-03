import React from "react";
import { BoolBadge } from "@/components/map/popup";

export function factory(data: any) {
  let popup = {
    title: data["Name"],
    description: (
      <div>
        <ul className="my-2 ml-6 list-disc [&>li]:mt-2">
          <li>Recipe: {data["Recipe"]}</li>
          <li>Clock Speed: {Math.round(data.ManuSpeed * 100) / 100}%</li>
          <li>Productivity: {Math.round(data.Productivity * 100) / 100}%</li>
        </ul>
        <div className={"gap-1 flex flex-col"}>
          <BoolBadge
            bool={data.PowerInfo.CircuitGroupID !== -1}
            text={`Circuit Group: ${
              data.PowerInfo.CircuitGroupID === -1
                ? "Disconnected"
                : data.PowerInfo.CircuitGroupID
            }`}
            removeIcons={true}
          />
          <BoolBadge
            bool={data.PowerInfo.CircuitGroupID !== -1}
            text={`Circuit: ${
              data.PowerInfo.CircuitGroupID === -1
                ? "Disconnected"
                : data.PowerInfo.CircuitID
            }`}
            removeIcons={true}
          />
          <BoolBadge bool={data["IsConfigured"]} text={"Is Configured"} />
          <BoolBadge bool={data["IsProducing"]} text={"Is Producing"} />
          <BoolBadge bool={data["IsPaused"]} text={"Is Paused"} />
        </div>
      </div>
    ),
  };

  return {
    popup: popup,
  };
}
