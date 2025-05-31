import {
  type Features,
  type FeaturesProperty,
  IDClassObject,
  LocationWithRotation,
} from "@types/general";

type Artifact = IDClassObject &
  LocationWithRotation & {
    features: Features<FeaturesProperty<"Artifact", "">>;
  };

type MercerSphere = Artifact<"Mercer Sphere", "BP_WAT2_C">;
type Somersloop = Artifact<"Somersloop", "BP_WAT1_C">;

export { Artifact, MercerSphere, Somersloop };
