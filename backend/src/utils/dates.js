import moment from 'moment';


export const isStringTimeValid = (stringTime) => {
  let isValid = false;
  if (typeof stringTime === 'string' && stringTime.split(':').length === 2) {
    const h = +stringTime.split(':')[0];
    const m = +stringTime.split(':')[1];
    isValid = Number.isInteger(h) && Number.isInteger(m) && h >= 0 && h < 24 && m >= 0 && m < 60;
  }
  return isValid;
};

export const stringTimeToMinutes = (stringTime) => {
  if (!isStringTimeValid(stringTime)) {
    throw new Error('invalid string time provided to stringTimeToMinutes', stringTime);
  }
  return +stringTime.split(':')[0] * 60 + stringTime.split(':')[1];
};

export const isStringTimeStrictlyBefore = (t1, t2) => {
  if (!isStringTimeValid(t1) || !isStringTimeValid(t2)) {
    throw new Error('invalid string time provided to isStringTimeStrictlyBefore', t1, '-' , t2);
  }

  return +t1.split(':')[0] < +t2.split(':')[0] ||
    (+t1.split(':')[0] === +t2.split(':')[0] && +t1.split(':')[1] < +t2.split(':')[1]);
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

export const parseTime = (stringTime) => moment(0).add(+stringTime.split(':')[0], 'h').add(+stringTime.split(':')[1], 'm');
