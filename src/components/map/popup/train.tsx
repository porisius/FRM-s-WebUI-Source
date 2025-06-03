import { Train, TrainStation } from "@/types/trains";
import React from "react";
import { BoolBadge } from "@/components/map/popup";

export function train(data: Train) {
  let popup = {
    title: data.Name,
    description: (
      <div>
        <ul className="my-2 ml-6 list-disc [&>li]:mt-2">
          <li>Speed: {data.ForwardSpeed}</li>
          <li>Train Station: {data.TrainStation}</li>
        </ul>
        <BoolBadge bool={data.Derailed} text={"Derailed"} />
      </div>
    ),
  };

  return {
    popup: popup,
  };
}

export function train_station(data: TrainStation) {
  let popup = {
    title: data.Name,
    description: (
      <div>
        <ul className="my-2 ml-6 list-disc [&>li]:mt-2">
          <li>Transfer Rate: {data.TransferRate}</li>
          <li>Inflow rate: {data.InflowRate}</li>
          <li>Outflow rate: {data.OutflowRate}</li>
        </ul>
      </div>
    ),
  };

  return {
    popup: popup,
  };
}
