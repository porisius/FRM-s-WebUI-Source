import { normal, power_slugs } from "@public/images";

export function rotatePoint(
  [x, y]: [number, number],
  [cx, cy]: [number, number],
  angleDeg: number,
): [number, number] {
  const angleRad = (angleDeg * Math.PI) / 180;
  const cos = Math.cos(angleRad);
  const sin = Math.sin(angleRad);

  const dx = x - cx;
  const dy = y - cy;

  return [cx + dx * cos - dy * sin, cy + dx * sin + dy * cos];
}

export interface layerStuffType {
  [key: string]: {
    data?: any;
    filters?: string[];
    icon: string;
    id: string;
    label: string;
    url: string;
    visible: boolean;
  };
}

export const layerStuff: layerStuffType = {
  artifacts: {
    icon: normal.artifacts.somersloop,
    label: "Artifacts",
    visible: false,
    id: "artifacts",
    url: "getArtifacts",
  },
  belts: {
    icon: normal.buildings.conveyor_belt_mk_1,
    label: "Belts",
    visible: false,
    id: "belts",
    url: "getBelts",
  },
  cables: {
    icon: normal.power,
    label: "Cables",
    visible: false,
    id: "cables",
    url: "getCables",
  },
  drone: {
    icon: normal.drones.drone,
    label: "Drones",
    visible: false,
    id: "drone",
    url: "getDrone",
  },
  drone_station: {
    icon: normal.drones.drone_station,
    label: "Drone Stations",
    visible: false,
    id: "drone_station",
    url: "getDroneStation",
  },
  drop_pod: {
    icon: normal.drop_pod,
    label: "Drop Pods",
    visible: false,
    id: "drop_pod",
    url: "getDropPod",
  },
  factory: {
    icon: normal.question_mark,
    label: "Factory",
    visible: false,
    id: "factory",
    url: "getFactory",
  },
  generators: {
    icon: normal.power,
    label: "Power Generators",
    visible: false,
    id: "generators",
    url: "getGenerators",
  },
  hub: {
    icon: normal.hub,
    label: "Hubs",
    visible: false,
    id: "hub",
    url: "getHUBTerminal",
  },
  pipes: {
    icon: normal.buildings.pipeline_mk_1,
    label: "Pipes",
    visible: false,
    id: "pipes",
    url: "getPipes",
  },
  players: {
    icon: normal.player.alive,
    label: "Players",
    visible: false,
    id: "players",
    url: "getPlayer",
  },
  radar: {
    icon: normal.radar_tower,
    label: "Radar Towers",
    visible: false,
    id: "radio_tower",
    url: "getRadarTower",
  },
  resource_node: {
    icon: normal.question_mark,
    id: "resource_node",
    label: "Resource Node",
    url: "getResourceNode",
    visible: false,
  },
  // resource_well: {
  //   icon: normal.question_mark,
  //   label: "Resource Well",
  //   visible: false,
  //   id: "resource_well",
  //   url: "getResourceWell",
  // },
  slugs: {
    icon: power_slugs.power_slug,
    label: "Slug",
    visible: false,
    id: "slugs",
    url: "getPowerSlug",
  },
  space_elevator: {
    icon: normal.space_elevator,
    label: "Space Elevator",
    visible: false,
    id: "space_elevator",
    url: "getSpaceElevator",
  },
  train: {
    icon: normal.vehicles.trains.train,
    label: "Trains",
    visible: false,
    id: "train",
    url: "getTrains",
  },
  train_station: {
    icon: normal.vehicles.trains.train_station,
    label: "Train Stations",
    visible: false,
    id: "train_station",
    url: "getTrainStation",
  },
  truck_station: {
    icon: normal.vehicles.trucks.truck_station,
    label: "Truck Stations",
    visible: false,
    id: "truck_station",
    url: "getTruckStation",
  },
  vehicles: {
    icon: normal.vehicles.trucks.truck,
    label: "Vehicles",
    visible: false,
    id: "vehicles",
    url: "getVehicles",
  },
  storage_inv: {
    icon: normal.crate.crate_loot,
    label: "Storage Inv",
    visible: false,
    id: "storage_inv",
    url: "getStorageInv",
  },
};
