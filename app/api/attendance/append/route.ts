import { NextResponse } from "next/server";
import { google } from "googleapis";

function formatTimestamp(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${pad(date.getDate())}/${pad(
        date.getMonth() + 1
    )}/${date.getFullYear()} ${pad(date.getHours())}:${pad(
        date.getMinutes()
    )}:${pad(date.getSeconds())}`;
}

export async function POST(req: Request) {
    try {
        const { matric, session } = await req.json();

        if (!matric || !session) {
            return NextResponse.json(
                { success: false, error: "Missing matric or session" },
                { status: 400 }
            );
        }

        const auth = new google.auth.JWT({
            email: process.env.GOOGLE_CLIENT_EMAIL,
            key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
            scopes: ["https://www.googleapis.com/auth/spreadsheets"],
        });

        const sheets = google.sheets({ version: "v4", auth });

        // 1️⃣ Fetch all matric numbers from "Form_responses!D:D"
        const registeredRes = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: "Form_responses!D:D", // Column D (matric numbers)
        });

        const registeredMatric =
            registeredRes.data.values
                ?.flat()
                .map((m) => m.toString().toUpperCase()) || [];

        // 2️⃣ Check if submitted matric exists
        if (!registeredMatric.includes(matric.toUpperCase())) {
            return NextResponse.json(
                { success: false, error: "Matric not registered" },
                { status: 403 }
            );
        }

        // 3️⃣ If exists, record attendance
        const timestamp = formatTimestamp(new Date());

        await sheets.spreadsheets.values.append({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: "pandu_tracking!A:C",
            valueInputOption: "RAW",
            requestBody: {
                values: [[matric.toUpperCase(), session, timestamp]],
            },
        });

        return NextResponse.json({
            success: true,
            message: "Attendance recorded",
            timestamp,
        });
    } catch (error) {
        console.error("Google Sheets append error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to record attendance" },
            { status: 500 }
        );
    }
}
