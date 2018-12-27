import moment from 'moment';

export const minutesToTimeText = (minutes) => {
  let text = `${minutes / 60}h${minutes % 60}`;
  if (minutes / 60 < 10) {
    text = '0'+text;
  }
  return text;
};

export const getReadableTimeBetween = (t1, t2) => {
  const minutesDiff = moment(t1).diff(moment(t2), 'minutes');
  let result = '';
  if (minutesDiff > 59) {
    result += Math.floor(minutesDiff / 60) > 1 ? `${Math.floor(minutesDiff / 60)} heures et ` : `${Math.floor(minutesDiff / 60)} heure et `
  }
  result += minutesDiff % 60 > 1 ? `${minutesDiff % 60} minutes` : `${minutesDiff % 60} minute`;

  return result;
};

export const isValidPeriod = (period) => moment(period.startAt).isValid() &&
  (moment(period.endAt).isValid() || !period.endAt) &&
  (moment(period.startAt).startOf('day').isSameOrBefore(moment(period.endAt).startOf('day')) || !period.endAt)
  ;

export const periodsOverlap = (periods) => {
  if (!Array.isArray(periods) || !periods.every(isValidPeriod)) {
    return true;
  }
  let overlap = false;

  if (periods.filter(p => !p.endAt).length > 1) {
    overlap = true;
  } else {
    overallLoop:
    for (let i = 0; i < periods.length; i += 1) {
      for (let j = i + 1; j < periods.length; j += 1) {
        const startAtA = moment(periods[i].startAt);
        const endAtA = moment(periods[i].endAt || [99999,11,31]); // j'av c'est pas très beau
        const startAtB = moment(periods[j].startAt);
        const endAtB = moment(periods[j].endAt || [99999,11,31]);
        if (
          startAtA.isSame(startAtB) ||
          startAtA.isSame(endAtB) ||
          endAtA.isSame(startAtB) ||
          endAtA.isSame(endAtB) ||
          (startAtA.isAfter(startAtB) && startAtA.isBefore(endAtB)) ||
          (endAtA.isAfter(startAtB) && endAtA.isBefore(endAtB)) ||
          (startAtA.isBefore(startAtB) && endAtA.isAfter(endAtB)) ||
          (startAtB.isBefore(startAtA) && endAtB.isAfter(endAtA))
        ) {
          overlap = true;
          break overallLoop;
        }
      }
    }
  }

  return overlap;
};
