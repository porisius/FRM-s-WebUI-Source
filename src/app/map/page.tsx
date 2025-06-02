"use client";

// TODO: add chat btn to message with ingame chat on the bottom right

import React, { useCallback, useEffect, useState } from "react";
import { Check, Layers, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { artifacts, map, misc, power_slugs, resources } from "@public/images";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import DeckGL, {
  BitmapLayer,
  CompositeLayer,
  COORDINATE_SYSTEM,
  IconLayer,
  LineLayer,
  OrthographicView,
  PathLayer,
  PickingInfo,
  PolygonLayer,
} from "deck.gl";
import { buildings } from "@/lib/buildings";
import { makePopup } from "@/components/map/popup";
import { Toggle } from "@/components/ui/toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  CalcBoundingBox,
  degreesToRadians,
  layerStuff,
  layerStuffType,
  Point,
  rotatePoint,
} from "../map/utils";
import { adjustColorShades, hexToRgb, RGB, toHex6 } from "@/lib/helpers";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { classNameColors, colors, purityColors } from "@/lib/constants";
import { Artifact } from "@/types/artifacts";
import { ResourceNode } from "@/types/resource-node";
import { Artifacts } from "@enums/artifacts";
import { DropPod } from "@/types/drop-pod";
import { PowerSlugs } from "@/types/power-slug";
import { Vehicles } from "@/types/vehicles";
import { Player } from "@/types/player";
import { SpaceElevator } from "@/types/space-elevator";
import axios from "axios";
import { useSettingsStore } from "@stores/settings";
import Chat from "@/components/chat";
import {
  BoundingBox,
  CoordinatesWithRotation,
  IDBoundingColorSlotBoxClassObject,
  LocationWithRotation,
} from "@/types/general";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const slugClassNames = ["BP_Crystal_C", "BP_Crystal_mk2_C", "BP_Crystal_mk3_C"];

const slugTier = {
  BP_Crystal_C: "MK1",
  BP_Crystal_mk2_C: "MK2",
  BP_Crystal_mk3_C: "MK3",
};

export default function MapPage() {
  const MAP_VIEW = new OrthographicView({
    id: "2d-scene",
    flipY: false,
    controller: {
      dragRotate: false,
    },
  });

  const mapImg = new BitmapLayer({
    id: "bitmap-layer",
    image: map,
    bounds: [-375e3 + 50301.83203125, -375e3, 375e3 + 50301.83203125, 375e3],
  });

  const [dataVersion, setDataVersion] = useState<number>(0);
  const { baseURL, mapFetchSpeed, mapUseInGameColors, _hasHydrated } =
    useSettingsStore();

  async function buildFilters() {
    let rawData;
    try {
      rawData = await (
        await axios.get(baseURL + layerStuff.resource_node.url)
      ).data;
    } catch {}
    if (rawData == null) return;

    const filters = new Map<string, { Name: string; extra: Set<string> }>();

    rawData.forEach((item: any) => {
      if (item.ClassName && item.Purity) {
        if (!filters.has(item.ClassName)) {
          filters.set(item.ClassName, {
            Name: item.Name || "",
            extra: new Set(),
          });
        }
        filters.get(item.ClassName)!.extra.add(item.Purity);
      }
    });

    const sortedFilters = Array.from(filters.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([className, { Name, extra }]) => ({
        layerId: "resource_node",
        className,
        name: Name,
        extra: Array.from(extra).sort(),
      }));

    const slugFilters = slugClassNames.map((slugClassName) => ({
      layerId: "slugs",
      className: slugClassName,
      name: `Slug ${slugTier[slugClassName as keyof typeof slugTier]}`,
      extra: [slugTier[slugClassName as keyof typeof slugTier]],
    }));

    const artifacts = [
      {
        layerId: "artifacts",
        className: Artifacts.MercerSphere,
        name: `Mercer Sphere`,
        extra: ["NoExtra"],
      },
      {
        layerId: "artifacts",
        className: Artifacts.Somersloop,
        name: "Somersloop",
        extra: ["NoExtra"],
      },
    ];

    const combinedFilters = [...sortedFilters, ...slugFilters, ...artifacts];

    const filterKeys = combinedFilters.map((item) =>
      item.extra.map((extra) => `${item.layerId}-${item.className}-${extra}`),
    );

    return [combinedFilters, filterKeys];
  }

  useEffect(() => {
    const nextUpdate = setTimeout(() => setDataVersion(dataVersion + 1), 1000);
    return () => clearTimeout(nextUpdate);
  }, [dataVersion]);

  const [new_nyaa_filters, setNewNyaaFilters] = useState<string[]>([]);
  const [built_nyaa_filters, setBuiltNyaaFilters] = useState<any[]>([]);

  useEffect(() => {
    async function run() {
      if (!_hasHydrated) return null;
      const filters = await buildFilters();
      if (filters) setBuiltNyaaFilters(filters[0]);
    }

    run();
  }, [_hasHydrated]);

  const [nyaa, setUwU] = useState(() => {
    return structuredClone(layerStuff);
  });

  function MakeIconLayer(
    iconUrl: string,
    id: string,
    visible: boolean,
    getIconFunc?: (d: any) => any,
  ) {
    return new IconLayer({
      autoHighlight: true,
      coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
      data: visible ? baseURL + nyaa[id].url + `#${dataVersion}` : [],
      getIcon: getIconFunc
        ? getIconFunc
        : (d: any) => ({
            height: 70,
            url: iconUrl,
            width: 70,
          }),
      getPosition: (d: any) => [d.location.x, d.location.y * -1],
      getSize: 70,
      highlightColor: [255, 255, 255, 20],
      id: id,
      pickable: true,
      updateTriggers: {
        visible: visible,
      },
      visible: visible,
    });
  }

  function MakePolygonLayer(
    id: string,
    visible: boolean,
    getLineWidth: number,
    getFillColor: any,
    getLineColor: any,
    getPolygon?: any,
  ) {
    return new PolygonLayer({
      autoHighlight: true,
      data: visible ? baseURL + nyaa[id].url + `#${dataVersion}` : [],
      getFillColor: mapUseInGameColors
        ? (d: any) => hexToRgb(toHex6(d.ColorSlot.PrimaryColor))
        : getFillColor,

      getLineColor: mapUseInGameColors
        ? (d: any) => hexToRgb(toHex6(d.ColorSlot.SecondaryColor))
        : getLineColor,
      getLineWidth: getLineWidth,
      getPolygon: getPolygon ? getPolygon : (d: any) => CalcBoundingBox(d),
      highlightColor: [255, 255, 255, 20],
      id: id,
      lineWidthMinPixels: 1,
      pickable: true,
      positionFormat: "XY",
      updateTriggers: {
        visible: visible,
      },
      visible: visible,
    });
  }

  class IconPolygonLayer extends CompositeLayer<{
    id: string;
    visible: boolean;
    iconUrl: string;
    getLineWidth: number;
    getFillColor?: any;
    getLineColor?: any;
    getIconFunc?: any;
  }> {
    renderLayers() {
      const {
        id,
        visible,
        iconUrl,
        getIconFunc,
        getFillColor,
        getLineColor,
        getLineWidth,
      } = this.props;

      const zoomedIn = this.context.viewport.zoom > -6;

      return [
        new IconLayer({
          autoHighlight: true,
          coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
          data: visible ? baseURL + nyaa[id].url + `#${dataVersion}` : [],
          getIcon: getIconFunc
            ? getIconFunc
            : (d: any) => ({
                height: 70,
                url: iconUrl,
                width: 70,
              }),
          getPosition: (d: any) => [d.location.x, d.location.y * -1],
          getSize: 70,
          highlightColor: [255, 255, 255, 20],
          id: `${id}-icon`,
          pickable: true,
          updateTriggers: {
            visible: visible && !zoomedIn,
          },
          visible: visible && !zoomedIn,
        }),
        new PolygonLayer({
          autoHighlight: true,
          data: visible ? baseURL + nyaa[id].url + `#${dataVersion}` : [],
          getFillColor: mapUseInGameColors
            ? (d: any) => hexToRgb(toHex6(d.ColorSlot.PrimaryColor))
            : getFillColor,

          getLineColor: mapUseInGameColors
            ? (d: any) => hexToRgb(toHex6(d.ColorSlot.SecondaryColor))
            : getLineColor,
          getLineWidth: getLineWidth,
          getPolygon: (d) => CalcBoundingBox(d),
          highlightColor: [255, 255, 255, 20],
          id: `${id}-polygon`,
          lineWidthMinPixels: 1,
          pickable: true,
          positionFormat: "XY",
          updateTriggers: {
            visible: visible && zoomedIn,
          },
          visible: visible && zoomedIn,
        }),
      ];
    }
  }

  function MakePathLayer(id: string, getColor: any, visible: boolean) {
    return new PathLayer({
      id: id,
      data: visible ? baseURL + nyaa[id].url + `#${dataVersion}` : [],
      getPath: (d) => {
        return d.SplineData.flatMap((point: CoordinatesWithRotation) => [
          point.x,
          point.y * -1,
        ]);
      },
      getColor: mapUseInGameColors
        ? (d: any) => hexToRgb(toHex6(d.ColorSlot.PrimaryColor))
        : getColor,
      positionFormat: "XY",
      visible: visible,
      updateTriggers: {
        visible: visible,
      },
      getWidth: 100,
      jointRounded: true,
      capRounded: true,
      pickable: true,
      autoHighlight: true,
    });
  }

  class BeltLayer extends CompositeLayer<{
    uwu: string;
    ThisIsForUpdating: Function;
  }> {
    renderLayers() {
      const visible = nyaa["belts"].visible;

      return [
        MakePathLayer(
          "belts",
          (d: any) => {
            const colors = adjustColorShades([153, 209, 219], 5) as RGB[];
            const tier = +(
              d.features.properties.name.match(/Mk\.(\d+)/)?.[1] ?? NaN
            );
            return colors[tier - 1];
          },
          visible,
        ),
        MakePolygonLayer(
          "belt_lifts",
          visible,
          20,
          (d: any) => {
            const colors = adjustColorShades([153, 209, 219], 5) as RGB[];
            const tier = +(
              d.features.properties.name.match(/Mk\.(\d+)/)?.[1] ?? NaN
            );
            return colors[tier - 1];
          },
          (d: any) => {
            const colors = adjustColorShades([153, 209, 219], 6) as RGB[];
            const tier = +(
              d.features.properties.name.match(/Mk\.(\d+)/)?.[1] ?? NaN
            );
            return colors[tier];
          },
          (
            d: IDBoundingColorSlotBoxClassObject &
              BoundingBox &
              LocationWithRotation,
          ) => {
            let lift = d;
            let bbox = lift.BoundingBox;
            let location = lift.location;
            const rotation = -location.rotation % 360;
            const corners: Point[] = [
              [bbox.min.x, bbox.min.y * -1],
              [bbox.max.x, bbox.min.y * -1],
              [bbox.max.x, bbox.min.y * -1 - 20],
              [bbox.max.x + 200, bbox.min.y * -1 - 20],

              [bbox.max.x + 200, bbox.max.y * -1 + 20],
              [bbox.max.x, bbox.max.y * -1 + 20],
              [bbox.max.x, bbox.max.y * -1],
              [bbox.min.x, bbox.max.y * -1],
            ];

            const center: Point = [location.x, location.y * -1];

            const rotationInRadians = degreesToRadians(rotation + 90);

            const rotatedCorners = corners.map((corner) =>
              rotatePoint(corner, center, rotationInRadians),
            );

            return rotatedCorners;
          },
        ),
        MakePolygonLayer(
          "splitter_merger",
          visible,
          20,
          (d: any) => {
            const colors = adjustColorShades([153, 209, 219], 5) as RGB[];
            const classNames = [
              "Build_ConveyorAttachmentMerger_C",
              "Build_ConveyorAttachmentSplitter_C",
              "Build_ConveyorAttachmentMergerPriority_C",
              "Build_ConveyorAttachmentSplitterSmart_C",
              "Build_ConveyorAttachmentSplitterProgrammable_C",
            ];

            return colors[classNames.indexOf(d.ClassName) ?? 5];
          },
          [41, 44, 60],
          (
            d: IDBoundingColorSlotBoxClassObject &
              BoundingBox &
              LocationWithRotation,
          ) => {
            let lift = d;
            let bbox = lift.BoundingBox;
            let location = lift.location;
            const rotation = -location.rotation % 360;

            let corners: Point[] = [
              [bbox.min.x, bbox.min.y * -1],
              [bbox.max.x, bbox.min.y * -1],
              [bbox.max.x, bbox.max.y * -1],
              [bbox.min.x, bbox.max.y * -1],
            ];

            if (d.ClassName.includes("Merger")) {
              let west = [
                [bbox.min.x + 20, bbox.min.y * -1],
                [bbox.min.x + 20, bbox.min.y * -1 + 40],
                [bbox.max.x - 20, bbox.min.y * -1 + 40],
                [bbox.max.x - 20, bbox.min.y * -1],
              ];
              let north = [
                [bbox.max.x, bbox.min.y * -1 - 20],
                [bbox.max.x + 100, bbox.min.y * -1 - 20],
                [bbox.max.x + 100, bbox.max.y * -1 + 20],
                [bbox.max.x, bbox.max.y * -1 + 20],
              ];
              let east = [
                [bbox.max.x - 20, bbox.max.y * -1],
                [bbox.max.x - 20, bbox.max.y * -1 - 40],
                [bbox.min.x + 20, bbox.max.y * -1 - 40],
                [bbox.min.x + 20, bbox.max.y * -1],
              ];
              let south = [
                [bbox.min.x, bbox.max.y * -1 + 20],
                [bbox.min.x - 40, bbox.max.y * -1 + 20],
                [bbox.min.x - 40, bbox.min.y * -1 - 20],
                [bbox.min.x, bbox.min.y * -1 - 20],
              ];

              corners = [
                ...west,
                [bbox.max.x, bbox.min.y * -1],
                ...north,
                [bbox.max.x, bbox.max.y * -1],
                ...east,
                [bbox.min.x, bbox.max.y * -1],
                ...south,
                [bbox.min.x, bbox.min.y * -1],
              ];
            } else if (d.ClassName.includes("Splitter")) {
              let west = [
                [bbox.min.x + 20, bbox.min.y * -1],
                [bbox.min.x + 20, bbox.min.y * -1 + 100],
                [bbox.max.x - 20, bbox.min.y * -1 + 100],
                [bbox.max.x - 20, bbox.min.y * -1],
              ];
              let north = [
                [bbox.max.x, bbox.min.y * -1 - 20],
                [bbox.max.x + 40, bbox.min.y * -1 - 20],
                [bbox.max.x + 40, bbox.max.y * -1 + 20],
                [bbox.max.x, bbox.max.y * -1 + 20],
              ];
              let east = [
                [bbox.max.x - 20, bbox.max.y * -1],
                [bbox.max.x - 20, bbox.max.y * -1 - 100],
                [bbox.min.x + 20, bbox.max.y * -1 - 100],
                [bbox.min.x + 20, bbox.max.y * -1],
              ];
              let south = [
                [bbox.min.x, bbox.max.y * -1 + 20],
                [bbox.min.x - 100, bbox.max.y * -1 + 20],
                [bbox.min.x - 100, bbox.min.y * -1 - 20],
                [bbox.min.x, bbox.min.y * -1 - 20],
              ];

              corners = [
                ...west,
                [bbox.max.x, bbox.min.y * -1],
                ...north,
                [bbox.max.x, bbox.max.y * -1],
                ...east,
                [bbox.min.x, bbox.max.y * -1],
                ...south,
                [bbox.min.x, bbox.min.y * -1],
              ];
            }

            const center: Point = [location.x, location.y * -1];

            const rotationInRadians = degreesToRadians(rotation + 90);

            const rotatedCorners = corners.map((corner) =>
              rotatePoint(corner, center, rotationInRadians),
            );

            return rotatedCorners;
          },
        ),
      ];
    }
  }

  class TrainLayer extends CompositeLayer<{
    uwu: string;
    ThisIsForUpdating: Function;
  }> {
    renderLayers() {
      const visible = nyaa["train"].visible;

      return [
        MakePathLayer("train_rails", (d: any) => hexToRgb("#8839ef"), visible),
        new IconPolygonLayer({
          id: "train_station",
          visible: visible,
          iconUrl: misc.vehicles.trains.train_station,
          getLineWidth: 20,
          getFillColor: hexToRgb("#8aadf4"),
          getLineColor: [41, 44, 60],
        }),
        MakeIconLayer(misc.vehicles.trains.train, "train", visible),
      ];
    }
  }

  class VehicleLayer extends CompositeLayer<{
    uwu: string;
    ThisIsForUpdating: Function;
  }> {
    renderLayers() {
      const visible = nyaa["vehicles"].visible;

      return [
        new IconPolygonLayer({
          id: "truck_station",
          visible: visible,
          iconUrl: misc.vehicles.trucks.truck_station,
          getLineWidth: 20,
          getFillColor: hexToRgb("#91d7e3"),
          getLineColor: [41, 44, 60],
        }),
        MakeIconLayer(
          misc.vehicles.trucks.truck,
          "vehicles",
          visible,
          (d: Vehicles) => ({
            height: 70,
            url:
              {
                BP_Golfcart_C: misc.vehicles.factory_cart,
                BP_Tractor_C: misc.vehicles.tractor,
                BP_Truck_C: misc.vehicles.trucks.truck,
              }[d.ClassName as string] ?? misc.vehicles.explorer,
            width: 70,
          }),
        ),
      ];
    }
  }

  class DroneLayer extends CompositeLayer<{
    uwu: string;
    ThisIsForUpdating: Function;
  }> {
    renderLayers() {
      const visible = nyaa["drone"].visible;

      return [
        new IconPolygonLayer({
          id: "drone_station",
          visible: visible,
          iconUrl: misc.drones.drone_station,
          getLineWidth: 20,
          getFillColor: hexToRgb("#b7bdf8"),
          getLineColor: [41, 44, 60],
        }),
        MakeIconLayer(misc.drones.drone, "drone", visible),
      ];
    }
  }

  const master = [
    MakeIconLayer(
      power_slugs.power_slug,
      "slugs",
      nyaa["slugs"].visible,
      (d: PowerSlugs) => ({
        url:
          {
            BP_Crystal_C: power_slugs.power_slug_mk1,
            BP_Crystal_mk2_C: power_slugs.power_slug_mk2,
            BP_Crystal_mk3_C: power_slugs.power_slug_mk3,
          }[d.ClassName as string] ?? misc.question_mark,
        width: 70,
        height: 70,
      }),
    ),
    MakeIconLayer(
      misc.drop_pod.drop_pod,
      "drop_pod",
      nyaa["drop_pod"].visible,
      (d: DropPod) => ({
        url: d.Looted
          ? misc.drop_pod.drop_pod_collected
          : misc.drop_pod.drop_pod,
        width: 70,
        height: 70,
      }),
    ),

    MakeIconLayer(
      artifacts.somersloop,
      "artifacts",
      nyaa["artifacts"].visible,
      (d: Artifact) => ({
        height: 70,
        url:
          d.ClassName == Artifacts.Somersloop
            ? artifacts.somersloop
            : d.ClassName == Artifacts.MercerSphere
              ? artifacts.mercer_sphere
              : misc.question_mark,
        width: 70,
      }),
    ),

    MakeIconLayer(
      misc.question_mark,
      "resource_node",
      nyaa["resource_node"].visible,
      (d: ResourceNode) => ({
        url: d.ClassName
          ? `${resources + d.ClassName}/${d.Purity.toLowerCase()}.png`
          : misc.question_mark,
        width: 70,
        height: 70,
      }),
    ),

    new LineLayer({
      pickable: true,
      id: "cables",
      data: nyaa["cables"].visible
        ? baseURL + nyaa["cables"].url + `#${dataVersion}`
        : [],
      getColor: [44, 117, 255],
      getSourcePosition: (d: any) => [d["location0"].x, d["location0"].y * -1],
      getTargetPosition: (d: any) => [d["location1"].x, d["location1"].y * -1],
      getWidth: 2,
      visible: nyaa.cables.visible,
      updateTriggers: {
        visible: nyaa.cables.visible,
      },
    }),

    new BeltLayer({ uwu: "uwu", ThisIsForUpdating: () => {} }),
    new TrainLayer({ uwu: "uwu", ThisIsForUpdating: () => {} }),
    new VehicleLayer({ uwu: "uwu", ThisIsForUpdating: () => {} }),
    new DroneLayer({ uwu: "uwu", ThisIsForUpdating: () => {} }),

    MakePathLayer(
      "pipes",
      (d: any) => {
        const colors = adjustColorShades([255, 204, 153], 1) as RGB[];
        const tier = +(
          d.features.properties.name.match(/Mk\.(\d+)/)?.[1] ?? NaN
        );
        return colors[tier - 1];
      },
      nyaa["pipes"].visible,
    ),

    MakePolygonLayer(
      "generators",
      nyaa["generators"].visible,
      20,
      mapUseInGameColors
        ? (d: any) => hexToRgb(toHex6(d.ColorSlot.PrimaryColor))
        : (d: any) => {
            if ((d["ClassName"] as string).includes("Coal"))
              return new Uint8Array(buildings.coal_generator.color);
            if ((d["ClassName"] as string).includes("GeneratorBiomass"))
              return new Uint8Array(buildings.biomass_generator.color);
            if ((d["ClassName"] as string).includes("IntegratedBiomass"))
              return new Uint8Array(
                buildings.biomass_generator_integrated.color,
              );
            if ((d["ClassName"] as string).includes("Fuel"))
              return new Uint8Array(buildings.fuel_generator.color);
            if ((d["ClassName"] as string).includes("Nuclear"))
              return new Uint8Array(buildings.nuclear_generator.color);
            return [100, 100, 100, 100];
          },
      mapUseInGameColors
        ? (d: any) => hexToRgb(toHex6(d.ColorSlot.SecondaryColor))
        : [41, 44, 60],
    ),
    MakePolygonLayer(
      "storage_inv",
      nyaa["storage_inv"].visible,
      20,
      mapUseInGameColors
        ? (d: any) => hexToRgb(toHex6(d.ColorSlot.PrimaryColor))
        : (d: any) => hexToRgb("#c6a0f6"),
      mapUseInGameColors
        ? (d: any) => hexToRgb(toHex6(d.ColorSlot.SecondaryColor))
        : [41, 44, 60],
    ),
    new IconPolygonLayer({
      id: "space_elevator",
      visible: nyaa["space_elevator"].visible,
      iconUrl: misc.space_elevator.space_elevator,
      getLineWidth: 20,
      getFillColor: mapUseInGameColors
        ? (d: any) => hexToRgb(toHex6(d.ColorSlot.PrimaryColor))
        : (d: any) => hexToRgb("#eed49f"),
      getLineColor: mapUseInGameColors
        ? (d: any) => hexToRgb(toHex6(d.ColorSlot.SecondaryColor))
        : [41, 44, 60],
      getIconFunc: (d: SpaceElevator) => ({
        height: 70,
        url:
          d.FullyUpgraded || d.UpgradeReady
            ? misc.space_elevator.space_elevator_ready
            : misc.space_elevator.space_elevator,
        width: 70,
      }),
    }),

    new IconPolygonLayer({
      id: "radar",
      visible: nyaa["radar"].visible,
      iconUrl: misc.radar_tower,
      getLineWidth: 20,
      getFillColor: (d: any) => hexToRgb("#f0c6c6"),
      getLineColor: mapUseInGameColors
        ? (d: any) => hexToRgb(toHex6(d.ColorSlot.SecondaryColor))
        : [41, 44, 60],
    }),
    new IconPolygonLayer({
      id: "switches",
      visible: nyaa["switches"].visible,
      iconUrl: misc.power,
      getLineWidth: 20,
      getFillColor: (d: any) => hexToRgb("#f0c6c6"),
      getLineColor: mapUseInGameColors
        ? (d: any) => hexToRgb(toHex6(d.ColorSlot.SecondaryColor))
        : [41, 44, 60],
    }),

    MakeIconLayer(
      misc.player.alive,
      "players",
      nyaa["players"].visible,
      (d: Player) => ({
        url: d.Dead
          ? misc.player.player_dead
          : (d.Online as boolean)
            ? misc.player.alive
            : misc.player.player_offline,
        width: 70,
        height: 70,
      }),
    ),
    MakeIconLayer(misc.hub, "hub", nyaa["hub"].visible),
  ];

  // useEffect(() => {
  //   const nextUpdate = setInterval(() => {
  //     if (!_hasHydrated) return null;
  //     Object.entries(data).forEach(async ([key, endpoint]) => {
  //       const nyaaEntry = nyaa[key];
  //       if (!nyaaEntry?.visible) return;
  //
  //       const rawData = (await axios.get(baseURL + nyaaEntry.url)).data;
  //
  //       const filteredData = rawData.filter((item: any) => {
  //         if (
  //           new_nyaa_filters.length === 0 ||
  //           !new_nyaa_filters.find((filter) => filter.includes(key))
  //         )
  //           return true;
  //
  //         const extra =
  //           item.Purity ??
  //           slugTier[item.ClassName as keyof typeof slugTier] ??
  //           "NoExtra";
  //         const filterKey = `${key}-${item.ClassName}-${extra}`;
  //
  //         return new_nyaa_filters.includes(filterKey);
  //       });
  //
  //       setData((prevData) => ({
  //         ...prevData,
  //         [key]: {
  //           ...endpoint,
  //           data: filteredData,
  //         },
  //       }));
  //     });
  //   }, mapFetchSpeed);
  //
  //   return () => clearInterval(nextUpdate);
  // }, [nyaa, new_nyaa_filters, _hasHydrated]);

  const [filterElement, setFilterElement] = useState<any>(null);

  useEffect(() => {
    setFilterElement(
      <table className="w-full table-auto border-collapse text-xs">
        <thead>
          <tr className="text-left">
            <th className="p-1">Icon</th>
            <th className="p-1">Name</th>
            <th className="p-1 text-center">Options</th>
          </tr>
        </thead>
        <tbody>
          {built_nyaa_filters.map(
            ({
              className,
              name,
              extra,
              layerId,
            }: {
              className: string;
              name: string;
              extra: string[];
              layerId: string;
            }) => {
              const icon = `markers/normal/${className}.png`;

              const changedMark = new_nyaa_filters.some((filter: string) =>
                filter.startsWith(`${layerId}-${className}`),
              ) && (
                <div
                  className="rounded-full size-2 absolute right-[-2px] top-[-2px]"
                  style={{
                    backgroundColor: `hsla(${colors.blue})`,
                  }}
                />
              );

              return (
                <tr key={className} className="text-center border-t">
                  <td className="p-1">
                    <img src={icon} alt={className} className="size-6" />
                  </td>
                  <td className="p-1 text-left truncate max-w-[120px]">
                    {name}
                  </td>
                  <td className="p-1 relative w-auto">
                    {extra.length === 1 ? (
                      (() => {
                        const tier = extra[0];
                        const color =
                          classNameColors[
                            className as keyof typeof classNameColors
                          ] ?? purityColors[tier];
                        const filterKey = `${layerId}-${className}-${tier}`;
                        const isChecked = new_nyaa_filters.includes(filterKey);
                        const toggle = () => {
                          setNewNyaaFilters((prev) =>
                            prev.includes(filterKey)
                              ? prev.filter((f) => f !== filterKey)
                              : [...prev, filterKey],
                          );
                        };

                        return (
                          <div
                            onClick={toggle}
                            className="inline-flex items-center justify-center size-5 rounded-full border cursor-pointer relative"
                            style={{
                              backgroundColor: `hsla(${color}, 0.2)`,
                              borderColor: `hsl(${color})`,
                            }}
                            title={tier}
                          >
                            {isChecked ? (
                              <Check className="size-4" />
                            ) : (
                              <X className="size-4" />
                            )}
                            {changedMark}
                          </div>
                        );
                      })()
                    ) : (
                      <Popover>
                        <PopoverTrigger asChild>
                          <div className="inline-flex items-center justify-center size-5 rounded-full border cursor-pointer bg-muted hover:bg-muted/80 relative">
                            <p>+</p>
                            {changedMark}
                          </div>
                        </PopoverTrigger>
                        <PopoverContent className="p-2 gap-2 inline-flex w-auto">
                          {extra.map((tier: string) => {
                            const color =
                              classNameColors[
                                className as keyof typeof classNameColors
                              ] ?? purityColors[tier];
                            const filterKey = `${layerId}-${className}-${tier}`;
                            const isChecked =
                              new_nyaa_filters.includes(filterKey);
                            const toggle = () => {
                              setNewNyaaFilters((prev) =>
                                prev.includes(filterKey)
                                  ? prev.filter((f) => f !== filterKey)
                                  : [...prev, filterKey],
                              );
                            };

                            return (
                              <div
                                key={tier}
                                onClick={toggle}
                                className="inline-flex flex-col items-center gap-1 cursor-pointer text-sm px-2 w-[50px]"
                              >
                                <div
                                  className="size-5 rounded-full border"
                                  style={{
                                    backgroundColor: `hsla(${color}, 0.2)`,
                                    borderColor: `hsl(${color})`,
                                  }}
                                >
                                  {isChecked ? (
                                    <Check className="size-4 m-auto" />
                                  ) : (
                                    <X className="size-4 m-auto" />
                                  )}
                                </div>
                                <p>{tier}</p>
                              </div>
                            );
                          })}
                        </PopoverContent>
                      </Popover>
                    )}
                  </td>
                </tr>
              );
            },
          )}
        </tbody>
      </table>,
    );
  }, [built_nyaa_filters, new_nyaa_filters]);

  return (
    <div>
      <Sheet>
        <SheetTrigger
          style={{
            left: "50%",
            position: "absolute",
            zIndex: 2,
            marginTop: 5,
          }}
          className={"left-1/2 absolute z-2 mt-[5px]"}
        >
          <Button variant={"secondary"} asChild>
            <div>
              <Layers className="mr-2 h-4 w-4" /> Layers
            </div>
          </Button>
        </SheetTrigger>
        <SheetContent side={"left"}>
          <ScrollArea className={"h-[90vh]"} type={"scroll"}>
            <SheetHeader>
              <SheetTitle>Layers & Filters</SheetTitle>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 bg-card rounded-2xl shadow-inner max-h-[80vh] overflow-y-auto border">
                {Object.entries(nyaa).map(([key, value]) => {
                  // @ts-ignore
                  if (layerStuff[key].with != null) return null;
                  const uwuLayer = layerStuff[key];
                  return (
                    <Tooltip key={key}>
                      <TooltipTrigger>
                        <Toggle
                          defaultPressed={value.visible}
                          onPressedChange={(pressed) => {
                            value.visible = pressed;
                            setUwU(nyaa);
                          }}
                          pressed={value.visible}
                          className="flex items-center gap-3 w-full px-3 py-2 rounded-xl border border-[hsl(29,75%,65%)] data-[state=on]:bg-[hsla(29,75%,65%,0.2)] hover:bg-[hsla(29,75%,65%,0.1)] p-5"
                        >
                          <Avatar className="size-8">
                            <AvatarImage src={uwuLayer.icon} />
                            <AvatarFallback>
                              {key.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          {/*<p className="truncate">{uwuLayer.label}</p>*/}
                        </Toggle>
                      </TooltipTrigger>
                      <TooltipContent className={"bg-card text-primary border"}>
                        <p>{uwuLayer.label}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>

              <Separator className={"my-[15px]"} />

              <div className={"gap-2 flex-col flex w-full"}>
                {filterElement}
              </div>
            </SheetHeader>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      <DeckGL
        layers={[mapImg, ...master]}
        views={MAP_VIEW}
        initialViewState={{
          target: [0, 0, 0],
          zoom: -10,
          maxZoom: 18,
          minZoom: -10,
        }}
        style={{
          height: "100%",
          width: "100%",
          position: "fixed",
          backgroundColor: "transparent",
          overflow: "hidden",
        }}
        getTooltip={useCallback(({ object, layer }: PickingInfo) => {
          return (
            object && {
              html: makePopup(layer, object),
              style: {
                backgroundColor: "transparent",
              },
            }
          );
        }, [])}
      />

      <Chat />
    </div>
  );
}
