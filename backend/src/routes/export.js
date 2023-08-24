import moment from 'moment';
import XLSX from 'xlsx';
import { v4 as uuidv4 } from 'uuid';
import Urlify from 'urlify';
import router from '../koa-router';
import db from '../db';
import { authRequired } from '../utils/auth';
import config from '../config';

const urlify = Urlify.create({
  spaces: '',
  toLower: true,
  nonPrintable: '',
  trim: true,
});

router.get('/export', authRequired(['admin'], async (ctx, next, { admin }) => {
  const fileName = `${uuidv4()}.xlsx`;
  let workbook = XLSX.utils.book_new();

  const school = await db.School.findOne({
    where: { id: admin.schoolId },
    include: [{
      model: db.SpecialSchoolDay,
      as: 'specialSchoolDays',
    }, {
      model: db.SchoolYear,
      as: 'schoolYears',
      order: [['startAt', 'ASC']],
      include: [{
        model: db.SchoolYearSettings,
        as: 'schoolYearSettings',
        order: [['startAt', 'ASC']],
        separate: true, // Avoiding truncated attribute keys https://github.com/sequelize/sequelize/issues/2084
        include: [{
          model: db.UsualOpenedDays,
          as: 'usualOpenedDays',
        }],
      }],
    }],
  });

  const specialSchoolDays = await db.SpecialSchoolDay.findAll({
    where: { schoolId: admin.schoolId },
    order: [['day', 'asc']],
  });

  const settingsData = [];
  school.schoolYears.forEach((sy) => {
    settingsData.push(['Année', `Du ${moment(sy.startAt).format('DD/MM/YYYY')}`, `Au ${new Date(sy.endAt) || 'à définir'}`, `${sy.nbOfDaysOfHolidays} jours de vacances`]);
    sy.schoolYearSettings.forEach((sys) => {
      settingsData.push(['Du', 'Au', 'Jours', 'Ouvre à', 'Ferme à', 'Retard après', 'AbsP. en dessous de', 'AbsT. en dessous de']);
      sys.usualOpenedDays.forEach((uod) => {
        settingsData.push([new Date(sys.startAt), new Date(sys.endAt) || 'à définir', uod.days.join(', '), uod.openAt, uod.closeAt, uod.maxArrivalTime, uod.minTimeBefPartialAbsence, uod.minTimeBefTotalAbsence]);
      });
    });
    settingsData.push([]);
  });

  settingsData.push(["Jours d'école modifiés"]);
  settingsData.push(['Le', 'Status', 'Ouvre à', 'Ferme à', 'Retard après', 'AbsP. en dessous de', 'AbsT. en dessous de', 'note']);
  specialSchoolDays.forEach((ssd) => {
    if (ssd.isClosed) {
      settingsData.push([new Date(ssd.day), 'Fermée']);
    } else {
      settingsData.push([new Date(ssd.day), 'Ouverte', ssd.openAt, ssd.closeAt, ssd.maxArrivalTime, ssd.minTimeBefPartialAbsence, ssd.minTimeBefTotalAbsence, ssd.note]);
    }
  });


  const worksheetSettings = XLSX.utils.aoa_to_sheet(settingsData);
  XLSX.utils.book_append_sheet(workbook, worksheetSettings, 'Params.');

  let members = await db.Member.findAll({
    where: { schoolId: admin.schoolId },
    attributes: ['id', 'firstName', 'lastName'],
  });
  members = members.sort((m1, m2) => urlify(`${m1.firstName} ${m1.lastName}`) < urlify(`${m2.firstName} ${m2.lastName}`) ? -1 : 1);
  const membersMap = members.reduce((map, member) => map[member.id] = member, {});

  let today = moment().startOf('day');

  for (let schoolYear of school.schoolYears) {
    const from = moment(schoolYear.startAt).startOf('day');
    const to = schoolYear.endAt
      ? moment.min(moment(schoolYear.endAt).startOf('day'), today)
      : today;

    const indexFrom = moment(from);
    while (indexFrom.isSameOrBefore(to)) {
      const indexTo = moment.min(moment(indexFrom).endOf('month').startOf('day'), to);
      const membersDaysForThisMonth = await db.Member.getMembersDays(school.id, new Date(indexFrom), new Date(indexTo));
      const data = [['id', 'prénom', 'nom']];
      for (let dayIt = moment(indexFrom); dayIt.isSameOrBefore(indexTo); dayIt.add(1, 'day')) {
        data[0].push(dayIt.format('ddd DD/MM/YYYY'));
      }

      members.forEach((member) => {
        const newLine = [];
        const memberDays = membersDaysForThisMonth[member.id];
        if (memberDays) {
          data[0].forEach((cl) => {
            if (cl === 'id') {
              newLine.push(member.id);
            } else if (cl === 'prénom') {
              newLine.push(member.firstName);
            } else if (cl === 'nom') {
              newLine.push(member.lastName);
            } else if (memberDays[0] && cl === moment(memberDays[0].day).format('ddd DD/MM/YYYY')) {
              const thisDay = memberDays.shift();
              let sumUpDay = '';
              if (thisDay.dayType === 'dayOff') {
                sumUpDay += 'O';
              } else if (thisDay.dayType === 'holiday') {
                sumUpDay += 'V';
              } else {
                if (thisDay.delay) {
                  sumUpDay += thisDay.justifiedDelay ? 'RJ-' : 'R-';
                }
                if (thisDay.absence === 'total') {
                  sumUpDay += thisDay.justifiedAbsence ? 'AbsTJ' : 'AbsT';
                } else if (thisDay.absence === 'partial') {
                  sumUpDay += thisDay.justifiedAbsence ? 'AbsPJ' : 'AbsP';
                  sumUpDay += ` (${thisDay.arrivedAt} → ${thisDay.leftAt})`;
                } else if (!thisDay.absence) {
                  sumUpDay += 'P';
                  sumUpDay += ` (${thisDay.arrivedAt} → ${thisDay.leftAt})`;
                } else if (thisDay.absence === 'undefined') {
                  sumUpDay += '???';
                  sumUpDay += ` (${thisDay.arrivedAt} → ???)`;
                }
              }
              newLine.push(sumUpDay);
            } else {
              newLine.push('');
            }
          });
          if (memberDays.length > 0) {
            throw new Error('Incoherence des données !');
          }
          data.push(newLine);
        }
      });
      const worksheet = XLSX.utils.aoa_to_sheet(data);
      XLSX.utils.book_append_sheet(workbook, worksheet, indexFrom.format('MMM YY'));

      indexFrom.add(1, 'month').startOf('month');
    }
  }

  // const fileName = "writee.xlsx";
  // const data = [[1,2,3],[true, false, null, "sheetjs"],["foo","bar", new Date("2014-02-19T14:30Z"), "0.3"], ["baz", null, "qux"]];
  // const sheetName = "SheetJS";
  //
  // let ws = XLSX.utils.aoa_to_sheet(data);
  // XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(workbook, `src/public/exports/${fileName}`);

  ctx.body = {
    fileName: `dataa-${moment().format('DD-MM-YYYY')}.xlsx`,
    downloadUrl: `${config.apiEndpoint}/public/exports/${fileName}`,
  };
}));
