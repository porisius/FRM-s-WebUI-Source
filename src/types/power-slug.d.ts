import type {
  Features,
  FeaturesProperty,
  LocationWithRotation,
  IDClassObject,
} from "./general";

type PowerSlug = IDClassObject &
  LocationWithRotation & {
    features: Features<FeaturesProperty<"Power Slug", "">>;
  };

type PowerSlugResponse = PowerSlug[];

type BluePowerSlug = PowerSlug<"Blue Power Slug", "BP_Crystal_C">;
type YellowPowerSlug = PowerSlug<"Yellow Power Slug", "BP_Crystal_mk2_C">;
type PurplePowerSlug = PowerSlug<"Purple Power Slug", "BP_Crystal_mk3_C">;

type PowerSlugs = BluePowerSlug | YellowPowerSlug | PurplePowerSlug;

export type {
  PowerSlugResponse,
  PowerSlug,
  BluePowerSlug,
  YellowPowerSlug,
  PurplePowerSlug,
  PowerSlugs,
};
