import type {
  Features,
  FeaturesProperty,
  IDBoundingColorSlotBoxClassObject,
  Item,
  LocationWithRotation,
} from "./general";
import type { Building } from "@/enums//building";
import type { ResourceNode } from "./resource-node";

type RadarTower = IDBoundingColorSlotBoxClassObject<Building.RadarTower> &
  LocationWithRotation & {
    RevealRadius: number;
    RevealType: "FOWRT_StaticNoGradient";
    Fauna: Item[];
    Signal: Item[];
    Flora: Item[];
    ScannedResourceNodes: Omit<ResourceNode, "features">[];
    features: Features<FeaturesProperty<"Radar Tower", "Radar Tower">>;
  };

type RadarTowerResponse = RadarTower[];

export type { RadarTower, RadarTowerResponse };
