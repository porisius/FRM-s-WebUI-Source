type ClassObject<ClassName extends string = string> = {
  Name: string;
  ClassName: ClassName;
};

type IDClassObject<ClassName extends string = string> =
  ClassObject<ClassName> & {
    ID: string;
  };

type IDBoundingBoxClassObject<ClassName extends string = string> =
  IDClassObject<ClassName> & BoundingBox;

type IDBoundingColorSlotBoxClassObject<ClassName extends string = string> =
  IDBoundingBoxClassObject<ClassName> & ColorSlot;

type Item = ClassObject & {
  Amount: number;
};

type InventoryItem = ClassObject &
  Item & {
    MaxAmount: number;
  };

interface Coordinates {
  x: number;
  y: number;
  z: number;
}

type CoordinatesWithRotation = Coordinates & {
  rotation: number;
};

type BoundingBox = {
  BoundingBox: {
    min: Coordinates;
    max: Coordinates;
  };
};

type ColorSlot = {
  PrimaryColor: string;
  SecondaryColor: string;
};

type GeometryPoint = {
  type: "Point";
  coordinates: Coordinates;
};

type GeometryLine = {
  type: "Line";
  coordinates: Coordinates[];
};

type Geometry = GeometryPoint | GeometryLine;

type FeaturesProperty<
  Type extends string = string,
  Name extends string = string,
> = {
  name: Name;
  type: Type;
};

type Features<
  Property = FeaturesProperty,
  Geometry extends Geometry = GeometryPoint,
> = {
  properties: Property;
  geometry: Geometry;
};

type PowerInfo = {
  CircuitGroupID: number;
  CircuitID: number;
  PowerConsumed: number;
  MaxPowerConsumed: number;
};

type LocationWithRotation = {
  location: CoordinatesWithRotation;
};

type Location = {
  location: Coordinates;
};

export type {
  ClassObject,
  IDClassObject,
  IDBoundingBoxClassObject,
  IDBoundingColorSlotBoxClassObject,
  Item,
  InventoryItem,
  PowerInfo,
  Features,
  FeaturesProperty,
  Geometry,
  GeometryPoint,
  GeometryLine,
  Coordinates,
  CoordinatesWithRotation,
  LocationWithRotation,
  Location,
  BoundingBox,
  ColorSlot,
};
