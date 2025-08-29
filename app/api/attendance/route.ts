import { NextResponse } from "next/server";

const SHEET_URL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vQolEhEVrIOHM0nTGmLTNr6QbqENWqsO2hxvzMn-z0LwNcUVh6lhD3qQMLBUfwVdxz2HnBkgKxENz3T/pub?gid=401813346&single=true&output=csv";

// GET: Fetch attendance records
export async function GET() {
    try {
        const res = await fetch(SHEET_URL, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch sheet data");

        const csv = await res.text();
        const rows = csv
            .split("\n")
            .map((r) => r.split(",").map((c) => c.trim()));

        return NextResponse.json({ rows });
    } catch (err) {
        console.error("Google Sheets GET error:", err);
        return NextResponse.json(
            { error: "Failed to fetch attendance" },
            { status: 500 }
        );
    }
}
