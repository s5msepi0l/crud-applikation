// is date less than 23 hours and 45 minutes 
export function dateCmp(date: string) {
    const takenDate = new Date(date.replace(" ", "T"));
    const now = new Date();

    const difference = now.getTime() - takenDate.getTime();
    const time = (23 * 60 + 45) * 60 * 1000;

    return difference < time;
}