// lib/getActiveSession.ts
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
    const now = new Date();
    const current = now.toTimeString().slice(0, 5); // HH:MM

    for (const session of sessions) {
        if (isWithinTimeRange(current, session.start, session.end)) {
            return session.value;
        }
    }

    return null;
}
