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
            <main className="min-h-screen flex items-center justify-center px-4 py-8 bg-gray-900 relative overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-900 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-900 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
                <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-indigo-900 rounded-full filter blur-3xl opacity-20 animate-blob"></div>

                <Card className="w-full max-w-md shadow-2xl rounded-xl overflow-hidden border border-gray-800 backdrop-blur-md bg-gray-800/80 relative z-10">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-600 to-blue-600"></div>

                    <CardHeader className="pb-4 pt-8">
                        <div className="flex justify-center mb-4">
                            <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-4 rounded-2xl shadow-lg">
                                <Calendar className="h-8 w-8 text-white" />
                            </div>
                        </div>
                        <CardTitle className="text-2xl font-bold text-center text-white">
                            Program Anjakan Minda Keusahawanan Graduan {"("}
                            PANDU{")"}
                        </CardTitle>
                        <CardDescription className="text-center text-gray-400 mt-2">
                            Enter your details to check in for the event
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-2 pb-6">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Matric Input */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="matric"
                                    className="text-sm font-medium text-gray-300 flex items-center"
                                >
                                    <User className="h-4 w-4 mr-2 text-purple-400" />
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
                                    className="w-full rounded-lg border-gray-700 bg-gray-900 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 px-4 py-3 transition-all"
                                    disabled={loading}
                                />
                            </div>

                            {/* Session Selector */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-300 flex items-center">
                                    <Clock className="h-4 w-4 mr-2 text-purple-400" />
                                    Session
                                </Label>
                                <Select
                                    value={session}
                                    onValueChange={(value) => setSession(value)}
                                    disabled={loading}
                                >
                                    <SelectTrigger className="w-full rounded-lg border-gray-700 bg-gray-900 text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 px-4 py-3 transition-all">
                                        <SelectValue placeholder="Select a session" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-900 border-gray-800 text-white">
                                        <SelectItem
                                            value="AM Break"
                                            className="focus:bg-gray-800"
                                        >
                                            AM Break
                                        </SelectItem>
                                        <SelectItem
                                            value="Lunch Break"
                                            className="focus:bg-gray-800"
                                        >
                                            Lunch Break
                                        </SelectItem>
                                        <SelectItem
                                            value="PM Break"
                                            className="focus:bg-gray-800"
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
                                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg py-3 font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
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

                        <p className="text-xs text-center text-gray-500 mt-6">
                            Your attendance will be recorded instantly upon
                            submission
                        </p>
                    </CardContent>
                </Card>
            </main>
        </>
    );
}
