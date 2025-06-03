import {normal, power_slugs} from "@/public/images";

type Point = number[] | [number, number];

function rotatePoint(point: Point, center: Point, angleRad: number): Point {
    const [px, py] = point;
    const [cx, cy] = center;

    const tx = px - cx;
    const ty = py - cy;

    const cosA = Math.cos(angleRad);
    const sinA = Math.sin(angleRad);

    const rx = tx * cosA - ty * sinA;
    const ry = tx * sinA + ty * cosA;

    return [rx + cx, ry + cy];
}

function degreesToRadians(deg: number): number {
    return (deg * Math.PI) / 180;
}

function CalcBoundingBox({BoundingBox, location}: any): Point[] {
    const bbox = BoundingBox;
    const rotation = -location.rotation % 360;
    const corners: Point[] = [
        [bbox.min.x, bbox.min.y * -1],
        [bbox.max.x, bbox.min.y * -1],
        [bbox.max.x, bbox.max.y * -1],
        [bbox.min.x, bbox.max.y * -1],
    ];

    const center: Point = [location.x, location.y * -1];

    const rotationInRadians = degreesToRadians(rotation + 90);

    return corners.map(corner =>
        rotatePoint(corner, center, rotationInRadians),
    );
}

interface layerStuffType {
    [key: string]: {
        data?: any;
        filters?: string[];
        icon: string;
        id: string;
        label: string;
        url: string;
        visible: boolean;
        with?: string;
    };
}

const layerStuff: layerStuffType = {
    artifacts: {
        icon: normal.artifacts.somersloop,
        id: "artifacts",
        label: "Artifacts",
        url: "/getArtifacts",
        visible: false,
    },
    belts: {
        icon: normal.buildings.conveyor_belt_mk_1,
        id: "belts",
        label: "Belts",
        url: "/getBelts",
        visible: true,
    },
    belt_lifts: {
        icon: normal.buildings.conveyor_belt_mk_1,
        id: "belt_lifts",
        label: "Belt Lifts",
        url: "/getLifts",
        with: "belts",
        visible: true,
    },
    splitter_merger: {
        icon: normal.crate.crate_loot,
        id: "splitter_merger",
        label: "Splitter & Merger",
        url: "/getSplitterMerger",
        with: "belts",
        visible: true,
    },
    cables: {
        icon: normal.power,
        id: "cables",
        label: "Cables",
        url: "/getCables",
        visible: true,
    },
    drone: {
        icon: normal.drones.drone,
        id: "drone",
        label: "Drones",
        url: "/getDrone",
        visible: true,
    },
    drone_station: {
        icon: normal.drones.drone_station,
        id: "drone_station",
        label: "Drone Stations",
        url: "/getDroneStation",
        visible: true,
        with: "drone",
    },
    drop_pod: {
        icon: normal.drop_pod,
        id: "drop_pod",
        label: "Drop Pods",
        url: "/getDropPod",
        visible: false,
    },
    factory: {
        icon: normal.question_mark,
        id: "factory",
        label: "Factory",
        url: "/getFactory",
        visible: true,
    },
    generators: {
        icon: normal.power,
        id: "generators",
        label: "Power Generators",
        url: "/getGenerators",
        visible: true,
    },
    hub: {
        icon: normal.hub,
        id: "hub",
        label: "Hubs",
        url: "/getHUBTerminal",
        visible: true,
    },
    pipes: {
        icon: normal.buildings.pipeline_mk_1,
        id: "pipes",
        label: "Pipes",
        url: "/getPipes",
        visible: true,
    },
    pipe_junctions: {
        icon: normal.buildings.pipeline_mk_1,
        id: "pipe_junctions",
        label: "Pipe Junctions",
        url: "/getPipeJunctions",
        visible: true,
        with: "pipes",
    },
    hypertubes: {
        icon: normal.question_mark,
        id: "hypertubes",
        label: "Hypertubes",
        url: "/getHypertube",
        visible: true,
    },
    hypertube_entrances: {
        icon: normal.question_mark,
        id: "hypertube_entrances",
        label: "Hypertube Entrances",
        url: "/getHyperEntrance",
        visible: true,
        with: "hypertubes",
    },
    players: {
        icon: normal.player.alive,
        id: "players",
        label: "Players",
        url: "/getPlayer",
        visible: true,
    },
    radar: {
        icon: normal.radar_tower,
        id: "radio_tower",
        label: "Radar Towers",
        url: "/getRadarTower",
        visible: true,
    },
    resource_node: {
        icon: normal.question_mark,
        id: "resource_node",
        label: "Resource Node",
        url: "/getResourceNode",
        visible: false,
    },
    // resource_well: {
    //   icon: normal.question_mark,
    //   label: "Resource Well",
    //   visible: false,
    //   id: "resource_well",
    //   url: "/getResourceWell",
    // },
    slugs: {
        icon: power_slugs.power_slug,
        id: "slugs",
        label: "Slug",
        url: "/getPowerSlug",
        visible: false,
    },
    space_elevator: {
        icon: normal.space_elevator,
        id: "space_elevator",
        label: "Space Elevator",
        url: "/getSpaceElevator",
        visible: true,
    },
    storage_inv: {
        icon: normal.crate.crate_loot,
        id: "storage_inv",
        label: "Storage Inv",
        url: "/getStorageInv",
        visible: true,
    },
    train: {
        icon: normal.vehicles.trains.train,
        id: "train",
        label: "Trains",
        url: "/getTrains",
        visible: true,
    },
    train_station: {
        icon: normal.vehicles.trains.train_station,
        id: "train_station",
        label: "Train Stations",
        url: "/getTrainStation",
        visible: true,
        with: "train",
    },
    truck_station: {
        icon: normal.vehicles.trucks.truck_station,
        id: "truck_station",
        label: "Truck Stations",
        url: "/getTruckStation",
        visible: true,
        with: "vehicles",
    },
    vehicles: {
        icon: normal.vehicles.trucks.truck,
        id: "vehicles",
        label: "Vehicles",
        url: "/getVehicles",
        visible: true,
    },
    train_rails: {
        icon: normal.vehicles.trains.train,
        id: "train_rails",
        label: "Train Rails",
        url: "/getTrainRails",
        visible: true,
        with: "train",
    },
    switches: {
        icon: normal.power,
        id: "switches",
        label: "Switches",
        url: "/getSwitches",
        visible: true,
    }, extractor: {
        icon: normal.question_mark,
        id: "extractor",
        label: "Extractors",
        url: "/getExtractor",
        visible: true,
    },
};

export {rotatePoint, CalcBoundingBox, layerStuff, degreesToRadians};
export type {Point};
export type {layerStuffType};
