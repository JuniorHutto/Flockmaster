// Average sheep gestation length in days
export const GESTATION_DAYS = 146;

// Returns the expected lambing date (YYYY-MM-DD) for a breeding date (YYYY-MM-DD).
// Uses UTC math so the result doesn't shift a day due to local timezone.
export const calculateDueDate = (breedingDate: string): string => {
  if (!breedingDate) return '';
  const date = new Date(`${breedingDate}T00:00:00Z`);
  if (isNaN(date.getTime())) return '';
  date.setUTCDate(date.getUTCDate() + GESTATION_DAYS);
  return date.toISOString().split('T')[0];
};

// Whole days from today until the given date (negative if past).
export const daysUntil = (dateStr: string): number => {
  const today = new Date();
  const todayUtc = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  const target = new Date(`${dateStr}T00:00:00Z`).getTime();
  return Math.round((target - todayUtc) / (1000 * 60 * 60 * 24));
};
