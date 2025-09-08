"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Loader2, User, Clock, CheckCircle } from "lucide-react";
import { Typeession, sessions } from "@/config/session";
import confetti from "canvas-confetti";
import Image from "next/image";
import { ChartPie } from "@/components/chart-pi";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Lenis from "@studio-freight/lenis";
import { getActiveSession } from "@/lib/getActiveSession";

export default function Home() {
    const [matric, setMatric] = useState("");
    const [loading, setLoading] = useState(false);
    const [activeSession, setActiveSession] = useState<Typeession | null>(null);

    const parseTime = (time: string) => {
        const [h, m] = time.split(":").map(Number);
        const now = new Date();
        now.setHours(h, m, 0, 0);
        return now;
    };

    useEffect(() => {
        const lenis = new Lenis();
        lenis.on("scroll", ScrollTrigger.update);

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);
        gsap.registerPlugin(ScrollTrigger);
    }, []);

    useEffect(() => {
        const checkActive = () => {
            const sessionValue = getActiveSession();
            const found = sessions.find((s) => s.value === sessionValue) || null;
            setActiveSession(found);
        };
    
        checkActive();
        const interval = setInterval(checkActive, 60 * 1000);
        return () => clearInterval(interval);
    }, []);
    

    const triggerConfetti = () => {
        const end = Date.now() + 3 * 1000;
        const colors = ["#FFD700", "#C0C0C0", "#FFFFFF", "#D3D3D3"];

        const frame = () => {
            if (Date.now() > end) return;
            confetti({
                particleCount: 2,
                angle: 60,
                spread: 55,
                startVelocity: 60,
                origin: { x: 0, y: 0.5 },
                colors,
            });
            confetti({
                particleCount: 2,
                angle: 120,
                spread: 55,
                startVelocity: 60,
                origin: { x: 1, y: 0.5 },
                colors,
            });
            requestAnimationFrame(frame);
        };
        frame();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!matric.trim()) {
            toast.error("Please enter your matric number");
            return;
        }
        if (!activeSession) {
            toast.error("No active session right now");
            return;
        }

        setLoading(true);

        const submitPromise = fetch("/api/attendance/append", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ matric, session: activeSession.value }),
        }).then(async (res) => {
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to record attendance");
            }

            setMatric("");
            triggerConfetti();
            return { matric };
        });

        toast.promise(submitPromise, {
            loading: "Recording attendance...",
            success: (data) => `Attendance for ${data.matric} recorded ✅`,
            error: (err: unknown) =>
                err instanceof Error
                    ? err.message
                    : "Error recording attendance ❌",
        });

        submitPromise.finally(() => setLoading(false));
    };

    return (
        <>
            <section className="flex-1 flex md:items-center justify-center px-6 md:px-0 py-14">
                <Card className="w-full h-fit max-w-md md:max-w-lg shadow-2xl rounded-xl overflow-hidden border-0 outline-2 bg-gradient-to-tr from-blue-400/20 via-purple-400/15 to-pink-400/10 dark:from-blue-900/30 dark:via-neutral-900/45 dark:to-neutral-800/20 backdrop-blur-sm relative z-10 p-2 sm:p-6 transition-all">
                    <CardHeader className="text-center">
                        <div className="flex justify-center my-5">
                            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 dark:bg-black/20 backdrop-blur-md shadow-lg dark:shadow-purple-500/5 transition-all duration-300 min-w-[90%] min-h-40 outline-2 outline-yellow-400">
                                <Image
                                    src="/pandu-logo.png"
                                    alt="PANDU Tracker Logo"
                                    fill
                                    className="rounded-lg object-fill"
                                />
                            </div>
                        </div>
                        <CardTitle className=" text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-tr from-yellow-800 via-yellow-500 to-yellow-400 dark:from-neutral-200 dark:via-yellow-200 dark:to-yellow-700 bg-clip-text text-transparent">
                            Program Anjakan Minda Keusahawanan Graduan
                        </CardTitle>
                        <CardDescription className="text-center text-gray-600 dark:text-gray-300 mt-3 transition-colors font-medium">
                            (PANDU)
                        </CardDescription>
                        <CardDescription className="text-center text-gray-500 dark:text-gray-400 mt-1 text-sm transition-colors">
                            For{" "}
                            <span className="font-semibold">
                                UTHM students only
                            </span>
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-2 pb-4">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Matric Input */}
                            <div className="space-y-2.5">
                                <Label
                                    htmlFor="matric"
                                    className="flex items-center text-sm font-medium text-gray-900 dark:text-white pl-1"
                                >
                                    <User className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                                    Matric Number
                                </Label>
                                <Input
                                    id="matric"
                                    type="text"
                                    value={matric}
                                    onChange={(e) =>
                                        setMatric(e.target.value.toUpperCase())
                                    }
                                    placeholder="e.g., DI230052"
                                    disabled={loading}
                                    className="py-5 px-4 rounded-xl border-gray-300 dark:border-gray-600 focus-visible:ring-blue-500 focus-visible:ring-2 transition-all bg-white/80 dark:bg-neutral-900/90 backdrop-blur-sm"
                                />
                            </div>

                            {/* Active Session */}
                            <div className="space-y-2.5">
                                <Label className="flex items-center text-sm font-medium text-gray-900 dark:text-white pl-1">
                                    <Clock className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                                    Current Session
                                </Label>
                                <div
                                    className={`px-4 py-3 border rounded-xl ${
                                        activeSession
                                            ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                                            : "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                                    } transition-colors flex items-center`}
                                >
                                    {activeSession ? (
                                        <>
                                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                                            <div>
                                                <span className="font-medium text-green-700 dark:text-green-400">
                                                    {activeSession.label}
                                                </span>
                                                <span className="text-gray-600 dark:text-gray-300 ml-2">
                                                    ({activeSession.start} -{" "}
                                                    {activeSession.end})
                                                </span>
                                            </div>
                                        </>
                                    ) : (
                                        <span className="text-gray-600 dark:text-gray-300">
                                            No active session at this time
                                        </span>
                                    )}
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={loading || !activeSession}
                                className="w-full"
                                variant="outline"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    "Submit Attendance"
                                )}
                            </Button>
                        </form>

                        {/* Footer note */}
                        <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-6">
                            Your attendance will be recorded for the current
                            active session
                        </p>
                    </CardContent>
                </Card>
            </section>
            <section className="min-h-screen flex items-center justify-center">
                <div className="w-full max-w-4xl px-4">
                    <ChartPie />
                </div>
            </section>
        </>
    );
}
