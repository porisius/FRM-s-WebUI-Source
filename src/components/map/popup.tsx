import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Check, X, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import React, { ReactElement } from "react";
import { renderToString } from "react-dom/server";
import { dev } from "@/lib/constants";

const BoolBadge = ({ bool, text }: { bool: boolean; text: string }) => (
  <Badge
    style={{
      backgroundColor: `hsla(${bool ? "96deg,44%,68%" : "359deg,68%,71%"}, 0.2)`,
      borderColor: `hsl(${bool ? "96deg,44%,68%" : "359deg,68%,71%"})`,
      color: `hsl(${bool ? "96deg,44%,68%" : "359deg,68%,71%"})`,
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

export const makePopup = (layerId: string | undefined, data: any) => {
  let popup: {
    title: string | ReactElement<any>;
    description: string | ReactElement<any>;
  } = {
    title: "",
    description: <></>,
  };

  let popup_color =
    {
      Pure: "96deg,44%,68%",
      Normal: "20deg,79%,70%",
      Impure: "359deg,68%,71%",
    }[data["Purity"] as string] ?? "229deg,13%,52%";

  switch (layerId) {
    case "players":
      popup.title = `Player: ${data["Name"] || "Offline"}`;
      popup_color = data["Dead"]
        ? "20deg,79%,70%"
        : (data["Online"] as boolean)
          ? "96deg,44%,68%"
          : "359deg,68%,71%";
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
    case "slug":
      popup_color =
        {
          BP_Crystal_C: "200,61%,42%",
          BP_Crystal_mk2_C: "26,69%,48%",
          BP_Crystal_mk3_C: "288,61%,50%",
        }[data["ClassName"] as string] ?? "229deg,13%,52%";
      popup = {
        title: data["Name"],
        description: (
          <div className={"inline-flex items-center gap-1"}>
            <CardTitle>Slug</CardTitle>
            <Badge
              style={{
                backgroundColor: `hsla(${popup_color}, 0.2)`,
                borderColor: `hsl(${popup_color})`,
                color: `hsl(${popup_color})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              className={`w-full justify-center border`}
              variant={"outline"}
            >
              {
                {
                  BP_Crystal_C: "MK1",
                  BP_Crystal_mk2_C: "MK2",
                  BP_Crystal_mk3_C: "MK3",
                }[data["ClassName"] as string]
              }
            </Badge>
          </div>
        ),
      };
      break;
    case "space_elevator":
      let fully_upgraded_color = data["FullyUpgraded"]
        ? "96deg,44%,68%"
        : "359deg,68%,71%";
      let upgrade_ready_color = data["UpgradeReady"]
        ? "96deg,44%,68%"
        : "359deg,68%,71%";
      popup_color =
        data["FullyUpgraded"] || data["UpgradeReady"]
          ? "96deg,44%,68%"
          : "359deg,68%,71%";
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
      popup_color = data["Looted"] ? "96deg,44%,68%" : "359deg,68%,71%";
      popup = {
        title: "Drop Pod",
        description: (
          <div>
            <div className={"gap-1 flex items-center flex-col"}>
              {data["RepairItem"] != "No Item" ||
                (data["RepairAmount"] !== 0 && (
                  <Badge
                    style={{
                      backgroundColor: "hsla(227deg, 17%, 58%, 0.2)",
                      borderColor: "hsl(227deg, 17%, 58%)",
                      color: "hsl(227deg, 17%, 58%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    className={"w-full justify-center border"}
                    variant={"outline"}
                  >
                    {data["RepairItem"]} {data["RepairAmount"]}
                  </Badge>
                ))}

              {data["PowerRequired"] !== 0 && (
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
                  {data["PowerRequired"]}
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
      popup = {
        title: `${data["Name"]} Resource Node`,
        description: (
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
        ),
      };
      break;
    case "resource_geyser":
      popup = {
        title: `${data["Name"]} Resource Geyser`,
        description: (
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
        ),
      };
      break;
    case "resource_well":
      popup = {
        title: `${data["Name"]} Resource Well`,
        description: (
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
        ),
      };
      break;
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
    default:
      popup = {
        title: data.Name ?? data.ClassName ?? "Unknown",
        description: `ID: ${data["ID"]}`,
      };
      break;
  }
  return renderToString(
    <Card
      className={"backdrop-blur-md bg-card/50"}
      style={{ borderColor: `hsl(${popup_color})` }}
    >
      <CardContent>
        {typeof popup.title === "string" ? (
          <CardTitle>{popup.title}</CardTitle>
        ) : (
          popup.title
        )}
        {typeof popup.description === "string" ? (
          <CardDescription>{popup.description}</CardDescription>
        ) : (
          popup.description
        )}
        {dev && <CardDescription>{data.ClassName}</CardDescription>}
      </CardContent>
    </Card>,
  );
};
