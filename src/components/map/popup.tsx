import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Check, X, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import React, { ReactElement } from "react";
import { renderToString } from "react-dom/server";
import { classNameColors, colors, dev, purityColors } from "@/lib/constants";
import { adjustColorShades, RGB, rgbToHsl } from "@/lib/helpers";
import { Layer } from "deck.gl";

const BoolBadge = ({ bool, text }: { bool: boolean; text: string }) => (
  <Badge
    style={{
      backgroundColor: `hsla(${bool ? colors.green : colors.red}, 0.2)`,
      borderColor: `hsl(${bool ? colors.green : colors.red})`,
      color: `hsl(${bool ? colors.green : colors.red})`,
    }}
    className="w-full justify-center items-center border relative inline-flex"
    variant="outline"
  >
    {bool ? (
      <Check className="size-4 absolute left-[5px]" />
    ) : (
      <X className="size-4 absolute left-[5px]" />
    )}
    {text}
  </Badge>
);

export const makePopup = (layer: Layer | any, data: any) => {
  const layerId: string = layer.id;
  let popup: {
    title: string | ReactElement<any>;
    description: string | ReactElement<any>;
  } = {
    title: "",
    description: <></>,
  };

  let popup_color = purityColors[data["Purity"] as string] ?? "229deg,13%,52%";

  const original_text_color = popup_color;
  let text_color = popup_color;

  switch (layerId) {
    case "players":
      popup.title = `Player: ${data["Name"] || "Offline"}`;
      popup_color = data["Dead"]
        ? colors.orange
        : (data["Online"] as boolean)
          ? colors.green
          : colors.red;
      break;
    case "vehicles":
      popup = {
        title: data["Name"],
        description: (
          <div>
            <ul className="ml-6 list-disc [&>li]:mt-2">
              <li>Current Gear: {data["CurrentGear"]}</li>
              <li>Forward Speed: {data["ForwardSpeed"]}</li>
              <li>Engine RPM: {data["EngineRPM"]}</li>
              <li>Throttle Percent: {data["ThrottlePercent"]}</li>
              <li>Path Name: {data["PathName"]}</li>
            </ul>
            <Separator className={"my-2 bg-white"} />
            <div className={"flex flex-col gap-1"}>
              <BoolBadge bool={data["FollowingPath"]} text={"Following Path"} />
              <BoolBadge bool={data["Autopilot"]} text={"Autopilot"} />
            </div>
          </div>
        ),
      };
      break;
    case "truck_station":
      popup = {
        title: data["Name"],
        description: (
          <div>
            <p>LoadMode: WIP</p>
          </div>
        ),
      };
      break;
    case "drone":
      popup = {
        title: data["Name"],
        description: (
          <div>
            <p>Destination: {data["CurrentDestination"]}</p>
            <p>Flying Speed: {Math.round(data["FlyingSpeed"])}</p>
            <BoolBadge
              bool={Math.round(data["FlyingSpeed"]) > 0}
              text={"Flying"}
            />
          </div>
        ),
      };
      break;
    case "drone_station":
      popup = {
        title: data["Name"],
        description: <p> Paired Station: {data["PairedStation"]}</p>,
      };
      break;
    case "train":
      popup = {
        title: data["Name"],
        description: (
          <div>
            <ul className="my-2 ml-6 list-disc [&>li]:mt-2">
              <li>Speed: {data["ForwardSpeed"]}</li>
              <li>Train Station: {data["TrainStation"]}</li>
            </ul>
            <BoolBadge bool={data["Derailed"]} text={"Derailed"} />
          </div>
        ),
      };
      break;
    case "train_station":
      popup = {
        title: data["Name"],
        description: (
          <div>
            <ul className="my-2 ml-6 list-disc [&>li]:mt-2">
              <li>Transfer Rate: {data["TransferRate"]}</li>
              <li>Inflow rate: {data["InflowRate"]}</li>
              <li>Outflow rate: {data["OutflowRate"]}</li>
            </ul>
          </div>
        ),
      };
      break;
    case "radio_tower":
      popup.title = data["Name"];
      break;
    case "slugs":
      popup_color =
        classNameColors[data["ClassName"] as keyof typeof classNameColors] ??
        "229deg,13%,52%";
      popup.title = (
        <div>
          {
            {
              BP_Crystal_C: "MK1",
              BP_Crystal_mk2_C: "MK2",
              BP_Crystal_mk3_C: "MK3",
            }[data["ClassName"] as string]
          }
          {" Power Slug"}
        </div>
      );
      break;
    case "space_elevator":
      let fully_upgraded_color = data["FullyUpgraded"]
        ? colors.green
        : colors.red;
      let upgrade_ready_color = data["UpgradeReady"]
        ? colors.green
        : colors.red;
      popup_color =
        data["FullyUpgraded"] || data["UpgradeReady"]
          ? colors.green
          : colors.red;
      popup = {
        title: data["Name"],
        description: (
          <div>
            <ul className="ml-6 list-disc [&>li]:mt-2">
              {data["CurrentPhase"].map(
                (item: {
                  Name: string;
                  ClassName: string;
                  Amount: number;
                  RemainingCost: number;
                  TotalCost: number;
                }) => (
                  <li key={item.ClassName + data["ID"]}>
                    {item.Name} {item.Amount}/{item.TotalCost}
                  </li>
                ),
              )}
            </ul>
            <div className={"flex flex-col gap-1"}>
              <Badge
                style={{
                  backgroundColor: `hsla(${fully_upgraded_color}, 0.2)`,
                  borderColor: `hsl(${fully_upgraded_color})`,
                  color: `hsl(${fully_upgraded_color})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                className={"w-full justify-center border relative inline-flex"}
                variant={"outline"}
              >
                {data["FullyUpgraded"] ? (
                  <Check className="size-4 absolute left-[5px]" />
                ) : (
                  <X className="size-4 absolute left-[5px]" />
                )}
                {data["FullyUpgraded"]
                  ? "Fully Upgraded 🎉"
                  : "Not Fully Upgraded"}
              </Badge>
              <Badge
                style={{
                  backgroundColor: `hsla(${upgrade_ready_color}, 0.2)`,
                  borderColor: `hsl(${upgrade_ready_color})`,
                  color: `hsl(${upgrade_ready_color})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                className={"w-full justify-center border relative inline-flex"}
                variant={"outline"}
              >
                {data["UpgradeReady"] ? (
                  <Check className="size-4 absolute left-[5px]" />
                ) : (
                  <X className="size-4 absolute left-[5px]" />
                )}
                {data["UpgradeReady"] ? "Upgrade Ready" : "Upgrade Not Ready"}
              </Badge>
            </div>
          </div>
        ),
      };
      break;
    case "drop_pod":
      popup_color = data["Looted"] ? colors.green : colors.red;
      popup = {
        title: "Drop Pod",
        description: (
          <div>
            <div className={"flex flex-col items-center " + "gap-1"}>
              {data.RequiredItem.Name != "N/A" && (
                <Badge
                  style={{
                    backgroundColor: `hsla(${data.RequiredItem.Amount == data.RequiredItem.MaxAmount ? colors.green : colors.red}, 0.2)`,
                    borderColor: `hsl(${data.RequiredItem.Amount == data.RequiredItem.MaxAmount ? colors.green : colors.red})`,
                    color: `hsl(${data.RequiredItem.Amount == data.RequiredItem.MaxAmount ? colors.green : colors.red})`,
                  }}
                  className="w-full justify-center border relative mt-1"
                  variant="outline"
                >
                  {`${data.RequiredItem.Name} ${data.RequiredItem.Amount}/${data.RequiredItem.MaxAmount}`}
                </Badge>
              )}

              {data["RequiredPower"] !== 0 && (
                <Badge
                  style={{
                    backgroundColor: "hsla(40deg, 62%, 73%, 0.2)",
                    borderColor: "hsl(40deg, 62%, 73%)",
                    color: "hsl(40deg, 62%, 73%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  className={"w-full justify-center border relative"}
                  variant={"outline"}
                >
                  <Zap className="size-4 absolute left-[5px]" />
                  {data["RequiredPower"]}
                </Badge>
              )}

              <Badge
                style={{
                  backgroundColor: `hsla(${popup_color}, 0.2)`,
                  borderColor: `hsl(${popup_color})`,
                  color: `hsl(${popup_color})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                className={"w-full justify-center border relative inline-flex"}
                variant={"outline"}
              >
                {data["Looted"] ? (
                  <Check className="size-4 absolute left-[5px]" />
                ) : (
                  <X className="size-4 absolute left-[5px]" />
                )}
                {data["Looted"] ? "Looted" : "Not Looted"}
              </Badge>
            </div>
          </div>
        ),
      };
      break;
    case "resource_node":
    case "resource_geyser":
    case "resource_well": {
      const typeLabel = {
        resource_node: "Resource Node",
        resource_geyser: "Resource Geyser",
        resource_well: "Resource Well",
      }[layerId];

      popup = {
        title: `${data["Name"]} ${typeLabel}`,
        description: (
          <div>
            <Badge
              style={{
                backgroundColor: `hsla(${popup_color}, 0.2)`,
                borderColor: `hsl(${popup_color})`,
                color: `hsl(${popup_color})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              className={"w-full justify-center border relative inline-flex"}
              variant={"outline"}
            >
              {data["Purity"]}
            </Badge>
            <BoolBadge bool={data["Exploited"]} text={"Exploited"} />
          </div>
        ),
      };
      break;
    }
    case "factory":
      popup = {
        title: data["Name"],
        description: (
          <div>
            <ul className="my-2 ml-6 list-disc [&>li]:mt-2">
              <li>Recipe: {data["Recipe"]}</li>
              <li>Manu Speed: {data["ManuSpeed"]}%</li>
            </ul>
            <div className={"gap-1 flex flex-col"}>
              <BoolBadge bool={data["IsConfigured"]} text={"Is Configured"} />
              <BoolBadge bool={data["IsProducing"]} text={"Is Producing"} />
              <BoolBadge bool={data["IsPaused"]} text={"Is Paused"} />
            </div>
          </div>
        ),
      };
      break;
    case "generators":
      popup = {
        title: data["Name"],
        description: (
          <div>
            <ul className="my-2 ml-6 list-disc [&>li]:mt-2">
              <li>Base Prod: {data["BaseProd"]}MW</li>
              <li>Fuel Amount: {data["FuelAmount"]}</li>
            </ul>
            <div className={"gap-1 flex flex-col"}>
              <BoolBadge bool={data["IsFullSpeed"]} text={"Is Full Speed"} />
              <BoolBadge bool={data["CanStart"]} text={"Can Start"} />
            </div>
          </div>
        ),
      };
      break;
    case "hub":
      popup = {
        title: data["Name"],
        description: (
          <div>
            <ul className="my-2 ml-6 list-disc [&>li]:mt-2">
              <li>Current Active Schematic: {data["SchName"]}</li>
              <li>Time till Drone Ship returns: {data["ShipReturn"]}</li>
            </ul>
            <div className={"gap-1 flex flex-col"}>
              <BoolBadge
                bool={data["ShipDock"]}
                text={"Is Drone Ship in HUB"}
              />
            </div>
          </div>
        ),
      };
      break;
    case "artifacts":
      switch (data["Name"]) {
        case "Somersloop":
          popup_color = "347,82%,58%";
          break;
        case "Mercer Sphere":
          popup_color = "290,49%,64%";
          break;
      }
      popup.title = data["Name"];
      break;
    case "belts": {
      const color_popup = rgbToHsl(layer.props.getColor(data));
      const tier = +(
        data.features.properties.name.match(/Mk\.(\d+)/)?.[1] ?? NaN
      );
      const color_text = rgbToHsl(
        adjustColorShades(layer.props.getColor(data), 5, 0.85, false)[
          tier - 1
        ] as RGB,
      );
      popup_color = `${color_popup[0]},${color_popup[1]}%,${color_popup[2]}%`;
      text_color = `${color_text[0]},${color_text[1]}%,${color_text[2]}%`;
      popup = {
        title: data["Name"],
        description: (
          <ul className="my-2 ml-6 list-disc [&>li]:mt-2">
            <li>Items Per Minute: {data["ItemsPerMinute"]}</li>
          </ul>
        ),
      };
      break;
    }
    case "pipes": {
      const color_popup = rgbToHsl(layer.props.getColor(data));
      const tier = +(
        data.features.properties.name.match(/Mk\.(\d+)/)?.[1] ?? NaN
      );
      const color_text = rgbToHsl(
        adjustColorShades(layer.props.getColor(data), 1, 0.85, false)[
          tier - 1
        ] as RGB,
      );
      popup_color = `${color_popup[0]},${color_popup[1]}%,${color_popup[2]}%`;
      text_color = `${color_text[0]},${color_text[1]}%,${color_text[2]}%`;

      popup = {
        title: data["Name"],
        description: (
          <ul className="my-2 ml-6 list-disc [&>li]:mt-2">
            <li>Speed: {data["Speed"]}</li>
          </ul>
        ),
      };
      break;
    }
    default:
      popup = {
        title: data.Name ?? data.ClassName ?? "Unknown",
        description: `ID: ${data["ID"]}`,
      };
      break;
  }

  if (original_text_color == text_color && text_color != popup_color)
    text_color = popup_color;

  return renderToString(
    <Card
      className="relative backdrop-blur-md bg-card border overflow-hidden"
      style={{
        borderColor: `hsl(${popup_color})`,
        color: `hsl(${text_color})`,
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none rounded-inherit"
        style={{
          backgroundColor: `hsla(${popup_color}, 0.4)`,
          zIndex: 0,
        }}
      />
      <div className="relative z-10">
        <CardContent>
          <Badge
            className="w-full justify-center items-center border relative inline-flex text-xl py-1 mb-1"
            style={{
              backgroundColor: `hsla(${text_color},0.2)`,
              borderColor: `hsl(${text_color})`,
              color: `hsl(${text_color})`,
            }}
            variant={"outline"}
          >
            {typeof popup.title === "string" ? (
              <CardTitle>{popup.title}</CardTitle>
            ) : (
              popup.title
            )}
          </Badge>
          {typeof popup.description === "string" ? (
            <CardDescription>{popup.description}</CardDescription>
          ) : (
            popup.description
          )}
          {dev && <CardDescription>{data.ClassName}</CardDescription>}
        </CardContent>
      </div>
    </Card>,
  );
};
