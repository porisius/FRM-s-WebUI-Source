import { BoolBadge } from "@/components/map/popup";
import React from "react";
import { Drone, DroneStation } from "@/types/drone";

export function drone(data: Drone) {
  let popup = {
    title: data.Name,
    description: (
      <div>
        <p>Destination: {data.CurrentDestination}</p>
        <p>Flying Speed: {Math.round(data.FlyingSpeed)}</p>
        <BoolBadge bool={Math.round(data.FlyingSpeed) > 0} text={"Flying"} />
      </div>
    ),
  };

  return {
    popup: popup,
  };
}

export function drone_station(data: DroneStation) {
  let popup = {
    title: data["Name"],
    description: <p> Paired Station: {data.PairedStation}</p>,
  };

  return {
    popup: popup,
  };
}
