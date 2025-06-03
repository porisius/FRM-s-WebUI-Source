import { RadarTower } from "@/types/radar-tower";

export function radio_tower(data: RadarTower) {
  let popup = {
    title: data.Name,
  };

  return {
    popup: popup,
  };
}
