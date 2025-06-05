"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useSettingsStore } from "@/stores/settings";
import { MagicCard } from "@/components/magicui/magic-card";
import Link from "next/link";
import { Book, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { colors } from "@/lib/constants";

type SessionInfo = {
  SessionName: string;
  DayLength: number;
  NightLength: number;
  PassedDays: number;
  NumberOfDaysSinceLastDeath: number;
  Hours: number;
  Minutes: number;
  Seconds: number;
  IsDay: boolean;
  TotalPlayDuration: number;
  TotalPlayDurationText: string;
};

type Mod = {
  Name: string;
  SMRName: string;
  Version: string;
  Description: string;
  DocsURL: string;
  AcceptsAnyRemoteVersion: string;
  CreatedBy: string;
  RemoteVersionRange: string;
  RequiredOnRemote: boolean;
};

type ModList = Mod[];

export default function Session() {
  const { baseURL, fetchSpeed, _hasHydrated } = useSettingsStore();

  const [gameInfo, setGameInfo] = useState<Mod | null>(null);
  const [modList, setModlist] = useState<ModList>([]);
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);

  useEffect(() => {
    if (!_hasHydrated) return;

    async function getModList() {
      const data: ModList = (await axios.get(baseURL + "/getModList")).data;

      const gameInfo: Mod | null =
        data.find(
          (mod) =>
            mod.Name === "Satisfactory" &&
            mod.SMRName === "FactoryGame" &&
            mod.CreatedBy === "Coffee Stain Studios AB",
        ) ?? null;

      const filteredMods = data.filter(
        (mod) =>
          !(
            mod.Name === "Satisfactory" &&
            mod.SMRName === "FactoryGame" &&
            mod.CreatedBy === "Coffee Stain Studios AB"
          ),
      );

      setModlist(filteredMods);
      setGameInfo(gameInfo);
    }

    getModList();
  }, [_hasHydrated]);

  useEffect(() => {
    if (!_hasHydrated) return;
    const interval = setInterval(async () => {
      try {
        const data = (await axios.get(baseURL + "/getSessionInfo")).data;
        setSessionInfo(data);
      } catch {}
    }, 1000);
    return () => clearInterval(interval);
  }, [_hasHydrated]);

  return (
    <div className={"flex flex-col items-center m-[5px]"}>
      <MagicCard
        className={"rounded-md h-full w-[50vw]"}
        gradientFrom={"#e8a361"}
        gradientTo={"#ca6d35"}
      >
        <div className="p-4 flex flex-col">
          <h1 className={"leading-none font-semibold"}>
            {sessionInfo?.SessionName}
          </h1>
          <span className={"text-muted-foreground text-sm"}>
            TotalPlayDurationText: {sessionInfo?.TotalPlayDurationText}
          </span>
          <span className={"text-muted-foreground text-sm"}>
            NumberOfDaysSinceLastDeath:{" "}
            {sessionInfo?.NumberOfDaysSinceLastDeath}
          </span>
          <span className={"text-muted-foreground text-sm"}>
            Version: {gameInfo?.Version}
          </span>
        </div>
      </MagicCard>

      <div
        className={
          "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[5px] mt-[25px] justify-center w-full"
        }
      >
        {modList.map((mod) => (
          <MagicCard
            className={"rounded-md w-full h-full"}
            gradientFrom={"#e8a361"}
            gradientTo={"#ca6d35"}
            key={mod.SMRName}
          >
            <div className="p-4 flex flex-col">
              <div className={"inline-flex gap-1 items-center"}>
                <h1 className={"leading-none font-semibold"}>
                  {mod.Name} {mod.Version}
                </h1>
                <Badge
                  variant={"outline"}
                  style={{
                    backgroundColor: `hsla(${
                      mod.RequiredOnRemote ? colors.green : colors.red
                    }, 0.4)`,
                    borderColor: `hsl(${
                      mod.RequiredOnRemote ? colors.green : colors.red
                    })`,
                  }}
                >
                  Required on all clients: {mod.RequiredOnRemote ? "Yes" : "No"}
                </Badge>
              </div>
              <span className={"text-muted-foreground text-sm"}>
                {mod.Description}
              </span>
              {(mod.AcceptsAnyRemoteVersion || mod.DocsURL) && (
                <div className={"mt-2 flex gap-2"}>
                  {mod.AcceptsAnyRemoteVersion && (
                    <Link
                      href={mod.AcceptsAnyRemoteVersion}
                      className={"rounded-md"}
                    >
                      <Button
                        variant={"outline"}
                        size={"icon"}
                        className={"cursor-pointer"}
                      >
                        <Globe />
                      </Button>
                    </Link>
                  )}
                  {mod.DocsURL && (
                    <Link href={mod.DocsURL} className={"rounded-md"}>
                      <Button
                        variant={"outline"}
                        size={"icon"}
                        className={"cursor-pointer"}
                      >
                        <Book />
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </div>
          </MagicCard>
        ))}
      </div>
    </div>
  );
}
