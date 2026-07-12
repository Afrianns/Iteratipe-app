// conver in durations (week/weeks and day/days)

export function formatFlexibleDuration(startStr: string, endStr: string): string {
  if (!startStr || !endStr) return "0 Day";

  const startTime = new Date(startStr).getTime();
  const endTime = new Date(endStr).getTime();
  
  // Get absolute difference in days
  const diffInMs = Math.abs(endTime - startTime);
  const totalDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));

  // 1. If it's less than a full week, return just the days string
  if (totalDays < 7) {
    return totalDays === 1 ? "1 Day" : `${totalDays} Days`;
  }

  // 2. If it's a week or more, convert to a single-decimal week value
  const totalWeeks = (totalDays / 7).toFixed(1);
  
  // Clean up clean integers (e.g., change "2.0 weeks" to "2 weeks")
  const formattedWeeks = totalWeeks.endsWith(".0") 
    ? totalWeeks.split(".")[0] 
    : totalWeeks;

  return formattedWeeks === "1" ? "1 Week" : `${formattedWeeks} Weeks`;
}