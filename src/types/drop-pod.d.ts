import {
  ClassObject,
  Features,
  FeaturesProperty,
  InventoryItem,
  LocationWithRotation,
} from "./general";

type DropPodRequiredItem = ClassObject & InventoryItem;

type DropPod = LocationWithRotation & {
  ID: string;
  Opened: boolean;
  Looted: boolean;
  RequiredItem: DropPodRequiredItem;
  RequiredPower: number;
  features: Features<FeaturesProperty<"Drop Pod", "Drop Pod">>;
};

type DropPodResponse = DropPod[];

export type { DropPod, DropPodResponse };
