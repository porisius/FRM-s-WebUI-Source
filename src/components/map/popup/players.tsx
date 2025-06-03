import { colors } from "@/lib/constants";
import { Player } from "@/types/player";

export function players(data: Player) {
  let popup_color = data.Dead
    ? colors.orange
    : (data.Online as boolean)
      ? colors.green
      : colors.red;
  let popup = {
    title: `Player: ${data.Name || "Offline"}`,
  };

  return {
    popup: popup,
    popup_color: popup_color,
  };
}
