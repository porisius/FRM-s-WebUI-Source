"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useSettingsStore } from "@/stores/settings";

async function checkConnection(URL: string) {
  const urlCleaned = () => {
    let url = URL.trim();
    if (url === "/") return URL;
    url = url.endsWith("/") ? url : `${url}/`;
    return /^https?:\/\//i.test(url) ? url : `http://${url}`;
  };

  try {
    const res = await fetch(urlCleaned() + "getCoffee");
    return res.status === 418;
  } catch {
    return false;
  }
}

export default function Settings_API() {
  const { baseURL, fetchSpeed, setBaseURL, setFetchSpeed, _hasHydrated } =
    useSettingsStore();
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!_hasHydrated) return;
    (async () => {
      const isConnected = (await checkConnection(baseURL)) || false;
      setConnected(isConnected);
    })();
  }, [_hasHydrated, baseURL]);

  if (!_hasHydrated) return null;

  return (
    <Card className={"size-full"}>
      <CardHeader>
        <CardTitle className="text-center">API</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 flex flex-col items-center">
        <div className={"flex flex-col gap-2 w-full"}>
          <div className="grid w-full items-center gap-3">
            <Label htmlFor="baseURLInput">
              API Url (http://example:8080 or /)
            </Label>
            <Input
              type="text"
              id="baseURLInput"
              value={baseURL}
              onChange={(e) => setBaseURL(e.target.value)}
              placeholder="API Url"
              style={{
                backgroundColor: connected
                  ? "hsla(96, 44%, 68%, .2)"
                  : "hsla(359, 68%, 71%, .2)",
                borderColor: connected
                  ? "hsl(96, 44%, 68%)"
                  : "hsl(359, 68%, 71%)",
              }}
            />
          </div>
          <div className="grid w-full items-center gap-3">
            <Label htmlFor="fetchSpeedInput">Data Fetch Speed (ms)</Label>
            <Input
              type="number"
              id="fetchSpeedInput"
              value={fetchSpeed}
              onChange={(e) => setFetchSpeed(parseInt(e.target.value))}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
