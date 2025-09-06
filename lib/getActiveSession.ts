import { sessions } from "@/config/session";

function isWithinTimeRange(current: string, start: string, end: string) {
    if (start <= end) {
        return current >= start && current <= end;
    } else {
        return current >= start || current <= end;
    }
}

export function getActiveSession(): string | null {
    const formatter = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Kuala_Lumpur",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });

    const now = new Date();
    const parts = formatter.formatToParts(now);

    const day = parts.find((p) => p.type === "day")?.value;
    const month = parts.find((p) => p.type === "month")?.value;
    const year = parts.find((p) => p.type === "year")?.value;

    const currentDate = `${day}/${month}/${year}`;

    if (currentDate !== "06/09/2025") {
        return null;
    }

    const currentTime = `${parts.find((p) => p.type === "hour")?.value}:${
        parts.find((p) => p.type === "minute")?.value
    }`;

    for (const session of sessions) {
        if (isWithinTimeRange(currentTime, session.start, session.end)) {
            return session.value;
        }
    }

    return null;
}
