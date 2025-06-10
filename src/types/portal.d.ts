import {
  IDBoundingColorSlotBoxClassObject,
  type LocationWithRotation,
  PowerInfo,
} from "@/types/general";

export type Portal = IDBoundingColorSlotBoxClassObject<
  "Build_Portal_C" | "Build_PortalSatellite_C"
> &
  LocationWithRotation &
  PowerInfo;
