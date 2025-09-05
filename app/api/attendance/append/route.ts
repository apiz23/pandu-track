// app/api/attendance/append/route.ts
import { NextResponse } from "next/server";
import { getActiveSession } from "@/lib/getActiveSession";
import supabase from "@/lib/supabase";

export async function POST(req: Request) {
    try {
        const { matric, session: submittedSession } = await req.json();

        if (!matric) {
            return NextResponse.json(
                { success: false, error: "Missing matric number" },
                { status: 400 }
            );
        }

        // 1️⃣ Detect active session
        const activeSession = getActiveSession();
        if (!activeSession) {
            return NextResponse.json(
                { success: false, error: "No active session at this time" },
                { status: 403 }
            );
        }

        // 2️⃣ Validate submitted session
        if (
            submittedSession.trim().toLowerCase() !==
            activeSession.trim().toLowerCase()
        ) {
            return NextResponse.json(
                {
                    success: false,
                    error: `You can only check in during the active session: ${activeSession}`,
                },
                { status: 403 }
            );
        }

        // 3️⃣ Check if matric is registered
        const { data: registered, error: regErr } = await supabase
            .from("pandu_std_registered")
            .select("matric_no")
            .eq("matric_no", matric.toUpperCase().trim())
            .maybeSingle();

        if (regErr) {
            console.error("Supabase error:", regErr);
            return NextResponse.json(
                { success: false, error: "Database error" },
                { status: 500 }
            );
        }

        if (!registered) {
            return NextResponse.json(
                { success: false, error: "Matric not registered" },
                { status: 403 }
            );
        }

        // 4️⃣ Check if already submitted
        const { data: existing } = await supabase
            .from("pandu_track")
            .select("matric_no")
            .eq("matric_no", matric.toUpperCase().trim())
            .eq("session", activeSession)
            .maybeSingle();

        if (existing) {
            return NextResponse.json(
                {
                    success: false,
                    error: `Attendance already recorded for ${activeSession}`,
                },
                { status: 403 }
            );
        }

        // 5️⃣ Insert attendance
        const { error: insertErr } = await supabase.from("pandu_track").insert({
            matric_no: matric.toUpperCase().trim(),
            session: activeSession,
            timestamp: new Date(),
        });

        if (insertErr) {
            console.error("Insert error:", insertErr);
            return NextResponse.json(
                { success: false, error: "Failed to record attendance" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: `Attendance recorded for ${activeSession}`,
            matric: matric.toUpperCase().trim(),
            timestamp: new Date().toISOString(),
        });
    } catch (err) {
        console.error("Error:", err);
        return NextResponse.json(
            { success: false, error: "Unexpected error" },
            { status: 500 }
        );
    }
}
