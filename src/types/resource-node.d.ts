import type {
  Features,
  FeaturesProperty,
  LocationWithRotation,
  IDClassObject,
} from "./general";
import { ResourceNodePurity, ResourceNodePurityEnum } from "@enums/resource";
import { ItemType } from "@enums/item-type";

type ResourceNode = IDClassObject &
  LocationWithRotation & {
    Purity: ResourceNodePurity;
    EnumPurity: ResourceNodePurityEnum;
    ResourceForm: ItemType;
    NodeType: string;
    Exploited: boolean;
    features: Features<FeaturesProperty<"Resource Node">>;
  };

type ResourceNodeResponse = ResourceNode[];
type ResourceWellResponse = ResourceNode[];
type ResourceGeyserResponse = ResourceNode[];

export type {
  ResourceNode,
  ResourceNodeResponse,
  ResourceWellResponse,
  ResourceGeyserResponse,
};
