import moment from 'moment';

export const isValidPeriod = (period) => moment(period.startAt).isValid() &&
  (moment(period.endAt).isValid() || !period.endAt) &&
  (moment(period.startAt).startOf('day').isSameOrBefore(moment(period.endAt).startOf('day')) || !period.endAt)
  ;

export const periodsOverlap = (periods) => {
  if (!Array.isArray(periods) || !periods.every(isValidPeriod)) {
    return;
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
