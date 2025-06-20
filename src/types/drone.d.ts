import type {
  Features,
  FeaturesProperty,
  IDClassObject,
  InventoryItem,
  LocationWithRotation,
  PowerInfo,
} from "./general";
import { CurrentFlyingMode } from "@/enums/drone";

type Drone = IDClassObject &
  LocationWithRotation & {
    HomeStation: string;
    PairedStation: string;
    HasPairedStation: boolean;
    CurrentDestination: string;
    FlyingSpeed: number;
    MaxSpeed: number;
    CurrentFlyingMode: CurrentFlyingMode;
    features: Features<FeaturesProperty<"Drone", "Drone">>;
  };

type DroneStation = IDClassObject &
  LocationWithRotation & {
    InputInventory: InventoryItem[];
    OutputInventory: InventoryItem[];
    FuelInventory: InventoryItem[];
    PairedStation: string;
    DroneStatus: string;
    AvgIncRate: number;
    AvgIncStack: number;
    AvgOutRate: number;
    AvgOutStack: number;
    AvgRndTrip: string;
    AvgTotalIncRate: number;
    AvgTotalIncStack: number;
    AvgTotalOutRate: number;
    AvgTotalOutStack: number;
    AvgTripIncAmt: number;
    AvgTripOutAmt: number;
    EstTotalTransRate: number;
    EstLatestTotalIncStack: number;
    EstLatestTotalOutStack: number;
    LatestIncStack: number;
    LatestOutStack: number;
    LatestRndTrip: number;
    LatestTripIncAmt: number;
    LatestTripOutAmt: number;
    MedianRndTrip: string;
    MedianTripIncAmt: number;
    MedianTripOutAmt: number;
    ActiveFuel: {
      FuelName: string;
      SingleTripFuelCost: number;
      EstimatedTransportRate: number;
      EstimatedRoundTripTime: number;
      EstimatedFuelCostRate: number;
    };
    FuelInfo: {
      FuelName: string;
      SingleTripFuelCost: number;
      EstimatedTransportRate: number;
      EstimatedRoundTripTime: number;
      EstimatedFuelCostRate: number;
    }[];
    PowerInfo: PowerInfo;
    features: Features<FeaturesProperty<"Drone Port", "Drone Station">>;
  };

type DroneStationResponse = DroneStation[];
type DroneResponse = Drone[];

export type { Drone, DroneResponse, DroneStation, DroneStationResponse };
