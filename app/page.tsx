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

export default function Home() {
    const [matric, setMatric] = useState("");
    const [session, setSession] = useState("AM Break");
    const [loading, setLoading] = useState(false);

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

            setMatric("");
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
        <>
            <main className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden">
                <Card className="w-full max-w-xl shadow-2xl rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700 bg-white dark:bg-neutral-800 relative z-10 p-6 transition-colors">
                    <div className="absolute inset-0 border border-gray-200 dark:border-white/10 rounded-lg pointer-events-none"></div>

                    <CardHeader className="pb-4 pt-8">
                        <div className="flex justify-center mb-4">
                            <div className="p-3 rounded-lg border border-gray-300 dark:border-white/30 bg-gray-100 dark:bg-black transition-colors">
                                <Calendar className="h-8 w-8 text-gray-700 dark:text-white" />
                            </div>
                        </div>
                        <CardTitle className="text-2xl font-bold text-center text-gray-900 dark:text-white transition-colors">
                            Program Anjakan Minda Keusahawanan Graduan {"("}
                            PANDU{")"}
                        </CardTitle>
                        <CardDescription className="text-center text-gray-600 dark:text-gray-400 mt-2 transition-colors">
                            Enter your details to check in for the event
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-2 pb-6">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Matric Input */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="matric"
                                    className="text-sm font-medium text-gray-900 dark:text-white flex items-center transition-colors"
                                >
                                    <User className="h-4 w-4 mr-2 text-gray-700 dark:text-white transition-colors" />
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
                                    className="w-full rounded-md border-gray-300 dark:border-white/30 bg-white dark:bg-black text-gray-900 dark:text-white focus:ring-2 focus:ring-black/50 dark:focus:ring-white/50 focus:border-black dark:focus:border-white px-4 py-3 transition-all"
                                    disabled={loading}
                                />
                            </div>

                            {/* Session Selector */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-900 dark:text-white flex items-center transition-colors">
                                    <Clock className="h-4 w-4 mr-2 text-gray-700 dark:text-white transition-colors" />
                                    Session
                                </Label>
                                <Select
                                    value={session}
                                    onValueChange={(value) => setSession(value)}
                                    disabled={loading}
                                >
                                    <SelectTrigger className="w-full rounded-md border-gray-300 dark:border-white/30 bg-white dark:bg-black text-gray-900 dark:text-white focus:ring-2 focus:ring-black/50 dark:focus:ring-white/50 focus:border-black dark:focus:border-white px-4 py-3 transition-all">
                                        <SelectValue placeholder="Select a session" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white dark:bg-black border-gray-300 dark:border-white/30 text-gray-900 dark:text-white">
                                        <SelectItem
                                            value="AM Break"
                                            className="focus:bg-gray-100 dark:focus:bg-white/10"
                                        >
                                            AM Break
                                        </SelectItem>
                                        <SelectItem
                                            value="Lunch Break"
                                            className="focus:bg-gray-100 dark:focus:bg-white/10"
                                        >
                                            Lunch Break
                                        </SelectItem>
                                        <SelectItem
                                            value="PM Break"
                                            className="focus:bg-gray-100 dark:focus:bg-white/10"
                                        >
                                            PM Break
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-black dark:bg-white text-white dark:text-black rounded-md py-3 font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 border border-black dark:border-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                size="lg"
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

                        <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-6 transition-colors">
                            Your attendance will be recorded instantly upon
                            submission
                        </p>
                    </CardContent>
                </Card>
            </main>
        </>
    );
}
