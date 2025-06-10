"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useSettingsStore } from "@/stores/settings";

export default function Settings_Chat() {
  const { authToken, setAuthToken, username, setUsername } = useSettingsStore();

  return (
    <Card className={"size-full"}>
      <CardHeader>
        <CardTitle className="text-center">Chat</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 flex flex-col items-center">
        <div className={"flex flex-col gap-2 w-full"}>
          <div className="grid w-full items-center gap-3">
            <Label htmlFor="username">Username</Label>
            <Input
              type="text"
              id="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="grid w-full items-center gap-3">
            <Label htmlFor="authorization">Authorization Token</Label>
            <Input
              type="password"
              id="authorization"
              placeholder="Authorization Token"
              value={authToken}
              onChange={(e) => setAuthToken(e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
