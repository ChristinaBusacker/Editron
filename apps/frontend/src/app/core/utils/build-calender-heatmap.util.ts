import { startOfWeek, getISOWeek, getDay, format, parseISO } from 'date-fns';

export type HeatmapCell = {
  name: string;
  value: number;
};

export type HeatmapWeek = {
  name: string;
  series: HeatmapCell[];
};

export function buildCalendarHeatmap(
  changesByDate: Record<string, number>,
): HeatmapWeek[] {
  const weeks: Record<string, Record<string, number>> = {};

  Object.entries(changesByDate).forEach(([dateStr, count]) => {
    const date = parseISO(dateStr);
    const isoWeek = getISOWeek(date);
    const weekKey = `KW ${isoWeek}`;

    const dayName = format(date, 'EEE'); // Mon, Tue, ..., Sun

    if (!weeks[weekKey]) {
      weeks[weekKey] = {};
    }

    weeks[weekKey][dayName] = count;
  });

  return Object.entries(weeks).map(([week, series]) => ({
    name: week,
    series: [
      { name: 'Mon', value: series['Mon'] || 0 },
      { name: 'Tue', value: series['Tue'] || 0 },
      { name: 'Wed', value: series['Wed'] || 0 },
      { name: 'Thu', value: series['Thu'] || 0 },
      { name: 'Fri', value: series['Fri'] || 0 },
      { name: 'Sat', value: series['Sat'] || 0 },
      { name: 'Sun', value: series['Sun'] || 0 },
    ],
  }));
}
