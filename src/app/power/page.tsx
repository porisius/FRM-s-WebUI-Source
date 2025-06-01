"use client";
import {DataTable} from "@/app/utils/table/data-table";
import {columns} from "./columns";
import React, {useEffect, useState} from "react";

import {CartesianGrid, Line, LineChart, XAxis, YAxis} from "recharts";
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import {Card} from "@/components/ui/card";
import {DragEndEvent, useDraggable, useDroppable} from "@dnd-kit/core";
import {Button} from "@/components/ui/button";
import {useSettingsStore} from "@stores/settings";
import axios from "axios";

const chartConfig = {
    powercapacity: {
        label: "PowerCapacity",
        color: "#ca9ee6",
    },
    powerproduction: {
        label: "PowerProduction",
        color: "#e78284",
    },
    powerconsumed: {
        label: "PowerConsumed",
        color: "#ef9f76",
    },
    powermaxconsumed: {
        label: "PowerMaxConsumed",
        color: "#e5c890",
    },
} satisfies ChartConfig;

function Droppable(props: any) {
    const {isOver, setNodeRef} = useDroppable({
        id: props.id,
    });
    return (
        <div
            ref={setNodeRef}
            className={"rounded gap-1 flex p-2 border"}
            style={
                isOver
                    ? {
                        backgroundColor: "hsla(220, 14%, 27%, 0.2)",
                        borderColor: "hsl(220, 14%, 27%)",
                    }
                    : {}
            }
        >
            {props.children}
        </div>
    );
}

function Draggable(props: any) {
    const {attributes, listeners, setNodeRef, transform} = useDraggable({
        id: props.id,
    });
    const style = transform
        ? {
            transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        }
        : undefined;

    return (
        <Button ref={setNodeRef} style={style} {...listeners} {...attributes}>
            {props.children}
        </Button>
    );
}

export default function Power() {
    const {
        baseURL,
        fetchSpeed,
        _hasHydrated
    } = useSettingsStore();
    const [data, setData] = useState<any>([]);

    const [rowSelection, setRowSelection] = React.useState<any>({});
    const selectedRowIds: string[] = Object.keys(rowSelection).filter(
        (id: string) => rowSelection[id],
    );

    useEffect(() => {
        if (!_hasHydrated) return;
        const interval = setInterval(async () => {
            try {
                const data = (await axios.get(baseURL + "/getPower")).data;
                setData(data);
            } catch {
            }
        }, fetchSpeed);
        return () => {
            clearInterval(interval);
        };
    }, [_hasHydrated]);

    const [lastSelectedRows, setLastSelectedRows] = useState<any[]>([]);

    useEffect(() => {
        if (selectedRowIds.length > 0) {
            const latestSelectedRowId = selectedRowIds[0];
            const latestRowData = data[parseInt(latestSelectedRowId, 10)];

            if (latestRowData) {
                setLastSelectedRows((prev) => {
                    const updatedRows = [...prev, latestRowData];
                    return updatedRows.slice(-10);
                });
            }
        }
    }, [data]);

    const [switchData, setSwitchData] = useState<any>([]);

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const data = (await axios.get(baseURL + "/getSwitches")).data;
                setSwitchData(data);
            } catch {
            }
        }, fetchSpeed);
        return () => {
            clearInterval(interval);
        };
    }, [_hasHydrated]);

    const [items, setItems] = useState<{
        [key: string]: (string | number)[];
    }>({
        "priority-1": [],
        "priority-2": [],
        "priority-3": [],
        "priority-4": [],
        "priority-5": [],
        "priority-6": [],
        "priority-7": [],
        "priority-8": [],
        undefined: [],
    });

    useEffect(() => {
        let list: any = {
            "priority-1": [],
            "priority-2": [],
            "priority-3": [],
            "priority-4": [],
            "priority-5": [],
            "priority-6": [],
            "priority-7": [],
            "priority-8": [],
            undefined: [],
        };

        switchData.forEach((switchItem: any) => {
            const key =
                switchItem.Priority !== -1
                    ? `priority-${switchItem.Priority}`
                    : "undefined";
            if (list[key]) {
                list[key].push(switchItem);
            } else {
                list["undefined"].push(switchItem);
            }
        });
        setItems(list);
    }, [switchData]);

    const getPriorityMap = () => {
        const map: { [id: string]: string } = {};
        Object.entries(items).forEach(([priority, switchList]) => {
            switchList.forEach((item: any) => {
                map[item.ID] = priority;
            });
        });
        return map;
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const {active, over} = event;

        if (over && active.id !== over.id) {
            setItems((prev) => {
                const origin = Object.keys(prev).find((key) =>
                    prev[key].some((item: any) => item.ID === active.id),
                )!;
                const destination = over.id;

                if (!origin || !destination || origin === destination) return prev;

                const movedItem = prev[origin].find(
                    (item: any) => item.ID === active.id,
                )!;

                return {
                    ...prev,
                    [origin]: prev[origin].filter((item: any) => item.ID !== active.id),
                    [destination]: [...prev[destination], movedItem],
                };
            });
        }
    };

    return (
        <div style={{margin: 5, padding: 25}}>
            <DataTable
                columns={columns}
                data={data}
                rowSelection={rowSelection}
                setRowSelection={setRowSelection}
            />
            <Card
                style={{
                    width: "100%",
                    textAlign: "center",
                    marginTop: 5,
                }}
            >
                <ChartContainer
                    style={{
                        height: "20vh",
                        width: "100%",
                        padding: 10,
                        justifyContent: "center",
                    }}
                    config={chartConfig}
                >
                    <LineChart accessibilityLayer data={lastSelectedRows}>
                        <CartesianGrid vertical={false}/>
                        <XAxis/>
                        <YAxis/>
                        <ChartTooltip content={<ChartTooltipContent/>}/>
                        <ChartLegend/>
                        <Line
                            dataKey="PowerCapacity"
                            type="monotone"
                            stroke="var(--color-powercapacity)"
                            strokeWidth={2}
                            dot={false}
                        />
                        <Line
                            dataKey="PowerProduction"
                            type="monotone"
                            stroke="var(--color-powerproduction)"
                            strokeWidth={2}
                            dot={false}
                        />
                        <Line
                            dataKey="PowerConsumed"
                            type="monotone"
                            stroke="var(--color-powerconsumed)"
                            strokeWidth={2}
                            dot={false}
                        />
                        <Line
                            dataKey="PowerMaxConsumed"
                            type="monotone"
                            stroke="var(--color-powermaxconsumed)"
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ChartContainer>
            </Card>
            {/*<Card className={"mt-[5px]"}>*/}
            {/*  <CardContent className={"m-[24]"}>*/}
            {/*    <DndContext*/}
            {/*      onDragEnd={handleDragEnd}*/}
            {/*      modifiers={[restrictToWindowEdges]}*/}
            {/*    >*/}
            {/*      <div className="flex w-full">*/}
            {/*        <div className="grid grid-rows-2 grid-cols-4 gap-2 grow">*/}
            {/*          {Object.entries(items)*/}
            {/*            .filter(([priority]) => priority !== "undefined")*/}
            {/*            .map(([priority, itemList]) => (*/}
            {/*              <Card key={priority}>*/}
            {/*                <CardHeader>*/}
            {/*                  <CardTitle>*/}
            {/*                    {priority*/}
            {/*                      .replace("-", " ")*/}
            {/*                      .replace(/^./, (str) => str.toUpperCase())}*/}
            {/*                  </CardTitle>*/}
            {/*                </CardHeader>*/}
            {/*                <CardContent>*/}
            {/*                  <Droppable id={priority}>*/}
            {/*                    {itemList.map((item: any) => (*/}
            {/*                      <Draggable key={item.ID} id={item.ID}>*/}
            {/*                        {item.SwitchTag ? item.SwitchTag : item.ID}*/}
            {/*                      </Draggable>*/}
            {/*                    ))}*/}
            {/*                  </Droppable>*/}
            {/*                </CardContent>*/}
            {/*              </Card>*/}
            {/*            ))}*/}
            {/*        </div>*/}

            {/*        <Card className="ml-2 min-w-[150px]">*/}
            {/*          <CardHeader>*/}
            {/*            <CardTitle>Undefined</CardTitle>*/}
            {/*          </CardHeader>*/}
            {/*          <CardContent>*/}
            {/*            <Droppable id={"undefined"}>*/}
            {/*              {items["undefined"].map((item: any) => (*/}
            {/*                <Draggable key={item.ID} id={item.ID}>*/}
            {/*                  {item.SwitchTag ? item.SwitchTag : item.ID}*/}
            {/*                </Draggable>*/}
            {/*              ))}*/}
            {/*            </Droppable>*/}
            {/*          </CardContent>*/}
            {/*        </Card>*/}
            {/*      </div>*/}
            {/*    </DndContext>*/}
            {/*    <div className="mt-4 text-center">*/}
            {/*      <Button*/}
            {/*        onClick={() => {*/}
            {/*          const result = getPriorityMap();*/}
            {/*          console.log("Switch priority mapping:", result);*/}
            {/*          // TODO: Add logic for the setSwitch part*/}
            {/*        }}*/}
            {/*      >*/}
            {/*        Save Priorities*/}
            {/*      </Button>*/}
            {/*    </div>*/}
            {/*  </CardContent>*/}
            {/*</Card>*/}
        </div>
    );
}
