import {
  Features,
  type FeaturesProperty,
  IDClassObject,
  type LocationWithRotation,
  ObjectWithInv,
} from "@/types/general";

export type LizardDoggo = IDClassObject<"Char_SpaceRabbit_C"> &
  ObjectWithInv &
  LocationWithRotation &
  Features<FeaturesProperty<null, "Lizard Doggo">>;
