import React from "react";
import { Separator } from "@/components/ui/separator";
import { TruckStation, Vehicles } from "@/types/vehicles";
import { BoolBadge } from "../popup";

export function vehicles(data: Vehicles) {
  let popup = {
    title: data.Name,
    description: (
      <div>
        <ul className="ml-6 list-disc [&>li]:mt-2">
          <li>Current Gear: {data.CurrentGear}</li>
          <li>Forward Speed: {data.ForwardSpeed}</li>
          <li>Engine RPM: {data.EngineRPM}</li>
          <li>Throttle Percent: {data.ThrottlePercent}</li>
          <li>Path Name: {data.PathName}</li>
        </ul>
        <Separator className={"my-2 bg-white"} />
        <div className={"flex flex-col gap-1"}>
          <BoolBadge bool={data.FollowingPath} text={"Following Path"} />
          <BoolBadge bool={data.Autopilot} text={"Autopilot"} />
        </div>
      </div>
    ),
  };

  return {
    popup: popup,
  };
}

export function truck_station(data: TruckStation) {
  let popup = {
    title: data.Name,
    description: (
      <div>
        <p>LoadMode: WIP</p>
      </div>
    ),
  };

  return {
    popup: popup,
  };
}
