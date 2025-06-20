import React from "react";
import { Item } from "@/components/custom/item";
import { images } from "@/public/map/images";

type ProductionAmplifiersProps = {
  data: {
    Somersloops?: number;
    PowerShards?: number;
  };
};

export function ProductionAmplifiers({ data }: ProductionAmplifiersProps) {
  const somersloops = data.Somersloops ?? 0;
  const powerShards = data.PowerShards ?? 0;

  if (somersloops === 0 && powerShards === 0) return null;

  return (
    <div className="inline-flex gap-1 items-center justify-center w-full mt-2">
      {somersloops > 0 && (
        <Item
          icon={images.Artifacts.Somersloop}
          count={somersloops}
          color="347,82%,58%"
        />
      )}
      {powerShards > 0 && (
        <Item
          icon={images.Items.Power_Shard}
          count={powerShards}
          color="26,69%,48%"
        />
      )}
    </div>
  );
}
