export type Typeession = {
    value: string;
    label: string;
    start: string;
    end: string;
};

export const sessions: Typeession[] = [
    {
        value: "AM Break",
        label: "AM Break",
        start: "10:45",
        end: "11:45",
    },
    {
        value: "Lunch Break",
        label: "Lunch Break",
        start: "14:00",
        end: "15:00",
    },
    {
        value: "PM Break",
        label: "PM Break",
        start: "16:00",
        end: "17:00",
    },
];
