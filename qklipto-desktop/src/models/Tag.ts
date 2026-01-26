export interface Tag {
    id: string;
    name: string;
    color: string;
    userId?: string; // For future multi-user support
}

export const TAG_COLORS = [
    "#4CAF50", "#2196F3", "#9C27B0", "#FF5722",
    "#FFC107", "#009688", "#3DDC84", "#607D8B"
];

export const createTag = (name: string, color?: string): Tag => ({
    id: crypto.randomUUID(),
    name,
    color: color || TAG_COLORS[Math.floor(Math.random() * TAG_COLORS.length)]
});
