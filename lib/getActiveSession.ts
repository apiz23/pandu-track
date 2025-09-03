import { sessions } from "@/config/session";

function isWithinTimeRange(current: string, start: string, end: string) {
    if (start <= end) {
        // Normal case (same day, e.g. 10:00 → 10:30)
        return current >= start && current <= end;
    } else {
        // Overnight case (e.g. 23:00 → 00:00)
        return current >= start || current <= end;
    }
}

export function getActiveSession(): string | null {
    // Force time to Malaysia (Asia/Kuala_Lumpur)
    const formatter = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Kuala_Lumpur",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });

    const current = formatter.format(new Date()); // "HH:MM"

    for (const session of sessions) {
        if (isWithinTimeRange(current, session.start, session.end)) {
            return session.value;
        }
    }

    return null;
}
