export function formatDuration(totalSeconds: number): string {
    totalSeconds = Math.floor(totalSeconds)
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}
