"use client";

import * as React from "react";
import { Label, Pie, PieChart, Sector } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";
import { createClient } from "@supabase/supabase-js";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartStyle,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "./ui/button";
import { RefreshCcw } from "lucide-react";
import { getActiveSession } from "@/lib/getActiveSession";

// Supabase client
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const chartConfig = {
    participants: { label: "Participants" },
    S1: { label: "Session 1", color: "var(--chart-1)" },
    S2: { label: "Session 2", color: "var(--chart-2)" },
    S3: { label: "Session 3", color: "var(--chart-3)" },
    S4: { label: "Session 4", color: "var(--chart-4)" },
    Test: { label: "Test", color: "var(--chart-5)" },
} satisfies ChartConfig;

export function ChartPie() {
    const id = "pie-interactive-sessions";
    const [sessionData, setSessionData] = React.useState<
        { session: string; participants: number; fill: string }[]
    >([]);
    const [activeSession, setActiveSession] = React.useState("S1");
    const [loading, setLoading] = React.useState(false);

    const fetchData = React.useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("pandu_track")
            .select("session");
        if (error) {
            console.error(error);
            setLoading(false);
            return;
        }

        // Count participants
        const counts: Record<string, number> = {
            S1: 0,
            S2: 0,
            S3: 0,
            S4: 0,
            Test: 0,
        };
        data.forEach((row) => {
            if (counts[row.session] !== undefined) {
                counts[row.session]++;
            }
        });

        const formattedData = Object.entries(counts).map(
            ([session, count], i) => ({
                session,
                participants: count,
                fill: `var(--chart-${i + 1})`,
            })
        );

        setSessionData(formattedData);

        // set active session ikut masa semasa
        const currentSession = getActiveSession();
        if (currentSession) {
            setActiveSession(currentSession);
        } else {
            // fallback: pilih first session ada data
            const firstActive = formattedData.find((s) => s.participants > 0);
            if (firstActive) setActiveSession(firstActive.session);
        }

        setLoading(false);
    }, []);

    React.useEffect(() => {
        fetchData();
        // Auto refresh every 1 minute
        const interval = setInterval(() => {
            const currentSession = getActiveSession();
            if (currentSession) setActiveSession(currentSession);
        }, 60000);

        return () => clearInterval(interval);
    }, [fetchData]);

    const activeIndex = React.useMemo(
        () => sessionData.findIndex((item) => item.session === activeSession),
        [activeSession, sessionData]
    );
    const sessions = React.useMemo(
        () => sessionData.map((item) => item.session),
        [sessionData]
    );

    return (
        <Card
            data-chart={id}
            className="flex flex-col border-2 shadow-2xl rounded-2xl overflow-hidden relative transition-all duration-300 backdrop-blur-sm bg-gradient-to-br from-blue-400/20 via-purple-300/15 to-pink-400/10 dark:from-blue-900/30 dark:via-neutral-900/45 dark:to-neutral-800/20"
        >
            <ChartStyle id={id} config={chartConfig} />
            <CardHeader className="flex-row items-start space-y-0 pb-4 px-6 relative z-10">
                <div className="grid gap-1">
                    <CardTitle className="text-xl font-semibold text-card-foreground bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text">
                        Interactive Session Attendance
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                        PANDU Tracker - Participant distribution across sessions
                    </CardDescription>
                </div>
                <div className="ml-auto flex items-center gap-2 mt-4">
                    <Select
                        value={activeSession}
                        onValueChange={setActiveSession}
                    >
                        <SelectTrigger className="h-9 w-[140px] rounded-lg border border-gray-300/50 bg-white/80 shadow-sm transition-all hover:bg-white focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 backdrop-blur-sm dark:border-gray-600 dark:bg-gray-800/80 dark:hover:bg-gray-800/90 dark:focus:ring-blue-400/50 z-10">
                            <SelectValue placeholder="Select session" />
                        </SelectTrigger>
                        <SelectContent
                            align="end"
                            className="rounded-xl border bg-white/95 backdrop-blur-md dark:bg-gray-900/95 dark:border-gray-700 p-2 shadow-md"
                        >
                            {sessions.map((key) => {
                                const config =
                                    chartConfig[
                                        key as keyof typeof chartConfig
                                    ];
                                if (!config) return null;
                                return (
                                    <SelectItem
                                        key={key}
                                        value={key}
                                        className="rounded-lg py-2 [&_span]:flex transition-all hover:bg-blue-50/50 dark:hover:bg-blue-950/50"
                                    >
                                        <div className="flex items-center gap-2 text-xs">
                                            <span
                                                className="flex h-3 w-3 shrink-0 rounded-full shadow-sm"
                                                style={{
                                                    backgroundColor: `var(--chart-${
                                                        sessions.indexOf(key) +
                                                        1
                                                    })`,
                                                }}
                                            />
                                            {config?.label}
                                        </div>
                                    </SelectItem>
                                );
                            })}
                        </SelectContent>
                    </Select>

                    <Button
                        variant="outline"
                        size="icon"
                        onClick={fetchData}
                        disabled={loading}
                        className="rounded-lg"
                        title="Refresh data"
                    >
                        <RefreshCcw
                            className={`h-4 w-4 ${
                                loading ? "animate-spin" : ""
                            }`}
                        />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="flex flex-1 justify-center pb-6 px-6 relative z-10">
                <ChartContainer
                    id={id}
                    config={chartConfig}
                    className="mx-auto aspect-square w-full max-w-[300px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    hideLabel
                                    className="rounded-lg border bg-white/95 backdrop-blur-sm shadow-md px-3 py-2 dark:bg-gray-900/95 dark:border-gray-700"
                                />
                            }
                        />
                        <Pie
                            data={sessionData}
                            dataKey="participants"
                            nameKey="session"
                            innerRadius={60}
                            strokeWidth={5}
                            activeIndex={activeIndex}
                            activeShape={({
                                outerRadius = 0,
                                ...props
                            }: PieSectorDataItem) => (
                                <g>
                                    <Sector
                                        {...props}
                                        outerRadius={outerRadius + 10}
                                    />
                                    <Sector
                                        {...props}
                                        outerRadius={outerRadius + 25}
                                        innerRadius={outerRadius + 12}
                                    />
                                </g>
                            )}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (
                                        viewBox &&
                                        "cx" in viewBox &&
                                        "cy" in viewBox &&
                                        activeIndex >= 0
                                    ) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-3xl font-bold drop-shadow-sm"
                                                >
                                                    {sessionData[
                                                        activeIndex
                                                    ].participants.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground text-sm font-medium"
                                                >
                                                    {
                                                        chartConfig[
                                                            sessionData[
                                                                activeIndex
                                                            ]
                                                                .session as keyof typeof chartConfig
                                                        ]?.label
                                                    }
                                                </tspan>
                                            </text>
                                        );
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <div className="px-6 pb-4 relative z-10">
                <div className="flex flex-wrap justify-center gap-4 p-3 rounded-xl bg-gradient-to-r from-gray-100/50 to-gray-200/50 dark:from-gray-800/30 dark:to-gray-900/30 backdrop-blur-sm">
                    {sessionData.map((item, index) => (
                        <div
                            key={item.session}
                            className="flex items-center gap-1.5 transition-all hover:scale-105 px-2 py-1 rounded-lg bg-white/70 shadow-sm dark:bg-gray-800/70"
                            style={{
                                opacity:
                                    activeSession === item.session ? 1 : 0.8,
                            }}
                        >
                            <div
                                className="h-3 w-3 rounded-full shadow-sm"
                                style={{
                                    backgroundColor: `var(--chart-${
                                        index + 1
                                    })`,
                                }}
                            />
                            <span className="text-xs font-medium text-muted-foreground">
                                {
                                    chartConfig[
                                        item.session as keyof typeof chartConfig
                                    ]?.label
                                }
                                :
                            </span>
                            <span className="text-xs font-semibold text-foreground">
                                {item.participants}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
}
