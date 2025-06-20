import { getMkColor, rgbToHsl } from "@/lib/helpers";
import React from "react";

export function pipes(data: any, layer: any) {
  const color_popup = rgbToHsl(layer.props.getColor(data));
  const color_text = rgbToHsl(getMkColor(data.Name, [255, 204, 153], 1));

  let popup_color = `${color_popup[0]},${color_popup[1]}%,${color_popup[2]}%`;
  let text_color = `${color_text[0]},${color_text[1]}%,${color_text[2]}%`;

  let popup = {
    title: data["Name"],
    description: (
      <ul className="my-2 ml-6 list-disc [&>li]:mt-2">
        <li>Speed: {data["Speed"]}</li>
      </ul>
    ),
  };

  return {
    popup: popup,
    popup_color: popup_color,
    text_color: text_color,
  };
}

export function pipe_junctions(data: any) {
  const color = rgbToHsl([255, 204, 153]);
  const color_popup = color;
  const color_text = color;

  let popup_color = `${color_popup[0]},${color_popup[1]}%,${color_popup[2]}%`;
  let text_color = `${color_text[0]},${color_text[1]}%,${color_text[2]}%`;

  let popup = {
    title: data["Name"],
  };

  return {
    popup: popup,
    popup_color: popup_color,
    text_color: text_color,
  };
}
