"use client";
import Link from "next/link";
import { author } from "@/lib/constants";
import { MagicCard } from "@/components/magicui/magic-card";
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";

export default function Thanks() {
  const thxTo = [
    {
      link: "https://discordapp.com/users/227473074616795137",
      name: "Feyko",
      reason: "Support and guidance to a noob Unreal Engine modder",
    },
    {
      link: "https://discordapp.com/users/187385442549628928",
      name: "Robb",
      reason: "Answering my dumb questions",
    },
    {
      link: "https://discordapp.com/users/135134753534771201",
      name: "Vilsol",
      reason:
        "Also answering my dumb questions and helping with the documentation system",
    },
    {
      link: "https://discordapp.com/users/277050857852370944",
      name: "Nog",
      reason: "Answering the dumbest of my questions",
    },
    {
      link: "https://discordapp.com/users/163955176313585666",
      name: "Archengius",
      reason: "Helping with the UE Garbage Collection Issue",
    },
    {
      link: "https://discordapp.com/users/293484684787056640",
      name: "Deantendo",
      reason: "Icon/Graphic for FRM",
    },
    {
      link: "https://discordapp.com/users/294943551605702667",
      name: "Andre Aquila",
      reason:
        "Production Stats code for FRM (Seriously, that would have taken me forever to develop",
    },
    {
      link: "https://discordapp.com/users/186896287856197633",
      name: "Badger",
      reason: "For the FRM Companion App",
    },
    {
      link: "https://discordapp.com/users/509759568037937152",
      name: "BLAndrew575",
      reason:
        "For giving me a crazy world to brutally stress test the getFactory caching function",
    },
    {
      link: author.url,
      name: `🍞 ${author.name} 🩷`,
      reason: "Contributions to FRM's native web UI",
    },
    {
      link: "https://discordapp.com/users/130401633564753920",
      name: "FeatheredToast",
      reason: "Finding and helping resolve the dumb things I did dumb",
    },
    {
      link: "https://discord.gg/amuR4xyqP8",
      name: "Satisfactory Modding Discord",
      reason:
        "For motivating me and letting me vent as I go through my day and also develop this mod",
    },
  ];

  return (
    <div
      className={
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[5px] m-[5px] mt-[25px] justify-center"
      }
    >
      {thxTo.map((thanks, i) => (
        <Link
          href={thanks.link}
          className={"w-full h-full rounded-md z-1"}
          key={i + thanks.name}
          rel="noopener noreferrer"
          target="_blank"
        >
          <MagicCard
            className={"rounded-md w-full h-full"}
            gradientFrom={"#e8a361"}
            gradientTo={"#ca6d35"}
          >
            <div className="p-4">
              <h1 className={"leading-none font-semibold"}>{thanks.name}</h1>
              <span className={"text-muted-foreground text-sm"}>
                {thanks.reason}
              </span>
            </div>
          </MagicCard>
        </Link>
      ))}
      <div className={"absolute inset-0 w-[100vw] overflow-hidden"}>
        <AnimatedGridPattern
          color={"#e8a361"}
          numSquares={100}
          duration={0.2}
          repeatDelay={1}
          className={"skew-y-12 inset-y-[-20%] h-[140vh]"}
        />
      </div>
    </div>
  );
}
