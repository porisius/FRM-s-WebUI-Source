import type {
  Features,
  IDClassObject,
  InventoryItem,
  LocationWithRotation,
  PowerInfo,
} from "./general";
import type { VehicleType } from "@/types/enums/vehicle";

type Vehicles<Type extends VehicleType = VehicleType> = IDClassObject<Type> &
  LocationWithRotation & {
    PathName: string;
    Status: string; // TODO enum
    CurrentGear: number;
    ForwardSpeed: number;
    EngineRPM: number;
    ThrottlePercent: number;
    Airborne: boolean;
    FollowingPath: boolean;
    Autopilot: boolean;
    Inventory: InventoryItem[];
    FuelInventory: InventoryItem[];
  };

type TruckStation = IDClassObject &
  LocationWithRotation & {
    PathName: string;
    DockVehicleCount: number;
    LoadMode: string; // TODO enum
    TransferRate: number;
    MaxTransferRate: number;
    StationStatus: string; // TODO enum
    FuelRate: number;
    Inventory: InventoryItem[];
    FuelInventory: InventoryItem[];
    PowerInfo: PowerInfo;
    features: Features;
  };

type TruckResponse = Vehicles<VehicleType.Truck>[];
type TractorResponse = Vehicles<VehicleType.Tractor>[];
type ExplorerResponse = Vehicles<VehicleType.Explorer>[];
type FactoryCartResponse = Vehicles<VehicleType.FactoryCart>[];
type VehiclesResponse = Vehicles[];
type PathsResponse = unknown[];
type TruckStationResponse = TruckStation[];

export type {
  Vehicles,
  TruckStation,
  TruckResponse,
  TractorResponse,
  ExplorerResponse,
  FactoryCartResponse,
  VehiclesResponse,
  PathsResponse,
  TruckStationResponse,
};
