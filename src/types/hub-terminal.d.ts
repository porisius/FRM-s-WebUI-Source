import type {
  Features,
  LocationWithRotation,
  IDClassObject,
  InventoryItem,
  IDBoundingColorSlotBoxClassObject,
} from "./general";
import type { Building } from "@enums/building";
import type { RecipeObject } from "./recipe";

type HubTerminalActiveMilestone = IDClassObject & {
  TechTier: number;
  Type: "No Milestone Selected" | "Milestone";
  Recipes: RecipeObject[];
  Cost: (InventoryItem & {
    RemainingCost: number;
    TotalCost: number;
  })[];
};

type HubTerminal = IDBoundingColorSlotBoxClassObject<Building.Hub> &
  LocationWithRotation & {
    HasActiveMilestone: boolean;
    ActiveMilestone: HubTerminalActiveMilestone;
    ShipDock: boolean;
    SchNam: "N/A" | string;
    ShipReturn: `${number}:${number}:${number}`;
    features: Features;
  };

type HubTerminalResponse = HubTerminal[];

export type { HubTerminalActiveMilestone, HubTerminal, HubTerminalResponse };
