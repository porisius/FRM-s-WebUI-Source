import type {
  Features,
  FeaturesProperty,
  IDClassObject,
  InventoryItem,
  LocationWithRotation,
} from "./general";

type Player = IDClassObject<"Char_Player_C"> &
  LocationWithRotation & {
    Online: boolean;
    PlayerHP: number;
    Dead: boolean;
    Inventory: InventoryItem[];
    features: Features<FeaturesProperty<"Player">>;
  };

type PlayerResponse = Player[];

export type { PlayerResponse, Player };
