"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Settings_API from "@/app/settings/pages/api";
import { appVersion, author } from "@/lib/constants";
import Link from "next/link";
import Settings_Map from "@/app/settings/pages/map";
import Settings_Chat from "@/app/settings/pages/chat";

export default function Settings() {
  return (
    <div className={"m-5"}>
      <Card>
        <CardHeader>
          <CardTitle>Web UI Version : {appVersion}</CardTitle>
          <CardDescription>Web UI settings</CardDescription>
          <Link
            href={author.url}
            className={"text-sm text-muted-foreground underline"}
            rel="noopener noreferrer"
            target="_blank"
          >
            Made By {author.name} 🩷
          </Link>
        </CardHeader>
        <CardContent className={"m-4 gap-5 flex flex-col"}>
          <h3
            className={
              "border rounded-md p-5 text-xl text-[hsl(359,68%,71%)] border-[hsl(359,68%,71%)] bg-[hsla(359,68%,71%,0.1)]"
            }
          >
            Setting the fetching speeds below 100 ms might result in negative
            performance or not work at all!
          </h3>
          <div className="flex w-full gap-5 items-stretch">
            <div className="flex-1">
              <Settings_API />
            </div>
            <div className="flex-1">
              <Settings_Map />
            </div>
            <div className="flex-1">
              <Settings_Chat />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
