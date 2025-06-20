import { adjustColorShades, RGB, rgbToHsl } from "@/lib/helpers";
import React from "react";
import { ArrowLeft, ArrowRight, ArrowUp } from "lucide-react";

export function belts(data: any, layer: any) {
  const color_popup = rgbToHsl(layer.props.getColor(data));
  const color_text = rgbToHsl([153, 209, 219]);

  let popup_color = `${color_popup[0]},${color_popup[1]}%,${color_popup[2]}%`;
  let text_color = `${color_text[0]},${color_text[1]}%,${color_text[2]}%`;

  let popup = {
    title: data["Name"],
    description: (
      <ul className="my-2 ml-6 list-disc [&>li]:mt-2">
        <li>Items Per Minute: {data["ItemsPerMinute"]}</li>
      </ul>
    ),
  };

  return {
    popup: popup,
    popup_color: popup_color,
    text_color: text_color,
  };
}

export function splitter_merger(data: any) {
  const colors = adjustColorShades([153, 209, 219], 5) as RGB[];
  const classNames = [
    "Build_ConveyorAttachmentMerger_C",
    "Build_ConveyorAttachmentSplitter_C",
    "Build_ConveyorAttachmentMergerPriority_C",
    "Build_ConveyorAttachmentSplitterSmart_C",
    "Build_ConveyorAttachmentSplitterProgrammable_C",
  ];
  const color_popup = rgbToHsl(colors[classNames.indexOf(data.ClassName) ?? 5]);
  const color_text = rgbToHsl([153, 209, 219]);

  let popup_color = `${color_popup[0]},${color_popup[1]}%,${color_popup[2]}%`;
  let text_color = `${color_text[0]},${color_text[1]}%,${color_text[2]}%`;

  const inClass = "size-5 text-[hsl(96,44%,68%)]";
  const outClass = "size-5 text-[hsl(359,68%,71%)]";
  const cellClass = "size-5 invisible";

  const isMerger = data.ClassName.includes("Merger");

  let popup = {
    title: data["Name"],
    description: (
      <div className="w-full h-20 flex items-center justify-center mt-2">
        <div
          className="flex items-center justify-center size-20 border rounded-full p-2 relative before:bg-card before:inset-0 before:absolute before:rounded-full before:z-[-1]"
          style={{
            backgroundColor: `hsla(${text_color},0.5)`,
            borderColor: `hsl(${text_color})`,
          }}
        >
          <div
            className="grid grid-cols-3 grid-rows-3 gap-1"
            style={{
              transform: `rotate(${data.location.rotation}deg)`,
              transformOrigin: "center",
            }}
          >
            <div className={cellClass} />
            {isMerger ? (
              <ArrowUp className={outClass} />
            ) : (
              <ArrowUp className={outClass} />
            )}
            <div className={cellClass} />
            {isMerger ? (
              <ArrowRight className={inClass} />
            ) : (
              <ArrowLeft className={outClass} />
            )}
            <div className={cellClass} />
            {isMerger ? (
              <ArrowLeft className={inClass} />
            ) : (
              <ArrowRight className={outClass} />
            )}
            <div className={cellClass} />
            {isMerger ? (
              <ArrowUp className={inClass} />
            ) : (
              <ArrowUp className={inClass} />
            )}
            <div className={cellClass} />
          </div>
        </div>
      </div>
    ),
  };

  return {
    popup: popup,
    popup_color: popup_color,
    text_color: text_color,
  };
}
