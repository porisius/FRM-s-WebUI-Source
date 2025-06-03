import React from "react";
import { colors } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Check, X, Zap } from "lucide-react";
import { DropPod } from "@/types/drop-pod";

export function drop_pod(data: DropPod) {
  let popup_color = data.Looted ? colors.green : colors.red;
  let popup = {
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

  return {
    popup: popup,
    popup_color: popup_color,
  };
}
