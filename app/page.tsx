"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Loader2, Calendar, User, Clock } from "lucide-react";
import { Typeession, sessions } from "@/config/session";
import confetti from "canvas-confetti";

export default function Home() {
    const [matric, setMatric] = useState("");
    const [session, setSession] = useState("AM Break");
    const [loading, setLoading] = useState(false);

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
                colors: colors,
            });
            confetti({
                particleCount: 2,
                angle: 120,
                spread: 55,
                startVelocity: 60,
                origin: { x: 1, y: 0.5 },
                colors: colors,
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

        setLoading(true);

        const submitPromise = fetch("/api/attendance/append", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ matric, session }),
        }).then(async (res) => {
            const data = await res.json();

            if (!res.ok) {
                if (
                    res.status === 403 &&
                    data.error === "Matric not registered"
                ) {
                    throw new Error(
                        "Your matric number is not registered for this event"
                    );
                } else {
                    throw new Error(
                        data.error || "Failed to record attendance"
                    );
                }
            }

            // ✅ Reset input and trigger confetti
            setMatric("");
            triggerConfetti();

            return { matric };
        });

        toast.promise(submitPromise, {
            loading: "Recording attendance...",
            success: (data) => `Attendance for ${data.matric} recorded ✅`,
            error: (err: unknown) => {
                if (err instanceof Error) return err.message;
                return "Error recording attendance ❌";
            },
        });

        submitPromise.finally(() => setLoading(false));
    };

    return (
        <main className="h-screen flex justify-center px-3 sm:px-4 py-28 relative overflow-hidden">
            <Card className="w-full h-fit max-w-sm sm:max-w-md md:max-w-lg shadow-2xl rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700 bg-white dark:bg-neutral-800 relative z-10 p-4 sm:p-6 transition-colors text-[13px] sm:text-[15px]">
                <CardHeader className="pb-4">
                    <div className="flex justify-center mb-3">
                        <div className="p-2 rounded-lg border border-gray-300 dark:border-white/30 bg-gray-100 dark:bg-black transition-colors">
                            <Calendar className="h-7 w-7 text-gray-700 dark:text-white" />
                        </div>
                    </div>
                    <CardTitle className="text-base sm:text-lg md:text-2xl font-bold text-center">
                        Program Anjakan Minda Keusahawanan Graduan (PANDU)
                    </CardTitle>
                    <CardDescription className="text-center text-gray-600 dark:text-gray-400 mt-1 transition-colors">
                        Enter your details to check in for the event
                    </CardDescription>
                </CardHeader>

                <CardContent className="pt-2 pb-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Matric Input */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="matric"
                                className="text-sm font-medium text-gray-900 dark:text-white flex items-center transition-colors"
                            >
                                <User className="h-4 w-4 mr-2 text-gray-700 dark:text-white" />
                                Matric Number
                            </Label>
                            <Input
                                id="matric"
                                type="text"
                                value={matric}
                                onChange={(e) =>
                                    setMatric(e.target.value.toUpperCase())
                                }
                                placeholder="e.g., A12345"
                                className="w-full rounded-md border-gray-300 dark:border-white/30 bg-white dark:bg-black text-gray-900 dark:text-white focus:ring-2 focus:ring-black/50 dark:focus:ring-white/50 focus:border-black dark:focus:border-white px-3 py-2 transition-all"
                                disabled={loading}
                            />
                        </div>

                        {/* Session Selector */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-900 dark:text-white flex items-center transition-colors">
                                <Clock className="h-4 w-4 mr-2 text-gray-700 dark:text-white" />
                                Session
                            </Label>
                            <Select
                                value={session}
                                onValueChange={(value) => setSession(value)}
                                disabled={loading}
                            >
                                <SelectTrigger className="w-full rounded-md border-gray-300 dark:border-white/30 bg-white dark:bg-black text-gray-900 dark:text-white focus:ring-2 focus:ring-black/50 dark:focus:ring-white/50 focus:border-black dark:focus:border-white px-3 py-2 transition-all">
                                    <SelectValue placeholder="Select a session" />
                                </SelectTrigger>
                                <SelectContent className="bg-white dark:bg-black border-gray-300 dark:border-white/30 text-gray-900 dark:text-white">
                                    {sessions.map((s: Typeession) => (
                                        <SelectItem
                                            key={s.value}
                                            value={s.value}
                                        >
                                            {s.label} ({s.start} - {s.end})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black dark:bg-white text-white dark:text-black rounded-md py-2 font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 border border-black dark:border-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
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

                    <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4 transition-colors">
                        Your attendance will be recorded instantly upon
                        submission
                    </p>
                </CardContent>
            </Card>
        </main>
    );
}
