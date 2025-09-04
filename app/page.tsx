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
import { Loader2, Calendar, User, Clock, CheckCircle } from "lucide-react";
import { Typeession, sessions } from "@/config/session";
import confetti from "canvas-confetti";

export default function Home() {
    const [matric, setMatric] = useState("");
    const [loading, setLoading] = useState(false);
    const [activeSession, setActiveSession] = useState<Typeession | null>(null);

    // convert "HH:mm" ke Date hari ni
    const parseTime = (time: string) => {
        const [h, m] = time.split(":").map(Number);
        const now = new Date();
        now.setHours(h, m, 0, 0);
        return now;
    };

    // cari session aktif
    useEffect(() => {
        const checkActive = () => {
            const now = new Date();
            const found = sessions.find((s) => {
                const start = parseTime(s.start);
                const end = parseTime(s.end);
                return now >= start && now <= end;
            });
            setActiveSession(found || null);
        };

        checkActive();
        const interval = setInterval(checkActive, 60 * 1000); // check every minute
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
        <main className="min-h-screen flex justify-center px-3 sm:px-4 py-20 relative overflow-hidden">
            <Card className="w-full h-fit max-w-sm sm:max-w-md md:max-w-lg shadow-2xl rounded-xl overflow-hidden border-0 bg-white/80 dark:bg-neutral-900/90 backdrop-blur-sm relative z-10 p-4 sm:p-6 transition-all">
                <CardHeader className="pb-4 text-center">
                    <div className="flex justify-center mb-3">
                        <div className="p-3 rounded-xl border border-gray-200 dark:border-white/20 bg-white/50 dark:bg-black/50 shadow-sm transition-colors">
                            <Calendar className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                    <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-tr from-neutral-200 via-yellow-200 to-yellow-700 bg-clip-text text-transparent">
                        Program Anjakan Minda Keusahawanan Graduan
                    </CardTitle>
                    <div className="mt-2 text-sm text-indigo-400 dark:text-indigo-300 font-medium">
                        (PANDU)
                    </div>
                    <CardDescription className="text-center text-gray-600 dark:text-gray-300 mt-3 transition-colors">
                        Enter your matric number to check in for the event
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
                                placeholder="e.g., DI230066"
                                disabled={loading}
                                className="py-5 px-4 rounded-xl border-gray-300 dark:border-gray-600 focus-visible:ring-blue-500 focus-visible:ring-2 transition-all"
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
                        Your attendance will be recorded for the current active
                        session
                    </p>
                </CardContent>
            </Card>
        </main>
    );
}
