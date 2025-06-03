"use client";

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {useSettingsStore} from "@/stores/settings";
import {Toggle} from "@/components/ui/toggle";

export default function Settings_Map() {
    const {
        mapFetchSpeed,
        setMapFetchSpeed,
        mapUseInGameColors,
        setMapUseInGameColors,
    } = useSettingsStore();

    return <Card className={"size-full"}>
        <CardHeader>
            <CardTitle className="text-center">Map</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 flex flex-col items-center">
            <div className={"flex flex-col gap-2 w-full"}>
                <div className="grid w-full items-center gap-3">
                    <Label htmlFor="mapFetchSpeedInput">
                        Map Data Fetch Speed (ms)
                    </Label>
                    <Input
                        type="number"
                        id="mapFetchSpeedInput"
                        value={mapFetchSpeed}
                        onChange={e => setMapFetchSpeed(parseInt(e.target.value))}
                    />
                </div>
                <Toggle
                    aria-label="Toggle InGame Building Map Colors"
                    className={"border mt-7"}
                    style={{
                        backgroundColor: mapUseInGameColors
                            ? "hsla(96, 44%, 68%, .2)"
                            : "hsla(359, 68%, 71%, .2)",
                        borderColor: mapUseInGameColors
                            ? "hsla(96, 44%, 68%, 1)"
                            : "hsla(359, 68%, 71%, 1)",
                    }}
                    onPressedChange={toggled => setMapUseInGameColors(toggled)}
                    pressed={mapUseInGameColors}
                >
                    Use InGame building colors in the map (Press to toggle)
                </Toggle>
            </div>
        </CardContent>
    </Card>;
}
