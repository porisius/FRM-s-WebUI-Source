import type {
  ClassObject,
  Features,
  FeaturesProperty,
  LocationWithRotation,
  IDClassObject,
  InventoryItem,
  PowerInfo,
  BoundingBox,
  ColorSlot,
} from "./general";
import {
  TrainDockingStatus,
  type TrainLoadingMode,
  TrainLoadingStatus,
  TrainStatus,
} from "@/types/enums/train";
import { Building } from "@/types/enums/building";

type Train = IDClassObject &
  LocationWithRotation & {
    TotalMass: number;
    PayloadMass: number;
    MaxPayloadMass: number;
    ForwardSpeed: number;
    ThrottlePercent: number;
    TrainStation: string;
    Derailed: boolean;
    PendingDerail: boolean;
    Status: TrainStatus;
    TimeTableIndex: number;
    TimeTable: {
      StationName: string;
    }[];
    Vehicles: (ClassObject & {
      TotalMass: number;
      PayloadMass: number;
      MaxPayloadMass: number;
      Inventory: InventoryItem[];
    })[];
    PowerInfo: PowerInfo;
    features: Features<FeaturesProperty<"Train">>;
  };

type TrainStationCargoInventory = IDClassObject<Building.TrainDockingStation> &
  LocationWithRotation & {
    BoundingBox: BoundingBox;
    ColorSlot: ColorSlot;
    PowerInfo: PowerInfo;
    TransferRate: number;
    InflowRate: number;
    OutflowRate: number;
    LoadingMode: TrainLoadingMode;
    LoadingStatus: TrainLoadingStatus;
    DockingStatus: TrainDockingStatus;
    Inventory: InventoryItem[];
  };

type TrainStation = IDClassObject<"FGTrainStationIdentifier"> &
  LocationWithRotation & {
    BoundingBox: BoundingBox;
    ColorSlot: ColorSlot;
    TransferRate: number;
    InflowRate: number;
    OutflowRate: number;
    CargoInventory: TrainStationCargoInventory[];
    PowerInfo: PowerInfo;
    features: Features<FeaturesProperty<"Train Station">>;
  };

type TrainsResponse = Train[];
type TrainStationResponse = TrainStation[];

export type {
  TrainsResponse,
  TrainStationResponse,
  TrainStationCargoInventory,
  TrainStation,
  Train,
};
