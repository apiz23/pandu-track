// app/api/attendance/append/route.ts
import { NextResponse } from "next/server";
import { google } from "googleapis";
import { getActiveSession } from "@/lib/getActiveSession";

function formatTimestamp(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${pad(date.getDate())}/${pad(
        date.getMonth() + 1
    )}/${date.getFullYear()} ${pad(date.getHours())}:${pad(
        date.getMinutes()
    )}:${pad(date.getSeconds())}`;
}

type AttendanceRequest = {
    matric: string;
    session: string;
};

export async function POST(req: Request) {
    try {
        const body = (await req.json()) as AttendanceRequest;
        const { matric, session: submittedSession } = body;

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

        // 3️⃣ Google Sheets Auth
        const auth = new google.auth.JWT({
            email: process.env.GOOGLE_CLIENT_EMAIL,
            key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
            scopes: ["https://www.googleapis.com/auth/spreadsheets"],
        });

        const sheets = google.sheets({ version: "v4", auth });

        // 4️⃣ Get registered matric numbers
        const registeredRes = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: "Form_responses!D:D", // Column D = matric
        });

        const registeredMatric =
            registeredRes.data.values
                ?.flat()
                .map((m) => m.toString().toUpperCase().trim()) || [];

        if (!registeredMatric.includes(matric.toUpperCase().trim())) {
            return NextResponse.json(
                { success: false, error: "Matric not registered" },
                { status: 403 }
            );
        }

        // 5️⃣ Append attendance record
        const timestamp = formatTimestamp(new Date());

        await sheets.spreadsheets.values.append({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: "pandu_tracking!A:C",
            valueInputOption: "RAW",
            requestBody: {
                values: [
                    [matric.toUpperCase().trim(), activeSession, timestamp],
                ],
            },
        });

        return NextResponse.json({
            success: true,
            message: `Attendance recorded for ${activeSession}`,
            matric: matric.toUpperCase().trim(),
            timestamp,
        });
    } catch (error: any) {
        console.error("Google Sheets append error:", error);

        return NextResponse.json(
            {
                success: false,
                error: error?.message || "Failed to record attendance",
            },
            { status: 500 }
        );
    }
}
