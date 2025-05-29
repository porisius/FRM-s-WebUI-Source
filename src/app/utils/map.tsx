"use client";
import { baseURL } from "@/lib/api";
import React, { useCallback, useEffect, useState } from "react";
import { Check, Layers, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { map, misc, power_slugs, resources } from "@public/images";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import DeckGL, {
  BitmapLayer,
  COORDINATE_SYSTEM,
  IconLayer,
  LineLayer,
  OrthographicView,
  PickingInfo,
  PolygonLayer,
} from "deck.gl";
import { buildings } from "@/lib/buildings";
import { makePopup } from "@/components/map/popup";
import { Toggle } from "@/components/ui/toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { getSize, layerStuff } from "../map/utils";

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

const slugTypes = ["BP_Crystal_C", "BP_Crystal_mk2_C", "BP_Crystal_mk3_C"];

const MapElement: React.FC = () => {
  const [dataVersion, setDataVersion] = useState<number>(0);

  useEffect(() => {
    const nextUpdate = setTimeout(() => setDataVersion(dataVersion + 1), 1000);
    return () => clearTimeout(nextUpdate);
  }, [dataVersion]);

  const [nyaa_slug_filters, setSlugFilters] = useState<string[]>([]);
  const [nyaa_resource_filters, setResourceFilters] = useState<string[]>([]);

  const [nyaa, setUwU] = useState<{
    [key: string]: {
      visible: boolean;
      id: string;
      filters?: string[];
    };
  }>({
    player: {
      visible: false,
      filters: [],
      id: "players",
    },
    hub: {
      visible: false,
      id: "hub",
    },
    radar: {
      visible: false,
      id: "radio_tower",
    },
    train: {
      visible: false,
      id: "train",
    },
    train_station: {
      visible: false,
      id: "train_station",
    },
    drone: {
      visible: false,
      id: "drone",
    },
    drone_station: {
      visible: false,
      id: "drone_station",
    },
    truck_station: {
      visible: false,
      id: "truck_station",
    },
    space: {
      visible: false,
      id: "space_elevator",
    },
    vehicles: {
      visible: false,
      filters: [],
      id: "vehicles",
    },
    slugs: {
      visible: false,
      filters: nyaa_slug_filters,
      id: "slug",
    },
    cables: {
      visible: false,
      id: "cables",
    },
    factory: {
      visible: false,
      id: "factory",
    },
    generators: {
      visible: false,
      id: "generators",
    },
    drop: {
      visible: false,
      id: "drop_pod",
    },
    resource_well: {
      visible: false,
      filters: nyaa_resource_filters,
      id: "resource_well",
    },
    resource_node: {
      visible: false,
      filters: nyaa_resource_filters,
      id: "resource_node",
    },
    belts: {
      visible: true,
      id: "belts",
    },
  });

  useEffect(() => {
    setUwU((prevNyaa) => ({
      ...prevNyaa,
      slugs: {
        ...prevNyaa.slugs,
        filters: nyaa_slug_filters,
      },
      resource_well: {
        ...prevNyaa.resource_well,
        filters: nyaa_resource_filters,
      },
      resource_node: {
        ...prevNyaa.resource_node,
        filters: nyaa_resource_filters,
      },
    }));
  }, [nyaa_resource_filters, nyaa_slug_filters]);

  const [data, setData] = useState({
    player: {
      url: "getPlayer",
      data: [],
    },
    hub: {
      url: "getHUBTerminal",
      data: [],
    },
    radar: {
      url: "getRadarTower",
      data: [],
    },
    train: {
      url: "getTrains",
      data: [],
    },
    train_station: {
      url: "getTrainStation",
      data: [],
    },
    drone: {
      url: "getDrone",
      data: [],
    },
    drone_station: {
      url: "getDroneStation",
      data: [],
    },
    truck_station: {
      url: "getTruckStation",
      data: [],
    },
    space: {
      url: "getSpaceElevator",
      data: [],
    },
    vehicles: {
      url: "getVehicles",
      data: [],
    },
    slugs: {
      url: "getPowerSlug",
      data: [],
    },
    cables: {
      url: "getCables",
      data: [],
    },
    factory: {
      url: "getFactory",
      data: [],
    },
    generators: {
      url: "getGenerators",
      data: [],
    },
    drop: {
      url: "getDropPod",
      data: [],
    },
    resource_well: {
      url: "getResourceWell",
      data: [],
    },
    resource_node: {
      url: "getResourceNode",
      data: [],
    },
    belts: {
      url: "getBelts",
      data: [],
    },
  });

  const master = [
    new IconLayer({
      coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
      data: data.hub.data,
      getIcon: (d) => {
        return {
          height: 70,
          url: misc.hub,
          width: 70,
        };
      },
      getPosition: (d: any) => [d.location.x, d.location.y * -1],
      getSize: 70,
      id: "hub",
      pickable: true,
      visible: nyaa.hub.visible,
      updateTriggers: {
        visible: nyaa.hub.visible,
      },
    }),
    new IconLayer({
      coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
      data: data.radar.data,
      getIcon: (d) => {
        return {
          url: misc.radar_tower,
          width: 70,
          height: 70,
        };
      },
      getPosition: (d: any) => [d.location.x, d.location.y * -1],
      getSize: 70,
      id: "radio_tower",
      pickable: true,
      visible: nyaa.radar.visible,
      updateTriggers: {
        visible: nyaa.radar.visible,
      },
    }),
    new IconLayer({
      coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
      data: data.train_station.data,
      getIcon: (d) => {
        return {
          height: 70,
          url: misc.vehicles.trains.train_station,
          width: 70,
        };
      },
      getPosition: (d: any) => [d.location.x, d.location.y * -1],
      getSize: 70,
      id: "train_station",
      pickable: true,
      visible: nyaa.train_station.visible,
      updateTriggers: {
        visible: nyaa.train_station.visible,
      },
    }),
    new IconLayer({
      coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
      data: data.train.data,
      getIcon: (d) => {
        return {
          height: 70,
          url: misc.vehicles.trains.train,
          width: 70,
        };
      },
      getPosition: (d: any) => [d.location.x, d.location.y * -1],
      getSize: 70,
      id: "train",
      pickable: true,
      visible: nyaa.train.visible,
      updateTriggers: {
        visible: nyaa.train.visible,
      },
    }),
    new IconLayer({
      coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
      data: data.drone_station.data,
      getIcon: (d) => {
        return {
          height: 70,
          url: misc.drones.drone_station,
          width: 70,
        };
      },
      getPosition: (d: any) => [d.location.x, d.location.y * -1],
      getSize: 70,
      id: "drone_station",
      pickable: true,
      visible: nyaa.drone_station.visible,
      updateTriggers: {
        visible: nyaa.drone_station.visible,
      },
    }),
    new IconLayer({
      coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
      data: data.drone.data,
      getIcon: (d) => {
        return {
          height: 70,
          url: misc.drones.drone,
          width: 70,
        };
      },
      getPosition: (d: any) => [d.location.x, d.location.y * -1],
      getSize: 70,
      id: "drone",
      pickable: true,
      visible: true,
      updateTriggers: {
        visible: nyaa.hub.visible,
      },
    }),
    new IconLayer({
      coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
      data: data.truck_station.data,
      getIcon: (d) => {
        return {
          height: 70,
          url: misc.vehicles.trucks.truck_station,
          width: 70,
        };
      },
      getPosition: (d: any) => [d.location.x, d.location.y * -1],
      getSize: 70,
      id: "truck_station",
      pickable: true,
      visible: nyaa.truck_station.visible,
      updateTriggers: {
        visible: nyaa.truck_station.visible,
      },
    }),
    new IconLayer({
      coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
      data: data.space.data,
      getIcon: (d) => {
        return {
          height: 70,
          url:
            d["FullyUpgraded"] || d["UpgradeReady"]
              ? misc.space_elevator.space_elevator_ready
              : misc.space_elevator.space_elevator,
          width: 70,
        };
      },
      getPosition: (d: any) => [d.location.x, d.location.y * -1],
      getSize: 70,
      id: "space_elevator",
      pickable: true,
      visible: nyaa.space.visible,
      updateTriggers: {
        visible: nyaa.space.visible,
      },
    }),
    new IconLayer({
      coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
      data: data.player.data,
      getIcon: (d) => {
        return {
          url: d["Dead"]
            ? misc.player.player_dead
            : (d["Online"] as boolean)
              ? misc.player.alive
              : misc.player.player_offline,
          width: 70,
          height: 70,
        };
      },
      getPosition: (d: any) => [d.location.x, d.location.y * -1],
      getSize: 70,
      id: "players",
      pickable: true,
      visible: nyaa.player.visible,
      updateTriggers: {
        visible: nyaa.player.visible,
      },
    }),
    new IconLayer({
      coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
      data: data.vehicles.data,
      getIcon: (d) => {
        return {
          height: 70,
          url:
            {
              BP_Golfcart_C: misc.vehicles.factory_cart,
              BP_Tractor_C: misc.vehicles.tractor,
              BP_Truck_C: misc.vehicles.trucks.truck,
            }[d["ClassName"] as string] ?? misc.vehicles.explorer,
          width: 70,
        };
      },
      getPosition: (d: any) => [d.location.x, d.location.y * -1],
      getSize: 70,
      id: "vehicles",
      pickable: true,
      visible: nyaa.vehicles.visible,
      updateTriggers: {
        visible: nyaa.vehicles.visible,
      },
    }),
    new IconLayer({
      coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
      data: data.slugs.data,
      getIcon: (d) => {
        return {
          url:
            {
              BP_Crystal_C: power_slugs.power_slug_mk1,
              BP_Crystal_mk2_C: power_slugs.power_slug_mk2,
              BP_Crystal_mk3_C: power_slugs.power_slug_mk3,
            }[d["ClassName"] as string] ?? misc.question_mark,
          width: 70,
          height: 70,
        };
      },
      getPosition: (d: any) => [d.location.x, d.location.y * -1],
      getSize: 70,
      id: "slug",
      pickable: true,
      visible: nyaa.slugs.visible,
      updateTriggers: {
        visible: nyaa.slugs.visible,
      },
    }),
    new IconLayer({
      coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
      data: data.drop.data,
      getIcon: (d) => {
        return {
          url: d["Looted"]
            ? misc.drop_pod.drop_pod_collected
            : misc.drop_pod.drop_pod,
          width: 70,
          height: 70,
        };
      },
      getPosition: (d: any) => [d.location.x, d.location.y * -1],
      getSize: 70,
      id: "drop_pod",
      pickable: true,
      visible: nyaa.drop.visible,
      updateTriggers: {
        visible: nyaa.drop.visible,
      },
    }),
    new LineLayer({
      pickable: true,
      id: "cables",
      data: data.cables.data,

      getColor: (d) => [0, 122, 255],
      getSourcePosition: (d) => [d["location0"].x, d["location0"].y * -1],
      getTargetPosition: (d) => [d["location1"].x, d["location1"].y * -1],
      getWidth: 2,
      visible: nyaa.cables.visible,
      updateTriggers: {
        visible: nyaa.cables.visible,
      },
    }),
    new PolygonLayer({
      data: data.factory.data,
      getFillColor: (d: any) => {
        if ((d["ClassName"] as string).includes("Smelter"))
          return new Uint8Array(buildings.smelter.color);
        if ((d["ClassName"] as string).includes("Assembler"))
          return new Uint8Array(buildings.assembler.color);
        if ((d["ClassName"] as string).includes("Constructor"))
          return new Uint8Array(buildings.constructor.color);
        if ((d["ClassName"] as string).includes("Manufacturer"))
          return new Uint8Array(buildings.manufacturer.color);
        if ((d["ClassName"] as string).includes("HadronCollider"))
          return new Uint8Array(buildings.particle_accelerator.color);
        if ((d["ClassName"] as string).includes("Packager"))
          return new Uint8Array(buildings.packager.color);
        if ((d["ClassName"] as string).includes("Refinery"))
          return new Uint8Array(buildings.refinery.color);
        if ((d["ClassName"] as string).includes("Converter"))
          return new Uint8Array(buildings.converter.color);
        if ((d["ClassName"] as string).includes("Foundry"))
          return new Uint8Array(buildings.foundry.color);
        return [100, 100, 100, 100];
      },
      getLineColor: [41, 44, 60],

      getLineWidth: 20,
      getPolygon: (d) => {
        if ((d["ClassName"] as string).includes("Assembler"))
          return getSize(d.location, buildings.assembler);
        if ((d["ClassName"] as string).includes("Constructor"))
          return getSize(d.location, buildings.constructor);
        if ((d["ClassName"] as string).includes("Smelter"))
          return getSize(d.location, buildings.smelter);
        if ((d["ClassName"] as string).includes("Manufacturer"))
          return getSize(d.location, buildings.manufacturer);
        if ((d["ClassName"] as string).includes("HadronCollider"))
          return getSize(d.location, buildings.particle_accelerator);
        if ((d["ClassName"] as string).includes("Packager"))
          return getSize(d.location, buildings.packager);
        if ((d["ClassName"] as string).includes("Refinery"))
          return getSize(d.location, buildings.refinery);
        if ((d["ClassName"] as string).includes("Converter"))
          return getSize(d.location, buildings.converter);
        if ((d["ClassName"] as string).includes("Foundry"))
          return getSize(d.location, buildings.foundry);
        return getSize(d.location, {
          width: 2,
          length: 2,
          color: [100, 100, 100, 100],
        });
      },
      id: "factory",
      lineWidthMinPixels: 1,
      pickable: true,
      visible: nyaa.factory.visible,
      updateTriggers: {
        visible: nyaa.factory.visible,
      },
    }),
    new PolygonLayer({
      data: data.generators.data,
      getFillColor: (d: any) => {
        if ((d["ClassName"] as string).includes("Coal"))
          return new Uint8Array(buildings.coal_generator.color);
        if ((d["ClassName"] as string).includes("GeneratorBiomass"))
          return new Uint8Array(buildings.biomass_generator.color);
        if ((d["ClassName"] as string).includes("IntegratedBiomass"))
          return new Uint8Array(buildings.biomass_generator_integrated.color);
        if ((d["ClassName"] as string).includes("Fuel"))
          return new Uint8Array(buildings.fuel_generator.color);
        if ((d["ClassName"] as string).includes("Nuclear"))
          return new Uint8Array(buildings.nuclear_generator.color);
        return [100, 100, 100, 100];
      },
      getLineColor: [41, 44, 60],

      getLineWidth: 20,
      getPolygon: (d) => {
        if ((d["ClassName"] as string).includes("Coal"))
          return getSize(d.location, buildings.coal_generator);
        if ((d["ClassName"] as string).includes("GeneratorBiomass"))
          return getSize(d.location, buildings.biomass_generator);
        if ((d["ClassName"] as string).includes("IntegratedBiomass"))
          return getSize(d.location, buildings.biomass_generator_integrated);
        if ((d["ClassName"] as string).includes("Fuel"))
          return getSize(d.location, buildings.fuel_generator);
        if ((d["ClassName"] as string).includes("Nuclear"))
          return getSize(d.location, buildings.nuclear_generator);
        return getSize(d.location, {
          color: [100, 100, 100, 100],
          length: 2,
          width: 2,
        });
      },
      id: "generators",
      lineWidthMinPixels: 1,
      pickable: true,
      visible: nyaa.generators.visible,
      updateTriggers: {
        visible: nyaa.generators.visible,
      },
    }),
    new IconLayer({
      pickable: true,
      id: "resource_well",
      getPosition: (d: any) => {
        return [d.location.x, d.location.y * -1];
      },
      getIcon: (d) => {
        return {
          url: d["ClassName"]
            ? `${resources + d["ClassName"]}/${d["Purity"].toLowerCase()}.png`
            : misc.question_mark,
          width: 70,
          height: 70,
        };
      },
      data: data.resource_well.data,
      getSize: 70,
      coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
      visible: nyaa.resource_well.visible,
      updateTriggers: {
        visible: nyaa.resource_well.visible,
      },
    }),
    new IconLayer({
      pickable: true,
      id: "resource_node",
      getPosition: (d: any) => {
        return [d.location.x, d.location.y * -1];
      },
      getIcon: (d) => {
        return {
          url: d["ClassName"]
            ? `${resources + d["ClassName"]}/${d["Purity"].toLowerCase()}.png`
            : misc.question_mark,
          width: 70,
          height: 70,
        };
      },
      data: data.resource_node.data,
      getSize: 70,
      coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
      visible: nyaa.resource_node.visible,
      updateTriggers: {
        visible: nyaa.resource_node.visible,
      },
    }),
    new LineLayer({
      id: "belts",
      data: data.belts.data,

      getColor: [255, 255, 255],
      getIcon: (d: any) => {
        return {
          height: 70,
          url: misc.question_mark,
          width: 70,
        };
      },
      getSourcePosition: (d: any) => [d["location0"].x, d["location0"].y * -1],
      getTargetPosition: (d) => [d["location1"].x, d["location1"].y * -1],
      pickable: true,
      getWidth: 2,
      visible: nyaa.belts.visible,
      updateTriggers: {
        visible: nyaa.belts.visible,
      },
    }),
  ];

  const [filterElement, setFilterElement] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const uwuDataEntries = await Promise.all(
        Object.entries(data).map(async ([key, value]) => {
          let uwuData = await (await fetch(baseURL + value.url)).json();
          return [key, uwuData];
        }),
      );

      let combinedGoodUwUData: { [key: string]: any[] } = {};
      let uniqueItems = new Set();

      uwuDataEntries.forEach(([key, uwuData]) => {
        if (!uwuData) return;

        uwuData.forEach((item: any) => {
          if (
            item["Name"] === "N/A" ||
            (!item["Purity"] && !slugTypes.includes(item["ClassName"]))
          )
            return;

          const bread = slugTypes.includes(item["ClassName"])
            ? "slugs"
            : item["ClassName"];
          const uniqueKey = `${item["ClassName"]}-${item["Purity"]}`;

          if (!uniqueItems.has(uniqueKey)) {
            uniqueItems.add(uniqueKey);

            if (!combinedGoodUwUData[bread]) {
              combinedGoodUwUData[bread] = [];
            }
            combinedGoodUwUData[bread].push(item);
          }
        });
      });

      const purityOrder = {
        Pure: 0,
        Normal: 1,
        Impure: 2,
      };
      Object.keys(combinedGoodUwUData).forEach((className) => {
        combinedGoodUwUData[className].sort((a: any, b: any) => {
          // @ts-ignore
          const itemA = purityOrder[a["Purity"]] ?? a["ClassName"];
          // @ts-ignore
          const itemB = purityOrder[b["Purity"]] ?? a["ClassName"];
          return itemA - itemB;
        });
      });

      setFilterElement(
        <table className="w-full table-auto border-collapse text-xs">
          <thead>
            <tr className="text-left">
              <th className="p-1">Icon</th>
              <th className="p-1">Name</th>
              <th className="p-1 text-center text-[hsl(96,44%,68%)]">Pure</th>
              <th className="p-1 text-center text-[hsl(20,79%,70%)]">Normal</th>
              <th className="p-1 text-center text-[hsl(359,68%,71%)]">
                Impure
              </th>
              <th className="p-1 text-center text-[hsl(200,61%,42%)]">MK1</th>
              <th className="p-1 text-center text-[hsl(26,69%,48%)]">MK2</th>
              <th className="p-1 text-center text-[hsl(288,61%,50%)]">MK3</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(combinedGoodUwUData).map(([_, items]) => {
              const classGroups: { [key: string]: any[] } = {};
              items.forEach((item) => {
                const key = item.ClassName;
                if (!classGroups[key]) classGroups[key] = [];
                classGroups[key].push(item);
              });

              return Object.entries(classGroups).map(([className, group]) => {
                const icon = `markers/normal/${className}.png`;
                const name = group[0].Name;
                const isSlug = slugTypes.includes(className);

                const hasPurity = {
                  Pure: group.some((i) => i.Purity === "Pure"),
                  Normal: group.some((i) => i.Purity === "Normal"),
                  Impure: group.some((i) => i.Purity === "Impure"),
                };

                const slugTier = {
                  mk1: className === "BP_Crystal_C",
                  mk2: className === "BP_Crystal_mk2_C",
                  mk3: className === "BP_Crystal_mk3_C",
                };

                const colorMap: Record<string, string> = {
                  Pure: "96,44%,68%",
                  Normal: "20,79%,70%",
                  Impure: "359,68%,71%",
                  mk1: "200,61%,42%",
                  mk2: "26,69%,48%",
                  mk3: "288,61%,50%",
                };

                const renderCheck = (type: string) => {
                  const isChecked = slugTier[type as keyof typeof slugTier]
                    ? nyaa_slug_filters.includes(className)
                    : nyaa_resource_filters.includes(`${className}-${type}`);

                  const toggle = () => {
                    if (slugTier[type as keyof typeof slugTier]) {
                      setSlugFilters((prev) =>
                        prev.includes(className)
                          ? prev.filter((f) => f !== className)
                          : [...prev, className],
                      );
                    } else {
                      setResourceFilters((prev) =>
                        prev.includes(`${className}-${type}`)
                          ? prev.filter((f) => f !== `${className}-${type}`)
                          : [...prev, `${className}-${type}`],
                      );
                    }
                  };

                  const show =
                    (!isSlug && hasPurity[type as keyof typeof hasPurity]) ||
                    (isSlug && slugTier[type as keyof typeof slugTier]);

                  return (
                    <td key={type} className="text-center p-1">
                      {show ? (
                        <div
                          onClick={toggle}
                          className="inline-flex items-center justify-center size-5 rounded-full border cursor-pointer"
                          style={{
                            backgroundColor: `hsla(${colorMap[type]}, 0.2)`,
                            borderColor: `hsl(${colorMap[type]})`,
                          }}
                        >
                          {isChecked ? (
                            <Check className="size-4" />
                          ) : (
                            <X className="size-4" />
                          )}
                        </div>
                      ) : (
                        <div className="size-5" />
                      )}
                    </td>
                  );
                };

                return (
                  <tr key={className} className="border-t hover:bg-muted/30">
                    <td className="p-1">
                      <img src={icon} alt={className} className="size-6" />
                    </td>
                    <td className="p-1 truncate max-w-[80px]">{name}</td>
                    {["Pure", "Normal", "Impure", "mk1", "mk2", "mk3"].map(
                      renderCheck,
                    )}
                  </tr>
                );
              });
            })}
          </tbody>
        </table>,
      );
    };

    fetchData();
  }, [nyaa_resource_filters, nyaa_slug_filters]);

  useEffect(() => {
    const nextUpdate = setInterval(() => {
      Object.entries(data).forEach(async ([key, endpoint]) => {
        const nyaaEntry = nyaa[key];
        if (!nyaaEntry?.visible) return;

        const filters = nyaaEntry.filters;

        const response = await fetch(baseURL + endpoint.url);
        const rawData = await response.json();

        const filteredData = rawData.filter((item: any) => {
          if (!filters || filters.length === 0) return true;
          return (
            filters.includes(item["ClassName"]) ||
            filters.includes(`${item["ClassName"]}-${item["Purity"]}`)
          );
        });

        setData((prevData) => ({
          ...prevData,
          [key]: {
            ...endpoint,
            data: filteredData,
          },
        }));
      });
    }, 1000);

    return () => clearInterval(nextUpdate);
  }, [nyaa, nyaa_resource_filters, nyaa_slug_filters]);

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
              <div className={"gap-2 grid grid-cols-2 size-full"}>
                {Object.entries(nyaa).map(([key, value], index) => {
                  // @ts-ignore
                  const uwuLayer = layerStuff[key];
                  return (
                    <Toggle
                      key={key}
                      defaultPressed={value.visible}
                      onPressedChange={(pressed) => {
                        value.visible = pressed;
                        setUwU(nyaa);
                      }}
                      pressed={value.visible}
                      className={
                        "bg-[hsla(29,75%,65%,0.5)] border border-[hsl(29,75%,65%)] data-[state=on]:bg-[hsla(29,75%,65%,0.7)] hover:bg-[hsla(29,75%,65%,0.6)] w-full inline-flex gap-1 text-white"
                      }
                    >
                      <Avatar className={"size-[30px]"}>
                        <AvatarImage src={uwuLayer.icon} />
                        <AvatarFallback>{key}</AvatarFallback>
                      </Avatar>
                      <p>{uwuLayer.label}</p>
                    </Toggle>
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
              html: makePopup(layer?.id, object),
              style: {
                backgroundColor: "transparent",
              },
            }
          );
        }, [])}
      />
    </div>
  );
};

export default MapElement;
