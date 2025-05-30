"use client";

// TODO: add inv to the map
// TODO: add chat btn to message with ingame chat on the bottom right

import { baseURL } from "@/lib/api";
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
import { layerStuff, layerStuffType, rotatePoint } from "../map/utils";
import { adjustColorShades, RGB } from "@/lib/helpers";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { classNameColors, colors, purityColors } from "@/lib/constants";

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

const slugClassNames = ["BP_Crystal_C", "BP_Crystal_mk2_C", "BP_Crystal_mk3_C"];

const slugTier = {
  BP_Crystal_C: "MK1",
  BP_Crystal_mk2_C: "MK2",
  BP_Crystal_mk3_C: "MK3",
};

async function getData(url: string) {
  return await (await fetch(baseURL + url)).json();
}

export default function MapPage() {
  const [dataVersion, setDataVersion] = useState<number>(0);

  async function buildFilters() {
    const rawData = await getData("getResourceNode");

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
        className: "BP_WAT2_C",
        name: `Mercer Sphere`,
        extra: ["NoExtra"],
      },
      {
        layerId: "artifacts",
        className: "BP_WAT1_C",
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
      const filters = await buildFilters();
      setBuiltNyaaFilters(filters[0]);
    }
    run();
  }, []);

  const [nyaa, setUwU] = useState(() => {
    return structuredClone(layerStuff);
  });

  const [data, setData] = useState(() => {
    const clone: layerStuffType = structuredClone(layerStuff);
    for (let cloneKey in clone) {
      clone[cloneKey]["data"] = [];
    }
    return clone;
  });

  function MakeIconLayer(
    iconUrl: string,
    id: string,
    getIconFunc?: (d: any) => any,
  ) {
    return new IconLayer({
      coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
      data: data[id].data,
      getIcon: getIconFunc
        ? getIconFunc
        : (d: any) => ({
            height: 70,
            url: iconUrl,
            width: 70,
          }),
      getPosition: (d: any) => [d.location.x, d.location.y * -1],
      getSize: 70,
      id: id,
      pickable: true,
      updateTriggers: {
        visible: nyaa[id].visible,
      },
      visible: nyaa[id].visible,
    });
  }

  const master = [
    MakeIconLayer(misc.hub, "hub"),
    MakeIconLayer(misc.radar_tower, "radar"),
    MakeIconLayer(misc.vehicles.trains.train_station, "train_station"),
    MakeIconLayer(misc.vehicles.trains.train, "train"),
    MakeIconLayer(misc.drones.drone_station, "drone_station"),
    MakeIconLayer(misc.drones.drone, "drone"),
    MakeIconLayer(misc.vehicles.trucks.truck_station, "truck_station"),
    MakeIconLayer(
      misc.space_elevator.space_elevator,
      "space_elevator",
      function (d: any) {
        return {
          height: 70,
          url:
            d["FullyUpgraded"] || d["UpgradeReady"]
              ? misc.space_elevator.space_elevator_ready
              : misc.space_elevator.space_elevator,
          width: 70,
        };
      },
    ),
    MakeIconLayer(misc.player.alive, "players", function (d: any) {
      return {
        url: d["Dead"]
          ? misc.player.player_dead
          : (d["Online"] as boolean)
            ? misc.player.alive
            : misc.player.player_offline,
        width: 70,
        height: 70,
      };
    }),
    MakeIconLayer(misc.vehicles.trucks.truck, "vehicles", function (d: any) {
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
    }),
    MakeIconLayer(power_slugs.power_slug, "slugs", function (d: any) {
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
    }),
    MakeIconLayer(misc.drop_pod.drop_pod, "drop_pod", function (d: any) {
      return {
        url: d["Looted"]
          ? misc.drop_pod.drop_pod_collected
          : misc.drop_pod.drop_pod,
        width: 70,
        height: 70,
      };
    }),
    // MakeIconLayer(misc.question_mark, "resource_well", function (d: any) {
    //   return {
    //     url: d["ClassName"]
    //       ? `${resources + d["ClassName"]}/${d["Purity"].toLowerCase()}.png`
    //       : misc.question_mark,
    //     width: 70,
    //     height: 70,
    //   };
    // }),
    MakeIconLayer(misc.question_mark, "resource_node", function (d: any) {
      return {
        url: d["ClassName"]
          ? `${resources + d["ClassName"]}/${d["Purity"].toLowerCase()}.png`
          : misc.question_mark,
        width: 70,
        height: 70,
      };
    }),
    MakeIconLayer(artifacts.somersloop, "artifacts", function (d) {
      return {
        height: 70,
        url:
          d["Name"] == "Somersloop"
            ? artifacts.somersloop
            : d["Name"] == "Mercer Sphere"
              ? artifacts.mercer_sphere
              : misc.question_mark,
        width: 70,
      };
    }),

    new LineLayer({
      pickable: true,
      id: "cables",
      data: data.cables.data,
      getColor: [44, 117, 255],
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
        const bbox = d.BoundingBox;
        const rotation = d.location.rotation - 90;

        const corners: [number, number][] = [
          [bbox.min.x, bbox.min.y * -1],
          [bbox.max.x, bbox.min.y * -1],
          [bbox.max.x, bbox.max.y * -1],
          [bbox.min.x, bbox.max.y * -1],
        ];

        const center: [number, number] = [d.location.x, d.location.y * -1];

        return corners.map((pt) => rotatePoint(pt, center, rotation));
      },
      positionFormat: "XY",
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
        const bbox = d.BoundingBox;
        const rotation = d.location.rotation - 90; // in degrees: 0, 90, 180, 270

        const corners: [number, number][] = [
          [bbox.min.x, bbox.min.y * -1],
          [bbox.max.x, bbox.min.y * -1],
          [bbox.max.x, bbox.max.y * -1],
          [bbox.min.x, bbox.max.y * -1],
        ];

        // Use the location as the center of rotation
        const center: [number, number] = [d.location.x, d.location.y * -1];

        return corners.map((pt) => rotatePoint(pt, center, rotation));
      },
      positionFormat: "XY",
      id: "generators",
      lineWidthMinPixels: 1,
      pickable: true,
      visible: nyaa.generators.visible,
      updateTriggers: {
        visible: nyaa.generators.visible,
      },
    }),
    new LineLayer({
      id: "belts",
      data: data.belts.data,
      getColor: (d: any) => {
        const colors = adjustColorShades([153, 209, 219], 5) as RGB[];
        const tier = +(
          d.features.properties.name.match(/Mk\.(\d+)/)?.[1] ?? NaN
        );
        return colors[tier - 1];
      },
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
    new LineLayer({
      id: "pipes",
      data: data.pipes.data,

      getColor: (d: any) => {
        const colors = adjustColorShades([255, 204, 153], 1) as RGB[];
        const tier = +(
          d.features.properties.name.match(/Mk\.(\d+)/)?.[1] ?? NaN
        );
        return colors[tier - 1];
      },
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
      visible: nyaa.pipes.visible,
      updateTriggers: {
        visible: nyaa.pipes.visible,
      },
    }),
  ];

  useEffect(() => {
    const nextUpdate = setInterval(() => {
      Object.entries(data).forEach(async ([key, endpoint]) => {
        const nyaaEntry = nyaa[key];
        if (!nyaaEntry?.visible) return;

        const response = await fetch(baseURL + endpoint.url);
        const rawData = await response.json();

        const filteredData = rawData.filter((item: any) => {
          if (
            new_nyaa_filters.length === 0 ||
            !new_nyaa_filters.find((filter) => filter.includes(key))
          )
            return true;

          const extra =
            item.Purity ??
            slugTier[item.ClassName as keyof typeof slugTier] ??
            "NoExtra";
          const filterKey = `${key}-${item.ClassName}-${extra}`;

          return new_nyaa_filters.includes(filterKey);
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
  }, [nyaa, new_nyaa_filters]);

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
            ({ className, name, extra, layerId }: any) => {
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
              html: makePopup(layer, object),
              style: {
                backgroundColor: "transparent",
              },
            }
          );
        }, [])}
      />
    </div>
  );
}
