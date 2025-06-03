import { Artifact } from "@/types/artifacts";
import { Artifacts } from "@/enums/artifacts";

export function artifacts(data: Artifact) {
  let popup_color =
    data.ClassName === Artifacts.Somersloop ? "347,82%,58%" : "290,49%,64%";

  let popup = {
    title: data["Name"],
  };

  return {
    popup: popup,
    popup_color: popup_color,
  };
}
