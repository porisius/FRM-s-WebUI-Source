import packageJson from "../../package.json";

export const dev = process.env.NODE_ENV !== "production";
export const appVersion = packageJson.version;
export const author = packageJson.author;
export const repo = packageJson.repository;

export const colors = {
  green: "96,44%,68%",
  orange: "20,79%,70%",
  red: "359,68%,71%",
  blue: "222,74%,74%",
  white: "227,70%,87%",
  yellow: "40,62%,73%",
};

export const classNameColors = {
  BP_WAT2_C: "290,49%,64%", // Mercer Sphere
  BP_WAT1_C: "347,82%,58%", // Somersloop
  BP_Crystal_C: "200,61%,42%",
  BP_Crystal_mk2_C: "26,69%,48%",
  BP_Crystal_mk3_C: "288,61%,50%",
};

export const purityColors: Record<string, string> = {
  Pure: colors.green,
  Normal: colors.orange,
  Impure: colors.red,
};
