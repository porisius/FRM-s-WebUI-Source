import type {
  ClassObject,
  Features,
  FeaturesProperty,
  IDClassObject,
  InventoryItem,
  LocationWithRotation,
} from "./general";
import type { Building } from "@/types/enums/building";

type SpaceElevatorPhaseItem = InventoryItem &
  ClassObject & {
    RemainingCost: number;
    TotalCost: number;
  };

type SpaceElevator = IDClassObject<Building.SpaceElevator> &
  LocationWithRotation & {
    CurrentPhase: SpaceElevatorPhaseItem[];
    FullyUpgraded: boolean;
    UpgradeReady: boolean;
    features: Features<FeaturesProperty<"Space Elevator", "Space Elevator">>;
  };

type SpaceElevatorResponse = SpaceElevator[];

export { SpaceElevatorPhaseItemObject, SpaceElevator, SpaceElevatorResponse };
